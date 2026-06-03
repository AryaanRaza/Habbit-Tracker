// ============================================================
// HabitFlow — account-settings.js
// ============================================================

/* ============================================================
   DOM SELECTORS
============================================================ */

const avatarModal = document.getElementById("avatar-modal");
const openBtn = document.getElementById("avatar-toggle-btn");
const closeBtn = document.getElementById("close-avatar-modal");

const avatarDisplay = document.getElementById("account-avatar");
const avatarOptions = document.querySelectorAll(".avatar-option");

const profileName = document.getElementById("profileName");

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const dobInput = document.getElementById("dob");

/* ============================================================
   CURRENT USER
============================================================ */

const currentUser = Storage.get(
  STORAGE_KEYS.CURRENT_USER
);

/* ============================================================
   PROTECTION
============================================================ */

if (!currentUser) {
  window.location.href = "../login.html";
}

/* ============================================================
   LOAD PROFILE DATA
============================================================ */

function loadProfile() {
  if (!currentUser) return;

  // --------------------------------
  // Form Fields
  // --------------------------------

  firstNameInput.value =
    currentUser.firstName || "";

  lastNameInput.value =
    currentUser.lastName || "";

  emailInput.value =
    currentUser.email || "";

  dobInput.value =
    currentUser.dob || "";

  // --------------------------------
  // Hero Name
  // --------------------------------

  profileName.textContent =
    currentUser.username || "User";

  // --------------------------------
  // Avatar
  // --------------------------------

  if (currentUser.avatar) {
    avatarDisplay.textContent =
      currentUser.avatar;

    avatarDisplay.dataset.avatar =
      currentUser.avatar;

    // highlight active avatar
    avatarOptions.forEach((option) => {
      option.classList.toggle(
        "active",
        option.dataset.avatar === currentUser.avatar
      );
    });
  } else {
    const initial =
      currentUser.firstName
        ?.charAt(0)
        .toUpperCase() || "U";

    avatarDisplay.textContent = initial;

    avatarDisplay.dataset.avatar =
      "initial";
  }
}

/* ============================================================
   AVATAR MODAL
============================================================ */

if (avatarModal && openBtn) {
  openBtn.addEventListener("click", () => {
    avatarModal.classList.add("show");
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    avatarModal.classList.remove("show");
  });
}

// close when clicking backdrop
avatarModal?.addEventListener("click", (e) => {
  if (e.target === avatarModal) {
    avatarModal.classList.remove("show");
  }
});

// close on ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    avatarModal?.classList.remove("show");
  }
});

/* ============================================================
   AVATAR SELECTION
============================================================ */

avatarOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const selectedAvatar =
      option.dataset.avatar;

    avatarDisplay.textContent =
      selectedAvatar;

    avatarDisplay.dataset.avatar =
      selectedAvatar;

    // animation
    avatarDisplay.classList.add(
      "avatar-pop"
    );

    setTimeout(() => {
      avatarDisplay.classList.remove(
        "avatar-pop"
      );
    }, 250);

    // active state
    avatarOptions.forEach((avatar) => {
      avatar.classList.remove("active");
    });

    option.classList.add("active");

    // close modal
    avatarModal.classList.remove("show");
  });
});

/* ============================================================
   INITIALIZE PAGE
============================================================ */

loadProfile();