const express = require('express');
const { createAdmin, loginAdmin, getCounts, getAllAdmins, getAdminById, updateAdmin, deleteAdmin } = require('../controller/adminController');

const router = express.Router();

router.post('/register', createAdmin);
router.post('/login', loginAdmin);
router.get('/counts', getCounts);
router.get('/admins', getAllAdmins);
router.get('/admins/:id', getAdminById);
router.put('/admins/:id', updateAdmin);
router.delete('/admins/:id', deleteAdmin);

module.exports = router;
