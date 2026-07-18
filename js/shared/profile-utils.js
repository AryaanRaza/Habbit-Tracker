// ============================================
// PROFILE HELPERS
// ============================================

function getUserDisplayName(user) {
  if (!user) return "User";

  return (
    user.username ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "User"
  );
}

function getUserAvatar(user) {
  if (!user) {
    return {
      text: "U",
      isAvatar: false,
    };
  }

  if (user.avatar) {
    return {
      text: user.avatar,
      isAvatar: true,
    };
  }

  return {
    text: (user.firstName?.charAt(0) || "U").toUpperCase(),
    isAvatar: false,
  };
}

function renderProfileAvatar(element, user) {
  if (!element) return;

  const avatarData = getUserAvatar(user);

  // Image avatar
  if (avatarData.isAvatar) {
    element.innerHTML = `
      <img
        src="../img/avatars/streaksaur/${avatarData.text}.png"
        alt="Profile Avatar"
        class="profile-avatar-img">
    `;
    return;
  }

  // Letter fallback
  element.textContent = avatarData.text;
}

function renderProfileName(element, user) {
  if (!element) return;

  element.textContent = getUserDisplayName(user);
}

function renderDashboardProfile() {
  const currentUser = Storage.get(STORAGE_KEYS.CURRENT_USER);

  if (!currentUser) return;

  const dashboardName = document.getElementById("dashboard-profile-name");

  const dashboardAvatar = document.getElementById("dashboard-profile-avatar");

  renderProfileName(dashboardName, currentUser);

  renderProfileAvatar(dashboardAvatar, currentUser);
}

function refreshProfileUI() {
  if (typeof renderNavigationProfile === "function") {
    renderNavigationProfile();
  }

  if (typeof renderSettingsProfile === "function") {
    renderSettingsProfile();
  }
}
