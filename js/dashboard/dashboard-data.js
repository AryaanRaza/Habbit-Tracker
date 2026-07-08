/* =========================
   DASHBOARD STATE
========================= */

window.habits = [];

window.editingId = null;
window.currentFilter = "all";

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

window.loadHabits = function () {
  const storedHabits = loadUserHabits();

  if (storedHabits.length === 0) {
    window.habits = [];
    saveHabits();
  } else {
    window.habits = storedHabits;
  }
};
