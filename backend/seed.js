const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Record = require("./models/Record");

const seed = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB connected");

        // 🔥 Clear old data
        await User.deleteMany({});
        await Record.deleteMany({});

        // 👑 Create ONLY ONE ADMIN
        const admin = await User.create({
            name: "Admin",
            email: "admin@example.com",
            password: "123456",
            role: "admin",
        });

        console.log("👑 Admin created");

        // 👥 Create Analyst + Viewer
        const analyst = await User.create({
            name: "Analyst User",
            email: "analyst@example.com",
            password: "123456",
            role: "analyst",
        });

        const viewer = await User.create({
            name: "Viewer User",
            email: "viewer@example.com",
            password: "123456",
            role: "viewer",
        });

        console.log("👥 Users created");

        // 💰 Financial Records (REALISTIC DATA)
        const records = [
            // Income
            {
                amount: 5000,
                type: "income",
                category: "salary",
                note: "Monthly Salary",
                user: admin._id,
            },
            {
                amount: 2000,
                type: "income",
                category: "freelance",
                note: "Freelance Project",
                user: admin._id,
            },

            // Expenses
            {
                amount: 500,
                type: "expense",
                category: "food",
                note: "Dinner",
                user: admin._id,
            },
            {
                amount: 800,
                type: "expense",
                category: "food",
                note: "Lunch",
                user: admin._id,
            },
            {
                amount: 1200,
                type: "expense",
                category: "shopping",
                note: "Clothes",
                user: admin._id,
            },
            {
                amount: 300,
                type: "expense",
                category: "transport",
                note: "Auto",
                user: admin._id,
            },
            {
                amount: 1500,
                type: "expense",
                category: "bills",
                note: "Electricity Bill",
                user: admin._id,
            },
            {
                amount: 700,
                type: "expense",
                category: "entertainment",
                note: "Movie",
                user: admin._id,
            },
        ];

        await Record.insertMany(records);

        console.log("📊 Records inserted");
        console.log("🚀 Seeding completed successfully");

        process.exit();
    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
        process.exit(1);
    }
};

seed();