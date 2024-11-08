const assignmentController = require('../controller/assignment_controller');
const express = require("express");
const router = express.Router();

const {
    registerAssignment,
    getAllAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
    pendingStudents
} = assignmentController;


router
    .route("/")
    .get(getAllAssignments)
    .post(registerAssignment);

router 
    .route("/:id")
    .get(getAssignmentById)
    .put(updateAssignment)
    .delete(deleteAssignment);

router
    .route("/pendingStudents")
    .post(pendingStudents);

module.exports = router;