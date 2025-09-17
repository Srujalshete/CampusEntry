const Admin = require('../models/Admin');
const Student = require('../models/Student');
const { encrypt, decrypt } = require('../utils/crypto');

const createAdmin = async (req: any, res: any) => {
  try {
    const { email, password, role } = req.body;

    if (role && !['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Role must be either "admin" or "user".' });
    }

    // Encrypt only password
    const encryptedData = {
      email: email,
      password: encrypt(password),
    };

    const admin = new Admin({
      ...encryptedData,
      role: role || 'user'
    });
    await admin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const loginAdmin = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    // Find admin by email without encryption
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Decrypt once to get original password
    const decryptedPassword = decrypt(admin.password);
    if (decryptedPassword !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', role: admin.role });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getCounts = async (req: any, res: any) => {
  try {
    const totalAdmins = await Admin.countDocuments();
    const totalStudents = await Student.countDocuments();
    res.json({ totalAdmins, totalStudents });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createAdmin, loginAdmin, getCounts };
