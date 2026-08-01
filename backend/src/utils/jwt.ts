import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

const getSecret = (): string => process.env.JWT_SECRET || 'artcorner_secret_key';

export const generateToken = (payload: object, expiresIn: string | number = '24h'): string => {
  return jwt.sign(payload, getSecret(), { expiresIn: expiresIn as any });
};

export const verifyToken = (token: string): JwtPayload | string => {
  return jwt.verify(token, getSecret()) as JwtPayload | string;
};

export default {
  generateToken,
  verifyToken,
};
