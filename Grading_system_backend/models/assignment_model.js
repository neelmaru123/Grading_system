const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    },
    students: [
        {
            studentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student"
            },
            grade: {
                type: String
            }
        }
    ],
    pendingStudentsCount: {
        type: Number
    }
}, { timestamps: true }, {collection : "Assignments"});

module.exports = mongoose.model("Assignment", assignmentSchema)