/**
 * Firebase Admin SDK Configuration for Server-Side Operations
 * Supports multiple authentication methods and proper error handling
 */

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

// Configuration interface
interface FirebaseConfig {
  projectId: string;
  clientEmail?: string;
  privateKey?: string;
  serviceAccountKey?: string;
}

// Global state
let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;
let isInitialized = false;
let initError: string | null = null;

/**
 * Initialize Firebase Admin SDK with multiple configuration options
 */
function initializeFirebaseAdmin(): void {
  if (isInitialized) return;

  try {
    // Prevent multiple initializations
    if (getApps().length > 0) {
      adminApp = getApps()[0];
      adminDb = getFirestore(adminApp);
      adminAuth = getAuth(adminApp);
      isInitialized = true;
      return;
    }

    const config = getFirebaseConfig();

    // Method 1: Service Account JSON (Recommended for production)
    if (config.serviceAccountKey) {
      const serviceAccount = JSON.parse(config.serviceAccountKey);
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: config.projectId,
      });
    }
    // Method 2: Individual environment variables
    else if (config.clientEmail && config.privateKey) {
      adminApp = initializeApp({
        credential: cert({
          projectId: config.projectId,
          clientEmail: config.clientEmail,
          privateKey: config.privateKey.replace(/\\n/g, "\n"),
        }),
        projectId: config.projectId,
      });
    }
    // Method 3: Google Application Default Credentials (for Google Cloud)
    else if (
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      process.env.GCLOUD_PROJECT
    ) {
      adminApp = initializeApp({
        projectId: config.projectId,
      });
    }
    // Method 4: Development fallback (limited functionality)
    else {
      adminApp = initializeApp({
        projectId: config.projectId,
      });
      initError =
        "Firebase Admin running in development mode - some features may not work without proper credentials";
      console.warn("⚠️ Firebase Admin initialized in development mode");
    }

    // Initialize services
    adminDb = getFirestore(adminApp);
    adminAuth = getAuth(adminApp);
    isInitialized = true;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown initialization error";
    initError = errorMessage;
    console.error("❌ Firebase Admin initialization failed:", error);

    // Create fallback mock services for development
    createFallbackServices();
  }
}

/**
 * Get Firebase configuration from environment variables
 */
function getFirebaseConfig(): FirebaseConfig {
  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.GCLOUD_PROJECT;

  if (!projectId) {
    throw new Error(
      "Missing Firebase project ID. Set FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    );
  }

  return {
    projectId,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    serviceAccountKey: process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
  };
}

/**
 * Create fallback mock services for development
 */
function createFallbackServices(): void {
  // Mock Firestore
  adminDb = {
    collection: () => {
      throw new Error(
        "Firestore not available. Please configure Firebase Admin credentials or use Firebase emulator."
      );
    },
  } as any;

  // Mock Auth will be handled in the auth object below
  isInitialized = true;
}

/**
 * Get Firestore database instance
 */
export const getDb = (): Firestore => {
  if (!isInitialized) {
    initializeFirebaseAdmin();
  }

  if (!adminDb) {
    throw new Error(
      "Firestore not available. Check Firebase Admin initialization."
    );
  }

  return adminDb;
};

/**
 * Get Firebase Auth instance
 */
export const getAdminAuth = (): Auth => {
  if (!isInitialized) {
    initializeFirebaseAdmin();
  }

  if (!adminAuth) {
    throw new Error(
      "Firebase Auth not available. Check Firebase Admin initialization."
    );
  }

  return adminAuth;
};

/**
 * Check if Firebase is properly configured with credentials
 */
export const isFirebaseConfigured = (): boolean => {
  return isInitialized && !initError;
};

/**
 * Get Firebase initialization error (if any)
 */
export const getFirebaseError = (): string | null => {
  return initError;
};

/**
 * Enhanced Auth service with proper Firebase Admin SDK integration
 */
export const auth = {
  /**
   * Verify Firebase ID token using Admin SDK
   */
  verifyIdToken: async (idToken: string) => {
    if (!idToken || idToken.trim() === "") {
      throw new Error("Invalid or missing ID token");
    }

    try {
      if (!isInitialized) {
        initializeFirebaseAdmin();
      }

      // Use proper Firebase Admin SDK verification if available
      if (adminAuth && isFirebaseConfigured()) {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        return {
          uid: decodedToken.uid,
          email: decodedToken.email || null,
          emailVerified: decodedToken.email_verified || false,
          name: decodedToken.name || null,
          picture: decodedToken.picture || null,
          iss: decodedToken.iss,
          aud: decodedToken.aud,
          authTime: decodedToken.auth_time,
          iat: decodedToken.iat,
          exp: decodedToken.exp,
          firebase: decodedToken.firebase,
        };
      }

      // Fallback to manual verification for development
      console.warn(
        "⚠️ Using fallback token verification - configure Firebase Admin for production"
      );
      return await fallbackTokenVerification(idToken);
    } catch (error) {
      console.error("Token verification failed:", error);
      throw new Error(
        `Invalid ID token: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  /**
   * Get user by email using Admin SDK
   */
  getUserByEmail: async (email: string) => {
    if (!isInitialized) {
      initializeFirebaseAdmin();
    }

    if (adminAuth && isFirebaseConfigured()) {
      try {
        const userRecord = await adminAuth.getUserByEmail(email);
        return {
          uid: userRecord.uid,
          email: userRecord.email || null,
          emailVerified: userRecord.emailVerified,
          displayName: userRecord.displayName || null,
          photoURL: userRecord.photoURL || null,
          disabled: userRecord.disabled,
          metadata: userRecord.metadata,
        };
      } catch (error) {
        if ((error as any).code === "auth/user-not-found") {
          return null;
        }
        throw error;
      }
    }

    // Fallback for development
    console.warn(
      "⚠️ Using mock user data - configure Firebase Admin for production"
    );
    return {
      uid: `user_${email.replace(/[^a-zA-Z0-9]/g, "_")}`,
      email: email,
      emailVerified: false,
      displayName: email.split("@")[0],
      photoURL: null,
      disabled: false,
      metadata: null,
    };
  },

  /**
   * Get user by UID using Admin SDK
   */
  getUser: async (uid: string) => {
    if (!isInitialized) {
      initializeFirebaseAdmin();
    }

    if (adminAuth && isFirebaseConfigured()) {
      try {
        const userRecord = await adminAuth.getUser(uid);
        return {
          uid: userRecord.uid,
          email: userRecord.email || null,
          emailVerified: userRecord.emailVerified,
          displayName: userRecord.displayName || null,
          photoURL: userRecord.photoURL || null,
          disabled: userRecord.disabled,
          metadata: userRecord.metadata,
        };
      } catch (error) {
        if ((error as any).code === "auth/user-not-found") {
          return null;
        }
        throw error;
      }
    }

    // Fallback for development
    console.warn(
      "⚠️ Using mock user data - configure Firebase Admin for production"
    );
    return {
      uid: uid,
      email: `${uid}@example.com`,
      emailVerified: false,
      displayName: uid,
      photoURL: null,
      disabled: false,
      metadata: null,
    };
  },

  /**
   * Create custom token for user
   */
  createCustomToken: async (uid: string, additionalClaims?: object) => {
    if (!adminAuth || !isFirebaseConfigured()) {
      throw new Error(
        "Firebase Admin Auth not available for custom token creation"
      );
    }

    return await adminAuth.createCustomToken(uid, additionalClaims);
  },

  /**
   * Delete user by UID
   */
  deleteUser: async (uid: string) => {
    if (!adminAuth || !isFirebaseConfigured()) {
      throw new Error("Firebase Admin Auth not available for user deletion");
    }

    await adminAuth.deleteUser(uid);
  },
};

/**
 * Fallback token verification for development
 */
async function fallbackTokenVerification(idToken: string) {
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    // Decode payload
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    const payload = JSON.parse(atob(base64));

    // Basic validation
    if (payload.exp && payload.exp <= Date.now() / 1000) {
      throw new Error("Token expired");
    }

    return {
      uid: payload.sub || payload.user_id || payload.uid || "dev_user",
      email: payload.email || null,
      emailVerified: payload.email_verified || false,
      name: payload.name || null,
      picture: payload.picture || null,
    };
  } catch (error) {
    throw new Error(
      `Fallback token verification failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Export database and auth instances
export const db = getDb;
export { adminApp, adminAuth, adminDb };

// Legacy exports for backward compatibility
export const verifyIdToken = auth.verifyIdToken;

// Initialize on module load
initializeFirebaseAdmin();
