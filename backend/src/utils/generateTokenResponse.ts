import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateTokenResponse = (doc: any): any => {
  const secret = process.env.JWT_SECRET || 'default_secret';
  const payload = {
    email: doc.email || '',
    isAdmin: Boolean(doc.isAdmin),
  };
  const token = jwt.sign(payload, secret, { expiresIn: '30d' });

  const obj = doc.toObject ? doc.toObject() : { ...doc };
  obj.token = token;
  return obj;
};

export default generateTokenResponse;
