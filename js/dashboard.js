// ============================================================
//  HabitFlow — dashboard.js (FINAL FIXED VERSION)
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
     4. DATE
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
     5. STATS + PROGRESS
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
  }

  /* =========================
     6. HELPERS
  ========================= */
  function refreshChips(card, h) {
    card.querySelector(".chip-streak").textContent = `🔥 ${h.streak} day streak`;
    card.querySelector(".chip-total").textContent = `✓ ${h.total} total`;
  }

  /* =========================
     7. ADD HABIT
  ========================= */
  function addHabit() {
    let name = habitInput.value.trim();
    if (!name) return alert("Enter a habit!");

    name = name.charAt(0).toUpperCase() + name.slice(1);

    if (habits.some(h => h.name.toLowerCase() === name.toLowerCase())) {
      return alert("Already exists 🔥");
    }

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
    card.style.setProperty("--cat-color", cat.color);

    card.innerHTML = `
      <span class="habit-dot">${cat.icon}</span>
      <div class="habit-info">
        <h3 class="habit-name">${name}</h3>
        <div class="habit-chips">
          <span class="chip chip-streak">🔥 0 day streak</span>
          <span class="chip chip-total">✓ 0 total</span>
          ${habit.time ? `<span class="chip chip-time">⏰ ${habit.time}</span>` : ""}
        </div>
      </div>
      <div class="habit-actions">
        <button class="btn-edit">
          <span class="material-symbols-rounded">edit</span>
        </button>
        <button class="btn btn-complete">Mark as Done</button>
        <button class="btn-delete">
          <span class="material-symbols-rounded">delete</span>
        </button>
      </div>
    `;

    habitContainer.appendChild(card);

    habitInput.value = "";
    timeInput.value = "";
    categorySelect.value = "other";

    updateProgress();
  }

  /* =========================
     8. EVENTS
  ========================= */

  addBtn.addEventListener("click", addHabit);
  habitInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addHabit();
  });

  habitContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".habit-card");
    if (!card) return;

    const id = card.getAttribute("data-id");
    const habit = habits.find(h => h.id == id);
    if (!habit) return;

    // ===== EDIT (FIXED TARGETING) =====
    const editBtn = e.target.closest("button.btn-edit");
    if (editBtn) {
      editingId = id;

      editName.value = habit.name;
      editCategory.value = habit.category;
      editTime.value = habit.time || "";

      editModal.hidden = false;
      return;
    }

    // ===== COMPLETE =====
    if (e.target.closest(".btn-complete")) {
      if (!habit.completedToday) {
        habit.completedToday = true;
        habit.streak++;
        habit.total++;
        habit.best = Math.max(habit.best, habit.streak);

        card.classList.add("is-completed");
        card.querySelector(".btn-complete").innerText = "Completed! 🔥";
      } else {
        habit.completedToday = false;
        habit.streak = Math.max(0, habit.streak - 1);
        habit.total = Math.max(0, habit.total - 1);

        card.classList.remove("is-completed");
        card.querySelector(".btn-complete").innerText = "Mark as Done";
      }

      refreshChips(card, habit);
      updateProgress();
      return;
    }

    // ===== DELETE =====
    if (e.target.closest(".btn-delete")) {
      habits = habits.filter(h => h.id != id);

      card.classList.add("deleting");
      setTimeout(() => {
        card.remove();
        updateProgress();
      }, 300);
    }
  });

  /* =========================
     9. EDIT MODAL ACTIONS
  ========================= */

  editCancel.addEventListener("click", () => {
    editModal.hidden = true;
    editingId = null;
  });

  editSave.addEventListener("click", () => {
    const habit = habits.find(h => h.id == editingId);
    if (!habit) return;

    habit.name = editName.value.trim();
    habit.category = editCategory.value;
    habit.time = editTime.value;

    const card = document.querySelector(`[data-id="${editingId}"]`);
    const cat = CATEGORIES[habit.category];

    card.querySelector(".habit-name").textContent = habit.name;
    card.querySelector(".habit-dot").textContent = cat.icon;
    card.style.setProperty("--cat-color", cat.color);

    let timeChip = card.querySelector(".chip-time");

    if (habit.time) {
      if (!timeChip) {
        timeChip = document.createElement("span");
        timeChip.className = "chip chip-time";
        card.querySelector(".habit-chips").appendChild(timeChip);
      }
      timeChip.textContent = `⏰ ${habit.time}`;
    } else {
      if (timeChip) timeChip.remove();
    }

    editModal.hidden = true;
    editingId = null;
  });

});