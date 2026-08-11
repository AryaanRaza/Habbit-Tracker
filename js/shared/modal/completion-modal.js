/* ============================================================
   HabitFlow — Completion Modal
   ------------------------------------------------------------
   Handles the "All Habits Completed" celebration popup.
============================================================ */


/* ============================================================
   SELECTORS
============================================================ */

const completionModal =
  document.getElementById("completion-modal");

const completionClose =
  document.getElementById("completion-close");

const completionCount =
  document.getElementById("completion-count");

const completionStreaksaur =
  document.getElementById("completion-streaksaur");


/* ============================================================
   SHOW COMPLETION POPUP
============================================================ */

window.showCompletionPopup = function () {

  if (!completionModal) return;

  const totalHabits = window.habits.length;

  const completedHabits = window.habits.filter(
    (habit) => habit.completedToday
  ).length;

  /* Update completion count */
  if (completionCount) {
    completionCount.textContent =
      `✓ ${completedHabits} / ${totalHabits} habits completed`;
  }

  /* Restart video from beginning */
  if (completionStreaksaur) {
    completionStreaksaur.currentTime = 0;
    completionStreaksaur.play().catch(() => {});
  }

  /* Show popup */
  openModal(completionModal);
};


/* ============================================================
   CLOSE COMPLETION POPUP
============================================================ */

window.closeCompletionPopup = function () {

  if (!completionModal) return;

  closeModal(completionModal);
};


/* ============================================================
   CLOSE BUTTON
============================================================ */

if (completionClose) {

  completionClose.addEventListener(
    "click",
    window.closeCompletionPopup
  );
}


/* ============================================================
   CLICK OUTSIDE
============================================================ */

if (completionModal) {

  completionModal.addEventListener("click", (e) => {

    if (e.target === completionModal) {
      window.closeCompletionPopup();
    }

  });

}


/* ============================================================
   ESCAPE KEY
============================================================ */

document.addEventListener("keydown", (e) => {

  if (!completionModal || completionModal.hidden) {
    return;
  }

  if (e.key === "Escape") {
    window.closeCompletionPopup();
  }

});