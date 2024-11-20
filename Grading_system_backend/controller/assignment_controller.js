const assignmentModel = require('../models/assignment_model');
const studentModel = require('../models/student_model');
const SemesterModel = require('../models/semester_model');
const SubjectModel = require('../models/subject_model');
const mongoose = require('mongoose');
const { submittedAssignment } = require('./student_controller');

const registerAssignment = async (req, res) => {
    // Validate request
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send({
            message: "Assignment content can not be empty"
        });
    }
    const { title, description, deadline, facultyId, subjectId, subjectName } = req.body;
    

    try {
        const semester = await SemesterModel.findOne({ 'subjects.subjectId': subjectId }).exec();
        if (!semester) {
            return res.status(404).send({
                message: "Semester not found"
            });
        }
        
        // Create an Assignment
        const assignment = new assignmentModel({
            title,
            description,
            deadline,
            facultyId,
            pendingStudentsCount: semester.totalStudents,
            subjectId,
            subjectName,
        });

        // Save Assignment in the database
        const savedAssignment = await assignment.save();
        res.send(savedAssignment);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Assignment."
        });
    }
};

const getAllAssignments = async (req, res) => {
    const { facultyId } = req.body;

    try {
        const assignment = await assignmentModel.find({ facultyId: facultyId })
        const assignmentsWithSemesterData = await Promise.all(assignment.map(async (assignment) => {
            const subject = await SubjectModel.findOne({ _id: assignment.subjectId }).exec();
            const semester = await SemesterModel.findOne({ _id: subject.semesterId }).exec();
            return {
                ...assignment.toObject(),
                semesterName: semester.semesterName,
                totalStudents: semester.totalStudents
            };
        }))

        assignmentsWithSemesterData.reverse();

        res.send(assignmentsWithSemesterData);
    }
    catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving assignments."
        })
    }
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
    console.log(req.body);

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
        subjectId: req.body.subjectId
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

const pendingStudents = async (req, res) => {
    const { id } = req.body;
    try {
        const assignment = await assignmentModel.findOne({
            _id: id,
            // subjectId: subjectId
        }).select('students')

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        const submittedStudentIds = assignment.students.map(student => student.studentId);
        const pendingStudents = await studentModel.aggregate([
            {
                $match: {
                    _id: { $nin: submittedStudentIds }
                }
            }
        ]);
        pendingStudents.reverse();
        res.status(200).json(pendingStudents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending assignments', error });
    }
}

const submittedStudents = async (req, res) => {
    const { id } = req.body;
    try {
        const assignment = await assignmentModel.findOne({
            _id: id,
            // subjectId: subjectId
        }).select('students')

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        const submittedStudentIds = assignment.students.map(student => student.studentId);
        const submittedStudents = await studentModel.aggregate([
            {
                $match: {
                    _id: { $in: submittedStudentIds }
                }
            }
        ]);
        submittedStudents.reverse();
        res.status(200).json(submittedStudents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending assignments', error });
    }
}

module.exports = {
    registerAssignment,
    getAllAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
    pendingStudents,
    submittedStudents
};
