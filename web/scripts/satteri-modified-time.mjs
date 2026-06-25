import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { defineMdastPlugin } from "satteri";

export function satteriModifiedTime() {
  let computed = false;

  return defineMdastPlugin({
    name: "modified-time",
    text(_node, ctx) {
      if (computed || !ctx.fileURL) return;
      computed = true;
      const filePath = fileURLToPath(ctx.fileURL);
      ctx.data.astro.frontmatter.lastModified = execSync(
        `git log -1 --pretty="format:%aI" "${filePath}"`,
      ).toString();
    },
  });
}
