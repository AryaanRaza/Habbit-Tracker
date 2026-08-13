// ─────────────────────────────────────────────
//  stats.js — HabitFlow Insights Page
//
//  How AI works:
//  - generateInsights() → calls your Express backend  →  /api/ai/insights
//  - sendChat()         → calls your Express backend  →  /api/ai/chat
//
//  In LOCAL TESTING you can temporarily point to Anthropic directly
//  (see AI_ENDPOINT below), but move it behind your backend before deploying
//  so your API key is never exposed in frontend code.
// ─────────────────────────────────────────────

// ── Config ───────────────────────────────────
// Change this to '/api/ai' once your Express backend is ready.
// For local testing you can use the Anthropic API directly (see callAI helper).
const USE_BACKEND = false;       // flip to true when backend is wired up
const BACKEND_BASE = '/api/ai';  // your Express route prefix

// ── Habit data ───────────────────────────────
// TODO: replace this with data fetched from your MongoDB via the backend
const habitData = {
  daysActive:   28,
  consistency:  92,
  streak:       12,
  longestStreak: 14,
  weekly: [60, 80, 40, 90, 100, 30, 50], // Mon–Sun
  categories: { Coding: 45, Health: 30, Reading: 25 },
  bestDay:  'Friday',
  worstDay: 'Saturday',
  score:    'A+',
};

// ── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setDate();
  populateMetrics();
  buildHeatmap();
  buildBarChart();
  buildDonutChart();
  updateStreakProgress();
});

// ── Date ─────────────────────────────────────
function setDate() {
  const el = document.getElementById('stats-date');
  if (el) {
    el.textContent = new Date().toLocaleDateString('en-US', {
      month: 'long', year: 'numeric'
    });
  }
}

// ── Metrics ───────────────────────────────────
function populateMetrics() {
  setText('m-days',        habitData.daysActive);
  setText('m-consistency', habitData.consistency + '%');
  setText('m-score',       habitData.score);
  // Streak has a <small> tag — handle separately
  const streakEl = document.getElementById('m-streak');
  if (streakEl) streakEl.innerHTML = `${habitData.streak} <small>days</small>`;
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ── Streak Progress Bar ───────────────────────
function updateStreakProgress() {
  const target = 30;
  const pct = Math.min(100, Math.round((habitData.streak / target) * 100));
  const fill = document.getElementById('streak-fill');
  const label = document.getElementById('streak-progress-label');
  if (fill)  fill.style.width = pct + '%';
  if (label) label.textContent = `${habitData.streak} / ${target} days`;
}

// ── Heatmap ───────────────────────────────────
const HM_COLORS = [
  '#1a1a20', // level 0 — none
  '#1c1835', // level 1 — low
  '#3C3489', // level 2 — medium-low
  '#534AB7', // level 3 — medium
  '#7F77DD', // level 4 — high
];

function buildHeatmap() {
  const grid = document.getElementById('heatmap');
  if (!grid) return;

  for (let i = 0; i < 84; i++) {
    // Cells are placed column-first (grid-auto-flow: column)
    // so i=0..6 → week 1, i=7..13 → week 2, etc.
    const weekIdx = Math.floor(i / 7);
    // Bias recent weeks towards higher completion
    const recency  = weekIdx / 12;
    const rand     = Math.random() + recency * 0.9;
    const level    = Math.min(4, Math.floor(rand * 3.5));

    const cell = document.createElement('div');
    cell.className       = 'hm-cell';
    cell.style.background = HM_COLORS[level];
    cell.title = level === 0
      ? 'No habits completed'
      : `${level} habit${level > 1 ? 's' : ''} completed`;
    grid.appendChild(cell);
  }

  // Legend dots
  HM_COLORS.forEach((c, i) => {
    const dot = document.getElementById(`hm${i}`);
    if (dot) dot.style.background = c;
  });
}

// ── Bar Chart ─────────────────────────────────
function buildBarChart() {
  const canvas = document.getElementById('barChart');
  if (!canvas) return;

  // Color bars: strong = dark purple, mid = mid purple, weak = light purple
  const colors = habitData.weekly.map(v =>
    v >= 80 ? '#534AB7' : v >= 50 ? '#7F77DD' : '#3C3489'
  );

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: habitData.weekly,
        backgroundColor: colors,
        borderRadius: 5,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => ctx.parsed.y + '%' },
        },
      },
      scales: {
        y: {
          min: 0, max: 100,
          ticks: {
            callback: v => v + '%',
            font:  { size: 10 },
            color: '#555',
            maxTicksLimit: 5,
          },
          grid: { color: 'rgba(255,255,255,0.05)' },
        },
        x: {
          ticks: { font: { size: 10 }, color: '#555' },
          grid: { display: false },
        },
      },
    },
  });
}

// ── Donut Chart ───────────────────────────────
function buildDonutChart() {
  const canvas = document.getElementById('donutChart');
  if (!canvas) return;

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: Object.keys(habitData.categories),
      datasets: [{
        data: Object.values(habitData.categories),
        backgroundColor: ['#7F77DD', '#1D9E75', '#D85A30'],
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: { legend: { display: false } },
    },
  });
}

// ── AI Helper ─────────────────────────────────
// Calls either your Express backend or Anthropic directly (local dev only)
async function callAI({ messages, system }) {
  if (USE_BACKEND) {
    // ── Production: call your Express /api/ai route ──
    const res = await fetch(`${BACKEND_BASE}/insights`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ messages, system }),
    });
    const data = await res.json();
    return data.reply; // your Express route should return { reply: "..." }

  } else {
    // ── Local dev: call Anthropic directly ──
    // ⚠️  NEVER ship this to production — API key will be visible
    const body = {
      model:      'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages,
    };
    if (system) body.system = system;

    const res  = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    const data = await res.json();
    return data.content[0].text;
  }
}

// ── Generate Insights ─────────────────────────
let insightsGenerated = false;

async function generateInsights() {
  const btn  = document.getElementById('ins-btn');
  const area = document.getElementById('ins-area');

  btn.disabled = true;
  btn.textContent = 'Analyzing...';
  area.innerHTML = '<p class="ins-placeholder">Reading your habit patterns...</p>';

  const prompt = `You are an AI habit coach. Analyze this data and return ONLY a raw JSON array of exactly 3 strings. Each string is one specific, actionable insight under 45 words. No preamble, no markdown, no backticks — just the raw JSON array.

Data:
- Days active: ${habitData.daysActive}/30, Consistency: ${habitData.consistency}%, Streak: ${habitData.streak} days (longest: ${habitData.longestStreak})
- Weekly: Mon ${habitData.weekly[0]}%, Tue ${habitData.weekly[1]}%, Wed ${habitData.weekly[2]}%, Thu ${habitData.weekly[3]}%, Fri ${habitData.weekly[4]}%, Sat ${habitData.weekly[5]}%, Sun ${habitData.weekly[6]}%
- Categories: Coding 45%, Health 30%, Reading 25%
- Best day: ${habitData.bestDay}, Worst day: ${habitData.worstDay}`;

  try {
    const text = await callAI({ messages: [{ role: 'user', content: prompt }] });

    let insights;
    try {
      insights = JSON.parse(text.trim());
    } catch {
      const match = text.match(/\[[\s\S]*?\]/);
      insights = match ? JSON.parse(match[0]) : [text.trim()];
    }

    area.innerHTML = insights.slice(0, 3).map((ins, i) => `
      <div class="insight-row">
        <span class="insight-num">${i + 1}</span>
        <p class="insight-text">${ins}</p>
      </div>
    `).join('');

    btn.textContent  = 'Regenerate';
    btn.disabled     = false;
    insightsGenerated = true;

  } catch (err) {
    console.error('Insights error:', err);
    area.innerHTML  = '<p style="color:#e05050;font-size:13px;">Could not generate insights. Try again.</p>';
    btn.textContent = 'Generate insights';
    btn.disabled    = false;
  }
}

// ── AI Chat ───────────────────────────────────
const chatHistory = [];

const SYSTEM_CONTEXT = `You are an AI habit coach embedded in HabitFlow.

User's current data:
- ${habitData.daysActive} days active, ${habitData.consistency}% consistency
- Current streak: ${habitData.streak} days (longest ever: ${habitData.longestStreak})
- Weekly completion: Mon ${habitData.weekly[0]}%, Tue ${habitData.weekly[1]}%, Wed ${habitData.weekly[2]}%, Thu ${habitData.weekly[3]}%, Fri ${habitData.weekly[4]}%, Sat ${habitData.weekly[5]}%, Sun ${habitData.weekly[6]}%
- Top categories: Coding 45%, Health 30%, Reading 25%
- Best day: ${habitData.bestDay}, Worst day: ${habitData.worstDay}

Keep replies under 90 words. Be specific, warm, and actionable. Reference the actual numbers when relevant.`;

async function sendChat() {
  const input = document.getElementById('chat-in');
  const msg   = input.value.trim();
  if (!msg) return;

  input.value = '';
  addBubble(msg, 'user');

  const loadingEl = addBubble('Thinking...', 'ai', true);
  chatHistory.push({ role: 'user', content: msg });

  try {
    const reply = await callAI({
      system:   SYSTEM_CONTEXT,
      messages: chatHistory,
    });

    chatHistory.push({ role: 'assistant', content: reply });
    loadingEl.textContent = reply;
    loadingEl.classList.remove('bubble-loading');

  } catch (err) {
    console.error('Chat error:', err);
    loadingEl.textContent = 'Error reaching AI coach. Please try again.';
    loadingEl.style.color = '#e05050';
    chatHistory.pop();
  }
}

function addBubble(text, type, isLoading = false) {
  const msgs = document.getElementById('chat-msgs');

  const wrap = document.createElement('div');
  wrap.className = `chat-bubble-wrap chat-bubble-wrap--${type}`;

  const bubble = document.createElement('div');
  bubble.textContent = text;
  bubble.className   = type === 'user' ? 'bubble-user' : 'bubble-ai';
  if (isLoading) bubble.classList.add('bubble-loading');

  wrap.appendChild(bubble);
  msgs.appendChild(wrap);

  // scroll to latest message
  msgs.scrollTop = msgs.scrollHeight;
  return bubble;
}

function quickAsk(question) {
  document.getElementById('chat-in').value = question;
  sendChat();
}
