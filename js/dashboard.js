// ============================================================
//  HabitFlow — dashboard.js (FINAL ENHANCED VERSION)
//  ✅ Fixes:
//     - Undo hover text
//     - Confetti celebration 🎉
//     - Toast popup
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     1. SELECTORS
  ========================= */
  const habitInput = document.querySelector(".habit-field");
  const addBtn = document.querySelector(".btn-add-habit");
  const habitContainer = document.querySelector(".habit-list-container");
  const timeInput = document.getElementById("habit-time");

  const emptyState = document.getElementById("empty-state");
  const progressFill = document.getElementById("progress-fill");
  const progressPct = document.getElementById("progress-pct");
  const progressCount = document.getElementById("progress-count");
  const progressMotto = document.getElementById("progress-motto");
  const habitCountLbl = document.getElementById("habit-count-label");

  const statBest = document.getElementById("stat-best");
  const statStreak = document.getElementById("stat-streak");
  const statTotal = document.getElementById("stat-total");

  const categorySelect = document.getElementById("habit-category");

  const toast = document.getElementById("toast");

  /* ===== EDIT MODAL ===== */
  const editModal = document.getElementById("edit-modal");
  const editName = document.getElementById("edit-name");
  const editCategory = document.getElementById("edit-category");
  const editTime = document.getElementById("edit-time");
  const editCancel = document.getElementById("edit-cancel");
  const editSave = document.getElementById("edit-save");

  /* =========================
     2. CONSTANTS
  ========================= */
  const CATEGORIES = {
    health:      { icon: '💪', color: 'var(--cat-health)' },
    learning:    { icon: '📚', color: 'var(--cat-learning)' },
    fitness:     { icon: '🏃', color: 'var(--cat-fitness)' },
    mindfulness: { icon: '🧘', color: 'var(--cat-mindfulness)' },
    creativity:  { icon: '🎨', color: 'var(--cat-creativity)' },
    work:        { icon: '💼', color: 'var(--cat-work)' },
    other:       { icon: '✨', color: 'var(--cat-other)' },
  };

  /* =========================
     3. STATE
  ========================= */
  let habits = [];
  let editingId = null;

  /* =========================
     3.1 LOAD EXISTING HABITS
  ========================= */
  function loadExistingHabits() {
    const cards = document.querySelectorAll(".habit-card");

    cards.forEach(card => {
      const name = card.querySelector(".habit-name")?.textContent.trim();
      if (!name || habits.some(h => h.name === name)) return;

      const id = Date.now() + Math.random();
      card.setAttribute("data-id", id);

      habits.push({
        id,
        name,
        category: "other",
        time: "",
        streak: 0,
        best: 0,
        total: 0,
        completedToday: false,
      });
    });

    updateProgress();
  }

  loadExistingHabits();

  /* =========================
     4. TOAST
  ========================= */
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }

  /* =========================
     5. CONFETTI 🎉
  ========================= */
  function fireConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas || !window.confetti) return;

    window.confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  /* =========================
     6. STATS + PROGRESS
  ========================= */
  function updateStats() {
    const best = habits.reduce((m, h) => Math.max(m, h.best), 0);
    const current = habits.reduce((m, h) => Math.max(m, h.streak), 0);
    const total = habits.reduce((s, h) => s + h.total, 0);

    statBest.textContent = best;
    statStreak.textContent = current;
    statTotal.textContent = total;
  }

  function updateProgress() {
    const total = habits.length;
    const done = habits.filter(h => h.completedToday).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);

    progressPct.textContent = pct + "%";
    progressFill.style.width = pct + "%";
    progressCount.textContent = `${done} / ${total} done`;
    habitCountLbl.textContent = total === 1 ? "1 habit" : `${total} habits`;
    emptyState.style.display = total === 0 ? "block" : "none";

    updateStats();
  }

  /* =========================
     7. HELPERS
  ========================= */
  function refreshChips(card, h) {
    card.querySelector(".chip-streak").textContent = `🔥 ${h.streak} day streak`;
    card.querySelector(".chip-total").textContent = `✓ ${h.total} total`;
  }

  /* =========================
     8. ADD HABIT
  ========================= */
  function addHabit() {
    let name = habitInput.value.trim();
    if (!name) return alert("Enter a habit!");

    const habit = {
      id: Date.now(),
      name,
      category: categorySelect.value || "other",
      time: timeInput.value || "",
      streak: 0,
      best: 0,
      total: 0,
      completedToday: false,
    };

    habits.push(habit);

    const cat = CATEGORIES[habit.category];
    const card = document.createElement("article");

    card.className = "habit-card";
    card.setAttribute("data-id", habit.id);

    card.innerHTML = `
      <span class="habit-dot">${cat.icon}</span>
      <div class="habit-info">
        <h3 class="habit-name">${name}</h3>
        <div class="habit-chips">
          <span class="chip chip-streak">🔥 0 day streak</span>
          <span class="chip chip-total">✓ 0 total</span>
        </div>
      </div>
      <div class="habit-actions">
        <button class="btn-edit"><span class="material-symbols-rounded">edit</span></button>
        <button class="btn btn-complete">Mark as Done</button>
        <button class="btn-delete"><span class="material-symbols-rounded">delete</span></button>
      </div>
    `;

    habitContainer.appendChild(card);
    updateProgress();
  }

  addBtn.addEventListener("click", addHabit);

  /* =========================
     9. EVENTS
  ========================= */
habitContainer.addEventListener("click", (e) => {
  const card = e.target.closest(".habit-card");
  if (!card) return;

  const id = card.getAttribute("data-id");
  const habit = habits.find(h => h.id == id);
  if (!habit) return;

  /* =====================
     1. EDIT
  ===================== */
  if (e.target.closest(".btn-edit")) {
    editingId = id;

    editName.value = habit.name;
    editCategory.value = habit.category;
    editTime.value = habit.time || "";

    editModal.hidden = false;
    return;
  }

  /* =====================
     2. COMPLETE
  ===================== */
  if (e.target.closest(".btn-complete")) {
    const btn = card.querySelector(".btn-complete");

    if (!habit.completedToday) {
      habit.completedToday = true;
      habit.streak++;
      habit.total++;
      habit.best = Math.max(habit.best, habit.streak);

      card.classList.add("is-completed");
      btn.innerText = "Completed! 🔥";

      showToast("Nice! Habit completed ✅");
      fireConfetti();
    } else {
      habit.completedToday = false;
      habit.streak = Math.max(0, habit.streak - 1);
      habit.total = Math.max(0, habit.total - 1);

      card.classList.remove("is-completed");
      btn.innerText = "Mark as Done";

      showToast("Marked as not done ❌");
    }

    refreshChips(card, habit);
    updateProgress();
    return;
  }

  /* =====================
     3. DELETE
  ===================== */
  if (e.target.closest(".btn-delete")) {
    habits = habits.filter(h => h.id != id);

    card.classList.add("deleting");

    setTimeout(() => {
      card.remove();
      updateProgress();
    }, 250);

    showToast("Habit deleted 🗑️");
  }
});

  /* =========================
     10. HOVER → UNDO TEXT
  ========================= */
  habitContainer.addEventListener("mouseover", (e) => {
    const btn = e.target.closest(".btn-complete");
    if (!btn) return;

    const card = btn.closest(".habit-card");
    if (card.classList.contains("is-completed")) {
      btn.innerText = "Undo ❌";
    }
  });

  habitContainer.addEventListener("mouseout", (e) => {
    const btn = e.target.closest(".btn-complete");
    if (!btn) return;

    const card = btn.closest(".habit-card");
    if (card.classList.contains("is-completed")) {
      btn.innerText = "Completed! 🔥";
    }
  });

});