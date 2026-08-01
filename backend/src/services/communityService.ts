import { communityRepository } from '../repository/communityRepository';
import { ICommunity } from '../types';

export class CommunityService {
  async getAllCommunities() {
    return await communityRepository.findAll();
  }

  async getCommunityById(id: string) {
    if (!id) {
      throw new Error('Community not exist.');
    }
    const community = await communityRepository.findById(id);
    if (!community) {
      throw new Error('Community not exist.');
    }
    return community;
  }

  async createCommunity(data: { name?: string; members?: any[]; description?: string; img?: any }) {
    const { name, description, members, img } = data;
    if (!name || !description) {
      throw new Error('Fields cannot be empty');
    }

    return await communityRepository.createCommunity({
      name,
      description,
      ...(members && { members }),
      ...(img && { img }),
    });
  }

  async joinCommunity(id: string, member: string) {
    const result = await communityRepository.joinCommunity(id, member);
    if (result.status === 'not_found') {
      throw new Error('Community does not exist.');
    }
    if (result.status === 'already_joined') {
      throw new Error('User already joined');
    }
    return result.community;
  }

  async leaveCommunity(id: string, member: string) {
    const community = await communityRepository.leaveCommunity(id, member);
    if (!community) {
      throw new Error('Community does not exist.');
    }
    return community;
  }

  async deleteCommunity(id: string) {
    const community = await communityRepository.deleteCommunity(id);
    if (!community) {
      throw new Error('Community not found.');
    }
    return community;
  }
}

export const communityService = new CommunityService();

export const getAllCommunities = () => communityService.getAllCommunities();
export const getCommunityById = (id: string) => communityService.getCommunityById(id);
export const createCommunity = (data: { name?: string; members?: any[]; description?: string; img?: any }) =>
  communityService.createCommunity(data);
export const joinCommunity = (id: string, member: string) => communityService.joinCommunity(id, member);
export const leaveCommunity = (id: string, member: string) => communityService.leaveCommunity(id, member);
export const deleteCommunity = (id: string) => communityService.deleteCommunity(id);

export default communityService;
