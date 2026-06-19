import { execSync } from "node:child_process";

export function remarkModifiedTime() {
  return (_tree, file) => {
    const filepath = file.history[0];
    const result = execSync(`git log -1 --pretty="format:%aI" "${filepath}"`);
    file.data.astro.frontmatter.lastModified = result.toString();
  };
}
