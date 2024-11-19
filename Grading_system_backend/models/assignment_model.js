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
    subjectName: {
        type: String,
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
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
