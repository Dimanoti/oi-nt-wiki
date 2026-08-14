import { readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDirectory = join(projectRoot, "content");
const outputFile = join(contentDirectory, "generated.ts");

const files = (await readdir(contentDirectory))
  .filter((file) => file.endsWith(".md") && file !== "README.md")
  .sort();

for (const file of files) {
  const slug = file.slice(0, -3);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Invalid article filename: ${file}. Use lowercase letters, numbers, and single hyphens.`);
  }
}

const imports = files.map((file, index) => `import article${index} from "./${file}";`);
const entries = files.map((file, index) => `  ${JSON.stringify(file.slice(0, -3))}: article${index},`);

const source = `${imports.join("\n")}

// This file is generated from content/*.md. Do not edit it manually.
export const articleSources = {
${entries.join("\n")}
} as const;
`;

await writeFile(outputFile, source, "utf8");
