const express = require('express');
const { createAdmin, loginAdmin, getCounts } = require('../controller/adminController');

const router = express.Router();

router.post('/register', createAdmin);
router.post('/login', loginAdmin);
router.get('/counts', getCounts);

module.exports = router;
