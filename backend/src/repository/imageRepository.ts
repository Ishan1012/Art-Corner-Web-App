import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Image, { IImageDocument } from '../models/Image';
import { IImage } from '../types';

export class ImageRepository {
  async findById(id: string): Promise<IImageDocument | null> {
    if (!id) return null;
    let image = await Image.findOne({ id });
    if (!image && mongoose.isValidObjectId(id)) {
      image = await Image.findById(id);
    }
    return image;
  }

  async findByUserId(userid: string): Promise<IImageDocument[]> {
    if (!userid) return [];
    return await Image.find({ userid });
  }

  async findAll(): Promise<IImageDocument[]> {
    return await Image.find();
  }

  async createImage(imageData: Partial<IImage>): Promise<IImageDocument> {
    const data = { ...imageData };
    if (!data.id) {
      data.id = uuidv4();
    }
    return await Image.create(data);
  }

  async deleteImage(id: string): Promise<IImageDocument | null> {
    if (!id) return null;
    let image = await Image.findOneAndDelete({ id });
    if (!image && mongoose.isValidObjectId(id)) {
      image = await Image.findByIdAndDelete(id);
    }
    return image;
  }
}

export const imageRepository = new ImageRepository();

export const findById = (id: string) => imageRepository.findById(id);
export const findByUserId = (userid: string) => imageRepository.findByUserId(userid);
export const findAll = () => imageRepository.findAll();
export const createImage = (imageData: Partial<IImage>) => imageRepository.createImage(imageData);
export const deleteImage = (id: string) => imageRepository.deleteImage(id);

export default imageRepository;
