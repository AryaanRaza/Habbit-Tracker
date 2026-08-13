initPasswordToggle();

initPasswordStrength(
  document.getElementById("password"),
  document.getElementById("pw-strength-fill"),
  document.getElementById("pw-strength-label"),
);

initPasswordMatch(
  document.getElementById("password"),
  document.getElementById("confirmPassword"),
  document.getElementById("pw-match-msg"),
);