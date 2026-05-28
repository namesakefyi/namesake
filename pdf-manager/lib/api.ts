import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "@cantoo/pdf-lib";
import {
  computeOutputPaths,
  formatFiles,
  writeDefinitionFiles,
} from "./define.ts";
import { loadJurisdictions } from "./fields.ts";
import {
  applyRenames,
  extractFields,
  extractFieldsFromBytes,
  stripFormFieldStyles,
} from "./pdf.ts";
import { loadExclusions, processPdf } from "./schema.ts";
import { loadSchemaFields, suggestName } from "./suggest.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const PDFS_DIR = join(ROOT, "src/pdfs");

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Reads a JSON request body. */
async function readBody(
  req: IncomingMessage,
): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: Buffer) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}

/** Sends a JSON response. */
function json(res: ServerResponse, data: unknown, status = 200): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

interface PdfMeta {
  title: string;
  code: string;
  jurisdiction: string;
}

/** Parses index.ts for PDF metadata via regex. */
function parsePdfMetadata(pdfDir: string): PdfMeta | null {
  const indexPath = join(pdfDir, "index.ts");
  if (!existsSync(indexPath)) return null;
  const content = readFileSync(indexPath, "utf8");
  return {
    title: content.match(/\btitle:\s*"([^"]+)"/)?.[1] ?? "",
    code: content.match(/\bcode:\s*"([^"]+)"/)?.[1] ?? "",
    jurisdiction: content.match(/\bjurisdiction:\s*"([^"]+)"/)?.[1] ?? "",
  };
}

/** Counts fields in schema.ts by counting PDF class references. */
function countSchemaFields(pdfDir: string): number {
  const schemaPath = join(pdfDir, "schema.ts");
  if (!existsSync(schemaPath)) return 0;
  const content = readFileSync(schemaPath, "utf8");
  return (
    content.match(/:\s*PDF(?:TextField|CheckBox|RadioGroup|Dropdown)/g) ?? []
  ).length;
}

interface PdfEntry {
  id: string;
  jurisdiction: string;
  title: string;
  code: string;
  fieldCount: number;
  pdfPath: string;
  pdfDir: string;
}

/** Returns all PDFs as [{ id, title, code, jurisdiction, fieldCount, pdfPath, pdfDir }]. */
function listAllPdfs(): PdfEntry[] {
  const result: PdfEntry[] = [];
  for (const entry of readdirSync(PDFS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "utils") continue;
    const jurisdictionDir = join(PDFS_DIR, entry.name);
    for (const pdfEntry of readdirSync(jurisdictionDir, {
      withFileTypes: true,
    })) {
      if (!pdfEntry.isDirectory()) continue;
      const pdfDir = join(jurisdictionDir, pdfEntry.name);
      const pdfFile = readdirSync(pdfDir).find((f) => f.endsWith(".pdf"));
      if (!pdfFile) continue;
      const meta = parsePdfMetadata(pdfDir);
      if (!meta) continue;
      result.push({
        id: pdfEntry.name,
        jurisdiction: meta.jurisdiction || entry.name.toUpperCase(),
        title: meta.title,
        code: meta.code,
        fieldCount: countSchemaFields(pdfDir),
        pdfPath: join(pdfDir, pdfFile),
        pdfDir,
      });
    }
  }
  return result;
}

/** Finds a PDF's directory and file path by id. */
function findPdfById(id: string): { pdfDir: string; pdfPath: string } | null {
  for (const entry of readdirSync(PDFS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "utils") continue;
    const pdfDir = join(PDFS_DIR, entry.name, id);
    if (!existsSync(pdfDir)) continue;
    const pdfFile = readdirSync(pdfDir).find((f) => f.endsWith(".pdf"));
    if (pdfFile) return { pdfDir, pdfPath: join(pdfDir, pdfFile) };
  }
  return null;
}

// ─── Route handlers ───────────────────────────────────────────────────────────

async function handleListPdfs(
  _req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const pdfs = listAllPdfs().map(
    ({ id, title, code, jurisdiction, fieldCount }) => ({
      id,
      title,
      code,
      jurisdiction,
      fieldCount,
    }),
  );
  json(res, pdfs);
}

async function handleGetPdfBytes(
  _req: IncomingMessage,
  res: ServerResponse,
  id: string,
): Promise<void> {
  const found = findPdfById(id);
  if (!found) return json(res, { error: "Not found" }, 404);
  const bytes = readFileSync(found.pdfPath);
  res.writeHead(200, { "Content-Type": "application/pdf" });
  res.end(bytes);
}

async function handleGetFields(
  _req: IncomingMessage,
  res: ServerResponse,
  id: string,
): Promise<void> {
  const found = findPdfById(id);
  if (!found) return json(res, { error: "Not found" }, 404);
  const fields = await extractFields(found.pdfPath);
  const excluded = loadExclusions(found.pdfDir);
  json(
    res,
    fields.map((f) => ({ ...f, excluded: excluded.has(f.name) })),
  );
}

async function handleSaveFields(
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
): Promise<void> {
  const found = findPdfById(id);
  if (!found) return json(res, { error: "Not found" }, 404);

  const body = await readBody(req);
  const renames = (body.renames as Array<{ from: string; to: string }>) ?? [];
  const deletes = (body.deletes as string[]) ?? [];

  const oldSchemaFields = new Set(loadSchemaFields(found.pdfPath));

  if (renames.length > 0) await applyRenames(found.pdfPath, renames);

  await processPdf(found.pdfPath, { exclude: deletes });
  formatFiles([join(found.pdfDir, "schema.ts")]);

  const newSchemaFields = loadSchemaFields(found.pdfPath);
  const added = newSchemaFields.filter((f) => !oldSchemaFields.has(f));
  const removed = [...oldSchemaFields].filter(
    (f) => !newSchemaFields.includes(f),
  );

  json(res, { added, removed });
}

async function handleAddPdf(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const body = await readBody(req);
  const { title, code, jurisdiction, pdfBase64 } = body as {
    title?: string;
    code?: string;
    jurisdiction?: string;
    pdfBase64?: string;
  };
  if (!title || !jurisdiction || !pdfBase64) {
    return json(
      res,
      { error: "title, jurisdiction, and pdfBase64 are required" },
      400,
    );
  }

  const { id, pdfDir, pdfDestPath, indexPath, testPath } = computeOutputPaths({
    title,
    code: code ?? "",
    jurisdiction,
  });

  if (existsSync(indexPath)) {
    return json(res, { error: `PDF "${id}" already exists` }, 409);
  }

  const rawBytes = Buffer.from(pdfBase64, "base64");
  const pdfDoc = await PDFDocument.load(rawBytes);
  stripFormFieldStyles(pdfDoc);
  const cleanedBytes = await pdfDoc.save();

  const pdfFields = await extractFieldsFromBytes(cleanedBytes);

  writeDefinitionFiles({
    id,
    title,
    code: code ?? "",
    jurisdiction,
    pdfDir,
    pdfDestPath,
    indexPath,
    testPath,
    pdfFields,
    pdfBytes: cleanedBytes,
  });

  await processPdf(pdfDestPath);
  formatFiles([join(pdfDir, "schema.ts")]);

  json(res, { id, fieldCount: pdfFields.length });
}

async function handlePreviewReplace(
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
): Promise<void> {
  const found = findPdfById(id);
  if (!found) return json(res, { error: "Not found" }, 404);

  const body = await readBody(req);
  const { pdfBase64 } = body as { pdfBase64?: string };
  if (!pdfBase64) return json(res, { error: "pdfBase64 is required" }, 400);

  const oldNames = new Set(loadSchemaFields(found.pdfPath));
  const newBytes = Buffer.from(pdfBase64, "base64");
  const newFields = await extractFieldsFromBytes(newBytes);
  const newNames = new Set(newFields.map((f) => f.name));

  const retained = newFields
    .filter((f) => oldNames.has(f.name))
    .map((f) => f.name);
  const added = newFields
    .filter((f) => !oldNames.has(f.name))
    .map((f) => f.name);
  const removed = [...oldNames].filter((n) => !newNames.has(n));

  const usedSuggestions = new Set<string>();
  const autoMappings: Record<string, string> = {};
  for (const field of newFields.filter((f) => !oldNames.has(f.name))) {
    const available = removed.filter((n) => !usedSuggestions.has(n));
    const suggestion = suggestName(field.name, available);
    if (suggestion) {
      autoMappings[field.name] = suggestion;
      usedSuggestions.add(suggestion);
    }
  }

  json(res, { newFields, retained, added, removed, autoMappings });
}

async function handleReplacePdf(
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
): Promise<void> {
  const found = findPdfById(id);
  if (!found) return json(res, { error: "Not found" }, 404);

  const body = await readBody(req);
  const {
    pdfBase64,
    renames = [],
    deletes = [],
  } = body as {
    pdfBase64?: string;
    renames?: Array<{ from: string; to: string }>;
    deletes?: string[];
  };
  if (!pdfBase64) return json(res, { error: "pdfBase64 is required" }, 400);

  const oldSchemaFields = new Set(loadSchemaFields(found.pdfPath));

  const newBytes = Buffer.from(pdfBase64, "base64");
  const pdfDoc = await PDFDocument.load(newBytes);
  stripFormFieldStyles(pdfDoc);
  writeFileSync(found.pdfPath, await pdfDoc.save());

  if (renames.length > 0) await applyRenames(found.pdfPath, renames);

  await processPdf(found.pdfPath, { exclude: deletes });
  formatFiles([join(found.pdfDir, "schema.ts")]);

  const newSchemaFields = loadSchemaFields(found.pdfPath);
  const added = newSchemaFields.filter((f) => !oldSchemaFields.has(f));
  const removed = [...oldSchemaFields].filter(
    (f) => !newSchemaFields.includes(f),
  );
  const unchanged = newSchemaFields.filter((f) => oldSchemaFields.has(f));

  json(res, { added, removed, unchanged, fieldCount: newSchemaFields.length });
}

async function handleGetJurisdictions(
  _req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const jurisdictions = loadJurisdictions();
  json(res, [{ name: "Federal", abbreviation: "federal" }, ...jurisdictions]);
}

// ─── Router ───────────────────────────────────────────────────────────────────

async function route(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const { method } = req;
  const url = new URL(req.url ?? "/", "http://localhost");
  const path = url.pathname;

  if (method === "GET" && path === "/api/pdfs") return handleListPdfs(req, res);
  if (method === "GET" && path === "/api/jurisdictions")
    return handleGetJurisdictions(req, res);

  function extractId(match: RegExpMatchArray): string | null {
    const id = match[1];
    if (id.includes("/") || id.includes("..")) {
      json(res, { error: "Invalid id" }, 400);
      return null;
    }
    return id;
  }

  const bytesMatch = path.match(/^\/api\/pdf\/([^/]+)\/bytes$/);
  if (method === "GET" && bytesMatch) {
    const id = extractId(bytesMatch);
    if (!id) return;
    return handleGetPdfBytes(req, res, id);
  }

  const fieldsMatch = path.match(/^\/api\/pdf\/([^/]+)\/fields$/);
  if (fieldsMatch) {
    const id = extractId(fieldsMatch);
    if (!id) return;
    if (method === "GET") return handleGetFields(req, res, id);
    if (method === "POST") return handleSaveFields(req, res, id);
  }

  if (method === "POST" && path === "/api/pdfs") return handleAddPdf(req, res);

  const replaceMatch = path.match(/^\/api\/pdf\/([^/]+)\/file$/);
  if (method === "PUT" && replaceMatch) {
    const id = extractId(replaceMatch);
    if (!id) return;
    return handleReplacePdf(req, res, id);
  }

  const previewMatch = path.match(/^\/api\/pdf\/([^/]+)\/preview$/);
  if (method === "POST" && previewMatch) {
    const id = extractId(previewMatch);
    if (!id) return;
    return handlePreviewReplace(req, res, id);
  }

  json(res, { error: "Not found" }, 404);
}

// ─── Vite plugin ─────────────────────────────────────────────────────────────

export function createApiPlugin() {
  return {
    name: "pdf-manager-api",
    configureServer(server: {
      middlewares: {
        use: (
          fn: (
            req: IncomingMessage,
            res: ServerResponse,
            next: () => void,
          ) => void,
        ) => void;
      };
    }) {
      server.middlewares.use(
        async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (!req.url?.startsWith("/api/")) return next();
          try {
            await route(req, res);
          } catch (err) {
            console.error("[pdf-manager api]", err);
            json(
              res,
              { error: err instanceof Error ? err.message : String(err) },
              500,
            );
          }
        },
      );
    },
  };
}
