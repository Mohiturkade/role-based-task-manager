const express = require("express");
const dotenv = require("dotenv").config()
const cors = require("cors");
const dbConnect = require("./config/db.Connect");
const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes")
const adminRoutes = require("./routes/adminRoutes");
const taskRoutes = require("./routes/taskRoutes");


dbConnect()

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://roledbasedtaskmanager.netlify.app'], 
  credentials: true
}));

// Middleware
app.use(express.json())

// Routes
app.use("/api/auth" ,authRoutes);
// app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tasks", taskRoutes);


// Start server
const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})
