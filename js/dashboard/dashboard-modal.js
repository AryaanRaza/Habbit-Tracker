/* ===== EDIT MODAL ===== */
const editModal = document.getElementById("edit-modal");
const editName = document.getElementById("edit-name");
const editCategory = document.getElementById("edit-category");
const editTime = document.getElementById("edit-time");
const editCancel = document.getElementById("edit-cancel");
const editSave = document.getElementById("edit-save");
const filterTabs = document.querySelectorAll(".filter-tab");

/* =========================
   SAVE BUTTON LOADING STATE
    ========================= */
window.setSaveLoading = function(isLoading) {
  if (isLoading) {
    editSave.disabled = true;
    editSave.textContent = "Saving...";
  } else {
    editSave.disabled = false;
    editSave.textContent = "Save";
  }
}

window.openEditModal = function(habit, id) {
  window.editingId = id;

  editName.value = habit.name;
  editCategory.value = habit.category;
  editTime.value = habit.time || "";

  editModal.hidden = false;
}

/* =========================
     EDIT MODAL ACTIONS 
  ========================= */

  editCancel.addEventListener("click", () => {
    editModal.hidden = true;
    window.editingId = null;
  });

  editModal.addEventListener("click", (e) => {
    if (e.target === editModal) {
      editModal.hidden = true;
      window.editingId = null;
    }
  });

  editSave.addEventListener("click", async () => {
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

    editModal.hidden = true;
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
    if (editModal.hidden) return;

    // ESC → close modal
    if (e.key === "Escape") {
      editModal.hidden = true;
      window.editingId = null;
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
