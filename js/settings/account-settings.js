const avatarModal = document.getElementById("avatar-modal");

const openBtn = document.getElementById("avatar-toggle-btn");

const closeBtn = document.getElementById("close-avatar-modal");

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

const avatarDisplay = document.getElementById("account-avatar");

const avatarOptions = document.querySelectorAll(".avatar-option");

avatarOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const selectedAvatar = option.dataset.avatar;

    avatarDisplay.textContent = selectedAvatar;

    avatarDisplay.classList.add("avatar-pop");

    setTimeout(() => {
      avatarDisplay.classList.remove("avatar-pop");
    }, 250);

    avatarOptions.forEach((avatar) => {
      avatar.classList.remove("active");
    });

    option.classList.add("active");

    avatarModal.classList.remove("show");
  });
});
