import { Request, Response } from 'express';
import { userService } from '../services/userService';

export class UserController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        res.status(400).json({ message: 'Username, email, and password are required' });
        return;
      }

      const result = await userService.signup({ username, email, password });
      res.status(201).json({
        message: 'User created successfully',
        token: result.token,
        user: result.user,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'An error occurred during signup' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, username } = req.body;
      const identifier = email || username;

      if (!identifier || !password) {
        res.status(400).json({ message: 'Username or password is not valid' });
        return;
      }

      const result = await userService.login({ email: identifier, password });
      res.status(200).json({
        message: 'Login successful',
        token: result.token,
        user: result.user,
      });
    } catch (error: any) {
      const msg = error.message || '';
      if (msg.includes('blocked')) {
        res.status(403).json({ message: msg });
      } else if (msg.includes('not valid') || msg.includes('Invalid') || msg.includes('not found')) {
        res.status(400).json({ message: msg });
      } else {
        res.status(500).json({ message: msg || 'Internal server error' });
      }
    }
  }

  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const idToken = req.body.idToken || req.body.token || req.body.credential;

      if (!idToken) {
        res.status(400).json({ message: 'idToken is required' });
        return;
      }

      const result = await userService.googleLogin(idToken);
      res.status(200).json({
        message: 'Google login successful',
        token: result.token,
        user: result.user,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Invalid or expired Google ID token' });
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const token = (req.query.token as string) || (req.params as any).token;

      if (!token) {
        res.status(400).json({ message: 'Token is required' });
        return;
      }

      const user = await userService.verifyEmail(token);
      res.status(200).json({
        message: 'Email verified successfully',
        user,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'An error occurred during email verification' });
    }
  }

  async getUserList(req: Request, res: Response): Promise<void> {
    try {
      const pass = req.params.pass as string;

      if (!pass) {
        res.status(400).json({ message: 'Password parameter is required' });
        return;
      }

      const users = await userService.getUserList(pass);
      res.status(200).json({ users });
    } catch (error: any) {
      const msg = error.message || '';
      if (msg.includes('Forbidden') || msg.includes('Invalid password')) {
        res.status(403).json({ message: msg });
      } else {
        res.status(500).json({ message: msg || 'Internal server error' });
      }
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      if (!req.user || (String(req.user.id || req.user._id) !== String(id) && !req.user.isAdmin)) {
        res.status(403).json({ message: 'Forbidden: You do not have permission to modify or delete this account' });
        return;
      }

      const updates = req.body;
      const user = await userService.updateUser(id, updates);
      res.status(200).json({
        message: 'User updated successfully',
        user,
      });
    } catch (error: any) {
      if (error.message === 'User not found') {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.status(500).json({ message: error.message || 'Internal server error' });
      }
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      if (!req.user || (String(req.user.id || req.user._id) !== String(id) && !req.user.isAdmin)) {
        res.status(403).json({ message: 'Forbidden: You do not have permission to modify or delete this account' });
        return;
      }

      const user = await userService.deleteUser(id);
      res.status(200).json({
        message: 'User deleted successfully',
        user,
      });
    } catch (error: any) {
      if (error.message === 'User not found') {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.status(500).json({ message: error.message || 'Internal server error' });
      }
    }
  }
}

export const userController = new UserController();

export const signup = (req: Request, res: Response) => userController.signup(req, res);
export const login = (req: Request, res: Response) => userController.login(req, res);
export const googleLogin = (req: Request, res: Response) => userController.googleLogin(req, res);
export const verifyEmail = (req: Request, res: Response) => userController.verifyEmail(req, res);
export const getUserList = (req: Request, res: Response) => userController.getUserList(req, res);
export const updateUser = (req: Request, res: Response) => userController.updateUser(req, res);
export const deleteUser = (req: Request, res: Response) => userController.deleteUser(req, res);

export default userController;
