#!/usr/bin/env node
// build-fact-lessons.js
// Reads fact-lesson-template.html, fact-lesson-numonly-template.html,
// and fact-lesson-config.json to generate all lesson HTML files.
// Run: node build-fact-lessons.js

const fs = require('fs');

const barTemplate    = fs.readFileSync('fact-lesson-template.html', 'utf8');
const numonlyTemplate = fs.readFileSync('fact-lesson-numonly-template.html', 'utf8');
const config         = JSON.parse(fs.readFileSync('fact-lesson-config.json', 'utf8'));

const CHART_HREF = 'chart.html';

// Build a human-readable label from the entry
function makeLabel(item) {
  if (item.type === 'numonly') {
    const sep = item.factType === 'add' ? ' · ' : '×';
    const famsStr = item.fams.map(f =>
      item.factType === 'add'
        ? `${f[0]}·${f[1]}·${f[2]}`
        : `${f[0]}×${f[1]}=${f[2]}`
    ).join(', ');
    return `Review: ${famsStr}`;
  }
  if (item.type === 'add') {
    return `${item.famA[0]} · ${item.famA[1]} · ${item.famA[2]}  and  ${item.famB[0]} · ${item.famB[1]} · ${item.famB[2]}`;
  }
  // mult: famA and famB are now [partSize, numParts, whole] arrays
  return `${item.famA[0]}×${item.famA[1]}=${item.famA[2]}  and  ${item.famB[0]}×${item.famB[1]}=${item.famB[2]}`;
}

config.forEach(item => {
  const label = makeLabel(item);

  let output;

  if (item.type === 'numonly') {
    output = numonlyTemplate
      .replaceAll('%%FACT_TYPE%%',   item.factType)
      .replaceAll('%%LABEL%%',       label)
      .replaceAll('%%FAMS%%',        JSON.stringify(item.fams))
      .replaceAll('%%STORAGE_KEY%%', item.storageKey)
      .replaceAll('%%CHART_ID%%',    item.chartId)
      .replaceAll('%%CHART_HREF%%',  CHART_HREF)
      .replaceAll('%%NEXT_HREF%%',   item.nextHref);
  } else {
    output = barTemplate
      .replaceAll('%%FACT_TYPE%%',   item.type)
      .replaceAll('%%LABEL%%',       label)
      .replaceAll('%%FAM_A%%',       JSON.stringify(item.famA))
      .replaceAll('%%FAM_B%%',       JSON.stringify(item.famB))
      .replaceAll('%%STORAGE_KEY%%', item.storageKey)
      .replaceAll('%%CHART_ID%%',    item.chartId)
      .replaceAll('%%CHART_HREF%%',  CHART_HREF)
      .replaceAll('%%NEXT_HREF%%',   item.nextHref);
  }

  fs.writeFileSync(item.output, output, 'utf8');
  console.log(`✓  ${item.output}  (${label})`);
});

console.log(`\nDone — ${config.length} lesson files generated.`);
