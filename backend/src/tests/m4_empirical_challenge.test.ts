import http from 'http';
import assert from 'assert';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import app from '../app';

import Artifact from '../models/Artifact';
import Community from '../models/Community';
import Feedback from '../models/Feedback';
import Image from '../models/Image';
import Newsletter from '../models/Newsletter';
import User from '../models/User';
import userRepository from '../repository/userRepository';

dotenv.config();

let server: http.Server;
let baseUrl: string;

const findings: string[] = [];

async function startServer(): Promise<string> {
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      const address = server.address() as { port: number };
      const url = `http://127.0.0.1:${address.port}`;
      resolve(url);
    });
  });
}

async function closeServer(): Promise<void> {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => resolve());
    } else {
      resolve();
    }
  });
}

async function runEmpiricalChallenge() {
  console.log('================================================================');
  console.log('=== STARTING EMPIRICAL CHALLENGE FOR MILESTONE 4 (M4) API ===');
  console.log('================================================================');

  const mongoUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI || 'mongodb://localhost:27017/artcorner_test';
  let isConnected = false;

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log('[Setup] Connected to MongoDB.');
    isConnected = true;

    await Artifact.deleteMany({ title: /m4_emp_/i });
    await Community.deleteMany({ name: /m4_emp_/i });
    await Feedback.deleteMany({ email: /m4_emp_/i });
    await Image.deleteMany({ prompt: /m4_emp_/i });
    await Newsletter.deleteMany({ title: /m4_emp_/i });
    await User.deleteMany({ email: /m4_emp_/i });
  } catch (err: any) {
    console.log('[Setup] MongoDB offline/skipped. Empirical tests running with server context.');
  }

  baseUrl = await startServer();
  console.log(`[Setup] Express server listening at ${baseUrl}`);

  // Create test user
  const testUserId = uuidv4();
  const testUserMongoId = new mongoose.Types.ObjectId().toString();
  let createdUser: any = null;

  if (isConnected) {
    createdUser = await userRepository.createUser({
      id: testUserId,
      username: `m4_emp_user_${Date.now()}`,
      email: `m4_emp_${Date.now()}@test.com`,
      password: 'Password@123',
    });
  }

  const validUserId = createdUser ? (createdUser.id || createdUser._id.toString()) : testUserId;
  const mongoUserId = createdUser ? createdUser._id.toString() : testUserMongoId;

  // -----------------------------------------------------------------
  // 1. ARTIFACT API ROUTE VERIFICATION
  // -----------------------------------------------------------------
  console.log('\n--- [1/5] Testing Artifact API Routes & Schemas ---');
  
  try {
    // 1a. GET /api/artifacts
    const resGetAllArt = await fetch(`${baseUrl}/api/artifacts`);
    assert.strictEqual(resGetAllArt.status, 200, 'GET /api/artifacts should return 200');
    const allArtBody: any = (await resGetAllArt.json()) as any;
    assert.ok(Array.isArray(allArtBody), 'GET /api/artifacts response must be array');

    // 1b. POST /api/artifacts/upload - String Image Path (Legacy/Static)
    const resUploadStringArt = await fetch(`${baseUrl}/api/artifacts/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'm4_emp_artifact_string',
        desc: 'String image artifact',
        img: '/img/img1.png',
        tags: ['m4', 'string'],
      }),
    });
    assert.strictEqual(resUploadStringArt.status, 201, 'POST string image upload should return 201');
    const stringArt: any = (await resUploadStringArt.json()) as any;

    // Like string image artifact
    const resLikeStringArt = await fetch(`${baseUrl}/api/artifacts/${stringArt.id}/like`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: mongoUserId }),
    });
    assert.strictEqual(resLikeStringArt.status, 200, 'Liking string image artifact should return 200');

    // 1c. POST /api/artifacts/upload - Base64/Buffer Image
    const base64Img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const resUploadArt = await fetch(`${baseUrl}/api/artifacts/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'm4_emp_artifact_buffer',
        desc: 'Empirical Artifact Description',
        img: base64Img,
        tags: ['m4', 'empirical', 'buffer'],
      }),
    });
    assert.strictEqual(resUploadArt.status, 201, 'POST /api/artifacts/upload should return 201 Created');
    const uploadedArt: any = (await resUploadArt.json()) as any;
    assert.ok(uploadedArt.id, 'Uploaded artifact must have id');
    const artId = uploadedArt.id;

    // 1d. POST /api/artifacts/upload - Invalid (missing title)
    const resBadArt = await fetch(`${baseUrl}/api/artifacts/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ desc: 'No title' }),
    });
    assert.strictEqual(resBadArt.status, 400, 'Missing title/img must return 400 Bad Request');

    // 1e. GET /api/artifacts/:id
    const resGetArtById = await fetch(`${baseUrl}/api/artifacts/${artId}`);
    assert.strictEqual(resGetArtById.status, 200, 'GET /api/artifacts/:id should return 200');

    // 1f. GET /api/artifacts/:id - Not Found
    const resArtNotFound = await fetch(`${baseUrl}/api/artifacts/nonexistent-id-9999`);
    assert.strictEqual(resArtNotFound.status, 404, 'Non-existent artifact id must return 404');

    // 1g. GET /api/artifacts/search/:query
    const resSearchArt = await fetch(`${baseUrl}/api/artifacts/search/empirical`);
    assert.strictEqual(resSearchArt.status, 200, 'Search route should return 200');

    // 1h. PATCH /api/artifacts/:id/like on Binary/Buffer Artifact
    const resLikeArt = await fetch(`${baseUrl}/api/artifacts/${artId}/like`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: mongoUserId }),
    });
    const likeBody: any = (await resLikeArt.json()) as any;
    if (resLikeArt.status !== 200) {
      findings.push(`[BUG DETECTED] PATCH /api/artifacts/:id/like failed with HTTP ${resLikeArt.status}: ${JSON.stringify(likeBody)}`);
      console.log(`[BUG DETECTED] Liking binary artifact failed: ${JSON.stringify(likeBody)}`);
    } else {
      console.log('Like binary artifact returned 200');
    }

    // 1i. PATCH /api/artifacts/:id/unlike on Binary/Buffer Artifact
    const resUnlikeArt = await fetch(`${baseUrl}/api/artifacts/${artId}/unlike`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: mongoUserId }),
    });
    const unlikeBody: any = (await resUnlikeArt.json()) as any;
    if (resUnlikeArt.status !== 200) {
      findings.push(`[BUG DETECTED] PATCH /api/artifacts/:id/unlike failed with HTTP ${resUnlikeArt.status}: ${JSON.stringify(unlikeBody)}`);
    }

    // 1j. DELETE /api/artifacts/:id
    const resDelArt = await fetch(`${baseUrl}/api/artifacts/${artId}`, {
      method: 'DELETE',
    });
    assert.strictEqual(resDelArt.status, 200, 'Delete artifact should return 200');

    console.log('Artifact API Routes section complete.');
  } catch (err: any) {
    const errorMsg = (err as any)?.message || String(err);
    console.error('Artifact tests encountered exception:', errorMsg);
    findings.push(`[EXCEPTIONAL FAILURE] Artifact suite exception: ${errorMsg}`);
  }

  // -----------------------------------------------------------------
  // 2. COMMUNITY API ROUTE VERIFICATION
  // -----------------------------------------------------------------
  console.log('\n--- [2/5] Testing Community API Routes & Handlers ---');
  try {
    // 2a. GET /api/communities & /api/community
    const resGetAllComm = await fetch(`${baseUrl}/api/communities`);
    assert.strictEqual(resGetAllComm.status, 200, 'GET /api/communities should return 200');

    // 2b. POST /api/communities/create - Valid
    const resCreateComm = await fetch(`${baseUrl}/api/communities/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'm4_emp_community_1',
        description: 'Empirical testing community for M4',
      }),
    });
    assert.strictEqual(resCreateComm.status, 200, 'POST /api/communities/create should return 200');
    const createdComm: any = (await resCreateComm.json()) as any;
    assert.ok(createdComm.id, 'Community must have id');
    const commId = createdComm.id;

    // 2c. POST /api/communities/create - Empty fields
    const resBadComm = await fetch(`${baseUrl}/api/communities/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '' }),
    });
    assert.strictEqual(resBadComm.status, 400, 'Empty community payload must return 400');

    // 2d. GET /api/communities/:id
    const resGetComm = await fetch(`${baseUrl}/api/communities/${commId}`);
    assert.strictEqual(resGetComm.status, 200, 'GET /api/communities/:id should return 200');

    // 2e. GET /api/communities/:id - Not Found
    const resCommNotFound = await fetch(`${baseUrl}/api/communities/nonexistent-comm-123`);
    assert.strictEqual(resCommNotFound.status, 400, 'Nonexistent community id should return 400 with message Community not exist.');

    // 2f. PATCH /api/communities/:id/join - Success
    const resJoinComm = await fetch(`${baseUrl}/api/communities/${commId}/join`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member: testUserMongoId }),
    });
    assert.strictEqual(resJoinComm.status, 200, 'Join community should return 200');

    // 2g. PATCH /api/communities/:id/join - Already Joined
    const resDupJoin = await fetch(`${baseUrl}/api/communities/${commId}/join`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member: testUserMongoId }),
    });
    assert.strictEqual(resDupJoin.status, 403, 'Duplicate join must return 403 Forbidden');

    // 2h. PATCH /api/communities/:id/leave - Success
    const resLeaveComm = await fetch(`${baseUrl}/api/communities/${commId}/leave`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member: testUserMongoId }),
    });
    assert.strictEqual(resLeaveComm.status, 200, 'Leave community should return 200');

    // 2i. DELETE /api/communities/:id
    const resDelComm = await fetch(`${baseUrl}/api/communities/${commId}`, {
      method: 'DELETE',
    });
    assert.strictEqual(resDelComm.status, 200, 'Delete community should return 200');

    // 2j. DELETE /api/communities/:id - Not Found
    const resDelCommNotFound = await fetch(`${baseUrl}/api/communities/${commId}`, {
      method: 'DELETE',
    });
    assert.strictEqual(resDelCommNotFound.status, 404, 'Deleting non-existent community must return 404');

    console.log('Community API Routes section complete.');
  } catch (err: any) {
    const errorMsg = (err as any)?.message || String(err);
    console.error('Community tests encountered exception:', errorMsg);
    findings.push(`[EXCEPTIONAL FAILURE] Community suite exception: ${errorMsg}`);
  }

  // -----------------------------------------------------------------
  // 3. FEEDBACK API ROUTE VERIFICATION
  // -----------------------------------------------------------------
  console.log('\n--- [3/5] Testing Feedback API Routes & Validation ---');
  try {
    // 3a. GET /api/feedback & /api/feedbacks
    const resGetFb = await fetch(`${baseUrl}/api/feedback`);
    assert.strictEqual(resGetFb.status, 200, 'GET /api/feedback should return 200');

    // 3b. POST /api/feedback - Valid
    const resCreateFb = await fetch(`${baseUrl}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Empirical Tester',
        email: 'm4_emp_feedback@test.com',
        subject: 'Empirical verification subject',
        description: 'Detailed user feedback body',
      }),
    });
    assert.strictEqual(resCreateFb.status, 200, 'POST /api/feedback should return 200');
    const createdFb: any = (await resCreateFb.json()) as any;
    assert.ok(createdFb.id, 'Feedback must have id');
    const fbId = createdFb.id;

    // 3c. POST /api/feedback - Invalid (missing email)
    const resBadFb = await fetch(`${baseUrl}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Tester', subject: 'No email' }),
    });
    assert.strictEqual(resBadFb.status, 400, 'Missing email in feedback must return 400');

    // 3d. DELETE /api/feedback/:id - Valid
    const resDelFb = await fetch(`${baseUrl}/api/feedback/${fbId}`, {
      method: 'DELETE',
    });
    assert.strictEqual(resDelFb.status, 200, 'DELETE /api/feedback/:id should return 200');

    // 3e. DELETE /api/feedback/:id - Not Found
    const resDelFbNotFound = await fetch(`${baseUrl}/api/feedback/nonexistent-fb-99`, {
      method: 'DELETE',
    });
    assert.strictEqual(resDelFbNotFound.status, 404, 'Deleting non-existent feedback must return 404');

    console.log('Feedback API Routes section complete.');
  } catch (err: any) {
    const errorMsg = (err as any)?.message || String(err);
    console.error('Feedback tests encountered exception:', errorMsg);
    findings.push(`[EXCEPTIONAL FAILURE] Feedback suite exception: ${errorMsg}`);
  }

  // -----------------------------------------------------------------
  // 4. IMAGE API ROUTE VERIFICATION
  // -----------------------------------------------------------------
  console.log('\n--- [4/5] Testing Image API Routes & AI Generation Flow ---');
  try {
    // 4a. GET /api/image & /api/images
    const resGetAllImg = await fetch(`${baseUrl}/api/image`);
    assert.strictEqual(resGetAllImg.status, 200, 'GET /api/image should return 200');

    // 4b. POST /api/image/generate - Valid User
    const resGenImg = await fetch(`${baseUrl}/api/image/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userid: validUserId,
        prompt: 'm4_emp_ prompt futuristic galaxy art',
      }),
    });
    assert.strictEqual(resGenImg.status, 200, 'POST /api/image/generate should return 200');
    const genBody: any = (await resGenImg.json()) as any;
    assert.ok(genBody.token || genBody.id, 'Image response should contain token or image id');
    const imgId = genBody.id || genBody._id;

    // 4c. POST /api/image/generate - Unauthorized User
    const resUnauthGen = await fetch(`${baseUrl}/api/image/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userid: 'invalid_user_id_000',
        prompt: 'test prompt',
      }),
    });
    assert.strictEqual(resUnauthGen.status, 403, 'Unauthorized generate request must return 403');

    // 4d. POST /api/image/generate - Missing Input
    const resEmptyGen = await fetch(`${baseUrl}/api/image/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'no user id' }),
    });
    assert.strictEqual(resEmptyGen.status, 400, 'Missing userid must return 400');

    // 4e. GET /api/image/:id
    if (imgId) {
      const resGetImgById = await fetch(`${baseUrl}/api/image/${imgId}`);
      assert.strictEqual(resGetImgById.status, 200, 'GET /api/image/:id should return 200');
    }

    // 4f. GET /api/image/:id - Not Found
    const resImgNotFound = await fetch(`${baseUrl}/api/image/nonexistent-img-999`);
    assert.strictEqual(resImgNotFound.status, 404, 'Non-existent image id must return 404');

    // 4g. DELETE /api/image/:id
    if (imgId) {
      const resDelImg = await fetch(`${baseUrl}/api/image/${imgId}`, {
        method: 'DELETE',
      });
      assert.strictEqual(resDelImg.status, 200, 'DELETE /api/image/:id should return 200');
    }

    console.log('Image API Routes section complete.');
  } catch (err: any) {
    const errorMsg = (err as any)?.message || String(err);
    console.error('Image tests encountered exception:', errorMsg);
    findings.push(`[EXCEPTIONAL FAILURE] Image suite exception: ${errorMsg}`);
  }

  // -----------------------------------------------------------------
  // 5. NEWSLETTER API ROUTE VERIFICATION
  // -----------------------------------------------------------------
  console.log('\n--- [5/5] Testing Newsletter API Routes & Handlers ---');
  try {
    // 5a. GET /api/newsletter & /api/newsletters
    const resGetNl = await fetch(`${baseUrl}/api/newsletter`);
    assert.strictEqual(resGetNl.status, 200, 'GET /api/newsletter should return 200');

    // 5b. POST /api/newsletter - Valid
    const resSubNl = await fetch(`${baseUrl}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'm4_emp_ Newsletter Issue 10',
        desc: 'Empirical verification newsletter content description',
      }),
    });
    assert.strictEqual(resSubNl.status, 200, 'POST /api/newsletter should return 200');
    const createdNl: any = (await resSubNl.json()) as any;
    assert.ok(createdNl.id, 'Newsletter response must include id');
    const nlId = createdNl.id;

    // 5c. POST /api/newsletter - Missing fields
    const resBadNl = await fetch(`${baseUrl}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Title only' }),
    });
    assert.strictEqual(resBadNl.status, 400, 'Missing desc must return 400');

    // 5d. DELETE /api/newsletter/:id
    const resDelNl = await fetch(`${baseUrl}/api/newsletter/${nlId}`, {
      method: 'DELETE',
    });
    assert.strictEqual(resDelNl.status, 200, 'DELETE /api/newsletter/:id should return 200');

    // 5e. DELETE /api/newsletter/:id - Not Found
    const resDelNlNotFound = await fetch(`${baseUrl}/api/newsletter/nonexistent-nl-11`, {
      method: 'DELETE',
    });
    assert.strictEqual(resDelNlNotFound.status, 404, 'Deleting non-existent newsletter must return 404');

    console.log('Newsletter API Routes section complete.');
  } catch (err: any) {
    const errorMsg = (err as any)?.message || String(err);
    console.error('Newsletter tests encountered exception:', errorMsg);
    findings.push(`[EXCEPTIONAL FAILURE] Newsletter suite exception: ${errorMsg}`);
  }

  // Cleanup
  if (isConnected) {
    await Artifact.deleteMany({ title: /m4_emp_/i });
    await Community.deleteMany({ name: /m4_emp_/i });
    await Feedback.deleteMany({ email: /m4_emp_/i });
    await Image.deleteMany({ prompt: /m4_emp_/i });
    await Newsletter.deleteMany({ title: /m4_emp_/i });
    await User.deleteMany({ email: /m4_emp_/i });
    await mongoose.disconnect();
    console.log('[Cleanup] Cleaned empirical test data and disconnected from MongoDB.');
  }

  await closeServer();

  console.log('\n================================================================');
  console.log(`=== EMPIRICAL CHALLENGE COMPLETED WITH ${findings.length} BUG(S) FOUND ===`);
  console.log('================================================================');
  if (findings.length > 0) {
    console.log('Findings summary:');
    findings.forEach((f, i) => console.log(`${i + 1}. ${f}`));
    process.exit(1);
  } else {
    console.log('ALL EMPIRICAL TESTS PASSED CLEANLY WITH NO BUGS FOUND!');
    process.exit(0);
  }
}

runEmpiricalChallenge().catch(async (err: any) => {
  console.error('Empirical challenge execution failed:', err);
  await closeServer();
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  process.exit(1);
});
