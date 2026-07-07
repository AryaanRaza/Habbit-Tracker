// ============================================
// SETTINGS PROFILE HEADER
// ============================================

function renderSettingsProfile() {
  const currentUser = Storage.get(STORAGE_KEYS.CURRENT_USER);

  if (!currentUser) return;

  const settingsName = document.getElementById("settings-profile-name");

  const settingsAvatar = document.getElementById("settings-profile-avatar");

  renderProfileName(settingsName, currentUser);

  renderProfileAvatar(settingsAvatar, currentUser);
}

document.addEventListener("DOMContentLoaded", () => {
  renderSettingsProfile();
});

// ============================================
// LOGOUT MODAL
// ============================================

const logoutTrigger = document.getElementById("logout-trigger");

const logoutModal = document.getElementById("logout-modal");

const logoutCancel = document.getElementById("logout-cancel");

// Open modal
logoutTrigger?.addEventListener("click", (e) => {
  e.preventDefault();

  logoutModal.hidden = false;
});

// Cancel button
logoutCancel?.addEventListener("click", () => {
  logoutModal.hidden = true;
});

// Click backdrop
logoutModal?.addEventListener("click", (e) => {
  if (e.target === logoutModal) {
    logoutModal.hidden = true;
  }
});

const logoutConfirm = document.getElementById(
  "logout-confirm",
);

// Confirm logout
logoutConfirm?.addEventListener("click", () => {
  logoutUser();
});
