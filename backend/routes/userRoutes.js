const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

// 🔐 Only logged-in users can hit this route
router.post("/", protect, createUser);

module.exports = router;