import { Request } from 'express';
import mongoose from 'mongoose';

export interface IUser {
  _id?: string | mongoose.Types.ObjectId;
  id?: string;
  username: string;
  email: string;
  password?: string;
  status?: string;
  isVerified?: boolean;
  verificationToken?: string;
  isAdmin?: boolean;
  img?: string | Buffer | any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IArtifact {
  _id?: string | mongoose.Types.ObjectId;
  id?: string;
  title: string;
  desc: string;
  img: string | Buffer | any;
  contentType?: string;
  like?: (string | mongoose.Types.ObjectId)[];
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICommunity {
  _id?: string | mongoose.Types.ObjectId;
  id?: string;
  name: string;
  members?: (string | mongoose.Types.ObjectId)[];
  description?: string;
  img?: string | Buffer | any;
  banner?: string;
  rules?: string[];
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPost {
  _id?: string | mongoose.Types.ObjectId;
  id?: string;
  communityId: string;
  authorId: string;
  authorName?: string;
  title: string;
  content: string;
  img?: string;
  upvotes?: string[];
  downvotes?: string[];
  commentCount?: number;
  flair?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IComment {
  _id?: string | mongoose.Types.ObjectId;
  id?: string;
  postId: string;
  authorId: string;
  authorName?: string;
  content: string;
  upvotes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFeedback {
  _id?: string | mongoose.Types.ObjectId;
  id?: string;
  name: string;
  email: string;
  subject: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IImage {
  _id?: string | mongoose.Types.ObjectId;
  id?: string;
  img: string | Buffer | any;
  contentType?: string;
  userid: string;
  prompt: string;
  responseText?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INewsletter {
  _id?: string | mongoose.Types.ObjectId;
  id?: string;
  title: string;
  desc?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JwtPayload {
  id?: string;
  userId?: string;
  _id?: string;
  email?: string;
  username?: string;
  isAdmin?: boolean;
  [key: string]: any;
}

export interface AuthRequest extends Request {
  user?: JwtPayload | any;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | any;
    }
  }
}
