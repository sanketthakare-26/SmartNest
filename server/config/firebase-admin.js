const admin = require("firebase-admin");

const hasFirebaseAdminKeys = process.env.FIREBASE_PROJECT_ID &&
                             process.env.FIREBASE_CLIENT_EMAIL &&
                             process.env.FIREBASE_PRIVATE_KEY;

let isMockFirebaseAdmin = false;

if (hasFirebaseAdminKeys) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error) {
    console.error("Firebase Admin initialization error, falling back to mock authentication:", error.message);
    isMockFirebaseAdmin = true;
  }
} else {
  console.warn("Firebase Admin credentials missing. Server will run in mock auth verification mode.");
  isMockFirebaseAdmin = true;
}

module.exports = { admin, isMockFirebaseAdmin };
