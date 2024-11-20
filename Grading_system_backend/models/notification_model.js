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
    }
}, { timestamps: true }, { collection: "Notifications" });

exports.Notification = mongoose.model("Notification", notificationSchema);
