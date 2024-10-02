const facultyModel = require('../models/faculty_model');

// Create and Save a new Faculty
const registerFaculty = async (req, res) => {

    // Validate request
    if (!req.body) {
        return res.status(400).send({
            message: "Faculty content can not be empty"
        });
    }

    const { name, email, password, department, assignments } = req.body;

    // Create a Faculty
    const faculty = new facultyModel({
        name,
        email,
        password,
        department,
        assignments
    });

    // Save Faculty in the database
    await faculty.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Faculty."
            });
        });
};

// Retrieve and return all faculties from the database.
const getAllFaculties = async (req, res) => {
    await facultyModel.find()
        .then(faculties => {
            res.send(faculties);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving faculties."
            });
        });
}

// Find a single faculty with a facultyId
const getFacultyById = async (req, res) => {
    await facultyModel.findById(req.params.id)
        .then(faculty => {
            if (!faculty) {
                return res.status(404).send({
                    message: "Faculty not found with id " + req.params.id
                });
            }
            res.send(faculty);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Faculty not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving faculty with id " + req.params.id
            });
        });
}

// Update a faculty identified by the facultyId in the request
const updateFaculty = async (req, res) => {

    // Validate Request
    if (!req.body) {
        return res.status(400).send({
            message: "Faculty content can not be empty"
        });
    }

    // Find faculty and update it with the request body
    await facultyModel.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        department: req.body.department,
        assignments: req.body.assignments
    }, { new: true })
        .then(faculty => {
            if (!faculty) {
                return res.status(404).send({
                    message: "Faculty not found with id " + req.params.id
                });
            }
            res.send(faculty);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Faculty not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error updating faculty with id " + req.params.id
            });
        });
}

// Delete a faculty with the specified facultyId in the request
const deleteFaculty = async (req, res) => {
    await facultyModel.findByIdAndDelete(req.params.id)
        .then(faculty => {
            if (!faculty) {
                return res.status(404).send({
                    message: "Faculty not found with id " + req.params.id
                });
            }
            res.send({ message: "Faculty deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Faculty not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete faculty with id " + req.params.id
            });
        });
}


module.exports = {
    registerFaculty,
    getAllFaculties,
    getFacultyById,
    updateFaculty,
    deleteFaculty
};