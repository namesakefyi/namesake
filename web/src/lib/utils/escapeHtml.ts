const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
};

export const escapeHtml = (text: string) =>
  text.replace(/[&<>"]/g, (match) => HTML_ESCAPES[match]);
