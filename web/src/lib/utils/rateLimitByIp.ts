interface RateLimitOptions {
  db: D1Database;
  ip: string;
  /** D1 table name to query. Must have `ip TEXT` and `submitted_at DATETIME` columns. */
  table: string;
  /** SQLite datetime modifier for the lookback window. Defaults to `-1 hour`. */
  windowInterval?: string;
  /** Maximum number of submissions allowed within the window. Defaults to 5. */
  limit?: number;
}

/**
 * Given an IP and D1 table, return whether the submission rate limit has
 * been exceeded for that IP within the time window.
 *
 * @example
 * await isRateLimited({ db, ip: "203.0.113.1", table: "form_submissions" })
 * // true
 */
export async function isRateLimited({
  db,
  ip,
  table,
  windowInterval = "-1 hour",
  limit = 5,
}: RateLimitOptions): Promise<boolean> {
  const result = await db
    .prepare(
      `SELECT COUNT(*) as count FROM ${table} WHERE ip = ? AND submitted_at > datetime('now', ?)`,
    )
    .bind(ip, windowInterval)
    .first<{ count: number }>();

  return result !== null && result.count >= limit;
}
