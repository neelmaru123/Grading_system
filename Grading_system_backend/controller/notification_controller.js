const Notification = require("../models/notification_model")
const student = require("../models/student_model");

const getNotificationsForSemseter = async (req, res) => {
    const { id } = req.params;
    try {
        const notifications = await Notification.find({
            createdAt: {
                $gte: lastFetch
            }
        }).sort({ createdAt: -1 });

        stu.lastNotificationFetch = Date.now();
        await stu.save();
        res.send(notifications);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            mesaage: err.mesaage || "some error occures while retrieving notifications."
        })
    }
}

const getNotificationsForStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const notifications = await Notification.find({
            studentId: id,
            createdAt : {
                $lte: Date.now()
            }
        }).sort({ createdAt: -1 }); // Find the notifications for the student
        res.send(notifications);
    }
    catch (err) {
        res.status(500).send({
            mesaage: err.mesaage || "some error occures while retrieving notifications."
        })
    }
}

const getLatestNotificationForStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const stu = await student.findById(id); // Find the student        
        const lastFetch = stu.lastNotificationFetch; // Get the last fetch time
        const notifications = await Notification.find({
            createdAt: {
                $gte: lastFetch
            }
        }).sort({ createdAt: -1 });
        stu.lastNotificationFetch = Date.now(); // Update the last fetch time
        await stu.save();
        notifications.reverse();
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
    getNotificationsForStudent,
    getLatestNotificationForStudent
}