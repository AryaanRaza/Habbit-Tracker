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