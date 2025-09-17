const express = require('express');
const { createStudent, getStudents, updateStudent, deleteStudent, getStudentCount } = require('../controller/studentController');

const router = express.Router();

router.post('/register', createStudent);
router.get('/students', getStudents);
router.put('/student/:id', updateStudent);
router.delete('/student/:id', deleteStudent);
router.get('/count', getStudentCount);

module.exports = router;
