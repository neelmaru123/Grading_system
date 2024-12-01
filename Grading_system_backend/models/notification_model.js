const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    },
    semesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Semester"
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    },
    type: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index : true
    }
}, { timestamps: true }, { collection: "Notifications" });

// Create a compound index on semesterId and type
notificationSchema.index({ semesterId: 1, type: 1 });

// Create an index on studentId
notificationSchema.index({ studentId: 1 });

// Create an index on facultyId
notificationSchema.index({ facultyId: 1 });

module.exports = mongoose.model("Notification", notificationSchema)
