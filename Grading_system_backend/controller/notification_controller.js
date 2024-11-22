const Notification = require("../models/notification_model")
const Student = require("../models/student_model")

const getNotificationsForSemseter = async (req, res) => {
    const { id } = req.params;
    try {
        const notifications = await Notification.find({
            semesterId: id,
            type: "all-semester"
        }).sort({ createdAt: -1 });

        res.send(notifications);
    }
    catch (err) {
        res.status(500).send({
            mesaage: err.mesaage || "some error occures while retrieving notifications."
        })
    }
}

const getNotificationsForStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const notifications = await Notification.find({
            studentId: id
        }).sort({ createdAt: -1 });

        res.send(notifications);
    }
    catch (err) {
        res.status(500).send({
            mesaage: err.mesaage || "some error occures while retrieving notifications."
        })
    }
}

module.exports = {
    getNotificationsForSemseter,
    getNotificationsForStudent
}