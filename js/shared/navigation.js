function renderNavigationProfile() {
  const currentUser = Storage.get(STORAGE_KEYS.CURRENT_USER);

  const navUsername = document.getElementById("nav-username");
  const navAvatar = document.getElementById("nav-avatar");

  if (!currentUser) return;

  renderProfileName(navUsername, currentUser);

  renderProfileAvatar(navAvatar, currentUser);
}
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.toLowerCase();

  // Read URL query parameters
  const params = new URLSearchParams(window.location.search);

  // Detect where user came from
  const from = params.get("from");

  // Hide navigation on auth-opened legal pages
  const hideNav =
    (from === "register" || from === "login") && path.includes("/settings/");

  // 1. Better detection: Check if 'settings/' is anywhere in the URL
  const isInsideSettings = path.includes("/settings/");
  const prefix = isInsideSettings ? "../" : "";

  const footerTemplate = `

  <!-- DESKTOP SIDEBAR -->
  <aside class="sidebar-desktop">

    <!-- Brand -->
    <div class="sidebar-brand">
      <div class="brand-icon">✨</div>
      <div class="brand-text">HabitFlow</div>
    </div>

    <!-- Profile Card -->
    <div class="sidebar-profile">
      <div class="profile-avatar" id="nav-avatar">👤</div>

      <div class="profile-details">
        <div class="profile-name" id="nav-username">User</div>

        <div class="profile-streak">
          <span class="status-dot"></span>
          <span>🔥 1-day streak!</span>
        </div>
      </div>
    </div>

    <!-- Section Label -->
    <div class="sidebar-section-title">
      MAIN MENU
    </div>

    <!-- Navigation -->
    <!-- Primary Navigation -->
    <nav class="sidebar-links">

   <!-- Dashboard -->
   <a href="${prefix}dashboard.html"
     class="sidebar-link"
     data-match="dashboard">

     <span class="material-symbols-rounded">home</span>
     <span>Dashboard</span>
   </a>

   <!-- Analytics -->
   <a href="${prefix}analytics.html"
     class="sidebar-link"
     data-match="analytics">

     <span class="material-symbols-rounded">bar_chart</span>
     <span>Analytics</span>
   </a>

   <!-- All Habits -->
   <a href="${prefix}habits.html"
     class="sidebar-link"
     data-match="habits">

     <span class="material-symbols-rounded">checklist</span>
     <span>All Habits</span>
   </a>

    <!-- Achievements -->
    <a href="${prefix}achievements.html"
     class="sidebar-link"
     data-match="achievements">

    <span class="material-symbols-rounded">emoji_events</span>
    <span>Achievements</span>
  </a>

   <!-- Settings -->
   <a href="${prefix}settings.html"
     class="sidebar-link"
     data-match="settings">

    <span class="material-symbols-rounded">settings</span>
    <span>Settings</span>
   </a>

</nav>

    <!-- Quick Stats -->
    <div class="sidebar-quick-stats">

      <div class="quick-stats-title">
        QUICK STATS
      </div>

      <div class="quick-stats-grid">

      <div class="quick-stat-box">
        <div class="quick-stat-value" id="nav-best-streak">0</div>
        <div class="quick-stat-label">STREAK</div>
      </div>

      <div class="quick-stat-box">
        <div class="quick-stat-value" id="nav-total-habits">0</div>
        <div class="quick-stat-label">HABITS</div>
      </div>

      </div>
    </div>

    <!-- Footer -->
    <div class="sidebar-footer">
      v2.0.0 ✨
    </div>

  </aside>

<!-- MOBILE FLOATING NAV -->
<footer class="bottom-tab-bar">

  <!-- Dashboard -->
  <a href="${prefix}dashboard.html"
     class="tab-item"
     data-match="dashboard">

    <span class="material-symbols-rounded">home</span>
    <span>Home</span>
  </a>

  <!-- Analytics -->
  <a href="${prefix}analytics.html"
     class="tab-item"
     data-match="analytics">

    <span class="material-symbols-rounded">bar_chart</span>
    <span>Stats</span>
  </a>

  <!-- Habits -->
  <a href="${prefix}habits.html"
     class="tab-item"
     data-match="habits">

    <span class="material-symbols-rounded">checklist</span>
    <span>Habits</span>
  </a>

  <!-- Achievements -->
  <a href="${prefix}achievements.html"
     class="tab-item"
     data-match="achievements">

    <span class="material-symbols-rounded">emoji_events</span>
    <span>Awards</span>
  </a>

  <!-- Settings -->
  <a href="${prefix}settings.html"
     class="tab-item"
     data-match="settings">

    <span class="material-symbols-rounded">settings</span>
    <span>Settings</span>
  </a>

</footer>
`;

  // Only inject navigation if allowed
  if (!hideNav) {
    document.body.insertAdjacentHTML("beforeend", footerTemplate);

    // Force layout recalculation after footer is added
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
    });
  }

  // 2. Updated Active Tab Logic
  const tabs = document.querySelectorAll(".tab-item, .sidebar-link");
  tabs.forEach((tab) => {
    const matchToken = tab.getAttribute("data-match");

    /* =========================
   ACTIVE PAGE HIGHLIGHT
   ========================= */
    tabs.forEach((tab) => {
      const matchToken = tab.getAttribute("data-match");

      // Skip if no token exists
      if (!matchToken) return;

      // Match page from current URL
      if (path.includes(`${matchToken}.html`)) {
        tab.classList.add("active");
      }

      // Special handling for settings sub-pages
      if (matchToken === "settings" && path.includes("/settings/")) {
        tab.classList.add("active");
      }
    });
    // ============================================
    // LOAD CURRENT USER NAME
    // ============================================

    const currentUser = Storage.get(STORAGE_KEYS.CURRENT_USER);
    renderNavigationProfile();
  });

  /* =========================
   SIDEBAR STATS (NON-DASHBOARD)
========================= */

  const navBestStreak = document.getElementById("nav-best-streak");
  const navTotalHabits = document.getElementById("nav-total-habits");

  if (typeof loadUserHabits === "function" && navBestStreak && navTotalHabits) {
    const habits = loadUserHabits();

    const bestStreak = Math.max(...habits.map((h) => h.best || 0), 0);

    navBestStreak.textContent = bestStreak;
    navTotalHabits.textContent = habits.length;
  }
});
