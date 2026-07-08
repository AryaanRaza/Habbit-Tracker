/* =========================
   COMPLETE HABIT
========================= */
window.completeHabit = function (card, habit) {
  const today = new Date().toDateString();

  habit.completedToday = true;
  habit.lastCompletedDate = today;

  habit.streak++;
  habit.total++;

  habit.best = Math.max(habit.best, habit.streak);

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
  habit.completedToday = false;
  habit.streak = Math.max(0, habit.streak - 1);
  habit.total = Math.max(0, habit.total - 1);

  saveHabits();

  setHabitUndoUI(card); // 👈 UI layer

  refreshChips(card, habit);

  updateProgress();
  applyFilter();
  updateFilterCounts();

  showToast("Marked as not done ❌");
};
