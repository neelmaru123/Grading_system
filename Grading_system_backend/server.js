const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 5000;

const connectDB = require("./config/DBconnection");

// Connect to MongoDB
connectDB();

app.use(cors());

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connection.once("open", () => {
    console.log("connected to mongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

const studentRoutes = require("./routes/student_routes");
const facultyRoutes = require("./routes/faculty_routes");
const assignmentRoutes = require("./routes/assignment_routes");
const authRoutes = require("./routes/auth_route");

// define a simple route
app.use("/students", studentRoutes);
app.use("/faculties", facultyRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/auth", authRoutes);


