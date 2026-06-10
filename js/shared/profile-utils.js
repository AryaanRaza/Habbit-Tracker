// ============================================
// PROFILE HELPERS
// ============================================

function getUserDisplayName(user) {
  if (!user) return "User";

  return (
    user.username ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "User"
  );
}

function getUserAvatar(user) {
  if (!user) {
    return {
      text: "U",
      isAvatar: false,
    };
  }

  if (user.avatar) {
    return {
      text: user.avatar,
      isAvatar: true,
    };
  }

  return {
    text: (user.firstName?.charAt(0) || "U").toUpperCase(),
    isAvatar: false,
  };
}