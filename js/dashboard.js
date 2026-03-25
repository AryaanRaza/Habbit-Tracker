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
        <button class="btn btn-complete">Mark as Done</button>
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

// 6. Event Delegation (Mark as Done)
habitContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-complete')) {
        const button = e.target;
        const card = button.closest('.habit-card');
        const habitId = card.getAttribute('data-id');

        // Update the Data Array state
        const habitIndex = habits.findIndex(h => h.id == habitId);
        if (habitIndex !== -1) {
            habits[habitIndex].completedToday = true;
            habits[habitIndex].streak += 1;
            habits[habitIndex].total += 1;
            
            // Update the UI
            card.style.opacity = '0.6';
            button.innerText = 'Completed! 🔥';
            button.style.background = '#ff5f7e';
            button.disabled = true;
            
            // Update the text on the card
            const statsText = card.querySelector('.habit-stats');
            statsText.innerText = `Streak: ${habits[habitIndex].streak} days | Total: ${habits[habitIndex].total}`;
        }
    }
});

