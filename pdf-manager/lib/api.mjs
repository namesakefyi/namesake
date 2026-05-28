import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "@cantoo/pdf-lib";
import {
  addIdToPdfConstants,
  formatFiles,
  generateDefinition,
  generatePdfId,
  generateStarterTest,
} from "./define.mjs";
import { loadFormFields, loadJurisdictions } from "./fields.mjs";
import {
  applyRenames,
  extractFields,
  extractFieldsFromBytes,
  stripFormFieldStyles,
} from "./pdf.mjs";
import { loadExclusions, processPdf } from "./schema.mjs";
import { loadSchemaFields, suggestName } from "./suggest.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const PDFS_DIR = join(ROOT, "src/pdfs");

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Reads a JSON request body. */
async function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
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
function json(res, data, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

/** Parses index.ts for PDF metadata via regex. */
function parsePdfMetadata(pdfDir) {
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
function countSchemaFields(pdfDir) {
  const schemaPath = join(pdfDir, "schema.ts");
  if (!existsSync(schemaPath)) return 0;
  const content = readFileSync(schemaPath, "utf8");
  return (
    content.match(/:\s*PDF(?:TextField|CheckBox|RadioGroup|Dropdown)/g) ?? []
  ).length;
}

/** Returns all PDFs as [{ id, title, code, jurisdiction, fieldCount, pdfPath, pdfDir }]. */
function listAllPdfs() {
  const result = [];
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
function findPdfById(id) {
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

async function handleListPdfs(_req, res) {
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

async function handleGetPdfBytes(_req, res, id) {
  const found = findPdfById(id);
  if (!found) return json(res, { error: "Not found" }, 404);
  const bytes = readFileSync(found.pdfPath);
  res.writeHead(200, { "Content-Type": "application/pdf" });
  res.end(bytes);
}

async function handleGetFields(_req, res, id) {
  const found = findPdfById(id);
  if (!found) return json(res, { error: "Not found" }, 404);
  const fields = await extractFields(found.pdfPath);
  const excluded = loadExclusions(found.pdfDir);
  json(res, fields.map((f) => ({ ...f, excluded: excluded.has(f.name) })));
}

async function handleSaveFields(req, res, id) {
  const found = findPdfById(id);
  if (!found) return json(res, { error: "Not found" }, 404);

  const { renames = [], deletes = [] } = await readBody(req);

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

async function handleAddPdf(req, res) {
  const { title, code, jurisdiction, pdfBase64 } = await readBody(req);
  if (!title || !jurisdiction || !pdfBase64) {
    return json(
      res,
      { error: "title, jurisdiction, and pdfBase64 are required" },
      400,
    );
  }

  const id = generatePdfId(code, title);
  const jurisdictionDir =
    jurisdiction.toLowerCase() === "federal"
      ? join(PDFS_DIR, "federal")
      : join(PDFS_DIR, jurisdiction.toLowerCase());
  const pdfDir = join(jurisdictionDir, id);
  const pdfDestPath = join(pdfDir, `${id}.pdf`);
  const indexPath = join(pdfDir, "index.ts");
  const testPath = join(pdfDir, "index.test.ts");

  if (existsSync(indexPath)) {
    return json(res, { error: `PDF "${id}" already exists` }, 409);
  }

  const pdfBytes = Buffer.from(pdfBase64, "base64");
  const pdfDoc = await PDFDocument.load(pdfBytes);
  stripFormFieldStyles(pdfDoc);
  const cleanedBytes = await pdfDoc.save();

  mkdirSync(pdfDir, { recursive: true });
  writeFileSync(pdfDestPath, cleanedBytes);

  const pdfFields = await extractFields(pdfDestPath);
  await processPdf(pdfDestPath);

  const definition = generateDefinition({
    id,
    title,
    code: code ?? "",
    jurisdiction,
    pdfFields,
  });
  writeFileSync(indexPath, `${definition}\n`);

  const test = generateStarterTest({ id, title, pdfFields });
  writeFileSync(testPath, `${test}\n`);

  addIdToPdfConstants(id);
  formatFiles([indexPath, testPath, join(pdfDir, "schema.ts")]);

  json(res, { id, fieldCount: pdfFields.length });
}

async function handlePreviewReplace(req, res, id) {
  const found = findPdfById(id);
  if (!found) return json(res, { error: "Not found" }, 404);

  const { pdfBase64 } = await readBody(req);
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

  const usedSuggestions = new Set();
  const autoMappings = {};
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

async function handleReplacePdf(req, res, id) {
  const found = findPdfById(id);
  if (!found) return json(res, { error: "Not found" }, 404);

  const { pdfBase64, renames = [], deletes = [] } = await readBody(req);
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

async function handleGetFormFields(_req, res) {
  const fields = loadFormFields().map((f) => f.name);
  json(res, fields);
}

async function handleGetJurisdictions(_req, res) {
  const jurisdictions = loadJurisdictions();
  json(res, [{ name: "Federal", abbreviation: "federal" }, ...jurisdictions]);
}

// ─── Router ───────────────────────────────────────────────────────────────────

async function route(req, res) {
  const { method } = req;
  const url = new URL(req.url, "http://localhost");
  const path = url.pathname;

  if (method === "GET" && path === "/api/pdfs") return handleListPdfs(req, res);
  if (method === "GET" && path === "/api/form-fields")
    return handleGetFormFields(req, res);
  if (method === "GET" && path === "/api/jurisdictions")
    return handleGetJurisdictions(req, res);

  const bytesMatch = path.match(/^\/api\/pdf\/([^/]+)\/bytes$/);
  if (method === "GET" && bytesMatch)
    return handleGetPdfBytes(req, res, bytesMatch[1]);

  const fieldsMatch = path.match(/^\/api\/pdf\/([^/]+)\/fields$/);
  if (fieldsMatch) {
    if (method === "GET") return handleGetFields(req, res, fieldsMatch[1]);
    if (method === "POST") return handleSaveFields(req, res, fieldsMatch[1]);
  }

  const addPdfMatch = path === "/api/pdfs" && method === "POST";
  if (addPdfMatch) return handleAddPdf(req, res);

  const replaceMatch = path.match(/^\/api\/pdf\/([^/]+)\/file$/);
  if (method === "PUT" && replaceMatch)
    return handleReplacePdf(req, res, replaceMatch[1]);

  const previewMatch = path.match(/^\/api\/pdf\/([^/]+)\/preview$/);
  if (method === "POST" && previewMatch)
    return handlePreviewReplace(req, res, previewMatch[1]);

  json(res, { error: "Not found" }, 404);
}

// ─── Vite plugin ─────────────────────────────────────────────────────────────

export function createApiPlugin() {
  return {
    name: "pdf-manager-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) return next();
        try {
          await route(req, res);
        } catch (err) {
          console.error("[pdf-manager api]", err);
          json(res, { error: err.message }, 500);
        }
      });
    },
  };
}
