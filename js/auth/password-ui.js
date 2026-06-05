/* ============================================================
   HabitFlow — password-ui.js

   SHARED PASSWORD UTILITIES

   Handles:
   1. Password visibility toggle
   2. Password strength meter
   3. Password match checker

   Used by:
   - register.html
   - account-settings.html
============================================================ */

/* ============================================================
   PASSWORD TOGGLE
============================================================ */

function initPasswordToggle() {
  document.querySelectorAll(".pw-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);

      if (!input) return;

      const isHidden = input.type === "password";

      input.type = isHidden ? "text" : "password";

      const icon = btn.querySelector(".material-symbols-rounded");

      if (icon) {
        icon.textContent = isHidden ? "visibility_off" : "visibility";
      }
    });
  });
}

/* ============================================================
   PASSWORD STRENGTH CALCULATOR
============================================================ */

function getPasswordStrength(password) {
  if (!password) {
    return {
      level: "",
      label: "",
    };
  }

  let score = 0;

  if (password.length >= 8) score++;

  if (password.length >= 12) score++;

  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) {
    score++;
  }

  if (/\d/.test(password)) {
    score++;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  }

  if (score <= 1) {
    return {
      level: "weak",
      label: "Weak",
    };
  }

  if (score <= 2) {
    return {
      level: "fair",
      label: "Fair",
    };
  }

  if (score <= 3) {
    return {
      level: "good",
      label: "Good",
    };
  }

  return {
    level: "strong",
    label: "Strong",
  };
}

/* ============================================================
   PASSWORD STRENGTH UI
============================================================ */

function initPasswordStrength(passwordInput, strengthFill, strengthLabel) {
  if (!passwordInput || !strengthFill || !strengthLabel) {
    return;
  }

  passwordInput.addEventListener("input", () => {
    const { level, label } = getPasswordStrength(passwordInput.value);

    strengthFill.dataset.strength = level;

    strengthLabel.textContent = label;
  });
}

/* ============================================================
   PASSWORD MATCH UI
============================================================ */

function initPasswordMatch(passwordInput, confirmInput, matchMsg) {
  if (!passwordInput || !confirmInput || !matchMsg) {
    return;
  }

  function checkMatch() {
    const password = passwordInput.value;

    const confirm = confirmInput.value;

    if (!confirm) {
      matchMsg.classList.add("hidden");

      return;
    }

    matchMsg.classList.remove("hidden");

    if (password === confirm) {
      matchMsg.textContent = "✓ Passwords match";

      matchMsg.className = "pw-match-msg match";
    } else {
      matchMsg.textContent = "✗ Passwords do not match";

      matchMsg.className = "pw-match-msg no-match";
    }
  }

  passwordInput.addEventListener("input", checkMatch);

  confirmInput.addEventListener("input", checkMatch);
}
