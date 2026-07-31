// ============================================================
// HabitFlow — avatar.js
// Dedicated Avatar Management
// ============================================================

/* ============================================================
   DOM SELECTORS
============================================================ */

const avatarDisplay = document.getElementById("account-avatar");

const profileName = document.getElementById("profileName");

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

function renderAvatarGrid() {
  const avatarGrid = document.getElementById("avatarGrid");

  avatarGrid.innerHTML = "";

  COMPANIONS.forEach((companion) => {
    avatarGrid.innerHTML += `

            <button
                type="button"
                class="avatar-option"
                data-avatar="${companion.id}">

                <img
                    src="${companion.image}"
                    alt="${companion.name}"
                    class="avatar-option-img">

                <span class="avatar-name">
                    ${companion.name}
                </span>

            </button>

        `;
  });
}

/* ============================================================
   LOAD PROFILE
============================================================ */

function loadProfile() {
  const avatarOptions = document.querySelectorAll(".avatar-option");

  /* ============================================================
   AVATAR SELECTION
============================================================ */

  avatarOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedAvatar = option.dataset.avatar;
      const selectedAvatarName =
        option.querySelector(".avatar-name").textContent;

      // Update preview
      currentUser.avatar = selectedAvatar;
      currentUser.avatarName = selectedAvatarName;

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
   INITIAL LOAD
============================================================ */

renderAvatarGrid();

loadProfile();
