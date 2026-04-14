import { beforeEach, describe, expect, it, vi } from "vitest";
import { isRateLimited } from "../../../utils/rateLimitByIp";
import { POST } from "../feedback";

vi.mock("../../../utils/rateLimitByIp", () => ({
  isRateLimited: vi.fn().mockResolvedValue(false),
}));

const makeDb = () =>
  ({
    prepare: vi.fn().mockReturnValue({
      bind: vi.fn().mockReturnValue({
        run: vi.fn().mockResolvedValue({}),
      }),
    }),
  }) as unknown as D1Database;

type CfGeo = { country?: string; region?: string; city?: string };

const makeRequest = (
  body: unknown,
  headers: Record<string, string> = {},
  cf?: CfGeo,
) =>
  Object.assign(
    new Request("http://localhost/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://namesake.fyi",
        ...headers,
      },
      body: JSON.stringify(body),
    }),
    { cf },
  );

const makeLocals = (db: D1Database = makeDb()) => ({
  runtime: { env: { DB: db } },
});

const makeLocalsWithoutDb = () => ({ runtime: { env: {} } });

const validBody = {
  form_slug: "court-order-ma",
  sentiment: "positive",
};

describe("POST /api/feedback", () => {
  beforeEach(() => {
    vi.mocked(isRateLimited).mockResolvedValue(false);
  });

  describe("validation", () => {
    it("returns 400 for malformed JSON", async () => {
      const request = new Request("http://localhost/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not json",
      });
      const response = await POST({ request, locals: makeLocals() } as any);
      expect(response.status).toBe(400);
      expect(await response.json()).toMatchObject({ error: "Invalid JSON" });
    });

    it("returns 400 for an invalid form_slug", async () => {
      const response = await POST({
        request: makeRequest({ ...validBody, form_slug: "unknown-form" }),
        locals: makeLocals(),
      } as any);
      expect(response.status).toBe(400);
    });

    it("returns 400 for an invalid sentiment", async () => {
      const response = await POST({
        request: makeRequest({ ...validBody, sentiment: "meh" }),
        locals: makeLocals(),
      } as any);
      expect(response.status).toBe(400);
    });

    it("returns 400 when comment exceeds 1000 characters", async () => {
      const response = await POST({
        request: makeRequest({ ...validBody, comment: "a".repeat(1001) }),
        locals: makeLocals(),
      } as any);
      expect(response.status).toBe(400);
    });
  });

  describe("origin validation", () => {
    it("returns 403 when Origin header is missing", async () => {
      const request = Object.assign(
        new Request("http://localhost/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validBody),
        }),
      );
      const response = await POST({
        request,
        locals: makeLocals(),
      } as any);
      expect(response.status).toBe(403);
      expect(await response.json()).toMatchObject({ error: "Forbidden" });
    });

    it("returns 403 for a localhost origin", async () => {
      const response = await POST({
        request: makeRequest(validBody, { Origin: "http://localhost:4321" }),
        locals: makeLocals(),
      } as any);
      expect(response.status).toBe(403);
    });

    it("returns 403 for a preview deploy origin", async () => {
      const response = await POST({
        request: makeRequest(validBody, {
          Origin: "https://namesake-fyi.pages.dev",
        }),
        locals: makeLocals(),
      } as any);
      expect(response.status).toBe(403);
    });

    it("accepts requests from namesake.fyi", async () => {
      const response = await POST({
        request: makeRequest(validBody, { Origin: "https://namesake.fyi" }),
        locals: makeLocals(),
      } as any);
      expect(response.status).toBe(200);
    });
  });

  describe("infrastructure errors", () => {
    it("returns 503 when the database is unavailable", async () => {
      const response = await POST({
        request: makeRequest(validBody),
        locals: makeLocalsWithoutDb(),
      } as any);
      expect(response.status).toBe(503);
      expect(await response.json()).toMatchObject({
        error: "Database unavailable",
      });
    });

    it("returns 429 when the IP is rate limited", async () => {
      vi.mocked(isRateLimited).mockResolvedValueOnce(true);

      const response = await POST({
        request: makeRequest(validBody, { "CF-Connecting-IP": "1.2.3.4" }),
        locals: makeLocals(),
      } as any);
      expect(response.status).toBe(429);
      expect(await response.json()).toMatchObject({
        error: "Too many submissions",
      });
    });
  });

  describe("successful submission", () => {
    it("returns 200 with success on a valid request", async () => {
      const response = await POST({
        request: makeRequest(validBody),
        locals: makeLocals(),
      } as any);
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ success: true });
    });

    it("inserts the correct values into the database", async () => {
      const db = makeDb();
      const bind = (db.prepare as any)().bind as ReturnType<typeof vi.fn>;

      await POST({
        request: makeRequest(
          { ...validBody, comment: "Great form!" },
          { "CF-Connecting-IP": "1.2.3.4", "User-Agent": "TestBrowser/1.0" },
          { country: "US", region: "Massachusetts", city: "Boston" },
        ),
        locals: makeLocals(db),
      } as any);

      expect(bind).toHaveBeenCalledWith(
        "court-order-ma",
        "positive",
        "Great form!",
        "1.2.3.4",
        "TestBrowser/1.0",
        "US",
        "Massachusetts",
        "Boston",
      );
    });

    it("inserts null for a missing comment", async () => {
      const db = makeDb();
      const bind = (db.prepare as any)().bind as ReturnType<typeof vi.fn>;

      await POST({
        request: makeRequest(validBody),
        locals: makeLocals(db),
      } as any);

      const [, , commentArg] = bind.mock.calls[0];
      expect(commentArg).toBeNull();
    });
  });
});
