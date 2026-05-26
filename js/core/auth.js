// ============================================
// HabitFlow — auth.js
// Fake Frontend Authentication System
// ============================================

// Get current logged in user
function getCurrentUser() {
  return Storage.get(STORAGE_KEYS.CURRENT_USER);
}

// Check auth state
function isAuthenticated() {
  return !!getCurrentUser();
}

// Save current session
function saveSession(user) {
  Storage.set(STORAGE_KEYS.CURRENT_USER, user);
}

// Logout user
function logoutUser() {
  Storage.remove(STORAGE_KEYS.CURRENT_USER);

  window.location.href = "index.html";
}

// ============================================
// REGISTER
// ============================================

function registerUser(username, email, password) {
  const users = Storage.get(STORAGE_KEYS.USERS) || [];

  // Check if email already exists
  const userExists = users.some((user) => user.email === email);

  if (userExists) {
    return {
      success: false,
      message: "User already exists",
    };
  }

  const newUser = {
    id: Date.now(),
    username,
    email,
    password,
    habits: [],
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  Storage.set(STORAGE_KEYS.USERS, users);

  saveSession(newUser);

  return {
    success: true,
    user: newUser,
  };
}

// ============================================
// LOGIN
// ============================================

function loginUser(email, password) {
  const users = Storage.get(STORAGE_KEYS.USERS) || [];

  const foundUser = users.find(
    (user) => user.email === email && user.password === password,
  );

  if (!foundUser) {
    return {
      success: false,
      message: "Invalid credentials",
    };
  }

  saveSession(foundUser);

  return {
    success: true,
    user: foundUser,
  };
}

// ============================================
// GUEST LOGIN
// ============================================

function loginAsGuest() {
  const guestUser = {
    id: "guest",
    username: "Guest",
    email: null,
    habits: [],
    isGuest: true,
  };

  saveSession(guestUser);

  return guestUser;
}

const guestBtn = document.getElementById("guestBtn");

guestBtn?.addEventListener("click", () => {
  loginAsGuest();

  window.location.href = "dashboard.html";
});

// ============================================
// REGISTER FORM
// ============================================

const registerForm = document.getElementById("register-form");

registerForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName")?.value.trim();

  const lastName = document.getElementById("lastName")?.value.trim();

  const email = document.getElementById("email")?.value.trim();

  const password = document.getElementById("password")?.value;

  const confirmPassword = document.getElementById("confirmPassword")?.value;

  // Basic validation
  if (!firstName || !lastName || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  // Password match check
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const username = `${firstName} ${lastName}`;

  const result = registerUser(username, email, password);

  if (!result.success) {
    alert(result.message);
    return;
  }

  // Redirect after success
  window.location.href = "dashboard.html";
});

// ============================================
// LOGIN FORM
// ============================================

const loginForm = document.getElementById("login-form");

loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email")?.value.trim();

  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  const result = loginUser(email, password);

  if (!result.success) {
    alert(result.message);
    return;
  }

  // Success redirect
  window.location.href = "dashboard.html";
});

