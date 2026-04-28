#!/usr/bin/env node
// patch.js
// General-purpose find-and-replace script for the Relation Naming project.
//
// USAGE:
//   1. Set FIND to the exact text you want to find (copy from the file to be safe)
//   2. Set REPLACE to what you want instead
//   3. Set FILES to the list of files to search, OR set AUTO_SEARCH to true
//      to automatically search all .html and .js files in this folder
//   4. Run: node patch.js
//
// After patching lesson-template.html or any lesson-N-specific.js file,
// run: node build-lessons.js  to regenerate the lesson HTML files.
// After patching fluency-template.html or fluency-config.json,
// run: node build-fluency.js  to regenerate the fluency HTML files.

const fs = require('fs');

// ── CONFIGURE THIS SECTION ────────────────────────────────────────────────────

// Set to true to search ALL .html and .js files in this folder automatically.
// Set to false to only search the files listed in FILES below.
const AUTO_SEARCH = true;

// Used only when AUTO_SEARCH is false — list the specific files to patch.
const FILES = [
  'lesson-template.html',
  'fluency-l1.html',
  'fluency-l2.html',
  'fluency-l3.html',
  'fluency-l4.html',
  'fluency-l5.html',
  'fluency-compound.html',
  'lesson-compound-specific.js',
];

// The exact text to find. Copy directly from the file to avoid typos.
const FIND = `const CHAR_DELAY_MS = 35;`;

// The text to replace it with.
const REPLACE = `const CHAR_DELAY_MS = 35;`;

// ── END CONFIG ────────────────────────────────────────────────────────────────

const EXTS = ['.html', '.js'];

const targets = AUTO_SEARCH
  ? fs.readdirSync('.').filter(f => EXTS.some(e => f.endsWith(e)))
  : FILES;

if (!FIND) {
  console.error('Error: FIND is empty. Set the text you want to find.');
  process.exit(1);
}

if (FIND === REPLACE) {
  console.error('Error: FIND and REPLACE are identical — nothing to do.');
  process.exit(1);
}

console.log(`Searching ${targets.length} file${targets.length !== 1 ? 's' : ''}...\n`);

let changed = 0;
let skipped = 0;
let missing = 0;

targets.forEach(f => {
  if (!fs.existsSync(f)) {
    console.log(`⚠  Not found:  ${f}`);
    missing++;
    return;
  }
  const before = fs.readFileSync(f, 'utf8');
  const count = (before.split(FIND).length - 1);
  if (count === 0) {
    skipped++;
    return;
  }
  const after = before.replaceAll(FIND, REPLACE);
  fs.writeFileSync(f, after, 'utf8');
  console.log(`✓  Patched (${count} match${count !== 1 ? 'es' : ''}): ${f}`);
  changed++;
});

console.log('');
if (changed > 0) console.log(`Done — ${changed} file${changed !== 1 ? 's' : ''} changed.`);
if (skipped > 0) console.log(`       ${skipped} file${skipped !== 1 ? 's' : ''} had no match (skipped).`);
if (missing > 0) console.log(`       ${missing} file${missing !== 1 ? 's' : ''} not found.`);

if (changed > 0) {
  console.log('');
  console.log('Reminder: if you patched lesson-template.html or a lesson-N-specific.js file,');
  console.log('run:  node build-lessons.js  to regenerate the lesson HTML files.');
  console.log('If you patched fluency-template.html or fluency-config.json,');
  console.log('run:  node build-fluency.js  to regenerate the fluency HTML files.');
}
