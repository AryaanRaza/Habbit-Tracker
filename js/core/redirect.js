// ============================================
// HabitFlow — redirect.js
// Redirect Logged In Users
// ============================================

if (isAuthenticated()) {
  window.location.href = "dashboard.html";
}