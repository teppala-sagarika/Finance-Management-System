const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/errorHandler");

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role },
        process.env.JWT_SECRET, { expiresIn: "1d" }
    );
};

const registerUser = async({ name, email, password }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError("User already exists", 400);
    }

    const user = await User.create({ name, email, password });
    user.password = undefined;

    return { user, token: generateToken(user) };
};

const loginUser = async({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new AppError("Invalid credentials", 400);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError("Invalid credentials", 400);

    user.password = undefined;

    return { user, token: generateToken(user) };
};

module.exports = { registerUser, loginUser };