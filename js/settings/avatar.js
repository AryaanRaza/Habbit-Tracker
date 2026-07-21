// ============================================================
// HabitFlow — avatar.js
// Dedicated Avatar Management
// ============================================================

/* ============================================================
   DOM SELECTORS
============================================================ */

const avatarDisplay = document.getElementById("account-avatar");

const profileName = document.getElementById("profileName");

const avatarOptions = document.querySelectorAll(".avatar-option");

/* ============================================================
   CURRENT USER
============================================================ */

const currentUser = Storage.get(STORAGE_KEYS.CURRENT_USER);

/* ============================================================
   PROTECTION
============================================================ */

if (!currentUser) {
  window.location.href = "../login.html";
}

/* ============================================================
   LOAD PROFILE
============================================================ */

function loadProfile() {
  if (!currentUser) return;

  renderProfileName(profileName, currentUser);

  renderProfileAvatar(avatarDisplay, currentUser);

  avatarDisplay.dataset.avatar = currentUser.avatar || "initial";

  avatarOptions.forEach((option) => {
    option.classList.toggle(
      "active",
      option.dataset.avatar === currentUser.avatar,
    );
  });
}

/* ============================================================
   AVATAR SELECTION
============================================================ */

avatarOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const selectedAvatar = option.dataset.avatar;

    // Update preview
    currentUser.avatar = selectedAvatar;

    renderProfileAvatar(avatarDisplay, currentUser);

    avatarDisplay.dataset.avatar = selectedAvatar;

    // Update active state
    avatarOptions.forEach((avatar) => {
      avatar.classList.remove("active");
    });

    option.classList.add("active");

    // Save current session
    Storage.set(STORAGE_KEYS.CURRENT_USER, currentUser);

    // Update users array
    const users = Storage.get(STORAGE_KEYS.USERS) || [];

    const updatedUsers = users.map((user) =>
      user.id === currentUser.id
        ? {
            ...user,
            ...currentUser,
          }
        : user,
    );

    Storage.set(STORAGE_KEYS.USERS, updatedUsers);

    // Refresh UI everywhere
    refreshProfileUI();

    // Success feedback
    showToast("Avatar updated successfully", "success");

    // Return to Settings after a short delay
    setTimeout(() => {
      smartBack();
    }, 1000);
  });
});

/* ============================================================
   INITIAL LOAD
============================================================ */

loadProfile();
