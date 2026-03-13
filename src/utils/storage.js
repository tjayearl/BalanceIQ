// Get current user's ID from localStorage
export const getCurrentUserId = () => {
  return localStorage.getItem("user_id");
};

// Get user-specific localStorage key
export const getUserKey = (key) => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.warn("No user_id found in localStorage");
    return key; // Fallback to regular key
  }
  return `${key}_${userId}`;
};

// User-specific localStorage methods
export const storage = {
  // Get item for current user
  getItem: (key) => {
    return localStorage.getItem(getUserKey(key));
  },

  // Set item for current user
  setItem: (key, value) => {
    localStorage.setItem(getUserKey(key), value);
  },

  // Remove item for current user
  removeItem: (key) => {
    localStorage.removeItem(getUserKey(key));
  },

  // Clear all data for current user
  clearUserData: () => {
    const userId = getCurrentUserId();
    if (!userId) return;

    const keysToRemove = [
      `balanceiq_onboarding_${userId}`,
      `expenses_${userId}`,
      `debts_${userId}`,
    ];

    keysToRemove.forEach(key => localStorage.removeItem(key));
  },

  // Clear everything (logout)
  clearAll: () => {
    storage.clearUserData();
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
  }
};