/* =========================
   DASHBOARD STATE
========================= */

window.habits = [];

window.editingId = null;
window.currentFilter = "all";

window.globalStreak = {
  current: 0,
  best: 0,
  lastCompletedDate: null,
};

window.saveHabits = function () {
  saveUserHabits(window.habits);
};

/* =========================
   DAILY HABIT RESET
========================= */
function resetDailyHabits() {
  const today = new Date().toDateString();

  const lastActiveDate = Storage.get(STORAGE_KEYS.LAST_ACTIVE_DATE);

  // Same day → nothing to reset
  if (lastActiveDate === today) return;

  // New day → reset completion state
  window.habits.forEach((habit) => {
    habit.completedToday = false;
  });

  // Save updated habits
  saveHabits();

  // Remember today's date
  Storage.set(STORAGE_KEYS.LAST_ACTIVE_DATE, today);
}

/* =========================
   LOAD HABIT 
========================= */
window.loadHabits = function () {
  const storedHabits = loadUserHabits();

  // Load the user's global streak
  window.globalStreak = loadUserStreak();

  if (storedHabits.length === 0) {
    window.habits = [];
    saveHabits();
  } else {
    window.habits = storedHabits;
  }

  // Reset completed habits if a new day has started
  resetDailyHabits();
};
