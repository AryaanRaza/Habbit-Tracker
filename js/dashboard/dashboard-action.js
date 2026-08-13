// /* =========================
//    COMPLETE HABIT
// ========================= */
// window.completeHabit = function (card, habit) {
//   const snapshot = {
//     streak: habit.streak,
//     total: habit.total,
//     lastCompletedDate: habit.lastCompletedDate,
//     completedToday: habit.completedToday,
//   };

//   window.habitUndoState[habit.id] = snapshot;

//   applyHabitCompletion(habit);
//   // Update overall daily streak
//   updateGlobalStreak();

//   saveHabits();
//   setHabitCompletedUI(card); // 👈 UI layer

//   refreshChips(card, habit);

//   const pct = updateProgress();

//   applyFilter();
//   updateFilterCounts();

//   showToast("Nice! Habit completed ✅");

//   if (pct === 100) fireConfetti();
// };

// /* =========================
//    UNDO HABIT
// ========================= */
// window.undoHabit = function (card, habit) {
//   const snapshot = window.habitUndoState[habit.id];

//   if (!snapshot) {
//     showToast("Undo is only available until you refresh the app.");
//     return;
//   }

//   revertHabitCompletion(habit, snapshot);

//   delete window.habitUndoState[habit.id];

//   saveHabits();

//   setHabitUndoUI(card); // 👈 UI layer

//   refreshChips(card, habit);

//   updateProgress();
//   applyFilter();
//   updateFilterCounts();

//   showToast("Marked as not done ❌");
// };



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

  if (!habit.completedDates) habit.completedDates = [];
  if (!habit.completedDates.includes(today)) {
    habit.completedDates.push(today);
  }

  updateGlobalStreak();

  saveHabits();
  setHabitCompletedUI(card);

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

  const today = new Date().toDateString();
  if (habit.completedDates) {
    habit.completedDates = habit.completedDates.filter((d) => d !== today);
  }

  saveHabits();

  setHabitUndoUI(card);

  refreshChips(card, habit);

  updateProgress();
  applyFilter();
  updateFilterCounts();

  showToast("Marked as not done ❌");
};