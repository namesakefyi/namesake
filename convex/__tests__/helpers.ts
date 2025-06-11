import type { convexTest } from "convex-test";

/**
 * Creates a regular user in the test database and returns a test context with that user's identity.
 *
 * @param t - The test context from convex-test
 * @param email - Optional email address for the test user. Defaults to "user@example.com"
 * @param name - Optional display name for the test user. Defaults to "Test User"
 * @returns An object containing:
 *   - `userId`: The ID of the created user in the database
 *   - `asUser`: A test context with the created user's identity for making authenticated requests
 * @example
 * ```ts
 * const { userId, asUser } = await createTestUser(t);
 * await asUser.run(async (ctx) => {
 *   // Make authenticated requests as the test user
 * });
 * ```
 */
export const createTestUser = async (
  t: ReturnType<typeof convexTest>,
  email?: string,
  name?: string,
) => {
  const userId = await t.run(async (ctx) => {
    return await ctx.db.insert("users", {
      email: email ?? "user@example.com",
      name: name ?? "Test User",
      role: "user",
    });
  });
  const asUser = t.withIdentity({ subject: userId });
  return { userId, asUser };
};

/**
 * Creates an admin user in the test database and returns a test context with that admin's identity.
 *
 * @param t - The test context from convex-test
 * @param email - Optional email address for the test admin. Defaults to "admin@namesake.fyi"
 * @param name - Optional display name for the test admin. Defaults to "Test Admin"
 * @returns An object containing:
 *   - `adminId`: The ID of the created admin in the database
 *   - `asAdmin`: A test context with the created admin's identity for making authenticated requests
 * @example
 * ```ts
 * const { adminId, asAdmin } = await createTestAdmin(t);
 * await asAdmin.run(async (ctx) => {
 *   // Make authenticated requests as the test admin
 * });
 * ```
 */
export const createTestAdmin = async (
  t: ReturnType<typeof convexTest>,
  email?: string,
  name?: string,
) => {
  const adminId = await t.run(async (ctx) => {
    return await ctx.db.insert("users", {
      email: email ?? "admin@namesake.fyi",
      name: name ?? "Test Admin",
      role: "admin",
    });
  });
  const asAdmin = t.withIdentity({ subject: adminId });
  return { adminId, asAdmin };
};
