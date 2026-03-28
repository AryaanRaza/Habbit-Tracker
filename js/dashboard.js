// 1. Select the Elements
const habitInput = document.querySelector('.habit-field');
const addBtn = document.querySelector('.btn-add-habit');
const habitContainer = document.querySelector('.habit-list-container');

// 2. Data State
let habits = []; 

// --- NEW: THE HYDRATION FUNCTION ---
const initializeExistingHabits = () => {
    const existingCards = document.querySelectorAll('.habit-card');
    
    existingCards.forEach((card, index) => {
        const name = card.querySelector('.habit-name').innerText;
        const id = Date.now() + index; // Give each existing card a unique ID
        
        // Add ID to the HTML element so the click listener can find it
        card.setAttribute('data-id', id);
        
        // Add it to our JavaScript array
        habits.push({
            id: id,
            name: name,
            streak: 0, // You can pull the real number from the text if you want!
            total: 0,
            completedToday: false
        });
    });
};

// Run this immediately when the script loads
initializeExistingHabits();

// 3. The Function to Add a Habit
const addHabit = () => {
    const habitText = habitInput.value.trim();

    // Validation: Empty check
    if (habitText === "") {
        alert("Please enter a habit name!");
        return;
    }

    // DUPLICATE CHECK: Compare against our data array
    // .some() returns true if any item matches the condition
    const isDuplicate = habits.some(h => h.name.toLowerCase() === habitText.toLowerCase());

    if (isDuplicate) {
        alert("You're already crushing this habit! No need to add it twice. 🔥");
        habitInput.value = "";
        return;
    }

    // Create a Habit Object (Better for scaling to MERN)
    const newHabit = {
        id: Date.now(), // Unique ID for each habit
        name: habitText,
        streak: 0,
        total: 0,
        completedToday: false
    };

    // Add to our data array
    habits.push(newHabit);

    // Render the card to the UI
    createHabitCard(newHabit);

    // Clear and Focus
    habitInput.value = "";
    habitInput.focus();
};

// 4. Helper function to build the HTML (Keeps code clean)
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

// 5. Event Listeners (Add Habit)
addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addHabit();
});

habitInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addHabit();
});

// 6. Event Delegation (Click, MouseOver, and MouseOut)

// --- A. THE CLICK TOGGLE ---
habitContainer.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.btn-delete');

    if (deleteBtn) {
        const card = deleteBtn.closest('.habit-card');
        const habitId = card.getAttribute('data-id');

        if (confirm("Are you sure you want to delete this habit? 🌪️")) {
            habits = habits.filter(h => h.id != habitId);

            card.style.transform = "translateX(20px)";
            card.style.opacity = "0";

            setTimeout(() => {
                card.remove();
            }, 300);

            console.log("Habit deleted. Current list:", habits);
        }
    }
});

habitContainer.addEventListener('click', (e) => {
    const completeBtn = e.target.closest('.btn-complete');
    const deleteBtn = e.target.closest('.btn-delete');

    // MARK / UNMARK
    if (completeBtn) {
        const button = completeBtn;
        const card = button.closest('.habit-card');
        const habitId = card.getAttribute('data-id');
        const habitIndex = habits.findIndex(h => h.id == habitId);

        if (habitIndex !== -1) {
            const habit = habits[habitIndex];

            if (!habit.completedToday) {
                habit.completedToday = true;
                habit.streak += 1;
                habit.total += 1;
                card.classList.add('is-completed');
                button.innerText = 'Completed! 🔥';
            } else {
                habit.completedToday = false;
                habit.streak -= 1;
                habit.total -= 1;
                card.classList.remove('is-completed');
                button.innerText = 'Mark as Done';
            }

            const statsText = card.querySelector('.habit-stats');
            statsText.innerText = `Streak: ${habit.streak} days | Total: ${habit.total}`;
        }
    }

    // DELETE
    if (deleteBtn) {
        const card = deleteBtn.closest('.habit-card');
        const habitId = card.getAttribute('data-id');

        if (confirm("Are you sure you want to delete this habit? 🌪️")) {
            habits = habits.filter(h => h.id != habitId);

            card.style.transform = "translateX(20px)";
            card.style.opacity = "0";

            setTimeout(() => {
                card.remove();
            }, 300);

            console.log("Habit deleted. Current list:", habits);
        }
    }
});

// --- D. THE DELETE ACTION ---
habitContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        const card = e.target.closest('.habit-card');
        const habitId = card.getAttribute('data-id');

        // 1. Confirmation (Optional but recommended for premium UX)
        if (confirm("Are you sure you want to delete this habit? 🌪️")) {
            
            // 2. Remove from the Data Array
            habits = habits.filter(h => h.id != habitId);

            // 3. Smooth UI Removal
            card.style.transform = "translateX(20px)";
            card.style.opacity = "0";
            
            setTimeout(() => {
                card.remove();
            }, 300); // Matches the transition time
            
            console.log("Habit deleted. Current list:", habits);
        }
    }
});