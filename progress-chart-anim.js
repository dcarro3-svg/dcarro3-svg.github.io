// progress-chart-anim.js
// Drives the two-panel animation on progress-chart.html.
// Left panel: within-session cumulative correct vs. time (SVG, RAF-driven).
// Right panel: day-to-day semi-log CPM chart (SVG, RAF-driven).
// No user input. Loops automatically.

// ── Seeded LCG ────────────────────────────────────────────────────────────────
function lcg(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// ── Session data ───────────────────────────────────────────────────────────────
// Generates a deterministic set of answer events (correct/error) for a 60-second
// drill session. Intervals shrink over time (student speeds up mid-session).
const SESSION_EVENTS = (function () {
  const r = lcg(0xF00D);
  const evs = [];
  let t = 0;
  for (let i = 0; t < 59.5 && i < 90; i++) {
    const p = Math.min(i / 78, 1);
    const base = 0.94 - p * 0.18;                      // 0.94s → 0.76s
    const interval = Math.max(0.30, base + (r() - 0.5) * 0.38);
    t += interval;
    if (t >= 60) break;
    evs.push({ t: +t.toFixed(3), correct: r() > 0.094 });
  }
  // Guarantee goal is reached (≥ 62 correct) for a compelling demo
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

// ── Session chart SVG ──────────────────────────────────────────────────────────
// X axis: session time 0–60 s
// Y axis: cumulative correct answers (0–72)
// Amber dashed goal line: diagonal from (0,0) to (60s, 60 correct)
function renderSessionSVG(sessionT) {
  const W = 480, H = 300;
  const PL = 46, PR = 20, PT = 28, PB = 44;
  const CW = W - PL - PR, CH = H - PT - PB;
  const Y_MAX = 72;

  const xAt = t => PL + (t / 60) * CW;
  const yAt = c => H - PB - (Math.min(c, Y_MAX) / Y_MAX) * CH;

  // Grid + tick labels
  let grid = '';
  [15, 30, 45, 60].forEach(t => {
    const x = xAt(t).toFixed(1);
    grid += `<line x1="${x}" y1="${PT}" x2="${x}" y2="${H - PB}" stroke="#ede8de" stroke-width="0.8"/>`;
    grid += `<text x="${x}" y="${H - PB + 14}" text-anchor="middle" font-size="9" font-family="monospace" fill="#7a7163">${t}s</text>`;
  });
  [0, 15, 30, 45, 60].forEach(c => {
    const y = yAt(c).toFixed(1);
    grid += `<line x1="${PL}" y1="${y}" x2="${W - PR}" y2="${y}" stroke="${c === 0 ? '#9b9591' : '#ede8de'}" stroke-width="${c === 0 ? 1.2 : 0.8}"/>`;
    grid += `<text x="${PL - 5}" y="${(parseFloat(y) + 3.5).toFixed(1)}" text-anchor="end" font-size="9" font-family="monospace" fill="#7a7163">${c}</text>`;
  });

  // Axes
  const axes = `
    <line x1="${PL}" y1="${PT}" x2="${PL}" y2="${H - PB}" stroke="#9b9591" stroke-width="1.2"/>
    <line x1="${PL}" y1="${H - PB}" x2="${W - PR}" y2="${H - PB}" stroke="#9b9591" stroke-width="1.2"/>`;

  // Goal line (diagonal) with label
  const gx2 = (PL + CW).toFixed(1);
  const gy2 = yAt(60).toFixed(1);
  const goalLine = `<line x1="${PL}" y1="${yAt(0).toFixed(1)}" x2="${gx2}" y2="${gy2}"
    stroke="#c17f3b" stroke-width="1.8" stroke-dasharray="6,4" opacity="0.6"/>`;
  const goalLabel = `<text x="${parseFloat(gx2) + 3}" y="${parseFloat(gy2) + 3}"
    font-size="9" font-family="monospace" fill="#c17f3b" opacity="0.85">60</text>`;

  // Session dots
  let dots = '';
  let cumC = 0;
  SESSION_EVENTS.forEach(ev => {
    if (ev.t > sessionT) return;
    const x = xAt(ev.t).toFixed(1);
    if (ev.correct) {
      cumC++;
      const y = yAt(cumC).toFixed(1);
      dots += `<circle cx="${x}" cy="${y}" r="2.8" fill="#3d5c3a"/>`;
    } else {
      const y = yAt(cumC).toFixed(1); // same level — correct count didn't advance
      dots += `<circle cx="${x}" cy="${y}" r="2.4" fill="none" stroke="#c17f3b" stroke-width="1.3" opacity="0.6"/>`;
    }
  });

  const visibleCorrect = SESSION_EVENTS.filter(e => e.t <= sessionT && e.correct).length;

  // Moving cursor
  const cursor = sessionT < 60
    ? `<line x1="${xAt(sessionT).toFixed(1)}" y1="${PT}" x2="${xAt(sessionT).toFixed(1)}" y2="${H - PB}"
        stroke="#c17f3b" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.4"/>`
    : '';

  // Score label (top-right)
  const done = sessionT >= 60;
  const scoreLabel = done
    ? `<text x="${W - PR - 4}" y="${PT + 14}" text-anchor="end" font-size="12"
        font-family="monospace" fill="#3d5c3a" font-weight="bold">${SESSION_CPM}/min${SESSION_CPM >= GOAL ? ' ✓' : ''}</text>`
    : `<text x="${W - PR - 4}" y="${PT + 14}" text-anchor="end" font-size="10"
        font-family="monospace" fill="#7a7163">${visibleCorrect} correct</text>`;

  // Y-axis label
  const yLabel = `<text x="11" y="${(H / 2).toFixed(1)}" text-anchor="middle"
    font-size="9" font-family="monospace" fill="#7a7163"
    transform="rotate(-90,11,${(H / 2).toFixed(1)})">cumulative correct</text>`;

  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="max-width:100%;height:auto">
    <rect width="${W}" height="${H}" fill="white"/>
    ${grid}${goalLabel}${goalLine}${axes}${cursor}${dots}${scoreLabel}${yLabel}
  </svg>`;
}

// ── Daily chart SVG ───────────────────────────────────────────────────────────
// Semi-log CPM chart, same style as fluency demo.
// todayDotR: 0 = not shown; > 0 = today's dot radius (drives pop animation).
const LOG_MIN = Math.log10(0.5);
const LOG_MAX = Math.log10(100);

function toLogY(val, H, PT, PB) {
  const pct = (Math.log10(Math.max(val, 0.5)) - LOG_MIN) / (LOG_MAX - LOG_MIN);
  return PT + (1 - pct) * (H - PT - PB);
}

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

  // Grid + goal line
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

  // X axis date labels
  let xLabels = '';
  for (let di = 0; di < totalDays; di++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + di);
    const x = PL + (di / Math.max(totalDays - 1, 1)) * CW;
    xLabels += `<text x="${x.toFixed(1)}" y="${H - PB + 14}"
      text-anchor="middle" font-size="9" fill="#7a7163" font-family="monospace">${d.getMonth() + 1}/${d.getDate()}</text>`;
  }

  // Sessions
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
    const r = isToday ? todayDotR.toFixed(1) : '4.5';
    const fill = isToday && s.cpm >= GOAL ? '#e8b84b' : '#3d5c3a';
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${fill}" stroke="white" stroke-width="1.5"/>`;

    // Score label above dot
    const labelY = (y - 9).toFixed(1);
    const labelFill = isToday && s.cpm >= GOAL ? '#c17f3b' : '#3d5c3a';
    const fw = isToday ? ' font-weight="600"' : '';
    dots += `<text x="${x.toFixed(1)}" y="${labelY}" text-anchor="middle"
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
const ANIM_SPEED   = 4;          // session seconds per real second
const T_SES_DONE   = 60 / ANIM_SPEED;           // 15 s real
const T_DOT_START  = T_SES_DONE + 1.4;          // 16.4 s — dot begins popping
const T_DOT_PEAK   = T_DOT_START + 0.25;        // 16.65 s — dot at largest
const T_DOT_DONE   = T_DOT_START + 0.55;        // 16.95 s — pop settled
const T_LOOP       = T_DOT_DONE + 6;            // ~23 s — loop

let animStart = null;

function animLoop(now) {
  if (!animStart) animStart = now;
  const tReal = (now - animStart) / 1000;

  // Session chart
  const sessionT = Math.min(tReal * ANIM_SPEED, 60);
  document.getElementById('sessionChartEl').innerHTML = renderSessionSVG(sessionT);

  // Today's dot radius (drives pop: 0 → 9 at peak → 6 settled)
  let todayR = 0;
  if (tReal >= T_DOT_START) {
    if (tReal < T_DOT_PEAK) {
      const p = (tReal - T_DOT_START) / (T_DOT_PEAK - T_DOT_START);
      todayR = p * 9;
    } else if (tReal < T_DOT_DONE) {
      const p = (tReal - T_DOT_PEAK) / (T_DOT_DONE - T_DOT_PEAK);
      todayR = 9 - p * 3; // 9 → 6
    } else {
      todayR = 6;
    }
  }
  document.getElementById('dailyChartEl').innerHTML = renderDailySVG(todayR);

  if (tReal >= T_LOOP) animStart = now;

  requestAnimationFrame(animLoop);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(animLoop));
} else {
  requestAnimationFrame(animLoop);
}
