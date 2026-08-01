import mongoose from 'mongoose';
import assert from 'assert';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

import Artifact from '../models/Artifact';
import Community from '../models/Community';
import Feedback from '../models/Feedback';
import Image from '../models/Image';
import Newsletter from '../models/Newsletter';
import User from '../models/User';

import artifactRepository from '../repository/artifactRepository';
import communityRepository from '../repository/communityRepository';
import feedbackRepository from '../repository/feedbackRepository';
import imageRepository from '../repository/imageRepository';
import newsletterRepository from '../repository/newsletterRepository';
import userRepository from '../repository/userRepository';

import artifactService from '../services/artifactService';
import communityService from '../services/communityService';
import feedbackService from '../services/feedbackService';
import imageService from '../services/imageService';
import newsletterService from '../services/newsletterService';

import artifactController from '../controller/artifactController';
import communityController from '../controller/communityController';
import feedbackController from '../controller/feedbackController';
import imageController from '../controller/imageController';
import newsletterController from '../controller/newsletterController';

dotenv.config();

function mockReqRes(options: {
  body?: any;
  params?: any;
  query?: any;
  headers?: any;
  user?: any;
}) {
  const req: any = {
    body: options.body || {},
    params: options.params || {},
    query: options.query || {},
    headers: options.headers || {},
    user: options.user,
  };

  let statusCode = 200;
  let jsonResponse: any = null;

  const res: any = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      jsonResponse = data;
      return this;
    },
    send(data: any) {
      jsonResponse = data;
      return this;
    },
    getStatus() {
      return statusCode;
    },
    getJson() {
      return jsonResponse;
    },
  };

  return { req, res };
}

async function runM4Tests() {
  console.log('=== Running Milestone 4 (M4) Comprehensive Entity Tests ===');

  const mongoUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI || 'mongodb://localhost:27017/artcorner_test';
  
  let isConnected = false;
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log('Connected to MongoDB for testing.');
    isConnected = true;

    // Clean up test collections
    await Artifact.deleteMany({ title: /m4_test/i });
    await Community.deleteMany({ name: /m4_test/i });
    await Feedback.deleteMany({ email: /m4_test/i });
    await Image.deleteMany({ prompt: /m4_test/i });
    await Newsletter.deleteMany({ title: /m4_test/i });
    await User.deleteMany({ email: /m4_test/i });
  } catch (err) {
    console.log('MongoDB connection skipped/failed, executing tests with repository logic.');
  }

  // Create a test user for like/join/image tests
  const testUserId = uuidv4();
  const testUserMongoId = new mongoose.Types.ObjectId().toString();
  let testUser: any = null;

  if (isConnected) {
    testUser = await userRepository.createUser({
      id: testUserId,
      username: `m4_user_${Date.now()}`,
      email: `m4_test_${Date.now()}@m4test.com`,
      password: 'Password@123',
    });
  }

  // ==========================================
  // ENTITY 1: ARTIFACT TESTS
  // ==========================================
  console.log('\n--- 1. Testing Artifact Entity (MVC) ---');
  
  // Test 1.1: Repository create & find
  console.log('Test 1.1: Artifact Repository CRUD...');
  const artifactId = uuidv4();
  const artifactObj = await artifactRepository.createArtifact({
    id: artifactId,
    title: 'm4_test_artifact_1',
    desc: 'Description for m4 test artifact 1',
    img: '/img/img1.png',
    contentType: 'image/png',
    tags: ['m4', 'abstract', 'painting'],
  });
  assert.ok(artifactObj, 'Artifact should be created');
  assert.strictEqual(artifactObj.title, 'm4_test_artifact_1');

  const foundArtifact = await artifactRepository.findById(artifactId);
  assert.ok(foundArtifact, 'findById should retrieve created artifact');
  assert.strictEqual(foundArtifact?.desc, 'Description for m4 test artifact 1');

  const allArtifacts = await artifactRepository.findAll();
  assert.ok(Array.isArray(allArtifacts), 'findAll should return array');

  // Test search
  const searchResults = await artifactRepository.searchArtifacts('abstract');
  assert.ok(searchResults.some(a => a.id === artifactId), 'searchArtifacts should find by tag');

  // Test like & unlike
  const likedArtifact = await artifactRepository.likeArtifact(artifactId, testUserMongoId);
  assert.ok(likedArtifact?.like?.some((u: any) => u.toString() === testUserMongoId), 'User should be added to likes');

  const unlikedArtifact = await artifactRepository.unlikeArtifact(artifactId, testUserMongoId);
  assert.ok(!unlikedArtifact?.like?.some((u: any) => u.toString() === testUserMongoId), 'User should be removed from likes');

  // Test 1.2: Service upload (base64 & path) & error handling
  console.log('Test 1.2: Artifact Service Upload & Methods...');
  const base64Img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const uploadedArtifact = await artifactService.uploadArtifact({
    title: 'm4_test_artifact_2',
    desc: 'Base64 artifact desc',
    img: base64Img,
    tags: ['b64', 'm4_test'],
  });
  assert.ok(uploadedArtifact, 'uploadArtifact with base64 should succeed');
  assert.strictEqual(uploadedArtifact.title, 'm4_test_artifact_2');
  assert.ok(Buffer.isBuffer(uploadedArtifact.img) || typeof uploadedArtifact.img === 'string', 'Image converted to buffer/string');

  // Test upload validation failure
  let uploadErr = false;
  try {
    await artifactService.uploadArtifact({ title: 'No img', desc: 'desc' });
  } catch (err: any) {
    uploadErr = true;
    assert.strictEqual(err.message, 'Invalid input. All fields are required and cannot be empty.');
  }
  assert.ok(uploadErr, 'Should throw error when img missing');

  // Test 1.3: Artifact Controller
  console.log('Test 1.3: Artifact Controller Handlers...');
  const { req: reqGet, res: resGet } = mockReqRes({ params: { id: artifactId } });
  await artifactController.getArtifactById(reqGet, resGet);
  assert.strictEqual(resGet.getStatus(), 200);
  assert.strictEqual(resGet.getJson().title, 'm4_test_artifact_1');

  const { req: reqLike, res: resLike } = mockReqRes({ params: { id: artifactId }, body: { userId: testUserMongoId } });
  await artifactController.likeArtifact(reqLike, resLike);
  assert.strictEqual(resLike.getStatus(), 200);

  const { req: reqDel, res: resDel } = mockReqRes({ params: { id: artifactId } });
  await artifactController.deleteArtifact(reqDel, resDel);
  assert.strictEqual(resDel.getStatus(), 200);
  assert.strictEqual(resDel.getJson().message, 'Artifact deleted successfully');

  console.log('  PASSED: All Artifact Entity Tests!');

  // ==========================================
  // ENTITY 2: COMMUNITY TESTS
  // ==========================================
  console.log('\n--- 2. Testing Community Entity (MVC) ---');
  
  // Test 2.1: Community Repository
  console.log('Test 2.1: Community Repository CRUD...');
  const communityId = uuidv4();
  const commObj = await communityRepository.createCommunity({
    id: communityId,
    name: 'm4_test_community_1',
    description: 'Test community description',
    img: '/profiles/profile1.png',
    members: [],
  });
  assert.ok(commObj, 'Community should be created');
  assert.strictEqual(commObj.name, 'm4_test_community_1');

  const foundComm = await communityRepository.findById(communityId);
  assert.ok(foundComm, 'findById should retrieve created community');

  // Test join community
  const joinResult = await communityRepository.joinCommunity(communityId, testUserMongoId);
  assert.strictEqual(joinResult.status, 'ok');
  assert.ok(joinResult.community?.members?.some((m: any) => m.toString() === testUserMongoId), 'User should be joined');

  // Test duplicate join
  const dupJoin = await communityRepository.joinCommunity(communityId, testUserMongoId);
  assert.strictEqual(dupJoin.status, 'already_joined');

  // Test leave community
  const leftComm = await communityRepository.leaveCommunity(communityId, testUserMongoId);
  assert.ok(!leftComm?.members?.some((m: any) => m.toString() === testUserMongoId), 'User should be removed from community');

  // Test 2.2: Community Service
  console.log('Test 2.2: Community Service Logic...');
  const commSvcObj = await communityService.createCommunity({
    name: 'm4_test_community_2',
    description: 'Service level community',
  });
  assert.ok(commSvcObj, 'Service create community should succeed');

  let commErr = false;
  try {
    await communityService.createCommunity({ name: '' });
  } catch (err: any) {
    commErr = true;
    assert.strictEqual(err.message, 'Fields cannot be empty');
  }
  assert.ok(commErr, 'Should throw error when name/desc empty');

  // Test 2.3: Community Controller
  console.log('Test 2.3: Community Controller Handlers...');
  const { req: reqCommGet, res: resCommGet } = mockReqRes({ params: { id: communityId } });
  await communityController.getCommunityById(reqCommGet, resCommGet);
  assert.strictEqual(resCommGet.getStatus(), 200);

  const { req: reqCommJoin, res: resCommJoin } = mockReqRes({ params: { id: communityId }, body: { member: testUserMongoId } });
  await communityController.joinCommunity(reqCommJoin, resCommJoin);
  assert.strictEqual(resCommJoin.getStatus(), 200);

  const { req: reqCommDel, res: resCommDel } = mockReqRes({ params: { id: communityId } });
  await communityController.deleteCommunity(reqCommDel, resCommDel);
  assert.strictEqual(resCommDel.getStatus(), 200);

  console.log('  PASSED: All Community Entity Tests!');

  // ==========================================
  // ENTITY 3: FEEDBACK TESTS
  // ==========================================
  console.log('\n--- 3. Testing Feedback Entity (MVC) ---');
  
  // Test 3.1: Feedback Repository & Service
  console.log('Test 3.1: Feedback Repository & Service CRUD...');
  const fbId = uuidv4();
  const feedbackObj = await feedbackRepository.createFeedback({
    id: fbId,
    name: 'M4 Tester',
    email: 'm4_test_feedback@m4test.com',
    subject: 'Bug report test',
    description: 'Detail of feedback bug',
  });
  assert.ok(feedbackObj, 'Feedback created');
  assert.strictEqual(feedbackObj.email, 'm4_test_feedback@m4test.com');

  const foundFb = await feedbackService.getFeedbackById(fbId);
  assert.ok(foundFb, 'Feedback found by ID');

  const allFeedback = await feedbackService.getAllFeedback();
  assert.ok(Array.isArray(allFeedback), 'getAllFeedback should return array');

  // Test validation error in service
  let fbErr = false;
  try {
    await feedbackService.createFeedback({ name: 'Test' });
  } catch (err: any) {
    fbErr = true;
    assert.strictEqual(err.message, 'Fields cannot be empty');
  }
  assert.ok(fbErr, 'Validation error for missing email/subject');

  // Test 3.2: Feedback Controller
  console.log('Test 3.2: Feedback Controller Handlers...');
  const { req: reqFbPost, res: resFbPost } = mockReqRes({
    body: { name: 'Controller User', email: 'm4_test_fb2@m4test.com', subject: 'Inquiry', description: 'Hello' }
  });
  await feedbackController.createFeedback(reqFbPost, resFbPost);
  assert.strictEqual(resFbPost.getStatus(), 200);
  assert.strictEqual(resFbPost.getJson().email, 'm4_test_fb2@m4test.com');

  const { req: reqFbDel, res: resFbDel } = mockReqRes({ params: { id: fbId } });
  await feedbackController.deleteFeedback(reqFbDel, resFbDel);
  assert.strictEqual(resFbDel.getStatus(), 200);

  console.log('  PASSED: All Feedback Entity Tests!');

  // ==========================================
  // ENTITY 4: IMAGE TESTS
  // ==========================================
  console.log('\n--- 4. Testing Image Entity (MVC) ---');

  // Test 4.1: Image Repository
  console.log('Test 4.1: Image Repository CRUD...');
  const imgId = uuidv4();
  const imageObj = await imageRepository.createImage({
    id: imgId,
    img: Buffer.from('test_image_data'),
    contentType: 'image/png',
    userid: testUserId,
    prompt: 'm4_test prompt vibrant landscape',
  });
  assert.ok(imageObj, 'Image should be created');
  assert.strictEqual(imageObj.userid, testUserId);

  const foundImg = await imageRepository.findById(imgId);
  assert.ok(foundImg, 'findById should retrieve created image');

  const userImages = await imageRepository.findByUserId(testUserId);
  assert.ok(userImages.some(i => i.id === imgId), 'findByUserId should return user images');

  // Test 4.2: Image Service generateImage
  console.log('Test 4.2: Image Service generateImage...');
  // Ensure valid user ID is passed
  const genUserId = testUser ? (testUser.id || testUser._id.toString()) : testUserId;
  
  if (!isConnected) {
    // Inject mock user check if DB is offline
    userRepository.findById = async (id: string) => ({ id, email: 'test@m4test.com' } as any);
  }

  const generatedResult = await imageService.generateImage({
    userid: genUserId,
    prompt: 'm4_test futuristic city sunset',
  });
  assert.ok(generatedResult, 'generateImage should return result doc with token');
  assert.ok(generatedResult.token, 'generateImage should attach token to response');

  // Test unauthorized user error
  let genErr = false;
  try {
    await imageService.generateImage({ userid: 'nonexistent_user_99999', prompt: 'test' });
  } catch (err: any) {
    genErr = true;
    assert.strictEqual(err.message, 'unauthorized access. Please sign in to access this feature');
  }
  assert.ok(genErr, 'Should throw unauthorized access for invalid user');

  // Test 4.3: Image Controller
  console.log('Test 4.3: Image Controller Handlers...');
  const { req: reqImgGen, res: resImgGen } = mockReqRes({
    body: { userid: genUserId, prompt: 'm4_test neon cyberpunk' }
  });
  await imageController.generateImage(reqImgGen, resImgGen);
  assert.strictEqual(resImgGen.getStatus(), 200);

  const { req: reqImgDel, res: resImgDel } = mockReqRes({ params: { id: imgId } });
  await imageController.deleteImage(reqImgDel, resImgDel);
  assert.strictEqual(resImgDel.getStatus(), 200);

  console.log('  PASSED: All Image Entity Tests!');

  // ==========================================
  // ENTITY 5: NEWSLETTER TESTS
  // ==========================================
  console.log('\n--- 5. Testing Newsletter Entity (MVC) ---');

  // Test 5.1: Newsletter Repository & Service
  console.log('Test 5.1: Newsletter Repository & Service CRUD...');
  const nlId = uuidv4();
  const newsletterObj = await newsletterRepository.createNewsletter({
    id: nlId,
    title: 'm4_test Newsletter Edition 1',
    desc: 'Weekly updates on digital art trends',
  });
  assert.ok(newsletterObj, 'Newsletter created');
  assert.strictEqual(newsletterObj.title, 'm4_test Newsletter Edition 1');

  const foundNl = await newsletterService.getNewsletterById(nlId);
  assert.ok(foundNl, 'Newsletter found by ID');

  const allNewsletters = await newsletterService.getAllNewsletters();
  assert.ok(Array.isArray(allNewsletters), 'getAllNewsletters should return array');

  // Test 5.2: Newsletter Controller Handlers
  console.log('Test 5.2: Newsletter Controller Handlers...');
  const { req: reqNlPost, res: resNlPost } = mockReqRes({
    body: { title: 'm4_test Edition 2', desc: 'Special feature issue' }
  });
  await newsletterController.subscribeNewsletter(reqNlPost, resNlPost);
  assert.strictEqual(resNlPost.getStatus(), 200);
  assert.strictEqual(resNlPost.getJson().title, 'm4_test Edition 2');

  // Test missing fields validation
  const { req: reqNlBad, res: resNlBad } = mockReqRes({ body: { title: '' } });
  await newsletterController.subscribeNewsletter(reqNlBad, resNlBad);
  assert.strictEqual(resNlBad.getStatus(), 400);

  const { req: reqNlDel, res: resNlDel } = mockReqRes({ params: { id: nlId } });
  await newsletterController.deleteNewsletter(reqNlDel, resNlDel);
  assert.strictEqual(resNlDel.getStatus(), 200);

  console.log('  PASSED: All Newsletter Entity Tests!');

  // Clean up test data
  if (isConnected) {
    await Artifact.deleteMany({ title: /m4_test/i });
    await Community.deleteMany({ name: /m4_test/i });
    await Feedback.deleteMany({ email: /m4_test/i });
    await Image.deleteMany({ prompt: /m4_test/i });
    await Newsletter.deleteMany({ title: /m4_test/i });
    await User.deleteMany({ email: /m4_test/i });
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }

  console.log('\n=== ALL M4 UNIT & INTEGRATION TESTS PASSED SUCCESSFULLY ===');
}

runM4Tests().catch((err) => {
  console.error('M4 Test failed:', err);
  process.exit(1);
});
