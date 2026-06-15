import { getRequestListener } from "@hono/node-server";
import { Hono } from "hono";
import type { ViteDevServer } from "vite";
import {
  handleAddPdf,
  handleGetFields,
  handleGetJurisdictions,
  handleGetPdfBytes,
  handleListPdfs,
  handlePreviewReplace,
  handleReplacePdf,
  handleSaveFields,
} from "./handlers";

const app = new Hono()
  .get("/api/pdfs", handleListPdfs)
  .get("/api/jurisdictions", handleGetJurisdictions)
  .post("/api/pdfs", handleAddPdf)
  .get("/api/pdf/:id/bytes", handleGetPdfBytes)
  .get("/api/pdf/:id/fields", handleGetFields)
  .post("/api/pdf/:id/fields", handleSaveFields)
  .put("/api/pdf/:id/file", handleReplacePdf)
  .post("/api/pdf/:id/preview", handlePreviewReplace);

app.notFound((c) => c.json({ error: "Not found" }, 404));
app.onError((err, c) => {
  console.error("[pdf-manager api]", err);
  return c.json({ error: err.message }, 500);
});

export function createApiPlugin() {
  const handler = getRequestListener(app.fetch);
  return {
    name: "pdf-manager-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/api/")) return next();
        handler(req, res);
      });
    },
  };
}
