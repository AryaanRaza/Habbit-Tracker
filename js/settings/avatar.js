// ============================================================
// HabitFlow — avatar.js
// Dedicated Avatar Management
// ============================================================

/* ============================================================
   DOM SELECTORS
============================================================ */
const avatarDisplay = document.getElementById("account-avatar");
const profileName = document.getElementById("profileName");
const companionTagline = document.getElementById("companionTagline");

const heroRarity = document.getElementById("heroRarity");

const heroClass = document.getElementById("heroClass");

const heroUnlock = document.getElementById("heroUnlock");

/* ============================================================
   CURRENT USER
============================================================ */

const currentUser = Storage.get(STORAGE_KEYS.CURRENT_USER);
// ============================================================
// PLAYER PROGRESSION
// ============================================================

// Highest streak the user has ever achieved.
// This drives the companion unlock system.
// const playerBestStreak = getBestStreak(currentUser.habits || []);

/* ============================================================
   PROTECTION
============================================================ */

if (!currentUser) {
  window.location.href = "../login.html";
}

function renderAvatarCollections() {
  const container = document.getElementById("avatarCollections");

  container.innerHTML = "";

  Object.keys(COLLECTIONS).forEach((collectionId) => {
    const collection = COLLECTIONS[collectionId];

    const companions = COMPANIONS.filter(
      (companion) => companion.collection === collectionId,
    );

    const bestStreak = getPlayerBestStreak(currentUser);

    const unlockedCount = companions.filter(
      (companion) => bestStreak >= companion.unlockStreak,
    ).length;

    container.innerHTML += `

            <section class="avatar-collection">

<div class="collection-header">

    <div class="collection-title-row">

        <h3>
            ${collection.title}
        </h3>

        <span class="collection-progress">

            ${unlockedCount} / ${companions.length}

        </span>

    </div>

    <p>
        ${collection.description}
    </p>

</div>

                <div
                    class="avatar-grid"
                    id="${collectionId}Grid">
                </div>

            </section>

        `;

    const grid = document.getElementById(`${collectionId}Grid`);

    companions.forEach((companion) => {
      const bestStreak = getPlayerBestStreak(currentUser);

      const isUnlocked = bestStreak >= companion.unlockStreak;
      const progress = Math.min(bestStreak, companion.unlockStreak);

      grid.innerHTML += `

<button
    class="avatar-option ${isUnlocked ? "" : "locked"}"
    data-avatar="${companion.id}">

    <img
    <div class="avatar-image-wrapper">

    <img
        src="${companion.image}"
        alt="${companion.name}"
        class="avatar-option-img">

     <div class="avatar-lock-overlay ${isUnlocked ? "hidden" : ""}">

        <span class="lock-icon">🔒</span>

    <span class="lock-text">
      Unlock at
    </span>

   <span class="lock-streak">
     ${progress} / ${companion.unlockStreak} Days
   </span>

    </div>

</div>

    <div class="avatar-card-info">

        <h4 class="avatar-name">
            ${companion.name}
        </h4>

        <span class="avatar-rarity">
            ${companion.rarity}
        </span>

    </div>

</button>

`;
    });
  });
}
/* ============================================================
   LOAD PROFILE
============================================================ */

function loadProfile() {
  const avatarOptions = document.querySelectorAll(".avatar-option");

  /* ============================================================
   AVATAR SELECTION
  ============================================================ */

  avatarOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedAvatar = option.dataset.avatar;

      const selectedCompanion = COMPANIONS.find((c) => c.id === selectedAvatar);

      const bestStreak = getPlayerBestStreak(currentUser);

      if (bestStreak < selectedCompanion.unlockStreak) {
        showToast(
          `🔒 Reach a ${selectedCompanion.unlockStreak}-day streak to unlock ${selectedCompanion.name}.`,
          "info",
        );

        return;
      }
      const selectedAvatarName =
        option.querySelector(".avatar-name").textContent;

      // Update preview
      currentUser.avatar = selectedAvatar;

      // Save companion name
      currentUser.avatarName = selectedCompanion.name;

      // Update hero text
      profileName.textContent = selectedCompanion.name;
      companionTagline.textContent = selectedCompanion.tagline;

      heroRarity.textContent = `⭐ ${selectedCompanion.rarity}`;
      heroClass.textContent = `⚔ ${selectedCompanion.class}`;
      heroUnlock.textContent = `🔥 ${selectedCompanion.unlockStreak} Day Unlock`;

      // Update avatar image
      renderProfileAvatar(avatarDisplay, currentUser);

      avatarDisplay.dataset.avatar = selectedAvatar;

      // Update active state
      avatarOptions.forEach((avatar) => {
        avatar.classList.remove("active");
      });

      option.classList.add("active");

      // Save current session
      Storage.set(STORAGE_KEYS.CURRENT_USER, currentUser);

      // Update users array
      const users = Storage.get(STORAGE_KEYS.USERS) || [];

      const updatedUsers = users.map((user) =>
        user.id === currentUser.id
          ? {
              ...user,
              ...currentUser,
            }
          : user,
      );

      Storage.set(STORAGE_KEYS.USERS, updatedUsers);

      // Refresh UI everywhere
      refreshProfileUI();

      // Success feedback
      showToast("Avatar updated successfully", "success");

      // Return to Settings after a short delay
      setTimeout(() => {
        smartBack();
      }, 1000);
    });
  });
  if (!currentUser) return;

  const companion = COMPANIONS.find((c) => c.id === currentUser.avatar);

  if (companion) {
    profileName.textContent = companion.name;

    companionTagline.textContent = companion.tagline;
    heroRarity.textContent = `⭐ ${companion.rarity}`;
    heroClass.textContent = `⚔ ${companion.class}`;
    heroUnlock.textContent = `🔥 ${companion.unlockStreak} Day Unlock`;
  }

  renderProfileAvatar(avatarDisplay, currentUser);

  avatarDisplay.dataset.avatar = currentUser.avatar || "initial";

  avatarOptions.forEach((option) => {
    option.classList.toggle(
      "active",
      option.dataset.avatar === currentUser.avatar,
    );
  });
}

/* ============================================================
   INITIAL LOAD
============================================================ */

renderAvatarCollections();

loadProfile();
