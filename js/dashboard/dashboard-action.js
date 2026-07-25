/* =========================
   COMPLETE HABIT
========================= */
window.completeHabit = function (card, habit) {
  const today = new Date().toDateString();

  // Calculate streak before updating lastCompletedDate
  const previousDate = habit.lastCompletedDate;

  if (!previousDate) {
    // First completion ever
    habit.streak = 1;
  } else {
    const last = new Date(previousDate);

    const diffDays = Math.floor(
      (new Date(today) - last) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 1) {
      // Completed yesterday → continue streak
      habit.streak++;
    } else if (diffDays > 1) {
      // Missed one or more days → restart streak
      habit.streak = 1;
    }
    // diffDays === 0 cannot happen because completedToday prevents double completion
  }

  habit.completedToday = true;
  habit.lastCompletedDate = today;
  habit.total++;

  habit.best = Math.max(habit.best || 0, habit.streak);

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
  habit.completedToday = false;
  habit.lastCompletedDate = null;
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
