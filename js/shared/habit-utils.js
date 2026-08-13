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
//  * 





/**
 * ============================================================
 * HabitFlow — Shared Stats Utilities
 * ============================================================
 */

// function getTotalHabits(habits = []) {
//   return habits.length;
// }

// function getTotalCompletions(habits = []) {
//   return habits.reduce((sum, habit) => sum + (habit.total || 0), 0);
// }

// function getCompletedToday(habits = []) {
//   return habits.filter((habit) => habit.completedToday).length;
// }

// function getBestStreak(habits = []) {
//   return Math.max(...habits.map((habit) => habit.best || 0), 0);
// }

// function getCurrentStreak(habits = []) {
//   return Math.max(...habits.map((habit) => habit.streak || 0), 0);
// }

// function getWeeklyCompletionData(habits = []) {
//   const days = [];
//   const today = new Date();

//   for (let i = 6; i >= 0; i--) {
//     const d = new Date();
//     d.setDate(today.getDate() - i);
//     const dateStr = d.toDateString();

//     const totalHabits = habits.length;
//     const completedCount = habits.filter((h) =>
//       (h.completedDates || []).includes(dateStr)
//     ).length;

//     let status = "none";
//     if (totalHabits > 0) {
//       if (completedCount === totalHabits) status = "all";
//       else if (completedCount > 0) status = "partial";
//     }
//     if (dateStr === today.toDateString()) status = "today";

//     days.push({
//       dateStr,
//       label: d.toLocaleDateString("en-US", { weekday: "narrow" }),
//       completedCount,
//       totalHabits,
//       status,
//     });
//   }

//   return days;
// }

// function getBestDayThisMonth(habits = []) {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = now.getMonth();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();

//   let bestDate = null;
//   let bestCount = 0;

//   for (let day = 1; day <= daysInMonth; day++) {
//     const d = new Date(year, month, day);
//     if (d > now) break;

//     const dateStr = d.toDateString();
//     const count = habits.filter((h) =>
//       (h.completedDates || []).includes(dateStr)
//     ).length;

//     if (count > bestCount) {
//       bestCount = count;
//       bestDate = d;
//     }
//   }

//   if (!bestDate) return null;

//   return {
//     label: bestDate.toLocaleDateString("en-US", {
//       weekday: "long",
//       month: "long",
//       day: "numeric",
//     }),
//     completedCount: bestCount,
//     totalHabits: habits.length,
//   };
// }

// function getRangeStats(habits = [], range = "week") {
//   const now = new Date();
//   let daysBack = range === "week" ? 7 : range === "month" ? now.getDate() : null;

//   let completedCount = 0;

//   habits.forEach((h) => {
//     const dates = h.completedDates || [];
//     if (range === "all") {
//       completedCount += h.total || dates.length;
//     } else {
//       dates.forEach((dateStr) => {
//         const d = new Date(dateStr);
//         const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
//         if (diffDays >= 0 && diffDays < daysBack) completedCount++;
//       });
//     }
//   });

//   const possible = range === "all" ? null : habits.length * daysBack;
//   const rate = possible ? Math.round((completedCount / possible) * 100) : null;

//   return { completedCount, rate };
// }

// function getHabitBreakdown(habits = []) {
//   const now = new Date();
//   const daysElapsed = now.getDate();

//   return habits.map((h) => {
//     const completedThisMonth = (h.completedDates || []).filter((dateStr) => {
//       const d = new Date(dateStr);
//       return (
//         d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
//       );
//     }).length;

//     const pct =
//       daysElapsed === 0
//         ? 0
//         : Math.min(100, Math.round((completedThisMonth / daysElapsed) * 100));

//     return {
//       name: h.name,
//       category: h.category || "other",
//       completedThisMonth,
//       pct,
//     };
//   });
// }

// /**
//  * Monthly calendar grid — now with heat level (0-4) for heatmap look
//  */
// function getStreakCalendarData(habits = []) {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = now.getMonth();

//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const firstDay = new Date(year, month, 1);
//   let startOffset = firstDay.getDay() - 1;
//   if (startOffset < 0) startOffset = 6;

//   const totalHabits = habits.length;
//   const todayStr = now.toDateString();
//   const days = [];

//   for (let i = 0; i < startOffset; i++) days.push(null);

//   for (let day = 1; day <= daysInMonth; day++) {
//     const d = new Date(year, month, day);
//     const dateStr = d.toDateString();

//     const completedCount = habits.filter((h) =>
//       (h.completedDates || []).includes(dateStr)
//     ).length;

//     const pct = totalHabits === 0 ? 0 : Math.round((completedCount / totalHabits) * 100);

//     let heat = 0;
//     if (pct > 0 && pct < 34) heat = 1;
//     else if (pct >= 34 && pct < 67) heat = 2;
//     else if (pct >= 67 && pct < 100) heat = 3;
//     else if (pct === 100 && totalHabits > 0) heat = 4;

//     let status = "normal";
//     if (dateStr === todayStr) status = "today";
//     else if (d > now) status = "future";

//     days.push({
//       day,
//       status,
//       heat,
//       completedCount,
//       totalHabits,
//       dateLabel: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
//     });
//   }

//   return {
//     monthLabel: firstDay.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
//     days,
//   };
// }

// /**
//  * Streak milestone badges (locked/unlocked based on best streak)
//  */
// function getStreakMilestones(habits = []) {
//   const best = getBestStreak(habits);
//   const milestones = [
//     { days: 3, label: "3 Day Spark", icon: "🔥" },
//     { days: 7, label: "1 Week Streak", icon: "⭐" },
//     { days: 14, label: "2 Week Warrior", icon: "💪" },
//     { days: 30, label: "30 Day Legend", icon: "🏅" },
//     { days: 60, label: "60 Day Master", icon: "🥈" },
//     { days: 100, label: "Century Club", icon: "🥇" },
//     { days: 180, label: "Half Year Hero", icon: "💎" },
//     { days: 365, label: "One Year King", icon: "👑" },
//   ];
//   return milestones.map((m) => ({ ...m, unlocked: best >= m.days }));
// }

// /* ============================================================
//    GLOBAL EXPORTS
// ============================================================ */
// window.getTotalHabits = getTotalHabits;
// window.getTotalCompletions = getTotalCompletions;
// window.getBestStreak = getBestStreak;
// window.getCurrentStreak = getCurrentStreak;
// window.getCompletedToday = getCompletedToday;
// window.getWeeklyCompletionData = getWeeklyCompletionData;
// window.getBestDayThisMonth = getBestDayThisMonth;
// window.getRangeStats = getRangeStats;
// window.getHabitBreakdown = getHabitBreakdown;
// window.getStreakCalendarData = getStreakCalendarData;
// window.getStreakMilestones = getStreakMilestones;





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

function getStreakMilestones(habits = []) {
  const best = getBestStreak(habits);
  const milestones = [
    { days: 3, label: "3 Day Spark", icon: "🔥" },
    { days: 7, label: "7 Day Streak", icon: "⭐" },
    { days: 14, label: "2 Week Warrior", icon: "💪" },
    { days: 30, label: "30 Day King", icon: "🏅" },
    { days: 60, label: "60 Day Master", icon: "🥈" },
    { days: 100, label: "Century Club", icon: "🥇" },
    { days: 180, label: "Half Year Hero", icon: "💎" },
    { days: 365, label: "One Year King", icon: "👑" },
  ];
  return milestones.map((m) => ({ ...m, unlocked: best >= m.days }));
}

/**
 * Category-wise lifetime completion breakdown — for donut chart
 */
function getCategoryBreakdown(habits = []) {
  const categoryLabels = {
    health: "Wellness",
    learning: "Learning",
    fitness: "Fitness",
    mindfulness: "Mindfulness",
    creativity: "Creativity",
    work: "Productivity",
    other: "General",
  };

  const totals = {};
  habits.forEach((h) => {
    const cat = h.category || "other";
    totals[cat] = (totals[cat] || 0) + (h.total || 0);
  });

  const totalAll = Object.values(totals).reduce((a, b) => a + b, 0);

  const breakdown = Object.entries(totals).map(([cat, count]) => ({
    category: cat,
    label: categoryLabels[cat] || cat,
    count,
    pct: totalAll === 0 ? 0 : Math.round((count / totalAll) * 100),
  }));

  breakdown.sort((a, b) => b.count - a.count);
  return breakdown;
}

/**
 * Last N weeks activity grid (GitHub-style) — columns = weeks, rows = Mon..Sun
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
window.getCurrentStreak = getCurrentStreak;
window.getCompletedToday = getCompletedToday;
window.getWeeklyCompletionData = getWeeklyCompletionData;
window.getBestDayThisMonth = getBestDayThisMonth;
window.getRangeStats = getRangeStats;
window.getHabitBreakdown = getHabitBreakdown;
window.getStreakMilestones = getStreakMilestones;
window.getCategoryBreakdown = getCategoryBreakdown;
window.getActivityHeatmapData = getActivityHeatmapData;