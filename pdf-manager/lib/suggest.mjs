import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

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

/** Returns the best matching schema field name for a raw PDF field name, or "". */
export function suggestName(fieldName, schemaFields) {
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

/** Returns field names from the sibling schema.ts of a PDF path. */
export function loadSchemaFields(pdfPath) {
  const schemaPath = join(dirname(pdfPath), "schema.ts");
  if (!existsSync(schemaPath)) return [];
  const content = readFileSync(schemaPath, "utf8");
  return [...content.matchAll(/^\s+([a-zA-Z_]\w*):\s*PDF/gm)].map((m) => m[1]);
}
