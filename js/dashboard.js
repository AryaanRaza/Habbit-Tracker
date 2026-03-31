// 1. Select the Elements
const habitInput = document.querySelector('.habit-field');
const addBtn = document.querySelector('.btn-add-habit');
const habitContainer = document.querySelector('.habit-list-container');

// 2. Data State
let habits = [];

// 3. Hydrate Existing Habits from HTML
const initializeExistingHabits = () => {
    const existingCards = document.querySelectorAll('.habit-card');

    existingCards.forEach((card, index) => {
        const name = card.querySelector('.habit-name').innerText;
        const id = Date.now() + index;

        // Give each existing card an ID
        card.setAttribute('data-id', id);

        // Add to JS array
        habits.push({
            id: id,
            name: name,
            streak: 0,
            total: 0,
            completedToday: false
        });
    });
};

// Run immediately
initializeExistingHabits();

// 4. Add Habit Function
const addHabit = () => {
    const habitText = habitInput.value.trim();

    // Empty validation
    if (habitText === "") {
        alert("Please enter a habit name!");
        return;
    }

    // Duplicate validation
    const isDuplicate = habits.some(
        h => h.name.toLowerCase() === habitText.toLowerCase()
    );

    if (isDuplicate) {
        alert("You're already crushing this habit! No need to add it twice. 🔥");
        habitInput.value = "";
        return;
    }

    // Create habit object
    const newHabit = {
        id: Date.now(),
        name: habitText,
        streak: 0,
        total: 0,
        completedToday: false
    };

    // Add to array
    habits.push(newHabit);

    // Render to UI
    createHabitCard(newHabit);

    // Reset input
    habitInput.value = "";
    habitInput.focus();
};

// 5. Create Habit Card
const createHabitCard = (habit) => {
    const habitCard = document.createElement('article');
    habitCard.classList.add('habit-card');
    habitCard.setAttribute('data-id', habit.id);

    habitCard.innerHTML = `
        <div class="habit-info">
            <h3 class="habit-name">${habit.name}</h3>
            <div class="habit-meta">
                <p class="habit-stats">Streak: ${habit.streak} days | Total: ${habit.total}</p>
            </div>
        </div>
        <div class="habit-actions">
            <button class="btn btn-complete">Mark as Done</button>
            <button class="btn-delete" title="Delete Habit">
                <span class="material-symbols-rounded">delete</span>
            </button>
        </div>
    `;

    habitContainer.appendChild(habitCard);
};

// 6. Add Habit Event Listeners
addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addHabit();
});

habitInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addHabit();
    }
});

// 7. Main Click Event Delegation (Complete + Delete)
habitContainer.addEventListener('click', (e) => {
    const completeBtn = e.target.closest('.btn-complete');
    const deleteBtn = e.target.closest('.btn-delete');

    // MARK / UNMARK HABIT
    if (completeBtn) {
        const button = completeBtn;
        const card = button.closest('.habit-card');
        const habitId = card.getAttribute('data-id');
        const habitIndex = habits.findIndex(h => h.id == habitId);

        if (habitIndex !== -1) {
            const habit = habits[habitIndex];

            if (!habit.completedToday) {
                // Mark done
                habit.completedToday = true;
                habit.streak += 1;
                habit.total += 1;
                card.classList.add('is-completed');
                button.innerText = 'Completed! 🔥';
            } else {
                // Undo
                habit.completedToday = false;
                habit.streak -= 1;
                habit.total -= 1;
                card.classList.remove('is-completed');
                button.innerText = 'Mark as Done';
            }

            // Update stats text
            const statsText = card.querySelector('.habit-stats');
            statsText.innerText = `Streak: ${habit.streak} days | Total: ${habit.total}`;
        }

        return; // prevent accidental fall-through
    }

    // DELETE HABIT
    if (deleteBtn) {
        const card = deleteBtn.closest('.habit-card');
        const habitId = card.getAttribute('data-id');

        if (confirm("Are you sure you want to delete this habit? 🌪️")) {
            // Remove from array
            habits = habits.filter(h => h.id != habitId);

            // Animate out
            card.style.transform = "translateX(20px)";
            card.style.opacity = "0";

            setTimeout(() => {
                card.remove();
            }, 300);

            console.log("Habit deleted. Current list:", habits);
        }
    }
});

// 8. Hover Effect: Show Undo on Completed Habit
habitContainer.addEventListener('mouseover', (e) => {
    const completeBtn = e.target.closest('.btn-complete');
    if (!completeBtn) return;

    const card = completeBtn.closest('.habit-card');

    if (card.classList.contains('is-completed')) {
        completeBtn.innerText = 'Undo? ↩️';
    }
});

// 9. Hover Out: Restore Completed Text
habitContainer.addEventListener('mouseout', (e) => {
    const completeBtn = e.target.closest('.btn-complete');
    if (!completeBtn) return;

    const card = completeBtn.closest('.habit-card');

    if (card.classList.contains('is-completed')) {
        completeBtn.innerText = 'Completed! 🔥';
    }
});