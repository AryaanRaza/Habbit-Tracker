// ============================================
// HabitFlow — protect.js
// Route Protection
// ============================================

if (!isAuthenticated()) {
  window.location.href = "index.html";
}