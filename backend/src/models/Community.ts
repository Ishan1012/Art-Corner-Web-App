import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ICommunity } from '../types';

export interface ICommunityDocument extends Omit<ICommunity, '_id' | 'id'>, Document {
  id?: any;
}

const communitySchema = new Schema<ICommunityDocument>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    name: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    description: { type: String, default: '' },
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
    banner: { type: String, default: '' },
    rules: [{ type: String }],
    tags: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Community = mongoose.models.Community || mongoose.model<ICommunityDocument>('Community', communitySchema);

export default Community;
export { Community };
