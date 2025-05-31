import migrations from "@convex-dev/migrations/convex.config";
import betterAuth from "@erquhart/convex-better-auth/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(betterAuth);
app.use(migrations);

export default app;
