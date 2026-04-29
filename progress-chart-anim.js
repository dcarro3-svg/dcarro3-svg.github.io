// progress-chart-anim.js
// Drives the two-panel animation on progress-chart.html.
// Left panel:  within-day timings — one dot per 60-second drill, X = timing number.
// Right panel: day-to-day semi-log CPM chart — one dot per day.
// No user input. Loops automatically.

// ── Seeded LCG ────────────────────────────────────────────────────────────────
function lcg(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// ── Session data (used only to derive SESSION_CPM) ────────────────────────────
const SESSION_EVENTS = (function () {
  const r = lcg(0xF00D);
  const evs = [];
  let t = 0;
  for (let i = 0; t < 59.5 && i < 90; i++) {
    const p = Math.min(i / 78, 1);
    const base = 0.94 - p * 0.18;
    const interval = Math.max(0.30, base + (r() - 0.5) * 0.38);
    t += interval;
    if (t >= 60) break;
    evs.push({ t: +t.toFixed(3), correct: r() > 0.094 });
  }
  let nc = evs.filter(e => e.correct).length;
  if (nc < 62) {
    evs.filter(e => !e.correct)
       .slice(0, 62 - nc)
       .forEach(e => { e.correct = true; });
  }
  return evs;
}());

const SESSION_CPM = SESSION_EVENTS.filter(e => e.correct).length;
const GOAL = 60;

// ── Within-day timing data ─────────────────────────────────────────────────────
// Prior timings completed today before the current (animated) one.
const TIMING_PRIOR = [
  { n: 1, cpm: 51 },
  { n: 2, cpm: 54 },
  { n: 3, cpm: 57 },
  { n: 4, cpm: 59 },
];
const TIMING_CURRENT_N = TIMING_PRIOR.length + 1;  // = 5

// ── Daily data ─────────────────────────────────────────────────────────────────
const _now = new Date();
function _daysAgo(n) {
  const d = new Date(_now);
  d.setDate(d.getDate() - n);
  d.setHours(10, 0, 0, 0);
  return d;
}

const DAILY_PRIOR = [
  { date: _daysAgo(7), cpm: 33 },
  { date: _daysAgo(6), cpm: 38 },
  { date: _daysAgo(5), cpm: 43 },
  { date: _daysAgo(4), cpm: 48 },
  { date: _daysAgo(3), cpm: 52 },
  { date: _daysAgo(2), cpm: 56 },
  { date: _daysAgo(1), cpm: 59 },
];

// ── Shared log-scale helper ────────────────────────────────────────────────────
const LOG_MIN = Math.log10(0.5);
const LOG_MAX = Math.log10(100);

function toLogY(val, H, PT, PB) {
  const pct = (Math.log10(Math.max(val, 0.5)) - LOG_MIN) / (LOG_MAX - LOG_MIN);
  return PT + (1 - pct) * (H - PT - PB);
}

// ── Within-day timings chart SVG ──────────────────────────────────────────────
// X axis: timing number (1, 2, 3 …)  — one dot per completed 60-second drill
// Y axis: correct / min, same semi-log scale as the daily chart
// timingDotR: 0 = current timing not yet shown; > 0 = pop radius
function renderTimingsSVG(timingDotR) {
  const W = 480, H = 300;
  const PT = 24, PB = 48, PL = 50, PR = 28;
  const CW = W - PL - PR;

  const N_SHOWN = TIMING_CURRENT_N;   // x axis spans 1 … N_SHOWN
  function xAt(n) {
    return PL + ((n - 1) / Math.max(N_SHOWN - 1, 1)) * CW;
  }

  // Y grid + goal line (identical style to daily chart)
  const Y_TICKS = [1, 2, 5, 10, 20, 30, 40, 50, 60, 70, 100];
  const LABELED = new Set([1, 5, 10, 20, 30, 60, 100]);
  let grid = '';
  Y_TICKS.forEach(v => {
    const y = toLogY(v, H, PT, PB);
    if (y < PT - 2 || y > H - PB + 2) return;
    grid += `<line x1="${PL}" x2="${W - PR}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"
      stroke="${[1, 10, 100].includes(v) ? '#d8cfbe' : '#ede8de'}"
      stroke-width="${[1, 10, 100].includes(v) ? 1.2 : 0.6}"/>`;
    if (LABELED.has(v)) {
      grid += `<text x="${PL - 5}" y="${(y + 3.5).toFixed(1)}"
        text-anchor="end" font-size="10" fill="#7a7163" font-family="monospace">${v}</text>`;
    }
  });

  const aimY = toLogY(GOAL, H, PT, PB);
  grid += `<line x1="${PL}" x2="${W - PR}" y1="${aimY.toFixed(1)}" y2="${aimY.toFixed(1)}"
    stroke="#c17f3b" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.75"/>`;
  grid += `<text x="${W - PR + 4}" y="${(aimY + 4).toFixed(1)}"
    font-size="9" fill="#c17f3b" font-family="monospace" opacity="0.85">60</text>`;

  // X axis: timing number labels
  let xLabels = '';
  for (let n = 1; n <= N_SHOWN; n++) {
    xLabels += `<text x="${xAt(n).toFixed(1)}" y="${H - PB + 14}"
      text-anchor="middle" font-size="9" fill="#7a7163" font-family="monospace">${n}</text>`;
  }

  // Build timing list (prior + current if popping)
  const timings = [...TIMING_PRIOR];
  const showCurrent = timingDotR > 0;
  if (showCurrent) timings.push({ n: TIMING_CURRENT_N, cpm: SESSION_CPM });

  // Connecting line
  let pathD = '';
  timings.forEach((s, i) => {
    const x = xAt(s.n), y = toLogY(s.cpm, H, PT, PB);
    pathD += i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const path = pathD
    ? `<path d="${pathD}" fill="none" stroke="#3d5c3a" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>`
    : '';

  // Dots + score labels
  let dots = '';
  timings.forEach((s, i) => {
    const x = xAt(s.n), y = toLogY(s.cpm, H, PT, PB);
    const isCurrent = showCurrent && i === timings.length - 1;
    const r    = isCurrent ? timingDotR.toFixed(1) : '4.5';
    const fill = isCurrent && s.cpm >= GOAL ? '#e8b84b' : '#3d5c3a';
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${fill}" stroke="white" stroke-width="1.5"/>`;

    const labelFill = isCurrent && s.cpm >= GOAL ? '#c17f3b' : '#3d5c3a';
    const fw = isCurrent ? ' font-weight="600"' : '';
    dots += `<text x="${x.toFixed(1)}" y="${(y - 9).toFixed(1)}" text-anchor="middle"
      font-size="${isCurrent ? 10 : 9}" fill="${labelFill}" font-family="monospace"${fw}>${s.cpm}</text>`;
  });

  const axes = `
    <line x1="${PL}" y1="${PT}" x2="${PL}" y2="${H - PB}" stroke="#9b9591" stroke-width="1.2"/>
    <line x1="${PL}" y1="${H - PB}" x2="${W - PR}" y2="${H - PB}" stroke="#9b9591" stroke-width="1.2"/>`;

  const yLabel = `<text x="12" y="${(H / 2).toFixed(1)}" text-anchor="middle"
    font-size="10" fill="#7a7163" font-family="monospace"
    transform="rotate(-90,12,${(H / 2).toFixed(1)})">correct / min</text>`;

  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="max-width:100%;height:auto">
    <rect width="${W}" height="${H}" fill="white"/>
    ${grid}${xLabels}${axes}${path}${dots}${yLabel}
  </svg>`;
}

// ── Daily chart SVG ───────────────────────────────────────────────────────────
// todayDotR: 0 = not shown; > 0 = today's dot pop radius
function renderDailySVG(todayDotR) {
  const W = 520, H = 300;
  const PT = 24, PB = 48, PL = 50, PR = 28;
  const CW = W - PL - PR;

  const startDate = new Date(DAILY_PRIOR[0].date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(_now);
  endDate.setHours(0, 0, 0, 0);
  const totalDays = Math.round((endDate - startDate) / 86400000) + 1;

  function xAt(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const idx = Math.round((d - startDate) / 86400000);
    return PL + (idx / Math.max(totalDays - 1, 1)) * CW;
  }

  const Y_TICKS = [1, 2, 5, 10, 20, 30, 40, 50, 60, 70, 100];
  const LABELED = new Set([1, 5, 10, 20, 30, 60, 100]);
  let grid = '';
  Y_TICKS.forEach(v => {
    const y = toLogY(v, H, PT, PB);
    if (y < PT - 2 || y > H - PB + 2) return;
    grid += `<line x1="${PL}" x2="${W - PR}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"
      stroke="${[1, 10, 100].includes(v) ? '#d8cfbe' : '#ede8de'}"
      stroke-width="${[1, 10, 100].includes(v) ? 1.2 : 0.6}"/>`;
    if (LABELED.has(v)) {
      grid += `<text x="${PL - 5}" y="${(y + 3.5).toFixed(1)}"
        text-anchor="end" font-size="10" fill="#7a7163" font-family="monospace">${v}</text>`;
    }
  });

  const aimY = toLogY(GOAL, H, PT, PB);
  grid += `<line x1="${PL}" x2="${W - PR}" y1="${aimY.toFixed(1)}" y2="${aimY.toFixed(1)}"
    stroke="#c17f3b" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.75"/>`;
  grid += `<text x="${W - PR + 4}" y="${(aimY + 4).toFixed(1)}"
    font-size="9" fill="#c17f3b" font-family="monospace" opacity="0.85">60</text>`;

  let xLabels = '';
  for (let di = 0; di < totalDays; di++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + di);
    const x = PL + (di / Math.max(totalDays - 1, 1)) * CW;
    xLabels += `<text x="${x.toFixed(1)}" y="${H - PB + 14}"
      text-anchor="middle" font-size="9" fill="#7a7163" font-family="monospace">${d.getMonth() + 1}/${d.getDate()}</text>`;
  }

  const sessions = [...DAILY_PRIOR];
  const showToday = todayDotR > 0;
  if (showToday) sessions.push({ date: new Date(_now), cpm: SESSION_CPM });

  let pathD = '';
  let dots = '';
  sessions.forEach((s, i) => {
    const x = xAt(s.date);
    const y = toLogY(s.cpm, H, PT, PB);
    pathD += i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`;

    const isToday = showToday && i === sessions.length - 1;
    const r    = isToday ? todayDotR.toFixed(1) : '4.5';
    const fill = isToday && s.cpm >= GOAL ? '#e8b84b' : '#3d5c3a';
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${fill}" stroke="white" stroke-width="1.5"/>`;

    const labelFill = isToday && s.cpm >= GOAL ? '#c17f3b' : '#3d5c3a';
    const fw = isToday ? ' font-weight="600"' : '';
    dots += `<text x="${x.toFixed(1)}" y="${(y - 9).toFixed(1)}" text-anchor="middle"
      font-size="${isToday ? 10 : 9}" fill="${labelFill}" font-family="monospace"${fw}>${s.cpm}</text>`;
  });

  const path = pathD
    ? `<path d="${pathD}" fill="none" stroke="#3d5c3a" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>`
    : '';

  const axes = `
    <line x1="${PL}" y1="${PT}" x2="${PL}" y2="${H - PB}" stroke="#9b9591" stroke-width="1.2"/>
    <line x1="${PL}" y1="${H - PB}" x2="${W - PR}" y2="${H - PB}" stroke="#9b9591" stroke-width="1.2"/>`;

  const yLabel = `<text x="12" y="${(H / 2).toFixed(1)}" text-anchor="middle"
    font-size="10" fill="#7a7163" font-family="monospace"
    transform="rotate(-90,12,${(H / 2).toFixed(1)})">correct / min</text>`;

  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="max-width:100%;height:auto">
    <rect width="${W}" height="${H}" fill="white"/>
    ${grid}${xLabels}${axes}${path}${dots}${yLabel}
  </svg>`;
}

// ── Animation loop ─────────────────────────────────────────────────────────────
// Phase 1 (0 → T_TIM_START):  prior timing dots visible, right chart static
// Phase 2 (T_TIM_*):          timing-5 dot pops onto LEFT chart
// Phase 3 (T_DAY_*):          today's dot pops onto RIGHT chart
// Phase 4 (settled → T_LOOP): both charts fully visible
const T_TIM_START = 2.5;
const T_TIM_PEAK  = T_TIM_START + 0.25;
const T_TIM_DONE  = T_TIM_START + 0.55;

const T_DAY_START = T_TIM_DONE + 1.25;
const T_DAY_PEAK  = T_DAY_START + 0.25;
const T_DAY_DONE  = T_DAY_START + 0.55;

const T_LOOP = T_DAY_DONE + 5;

let animStart = null;

function popRadius(tReal, tStart, tPeak, tDone) {
  if (tReal < tStart) return 0;
  if (tReal < tPeak)  return (tReal - tStart) / (tPeak - tStart) * 9;
  if (tReal < tDone)  return 9 - (tReal - tPeak) / (tDone - tPeak) * 3;
  return 6;
}

function animLoop(now) {
  if (!animStart) animStart = now;
  const tReal = (now - animStart) / 1000;

  const timingR = popRadius(tReal, T_TIM_START, T_TIM_PEAK, T_TIM_DONE);
  const todayR  = popRadius(tReal, T_DAY_START, T_DAY_PEAK, T_DAY_DONE);

  document.getElementById('sessionChartEl').innerHTML = renderTimingsSVG(timingR);
  document.getElementById('dailyChartEl').innerHTML   = renderDailySVG(todayR);

  if (tReal >= T_LOOP) animStart = now;

  requestAnimationFrame(animLoop);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(animLoop));
} else {
  requestAnimationFrame(animLoop);
}
