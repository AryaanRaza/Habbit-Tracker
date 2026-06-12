// ============================================
// SETTINGS PROFILE HEADER
// ============================================

function renderSettingsProfile() {
  const currentUser = Storage.get(STORAGE_KEYS.CURRENT_USER);

  if (!currentUser) return;

  const settingsName = document.getElementById(
    "settings-profile-name",
  );

  const settingsAvatar = document.getElementById(
    "settings-profile-avatar",
  );

  renderProfileName(settingsName, currentUser);

  renderProfileAvatar(settingsAvatar, currentUser);
}

document.addEventListener("DOMContentLoaded", () => {
  renderSettingsProfile();
});