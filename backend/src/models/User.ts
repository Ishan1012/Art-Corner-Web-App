import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../types';

export interface IUserDocument extends Omit<IUser, '_id' | 'id'>, Document {
  id?: any;
}

const userSchema = new Schema<IUserDocument>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'active',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    img: {
      type: Schema.Types.Mixed,
      default: '/profiles/profile1.png',
      validate: {
        validator: function (value: any) {
          return (
            typeof value === 'string' ||
            Buffer.isBuffer(value) ||
            (value && typeof value === 'object' && ('_bsontype' in value || 'buffer' in value || value.constructor?.name === 'Binary'))
          );
        },
        message: 'img must be a string or a Buffer',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const User = mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);

export default User;
export { User };
