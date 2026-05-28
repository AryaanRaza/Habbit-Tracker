/* =========================
   UI LAYER (DOM ONLY)
========================= */

window.setHabitCompletedUI = function (card) {
  if (!card) return;

  card.classList.add("is-completed");

  const btn = card.querySelector(".btn-complete");
  if (btn) btn.innerText = "Completed! 🔥";
};

window.setHabitUndoUI = function (card) {
  if (!card) return;

  card.classList.remove("is-completed");

  const btn = card.querySelector(".btn-complete");
  if (btn) btn.innerText = "Mark as Done";
};

window.resetCardUI = function (card) {
  card.style.transform = "translateX(0) rotate(0deg) scale(1)";
  card.style.opacity = "1";
  card.style.boxShadow = "";
};

window.refreshChips = function (card, h) {
  const streakValue = card.querySelector(".chip-streak .chip-value");
  const totalValue = card.querySelector(".chip-total .chip-value");

  if (streakValue) streakValue.textContent = h.streak;
  if (totalValue) totalValue.textContent = h.total;
};