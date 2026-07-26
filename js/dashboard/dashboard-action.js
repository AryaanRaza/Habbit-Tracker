/* =========================
   COMPLETE HABIT
========================= */
window.completeHabit = function (card, habit) {
  const today = new Date().toDateString();

  const snapshot = {
    streak: habit.streak,
    total: habit.total,
    lastCompletedDate: habit.lastCompletedDate,
    completedToday: habit.completedToday,
  };

  window.habitUndoState[habit.id] = snapshot;

  applyHabitCompletion(habit);
  // Update overall daily streak
  updateGlobalStreak();

  saveHabits();
  setHabitCompletedUI(card); // 👈 UI layer

  refreshChips(card, habit);

  const pct = updateProgress();

  applyFilter();
  updateFilterCounts();

  showToast("Nice! Habit completed ✅");

  if (pct === 100) fireConfetti();
};

/* =========================
   UNDO HABIT
========================= */
window.undoHabit = function (card, habit) {
  const snapshot = window.habitUndoState[habit.id];

  revertHabitCompletion(habit, snapshot);

  delete window.habitUndoState[habit.id];

  saveHabits();

  setHabitUndoUI(card); // 👈 UI layer

  refreshChips(card, habit);

  updateProgress();
  applyFilter();
  updateFilterCounts();

  showToast("Marked as not done ❌");
};
