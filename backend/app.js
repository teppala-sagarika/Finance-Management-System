const express = require("express");
const cors = require("cors");

const { errorHandler } = require("./utils/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const recordRoutes = require("./routes/recordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/auth", authRoutes);

// Routes (we'll connect later)
app.get("/", (req, res) => {
    res.send("Finance API running...");
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;