import assert from 'assert';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { generateToken, verifyToken } from '../utils/jwt';
import { authMiddleware } from '../middleware/authMiddleware';
import { AuthRequest } from '../types';

dotenv.config();

async function runTests() {
  console.log('--- Running M2 Unit & Integration Tests ---');

  // Test 1: JWT generateToken and verifyToken
  console.log('Test 1: JWT token generation and verification...');
  const payload = { userId: '12345', email: 'test@example.com', isAdmin: false };
  const token = generateToken(payload);
  assert.ok(token && typeof token === 'string', 'generateToken should return a string');

  const decoded = verifyToken(token) as any;
  assert.strictEqual(decoded.userId, '12345');
  assert.strictEqual(decoded.email, 'test@example.com');
  assert.strictEqual(decoded.isAdmin, false);
  console.log('  PASSED: JWT generate and verify token');

  // Test 2: JWT token verification error handling
  console.log('Test 2: JWT invalid token handling...');
  assert.throws(() => {
    verifyToken('invalid.jwt.token');
  }, 'verifyToken should throw for invalid token');
  console.log('  PASSED: JWT invalid token error handling');

  // Test 3: authMiddleware with missing header
  console.log('Test 3: authMiddleware - missing authorization header...');
  let statusSet = 0;
  let jsonOutput: any = null;
  let nextCalled = false;

  const reqMissing = { headers: {} } as any;
  const resMissing = {
    status: (s: number) => {
      statusSet = s;
      return {
        json: (data: any) => {
          jsonOutput = data;
        },
      };
    },
  } as any;
  const nextMissing = () => {
    nextCalled = true;
  };

  authMiddleware(reqMissing, resMissing, nextMissing);
  assert.strictEqual(statusSet, 401, 'Should return HTTP 401');
  assert.strictEqual(jsonOutput?.message, 'Unauthorized: Missing, invalid or expired token');
  assert.strictEqual(nextCalled, false, 'next() should not be called');
  console.log('  PASSED: authMiddleware missing header');

  // Test 4: authMiddleware with invalid scheme header
  console.log('Test 4: authMiddleware - invalid token format...');
  statusSet = 0;
  jsonOutput = null;
  nextCalled = false;

  const reqInvalid = { headers: { authorization: 'Basic 12345' } } as any;
  authMiddleware(reqInvalid, resMissing, nextMissing);
  assert.strictEqual(statusSet, 401);
  assert.strictEqual(jsonOutput?.message, 'Unauthorized: Missing, invalid or expired token');
  assert.strictEqual(nextCalled, false);
  console.log('  PASSED: authMiddleware invalid format');

  // Test 5: authMiddleware with valid token
  console.log('Test 5: authMiddleware - valid token...');
  statusSet = 0;
  jsonOutput = null;
  nextCalled = false;

  const validReq = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
  authMiddleware(validReq as any, resMissing, nextMissing);
  assert.strictEqual(nextCalled, true, 'next() should be called');
  assert.ok(validReq.user, 'req.user should be defined');
  assert.strictEqual((validReq.user as any).email, 'test@example.com');
  console.log('  PASSED: authMiddleware valid token');

  // Test 6: Bcrypt password hashing check (used in seedAdmin)
  console.log('Test 6: Bcrypt hashing...');
  const plainPassword = 'admin123Password';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plainPassword, salt);
  const isMatch = await bcrypt.compare(plainPassword, hash);
  assert.ok(isMatch, 'bcrypt comparison should match');
  console.log('  PASSED: Bcrypt hashing check');

  console.log('--- ALL M2 TESTS PASSED SUCCESSFULLY ---');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
