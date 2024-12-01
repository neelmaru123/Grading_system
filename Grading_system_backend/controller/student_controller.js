const studentModel = require('../models/student_model');
const assignmentModel = require('../models/assignment_model');
const mongoose = require("mongoose");
const AssignmentQueue = require('../models/AssignmentQueue_model');

// Create and Save a new Student
const registerStudent = async (req, res) => {

    // Validate request
    if (!req.body) {
        return res.status(400).send({
            message: "Student content can not be empty"
        });
    }

    const { name, email, password, rollNo, department, assignments } = req.body;

    // Create a Student
    const student = new studentModel({
        name,
        email,
        password,
        rollNo,
        department,
        assignments
    });

    // Save Student in the database
    await student.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Student."
            });
        });
};

// Retrieve and return all students from the database.
const getAllStudents = async (req, res) => {
    await studentModel.find()
        .then(students => {
            res.send(students);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving students."
            });
        });
}

// Find a single student with a studentId
const getStudentById = async (req, res) => {
    await studentModel.findById(req.params.id)
        .then(student => {
            if (!student) {
                return res.status(404).send({
                    message: "Student not found with id " + req.params.id
                });
            }
            res.send(student);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Student not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving student with id " + req.params.id
            });
        });
}

// Update a student identified by the studentId in the request  
const updateStudent = async (req, res) => {
    // Validate Request
    if (!req.body) {
        return res.status(400).send({
            message: "Student content can not be empty"
        });
    }

    await studentModel.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        rollNo: req.body.rollNo,
        department: req.body.department,
        assignments: req.body.assignments
    }, { new: true })
        .then(student => {
            if (!student) {
                return res.status(404).send({
                    message: "Student not found with id " + req.params.id
                });
            }
            res.send(student);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Student not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error updating student with id " + req.params.id
            });
        });
}

// Delete a student with the specified studentId in the request
const deleteStudent = async (req, res) => {
    await studentModel.findByIdAndDelete(req.params.id)
        .then(student => {
            if (!student) {
                return res.status(404).send({
                    message: "Student not found with id " + req.params.id
                });
            }
            res.send({ message: "Student deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Student not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete student with id " + req.params.id
            });
        });
}

// const uploadFile = async (req, res) => {
//     if (req.files === undefined) {
//         return res.status(400).send('Please upload a file!');
//     }
//     console.log(req.files?.file[0].path);
//     const filePath = req.files?.file[0].path;
//     const { studentId, assignmentId } = req.body;

//     try {
//         const assignment = await assignmentModel.findById(assignmentId);
//         const extractedText = await extractTextAndImagesFromPDF(filePath);
//         // Step 2: Call the Gemini API for grading
//         const assignmentGrade = await callPythonAPI({
//             sample: assignment.description,
//             assignment: extractedText.text
//         });
//         fs.unlink(filePath, (err) => {
//             if (err) console.error(`Failed to delete file: ${filePath}`, err);
//             else console.log(`File deleted: ${filePath}`);
//         });;

//         // Step 3: Update student's assignment grade in the database
//         await student.findByIdAndUpdate(
//             studentId,
//             {
//                 $push: {
//                     assignments: {
//                         assignmentId: assignmentId,
//                         grade: assignmentGrade.grade,
//                         remarks: assignmentGrade.remarks,
//                     }
//                 }
//             },
//             { new: true } // Return the updated document
//         )
//             .then(async (updatedStudent) => {
//                 console.log(`Updated student: ${updatedStudent}`);
//                 // Create notification for grade submission
//                 const notification = new Notification({
//                     title: "Assignment Graded",
//                     message: `Your assignment has been graded of subject. Grade: ${assignmentGrade.grade}`,
//                     studentId: studentId,
//                     type: "student"
//                 });
//                 await notification.save();
//             })

//         await assignmentModel.findByIdAndUpdate(
//             assignmentId,
//             $push = {
//                 students: {
//                     studentId: studentId,
//                     grade: assignmentGrade.grade,
//                 }
//             }
//         )
//             .then((updatedAssignment) => {
//                 console.log(`Updated assignment: ${updatedAssignment}`);
//             })
//         res.send(assignmentGrade)
//         // console.log(`Grading completed for student: ${studentId}`);
//     } catch (error) {
//         console.error(`Failed to process grading for student ${studentId}:`, error);
//     }
//     // // Add the job to the grading queue
//     // gradingQueue.add({
//     //     studentId: studentId,
//     //     assignmentId: assignmentId,
//     //     filePath: filePath
//     // },
//     //     {
//     //         attempts: 3,  
//     //         backoff: 5000 
//     //     }
//     // );
//     // res.status(200).send('File uploaded successfully. Grading will be processed.');
// };

const uploadFile = async (req, res) => {
    if (req.files === undefined) {
        return res.status(400).send('Please upload a file!');
    }

    const filePath = req.files.file[0].path;
    const { studentId, assignmentId } = req.body;

    try {
        // Save file path and details to the queue
        const queueItem = new AssignmentQueue({
            studentId,
            assignmentId,
            filePath,
            status: 'pending'
        });
        await queueItem.save();

        res.send({ message: 'File uploaded and task added to queue' });
    } catch (err) {
        console.error('Error saving file and path:', err);
        res.status(500).send({
            message: err.message || 'Some error occurred while saving the file and path.'
        });
    }
};

const pendingAssignments = async (req, res) => {
    const { id } = req.body;
    try {
        const pendingAssignments = await assignmentModel.find({
            'students.studentId': { $ne: id } // Only assignments where the student ID is not present
        });
        pendingAssignments.reverse();
        res.status(200).json(pendingAssignments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending assignments', error });
    }
}

const submittedAssignment = async (req, res) => {
    const { id } = req.body;
    const studentAssignments = await studentModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        { $unwind: "$assignments" },
        { $match: { "assignments.grade": { $ne: null } } },
        {
            $lookup: {
                from: "assignments",
                localField: "assignments.assignmentId",
                foreignField: "_id",
                as: "assignmentDetails"
            }
        },
        { $unwind: "$assignmentDetails" },
        {
            $project: {
                _id: 0,
                "assignmentDetails._id": 1,
                "assignmentDetails.title": 1,
                "assignmentDetails.description": 1,
                "assignmentDetails.deadline": 1,
                "assignmentDetails.subject": 1,
                "assignments.grade": 1,
                "assignments.remarks": 1,
                "assignments.submissionDate": 1
            }
        }
    ]);
    studentAssignments.reverse();
    res.status(200).json(studentAssignments);
}


module.exports = {
    registerStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    uploadFile,
    pendingAssignments,
    submittedAssignment
};