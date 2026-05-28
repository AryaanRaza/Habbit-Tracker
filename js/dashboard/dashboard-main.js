// ============================================================
//  HabitFlow — dashboard.js (FINAL STABLE VERSION)
//  ✅ Fixes:
//     - Edit modal save (robust UI update)
//     - Confetti only at 100% completion
//     - Undo hover text
//     - Toast popup
// ============================================================



document.addEventListener("DOMContentLoaded", () => {
  /* =========================
      SELECTORS
  ========================= */
  const todayDate = document.getElementById("today-date");
  const habitInput = document.querySelector(".habit-field");
  const addBtn = document.querySelector(".btn-add-habit");
  const habitContainer = document.querySelector(".habit-list-container");
  const timeInput = document.getElementById("habit-time");

  const categorySelect = document.getElementById("habit-category");

  /* =========================
    CONSTANTS
========================= */
window.CATEGORIES = {
  health: { icon: "🌿", color: "var(--cat-health)" },
  learning: { icon: "📚", color: "var(--cat-learning)" },
  fitness: { icon: "💪", color: "var(--cat-fitness)" },
  mindfulness: { icon: "🧠", color: "var(--cat-mindfulness)" },
  creativity: { icon: "🎨", color: "var(--cat-creativity)" },
  work: { icon: "💻", color: "var(--cat-work)" },
  other: { icon: "✨", color: "var(--cat-other)" },
};

  /* =========================
   INITIAL APP LOAD
========================= */

  loadHabits();

  initFilters();

  window.habits.forEach(renderHabitCard);

  updateProgress();
  updateFilterCounts();
  applyFilter();

  /* =========================
      DATE
  ========================= */

  function renderTodayDate() {
    const today = new Date();

    const formatted = today.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    todayDate.textContent = formatted;
  }

  renderTodayDate();

  /* =========================
     ADD HABIT
  ========================= */
  function addHabit() {
    let name = habitInput.value.trim();
    name = name.charAt(0).toUpperCase() + name.slice(1);
    if (!name) return alert("Enter a habit!");

    // 🚫 Prevent duplicate habits
    if (
      window.habits.some((h) => h.name.toLowerCase() === name.toLowerCase())
    ) {
      showToast("Habit already exists ⚠️");
      return;
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

    window.habits.push(habit);

    // Render the new habit card into UI
    renderHabitCard(habit);

    // Save updated habits to localStorage
    saveHabits();

    // 🔥 Reset inputs after adding
    habitInput.value = "";
    timeInput.value = ""; // ← THIS is your fix
    categorySelect.value = "other";

    updateProgress();
    applyFilter();
    updateFilterCounts();
  }

  addBtn.addEventListener("click", addHabit);

  habitInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addHabit();
    }
  });

  /* =========================
     EVENTS
  ========================= */
  function deleteHabit(card, id) {
    window.habits = window.habits.filter((h) => h.id != id);

    saveHabits();

    card.classList.add("deleting");

    setTimeout(() => {
      card.remove();

      updateProgress();
      applyFilter();
      updateFilterCounts();
    }, 250);

    showToast(`
    <span class="material-symbols-rounded toast-icon">
      delete_sweep
    </span>
    Habit deleted
  `);
  }

  habitContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".habit-card");
    if (!card) return;

    const id = card.getAttribute("data-id");
    const habit = window.habits.find((h) => h.id == id);
    if (!habit) return;

    // ===== MOBILE EDIT =====
    if (e.target.closest(".btn-edit-trigger")) {
      openEditModal(habit, id);

      card.querySelector(".habit-dropdown")?.classList.remove("open");

      return;
    }

    // ===== MOBILE DELETE =====
    if (e.target.closest(".btn-delete-trigger")) {
      deleteHabit(card, id);

      card.querySelector(".habit-dropdown")?.classList.remove("open");

      return;
    }

    // ===== MOBILE MORE MENU =====
    if (e.target.closest(".btn-more")) {
      e.stopPropagation();

      const dropdown = card.querySelector(".habit-dropdown");

      document.querySelectorAll(".habit-dropdown.open").forEach((d) => {
        if (d !== dropdown) {
          d.classList.remove("open");
        }
      });

      dropdown.classList.toggle("open");
      return;
    }

    // ===== EDIT =====
    if (e.target.closest(".btn-edit")) {
      openEditModal(habit, id);
      return;
    }

    // ===== COMPLETE =====
    if (e.target.closest(".btn-complete")) {
      if (e.target.closest(".btn-complete")) {
        if (!habit.completedToday) {
          completeHabit(card, habit);
        } else {
          undoHabit(card, habit);
        }

        return;
      }
    }

    if (e.target.closest(".btn-delete")) {
      deleteHabit(card, id);
      return;
    }
  });

  /* =========================
     HOVER → UNDO TEXT
  ========================= */
  habitContainer.addEventListener("mouseover", (e) => {
    const btn = e.target.closest(".btn-complete");
    if (!btn) return;

    const card = btn.closest(".habit-card");
    if (card.classList.contains("is-completed")) {
      btn.innerText = "Undo ? ↩️";
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
