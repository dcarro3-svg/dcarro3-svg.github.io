#!/usr/bin/env node
// build-computation.js
// Reads computation-fluency-template.html + computation-config.json
// Generates one computation fluency HTML file per config entry
// Run: node build-computation.js

const fs = require('fs');

const template = fs.readFileSync('computation-fluency-template.html', 'utf8');
const config   = JSON.parse(fs.readFileSync('computation-config.json', 'utf8'));

config.forEach(item => {
  const output = template
    .replaceAll('%%ID%%',          item.id)
    .replaceAll('%%LABEL%%',       item.label)
    .replaceAll('%%COMP_TYPE%%',   item.compType)
    .replaceAll('%%STORAGE_KEY%%', item.storageKey)
    .replaceAll('%%CHART_ID%%',    item.chartId)
    .replaceAll('%%CHART_HREF%%',  item.chartHref)
    .replaceAll('%%INTRO_Q%%',     item.introQ)
    .replaceAll('%%INTRO_DESC%%',  item.introDesc);

  fs.writeFileSync(item.output, output, 'utf8');
  console.log(`✓ Generated ${item.output}  (${item.label})`);
});

console.log(`\nDone — ${config.length} file${config.length !== 1 ? 's' : ''} generated.`);
