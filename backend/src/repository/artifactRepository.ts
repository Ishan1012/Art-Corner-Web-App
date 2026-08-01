import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Artifact, { IArtifactDocument } from '../models/Artifact';
import { IArtifact } from '../types';

export class ArtifactRepository {
  async findById(id: string): Promise<IArtifactDocument | null> {
    if (!id) return null;
    let artifact = await Artifact.findOne({ id });
    if (!artifact && mongoose.isValidObjectId(id)) {
      artifact = await Artifact.findById(id);
    }
    return artifact;
  }

  async findAll(): Promise<IArtifactDocument[]> {
    return await Artifact.find();
  }

  async createArtifact(artifactData: Partial<IArtifact>): Promise<IArtifactDocument> {
    const data = { ...artifactData };
    if (!data.id) {
      data.id = uuidv4();
    }
    return await Artifact.create(data);
  }

  async deleteArtifact(id: string): Promise<IArtifactDocument | null> {
    if (!id) return null;
    let artifact: IArtifactDocument | null = null;
    if (mongoose.isValidObjectId(id)) {
      artifact = await Artifact.findByIdAndDelete(id);
    }
    if (!artifact) {
      artifact = await Artifact.findOneAndDelete({ id });
    }
    return artifact;
  }

  async searchArtifacts(query: string): Promise<IArtifactDocument[]> {
    const q = (query || '').toLowerCase();
    const artifacts = await Artifact.find();
    return artifacts.filter((item) => {
      const titleMatch = item.title?.toLowerCase().includes(q);
      const tagMatch = item.tags?.some((tag: string) => tag.toLowerCase().includes(q));
      return Boolean(titleMatch || tagMatch);
    });
  }

  async likeArtifact(id: string, userId: string): Promise<IArtifactDocument | null> {
    const artifact = await this.findById(id);
    if (!artifact) return null;

    const alreadyLiked = artifact.like?.some((likeUser: any) => likeUser.toString() === userId);
    if (!alreadyLiked) {
      if (!artifact.like) artifact.like = [];
      artifact.like.push(userId as any);
      await artifact.save();
    }
    return artifact;
  }

  async unlikeArtifact(id: string, userId: string): Promise<IArtifactDocument | null> {
    const artifact = await this.findById(id);
    if (!artifact) return null;

    if (artifact.like) {
      artifact.like = artifact.like.filter((uid: any) => uid.toString() !== userId);
      await artifact.save();
    }
    return artifact;
  }
}

export const artifactRepository = new ArtifactRepository();

export const findById = (id: string) => artifactRepository.findById(id);
export const findAll = () => artifactRepository.findAll();
export const createArtifact = (artifactData: Partial<IArtifact>) => artifactRepository.createArtifact(artifactData);
export const deleteArtifact = (id: string) => artifactRepository.deleteArtifact(id);
export const searchArtifacts = (query: string) => artifactRepository.searchArtifacts(query);
export const likeArtifact = (id: string, userId: string) => artifactRepository.likeArtifact(id, userId);
export const unlikeArtifact = (id: string, userId: string) => artifactRepository.unlikeArtifact(id, userId);

export default artifactRepository;
