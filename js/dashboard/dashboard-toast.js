/* =========================
     TOAST
========================= */
const toast = document.getElementById("toast");

function showToast(msg) {

  if (!toast) return;

  toast.innerHTML = msg;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

/* =========================
     CONFETTI
========================= */
function fireConfetti() {

  if (!window.confetti) return;

  window.confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
  });
}

/* =========================
   GLOBAL EXPORTS
========================= */
window.showToast = showToast;
window.fireConfetti = fireConfetti;