import { newsletterRepository } from '../repository/newsletterRepository';
import { INewsletter } from '../types';

export class NewsletterService {
  async getAllNewsletters() {
    return await newsletterRepository.findAll();
  }

  async getNewsletterById(id: string) {
    if (!id) {
      throw new Error('Newsletter not found.');
    }
    const newsletter = await newsletterRepository.findById(id);
    if (!newsletter) {
      throw new Error('Newsletter not found.');
    }
    return newsletter;
  }

  async subscribeNewsletter(data: { title?: string; desc?: string }) {
    const { title, desc } = data;
    if (!title || !desc) {
      throw new Error('Fields cannot be empty');
    }

    return await newsletterRepository.createNewsletter({
      title,
      desc,
    });
  }

  async deleteNewsletter(id: string) {
    const newsletter = await newsletterRepository.deleteNewsletter(id);
    if (!newsletter) {
      throw new Error('Newsletter not found.');
    }
    return newsletter;
  }
}

export const newsletterService = new NewsletterService();

export const getAllNewsletters = () => newsletterService.getAllNewsletters();
export const getNewsletterById = (id: string) => newsletterService.getNewsletterById(id);
export const subscribeNewsletter = (data: { title?: string; desc?: string }) =>
  newsletterService.subscribeNewsletter(data);
export const deleteNewsletter = (id: string) => newsletterService.deleteNewsletter(id);

export default newsletterService;
