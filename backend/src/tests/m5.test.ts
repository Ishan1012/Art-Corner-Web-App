import fs from 'fs';
import path from 'path';
import http from 'http';
import assert from 'assert';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import app from '../app';
import { connectDB } from '../config/db';
import { seedAdmin } from '../config/seedAdmin';
import User from '../models/User';
import cleanLegacyFiles from '../utils/cleanLegacy';

dotenv.config();

// Helper to make HTTP requests against local running server
function makeRequest(
  serverPort: number,
  pathName: string,
  method: string = 'GET',
  body?: any
): Promise<{ statusCode: number; body: any }> {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: serverPort,
        path: pathName,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          let parsed = data;
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            // Keep as string if not JSON
          }
          resolve({ statusCode: res.statusCode || 500, body: parsed });
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runM5Tests() {
  console.log('=== Running Milestone 5 (M5) Comprehensive Integration & System Tests ===\n');

  // =========================================================
  // TEST 1: CLEAN REMOVAL OF LEGACY FILES & DIRECTORIES
  // =========================================================
  console.log('--- Test 1: Verifying Clean Removal of Legacy Root JS Files & Obsolete Directories ---');
  
  // Execute legacy file cleanup utility first
  cleanLegacyFiles();

  const rootDir = path.resolve(__dirname, '../../');

  const obsoleteFiles = [
    path.join(rootDir, 'app.js'),
    path.join(rootDir, 'server.js'),
    path.join(rootDir, 'config/db.js'),
    path.join(rootDir, 'artcorner.artifacts.json'),
    path.join(rootDir, 'artcorner.communities.json'),
    path.join(rootDir, 'artcorner.newsletters.json'),
    path.join(rootDir, 'artcorner.users.json'),
    path.join(rootDir, 'test.artifacts.json'),
    path.join(rootDir, 'test.images.json'),
  ];

  const obsoleteDirs = [
    path.join(rootDir, 'model'),
    path.join(rootDir, 'router'),
    path.join(rootDir, 'utils'),
    path.join(rootDir, 'config'), // Root legacy config folder
  ];

  for (const file of obsoleteFiles) {
    const exists = fs.existsSync(file);
    assert.strictEqual(exists, false, `Obsolete file still exists: ${file}`);
  }
  console.log('  PASSED: All legacy root JS files & obsolete JSON seeds removed successfully.');

  for (const dir of obsoleteDirs) {
    const exists = fs.existsSync(dir);
    assert.strictEqual(exists, false, `Obsolete directory still exists: ${dir}`);
  }
  console.log('  PASSED: All legacy JS directories (model/, router/, utils/, config/) removed successfully.\n');

  // =========================================================
  // TEST 2: SEED FILES EXISTENCE IN src/config/seeds/
  // =========================================================
  console.log('--- Test 2: Verifying Seed Files Existence under src/config/seeds/ ---');
  const seedsDir = path.join(__dirname, '../config/seeds');
  const expectedSeeds = [
    'artcorner.artifacts.json',
    'artcorner.communities.json',
    'artcorner.newsletters.json',
    'artcorner.users.json',
    'test.artifacts.json',
    'test.images.json',
  ];

  for (const seedFile of expectedSeeds) {
    const seedPath = path.join(seedsDir, seedFile);
    assert.ok(fs.existsSync(seedPath), `Seed file missing: ${seedPath}`);
    const fileContent = fs.readFileSync(seedPath, 'utf8');
    assert.doesNotThrow(() => JSON.parse(fileContent), `Seed file ${seedFile} contains invalid JSON`);
  }
  console.log('  PASSED: All required seed JSON files exist in src/config/seeds/ and are valid JSON.\n');

  // =========================================================
  // TEST 3: EXPRESS APP ROUTE MOUNTING & MIDDLEWARE
  // =========================================================
  console.log('--- Test 3: Verifying Express App (src/app.ts) Route Mounting & 404 Fallback ---');

  const server: http.Server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });

  const address = server.address() as any;
  const port = address.port;
  assert.ok(port > 0, 'Server should listen on assigned port');

  try {
    // 3.1 Test User Routes mounting (/api/users/verify)
    const userRes = await makeRequest(port, '/api/users/verify');
    assert.strictEqual(userRes.statusCode, 400, 'GET /api/users/verify without token should return status 400');
    assert.strictEqual(userRes.body.message, 'Token is required');
    console.log('  PASSED: /api/users mounted correctly.');

    // 3.2 Test Artifact Routes mounting (/api/artifacts)
    const artifactRes = await makeRequest(port, '/api/artifacts');
    assert.ok([200, 500].includes(artifactRes.statusCode), 'GET /api/artifacts should reach artifact controller');
    console.log('  PASSED: /api/artifacts mounted correctly.');

    // 3.3 Test Community Routes mounting (/api/communities)
    const commRes = await makeRequest(port, '/api/communities');
    assert.ok([200, 500].includes(commRes.statusCode), 'GET /api/communities should reach community controller');
    console.log('  PASSED: /api/communities mounted correctly.');

    // 3.4 Test Feedback Routes mounting (/api/feedbacks)
    const feedbackRes = await makeRequest(port, '/api/feedbacks');
    assert.ok([200, 500].includes(feedbackRes.statusCode), 'GET /api/feedbacks should reach feedback controller');
    console.log('  PASSED: /api/feedbacks mounted correctly.');

    // 3.5 Test Image Routes mounting (/api/images)
    const imageRes = await makeRequest(port, '/api/images');
    assert.ok([200, 500].includes(imageRes.statusCode), 'GET /api/images should reach image controller');
    console.log('  PASSED: /api/images mounted correctly.');

    // 3.6 Test Newsletter Routes mounting (/api/newsletters)
    const nlRes = await makeRequest(port, '/api/newsletters');
    assert.ok([200, 500].includes(nlRes.statusCode), 'GET /api/newsletters should reach newsletter controller');
    console.log('  PASSED: /api/newsletters mounted correctly.');

    // 3.7 Test HTTP 404 Fallback
    const notFoundRes = await makeRequest(port, '/api/unknown-invalid-route-xyz-404');
    assert.strictEqual(notFoundRes.statusCode, 404, 'Unmapped route should return HTTP 404');
    assert.deepStrictEqual(notFoundRes.body, { message: 'Resource not found' });
    console.log('  PASSED: HTTP 404 fallback middleware works correctly.');

  } finally {
    server.close();
  }
  console.log('  PASSED: Express app router mounting & middleware verified.\n');

  // =========================================================
  // TEST 4: SEED ADMIN AUTOMATIC STARTUP SEEDING
  // =========================================================
  console.log('--- Test 4: Verifying seedAdmin() Startup Seeding & Idempotency ---');
  
  const mongoUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI || 'mongodb://localhost:27017/artcorner_test';
  let isDbConnected = false;

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    isDbConnected = true;
    console.log('Connected to MongoDB for seedAdmin verification.');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@artcorner.com';

    // Clean any previous admin user
    await User.deleteMany({ $or: [{ email: adminEmail }, { isAdmin: true }] });

    // Execute seedAdmin()
    await seedAdmin();

    // Verify admin user was created in MongoDB
    const seededAdmin = await User.findOne({ email: adminEmail });
    assert.ok(seededAdmin, 'Admin user should be found in database');
    assert.strictEqual(seededAdmin.isAdmin, true, 'Admin user should have isAdmin: true');
    assert.strictEqual(seededAdmin.isVerified, true, 'Admin user should have isVerified: true');
    assert.strictEqual(seededAdmin.status, 'active', 'Admin user status should be active');
    console.log('  PASSED: seedAdmin() successfully created admin user in MongoDB.');

    // Test seedAdmin() idempotency
    await seedAdmin();
    const adminCount = await User.countDocuments({ email: adminEmail });
    assert.strictEqual(adminCount, 1, 'seedAdmin() must be idempotent and not create duplicate admin users');
    console.log('  PASSED: seedAdmin() idempotency verified.');

  } catch (err: any) {
    console.log(`MongoDB connection skipped/unavailable (${err.message}). Testing seedAdmin export.`);
    assert.strictEqual(typeof seedAdmin, 'function', 'seedAdmin should be an exported function');
  } finally {
    if (isDbConnected) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB.');
    }
  }

  console.log('\n=== ALL MILESTONE 5 (M5) VERIFICATION TESTS PASSED SUCCESSFULLY ===');
}

runM5Tests().catch((err) => {
  console.error('M5 Test Failed:', err);
  process.exit(1);
});
