const statBest = document.getElementById("stat-best");
const statStreak = document.getElementById("stat-streak");
const statTotal = document.getElementById("stat-total");

const progressFill = document.getElementById("progress-fill");
const progressPct = document.getElementById("progress-pct");
const progressCount = document.getElementById("progress-count");

const habitCountLbl = document.getElementById("habit-count-label");

const emptyState = document.getElementById("empty-state");

/* =========================
     STATS + PROGRESS
========================= */
function updateStats() {
  if (statBest) {
    statBest.textContent = getBestStreak(window.habits);
  }

  if (statStreak) {
    statStreak.textContent = getCurrentStreak(window.habits);
  }

  if (statTotal) {
    statTotal.textContent = window.habits.reduce((s, h) => s + h.total, 0);
  }
}

function updateProgress() {
  const total = window.habits.length;

  const done = window.habits.filter((h) => h.completedToday).length;

  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  if (progressPct) {
    progressPct.textContent = pct + "%";
  }

  if (progressFill) {
    progressFill.style.width = pct + "%";
  }

  if (progressCount) {
    progressCount.textContent = `${done} / ${total} done`;
  }

  if (habitCountLbl) {
    habitCountLbl.textContent = total === 1 ? "1 habit" : `${total} habits`;
  }

  if (emptyState) {
    emptyState.style.display = total === 0 ? "block" : "none";
  }

  updateStats();
  updateSidebarStats();

  return pct;
}

/* =========================
   SIDEBAR QUICK STATS
========================= */
function updateSidebarStats() {
  /* ===== SIDEBAR QUICK STATS ===== */
  const navBestStreak = document.getElementById("nav-best-streak");
  const navTotalHabits = document.getElementById("nav-total-habits");

  const bestStreak = getBestStreak(window.habits);
  const totalHabits = getTotalHabits(window.habits);

  /* ===== Update values ===== */
  if (navBestStreak) {
    navBestStreak.textContent = bestStreak;
  }

  if (navTotalHabits) {
    navTotalHabits.textContent = totalHabits;
  }

  /* ===== Trigger pop animation ===== */
  if (navBestStreak) {
    navBestStreak.classList.add("pop");
  }

  if (navTotalHabits) {
    navTotalHabits.classList.add("pop");
  }

  /* ===== Remove animation ===== */
  setTimeout(() => {
    if (navBestStreak) {
      navBestStreak.classList.remove("pop");
    }

    if (navTotalHabits) {
      navTotalHabits.classList.remove("pop");
    }
  }, 200);
}

/* =========================
     HELPERS
========================= */
function refreshChips(card, h) {
  const streakValue = card.querySelector(".chip-streak .chip-value");

  const totalValue = card.querySelector(".chip-total .chip-value");

  if (streakValue) {
    streakValue.textContent = h.streak;
  }

  if (totalValue) {
    totalValue.textContent = h.total;
  }
}
/* =========================
   GLOBAL DAILY STREAK
========================= */

function updateGlobalStreak() {
  const today = new Date().toDateString();

  // Already counted today
  if (window.globalStreak.lastCompletedDate === today) {
    return;
  }

  // Yesterday
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  if (window.globalStreak.lastCompletedDate === yesterday.toDateString()) {
    window.globalStreak.current++;
  } else {
    window.globalStreak.current = 1;
  }

  window.globalStreak.best = Math.max(
    window.globalStreak.best,
    window.globalStreak.current,
  );

  window.globalStreak.lastCompletedDate = today;

  saveUserStreak(window.globalStreak);
}
/* =========================
   GLOBAL EXPORTS
========================= */
window.updateStats = updateStats;
window.updateProgress = updateProgress;
window.updateSidebarStats = updateSidebarStats;
window.refreshChips = refreshChips;
window.updateGlobalStreak = updateGlobalStreak;
