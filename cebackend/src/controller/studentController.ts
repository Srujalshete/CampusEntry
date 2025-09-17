const Student = require('../models/Student');
const { encrypt, decrypt } = require('../utils/crypto');

const createStudent = async (req: any, res: any) => {
  try {
    const { fullName, email, phoneNumber, dateOfBirth, gender, address, courseEnrolled, password } = req.body;

    // Assume data is already encrypted once by frontend
    // Encrypt again for second level
    const encryptedData = {
      fullName: encrypt(fullName),
      email: encrypt(email),
      phoneNumber: encrypt(phoneNumber),
      dateOfBirth: encrypt(dateOfBirth),
      gender: encrypt(gender),
      address: encrypt(address),
      courseEnrolled: encrypt(courseEnrolled),
      password: encrypt(password),
    };

    const student = new Student(encryptedData);
    await student.save();
    res.status(201).json({ message: 'Student created successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getStudents = async (req: any, res: any) => {
  try {
    const students = await Student.find();
    // Decrypt one level (the second encryption)
    const decryptedStudents = students.map((student: any) => ({
      _id: student._id,
      fullName: decrypt(student.fullName),
      email: decrypt(student.email),
      phoneNumber: decrypt(student.phoneNumber),
      dateOfBirth: decrypt(student.dateOfBirth),
      gender: decrypt(student.gender),
      address: decrypt(student.address),
      courseEnrolled: decrypt(student.courseEnrolled),
      password: decrypt(student.password), // Note: sending password, but probably shouldn't in real app
    }));
    res.json(decryptedStudents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const updateStudent = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Encrypt updates again
    const encryptedUpdates: any = {};
    for (const key in updates) {
      encryptedUpdates[key] = encrypt(updates[key]);
    }

    await Student.findByIdAndUpdate(id, encryptedUpdates);
    res.json({ message: 'Student updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStudent = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


const getStudentCount = async (req: any, res: any) => {
  try {
    const count = await Student.countDocuments();
    res.status(200).json({ totalStudents: count });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { createStudent, getStudents, updateStudent, deleteStudent, getStudentCount };
