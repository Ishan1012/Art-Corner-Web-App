import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IArtifact } from '../types';

export interface IArtifactDocument extends Omit<IArtifact, '_id' | 'id'>, Document {
  id?: any;
}

const artifactSchema = new Schema<IArtifactDocument>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    img: {
      type: Schema.Types.Mixed,
      required: true,
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
    contentType: { type: String, default: 'image/png' },
    like: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    tags: [{ type: String, default: [] }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Artifact = mongoose.models.Artifact || mongoose.model<IArtifactDocument>('Artifact', artifactSchema);

export default Artifact;
export { Artifact };
