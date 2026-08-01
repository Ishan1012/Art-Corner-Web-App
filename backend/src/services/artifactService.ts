import { artifactRepository } from '../repository/artifactRepository';
import { IArtifact } from '../types';

export class ArtifactService {
  async getAllArtifacts() {
    return await artifactRepository.findAll();
  }

  async getArtifactById(id: string) {
    if (!id) {
      throw new Error('Artifact not found');
    }
    const artifact = await artifactRepository.findById(id);
    if (!artifact) {
      throw new Error('Artifact not found');
    }
    return artifact;
  }

  async searchArtifacts(query: string) {
    return await artifactRepository.searchArtifacts(query);
  }

  async uploadArtifact(data: { title?: string; desc?: string; img?: any; contentType?: string; tags?: string[] }) {
    const { title, desc, img, contentType, tags } = data;

    if (!title || !desc || !img) {
      throw new Error('Invalid input. All fields are required and cannot be empty.');
    }

    let finalImage = img;
    const isBase64 = typeof img === 'string' && img.startsWith('data:');

    if (isBase64) {
      try {
        const base64Data = img.split(',')[1];
        finalImage = Buffer.from(base64Data, 'base64');
      } catch (err) {
        throw new Error('Invalid base64 image format.');
      }
    } else if (typeof img === 'string' && img.includes('/img/img')) {
      finalImage = img;
    } else if (Buffer.isBuffer(img) || typeof img === 'string') {
      finalImage = img;
    } else {
      throw new Error('Invalid image. Must be base64 string or valid image path.');
    }

    return await artifactRepository.createArtifact({
      title,
      desc,
      img: finalImage,
      contentType: contentType || 'image/png',
      tags: tags || [],
    });
  }

  async deleteArtifact(id: string) {
    const artifact = await artifactRepository.deleteArtifact(id);
    if (!artifact) {
      throw new Error('Artifact not found');
    }
    return artifact;
  }

  async likeArtifact(id: string, userId: string) {
    const artifact = await artifactRepository.likeArtifact(id, userId);
    if (!artifact) {
      throw new Error('Artifact not found');
    }
    return artifact;
  }

  async unlikeArtifact(id: string, userId: string) {
    const artifact = await artifactRepository.unlikeArtifact(id, userId);
    if (!artifact) {
      throw new Error('Artifact not found');
    }
    return artifact;
  }
}

export const artifactService = new ArtifactService();

export const getAllArtifacts = () => artifactService.getAllArtifacts();
export const getArtifactById = (id: string) => artifactService.getArtifactById(id);
export const searchArtifacts = (query: string) => artifactService.searchArtifacts(query);
export const uploadArtifact = (data: { title?: string; desc?: string; img?: any; contentType?: string; tags?: string[] }) =>
  artifactService.uploadArtifact(data);
export const deleteArtifact = (id: string) => artifactService.deleteArtifact(id);
export const likeArtifact = (id: string, userId: string) => artifactService.likeArtifact(id, userId);
export const unlikeArtifact = (id: string, userId: string) => artifactService.unlikeArtifact(id, userId);

export default artifactService;
