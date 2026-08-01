import mongoose from 'mongoose';
import assert from 'assert';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import userService from '../services/userService';
import userRepository from '../repository/userRepository';
import User from '../models/User';
import { verifyToken } from '../utils/jwt';

dotenv.config();

async function runEmpiricalChallenge() {
  console.log('=== Empirical Verification & Stress Test for Milestone 3 ===');

  const mongoUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI || 'mongodb://localhost:27017/artcorner_test';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB.');

  // Clean up any test users from prior runs
  await User.deleteMany({ email: /@m3emp\.com$/i });

  const testEmail = `signup_${Date.now()}@m3emp.com`;
  const testUsername = `user_${Date.now()}`;
  const testPassword = 'Password123!';

  // 1. SIGNUP: verify returns valid 24h JWT
  console.log('\n[Empirical Check 1] Signup returns valid 24h JWT...');
  const signupRes = await userService.signup({
    username: testUsername,
    email: testEmail,
    password: testPassword,
  });

  assert.ok(signupRes.token, 'Signup must return token');
  const decodedSignupToken: any = verifyToken(signupRes.token);
  assert.strictEqual(decodedSignupToken.email, testEmail);
  assert.strictEqual(decodedSignupToken.username, testUsername);
  const signupExpirySec = decodedSignupToken.exp - decodedSignupToken.iat;
  assert.strictEqual(signupExpirySec, 86400, `Signup JWT expiry should be 24h (86400s), got ${signupExpirySec}`);
  console.log(`  PASSED: Signup token valid, exp - iat = ${signupExpirySec}s (24h)`);

  // 2. LOGIN: verify returns valid 24h JWT
  console.log('\n[Empirical Check 2] Login returns valid 24h JWT...');
  const loginRes = await userService.login({
    email: testEmail,
    password: testPassword,
  });

  assert.ok(loginRes.token, 'Login must return token');
  const decodedLoginToken: any = verifyToken(loginRes.token);
  assert.strictEqual(decodedLoginToken.email, testEmail);
  assert.strictEqual(decodedLoginToken.username, testUsername);
  const loginExpirySec = decodedLoginToken.exp - decodedLoginToken.iat;
  assert.strictEqual(loginExpirySec, 86400, `Login JWT expiry should be 24h (86400s), got ${loginExpirySec}`);
  console.log(`  PASSED: Login token valid, exp - iat = ${loginExpirySec}s (24h)`);

  // 3. GOOGLE LOGIN: verify ID token decoding, user upserting, and valid 24h JWT return
  console.log('\n[Empirical Check 3] Google Login verifies ID token, upserts user, returns 24h JWT...');
  const googleEmail = `google_${Date.now()}@m3emp.com`;
  const mockIdTokenPayload = {
    email: googleEmail,
    name: 'Empirical Google User',
    picture: 'https://example.com/emp.jpg',
    sub: 'google-sub-empirical-777',
  };
  const mockIdToken = 'mock-' + JSON.stringify(mockIdTokenPayload);

  // Initial Google Login (User Creation)
  const gLoginRes1 = await userService.googleLogin(mockIdToken);
  assert.ok(gLoginRes1.token, 'Google Login must return token');
  const decodedGToken1: any = verifyToken(gLoginRes1.token);
  assert.strictEqual(decodedGToken1.email, googleEmail);
  const gExpirySec1 = decodedGToken1.exp - decodedGToken1.iat;
  assert.strictEqual(gExpirySec1, 86400, `Google Login JWT expiry should be 24h (86400s), got ${gExpirySec1}`);

  // Confirm DB User creation
  const dbUser1 = await userRepository.findByEmail(googleEmail);
  assert.ok(dbUser1, 'Google user must be created in DB');
  assert.strictEqual(dbUser1?.email, googleEmail);
  assert.strictEqual(dbUser1?.isVerified, true);
  assert.strictEqual(dbUser1?.img, 'https://example.com/emp.jpg');
  console.log('  PASSED: Google Login initial user creation & 24h JWT token check');

  // Second Google Login with updated picture/name (User Upsert)
  const mockIdTokenPayload2 = {
    email: googleEmail,
    name: 'Empirical Google User Updated',
    picture: 'https://example.com/emp_updated.jpg',
    sub: 'google-sub-empirical-777',
  };
  const mockIdToken2 = 'mock-' + JSON.stringify(mockIdTokenPayload2);

  const gLoginRes2 = await userService.googleLogin(mockIdToken2);
  assert.ok(gLoginRes2.token, 'Google Login update must return token');
  const decodedGToken2: any = verifyToken(gLoginRes2.token);
  assert.strictEqual(decodedGToken2.email, googleEmail);
  const gExpirySec2 = decodedGToken2.exp - decodedGToken2.iat;
  assert.strictEqual(gExpirySec2, 86400, `Updated Google Login JWT expiry should be 24h (86400s), got ${gExpirySec2}`);

  // Confirm DB User update (upsert)
  const dbUser2 = await userRepository.findByEmail(googleEmail);
  assert.ok(dbUser2, 'Google user must exist in DB');
  assert.strictEqual(dbUser2?.img, 'https://example.com/emp_updated.jpg');
  console.log('  PASSED: Google Login upsert update & 24h JWT token check');

  // Cleanup
  await User.deleteMany({ email: /@m3emp\.com$/i });
  await mongoose.disconnect();
  console.log('\n=== EMPIRICAL CHALLENGE VERIFICATION PASSED SUCCESSFULLY ===');
}

runEmpiricalChallenge().catch((err) => {
  console.error('Empirical Challenge Failed:', err);
  process.exit(1);
});
