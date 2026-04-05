const express = require("express");
const router = express.Router();

const {
    summary,
    categories,
    trends,
    recent,
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// All authenticated users can view dashboard
router.get("/summary", authMiddleware, summary);
router.get("/categories", authMiddleware, categories);
router.get("/trends", authMiddleware, trends);
router.get("/recent", authMiddleware, recent);

module.exports = router;