#!/usr/bin/env node
// apply-registry.js
// Reads changes in content-registry.md and applies them to source files.
//
// Usage:
//   node apply-registry.js            — apply unstaged registry edits
//   node apply-registry.js --staged   — apply staged (but not committed) edits

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const staged = process.argv.includes('--staged');
const diffCmd = staged
  ? 'git diff --cached content-registry.md'
  : 'git diff content-registry.md';

// ── 1. Get the diff ──────────────────────────────────────────────────────────

let diff;
try {
  diff = execSync(diffCmd, { cwd: ROOT }).toString();
} catch (e) {
  console.error('Failed to run git diff:', e.message);
  process.exit(1);
}

if (!diff.trim()) {
  console.log(`No ${staged ? 'staged ' : ''}changes found in content-registry.md.`);
  process.exit(0);
}

// ── 2. Parse changed table rows ──────────────────────────────────────────────
// Row format: | ID | Label | Source | Text |

function parseRow(diffLine) {
  const raw = diffLine.startsWith('+') || diffLine.startsWith('-')
    ? diffLine.slice(1)
    : diffLine;

  const trimmed = raw.trim();
  if (!trimmed.startsWith('|')) return null;

  // Split on pipe, drop the first empty segment and trailing empty segment
  const cols = trimmed.split('|').map(s => s.trim());
  // cols[0] = '' (before first |), cols[1]=ID, cols[2]=Label, cols[3]=Source, cols[4]=Text, cols[5]=''
  if (cols.length < 5) return null;

  const id = cols[1];
  if (!/^[A-Z]+-\d+$/.test(id)) return null;

  const source = cols[3]; // "file.html:123"
  // Text may contain pipes if someone is creative — re-join anything after the 4th column
  const text = cols.slice(4, cols.length - 1).join('|').trim();

  if (!source || !/^.+:\d+$/.test(source)) return null;

  return { id, source, text };
}

const removed = {}; // id → { source, text }
const added   = {}; // id → { source, text }

for (const line of diff.split('\n')) {
  if (line.startsWith('-') && !line.startsWith('---')) {
    const row = parseRow(line);
    if (row) removed[row.id] = row;
  } else if (line.startsWith('+') && !line.startsWith('+++')) {
    const row = parseRow(line);
    if (row) added[row.id] = row;
  }
}

// ── 3. Build changes list ────────────────────────────────────────────────────

const changes = [];

for (const id of Object.keys(added)) {
  const a = added[id];
  const r = removed[id];
  if (!r) continue;            // new row with no prior version — nothing to replace
  if (a.text === r.text) continue; // only metadata changed

  const [file, lineStr] = r.source.split(':');
  changes.push({
    id,
    file,
    lineHint: parseInt(lineStr, 10),
    oldText: r.text,
    newText: a.text,
  });
}

if (changes.length === 0) {
  console.log('No text changes detected (only metadata/formatting changes).');
  process.exit(0);
}

console.log(`${changes.length} change(s) to apply:\n`);

// ── 4. Apply to source files ─────────────────────────────────────────────────

const byFile = {};
for (const c of changes) {
  (byFile[c.file] = byFile[c.file] || []).push(c);
}

let ok = 0;
let warn = 0;

for (const [file, fileChanges] of Object.entries(byFile)) {
  const fullPath = path.join(ROOT, ...file.split('/'));
  if (!fs.existsSync(fullPath)) {
    for (const { id } of fileChanges) {
      console.warn(`  SKIP [${id}] File not found: ${file}`);
      warn++;
    }
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  for (const { id, lineHint, oldText, newText } of fileChanges) {
    const escaped = oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped, 'g');

    // Collect all occurrence positions + their line numbers
    const hits = [];
    let m;
    while ((m = re.exec(content)) !== null) {
      const lineNum = content.slice(0, m.index).split('\n').length;
      hits.push({ index: m.index, lineNum, len: oldText.length });
    }

    if (hits.length === 0) {
      console.warn(`  WARN [${id}] "${oldText}" not found in ${file}`);
      warn++;
      continue;
    }

    // Pick occurrence closest to the registered line number
    const best = hits.reduce((a, b) =>
      Math.abs(a.lineNum - lineHint) <= Math.abs(b.lineNum - lineHint) ? a : b
    );

    if (hits.length > 1) {
      console.log(`  NOTE [${id}] Appears ${hits.length}×; using line ${best.lineNum} (hint: ${lineHint})`);
    }

    content = content.slice(0, best.index) + newText + content.slice(best.index + best.len);
    console.log(`  OK   [${id}] ${file}:${best.lineNum}  "${oldText}"  →  "${newText}"`);
    ok++;
  }

  fs.writeFileSync(fullPath, content, 'utf8');
}

console.log(`\nDone — ${ok} applied, ${warn} skipped.`);
if (warn > 0) {
  console.log('Warnings above usually mean the text was already applied or the file has since changed.');
}
