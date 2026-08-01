import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Newsletter, { INewsletterDocument } from '../models/Newsletter';
import { INewsletter } from '../types';

export class NewsletterRepository {
  async findById(id: string): Promise<INewsletterDocument | null> {
    if (!id) return null;
    let newsletter = await Newsletter.findOne({ id });
    if (!newsletter && mongoose.isValidObjectId(id)) {
      newsletter = await Newsletter.findById(id);
    }
    return newsletter;
  }

  async findAll(): Promise<INewsletterDocument[]> {
    return await Newsletter.find();
  }

  async createNewsletter(newsletterData: Partial<INewsletter>): Promise<INewsletterDocument> {
    const data = { ...newsletterData };
    if (!data.id) {
      data.id = uuidv4();
    }
    return await Newsletter.create(data);
  }

  async deleteNewsletter(id: string): Promise<INewsletterDocument | null> {
    if (!id) return null;
    let newsletter = await Newsletter.findOneAndDelete({ id });
    if (!newsletter && mongoose.isValidObjectId(id)) {
      newsletter = await Newsletter.findByIdAndDelete(id);
    }
    return newsletter;
  }
}

export const newsletterRepository = new NewsletterRepository();

export const findById = (id: string) => newsletterRepository.findById(id);
export const findAll = () => newsletterRepository.findAll();
export const createNewsletter = (newsletterData: Partial<INewsletter>) => newsletterRepository.createNewsletter(newsletterData);
export const deleteNewsletter = (id: string) => newsletterRepository.deleteNewsletter(id);

export default newsletterRepository;
