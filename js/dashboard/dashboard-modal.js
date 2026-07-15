/* ===== HABIT MODAL ===== */
const habitModal = document.getElementById("habit-modal");

const habitModalTitle = document.getElementById("habit-modal-title");
const habitModalIcon = document.getElementById("habit-modal-icon");

const habitName = document.getElementById("habit-name");
const habitCategory = document.getElementById("habit-category-modal");
const habitTime = document.getElementById("habit-time-modal");

const habitCancel = document.getElementById("habit-cancel");
const habitSave = document.getElementById("habit-save");
const filterTabs = document.querySelectorAll(".filter-tab");

/* =========================
   SAVE BUTTON LOADING STATE
    ========================= */
window.setSaveLoading = function(isLoading) {
  if (isLoading) {
    habitSave.disabled = true;
    habitSave.textContent = "Saving...";
  } else {
    habitSave.disabled = false;
    habitSave.textContent = "Save";
  }
}

window.openEditModal = function(habit, id) {
  window.editingId = id;

  editName.value = habit.name;
  editCategory.value = habit.category;
  editTime.value = habit.time || "";

  habitModal.hidden = false;
}

/* =========================
     EDIT MODAL ACTIONS 
  ========================= */

  editCancel.addEventListener("click", () => {
    habitModal.hidden = true;
    window.editingId = null;
  });

  habitModal.addEventListener("click", (e) => {
    if (e.target === habitModal) {
      habitModal.hidden = true;
      window.editingId = null;
    }
  });

  habitSave.addEventListener("click", async () => {
    const habit = window.habits.find((h) => h.id == window.editingId);
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

    const card = document.querySelector(`[data-id="${window.editingId}"]`);
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

    habitModal.hidden = true;
    window.editingId = null;

    // Save edited habit changes
    saveHabits();

    showToast("Habit updated ✨");
  });

  /* =========================
   KEYBOARD SHORTCUTS (MODAL)
========================= */
  document.addEventListener("keydown", (e) => {
    // only work when modal is open
    if (habitModal.hidden) return;

    // ESC → close modal
    if (e.key === "Escape") {
      habitModal.hidden = true;
      window.editingId = null;
      initialEditState = null;
      return;
    }

    // ENTER → save (but avoid textarea issues in future)
    if (e.key === "Enter") {
      e.preventDefault();

      // prevent saving if disabled
      if (!habitSave.disabled) {
        habitSave.click();
      }
    }
  });
