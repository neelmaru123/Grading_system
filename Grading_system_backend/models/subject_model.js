const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true
    },
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    },
    semesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Semester"
    }
}, { timestamps: true }, { collection: "Subjects" });

module.exports = mongoose.model("Subject", subjectSchema);