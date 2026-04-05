const Record = require("../models/Record");

//Summary (Income, Expense, Balance)
const getSummary = async(user) => {
    const matchStage = {
        isDeleted: false,
    };

    if (user.role !== "admin") {
        matchStage.user = user._id;
    }

    const result = await Record.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: "$type",
                total: { $sum: "$amount" },
            },
        },
    ]);

    let income = 0,
        expense = 0;

    result.forEach((item) => {
        if (item._id === "income") income = item.total;
        if (item._id === "expense") expense = item.total;
    });

    return {
        income,
        expense,
        balance: income - expense,
    };
};

//Category-wise Totals
const getCategoryTotals = async(user) => {
    const matchStage = {
        isDeleted: false,
    };

    if (user.role !== "admin") {
        matchStage.user = user._id;
    }

    return await Record.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: "$category",
                total: { $sum: "$amount" },
            },
        },
    ]);
};

//Monthly Trends
const getMonthlyTrends = async(user) => {
    const matchStage = {
        isDeleted: false,
    };

    if (user.role !== "admin") {
        matchStage.user = user._id;
    }

    return await Record.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" },
                },
                total: { $sum: "$amount" },
            },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
};

//Recent Activity
const getRecentActivity = async(user) => {
    const filter = { isDeleted: false };

    if (user.role !== "admin") {
        filter.user = user._id;
    }

    return await Record.find(filter)
        .sort({ createdAt: -1 })
        .limit(5);
};

//export all
module.exports = {
    getSummary,
    getCategoryTotals,
    getMonthlyTrends,
    getRecentActivity,
};