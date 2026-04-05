const User = require("../models/User");

// 👤 Create User (Admin Controlled)
exports.createUser = async(req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // ❌ Only admin can create users
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can create users",
            });
        }

        // ❌ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // 🔒 Assign role safely
        let assignedRole = "viewer"; // default

        if (role === "analyst") {
            assignedRole = "analyst";
        }

        // 🚫 No new admins allowed
        // (even if frontend sends role: "admin")

        const user = await User.create({
            name,
            email,
            password,
            role: assignedRole,
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Create User Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};