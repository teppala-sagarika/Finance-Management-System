const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
    },

    role: {
        type: String,
        enum: ["viewer", "analyst", "admin"],
        default: "viewer",
    },

    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });



// 🔐 Pre-save middleware (NO next, pure async)
userSchema.pre("save", async function() {

    // 🔒 Hash password if modified
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    // 👑 Ensure ONLY ONE ADMIN exists
    if (this.role === "admin") {
        const adminExists = await this.constructor.findOne({ role: "admin" });

        // Allow if it's the same user (update case)
        if (adminExists && adminExists._id.toString() !== this._id.toString()) {
            throw new Error("Only one admin allowed");
        }
    }
});



// 🔑 Compare password (for login)
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};



module.exports = mongoose.model("User", userSchema);