export const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://app.namesake.fyi/email"
    : "/static";
