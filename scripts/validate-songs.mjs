import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const songsDir = path.join(process.cwd(), "public", "songs");
const maxExamples = 12;
const strict = process.argv.includes("--strict");

const countMatches = (text, pattern) => text.match(pattern)?.length ?? 0;

const checks = [
  {
    name: "Ref. placeholders",
    test: (html) => html.includes("Ref."),
  },
  {
    name: "raw chord template tokens",
    test: (html) => /(?:ch\{\/|rep\{\\|rep\{|\\g\{)/.test(html),
  },
  {
    name: "unbalanced div tags",
    test: (html) =>
      countMatches(html, /<div\b/gi) !== countMatches(html, /<\/div>/gi),
  },
  {
    name: "unbalanced paragraph tags",
    test: (html) =>
      countMatches(html, /<p\b/gi) !== countMatches(html, /<\/p>/gi),
  },
  {
    name: "unbalanced span tags",
    test: (html) =>
      countMatches(html, /<span\b/gi) !== countMatches(html, /<\/span>/gi),
  },
];

const files = (await readdir(songsDir))
  .filter((file) => file.endsWith(".html"))
  .sort((a, b) => a.localeCompare(b));

const findings = [];

for (const file of files) {
  const html = await readFile(path.join(songsDir, file), "utf8");
  for (const check of checks) {
    if (check.test(html)) {
      findings.push({ file, check: check.name });
    }
  }
}

if (findings.length === 0) {
  console.log(`Validated ${files.length} song templates. No issues found.`);
  process.exit(0);
}

console.error(
  `Found ${findings.length} potential song template issues across ${files.length} files.`,
);

for (const finding of findings.slice(0, maxExamples)) {
  console.error(`- ${finding.file}: ${finding.check}`);
}

if (findings.length > maxExamples) {
  console.error(`...and ${findings.length - maxExamples} more.`);
}

process.exit(strict ? 1 : 0);
