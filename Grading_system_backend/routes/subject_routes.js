const router = require('express').Router();

const { registerSubject,
    getAllSubjects,
    updateSbuject,
    deleteSubject,
    getSubjectByFaculty } = require('../controller/subject_controller');

router
    .post('/registerSubject', registerSubject)
    .get('/getAllSubjects', getAllSubjects)
    .put('/updateSubject/:id', updateSbuject)
    .delete('/deleteSubject/:id', deleteSubject)
    .get('/getSubjectByFaculty/:facultyId', getSubjectByFaculty)

module.exports = router;