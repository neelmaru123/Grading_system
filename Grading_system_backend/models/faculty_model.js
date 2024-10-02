const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
    name: {
        type: String,
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
            }
        }
    ]
}, { timestamps: true }, { collection: "faculties" });

module.exports = mongoose.model("Faculty", facultySchema);