/**
 * Maps Firebase authentication error codes to user-friendly messages
 * @param error - The Firebase error object
 * @returns A user-friendly error message
 */
export function getFirebaseErrorMessage(error: unknown): string {
  // Log the actual error for debugging purposes
  console.error("Firebase Authentication Error:", {
    code: error && typeof error === "object" && "code" in error ? error.code : undefined,
    message: error && typeof error === "object" && "message" in error ? error.message : undefined,
    fullError: error,
  });

  // Map Firebase error codes to user-friendly messages
  const errorCode = error && typeof error === "object" && "code" in error ? String(error.code) : "";

  switch (errorCode) {
    // Login/Sign-in errors
    case "auth/invalid-credential":
      return "Invalid email or password. Please check your credentials and try again.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/too-many-requests":
      return "Too many failed login attempts. Please try again later.";

    // Sign-up errors
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please sign in instead.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled. Please contact support.";

    // Google Sign-in errors
    case "auth/popup-closed-by-user":
      return "Sign-in was cancelled. Please try again.";
    case "auth/popup-blocked":
      return "Pop-up was blocked by your browser. Please allow pop-ups and try again.";
    case "auth/cancelled-popup-request":
      return "Sign-in was cancelled. Please try again.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with the same email but different sign-in method.";

    // Network errors
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection and try again.";
    case "auth/timeout":
      return "Request timed out. Please try again.";

    // General errors
    case "auth/internal-error":
      return "An internal error occurred. Please try again later.";
    case "auth/invalid-api-key":
      return "Configuration error. Please contact support.";

    default:
      // If error code is not recognized, return a generic message
      // but still preserve some context if available
      if (error && typeof error === "object" && "message" in error) {
        return "An error occurred during authentication. Please try again.";
      }
      return "An unexpected error occurred. Please try again.";
  }
}
