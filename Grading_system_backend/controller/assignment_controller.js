const assignmentModel = require('../models/assignment_model');
const studentModel = require('../models/student_model');
const SemesterModel = require('../models/semester_model');
const SubjectModel = require('../models/subject_model');
const mongoose = require('mongoose');
const { submittedAssignment } = require('./student_controller');
const { Notification } = require('../models/notification_model');

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
        // // Create notification for assignment upload
        // const notification = new Notification({
        //     title: "New Assignment Uploaded",
        //     message: `Assignment "${title}" has been uploaded, of ${subjectName}`,
        //     facultyId,
        //     semesterId: semester._id,
        //     type: "all-semester"
        // });
        // await notification.save();

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
        .then(async (assignment) => {
            if (!assignment) {
                return res.status(404).send({
                    message: "Assignment not found with id " + req.params.id
                });
            }
            // Create notification for assignment update
            const notification = new Notification({
                title: "Assignment Updated",
                message: `Assignment "${req.body.title}" has been updated.`,
                facultyId: req.body.facultyId,
                semesterId: assignment.semesterId
            });
            await notification.save();
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
        const submissions = await assignmentModel.aggregate([
            // Match the specific assignment (optional if all assignments are needed)
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id) // Replace `assignmentId` with the actual assignment ID
                }
            },
            // Unwind the students array to process individual student submissions
            {
                $unwind: "$students"
            },
            // Lookup student details from the students collection
            {
                $lookup: {
                    from: "students", // Name of the student collection
                    localField: "students.studentId",
                    foreignField: "_id",
                    as: "studentDetails"
                }
            },
            // Unwind the studentDetails array to make it accessible
            {
                $unwind: "$studentDetails"
            },
            // Project the required fields
            {
                $project: {
                    _id: 0, // Exclude the document ID
                    submissionDate: "$students.submissionDate", // From the assignments schema
                    subjectName: "$subjectName", // From the assignments schema
                    title: "$title", // From the assignments schema
                    rollNo: "$studentDetails.rollNo", // From the student schema
                    grade: "$students.grade", // Grade from the assignments schema
                    remarks: "$students.remarks", // Remarks from the assignments schema
                    studentName: "$studentDetails.name", // Student's name
                    email: "$studentDetails.email", // Student's email
                    department: "$studentDetails.department" // Student's department
                }
            }
        ]);
        
        // const assignment = await assignmentModel.findOne({
        //     _id: id,
        //     // subjectId: subjectId
        // }).select('students')

        // if (!assignment) {
        //     return res.status(404).json({ message: 'Assignment not found' });
        // }

        // const submittedStudentIds = assignment.students.map(student => student.studentId);
        // const submittedStudents = await studentModel.aggregate([
        //     {
        //         $match: {
        //             _id: { $in: submittedStudentIds }
        //         }
        //     }
        // ]);
        submissions.reverse();
        res.status(200).json(submissions);
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
