const dashboardService = require("../services/dashboardService");

// Summary
const summary = async(req, res, next) => {
    try {
        const data = await dashboardService.getSummary(req.user);

        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

// Categories
const categories = async(req, res, next) => {
    try {
        const data = await dashboardService.getCategoryTotals(req.user);

        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

// Trends
const trends = async(req, res, next) => {
    try {
        const data = await dashboardService.getMonthlyTrends(req.user);

        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

// Recent
const recent = async(req, res, next) => {
    try {
        const data = await dashboardService.getRecentActivity(req.user);

        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    summary,
    categories,
    trends,
    recent,
};