const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

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
            },
            remarks: {
                type: String
            }
        }
    ]
}, { timestamps: true }, { collection: "students" });

studentSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model("Student", studentSchema);