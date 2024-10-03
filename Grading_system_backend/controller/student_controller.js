const studentModel = require('../models/student_model');

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

const gradingQueue = require('../queues/gradingQueue');

const uploadFile = (req, res) => {
    if (req.files === undefined) {
        return res.status(400).send('Please upload a file!');
    }

    console.log(req.files?.file[0].path);

    const filePath = req.files?.file[0].path;
    const { studentId, assignmentId } = req.body;

    // Add the job to the grading queue
    gradingQueue.add({
        studentId: studentId,
        assignmentId: assignmentId,
        filePath: filePath
    },
        {
            attempts: 3,  // Number of retries in case of failure
            backoff: 5000 // Time (ms) to wait before retrying
        }
    );

    res.status(200).send('File uploaded successfully. Grading will be processed.');
};


module.exports = {
    registerStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    uploadFile
};