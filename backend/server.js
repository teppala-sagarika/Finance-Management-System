require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// const User = require("./models/User");

// Connect DB
connectDB();


// User.create({
//         name: "Test User",
//         email: "test@example.com",
//         password: "123456",
//     })
//     .then(res => console.log(res))
//     .catch(err => console.log(err));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});