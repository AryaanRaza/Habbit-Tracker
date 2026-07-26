/**
 * ============================================================
 * HabitFlow — Shared Stats Utilities
 * ------------------------------------------------------------
 * Centralized helper functions for calculating habit statistics.
 * Shared across Dashboard, Settings, Stats, and future pages.
 * ============================================================
 */

/* ============================================================
   HABIT COUNTS
============================================================ */
/**
 * Returns the total number of habits.
 *
 * @param {Array} habits
 * @returns {number}
 */
function getTotalHabits(habits = []) {
  return habits.length;
}

/**
 * Returns the number of habits completed today.
 *
 * @param {Array} habits
 * @returns {number}
 */
function getCompletedToday(habits = []) {
  return habits.filter((habit) => habit.completedToday).length;
}

/**
 * Returns the lifetime total completions across all habits.
 *
 * @param {Array} habits
 * @returns {number}
 */
function getTotalCompletions(habits = []) {
  return habits.reduce((sum, habit) => sum + (habit.total || 0), 0);
}

/* ============================================================
   STREAK QUERIES
============================================================ */

/**
 * Returns the highest current streak across all habits.
 *
 * @param {Array} habits
 * @returns {number}
 */
function getCurrentStreak(habits = []) {
  return Math.max(...habits.map((habit) => habit.streak || 0), 0);
}

/**
 * Returns the highest streak achieved across all habits.
 *
 * @param {Array} habits
 * @returns {number}
 */
function getBestStreak(habits = []) {
  return Math.max(...habits.map((habit) => habit.best || 0), 0);
}
/* ============================================================
   STREAK ENGINE
============================================================ */

/**
 * Updates a habit's streak after a successful completion.
 *
 * Handles:
 * - First completion
 * - Consecutive day
 * - Missed days
 * - Best streak updates
 *
 * @param {Object} habit
 */
function updateHabitStreak(habit) {
  const today = new Date().toDateString();

  // No previous completion
  if (!habit.lastCompletedDate) {
    habit.streak = 1;
  } else {
    const previous = new Date(habit.lastCompletedDate);

    const current = new Date(today);

    const diffDays = Math.floor((current - previous) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      habit.streak++;
    } else if (diffDays > 1) {
      habit.streak = 1;
    }

    // diffDays === 0
    // same-day completion
    // leave streak unchanged
  }

  habit.best = Math.max(habit.best || 0, habit.streak);

  habit.lastCompletedDate = today;
}
/**
 * Restores a habit's streak after undoing today's completion.
 *
 * @param {Object} habit
 */
function undoHabitStreak(habit) {
  habit.streak = Math.max(0, habit.streak - 1);

  habit.lastCompletedDate = null;
}
/* ============================================================
   GLOBAL EXPORTS
============================================================ */
window.getTotalHabits = getTotalHabits;
window.getCompletedToday = getCompletedToday;
window.getTotalCompletions = getTotalCompletions;
window.getCurrentStreak = getCurrentStreak;
window.getBestStreak = getBestStreak;

window.updateHabitStreak = updateHabitStreak;
window.undoHabitStreak = undoHabitStreak;
