#!/usr/bin/env node

/**
 * Interactively renames PDF form fields with a live browser preview.
 * For each field the terminal prompts for a new name while the browser
 * highlights that field in the rendered PDF.
 *
 * Usage: pnpm pdf:rename path/to/form.pdf
 */

import { exec, spawnSync } from "node:child_process";
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "@cantoo/pdf-lib";
import {
  cancel,
  confirm,
  intro,
  isCancel,
  log,
  outro,
  text,
} from "@clack/prompts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PORT = 3456;

// ─── Field extraction ───────────────────────────────────────────────────────

async function extractFields(pdfPath) {
  const bytes = readFileSync(pdfPath);
  const doc = await PDFDocument.load(bytes);
  const form = doc.getForm();
  return form.getFields().map((f) => ({
    name: f.getName(),
    type: f.constructor.name === "PDFCheckBox" ? "checkbox" : "text",
  }));
}

// ─── Schema field names (for suggestions + diff) ────────────────────────────

function loadSchemaFields(pdfPath) {
  const schemaPath = join(dirname(pdfPath), "schema.ts");
  if (!existsSync(schemaPath)) return [];
  const content = readFileSync(schemaPath, "utf8");
  // Match bare identifier keys followed by `: PDF` — specific to schema.ts format
  return [...content.matchAll(/^\s+([a-zA-Z_]\w*):\s*PDF/gm)].map((m) => m[1]);
}

// ─── Fuzzy suggestions ───────────────────────────────────────────────────────

const XFA_LEAF_MAP = {
  fn: "FirstName",
  ln: "LastName",
  mn: "MiddleName",
  zip: "ZipCode",
  A1: "StreetAddress",
  Apt: "Apt",
  cityTown: "City",
  State: "State",
};

function leafFromXfa(name) {
  // "form1[0].BodyPage1[0].S2[0].CheckBox1[0]" → "CheckBox1"
  const last = name
    .split(".")
    .pop()
    .replace(/\[\d+\]$/, "");
  return XFA_LEAF_MAP[last] ?? last;
}

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function longestCommonSubstringScore(a, b) {
  if (!a || !b) return 0;
  let max = 0;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      let len = 0;
      while (
        i + len < a.length &&
        j + len < b.length &&
        a[i + len] === b[j + len]
      )
        len++;
      if (len > max) max = len;
    }
  }
  return (max * 2) / (a.length + b.length);
}

function suggestName(fieldName, schemaFields) {
  if (!schemaFields.length) return "";
  const leaf = leafFromXfa(fieldName);
  const normLeaf = normalize(leaf);

  let bestField = "";
  let bestScore = 0;
  for (const schema of schemaFields) {
    const normSchema = normalize(schema);
    if (normSchema === normLeaf) return schema;
    const score = longestCommonSubstringScore(normLeaf, normSchema);
    if (score > bestScore) {
      bestScore = score;
      bestField = schema;
    }
  }
  return bestScore >= 0.5 ? bestField : "";
}

// ─── Browser preview HTML ────────────────────────────────────────────────────

function buildPreviewHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>PDF Inspector</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #1a1a1a; color: #eee; font-family: system-ui, sans-serif;
         height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
  #header { flex-shrink: 0; padding: 8px 14px; background: #111;
            border-bottom: 1px solid #2a2a2a; display: flex; align-items: baseline;
            gap: 10px; font-size: 13px; }
  #progress { color: #555; white-space: nowrap; }
  #field-name { font-family: monospace; font-size: 11px; color: #888;
                overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  #field-type { flex-shrink: 0; font-size: 11px; color: #555; }
  #pdf-scroll { flex: 1; overflow: auto; padding: 16px;
                display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .page-wrap { position: relative; flex-shrink: 0;
               box-shadow: 0 2px 16px rgba(0,0,0,0.6); }
  canvas { display: block; }
  .hl { position: absolute; background: rgba(255,210,0,0.3);
        border: 2px solid rgba(255,160,0,0.85); border-radius: 2px;
        pointer-events: none; box-shadow: 0 0 0 3px rgba(255,160,0,0.15); }
  #loading { color: #444; margin-top: 48px; font-size: 13px; }
</style>
</head>
<body>
<div id="header">
  <span id="progress">—</span>
  <span id="field-name">Waiting for CLI…</span>
  <span id="field-type"></span>
</div>
<div id="pdf-scroll"><p id="loading">Loading PDF…</p></div>

<script type="module">
import * as pdfjsLib from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';

const scroll  = document.getElementById('pdf-scroll');
const progress  = document.getElementById('progress');
const nameEl  = document.getElementById('field-name');
const typeEl  = document.getElementById('field-type');

// fieldName → [{wrap, x, y, w, h}]  (canvas-space coords)
const fieldMap = new Map();
let activeHl = null;

async function renderPdf() {
  const pdf = await pdfjsLib.getDocument('/pdf').promise;
  document.getElementById('loading')?.remove();

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const vp = page.getViewport({ scale: 1.5 });

    const wrap = document.createElement('div');
    wrap.className = 'page-wrap';
    wrap.style.width  = vp.width  + 'px';
    wrap.style.height = vp.height + 'px';

    const canvas = document.createElement('canvas');
    canvas.width  = vp.width;
    canvas.height = vp.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
    wrap.appendChild(canvas);
    scroll.appendChild(wrap);

    // Collect widget annotations for this page
    const anns = await page.getAnnotations();
    for (const ann of anns) {
      if (ann.subtype !== 'Widget' || !ann.fieldName) continue;
      const [x1, y1, x2, y2] = vp.convertToViewportRectangle(ann.rect);
      const entry = {
        wrap,
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        w: Math.abs(x2 - x1),
        h: Math.abs(y2 - y1),
      };
      if (!fieldMap.has(ann.fieldName)) fieldMap.set(ann.fieldName, []);
      fieldMap.get(ann.fieldName).push(entry);
    }
  }
}

function highlight(name) {
  if (activeHl) { activeHl.remove(); activeHl = null; }
  const entries = fieldMap.get(name);
  if (!entries?.length) return;
  const { wrap, x, y, w, h } = entries[0];
  const el = document.createElement('div');
  el.className = 'hl';
  el.style.left   = x + 'px';
  el.style.top    = y + 'px';
  el.style.width  = w + 'px';
  el.style.height = h + 'px';
  wrap.appendChild(el);
  activeHl = el;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

await renderPdf();
nameEl.textContent = 'PDF loaded — waiting for CLI…';

const es = new EventSource('/api/highlight');
es.onmessage = (e) => {
  const { name, type, index, total } = JSON.parse(e.data);
  progress.textContent = index + ' / ' + total;
  nameEl.textContent   = name;
  typeEl.textContent   = type;
  highlight(name);
};
</script>
</body>
</html>`;
}

// ─── HTTP server ─────────────────────────────────────────────────────────────

function startServer(pdfPath) {
  const pdfBytes = readFileSync(pdfPath);
  const html = buildPreviewHtml();
  const sseClients = new Set();

  const server = createServer((req, res) => {
    if (req.method === "GET" && req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    } else if (req.method === "GET" && req.url === "/pdf") {
      res.writeHead(200, { "Content-Type": "application/pdf" });
      res.end(pdfBytes);
    } else if (req.method === "GET" && req.url === "/api/highlight") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });
      res.write(": connected\n\n");
      // Replay the current field so late-connecting clients (e.g. on first load)
      // immediately see the active highlight without waiting for the next advance.
      if (lastBroadcast !== null) res.write(`data: ${lastBroadcast}\n\n`);
      sseClients.add(res);
      req.on("close", () => sseClients.delete(res));
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(PORT);

  let lastBroadcast = null;
  function broadcast(data) {
    lastBroadcast = JSON.stringify(data);
    const msg = `data: ${lastBroadcast}\n\n`;
    for (const client of sseClients) client.write(msg);
  }

  return { server, broadcast };
}

// ─── Platform browser open ───────────────────────────────────────────────────

function openBrowser(url) {
  const cmd =
    process.platform === "win32"
      ? `start "" "${url}"`
      : process.platform === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd);
}

// ─── Rename fields (inlined from former rename-pdf-fields.mjs) ──────────────

async function applyRenames(pdfPath, renames) {
  const bytes = readFileSync(pdfPath);
  const doc = await PDFDocument.load(bytes);
  const form = doc.getForm();
  for (const { from, to } of renames) {
    try {
      const field = form.getField(from);
      form.acroForm.removeField(field.acroField);
      field.acroField.setParent(undefined);
      field.acroField.setPartialName(to);
      form.acroForm.addField(field.acroField.ref);
    } catch {
      // field not found — skip
    }
  }
  writeFileSync(pdfPath, await doc.save());
}

function runExtractSchema(pdfPath) {
  const script = join(__dirname, "extract-pdf-schema.mjs");
  return spawnSync("node", [script, pdfPath, "--quiet"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: "pipe",
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────

function findPdfInDir(dir) {
  return readdirSync(dir).find((f) => f.endsWith(".pdf")) ?? null;
}

async function main() {
  const arg = process.argv[2]?.trim();
  const baseDir = process.env.INIT_CWD ?? process.cwd();

  let pdfPath;

  if (arg) {
    pdfPath = resolve(baseDir, arg);
    // Accept a directory — find the PDF inside
    if (existsSync(pdfPath) && statSync(pdfPath).isDirectory()) {
      const found = findPdfInDir(pdfPath);
      if (!found) {
        cancel(`No PDF found in: ${pdfPath}`);
        process.exit(1);
      }
      pdfPath = join(pdfPath, found);
    }
  } else {
    // No argument — try the working directory itself
    const found = findPdfInDir(baseDir);
    if (!found) {
      cancel(
        "No PDF found in current directory.\nUsage: pnpm pdf:rename path/to/form.pdf",
      );
      process.exit(1);
    }
    pdfPath = join(baseDir, found);
  }

  if (!existsSync(pdfPath)) {
    cancel(`File not found: ${pdfPath}`);
    process.exit(1);
  }

  intro("PDF Field Inspector");

  const fields = await extractFields(pdfPath);
  const schemaFields = loadSchemaFields(pdfPath);
  const suggestions = fields.map((f) => suggestName(f.name, schemaFields));

  log.info(
    `${fields.length} fields · ${
      schemaFields.length
        ? `${schemaFields.length} schema fields loaded`
        : "no schema.ts found — no suggestions available"
    }`,
  );

  const url = `http://localhost:${PORT}`;
  const { server, broadcast } = startServer(pdfPath);
  openBrowser(url);
  log.info(`Preview open at ${url}`);

  // ── Field-by-field loop ──────────────────────────────────────────────────

  const renames = [];
  let kept = 0;

  for (let i = 0; i < fields.length; i++) {
    const { name, type } = fields[i];
    const suggestion = suggestions[i];

    broadcast({ name, type, index: i + 1, total: fields.length });

    const answer = await text({
      message: `[${i + 1}/${fields.length}] [${type}] ${name}`,
      placeholder: suggestion
        ? `${suggestion}  (suggested — press enter to accept)`
        : "new name  (or - to skip)",
      initialValue: suggestion,
    });

    if (isCancel(answer)) {
      cancel("Inspection cancelled — no changes applied.");
      server.close();
      process.exit(0);
    }

    const newName = answer.trim();
    if (newName === "" || newName === "-" || newName === name) {
      kept++;
    } else {
      renames.push({ from: name, to: newName });
    }
  }

  // ── Summary & confirm ────────────────────────────────────────────────────

  if (renames.length === 0) {
    outro(`No renames — ${kept} field${kept !== 1 ? "s" : ""} kept as-is.`);
    server.close();
    return;
  }

  log.info(
    `${renames.length} rename${renames.length !== 1 ? "s" : ""} · ${kept} kept`,
  );

  const apply = await confirm({
    message: "Apply renames and regenerate schema?",
  });
  if (isCancel(apply) || !apply) {
    cancel("Cancelled — no changes applied.");
    server.close();
    process.exit(0);
  }

  // ── Apply ────────────────────────────────────────────────────────────────

  const oldSchemaFields = new Set(schemaFields);

  try {
    await applyRenames(pdfPath, renames);
  } catch (err) {
    log.error(`Rename failed: ${err.message}`);
    server.close();
    process.exit(1);
  }
  log.success(
    `Renamed ${renames.length} field${renames.length !== 1 ? "s" : ""}`,
  );

  const schemaResult = runExtractSchema(pdfPath);
  if (schemaResult.status !== 0) {
    log.error(`Schema extraction failed:\n${schemaResult.stderr}`);
    server.close();
    process.exit(1);
  }
  log.success("Schema regenerated");

  // ── Diff ─────────────────────────────────────────────────────────────────

  const newSchemaFields = loadSchemaFields(pdfPath);
  const added = newSchemaFields.filter((f) => !oldSchemaFields.has(f));
  const removed = [...oldSchemaFields].filter(
    (f) => !newSchemaFields.includes(f),
  );

  if (added.length) {
    log.warn(
      `${added.length} new field${added.length !== 1 ? "s" : ""} need wiring in index.ts:\n${added.map((f) => `  · ${f}`).join("\n")}`,
    );
  }
  if (removed.length) {
    log.warn(
      `${removed.length} field${removed.length !== 1 ? "s" : ""} removed from schema:\n${removed.map((f) => `  · ${f}`).join("\n")}`,
    );
  }

  outro("Done! Run pnpm test to verify.");
  server.close();
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
