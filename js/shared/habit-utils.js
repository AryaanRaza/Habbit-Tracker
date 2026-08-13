
/**
 * ============================================================
 * HabitFlow — Shared Stats Utilities
 * ============================================================
 */

function getTotalHabits(habits = []) {
  return habits.length;
}

function getTotalCompletions(habits = []) {
  return habits.reduce((sum, habit) => sum + (habit.total || 0), 0);
}

function getCompletedToday(habits = []) {
  return habits.filter((habit) => habit.completedToday).length;
}

function getBestStreak(habits = []) {
  return Math.max(...habits.map((habit) => habit.best || 0), 0);
}

function getCurrentStreak(habits = []) {
  return Math.max(...habits.map((habit) => habit.streak || 0), 0);
}

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

/* ============================================================
   HABIT ENGINE (Aryaan's undo/complete logic)

function getBestDayThisMonth(habits = []) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  if (!habit.lastCompletedDate) {
    habit.streak = 1;
  } else {
    const previous = new Date(habit.lastCompletedDate);
    const current = new Date(today);
    const diffDays = Math.floor((current - previous) / (1000 * 60 * 60 * 24));

    if (count > bestCount) {
      bestCount = count;
      bestDate = d;
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
function getActivityHeatmapData(habits = [], weeksCount = 12) {
  const today = new Date();
  const totalDays = weeksCount * 7;
  const days = [];

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toDateString();

    const totalHabits = habits.length;
    const completedCount = habits.filter((h) =>
      (h.completedDates || []).includes(dateStr)
    ).length;

    const pct = totalHabits === 0 ? 0 : Math.round((completedCount / totalHabits) * 100);
    let heat = 0;
    if (pct > 0 && pct < 34) heat = 1;
    else if (pct >= 34 && pct < 67) heat = 2;
    else if (pct >= 67 && pct < 100) heat = 3;
    else if (pct === 100 && totalHabits > 0) heat = 4;

    days.push({
      dateStr,
      heat,
      completedCount,
      totalHabits,
      isToday: dateStr === today.toDateString(),
      weekday: d.getDay(),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    });
  }

  const firstWeekday = days[0].weekday;
  const mondayIndex = firstWeekday === 0 ? 6 : firstWeekday - 1;

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
  const padded = [];
  for (let i = 0; i < mondayIndex; i++) padded.push(null);
  padded.push(...days);
  while (padded.length % 7 !== 0) padded.push(null);

  const weeks = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  return weeks;
}

/* ============================================================
   GLOBAL EXPORTS
============================================================ */
window.getTotalHabits = getTotalHabits;
window.getTotalCompletions = getTotalCompletions;
window.getBestStreak = getBestStreak;

window.applyHabitCompletion = applyHabitCompletion;
window.revertHabitCompletion = revertHabitCompletion;

window.getWeeklyCompletionData = getWeeklyCompletionData;
window.getBestDayThisMonth = getBestDayThisMonth;
window.getRangeStats = getRangeStats;
window.getHabitBreakdown = getHabitBreakdown;
window.getStreakMilestones = getStreakMilestones;
window.getCategoryBreakdown = getCategoryBreakdown;
window.getActivityHeatmapData = getActivityHeatmapData;