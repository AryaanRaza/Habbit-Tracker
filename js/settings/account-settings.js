// ============================================================
// HabitFlow — account-settings.js
// ============================================================

/* ============================================================
   DOM SELECTORS
============================================================ */
const avatarDisplay = document.getElementById("account-avatar");

const profileName = document.getElementById("profileName");

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const dobInput = document.getElementById("dob");

const currentPasswordInput = document.getElementById("current-password");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");

const strengthFill = document.getElementById("pw-strength-fill");
const strengthLabel = document.getElementById("pw-strength-label");
const matchMsg = document.getElementById("pw-match-msg");

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

  renderProfileName(profileName, currentUser);

  // --------------------------------
  // Avatar
  // --------------------------------

  const avatarData = getUserAvatar(currentUser);

  renderProfileAvatar(avatarDisplay, currentUser);

  avatarDisplay.dataset.avatar = currentUser.avatar || "initial";
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
  const avatarData = getUserAvatar(currentUser);

  renderProfileAvatar(avatarDisplay, currentUser);

  avatarDisplay.dataset.avatar = currentUser.avatar || "initial";

  renderProfileName(profileName, currentUser);
  refreshProfileUI();

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
   ACCOUNT HERO STATS
============================================================ */

function updateAccountStats() {
  const totalHabitsEl = document.getElementById("settings-total-habits");
  const totalCompletionsEl = document.getElementById(
    "settings-total-completions",
  );
  const bestStreakEl = document.getElementById("settings-best-streak");

  const habits = loadUserHabits();

  const totalHabits = getTotalHabits(habits);
  const totalCompletions = getTotalCompletions(habits);
  const bestStreak = getBestStreak(habits);

  if (totalHabitsEl) {
    totalHabitsEl.textContent = totalHabits;
  }

  if (totalCompletionsEl) {
    totalCompletionsEl.textContent = totalCompletions;
  }

  if (bestStreakEl) {
    bestStreakEl.textContent = bestStreak;
  }
}
/* ============================================================
   INITIALIZE PAGE
============================================================ */
if (accountForm) {
  accountForm.addEventListener("submit", saveProfile);
}

/* ============================================================
   PASSWORD UI
============================================================ */

initPasswordToggle();

initPasswordStrength(passwordInput, strengthFill, strengthLabel);

initPasswordMatch(passwordInput, confirmPasswordInput, matchMsg);

/* ============================================================
   INITIAL LOAD
============================================================ */

loadProfile();
updateAccountStats();
