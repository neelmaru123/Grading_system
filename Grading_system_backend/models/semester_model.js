const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema({
    semesterName: {
        type: String,
        required: true
    },
    totalStudents: {
        type: Number
    },
    subjects: [
        {
            subjectId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject"
            },
            subjectName: {
                type: String
            },
            facultyId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Faculty"
            }
        }
    ],
}, { timestamps: true }, {collection : "Semesters"});

module.exports = mongoose.model("Semester", semesterSchema)