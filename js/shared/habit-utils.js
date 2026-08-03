
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
   HABIT ENGINE (Aryaan's undo/complete logic)
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

  // completedDates history — needed for stats page charts/calendar
  if (!habit.completedDates) habit.completedDates = [];
  if (!habit.completedDates.includes(today)) {
    habit.completedDates.push(today);
  }
}

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
  habit.best = snapshot.best;
  habit.lastCompletedDate = snapshot.lastCompletedDate;
  habit.completedToday = snapshot.completedToday;
  habit.completedDates = snapshot.completedDates
    ? [...snapshot.completedDates]
    : habit.completedDates;
}


/* ============================================================
   STATS PAGE — CHARTS, CALENDAR, BADGES
============================================================ */

/**
 * Last 7 days of completion data — for the weekly bar chart.
 *
 * @param {Array} habits
 * @returns {Array}
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
      (h.completedDates || []).includes(dateStr)
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
 * Finds the day this month with the most habits completed.
 *
 * @param {Array} habits
 * @returns {Object|null}
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
      (h.completedDates || []).includes(dateStr)
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
 * Completed count + completion rate for a given range (week/month/all).
 *
 * @param {Array} habits
 * @param {string} range
 * @returns {Object}
 */
function getRangeStats(habits = [], range = "week") {
  const now = new Date();
  let daysBack = range === "week" ? 7 : range === "month" ? now.getDate() : null;

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
 * Per-habit completion % for the current month — for the breakdown list.
 *
 * @param {Array} habits
 * @returns {Array}
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
