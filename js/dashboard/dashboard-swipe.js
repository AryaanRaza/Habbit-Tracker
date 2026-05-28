/* =========================
   MOBILE SWIPE TO COMPLETE
========================= */
const habitContainer = document.querySelector(".habit-list-container");

let touchStartX = 0;
let touchCurrentX = 0;

let touchStartY = 0;
let touchCurrentY = 0;

let isSwiping = false;

let touchStartTime = 0;
let touchEndTime = 0;

habitContainer.addEventListener(
  "touchstart",
  (e) => {
    const card = e.target.closest(".habit-card");
    if (!card) return;

    /* =========================
   DISABLE SWIPE IF DROPDOWN OPEN
========================= */

    const dropdown = card.querySelector(".habit-dropdown");

    if (dropdown?.classList.contains("open")) {
      // fully reset swipe state
      touchStartX = 0;
      touchCurrentX = 0;

      touchStartY = 0;
      touchCurrentY = 0;

      touchStartTime = 0;
      touchEndTime = 0;

      isSwiping = false;

      return;
    }

    // ignore multitouch
    if (e.touches.length > 1) return;

    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;

    isSwiping = false;
    touchStartTime = Date.now();

    card.style.transition = "none";
  },
  { passive: true },
);

habitContainer.addEventListener(
  "touchmove",
  (e) => {
    const card = e.target.closest(".habit-card");
    if (!card) return;

    // ignore if swipe never started
    if (touchStartX === 0) return;

    touchCurrentX = e.touches[0].clientX;
    touchCurrentY = e.touches[0].clientY;

    const diffX = touchCurrentX - touchStartX;
    const diffY = touchCurrentY - touchStartY;

    /* =========================
       VERTICAL SCROLL PROTECTION
    ========================= */

    if (!isSwiping) {
      // user is scrolling vertically
      if (Math.abs(diffY) > Math.abs(diffX)) {
        return;
      }

      // user intends horizontal swipe
      isSwiping = true;
    }

    /* =========================
       FULL CARD ROTATION
    ========================= */

    // stronger rotation
    const rotate = diffX * 0.08;

    // slight scale effect
    const scale = 1 - Math.min(Math.abs(diffX) / 1200, 0.04);

    // live opacity
    const opacity = 1 - Math.min(Math.abs(diffX) / 450, 0.18);

    /* =========================
       MOVE + ROTATE + SCALE
    ========================= */

    card.style.transform = `
      translateX(${diffX}px)
      rotate(${rotate}deg)
      scale(${scale})
    `;

    card.style.opacity = opacity;

    /* =========================
       SWIPE GLOW
    ========================= */

    if (diffX > 0) {
      card.style.boxShadow = "0 14px 32px rgba(34,197,94,0.22)";
    } else if (diffX < 0) {
      card.style.boxShadow = "0 14px 32px rgba(239,68,68,0.22)";
    } else {
      card.style.boxShadow = "";
    }
  },
  { passive: true },
);

habitContainer.addEventListener("touchend", (e) => {
  const card = e.target.closest(".habit-card");
  if (!card) return;

  // swipe never actually started
  if (touchStartX === 0) {
    return;
  }

  const diffX = touchCurrentX - touchStartX;

  touchEndTime = Date.now();

  const swipeTime = touchEndTime - touchStartTime;

  // pixels per ms
  const swipeVelocity = Math.abs(diffX) / swipeTime;
  if (!isSwiping) {
    return;
  }

  card.style.transition = "transform 0.25s ease, opacity 0.25s ease";

  // ===== SWIPE RIGHT → COMPLETE =====
  if (diffX > 120 || (diffX > 0 && swipeVelocity > 0.65)) {
    const id = card.getAttribute("data-id");

    const habit = window.habits.find((h) => h.id == id);

    if (!habit) {
      card.style.transform = "translateX(0) rotate(0deg) scale(1)";

      card.style.opacity = "1";
      card.style.boxShadow = "";
      return;
    }

    // already completed
    if (habit.completedToday) {
      card.style.transform = "translateX(0) rotate(0deg) scale(1)";

      card.style.opacity = "1";
      card.style.boxShadow = "";

      showToast("Habit already completed ✅");

      return;
    }

    /* =========================
       COMPLETE HABIT
    ========================= */
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

    isSwiping = false;

    if (pct === 100) {
      fireConfetti();

      showToast("Perfect day! 🎉");
    }

    /* =========================
       FINISH SWIPE ANIMATION
    ========================= */
    card.style.transform = "translateX(90px) rotate(8deg) scale(0.96)";

    setTimeout(() => {
      card.style.transform = "translateX(0) rotate(0deg) scale(1)";

      card.style.opacity = "1";
      card.style.boxShadow = "";
    }, 180);
  }

  // ===== SWIPE LEFT → UNDO =====
  else if (diffX < -120 || (diffX < 0 && swipeVelocity > 0.65)) {
    const id = card.getAttribute("data-id");

    const habit = window.habits.find((h) => h.id == id);

    if (!habit) {
      card.style.transform = "translateX(0) rotate(0deg) scale(1)";

      card.style.opacity = "1";
      card.style.boxShadow = "";

      return;
    }

    // not completed yet
    if (!habit.completedToday) {
      card.style.transform = "translateX(0) rotate(0deg) scale(1)";

      card.style.opacity = "1";
      card.style.boxShadow = "";

      showToast("Habit is already incomplete ✨");

      isSwiping = false;

      return;
    }

    /* =========================
       UNDO HABIT
    ========================= */
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

    /* =========================
       FINISH SWIPE ANIMATION
    ========================= */
    card.style.transform = "translateX(-90px) rotate(-8deg) scale(0.96)";

    setTimeout(() => {
      card.style.transform = "translateX(0) rotate(0deg) scale(1)";

      card.style.opacity = "1";
      card.style.boxShadow = "";
    }, 180);
  }

  // ===== SMALL SWIPE → RESET =====
  else {
    card.style.transform = "translateX(0) rotate(0deg) scale(1)";

    card.style.opacity = "1";
    card.style.boxShadow = "";
  }

  touchStartX = 0;
  touchCurrentX = 0;

  touchStartY = 0;
  touchCurrentY = 0;

  touchStartTime = 0;
  touchEndTime = 0;

  isSwiping = false;
});

/* =========================
   CLOSE DROPDOWN ON OUTSIDE CLICK
========================= */
document.addEventListener("click", (e) => {
  // clicked inside dropdown or more button
  if (e.target.closest(".btn-more") || e.target.closest(".habit-dropdown")) {
    return;
  }

  // close all open dropdowns
  document.querySelectorAll(".habit-dropdown.open").forEach((dropdown) => {
    dropdown.classList.remove("open");
  });
});
