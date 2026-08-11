/* =========================
   COMPLETE HABIT
========================= */
window.completeHabit = function (card, habit) {
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

  if (pct === 100) {
    fireConfetti();
    showCompletionPopup();
  } else {
    showToast("Nice! Habit completed ✅");
  }
};

/* =========================
   UNDO HABIT
========================= */
window.undoHabit = function (card, habit) {
  const snapshot = window.habitUndoState[habit.id];

  if (!snapshot) {
    showToast("Undo is only available until you refresh the app.");
    return;
  }

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
