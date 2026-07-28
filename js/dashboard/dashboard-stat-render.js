let currentRange = "week";

function initStatsPage() {
  loadHabits();

  if (!window.habits || window.habits.length === 0) {
    document.getElementById("stats-empty-state").hidden = false;
  }

  renderTopStats();
  renderWeekChart();
  renderBestDayBanner();
  renderBreakdown();
  renderCalendar();
  bindRangeToggle();
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

  document.getElementById("sc-streak").textContent = getCurrentStreak(habits);
  document.getElementById("sc-best").textContent = getBestStreak(habits);

  const { completedCount, rate } = getRangeStats(habits, currentRange);
  document.getElementById("sc-completed").textContent = completedCount;
  document.getElementById("sc-rate").textContent = rate === null ? "—" : rate + "%";

  const labelMap = { week: "this week", month: "this month", all: "all time" };
  document.getElementById("sc-completed-label").textContent = labelMap[currentRange];
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

function renderCalendar() {
  const data = getStreakCalendarData(window.habits || []);
  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = "";
  document.getElementById("calendar-month-label").textContent = data.monthLabel;

  data.days.forEach((day) => {
    const cell = document.createElement("div");
    if (!day) {
      cell.className = "cal-cell cal-blank";
    } else {
      cell.className = `cal-cell status-${day.status}`;
      cell.textContent = day.day;
    }
    grid.appendChild(cell);
  });
}

document.addEventListener("DOMContentLoaded", initStatsPage);