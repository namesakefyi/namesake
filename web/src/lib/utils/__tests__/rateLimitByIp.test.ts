import { describe, expect, it, vi } from "vitest";
import { isRateLimited } from "../rateLimitByIp";

const makeDb = (count: number | null) => {
  const first = vi.fn().mockResolvedValue(count !== null ? { count } : null);
  const bind = vi.fn().mockReturnValue({ first });
  const prepare = vi.fn().mockReturnValue({ bind });
  return { db: { prepare } as unknown as D1Database, prepare, bind };
};

describe("isRateLimited", () => {
  it("returns false when submissions are below the limit", async () => {
    const { db } = makeDb(4);
    expect(
      await isRateLimited({ db, ip: "1.2.3.4", table: "form_feedback" }),
    ).toBe(false);
  });

  it("returns true when submissions meet the limit", async () => {
    const { db } = makeDb(5);
    expect(
      await isRateLimited({ db, ip: "1.2.3.4", table: "form_feedback" }),
    ).toBe(true);
  });

  it("returns true when submissions exceed the limit", async () => {
    const { db } = makeDb(10);
    expect(
      await isRateLimited({ db, ip: "1.2.3.4", table: "form_feedback" }),
    ).toBe(true);
  });

  it("returns false when the DB returns null", async () => {
    const { db } = makeDb(null);
    expect(
      await isRateLimited({ db, ip: "1.2.3.4", table: "form_feedback" }),
    ).toBe(false);
  });

  it("respects a custom limit", async () => {
    const { db: under } = makeDb(2);
    expect(
      await isRateLimited({
        db: under,
        ip: "1.2.3.4",
        table: "form_feedback",
        limit: 3,
      }),
    ).toBe(false);

    const { db: at } = makeDb(3);
    expect(
      await isRateLimited({
        db: at,
        ip: "1.2.3.4",
        table: "form_feedback",
        limit: 3,
      }),
    ).toBe(true);
  });

  it("queries the correct table", async () => {
    const { db, prepare } = makeDb(0);
    await isRateLimited({ db, ip: "1.2.3.4", table: "custom_table" });
    expect(prepare).toHaveBeenCalledWith(
      expect.stringContaining("custom_table"),
    );
  });

  it("binds the IP and the default window interval", async () => {
    const { db, bind } = makeDb(0);
    await isRateLimited({ db, ip: "1.2.3.4", table: "form_feedback" });
    expect(bind).toHaveBeenCalledWith("1.2.3.4", "-1 hour");
  });

  it("binds a custom window interval when provided", async () => {
    const { db, bind } = makeDb(0);
    await isRateLimited({
      db,
      ip: "1.2.3.4",
      table: "form_feedback",
      windowInterval: "-1 day",
    });
    expect(bind).toHaveBeenCalledWith("1.2.3.4", "-1 day");
  });
});
