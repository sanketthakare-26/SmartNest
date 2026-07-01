const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

let serviceAccount;
const keyPath = path.join(__dirname, "serviceAccountKey.json");

if (fs.existsSync(keyPath)) {
  serviceAccount = require("./serviceAccountKey.json");
} else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  };
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  module.exports = admin;
} else {
  console.warn("⚠️ Warning: Firebase service account credentials not found. Running in mock validation mode.");
  
  const mockAdmin = {
    auth: () => ({
      verifyIdToken: async (token) => {
        // Simple mock token validation for development/testing
        if (token === "mock-admin-token" || process.env.NODE_ENV === "development") {
          return { uid: "mock-admin-uid", email: "admin@smartnest.com", name: "Mock Admin" };
        }
        throw new Error("Invalid token in mock mode");
      }
    })
  };
  module.exports = mockAdmin;
}