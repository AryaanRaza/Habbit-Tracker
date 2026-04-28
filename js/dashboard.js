// ============================================================
//  HabitFlow — dashboard.js (clean structured version)
// ============================================================

/* =========================
   1. SELECTORS
========================= */
const habitInput = document.querySelector(".habit-field");
const addBtn = document.querySelector(".btn-add-habit");
const habitContainer = document.querySelector(".habit-list-container");

const emptyState = document.getElementById("empty-state");
const progressFill = document.getElementById("progress-fill");
const progressCount = document.getElementById("progress-count");
const progressMotto = document.getElementById("progress-motto");
const habitCountLbl = document.getElementById("habit-count-label");

const statBest = document.getElementById("stat-best");
const statStreak = document.getElementById("stat-streak");
const statTotal = document.getElementById("stat-total");

/* =========================
   2. STATE
========================= */
let habits = [];
let hasCelebrated = false;
let toastTimer;

/* =========================
   3. DATE
========================= */
const todayEl = document.querySelector("#today-date");

if (todayEl) {
  todayEl.textContent = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* =========================
   4. TOAST
========================= */
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* =========================
   5. CONFETTI
========================= */
function fireConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 120 }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 3,
    vx: (Math.random() - 0.5) * 10,
    vy: Math.random() * -10 - 5,
    size: 4 + Math.random() * 4,
    color: `hsl(${Math.random() * 360}, 80%, 60%)`,
  }));

  let start = performance.now();

  function animate(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach((p) => {
      p.vy += 0.3;
      p.x += p.vx;
      p.y += p.vy;

      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    if (now - start < 2000) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(animate);
}

/* =========================
   6. STATS + PROGRESS
========================= */
const MOTTOS = [
  "You're on a roll! 🔥",
  "Stay consistent 💪",
  "Every check-off counts ✨",
  "Small steps, big results 🚀",
];

function updateStats() {
  const best = habits.reduce((m, h) => Math.max(m, h.best), 0);
  const current = habits.reduce((m, h) => Math.max(m, h.streak), 0);
  const total = habits.reduce((s, h) => s + h.total, 0);

  if (statBest) statBest.textContent = best;
  if (statStreak) statStreak.textContent = current;
  if (statTotal) statTotal.textContent = total;
}

function updateProgress() {
  const total = habits.length;
  const done = habits.filter((h) => h.completedToday).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  progressFill.style.width = pct + "%";
  progressCount.textContent = `${done} / ${total} done`;
  habitCountLbl.textContent = total === 1 ? "1 habit" : `${total} habits`;
  emptyState.style.display = total === 0 ? "block" : "none";

  if (total === 0) {
    progressMotto.textContent = "Add habits to start ✨";
  } else if (done === 0) {
    progressMotto.textContent = "Let's crush today 💥";
  } else if (done === total) {
    progressMotto.textContent = "Perfect day! 🎉";
  } else {
    progressMotto.textContent = MOTTOS[done % MOTTOS.length];
  }

  updateStats();

  // 🎉 PERFECT DAY TRIGGER
  if (total > 0 && done === total) {
    if (!hasCelebrated) {
      fireConfetti();
      showToast("Perfect day! 🎉");
      hasCelebrated = true;
    }
  } else {
    hasCelebrated = false;
  }
}

/* =========================
   7. INIT EXISTING
========================= */
(function init() {
  document.querySelectorAll(".habit-card").forEach((card, i) => {
    const name = card.querySelector(".habit-name")?.innerText;
    const streak = parseInt(card.querySelector(".chip-streak")?.textContent) || 0;
    const total = parseInt(card.querySelector(".chip-total")?.textContent) || 0;

    const id = Date.now() + i;
    card.setAttribute("data-id", id);

    habits.push({
      id,
      name,
      streak,
      best: streak,
      total,
      completedToday: false,
    });
  });

  updateProgress();
})();

/* =========================
   8. HELPERS
========================= */
function refreshChips(card, h) {
  card.querySelector(".chip-streak").textContent = `🔥 ${h.streak} day streak`;
  card.querySelector(".chip-total").textContent = `✓ ${h.total} total`;
}

/* =========================
   9. ADD HABIT
========================= */
function addHabit() {
  let name = habitInput.value.trim();

  if (!name) return alert("Enter a habit!");

  name = name.charAt(0).toUpperCase() + name.slice(1);

  if (habits.some((h) => h.name.toLowerCase() === name.toLowerCase())) {
    return alert("Already exists 🔥");
  }

  const habit = {
    id: Date.now(),
    name,
    streak: 0,
    best: 0,
    total: 0,
    completedToday: false,
  };

  habits.push(habit);

  const card = document.createElement("article");
  card.className = "habit-card";
  card.setAttribute("data-id", habit.id);

  card.innerHTML = `
    <div class="habit-info">
      <h3 class="habit-name">${name}</h3>
      <div class="habit-chips">
        <span class="chip chip-streak">🔥 0 day streak</span>
        <span class="chip chip-total">✓ 0 total</span>
      </div>
    </div>
    <div class="habit-actions">
      <button class="btn btn-complete">Mark as Done</button>
      <button class="btn-delete">🗑</button>
    </div>
  `;

  habitContainer.appendChild(card);
  habitInput.value = "";
  updateProgress();
}

/* =========================
   10. EVENTS
========================= */

// ADD
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addHabit();
});

habitInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addHabit();
});

// CLICK (MAIN LOGIC)
habitContainer.addEventListener("click", (e) => {
  const completeBtn = e.target.closest(".btn-complete");
  const deleteBtn = e.target.closest(".btn-delete");

  // COMPLETE / UNDO
  if (completeBtn) {
    const card = completeBtn.closest(".habit-card");
    const habit = habits.find(
      (h) => h.id == card.getAttribute("data-id")
    );

    if (!habit) return;

    if (!habit.completedToday) {
      // COMPLETE
      habit.completedToday = true;
      habit.streak++;
      habit.total++;

      if (habit.streak > habit.best) habit.best = habit.streak;

      card.classList.add("is-completed");
      completeBtn.innerText = "Completed! 🔥";

    } else {
      // UNDO
      habit.completedToday = false;
      habit.streak = Math.max(0, habit.streak - 1);
      habit.total = Math.max(0, habit.total - 1);

      card.classList.remove("is-completed");
      completeBtn.innerText = "Mark as Done";
    }

    refreshChips(card, habit);
    updateProgress();
    return;
  }

  // DELETE
  if (deleteBtn) {
    const card = deleteBtn.closest(".habit-card");
    const id = card.getAttribute("data-id");

    habits = habits.filter((h) => h.id != id);
    card.remove();
    updateProgress();
  }
});

/* =========================
   11. HOVER (UNDO UI)
========================= */
habitContainer.addEventListener("mouseover", (e) => {
  const btn = e.target.closest(".btn-complete");
  if (!btn) return;

  if (btn.closest(".habit-card").classList.contains("is-completed")) {
    btn.innerText = "Undo? ↩️";
  }
});

habitContainer.addEventListener("mouseout", (e) => {
  const btn = e.target.closest(".btn-complete");
  if (!btn) return;

  if (btn.closest(".habit-card").classList.contains("is-completed")) {
    btn.innerText = "Completed! 🔥";
  }
});