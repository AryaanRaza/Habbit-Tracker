/* =========================
   DASHBOARD STATE
========================= */

window.habits = [];

window.editingId = null;
window.currentFilter = "all";

window.saveHabits = function () {
  saveUserHabits(window.habits);
};

window.loadHabits = function () {
  const storedHabits = loadUserHabits();

  if (storedHabits.length === 0) {
    window.habits = [];
    saveHabits();
  } else {
    window.habits = storedHabits;
  }
};