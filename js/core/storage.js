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
  }
};
// ============================================
// HabitFlow Storage Keys
// ============================================

const STORAGE_KEYS = {
  USERS: "habitflow_users",
  CURRENT_USER: "habitflow_current_user",
  HABITS: "habitflow_habits",
  SETTINGS: "habitflow_settings"
};

function getHabitsKey() {}
function saveUserHabits() {}
function loadUserHabits() {}