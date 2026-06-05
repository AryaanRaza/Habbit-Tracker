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

const currentPasswordInput = document.getElementById("current-password");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");

const accountForm = document.getElementById("accountForm");
const saveStatus = document.getElementById("saveStatus");

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
   LOAD PROFILE DATA
============================================================ */

function loadProfile() {
  if (!currentUser) return;

  // --------------------------------
  // Form Fields
  // --------------------------------

  firstNameInput.value = currentUser.firstName || "";

  lastNameInput.value = currentUser.lastName || "";

  emailInput.value = currentUser.email || "";

  dobInput.value = currentUser.dob || "";

  // --------------------------------
  // Hero Name
  // --------------------------------

  profileName.textContent = currentUser.username || "User";

  // --------------------------------
  // Avatar
  // --------------------------------

  if (currentUser.avatar) {
    avatarDisplay.textContent = currentUser.avatar;

    avatarDisplay.dataset.avatar = currentUser.avatar;

    // highlight active avatar
    avatarOptions.forEach((option) => {
      option.classList.toggle(
        "active",
        option.dataset.avatar === currentUser.avatar,
      );
    });
  } else {
    const initial = currentUser.firstName?.charAt(0).toUpperCase() || "U";

    avatarDisplay.textContent = initial;

    avatarDisplay.dataset.avatar = "initial";
  }
}

/* ============================================================
   SAVE PROFILE
============================================================ */

function saveProfile(e) {
  e.preventDefault();

  const firstName = firstNameInput.value.trim();

  const lastName = lastNameInput.value.trim();

  const email = emailInput.value.trim();

  const dob = dobInput.value;

  const avatar = avatarDisplay.dataset.avatar;

  const currentPassword = currentPasswordInput?.value.trim();
  const newPassword = passwordInput?.value.trim();
  const confirmPassword = confirmPasswordInput?.value.trim();

  const fullName = `${firstName} ${lastName}`.trim();

  // --------------------------------
  // PASSWORD VALIDATION
  // --------------------------------

  if (currentPassword || newPassword || confirmPassword) {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Fill all password fields", "error");

      return;
    }

    if (currentPassword !== currentUser.password) {
      showToast("Current password is incorrect", "error");

      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");

      return;
    }
  }
  // --------------------------------
  // UPDATE PASSWORD
  // --------------------------------

  if (newPassword) {
    currentUser.password = newPassword;
  }
  // --------------------------------
  // Update Current User
  // --------------------------------

  currentUser.firstName = firstName;

  currentUser.lastName = lastName;

  currentUser.username = fullName;

  currentUser.email = email;

  currentUser.dob = dob;

  currentUser.avatar = avatar === "initial" ? "" : avatar;

  // --------------------------------
  // Update Session
  // --------------------------------

  Storage.set(STORAGE_KEYS.CURRENT_USER, currentUser);

  // --------------------------------
  // Update Users Array
  // --------------------------------

  const users = Storage.get(STORAGE_KEYS.USERS) || [];

  const updatedUsers = users.map((user) => {
    if (user.id === currentUser.id) {
      return {
        ...user,
        ...currentUser,
      };
    }

    return user;
  });

  Storage.set(STORAGE_KEYS.USERS, updatedUsers);

  // --------------------------------
  // Live UI Updates
  // --------------------------------

  profileName.textContent = fullName;

  const navUsername = document.getElementById("nav-username");

  if (navUsername) {
    navUsername.textContent = fullName;
  }

  // --------------------------------
  // Save Feedback
  // --------------------------------

  showToast("Changes saved successfully", "success");

  saveStatus.classList.add("show");

  setTimeout(() => {
    saveStatus.textContent = "";
    saveStatus.classList.remove("show");
  }, 2500);
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
    const selectedAvatar = option.dataset.avatar;

    avatarDisplay.textContent = selectedAvatar;

    avatarDisplay.dataset.avatar = selectedAvatar;

    // animation
    avatarDisplay.classList.add("avatar-pop");

    setTimeout(() => {
      avatarDisplay.classList.remove("avatar-pop");
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
if (accountForm) {
  accountForm.addEventListener("submit", saveProfile);
}

loadProfile();
