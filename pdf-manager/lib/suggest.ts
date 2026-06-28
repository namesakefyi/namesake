const XFA_LEAF_MAP: Record<string, string> = {
  fn: "FirstName",
  ln: "LastName",
  mn: "MiddleName",
  A1: "StreetAddress",
  Apt: "StreetAddress2",
  cityTown: "City",
  State: "State",
  zip: "ZipCode",
};

function leafFromXfa(name: string): string {
  const last =
    name
      .split(".")
      .pop()
      ?.replace(/\[\d+\]$/, "") ?? "";
  return XFA_LEAF_MAP[last] ?? last;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function longestCommonSubstringScore(a: string, b: string): number {
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
export function suggestName(fieldName: string, schemaFields: string[]): string {
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
