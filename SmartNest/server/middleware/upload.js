const multer = require("multer");

// Use memory storage — the admin pastes image URLs, not actual file uploads.
// If you later want real file uploads, switch to CloudinaryStorage here.
module.exports = multer({ storage: multer.memoryStorage() });