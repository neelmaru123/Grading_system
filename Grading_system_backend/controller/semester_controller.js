const SemesterSchema = require('../models/semester_model');

const createSemester = async (req, res) => {
        // Validate request
        if (!req.body) {
            return res.status(400).send({
                message: "Semester content can not be empty"
            });
        }
        const { semesterName, subjects, totalStudents } = req.body;
    
        // Create a Semester
        const semester = new SemesterSchema({
            semesterName,
            subjects,
            totalStudents
        });
        // Save Semester in the database
        await semester.save()
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Semester."
                });
            });
    }

const getAllSemesters = async (req, res) => {
    await SemesterSchema.find()
        .then(semesters => {
            res.send(semesters);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving semesters."
            });
        });
}

const getSemesterById = async (req, res) => {
    console.log(req.params.id);
    await SemesterSchema.findById(req.params.id)
        .then(semester => {
            if (!semester) {
                return res.status(404).send({
                    message: "Semester not found with id " + req.params.id
                });
            }
            res.send(semester);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Semester not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving semester with id " + req.params.id
            });
        });
}

const updateSemester = async (req, res) => {
    // Validate Request
    if (!req.body) {
        return res.status(400).send({
            message: "Semester content can not be empty"
        });
    }

    // Find semester and update it with the request body
    await SemesterSchema.findByIdAndUpdate(req.params.id, {
        semesterName: req.body.semesterName,
        subjects: req.body.subjects,
        totalStudents: req.body.totalStudents
    }, { new: true })
        .then(semester => {
            if (!semester) {
                return res.status(404).send({
                    message: "Semester not found with id " + req.params.id
                });
            }
            res.send(semester);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Semester not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error updating semester with id " + req.params.id
            });
        });
}

const deleteSemester = async (req, res) => {
    await SemesterSchema.findByIdAndRemove(req.params.id)
        .then(semester => {
            if (!semester) {
                return res.status(404).send({
                    message: "Semester not found with id " + req.params.id
                });
            }
            res.send({ message: "Semester deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Semester not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete semester with id " + req.params.id
            });
        });
}

const getSemesterByFaculty = async(req, res) => {
    await SemesterSchema.find({ "subjects.facultyId": req.params.facultyId })
        .then(semesters => {
            res.send(semesters);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving semesters."
            });
        });
}



module.exports = {
    createSemester,
    getAllSemesters,
    getSemesterById,
    deleteSemester,
    updateSemester,
    getSemesterByFaculty
}