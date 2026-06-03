const avatarModal =
  document.getElementById("avatar-modal");

const openBtn =
  document.getElementById("avatar-toggle-btn");

const closeBtn =
  document.getElementById("close-avatar-modal");

if (avatarModal && openBtn) {
  openBtn.addEventListener("click", () => {
    avatarModal.classList.toggle("show");
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    avatarModal.classList.remove("show");
  });
}

avatarModal?.addEventListener("click", (e) => {
  if (e.target === avatarModal) {
    avatarModal.classList.remove("show");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    avatarModal?.classList.remove("show");
  }
});