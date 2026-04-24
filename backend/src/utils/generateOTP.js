<<<<<<< HEAD
import crypto from "crypto";

export const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
=======
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
};
