import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Community, { ICommunityDocument } from '../models/Community';
import { ICommunity } from '../types';

export class CommunityRepository {
  async findById(id: string): Promise<ICommunityDocument | null> {
    if (!id) return null;
    let community = await Community.findOne({ id });
    if (!community && mongoose.isValidObjectId(id)) {
      community = await Community.findById(id);
    }
    return community;
  }

  async findAll(): Promise<ICommunityDocument[]> {
    return await Community.find();
  }

  async createCommunity(communityData: Partial<ICommunity>): Promise<ICommunityDocument> {
    const data = { ...communityData };
    if (!data.id) {
      data.id = uuidv4();
    }
    return await Community.create(data);
  }

  async deleteCommunity(id: string): Promise<ICommunityDocument | null> {
    if (!id) return null;
    let community = await Community.findOneAndDelete({ id });
    if (!community && mongoose.isValidObjectId(id)) {
      community = await Community.findByIdAndDelete(id);
    }
    return community;
  }

  async joinCommunity(id: string, member: string): Promise<{ community: ICommunityDocument | null; status: 'ok' | 'not_found' | 'already_joined' }> {
    const community = await this.findById(id);
    if (!community) {
      return { community: null, status: 'not_found' };
    }

    const isAlreadyMember = community.members?.some(
      (m: any) => m.toString() === member || (m.equals && m.equals(member))
    );

    if (isAlreadyMember) {
      return { community, status: 'already_joined' };
    }

    if (!community.members) community.members = [];
    community.members.push(member as any);
    const updated = await community.save();
    return { community: updated, status: 'ok' };
  }

  async leaveCommunity(id: string, member: string): Promise<ICommunityDocument | null> {
    const community = await this.findById(id);
    if (!community) return null;

    if (community.members) {
      community.members = community.members.filter(
        (m: any) => m.toString() !== member && (!m.equals || !m.equals(member))
      );
      await community.save();
    }
    return community;
  }
}

export const communityRepository = new CommunityRepository();

export const findById = (id: string) => communityRepository.findById(id);
export const findAll = () => communityRepository.findAll();
export const createCommunity = (communityData: Partial<ICommunity>) => communityRepository.createCommunity(communityData);
export const deleteCommunity = (id: string) => communityRepository.deleteCommunity(id);
export const joinCommunity = (id: string, member: string) => communityRepository.joinCommunity(id, member);
export const leaveCommunity = (id: string, member: string) => communityRepository.leaveCommunity(id, member);

export default communityRepository;
