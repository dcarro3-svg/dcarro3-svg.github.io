#!/usr/bin/env node
// build-lessons.js
// Generates all lesson HTML files from:
//   lesson-template.html   — shared engine (instruction phase, bar renderers, TTS, etc.)
//   lesson-config.json     — per-lesson metadata (title, label, hrefs, storage key)
//   lesson-N-specific.js   — per-lesson unique content (INSTRUCT, generators, phases)
//
// Run: node build-lessons.js
// GitHub Actions will run this automatically on push to any of the above files.

const fs = require('fs');

const template = fs.readFileSync('lesson-template.html', 'utf8');
const config = JSON.parse(fs.readFileSync('lesson-config.json', 'utf8'));

const lessonNames = ['one','two','three','four','five','compound'];

config.forEach((lesson, idx) => {
  const specificPath = `lesson-${lessonNames[idx]}-specific.js`;
  const specific = fs.readFileSync(specificPath, 'utf8');

  let output = template
    .replaceAll('%%TITLE%%',              lesson.title)
    .replaceAll('%%LABEL%%',              lesson.label)
    .replaceAll('%%LESSON_NUM%%',         String(lesson.lessonNum))
    .replaceAll('%%STORAGE_KEY%%',        lesson.storageKey)
    .replaceAll('%%FLUENCY_HREF%%',       lesson.fluencyHref)
    .replaceAll('%%NEXT_LESSON_HREF%%',   lesson.nextLessonHref)
    .replaceAll('%%NEXT_LESSON_LABEL%%',  lesson.nextLessonLabel)
    .replaceAll('%%COMPLETION_TITLE%%',   lesson.completionTitle)
    .replaceAll('%%COMPLETION_SUMMARY%%', lesson.completionSummary)
    .replaceAll('%%LESSON_SPECIFIC%%',    specific);

  fs.writeFileSync(lesson.output, output, 'utf8');
  console.log(`✓ Generated ${lesson.output}`);
});

console.log(`\nDone — ${config.length} lesson files generated.`);
