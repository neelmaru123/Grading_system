const subjectSchema = require("../models/subject_model");
const semesterSchema = require("../models/semester_model")

const registerSubject = async (req, res) => {
    // Validate request
    if (!req.body) {
        return res.status(400).send({
            message: "Subject content can not be empty"
        });
    }

    const { subjectName, semesterId, facultyId } = req.body;

    // Create a Subject
    const subject = new subjectSchema({
        subjectName: subjectName,
        semesterId: semesterId,
        facultyId: facultyId
    });

    // Save Subject in the database
    await subject.save()
        .then(async (data) => {
            await semesterSchema.findByIdAndUpdate(semesterId,
                {
                    $push: {
                        subjects: {
                            subjectId: data._id,
                            subjectName: data.subjectName,
                            facultyId: data.facultyId
                        }
                    }
                }, { new: true })
                .then(data => {
                    if (!data) {
                        return res.status(404).send({
                            message: "Semester not found with id " + semesterId
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });

            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Subject."
            });
        });
}

const getAllSubjects = async (req, res) => {
    await subjectSchema.find()
        .then(subjects => {
            res.send(subjects);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving subjects."
            });
        });
}

const updateSbuject = async (req, res) => {
    // Validate Request
    if (!req.body) {
        return res.status(400).send({
            message: "Subject content can not be empty"
        });
    }


    // Find subject and update it with the request body
    await subjectSchema.findByIdAndUpdate(req.params.id, {
        subjectName: req.body.subjectName,
        semesterId: req.body.semesterId,
        facultyId: req.body.facultyId
    }, { new: true })
        .then(async (subject) => {
            if (!subject) {
                return res.status(404).send({
                    message: "Subject not found with id " + req.params.id
                });
            }

            await semesterSchema.findByIdAndUpdate(subject.semesterId,
                {
                    $set: {
                        "subjects.$[elem].subjectName": req.body.subjectName,
                        "subjects.$[elem].facultyId": req.body.facultyId
                    }
                },
                {
                    arrayFilters: [{ "elem.subjectId": req.params.id }]
                })
                .then(data => {
                    if (!data) {
                        return res.status(404).send({
                            message: "Semester not found with id " + subject.semesterId
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });

            res.send(subject);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Subject not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error updating subject with id " + req.params.id
            });
        });
}

const deleteSubject = async (req, res) => {
    await subjectSchema.findByIdAndRemove(req.params.id)
        .then((subject) => {
            if (!subject) {
                return res.status(404).send({
                    message: "Subject not found with id " + req.params.id
                });
            }
            res.send({ message: "Subject deleted successfully!" })
        })
        .catch((err) => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "subject not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete subject with id " + req.params.id
            });
        })
}

const getSubjectByFaculty = async (req, res) => {
    await subjectSchema.find({ facultyId: req.params.facultyId })
        .then(subjects => {
            res.send(subjects);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving subjects."
            });
        });
}

module.exports = {
    registerSubject,
    getAllSubjects,
    updateSbuject,
    deleteSubject,
    getSubjectByFaculty,
};