const assignmentController = require('../controller/assignment_controller');
const express = require("express");
const router = express.Router();

const {
    registerAssignment,
    getAllAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment
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

module.exports = router;