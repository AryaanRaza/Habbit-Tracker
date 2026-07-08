// ============================================
// HabitFlow — storage.js
// Centralized LocalStorage Helper
// ============================================

const Storage = {
  // Save data
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // Get data
  get(key) {
    const data = localStorage.getItem(key);

    try {
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Storage Parse Error:", error);
      return null;
    }
  },

  // Remove single item
  remove(key) {
    localStorage.removeItem(key);
  },

  // Clear everything
  clear() {
    localStorage.clear();
  },
};
// ============================================
// HabitFlow Storage Keys
// ============================================

const STORAGE_KEYS = {
  USERS: "habitflow_users",
  CURRENT_USER: "habitflow_current_user",
  HABITS: "habitflow_habits",
  SETTINGS: "habitflow_settings",
  LAST_ACTIVE_DATE: "habitflow_last_active_date",
};

// ============================================
// USER-SPECIFIC HABIT STORAGE
// ============================================

function getHabitsKey() {
  const currentUser = Storage.get(STORAGE_KEYS.CURRENT_USER);

  // fallback for safety
  if (!currentUser) {
    return "habitflow_habits_guest";
  }

  return `habitflow_habits_${currentUser.id}`;
}

// Save habits for current user
function saveUserHabits(habits) {
  const key = getHabitsKey();

  Storage.set(key, habits);
}

// Load habits for current user
function loadUserHabits() {
  const key = getHabitsKey();

  return Storage.get(key) || [];
}

// ============================================
// USER-SPECIFIC STREAK STORAGE
// ============================================

function getStreakKey() {
  const currentUser = Storage.get(STORAGE_KEYS.CURRENT_USER);

  if (!currentUser) {
    return "habitflow_streak_guest";
  }

  return `habitflow_streak_${currentUser.id}`;
}

function saveUserStreak(streakData) {
  Storage.set(getStreakKey(), streakData);
}

function loadUserStreak() {
  return (
    Storage.get(getStreakKey()) || {
      current: 0,
      best: 0,
      lastCompletedDate: null,
    }
  );
}
