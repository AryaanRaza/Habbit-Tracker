// ============================================================
//  dashboard.js  —  FULL REPLACEMENT for your existing file
// ============================================================

// 1. Selectors
const habitInput     = document.querySelector('.habit-field');
const addBtn         = document.querySelector('.btn-add-habit');
const habitContainer = document.querySelector('.habit-list-container');
const emptyState     = document.getElementById('empty-state');
const progressFill   = document.getElementById('progress-fill');
const progressCount  = document.getElementById('progress-count');
const progressMotto  = document.getElementById('progress-motto');
const habitCountLbl  = document.getElementById('habit-count-label');

// 2. Data State
let habits = [];

// 3. Set today's date in the header
const todayEl = document.querySelector('#today-date');

if (todayEl) {
  todayEl.textContent = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// 4. Progress bar + motto update
const MOTTOS = [
    "You're on a roll! 🔥",
    "Stay consistent, stay unstoppable 💪",
    "Every check-off counts ✨",
    "Small steps, big results 🚀",
    "Progress over perfection 🌟",
];

const updateProgress = () => {
    const total = habits.length;
    const done  = habits.filter(h => h.completedToday).length;
    const pct   = total === 0 ? 0 : Math.round((done / total) * 100);

    progressFill.style.width      = pct + '%';
    progressCount.textContent     = `${done} / ${total} done`;
    habitCountLbl.textContent     = total === 1 ? '1 habit' : `${total} habits`;
    emptyState.style.display      = total === 0 ? 'block' : 'none';

    if (total === 0) {
        progressMotto.textContent = 'Add some habits to get started ✨';
    } else if (done === 0) {
        progressMotto.textContent = "Let's crush today's habits! 💥";
    } else if (done === total) {
        progressMotto.textContent = "Perfect day! All habits done! 🎉";
    } else {
        progressMotto.textContent = MOTTOS[done % MOTTOS.length];
    }
};

// 5. Hydrate existing seed cards from HTML
const initializeExistingHabits = () => {
    const existingCards = document.querySelectorAll('.habit-card');

    existingCards.forEach((card, index) => {
        const nameEl     = card.querySelector('.habit-name');
        const streakChip = card.querySelector('.chip-streak');
        const totalChip  = card.querySelector('.chip-total');

        if (!nameEl) return;

        const id     = Date.now() + index;
        const streak = streakChip ? parseInt(streakChip.textContent) || 0 : 0;
        const total  = totalChip  ? parseInt(totalChip.textContent)  || 0 : 0;

        card.setAttribute('data-id', id);
        habits.push({ id, name: nameEl.innerText, streak, total, completedToday: false });
    });

    updateProgress();
};

initializeExistingHabits();

// 6. Helper: refresh the chips on a card after state change
const refreshChips = (card, habit) => {
    const streakChip = card.querySelector('.chip-streak');
    const totalChip  = card.querySelector('.chip-total');
    if (streakChip) streakChip.textContent = `🔥 ${habit.streak} day streak`;
    if (totalChip)  totalChip.textContent  = `✓ ${habit.total} total`;
};

// 7. Create Habit Card
const createHabitCard = (habit) => {
    const card = document.createElement('article');
    card.classList.add('habit-card');
    card.setAttribute('data-id', habit.id);

    // Start invisible for the slide-in animation
    card.style.opacity   = '0';
    card.style.transform = 'translateY(10px)';

    card.innerHTML = `
        <span class="habit-dot"></span>
        <div class="habit-info">
            <h3 class="habit-name">${habit.name}</h3>
            <div class="habit-chips">
                <span class="chip chip-streak">🔥 ${habit.streak} day streak</span>
                <span class="chip chip-total">✓ ${habit.total} total</span>
            </div>
        </div>
        <div class="habit-actions">
            <button class="btn btn-complete">Mark as Done</button>
            <button class="btn-delete" title="Delete Habit">
                <span class="material-symbols-rounded">delete</span>
            </button>
        </div>
    `;

    habitContainer.appendChild(card);

    // Animate in
    requestAnimationFrame(() => {
        card.style.transition = 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.4,0,0.2,1)';
        card.style.opacity    = '1';
        card.style.transform  = 'translateY(0)';
    });
};

// 8. Add Habit
const addHabit = () => {
    let habitText = habitInput.value.trim();

    if (habitText.length > 0) {
        habitText = habitText.charAt(0).toUpperCase() + habitText.slice(1);
    }

    if (habitText === "") {
        alert("Please enter a habit name!");
        return;
    }

    const isDuplicate = habits.some(
        h => h.name.toLowerCase() === habitText.toLowerCase()
    );

    if (isDuplicate) {
        alert("You're already crushing this habit! No need to add it twice. 🔥");
        habitInput.value = "";
        return;
    }

    const newHabit = {
        id: Date.now(),
        name: habitText,
        streak: 0,
        total: 0,
        completedToday: false
    };

    habits.push(newHabit);
    createHabitCard(newHabit);
    habitInput.value = "";
    habitInput.focus();
    updateProgress();
};

// 9. Add Habit Event Listeners
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

// 10. Main Click Delegation (Complete + Delete)
habitContainer.addEventListener('click', (e) => {
    const completeBtn = e.target.closest('.btn-complete');
    const deleteBtn   = e.target.closest('.btn-delete');

    // MARK / UNMARK
    if (completeBtn) {
        const card     = completeBtn.closest('.habit-card');
        const habitId  = card.getAttribute('data-id');
        const habit    = habits.find(h => h.id == habitId);

        if (!habit) return;

        habit.completedToday = !habit.completedToday;

        if (habit.completedToday) {
            habit.streak += 1;
            habit.total  += 1;
            card.classList.add('is-completed');
            completeBtn.innerText = 'Completed! 🔥';
        } else {
            habit.streak = Math.max(0, habit.streak - 1);
            habit.total  = Math.max(0, habit.total  - 1);
            card.classList.remove('is-completed');
            completeBtn.innerText = 'Mark as Done';
        }

        refreshChips(card, habit);
        updateProgress();
        return;
    }

    // DELETE
    if (deleteBtn) {
        const card    = deleteBtn.closest('.habit-card');
        const habitId = card.getAttribute('data-id');

        if (confirm("Are you sure you want to delete this habit? 🌪️")) {
            habits = habits.filter(h => h.id != habitId);

            card.classList.add('deleting');
            setTimeout(() => {
                card.remove();
                updateProgress();
            }, 350);
        }
    }
});

// 11. Hover: Show Undo on Completed Cards
habitContainer.addEventListener('mouseover', (e) => {
    const btn = e.target.closest('.btn-complete');
    if (!btn) return;
    if (btn.closest('.habit-card').classList.contains('is-completed')) {
        btn.innerText = 'Undo? ↩️';
    }
});

habitContainer.addEventListener('mouseout', (e) => {
    const btn = e.target.closest('.btn-complete');
    if (!btn) return;
    if (btn.closest('.habit-card').classList.contains('is-completed')) {
        btn.innerText = 'Completed! 🔥';
    }
});