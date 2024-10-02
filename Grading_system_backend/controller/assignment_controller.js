const assignmentModel = require('../models/assignment_model');

const registerAssignment = async (req, res) => {

    // Validate request
    if (!req.body) {
        return res.status(400).send({
            message: "Assignment content can not be empty"
        });
    }

    const { title, description, deadline, facultyId, pendingStudentsCount, subject } = req.body;

    // Create a Assignment
    const assignment = new assignmentModel({
        title,
        description,
        deadline,
        facultyId,
        pendingStudentsCount: 0,
        subject
    });

    // Save Assignment in the database
    await assignment.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Assignment."
            });
        });
}

const getAllAssignments = async (req, res) => {
    await assignmentModel.find()
        .then(assignments => {
            res.send(assignments);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving assignments."
            });
        });
}

const getAssignmentById = async (req, res) => {
    await assignmentModel.findById(req.params.id)
        .then(assignment => {
            if (!assignment) {
                return res.status(404).send({
                    message: "Assignment not found with id " + req.params.id
                });
            }
            res.send(assignment);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Assignment not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving Assignment with id " + req.params.id
            });
        })
}

const updateAssignment = async (req, res) => {
    // Validate Request
    if (!req.body) {
        return res.status(400).send({
            message: "Assignment content can not be empty"
        });
    }

    // Find Assignment and update it with the request body
    await assignmentModel.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        deadline: req.body.deadline,
        facultyId: req.body.facultyId,
        pendingStudentsCount: req.body.pendingStudentsCount,
        subject: req.body.subject
    }, { new: true })
        .then(assignment => {
            if (!assignment) {
                return res.status(404).send({
                    message: "Assignment not found with id " + req.params.id
                });
            }
            res.send(assignment);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Assignment not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error updating Assignment with id " + req.params.id
            });
        });
}

const deleteAssignment = async (req, res) => {
    await assignmentModel.findByIdAndDelete(req.params.id)
        .then(assignment => {
            if (!assignment) {
                return res.status(404).send({
                    message: "Assignment not found with id " + req.params.id
                });
            }
            res.send({ message: "Assignment deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Assignment not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete Assignment with id " + req.params.id
            });
        });
}

module.exports = {
    registerAssignment,
    getAllAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment
};