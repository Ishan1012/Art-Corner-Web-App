import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthRequest } from '../types';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: Missing, invalid or expired token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Unauthorized: Missing, invalid or expired token' });
    return;
  }

  try {
    const decoded = verifyToken(token);
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Missing, invalid or expired token' });
    return;
  }
};

export const authenticate = authMiddleware;
export default authMiddleware;
