import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import User, { IUserDocument } from '../models/User';
import { IUser } from '../types';

export class UserRepository {
  async findByEmail(email: string): Promise<IUserDocument | null> {
    if (!email) return null;
    return await User.findOne({ email: email.toLowerCase() });
  }

  async findByUsername(username: string): Promise<IUserDocument | null> {
    if (!username) return null;
    return await User.findOne({ username });
  }

  async findById(id: string): Promise<IUserDocument | null> {
    if (!id) return null;
    let user = await User.findOne({ id }).select('-password -verificationToken');
    if (!user && mongoose.isValidObjectId(id)) {
      user = await User.findById(id).select('-password -verificationToken');
    }
    return user;
  }

  async findByVerificationToken(token: string): Promise<IUserDocument | null> {
    if (!token) return null;
    return await User.findOne({ verificationToken: token });
  }

  async createUser(userData: Partial<IUser>): Promise<IUserDocument> {
    const data = { ...userData };
    if (data.email) {
      data.email = data.email.toLowerCase();
    }
    if (!data.id) {
      data.id = uuidv4();
    }
    return await User.create(data);
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUserDocument | null> {
    if (!id) return null;
    let user = await User.findOneAndUpdate({ id }, updateData, { new: true }).select('-password -verificationToken');
    if (!user && mongoose.isValidObjectId(id)) {
      user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password -verificationToken');
    }
    return user;
  }

  async deleteUser(id: string): Promise<IUserDocument | null> {
    if (!id) return null;
    let user = await User.findOneAndDelete({ id }).select('-password -verificationToken');
    if (!user && mongoose.isValidObjectId(id)) {
      user = await User.findByIdAndDelete(id).select('-password -verificationToken');
    }
    return user;
  }

  async getAllUsers(): Promise<IUserDocument[]> {
    return await User.find().select('-password -verificationToken');
  }

  async upsertGoogleUser(googleData: {
    email: string;
    name?: string;
    picture?: string;
    sub?: string;
    username?: string;
    img?: string;
  }): Promise<IUserDocument> {
    const email = googleData.email.toLowerCase();
    let user = await this.findByEmail(email);

    const img = googleData.picture || googleData.img || '/profiles/profile1.png';

    if (user) {
      user.isVerified = true;
      user.status = 'active';
      if (googleData.picture || googleData.img) {
        user.img = img;
      }
      await user.save();
      return user;
    }

    // Derive username from provided username, name, or email prefix
    let rawUsername = googleData.username || googleData.name || email.split('@')[0];
    let baseUsername = rawUsername.trim().replace(/\s+/g, '_').toLowerCase();
    if (!baseUsername) {
      baseUsername = 'user';
    }

    // Ensure username uniqueness
    let username = baseUsername;
    let counter = 1;
    while (await this.findByUsername(username)) {
      username = `${baseUsername}_${counter++}`;
    }

    const randomPassword = await bcrypt.hash(uuidv4(), 10);

    const newUser = await User.create({
      id: uuidv4(),
      username,
      email,
      password: randomPassword,
      img,
      isVerified: true,
      status: 'active',
      isAdmin: false,
    });

    return newUser;
  }
}

export const userRepository = new UserRepository();

// Export individual functions for direct function calls
export const findByEmail = (email: string) => userRepository.findByEmail(email);
export const findByUsername = (username: string) => userRepository.findByUsername(username);
export const findById = (id: string) => userRepository.findById(id);
export const findByVerificationToken = (token: string) => userRepository.findByVerificationToken(token);
export const createUser = (userData: Partial<IUser>) => userRepository.createUser(userData);
export const updateUser = (id: string, updateData: Partial<IUser>) => userRepository.updateUser(id, updateData);
export const deleteUser = (id: string) => userRepository.deleteUser(id);
export const getAllUsers = () => userRepository.getAllUsers();
export const upsertGoogleUser = (googleData: {
  email: string;
  name?: string;
  picture?: string;
  sub?: string;
  username?: string;
  img?: string;
}) => userRepository.upsertGoogleUser(googleData);

export default userRepository;
