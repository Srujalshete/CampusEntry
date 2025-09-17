const CryptoJS = require('crypto-js');

// Assuming a fixed key for simplicity; in production, use environment variables
const SECRET_KEY = process.env.SECRET_KEY || 'default-secret-key';

const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

const decrypt = (ciphertext: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };
