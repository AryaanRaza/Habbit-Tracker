/* =========================
   COMPLETE HABIT
========================= */
/* =========================
   COMPLETE HABIT
========================= */
window.completeHabit = function (card, habit) {
  const snapshot = {
    streak: habit.streak,
    total: habit.total,
    best: habit.best,
    lastCompletedDate: habit.lastCompletedDate,
    completedToday: habit.completedToday,
    completedDates: [...(habit.completedDates || [])],
  };

  window.habitUndoState[habit.id] = snapshot;

  // Centralized habit completion logic
  applyHabitCompletion(habit);

  // Update overall daily streak
  updateGlobalStreak();

  saveHabits();

  setHabitCompletedUI(card);

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
  /* ----------------------------------------------------------
     Undo is only available while the temporary snapshot exists.
     Since the snapshot is stored only in memory, refreshing the
     app permanently removes the ability to undo.

     (ARYAAN)
     ---------------------------------------------------------- */
  const snapshot = window.habitUndoState[habit.id];

  if (!snapshot) {
    showToast("Undo is only available until you refresh the app.");
    return;
  }

  /* ----------------------------------------------------------
     Restore the habit exactly as it was before completion.
     Using a snapshot is safer than manually decrementing values,
     especially as more habit properties are added in the future.
     ---------------------------------------------------------- */
  habit.streak = snapshot.streak;
  habit.total = snapshot.total;
  habit.best = snapshot.best;
  habit.lastCompletedDate = snapshot.lastCompletedDate;
  habit.completedToday = snapshot.completedToday;
  habit.completedDates = [...snapshot.completedDates];

  // Consume the snapshot so only one undo is possible.
  delete window.habitUndoState[habit.id];
  /* ---------------------------------------------------------- */

  saveHabits();

  setHabitUndoUI(card);

  refreshChips(card, habit);

  updateProgress();
  applyFilter();
  updateFilterCounts();

  showToast("Marked as not done ❌");
};
