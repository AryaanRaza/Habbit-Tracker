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
                ADNAN
============================================================ */

/**
 * Weekly completion data (last 7 days, rolling) — for bar chart
 */
function getWeeklyCompletionData(habits = []) {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toDateString();

    const totalHabits = habits.length;
    const completedCount = habits.filter((h) =>
      (h.completedDates || []).includes(dateStr),
    ).length;

    let status = "none";
    if (totalHabits > 0) {
      if (completedCount === totalHabits) status = "all";
      else if (completedCount > 0) status = "partial";
    }
    if (dateStr === today.toDateString()) status = "today";

    days.push({
      dateStr,
      label: d.toLocaleDateString("en-US", { weekday: "narrow" }),
      completedCount,
      totalHabits,
      status,
    });
  }

  return days;
}

/**
 * Best day this month (most habits completed on a single day)
 */
function getBestDayThisMonth(habits = []) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let bestDate = null;
  let bestCount = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    if (d > now) break;

    const dateStr = d.toDateString();
    const count = habits.filter((h) =>
      (h.completedDates || []).includes(dateStr),
    ).length;

    if (count > bestCount) {
      bestCount = count;
      bestDate = d;
    }
  }

  if (!bestDate) return null;

  return {
    label: bestDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    completedCount: bestCount,
    totalHabits: habits.length,
  };
}

/**
 * Range-based stats (week / month / all) — for toggle
 */
function getRangeStats(habits = [], range = "week") {
  const now = new Date();
  let daysBack =
    range === "week" ? 7 : range === "month" ? now.getDate() : null;

  let completedCount = 0;

  habits.forEach((h) => {
    const dates = h.completedDates || [];
    if (range === "all") {
      completedCount += h.total || dates.length;
    } else {
      dates.forEach((dateStr) => {
        const d = new Date(dateStr);
        const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < daysBack) completedCount++;
      });
    }
  });

  const possible = range === "all" ? null : habits.length * daysBack;
  const rate = possible ? Math.round((completedCount / possible) * 100) : null;

  return { completedCount, rate };
}

/**
 * Per-habit breakdown — % completed this month
 */
function getHabitBreakdown(habits = []) {
  const now = new Date();
  const daysElapsed = now.getDate();

  return habits.map((h) => {
    const completedThisMonth = (h.completedDates || []).filter((dateStr) => {
      const d = new Date(dateStr);
      return (
        d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      );
    }).length;

    const pct =
      daysElapsed === 0
        ? 0
        : Math.min(100, Math.round((completedThisMonth / daysElapsed) * 100));

    return {
      name: h.name,
      category: h.category || "other",
      completedThisMonth,
      pct,
    };
  });
}

/**
 * Monthly calendar grid data (Mon-start)
 */
function getStreakCalendarData(habits = []) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1);
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const totalHabits = habits.length;
  const todayStr = now.toDateString();
  const days = [];

  for (let i = 0; i < startOffset; i++) days.push(null);

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const dateStr = d.toDateString();

    const completedCount = habits.filter((h) =>
      (h.completedDates || []).includes(dateStr),
    ).length;

    let status = "none";
    if (dateStr === todayStr) status = "today";
    else if (d > now) status = "future";
    else if (totalHabits > 0 && completedCount === totalHabits) status = "all";
    else if (completedCount > 0) status = "partial";

    days.push({ day, status });
  }

  return {
    monthLabel: firstDay.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    days,
  };
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

/* ============================================================
   GLOBAL EXPORTS(ADNAN)
============================================================ */

window.getWeeklyCompletionData = getWeeklyCompletionData;
window.getBestDayThisMonth = getBestDayThisMonth;
window.getRangeStats = getRangeStats;
window.getHabitBreakdown = getHabitBreakdown;
window.getStreakCalendarData = getStreakCalendarData;
