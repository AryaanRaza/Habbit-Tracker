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
     1. SELECTORS
  ========================= */
  const todayDate = document.getElementById("today-date");
  const habitInput = document.querySelector(".habit-field");
  const addBtn = document.querySelector(".btn-add-habit");
  const habitContainer = document.querySelector(".habit-list-container");
  const timeInput = document.getElementById("habit-time");

  const categorySelect = document.getElementById("habit-category");

  /* =========================
   2. CONSTANTS
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
     RENDER HABIT CARD
     Creates and injects a habit card into the UI.
     Used for:
     - loading saved habits
     - adding new habits
  ========================= */
  function renderHabitCard(habit) {
    // Get category styling + emoji/icon
    const cat = CATEGORIES[habit.category];

    // Create card element
    const card = document.createElement("article");

    // Base card class
    card.className = "habit-card";

    // If already completed today,
    // restore completed visual state
    if (habit.completedToday) {
      card.classList.add("is-completed");
    }

    // Attach unique ID to card
    card.setAttribute("data-id", habit.id);

    // Set category accent color
    card.style.setProperty("--cat-color", cat.color);

    /* =========================
       CARD HTML STRUCTURE
    ========================= */
    card.innerHTML = `
      
      <!-- Left emoji/icon -->
      <span class="habit-dot">${cat.icon}</span>

      <!-- Habit content -->
      <div class="habit-info">

        <!-- Habit title -->
        <h3 class="habit-name">${habit.name}</h3>

        <!-- Habit metadata chips -->
        <div class="habit-chips">

          <!-- Current streak -->
          <span class="chip chip-streak">
            <span class="chip-icon">🔥</span>
            <span class="chip-value">${habit.streak}</span>
            <span class="chip-label">day streak</span>            
          </span>

          <!-- Total completions -->
          <span class="chip chip-total">
            <span class="chip-icon">✓</span>
            <span class="chip-value">${habit.total}</span>
            <span class="chip-label">total</span>
          </span>


          <!-- Optional reminder time -->
          ${
            habit.time
              ? `<span class="chip chip-time">⏰ ${habit.time}</span>`
              : ""
          }

        </div>
      </div>

      <!-- Action buttons -->
<div class="habit-actions">

  <!-- Complete / Undo button -->
  <button class="btn btn-complete">
    ${habit.completedToday ? "Completed! 🔥" : "Mark as Done"}
  </button>

  <!-- Edit button (desktop only) -->
  <button class="btn-edit">
    <span class="material-symbols-rounded">edit</span>
  </button>

  <!-- Delete button (desktop only) -->
  <button class="btn-delete">
    <span class="material-symbols-rounded">delete</span>
  </button>

  <!-- ⋯ More menu (mobile only) -->
  <button class="btn-more" aria-label="More options">
    <span class="material-symbols-rounded">more_horiz</span>
    <div class="habit-dropdown">
      <div class="habit-dropdown-item btn-edit-trigger">
        <span class="material-symbols-rounded" style="font-size:16px">edit</span> Edit
      </div>
      <div class="habit-dropdown-item btn-delete-trigger is-delete">
        <span class="material-symbols-rounded" style="font-size:16px">delete</span> Delete
      </div>
    </div>
  </button>

</div>


    `;

    // Finally inject card into DOM
    habitContainer.appendChild(card);
  }

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
      const btn = card.querySelector(".btn-complete");

      if (!habit.completedToday) {
        habit.completedToday = true;
        habit.streak++;
        habit.total++;
        habit.best = Math.max(habit.best, habit.streak);

        card.classList.add("is-completed");
        btn.innerText = "Completed! 🔥";

        showToast("Nice! Habit completed ✅");
      } else {
        habit.completedToday = false;
        habit.streak = Math.max(0, habit.streak - 1);
        habit.total = Math.max(0, habit.total - 1);

        card.classList.remove("is-completed");
        btn.innerText = "Mark as Done";

        showToast("Marked as not done ❌");
      }

      refreshChips(card, habit);

      // Save updated completion state
      saveHabits();

      const pct = updateProgress();
      applyFilter();
      updateFilterCounts();

      // 🎉 ONLY when 100%
      if (pct === 100) {
        fireConfetti();
        showToast("Perfect day! 🎉");
      }

      return;
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
