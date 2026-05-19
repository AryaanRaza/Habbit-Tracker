/* ═══════════════════════════════════════════════════════════════
   auth.js — HabitFlow Login & Register
   Shared by login.html and register.html.

   HANDLES:
     1. Password visibility toggles
     2. Password strength meter  (register only)
     3. Password match check     (register only)
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. PASSWORD VISIBILITY TOGGLES
     Every .pw-toggle button shows/hides its
     paired input (matched via data-target id).
  ───────────────────────────────────────── */
  document.querySelectorAll('.pw-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      const icon = btn.querySelector('.material-symbols-rounded');
      if (icon) icon.textContent = isHidden ? 'visibility_off' : 'visibility';
    });
  });


  /* ─────────────────────────────────────────
     2. PASSWORD STRENGTH METER  (register)
  ───────────────────────────────────────── */
  const passwordInput   = document.getElementById('password');
  const strengthFill    = document.getElementById('pw-strength-fill');
  const strengthLabel   = document.getElementById('pw-strength-label');

  /**
   * Scores a password and returns a strength level + label.
   * @param {string} pw
   * @returns {{ level: string, label: string }}
   */
  function getStrength(pw) {
    if (!pw) return { level: '', label: '' };
    let score = 0;
    if (pw.length >= 8)                        score++;
    if (pw.length >= 12)                       score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw))                         score++;
    if (/[^A-Za-z0-9]/.test(pw))              score++;
    if (score <= 1) return { level: 'weak',   label: 'Weak'   };
    if (score <= 2) return { level: 'fair',   label: 'Fair'   };
    if (score <= 3) return { level: 'good',   label: 'Good'   };
                    return { level: 'strong', label: 'Strong' };
  }

  if (passwordInput && strengthFill && strengthLabel) {
    passwordInput.addEventListener('input', () => {
      const { level, label } = getStrength(passwordInput.value);
      strengthFill.dataset.strength = level;
      strengthLabel.textContent     = label;
    });
  }


  /* ─────────────────────────────────────────
     3. PASSWORD MATCH CHECK  (register)
  ───────────────────────────────────────── */
  const confirmInput = document.getElementById('confirmPassword');
  const matchMsg     = document.getElementById('pw-match-msg');

  function checkMatch() {
    if (!confirmInput || !matchMsg || !passwordInput) return;
    const pw      = passwordInput.value;
    const confirm = confirmInput.value;
    if (!confirm) { matchMsg.classList.add('hidden'); return; }
    matchMsg.classList.remove('hidden');
    if (pw === confirm) {
      matchMsg.textContent = '✓ Passwords match';
      matchMsg.className   = 'pw-match-msg match';
    } else {
      matchMsg.textContent = '✗ Passwords do not match';
      matchMsg.className   = 'pw-match-msg no-match';
    }
  }

  confirmInput?.addEventListener('input', checkMatch);
  passwordInput?.addEventListener('input', checkMatch);

});