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
  const habitInput = document.querySelector(".habit-field");
  const addBtn = document.querySelector(".btn-add-habit");
  const habitContainer = document.querySelector(".habit-list-container");
  const timeInput = document.getElementById("habit-time");

  const emptyState = document.getElementById("empty-state");
  const progressFill = document.getElementById("progress-fill");
  const progressPct = document.getElementById("progress-pct");
  const progressCount = document.getElementById("progress-count");
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
  const filterTabs = document.querySelectorAll(".filter-tab");

  /* =========================
     2. CONSTANTS
  ========================= */
  const CATEGORIES = {
    health: { icon: "💪", color: "var(--cat-health)" },
    learning: { icon: "📚", color: "var(--cat-learning)" },
    fitness: { icon: "🏃", color: "var(--cat-fitness)" },
    mindfulness: { icon: "🧘", color: "var(--cat-mindfulness)" },
    creativity: { icon: "🎨", color: "var(--cat-creativity)" },
    work: { icon: "💼", color: "var(--cat-work)" },
    other: { icon: "✨", color: "var(--cat-other)" },
  };

  /* =========================
     3. STATE
  ========================= */
  let habits = [];
  let editingId = null;
  let currentFilter = "all";

  /* =========================
     LOAD EXISTING STATIC CARDS
  ========================= */
  function loadExistingHabits() {
    const cards = document.querySelectorAll(".habit-card");

    cards.forEach((card) => {
      const name = card.querySelector(".habit-name")?.textContent.trim();
      if (!name || habits.some((h) => h.name === name)) return;

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
  updateFilterCounts();

  /* =========================
     TOAST
  ========================= */
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");

    setTimeout(() => toast.classList.remove("show"), 2000);
  }

  /* =========================
   SAVE BUTTON LOADING STATE
    ========================= */
  function setSaveLoading(isLoading) {
    if (isLoading) {
      editSave.disabled = true;
      editSave.textContent = "Saving...";
    } else {
      editSave.disabled = false;
      editSave.textContent = "Save";
    }
  }

  /* =========================
     CONFETTI (100% ONLY)
  ========================= */
  function fireConfetti() {
    if (!window.confetti) return;

    window.confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });
  }

  /* =========================
     STATS + PROGRESS
  ========================= */
  function updateStats() {
    statBest.textContent = Math.max(...habits.map((h) => h.best), 0);
    statStreak.textContent = Math.max(...habits.map((h) => h.streak), 0);
    statTotal.textContent = habits.reduce((s, h) => s + h.total, 0);
  }

  function updateProgress() {
    const total = habits.length;
    const done = habits.filter((h) => h.completedToday).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);

    progressPct.textContent = pct + "%";
    progressFill.style.width = pct + "%";
    progressCount.textContent = `${done} / ${total} done`;
    habitCountLbl.textContent = total === 1 ? "1 habit" : `${total} habits`;
    emptyState.style.display = total === 0 ? "block" : "none";

    updateStats();

    return pct; // 🔥 IMPORTANT
  }

  /* =========================
     HELPERS
  ========================= */
  function refreshChips(card, h) {
    card.querySelector(".chip-streak").textContent =
      `🔥 ${h.streak} day streak`;
    card.querySelector(".chip-total").textContent = `✓ ${h.total} total`;
  }

  /* =========================
   FILTER LOGIC
  ========================= */
  function applyFilter() {
    const cards = document.querySelectorAll(".habit-card");

    cards.forEach((card) => {
      const id = card.getAttribute("data-id");
      const habit = habits.find((h) => h.id == id);
      if (!habit) return;

      let show = true;

      if (currentFilter === "active") {
        show = !habit.completedToday;
      } else if (currentFilter === "completed") {
        show = habit.completedToday;
      }

      card.style.display = show ? "flex" : "none";
    });
  }
  /* =========================
   FILTER COUNTS
  ========================= */
  function updateFilterCounts() {
    const all = habits.length;
    const active = habits.filter((h) => !h.completedToday).length;
    const completed = habits.filter((h) => h.completedToday).length;

    filterTabs.forEach((tab) => {
      const type = tab.dataset.filter;
      const countEl = tab.querySelector(".count");

      if (!countEl) return;

      if (type === "all") countEl.textContent = all;
      if (type === "active") countEl.textContent = active;
      if (type === "completed") countEl.textContent = completed;
    });
  }

  /* =========================
     ADD HABIT
  ========================= */
  function addHabit() {
    let name = habitInput.value.trim();
    name = name.charAt(0).toUpperCase() + name.slice(1);
    if (!name) return alert("Enter a habit!");

    // 🚫 Prevent duplicate habits
    if (habits.some((h) => h.name.toLowerCase() === name.toLowerCase())) {
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
        <button class="btn-edit"><span class="material-symbols-rounded">edit</span></button>
        <button class="btn btn-complete">Mark as Done</button>
        <button class="btn-delete"><span class="material-symbols-rounded">delete</span></button>
      </div>
    `;

    habitContainer.appendChild(card);

    // 🔥 Reset inputs after adding
    habitInput.value = "";
    timeInput.value = ""; // ← THIS is your fix
    categorySelect.value = "other";

    updateProgress();
    applyFilter();
    updateFilterCounts();
  }

  addBtn.addEventListener("click", addHabit);

  /* =========================
   FILTER TAB EVENTS
  ========================= */
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      currentFilter = tab.dataset.filter;
      applyFilter();
    });
  });

  habitInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addHabit();
    }
  });

  /* =========================
     EVENTS
  ========================= */
  habitContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".habit-card");
    if (!card) return;

    const id = card.getAttribute("data-id");
    const habit = habits.find((h) => h.id == id);
    if (!habit) return;

    // ===== EDIT =====
    if (e.target.closest(".btn-edit")) {
      editingId = id;

      editName.value = habit.name;
      editCategory.value = habit.category;
      editTime.value = habit.time || "";

      editModal.hidden = false;
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

    // ===== DELETE =====
    if (e.target.closest(".btn-delete")) {
      habits = habits.filter((h) => h.id != id);

      card.classList.add("deleting");
      setTimeout(() => {
        card.remove();
        updateProgress();
        applyFilter();
        updateFilterCounts();
      }, 250);

      showToast("Habit deleted 🗑️");
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

  /* =========================
     EDIT MODAL ACTIONS 
  ========================= */

  editCancel.addEventListener("click", () => {
    editModal.hidden = true;
    editingId = null;
  });

  editSave.addEventListener("click", async () => {
    const habit = habits.find((h) => h.id == editingId);
    if (!habit) return;

    setSaveLoading(true); // ✅ START LOADING

    // simulate slight delay (feels real UX)
    await new Promise((res) => setTimeout(res, 400));

    habit.name = editName.value.trim();
    habit.category = editCategory.value;
    habit.time = editTime.value;

    const card = document.querySelector(`[data-id="${editingId}"]`);
    if (!card) {
      setSaveLoading(false);
      return;
    }

    const cat = CATEGORIES[habit.category];

    // SAFE UI UPDATE
    card.querySelector(".habit-name").textContent = habit.name;
    card.querySelector(".habit-dot").textContent = cat.icon;
    card.style.setProperty("--cat-color", cat.color);

    let chips = card.querySelector(".habit-chips");
    let timeChip = card.querySelector(".chip-time");

    if (habit.time) {
      if (!timeChip) {
        timeChip = document.createElement("span");
        timeChip.className = "chip chip-time";
        chips.appendChild(timeChip);
      }
      timeChip.textContent = `⏰ ${habit.time}`;
    } else {
      if (timeChip) timeChip.remove();
    }

    setSaveLoading(false); // ✅ STOP LOADING

    editModal.hidden = true;
    editingId = null;

    showToast("Habit updated ✨");
  });

  /* =========================
   KEYBOARD SHORTCUTS (MODAL)
========================= */
  document.addEventListener("keydown", (e) => {
    // only work when modal is open
    if (editModal.hidden) return;

    // ESC → close modal
    if (e.key === "Escape") {
      editModal.hidden = true;
      editingId = null;
      initialEditState = null;
      return;
    }

    // ENTER → save (but avoid textarea issues in future)
    if (e.key === "Enter") {
      e.preventDefault();

      // prevent saving if disabled
      if (!editSave.disabled) {
        editSave.click();
      }
    }
  });
});
