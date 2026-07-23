/* =========================
   HABIT CONTAINER
========================= */
const habitContainer = document.querySelector(".habit-list-container");

  /* =========================
     RENDER HABIT CARD
     Creates and injects a habit card into the UI.
     Used for:
     - loading saved habits
     - adding new habits
  ========================= */
  function renderHabitCard(habit) {
    // Get category styling + emoji/icon
    const cat = window.CATEGORIES[habit.category];

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
            <span class="chip-label">-day streak</span>            
          </span>

          <!-- Total completions -->
          <span class="chip chip-total">
            <span class="chip-icon">✓</span>
            <span class="chip-value">${habit.total}</span>
            <span class="chip-label">completion</span>
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
   GLOBAL EXPORTS
========================= */
window.renderHabitCard = renderHabitCard;