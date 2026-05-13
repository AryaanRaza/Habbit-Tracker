document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.toLowerCase();

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
      <div class="profile-avatar">👤</div>

      <div class="profile-details">
        <div class="profile-name">Aryaan</div>

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
    <nav class="sidebar-links">

      <a href="${prefix}dashboard.html"
         class="sidebar-link"
         data-match="dashboard">

        <span class="material-symbols-rounded">home</span>
        <span>Dashboard</span>
      </a>

      <a href="${prefix}stats.html"
         class="sidebar-link"
         data-match="stats">

        <span class="material-symbols-rounded">leaderboard</span>
        <span>Stats</span>
      </a>

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

      <a href="${prefix}dashboard.html"
         class="tab-item"
         data-match="dashboard">

          <span class="material-symbols-rounded">home</span>
          <span class="tab-label">Home</span>
      </a>

      <a href="${prefix}stats.html"
         class="tab-item"
         data-match="stats">

          <span class="material-symbols-rounded">leaderboard</span>
          <span class="tab-label">Stats</span>
      </a>

      <a href="${prefix}settings.html"
         class="tab-item"
         data-match="settings">

          <span class="material-symbols-rounded">settings</span>
          <span class="tab-label">Settings</span>
      </a>

  </footer>
`;

  document.body.insertAdjacentHTML("beforeend", footerTemplate);
  // Force layout recalculation after footer is added
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("resize"));
  });

  // 2. Updated Active Tab Logic
  const tabs = document.querySelectorAll(".tab-item, .sidebar-link");
  tabs.forEach((tab) => {
    const matchToken = tab.getAttribute("data-match");

    // Match 'dashboard' if the URL ends in dashboard.html
    if (matchToken === "dashboard" && path.endsWith("dashboard.html")) {
      tab.classList.add("active");
    }
    // Match 'stats' if the URL ends in stats.html
    else if (matchToken === "stats" && path.endsWith("stats.html")) {
      tab.classList.add("active");
    }
    // Match 'settings' if we are in the settings folder OR on settings.html
    else if (
      matchToken === "settings" &&
      (isInsideSettings || path.endsWith("settings.html"))
    ) {
      tab.classList.add("active");
    }
  });
});
