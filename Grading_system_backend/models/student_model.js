const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNo: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    assignments: [
        {
            assignmentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Assignment"
            },
            grade: {
                type: String
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);