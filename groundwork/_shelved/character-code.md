---
# Shelved Character Code
# Extracted from source templates. Re-implement when character assets are ready.
# Images that were removed (move back from _shelved/images/ when ready):
#   pigeon.png, crow typing.png, crow.png, octopus.png, books.png,
#   fountain pen.png, packrat.png, study rat.png, pigeon teaching.png,
#   exclamation.png, exclamation .png, question.png, medal.png
---

## ── LESSON TEMPLATE (lesson-template.html) ──────────────────────────────────

### CSS — crow-note annotation
Belonged after `.instruct-text.positive` block:
```css
.crow-note{display:flex;align-items:center;gap:10px;margin-bottom:10px;animation:fadeUp 0.2s ease;}
.crow-note img{width:38px;height:38px;object-fit:contain;image-rendering:pixelated;flex-shrink:0;}
.crow-note span{font-size:13px;font-weight:600;color:var(--text-primary);font-style:italic;}
```

### JS — crow lines, crowLine(), crowNote()
Belonged before `showInstruct()`. `crowNote()` was inserted above the model in
`showInstructItem()` (when errors > 0) and `showInstructFUError()` (always):
```js
const CROW_LINES = [
  'Look at the bars again.',
  'Not quite. What does the picture show?',
  'That wasn\'t it. Try again.',
  'Look more carefully.',
  'Read the bars, not the answer.',
  'Think about what you see.',
  'Almost. Look again.',
  'Not that one.',
];
function crowLine() { return CROW_LINES[Math.floor(Math.random()*CROW_LINES.length)]; }
function crowNote() { return `<div class="crow-note"><img src="Icons/crow typing.png" alt="Crow"><span>${crowLine()}</span></div>`; }
```

Call sites to restore in lesson-template.html:
- `showInstructItem()`:  `const crowHtml = S.instructItemErrors > 0 ? crowNote() : '';`
- `showInstructFUError()`: prepend `${crowNote()}` before `${modelHtml}` in the render() call

### JS — audioBtn() with crow image (original)
Replace the current SVG-only version:
```js
function audioBtn() {
  return `<button class="audio-indicator" id="audioBtn" onclick="replayAudio()" style="width:100px;height:100px;">
    <img src="Icons/crow typing.png" alt="Replay" style="width:100px;height:100px;object-fit:contain;image-rendering:pixelated;">
  </button>`;
}
```


## ── FLUENCY TEMPLATE (fluency-template.html) ─────────────────────────────────

### CSS — pig-intro and pigeon overlay
Belonged in the main <style> block:
```css
.pig-intro{display:flex;align-items:center;gap:12px;margin:14px 0 4px;}
.pig-intro img{width:48px;height:auto;image-rendering:pixelated;flex-shrink:0;}
.pig-intro-line{font-size:13px;font-weight:600;color:var(--text-secondary);font-style:italic;}
```

Belonged in the second <style> block (after draw tool):
```css
/* ── Pigeon Transition Overlay ───────────────────────────────────────── */
@keyframes overlayFadeIn { from{opacity:0} to{opacity:1} }
@keyframes pigeonSlideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
#pigeon-overlay { position:fixed;inset:0;background:rgba(21,9,52,0.88);
  display:flex;align-items:center;justify-content:center;z-index:9999;
  animation:overlayFadeIn 0.35s ease forwards; }
#pigeon-overlay .pig-inner { display:flex;flex-direction:column;align-items:center;gap:0;
  animation:pigeonSlideUp 0.5s ease 0.1s both; }
#pigeon-overlay .pig-bubble { background:#FBF0E4;border:3px solid #D4600A;border-radius:12px;
  padding:14px 28px;font-family:'DM Sans',sans-serif;font-size:20px;font-weight:700;
  color:#1E1530;white-space:nowrap;margin-bottom:14px;text-align:center;
  box-shadow:0 4px 20px rgba(0,0,0,0.18); }
#pigeon-overlay .pig-exclaim { color:#D4600A; }
#pigeon-overlay .pig-sub { font-size:15px;font-weight:600;color:#5a3a1a;margin-top:8px;white-space:normal;max-width:280px; }
#pigeon-overlay .pig-link a { color:#6845A8;text-decoration:underline; }
#pigeon-overlay img { width:280px;height:auto;image-rendering:pixelated; }
```

### JS — pigeon dialogue pools and showPigeonTransition()
Belonged before `showIntro()`. The pig-intro line
`<div class="pig-intro"><img src="Icons/pigeon.png" alt="Pigeon"><div class="pig-intro-line">${pigLine(PIG_BEFORE)}</div></div>`
was placed inside showIntro() just before the Start button.
```js
const PIG_BEFORE = [
  'Ready when you are.',
  'Take your time getting started.',
  'No rush. I\'ll be here.',
  'Whenever you\'re set.',
  'I\'ll be watching. In a good way.',
  'You\'ve done this before. You know what to do.',
];
const PIG_AFTER = [
  'That was a good one.',
  'Good work.',
  'That went well.',
  'You showed up. That matters.',
  'Let\'s see where that lands.',
];
const PIG_IMPROVED = [
  'You\'re getting it.',
  'That one was better.',
  'Getting closer.',
  'That\'s a real improvement.',
  'Progress. Quiet, steady progress.',
];
function pigLine(pool){ return pool[Math.floor(Math.random()*pool.length)]; }

// Full showPigeonTransition — replace the stub in the template:
function showPigeonTransition(delayMs) {
  setTimeout(() => {
    try { localStorage.setItem('chart_new_lesson', String(CFG.id)); } catch(e) {}

    const currentCpm = S.cor * 2;
    const prevSessions = loadSessions().slice(0, -1);
    const prevBest = prevSessions.reduce((best, s) => Math.max(best, s.cpm || 0), 0);
    const improved = prevBest > 0 && currentCpm > prevBest;

    const PASSOFF_AIM = 30, CELERATION = 1.5;
    let todayGoal = null;
    if (prevSessions.length) {
      const byDay = {};
      prevSessions.forEach(s => {
        const dk = s.date ? s.date.slice(0,10) : '';
        if (!byDay[dk] || (s.cpm||0) > (byDay[dk].cpm||0)) byDay[dk] = s;
      });
      const daily = Object.values(byDay).sort((a,b) => new Date(a.date)-new Date(b.date));
      const best = daily.reduce((b,s) => (s.cpm||0) > (b.cpm||0) ? s : b, daily[0]);
      const anchorRate = best.cpm || 1;
      const weeksElapsed = (new Date() - new Date(best.date)) / (7*24*60*60*1000);
      const steepened = PASSOFF_AIM / anchorRate;
      const cel = Math.max(steepened, CELERATION);
      todayGoal = Math.min(anchorRate * Math.pow(cel, weeksElapsed), PASSOFF_AIM);
    }
    const twoBelowGoal = todayGoal !== null && currentCpm <= todayGoal - 2;

    const mainLine = improved ? pigLine(PIG_IMPROVED) : pigLine(PIG_AFTER);
    let subMsg = '';
    if (improved) {
      subMsg = `<div class="pig-sub">Let's chart it.</div>`;
    } else if (twoBelowGoal && CFG.lessonHref) {
      subMsg = `<div class="pig-sub pig-link">A refresher might help. <a href="${CFG.lessonHref}">Back to instruction →</a></div>`;
    } else {
      subMsg = `<div class="pig-sub">Let's chart your timing.</div>`;
    }

    const overlay = document.createElement('div');
    overlay.id = 'pigeon-overlay';
    overlay.innerHTML = `<div class="pig-inner">
      <div class="pig-bubble">
        ${mainLine}
        ${subMsg}
      </div>
      <img src="Icons/pigeon.png" alt="Pigeon">
    </div>`;
    document.body.appendChild(overlay);
    setTimeout(() => { window.location.href = CFG.chartHref; }, 2800);
  }, delayMs || 0);
}
```


## ── FACT/COMPUTATION TEMPLATES (shared pattern) ──────────────────────────────

All four templates (fact-fluency, fact-lesson, fact-lesson-numonly, computation-fluency)
share identical pig CSS and near-identical JS. Differences noted below.

### CSS — pig-intro + overlay (identical in all four)
```css
.pig-intro{display:flex;align-items:center;gap:12px;margin:14px 0 4px;}
.pig-intro img{width:48px;height:auto;image-rendering:pixelated;flex-shrink:0;}
.pig-intro-line{font-size:13px;font-weight:600;color:var(--text-secondary);font-style:italic;}
#pigeon-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(221,208,245,0.72);backdrop-filter:blur(4px);z-index:999;}
.pig-inner{display:flex;align-items:flex-end;gap:16px;padding:32px;}
.pig-inner img{width:100px;image-rendering:pixelated;}
.pig-bubble{background:var(--surface);border:2px solid var(--accent);border-radius:16px;padding:20px 24px;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:600;max-width:260px;line-height:1.5;}
.pig-sub{font-size:13px;font-weight:400;color:var(--text-secondary);margin-top:6px;}
.pig-link a{color:var(--accent);font-weight:600;}
```

### JS — pig pools per template

**fact-fluency-template.html** (uses CFG.id, redirects to CFG.chartHref):
```js
const PIG_BEFORE=['Ready when you are.','Take your time getting started.','Whenever you\'re set.','You\'ve done this before.','No rush. I\'ll be here.'];
const PIG_AFTER=['That was a good one.','Good work.','That went well.','You showed up. That matters.','Let\'s see where that lands.'];
const PIG_IMPROVED=['You\'re getting it.','That one was better.','Getting closer.','That\'s a real improvement.','Progress. Quiet, steady progress.'];
function pigLine(pool){return pool[Math.floor(Math.random()*pool.length)];}
```

**fact-lesson-template.html** (uses CFG.chartId, redirects to CFG.chartHref):
```js
const PIG_INTRO=['Here we go.','Two families. Let\'s learn them.','Take a good look.','Study the model first.'];
const PIG_FLUENCY=['Ready when you are.','You know these. Show it.','Go fast, stay accurate.','Here comes the clock.'];
const PIG_AFTER=['Good session.','That went well.','You showed up. That matters.','Let\'s see where that lands.'];
const PIG_IMPROVED=['You\'re getting it.','That\'s a real improvement.','Progress. Quiet, steady progress.'];
function pigLine(pool){return pool[Math.floor(Math.random()*pool.length)];}
// pig-intro in showLessonIntro(): pigLine(PIG_INTRO)
// pig-intro in showPreFluency():  pigLine(PIG_FLUENCY)
```

**fact-lesson-numonly-template.html** (uses CFG.chartId, redirects to CFG.nextHref):
```js
// Same PIG_INTRO, PIG_FLUENCY, PIG_AFTER, PIG_IMPROVED pools
// pig-intro in showLessonIntro(): pigLine(PIG_INTRO)
// pig-intro in showPreFluency():  pigLine(PIG_FLUENCY)
```

**computation-fluency-template.html** (uses CFG.chartId, redirects to CFG.chartHref):
```js
const PIG_BEFORE=['Ready when you are.','No rush. I\'ll be here.','Whenever you\'re set.','You know these. Show it.','Go fast, stay accurate.'];
const PIG_AFTER=['That was a good one.','Good work.','That went well.','You showed up. That matters.','Let\'s see where that lands.'];
const PIG_IMPROVED=['You\'re getting it.','That one was better.','Getting closer.','That\'s a real improvement.','Progress. Quiet, steady progress.'];
function pigLine(pool){return pool[Math.floor(Math.random()*pool.length)];}
```

### HTML — pig-intro line (same pattern in all intro screens)
```html
<div class="pig-intro"><img src="Icons/pigeon.png" alt="Pigeon"><div class="pig-intro-line">${pigLine(PIG_BEFORE_OR_INTRO)}</div></div>
```

### JS — full showPigeonTransition (fact/computation variant)
The full function before the stub. The redirect target and chart key differ per template:
```js
// fact-fluency: CFG.id, CFG.chartHref
// fact-lesson:  CFG.chartId, CFG.chartHref
// fact-numonly: CFG.chartId, CFG.nextHref
// computation:  CFG.chartId, CFG.chartHref
function showPigeonTransition(delayMs){
  setTimeout(()=>{
    try{localStorage.setItem('chart_new_lesson',String(CFG.id_or_chartId));}catch(e){}
    const currentCpm=S.cor;
    const prevSessions=loadSessions().slice(0,-1);
    const prevBest=prevSessions.reduce((best,s)=>Math.max(best,s.cpm||0),0);
    const improved=prevBest>0&&currentCpm>prevBest;
    const mainLine=improved?pigLine(PIG_IMPROVED):pigLine(PIG_AFTER);
    const subMsg=improved?`<div class="pig-sub">Let's chart it.</div>`:`<div class="pig-sub">Let's chart your timing.</div>`;
    const overlay=document.createElement('div');
    overlay.id='pigeon-overlay';
    overlay.innerHTML=`<div class="pig-inner"><div class="pig-bubble">${mainLine}${subMsg}</div><img src="Icons/pigeon.png" alt="Pigeon"></div>`;
    document.body.appendChild(overlay);
    setTimeout(()=>{window.location.href=CFG.chartHref_or_nextHref;},2800);
  },delayMs||0);
}
```


## ── INDEX.HTML ────────────────────────────────────────────────────────────────

### Study rat container (removed from banner, right side)
```html
<div id="study-rat-container" style="position:absolute;right:0;bottom:6px;width:500px;height:auto;cursor:pointer;">
  <img src="Icons/study rat.png" class="mascot" alt="Study rat" style="width:100%;height:auto;transform:scaleX(-1);">
  <div id="study-rat-bubble" style="position:absolute;top:50%;left:-20px;transform:translateY(-50%) scale(0.95);background:#FBF0E4;border:2px solid #D4600A;border-radius:8px;padding:10px 14px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:#1E1530;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity 0.2s,transform 0.2s;image-rendering:pixelated;font-weight:700;letter-spacing:0.5px;z-index:10;"></div>
</div>
```

### Study rat JS (RAT_GREETINGS + event listeners)
```js
const RAT_GREETINGS = [
  'Have you reviewed your notes from last session?',
  'Excellent. Punctuality is the foundation of mastery.',
  'I\'ve cross-referenced the curriculum. You\'re on track.',
  'Don\'t forget — spaced repetition is key.',
  'I\'ve been annotating. Shall we compare findings?',
  'Good. Consistency compounds. Let\'s not break the streak.',
  'I flagged three things worth revisiting. Ready?',
  'You\'re here. That already puts you ahead.',
  'I\'ve been waiting. I may have over-prepared.',
  'The data suggests you\'re improving. The data is correct.',
  'Focus is a muscle. Let\'s train it.',
  'I have thoughts on your pacing. Shall I share them?',
];

const ratContainer = document.getElementById('study-rat-container');
const ratBubble = document.getElementById('study-rat-bubble');

if (ratContainer && ratBubble) {
  ratContainer.addEventListener('mouseenter', () => {
    const greeting = RAT_GREETINGS[Math.floor(Math.random() * RAT_GREETINGS.length)];
    ratBubble.textContent = greeting;
    ratBubble.style.opacity = '1';
    ratBubble.style.transform = 'translateY(-50%) scale(1)';
  });
  ratContainer.addEventListener('mouseleave', () => {
    ratBubble.style.opacity = '0';
    ratBubble.style.transform = 'translateY(-50%) scale(0.95)';
  });
}
```

### Octopus container (below tutorial slides, right panel)
```html
<div id="octopus-container" style="position:relative;display:inline-block;cursor:pointer;margin-top:24px;">
  <img src="Icons/octopus.png" alt="Octopus" style="width:400px;height:auto;image-rendering:pixelated;display:block;">
  <div id="octopus-bubble" style="position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%) scale(0.95);background:#FBF0E4;border:2px solid #D4600A;border-radius:8px;padding:10px 14px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;color:#1E1530;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity 0.2s,transform 0.2s;image-rendering:pixelated;letter-spacing:0.5px;z-index:10;"></div>
</div>
```

### Octopus JS (OCT_GREETINGS + event listeners)
```js
const OCT_GREETINGS = [
  'Fascinating. You\'ve returned.',
  'I\'ve been watching. Two eyes, but I use them well.',
  'The deep sea teaches patience. So does math.',
  'Curious mind you have. I approve.',
  'Knowledge, like ink, spreads in all directions.',
  'Ah. Another problem to untangle.',
  'I once solved a maze in the dark. You can do this.',
  'Stillness first. Then the answer reveals itself.',
  'Every relation has two sides. I find that poetic.',
  'Most things make sense if you look long enough.',
  'You think with one brain. Impressive, given the limitation.',
  'The unknown is simply the known, waiting.',
];

const octContainer = document.getElementById('octopus-container');
const octBubble = document.getElementById('octopus-bubble');

if (octContainer && octBubble) {
  octContainer.addEventListener('mouseenter', () => {
    const greeting = OCT_GREETINGS[Math.floor(Math.random() * OCT_GREETINGS.length)];
    octBubble.textContent = greeting;
    octBubble.style.opacity = '1';
    octBubble.style.transform = 'translateX(-50%) scale(1)';
  });
  octContainer.addEventListener('mouseleave', () => {
    octBubble.style.opacity = '0';
    octBubble.style.transform = 'translateX(-50%) scale(0.95)';
  });
}
```


## ── CHART.HTML ────────────────────────────────────────────────────────────────

### Keep-going banner pigeon (inside updateLeafIcons/chart rendering)
The pigeon was shown when a session didn't meet today's goal:
```html
<img src="Icons/pigeon.png" alt="">
```
Inside the `keep-going-banner` div, before the `.keep-going-banner-text` div.
