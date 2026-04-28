#!/usr/bin/env node
// build-fact-fluency.js
// Reads fact-fluency-template.html and fact-config.json
// Generates fact-fluency-add.html and fact-fluency-mult.html
// Run: node build-fact-fluency.js

const fs = require('fs');

const template = fs.readFileSync('fact-fluency-template.html', 'utf8');
const config = JSON.parse(fs.readFileSync('fact-config.json', 'utf8'));

config.forEach(item => {
  const output = template
    .replaceAll('%%ID%%', item.id)
    .replaceAll('%%LABEL%%', item.label)
    .replaceAll('%%FACT_TYPE%%', item.factType)
    .replaceAll('%%STORAGE_KEY%%', item.storageKey)
    .replaceAll('%%LESSON_HREF%%', item.lessonHref)
    .replaceAll('%%CHART_HREF%%', item.chartHref);

  fs.writeFileSync(item.output, output, 'utf8');
  console.log(`✓ Generated ${item.output}`);
});

console.log(`\nDone — ${config.length} files generated.`);
