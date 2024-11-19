const studentModel = require('../models/student_model');
const facultyModel = require('../models/faculty_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const studentAuthenticator = async (req, res) => {
    try{
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({status: true, message: "Email and Password are required" });
        }

        const student = await studentModel.findOne({ email: email });

        if (!student) {
            return res.status(400).json({status: true, message: "Invalid Email or Password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, student.password);

        if(isPasswordCorrect){

            // const tokenData = {
            //     studentId: student._id,
            //     email: student.email,
            //     type : "student"
            // }
            // const token = jwt.sign(tokenData, "22010101110", { expiresIn: "3h" });
            return res.status(200).json({status: true, data: student._id, message: "Login Successful" });
        }
        else{
            return res.status(400).json({status: true, message: "Invalid Email or Password" });
        }
    }
    catch(error){
        console.error(`Failed to authenticate student: ${error}`);
    }
}

const facultyAuthenticator = async (req, res) => {
    try{
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({status: true, message: "Email and Password are required" });
        }
        
        const faculty = await facultyModel.findOne({ email: email });

        if (!faculty) {
            return res.status(400).json({status: true, message: "Invalid Email or Password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, faculty.password);

        if(isPasswordCorrect){

            // const tokenData = {
            //     facultyId: faculty._id,
            //     email: faculty.email,
            //     type : "faculty"
            // }

            // const token = jwt.sign(tokenData, "22010101110", { expiresIn: "3h" });
            return res.status(200).json({status: true, data: faculty._id, message: "Login Successful" });
        }
        else{
            return res.status(400).json({status: true, message: "Invalid Email or Password" });
        }
    }
    catch(error){
        console.error(`Failed to authenticate faculty: ${error}`);
    }
}

module.exports = { studentAuthenticator, facultyAuthenticator };