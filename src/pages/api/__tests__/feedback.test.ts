import { env as cfWorkersEnv } from "cloudflare:workers";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { isRateLimited } from "#utils/rateLimitByIp";
import { POST } from "../feedback";

/** Same object `feedback.ts` imports; widened so tests can clear optional bindings. */
const env = cfWorkersEnv as {
  DB: D1Database | undefined;
  RESEND_API_KEY: string | undefined;
};

vi.mock("#utils/rateLimitByIp", () => ({
  isRateLimited: vi.fn().mockResolvedValue(false),
}));

const makeDb = () => {
  const run = vi.fn().mockResolvedValue({});
  const bind = vi.fn().mockReturnValue({ run });
  const prepare = vi.fn().mockReturnValue({ bind });
  return {
    db: { prepare } as unknown as D1Database,
    bind,
    prepare,
  };
};

let currentBind: ReturnType<typeof vi.fn>;

const callPost = (request: Request) =>
  POST({ request } as Parameters<typeof POST>[0]);

const makeRequest = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://namesake.fyi",
      ...headers,
    },
    body: JSON.stringify(body),
  });

const validBody = {
  form_slug: "court-order-ma",
  sentiment: "positive",
};

beforeEach(() => {
  const { db, bind } = makeDb();
  currentBind = bind;
  env.DB = db;
  env.RESEND_API_KEY = undefined;
  vi.mocked(isRateLimited).mockResolvedValue(false);
});

describe("POST /api/feedback", () => {
  describe("validation", () => {
    it("returns 400 for malformed JSON", async () => {
      const request = new Request("http://localhost/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not json",
      });
      const response = await callPost(request);
      expect(response.status).toBe(400);
      expect(await response.json()).toMatchObject({ error: "Invalid JSON" });
    });

    it("returns 400 for an invalid form_slug", async () => {
      const response = await callPost(
        makeRequest({ ...validBody, form_slug: "unknown-form" }),
      );
      expect(response.status).toBe(400);
    });

    it("returns 400 for an invalid sentiment", async () => {
      const response = await callPost(
        makeRequest({ ...validBody, sentiment: "meh" }),
      );
      expect(response.status).toBe(400);
    });

    it("returns 400 when comment exceeds 1000 characters", async () => {
      const response = await callPost(
        makeRequest({ ...validBody, comment: "a".repeat(1001) }),
      );
      expect(response.status).toBe(400);
    });
  });

  describe("origin validation", () => {
    it("returns 403 when Origin header is missing", async () => {
      const request = new Request("http://localhost/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validBody),
      });
      expect((await callPost(request)).status).toBe(403);
    });

    it("accepts requests from localhost", async () => {
      const response = await callPost(
        makeRequest(validBody, { Origin: "http://localhost:4321" }),
      );
      expect(response.status).toBe(200);
    });

    it("returns 403 for a preview deploy origin", async () => {
      const response = await callPost(
        makeRequest(validBody, { Origin: "https://namesake-fyi.pages.dev" }),
      );
      expect(response.status).toBe(403);
    });

    it("accepts requests from namesake.fyi", async () => {
      expect((await callPost(makeRequest(validBody))).status).toBe(200);
    });
  });

  describe("infrastructure errors", () => {
    it("returns 503 when the database is unavailable", async () => {
      env.DB = undefined;
      const response = await callPost(makeRequest(validBody));
      expect(response.status).toBe(503);
      expect(await response.json()).toMatchObject({
        error: "Database unavailable",
      });
    });

    it("returns 429 when the IP is rate limited", async () => {
      vi.mocked(isRateLimited).mockResolvedValueOnce(true);
      const response = await callPost(
        makeRequest(validBody, { "CF-Connecting-IP": "1.2.3.4" }),
      );
      expect(response.status).toBe(429);
      expect(await response.json()).toMatchObject({
        error: "Too many submissions",
      });
    });
  });

  describe("email notifications", () => {
    beforeEach(() => {
      env.RESEND_API_KEY = "test-key";
      vi.spyOn(global, "fetch").mockResolvedValue(
        new Response(null, { status: 200 }),
      );
    });

    it("sends an email for production origin requests", async () => {
      await callPost(makeRequest(validBody));

      expect(fetch).toHaveBeenCalledWith(
        "https://api.resend.com/emails",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer test-key",
          }),
          body: expect.stringContaining("court-order-ma"),
        }),
      );
    });

    it("includes the correct recipient and subject in the email", async () => {
      await callPost(makeRequest(validBody));

      const [, options] = vi.mocked(fetch).mock.calls[0];
      const body = JSON.parse(options?.body as string);
      expect(body.to).toBe("hey@namesake.fyi");
      expect(body.subject).toMatch(/court-order-ma/);
    });

    it("does not send an email for localhost origin requests", async () => {
      await callPost(
        makeRequest(validBody, { Origin: "http://localhost:4321" }),
      );

      expect(fetch).not.toHaveBeenCalled();
    });

    it("does not send an email when RESEND_API_KEY is absent", async () => {
      env.RESEND_API_KEY = undefined;
      await callPost(makeRequest(validBody));

      expect(fetch).not.toHaveBeenCalled();
    });

    it("still returns 200 when the Resend API returns an error", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response("Internal Server Error", { status: 500 }),
      );

      const response = await callPost(makeRequest(validBody));
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ success: true });
    });
  });

  describe("successful submission", () => {
    it("returns 200 with success on a valid request", async () => {
      const response = await callPost(makeRequest(validBody));
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ success: true });
    });

    it("inserts the correct values into the database", async () => {
      await callPost(
        makeRequest(
          { ...validBody, comment: "Great form!" },
          { "CF-Connecting-IP": "1.2.3.4", "User-Agent": "TestBrowser/1.0" },
        ),
      );

      expect(currentBind).toHaveBeenCalledWith(
        "court-order-ma",
        "positive",
        "Great form!",
        "1.2.3.4",
        "TestBrowser/1.0",
        null,
        null,
        null,
      );
    });

    it("inserts null for a missing comment", async () => {
      await callPost(makeRequest(validBody));

      const [, , commentArg] = currentBind.mock.calls[0];
      expect(commentArg).toBeNull();
    });
  });
});
