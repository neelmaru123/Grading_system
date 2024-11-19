const router = require('express').Router();

const { createSemester,
    getAllSemesters,
    getSemesterById,
    deleteSemester, 
    getSemesterByFaculty,
    updateSemester} = require('../controller/semester_controller');


router
    .get('/getSemesters', getAllSemesters)
    .get('/getSemesterById/:id', getSemesterById)
    .delete('/deleteSemester/:id', deleteSemester)
    .post('/registerSemester', createSemester)
    .put('/updateSemester', updateSemester)
    .get('/getSemesterByFaculty/:facultyId', getSemesterByFaculty)

module.exports = router;
