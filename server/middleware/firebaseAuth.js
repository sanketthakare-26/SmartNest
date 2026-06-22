const { admin, isMockFirebaseAdmin } = require("../config/firebase-admin");

const firebaseAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  if (isMockFirebaseAdmin) {
    if (token === "mock-jwt-token-xyz") {
      req.user = { uid: "mock-uid-123", email: "admin@smartnest.com", role: "admin" };
      return next();
    }
    return res.status(401).json({ message: "Invalid token in mock mode. Check configuration." });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error.message);
    res.status(401).json({ message: "Token is not valid or has expired" });
  }
};

module.exports = firebaseAuth;
