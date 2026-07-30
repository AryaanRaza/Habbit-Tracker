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
   HABIT ENGINE
============================================================ */

/**
 * Applies a habit completion.
 *
 * Handles all habit-related state updates while storing
 * a temporary undo snapshot in memory.
 *
 * @param {Object} habit
 */
function applyHabitCompletion(habit) {
  const today = new Date().toDateString();

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
  }

  habit.completedToday = true;
  habit.total++;
  habit.lastCompletedDate = today;
  habit.best = Math.max(habit.best, habit.streak);
}

/**
 * Restores the habit to its state before completion.
 *
 * @param {Object} habit
 */
/**
 * Reverts a habit completion.
 *
 * @param {Object} habit
 * @param {Object} snapshot
 */
function revertHabitCompletion(habit, snapshot) {
  if (!snapshot) return;

  habit.streak = snapshot.streak;
  habit.total = snapshot.total;
  habit.lastCompletedDate = snapshot.lastCompletedDate;
  habit.completedToday = snapshot.completedToday;
}

/* ============================================================
   GLOBAL EXPORTS
============================================================ */
window.getTotalHabits = getTotalHabits;
window.getCompletedToday = getCompletedToday;
window.getTotalCompletions = getTotalCompletions;
window.getCurrentStreak = getCurrentStreak;
window.getBestStreak = getBestStreak;

window.applyHabitCompletion = applyHabitCompletion;
window.revertHabitCompletion = revertHabitCompletion;
