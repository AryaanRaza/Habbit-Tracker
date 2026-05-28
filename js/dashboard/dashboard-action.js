/* =========================
   COMPLETE HABIT
========================= */
window.completeHabit = function (card, habit) {

  habit.completedToday = true;

  habit.streak++;

  habit.total++;

  habit.best = Math.max(habit.best, habit.streak);

  card.classList.add("is-completed");

  const btn = card.querySelector(".btn-complete");

  if (btn) {
    btn.innerText = "Completed! 🔥";
  }

  refreshChips(card, habit);

  saveHabits();

  const pct = updateProgress();

  applyFilter();

  updateFilterCounts();

  showToast("Nice! Habit completed ✅");

  if (pct === 100) {

    fireConfetti();

    showToast("Perfect day! 🎉");
  }
};

/* =========================
   UNDO HABIT
========================= */
window.undoHabit = function (card, habit) {

  habit.completedToday = false;

  habit.streak = Math.max(0, habit.streak - 1);

  habit.total = Math.max(0, habit.total - 1);

  card.classList.remove("is-completed");

  const btn = card.querySelector(".btn-complete");

  if (btn) {
    btn.innerText = "Mark as Done";
  }

  refreshChips(card, habit);

  saveHabits();

  updateProgress();

  applyFilter();

  updateFilterCounts();

  showToast("Marked as not done ❌");
};