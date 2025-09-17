import CryptoJS from 'crypto-js';

// Assuming a fixed key for simplicity; in production, use environment variables
const SECRET_KEY = 'campusentry123'; // Match backend key

export const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decrypt = (ciphertext: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
