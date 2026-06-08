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

  const emptyState = document.getElementById("empty-state");
  const progressFill = document.getElementById("progress-fill");
  const progressPct = document.getElementById("progress-pct");
  const progressCount = document.getElementById("progress-count");
  const habitCountLbl = document.getElementById("habit-count-label");

  const statBest = document.getElementById("stat-best");
  const statStreak = document.getElementById("stat-streak");
  const statTotal = document.getElementById("stat-total");

  /* ===== SIDEBAR QUICK STATS ===== */
  const navBestStreak = document.getElementById("nav-best-streak");
  const navTotalHabits = document.getElementById("nav-total-habits");

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
    health: { icon: "🌿", color: "var(--cat-health)" },
    learning: { icon: "📚", color: "var(--cat-learning)" },
    fitness: { icon: "💪", color: "var(--cat-fitness)" },
    mindfulness: { icon: "🧠", color: "var(--cat-mindfulness)" },
    creativity: { icon: "🎨", color: "var(--cat-creativity)" },
    work: { icon: "💻", color: "var(--cat-work)" },
    other: { icon: "✨", color: "var(--cat-other)" },
  };

  /* =========================
     3. STATE
  ========================= */
  let habits = [];
  let editingId = null;
  let currentFilter = "all";

  /* =========================
     LOCAL STORAGE
  ========================= */
  const STORAGE_KEY = "habitflow-habits";

  function saveHabits() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }

  function loadHabits() {
    const storedHabits = localStorage.getItem(STORAGE_KEY);

    if (!storedHabits) return [];

    try {
      return JSON.parse(storedHabits);
    } catch (error) {
      console.error("Failed to load habits:", error);
      return [];
    }
  }

  /* =========================
   INITIAL EMPTY STATE
========================= */
  function loadExistingHabits() {
    habits = [];

    updateProgress();
    updateFilterCounts();

    saveHabits();
  }

  /* =========================
   INITIAL APP LOAD
========================= */
  const storedHabits = localStorage.getItem(STORAGE_KEY);

  // FIRST EVER VISIT
  if (storedHabits === null) {
    loadExistingHabits();
  }

  // Existing saved habits
  else {
    habits = loadHabits();

    habits.forEach(renderHabitCard);

    updateProgress();
    updateFilterCounts();
    applyFilter();
  }

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
     TOAST
  ========================= */
  function showToast(msg) {
    if (!toast) return;
    toast.innerHTML = msg;
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
    updateSidebarStats();

    return pct; // 🔥 IMPORTANT
  }

  /* =========================
   SIDEBAR QUICK STATS
   Syncs sidebar numbers with app state
========================= */
  function updateSidebarStats() {
    // Highest streak across all habits
    const bestStreak = Math.max(...habits.map((h) => h.best), 0);

    // Total number of habits
    const totalHabits = habits.length;

    /* ===== Update values ===== */
    navBestStreak.textContent = bestStreak;
    navTotalHabits.textContent = totalHabits;

    /* ===== Trigger pop animation ===== */
    navBestStreak.classList.add("pop");
    navTotalHabits.classList.add("pop");

    /* Remove class so animation can replay */
    setTimeout(() => {
      navBestStreak.classList.remove("pop");
      navTotalHabits.classList.remove("pop");
    }, 200);
  }

  /* =========================
     HELPERS
  ========================= */
  function refreshChips(card, h) {
    const streakValue = card.querySelector(".chip-streak .chip-value");

    const totalValue = card.querySelector(".chip-total .chip-value");

    if (streakValue) {
      streakValue.textContent = h.streak;
    }

    if (totalValue) {
      totalValue.textContent = h.total;
    }
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
  function openEditModal(habit, id) {
    editingId = id;

    editName.value = habit.name;
    editCategory.value = habit.category;
    editTime.value = habit.time || "";

    editModal.hidden = false;
  }

  function deleteHabit(card, id) {
    habits = habits.filter((h) => h.id != id);

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
    const habit = habits.find((h) => h.id == id);
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

  /* =========================
     EDIT MODAL ACTIONS 
  ========================= */

  editCancel.addEventListener("click", () => {
    editModal.hidden = true;
    editingId = null;
  });

  editModal.addEventListener("click", (e) => {
    if (e.target === editModal) {
      editModal.hidden = true;
      editingId = null;
    }
  });

  editSave.addEventListener("click", async () => {
    const habit = habits.find((h) => h.id == editingId);
    if (!habit) return;

    setSaveLoading(true); // ✅ START LOADING

    // simulate slight delay (feels real UX)
    await new Promise((res) => setTimeout(res, 400));

    const updatedName = editName.value.trim();

    if (!updatedName) {
      showToast("Habit name cannot be empty");
      setSaveLoading(false);
      return;
    }

    habit.name = updatedName;
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

    // Save edited habit changes
    saveHabits();

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
  /* =========================
   MOBILE SWIPE TO COMPLETE
========================= */
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

      const habit = habits.find((h) => h.id == id);

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

      const habit = habits.find((h) => h.id == id);

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
});
