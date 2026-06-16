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
 * Returns true if the given IP has exceeded the submission rate limit
 * for the specified table within the time window.
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
