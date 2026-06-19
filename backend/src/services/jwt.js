import crypto from 'crypto';
import jwt from 'jsonwebtoken';


export const generateOtp = () => {
  // Generates a random integer between 100000 and 999999
  return (crypto.randomInt(100000, 1000000)).toString();
};


export const createAccessToken = (userId) => {
  const payload = {
    userId: userId.toString()
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS256'
  });
};