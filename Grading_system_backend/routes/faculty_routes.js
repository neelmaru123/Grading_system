const facultyController = require('../controller/faculty_controller');
const express = require("express");
const router = express.Router();

const {
    registerFaculty,
    getAllFaculties,
    getFacultyById,
    updateFaculty,
    deleteFaculty
} = facultyController;

router
    .route("/")
    .get(getAllFaculties)
    .post(registerFaculty);

router
    .route("/:id")
    .get(getFacultyById)
    .put(updateFaculty)
    .delete(deleteFaculty);

module.exports = router;

