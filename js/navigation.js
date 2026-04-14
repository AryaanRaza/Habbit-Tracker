document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.toLowerCase();

  // 1. Better detection: Check if 'settings/' is anywhere in the URL
  const isInsideSettings = path.includes("/settings/");
  const prefix = isInsideSettings ? "../" : "";

  const footerTemplate = `
    <footer class="bottom-tab-bar">
    <div class="sidebar-mascot">
        <img src="${prefix}img/streakasaur-sidebar.png" alt="Mascot" />
      </div>
        <a href="${prefix}dashboard.html" class="tab-item" data-match="dashboard">
            <span class="material-symbols-rounded">home</span>
            <span class="tab-label">Home</span>
        </a>
        <a href="${prefix}stats.html" class="tab-item" data-match="stats">
            <span class="material-symbols-rounded">leaderboard</span>
            <span class="tab-label">Stats</span>
        </a>
        <a href="${prefix}settings.html" class="tab-item" data-match="settings">
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
  const tabs = document.querySelectorAll(".tab-item");
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
