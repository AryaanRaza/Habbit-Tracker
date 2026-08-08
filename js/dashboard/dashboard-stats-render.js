let currentRange = "week";
const RING_CIRC = 239;

function setRing(id, pct) {
  const el = document.getElementById(id);
  if (!el) return;
  const clamped = Math.max(0, Math.min(100, pct || 0));
  el.style.strokeDashoffset = RING_CIRC - (RING_CIRC * clamped) / 100;
}

function bindRangeToggle() {
  const buttons = document.querySelectorAll(".range-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      currentRange = btn.dataset.range;
      renderTopStats();
    });
  });
}
function renderTopStats() {
  const habits = window.habits || [];

  const streak = getCurrentStreak(habits);
  const best = getBestStreak(habits);

  document.getElementById("sc-streak").textContent = streak;
  document.getElementById("sc-best").textContent = best;

  const { completedCount, rate } = getRangeStats(habits, currentRange);
  document.getElementById("sc-completed").textContent = completedCount;
  document.getElementById("sc-rate").textContent = rate === null ? "—" : rate + "%";

  const labelMap = { week: "this week", month: "this month", all: "all time" };
  document.getElementById("sc-completed-label").textContent = labelMap[currentRange];

  setRing("ring-fill-streak", best > 0 ? (streak / best) * 100 : streak > 0 ? 100 : 0);

  const milestoneSteps = [7, 14, 30, 60, 100, 180, 365];
  const nextMilestone = milestoneSteps.find((m) => m > best) || best + 30;
  setRing("ring-fill-best", (best / nextMilestone) * 100);

  setRing("ring-fill-completed", rate === null ? (completedCount > 0 ? 100 : 0) : rate);
  setRing("ring-fill-rate", rate === null ? 0 : rate);
}

function renderWeekChart() {
  const data = getWeeklyCompletionData(window.habits || []);
  const container = document.getElementById("week-chart");
  container.innerHTML = "";

  data.forEach((day) => {
    const pct = day.totalHabits === 0 ? 4 : Math.max(4, Math.round((day.completedCount / day.totalHabits) * 100));
    const bar = document.createElement("div");
    bar.className = `chart-bar status-${day.status}`;
    bar.innerHTML = `
      <div class="bar-track"><div class="bar-fill" style="height:${pct}%"></div></div>
      <span class="bar-label">${day.label}</span>
    `;
    container.appendChild(bar);
  });
}

function renderCategoryDonut() {
  const breakdown = getCategoryBreakdown(window.habits || []);
  const donut = document.getElementById("category-donut");
  const legend = document.getElementById("category-legend");
  legend.innerHTML = "";

  if (breakdown.length === 0 || breakdown.every((b) => b.count === 0)) {
    donut.style.background = "var(--bg-card-strong)";
    legend.innerHTML = `<p class="donut-empty">No completions yet</p>`;
    return;
  }

  let cumulative = 0;
  const stops = breakdown.map((b) => {
    const start = cumulative;
    cumulative += b.pct;
    return `var(--cat-${b.category}) ${start}% ${cumulative}%`;
  });
  donut.style.background = `conic-gradient(${stops.join(", ")})`;

  breakdown.forEach((b) => {
    const row = document.createElement("span");
    row.className = "legend-dot-row";
    row.innerHTML = `<i class="legend-dot" style="background: var(--cat-${b.category})"></i> ${b.label} · ${b.pct}%`;
    legend.appendChild(row);
  });
}

function renderActivityHeatmap() {
  const weeks = getActivityHeatmapData(window.habits || [], 12);
  const grid = document.getElementById("heatmap-grid");
  grid.innerHTML = "";

  weeks.forEach((week) => {
    week.forEach((day) => {
      const cell = document.createElement("div");
      if (!day) {
        cell.className = "heat-cell cell-blank";
      } else {
        cell.className = `heat-cell heat-${day.heat}${day.isToday ? " is-today" : ""}`;
        const count = day.completedCount;
        cell.setAttribute(
          "data-tooltip",
          `${count} habit${count === 1 ? "" : "s"} completed on ${day.label}`
        );
      }
      grid.appendChild(cell);
    });
  });
}

function renderBestDayBanner() {
  const best = getBestDayThisMonth(window.habits || []);
  const banner = document.getElementById("best-day-banner");

  if (!best || best.completedCount === 0) {
    banner.hidden = true;
    return;
  }

  banner.hidden = false;
  document.getElementById("best-day-title").textContent = best.label;
  document.getElementById("best-day-sub").textContent =
    `${best.completedCount} / ${best.totalHabits} habits completed`;
}

function renderBreakdown() {
  const breakdown = getHabitBreakdown(window.habits || []);
  const container = document.getElementById("breakdown-list");
  container.innerHTML = "";

  breakdown.forEach((h) => {
    const row = document.createElement("div");
    row.className = "breakdown-row";
    row.innerHTML = `
      <span class="breakdown-name">${h.name}</span>
      <div class="breakdown-track">
        <div class="breakdown-fill" style="width:${h.pct}%; background: var(--cat-${h.category})"></div>
      </div>
      <span class="breakdown-pct">${h.pct}%</span>
    `;
    container.appendChild(row);
  });
}
function renderBadges() {
  const habits = window.habits || [];
  const milestones = getStreakMilestones(habits);
  const best = getBestStreak(habits);

  const pillContainer = document.getElementById("badges-list");
  pillContainer.innerHTML = "";

  milestones.forEach((m) => {
    const pill = document.createElement("span");
    pill.className = `badge-pill ${m.unlocked ? "is-unlocked" : "is-locked"}`;
    pill.textContent = `${m.unlocked ? m.icon : "🔒"} ${m.label}`;
    pillContainer.appendChild(pill);
  });

  const progressWrap = document.getElementById("badge-progress-wrap");
  const nextLocked = milestones.find((m) => !m.unlocked);

  if (!nextLocked) {
    progressWrap.innerHTML = `<p class="badge-progress-label">All milestones unlocked! 🎉</p>`;
    return;
  }

  const pct = Math.min(100, Math.round((best / nextLocked.days) * 100));
  progressWrap.innerHTML = `
    <div class="badge-progress-top">
      <span>Progress to ${nextLocked.label}</span>
      <span>${best} / ${nextLocked.days} days</span>
    </div>
    <div class="badge-progress-track">
      <div class="badge-progress-fill" style="width:${pct}%"></div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", initStatsPage);