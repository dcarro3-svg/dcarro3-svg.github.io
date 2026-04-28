#!/usr/bin/env node
// build-fluency.js
// Reads fluency-template.html and fluency-config.json
// Generates all five fluency HTML files
// Run: node build-fluency.js

const fs = require('fs');
const path = require('path');

const template = fs.readFileSync('fluency-template.html', 'utf8');
const config = JSON.parse(fs.readFileSync('fluency-config.json', 'utf8'));

config.forEach(lesson => {
  let output = template
    .replaceAll('%%ID%%', lesson.id)
    .replaceAll('%%LABEL%%', lesson.label)
    .replaceAll('%%STORAGE_KEY%%', lesson.storageKey)
    .replaceAll('%%LESSON_TYPE%%', lesson.lessonType)
    .replaceAll('%%LESSON_HREF%%', lesson.lessonHref)
    .replaceAll('%%CHART_HREF%%', lesson.chartHref);

  fs.writeFileSync(lesson.output, output, 'utf8');
  console.log(`✓ Generated ${lesson.output}`);
});

console.log(`\nDone — ${config.length} files generated.`);
