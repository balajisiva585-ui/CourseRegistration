import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_API = 'http://localhost:5001/api/tnea';
const RENDER_API = 'https://course-registration-api-gwk0.onrender.com/api/tnea';

async function runTests() {
  console.log('========================================================================');
  console.log('🧪 VERIFYING DYNAMIC PREDICTOR FILTERS & PRODUCTION DEPLOYMENT');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function pass(desc) {
    passed++;
    console.log(`  ✅ [PASS] ${desc}`);
  }

  function fail(desc, err) {
    failed++;
    console.error(`  ❌ [FAIL] ${desc}: ${err.message || err}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 1: Branches / Departments API (Local & Render)
  // ---------------------------------------------------------------------------
  try {
    const localDepts = await fetch(`${LOCAL_API}/departments`).then((r) => r.json());
    assert(localDepts.success, 'Local departments API failed');
    assert(localDepts.data.length >= 15, `Expected >= 15 local departments, got ${localDepts.data.length}`);
    const codes = localDepts.data.map((d) => d.code);
    assert(codes.includes('AD') && codes.includes('CS') && codes.includes('IT') && codes.includes('EC'), 'Core branch codes AD, CS, IT, EC must exist');
    pass(`Local branches loaded successfully: ${localDepts.data.length} branches (${codes.slice(0, 8).join(', ')}...)`);
  } catch (e) {
    fail('Local Branches API', e);
  }

  try {
    const renderDepts = await fetch(`${RENDER_API}/departments`).then((r) => r.json());
    assert(renderDepts.success, 'Render departments API failed');
    assert(renderDepts.data.length >= 10, `Expected >= 10 render departments, got ${renderDepts.data.length}`);
    pass(`Render live branches API verified: ${renderDepts.data.length} branches available`);
  } catch (e) {
    fail('Render Branches API', e);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: Districts API (Local & Render)
  // ---------------------------------------------------------------------------
  try {
    const localDist = await fetch(`${LOCAL_API}/districts`).then((r) => r.json());
    assert(localDist.success, 'Local districts API failed');
    assert(localDist.data.length >= 10, `Expected >= 10 local districts, got ${localDist.data.length}`);
    const sample = localDist.data.map((d) => (typeof d === 'string' ? d : d.name));
    assert(sample.includes('Chennai') && sample.includes('Coimbatore'), 'Chennai and Coimbatore must exist in districts');
    pass(`Local districts loaded successfully: ${localDist.data.length} districts (${sample.slice(0, 6).join(', ')}...)`);
  } catch (e) {
    fail('Local Districts API', e);
  }

  try {
    const renderDist = await fetch(`${RENDER_API}/districts`).then((r) => r.json());
    assert(renderDist.success, 'Render districts API failed');
    assert(renderDist.data.length >= 5, `Expected >= 5 render districts, got ${renderDist.data.length}`);
    pass(`Render live districts API verified: ${renderDist.data.length} districts available`);
  } catch (e) {
    fail('Render Districts API', e);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Cutoff Predictor with Branch Filter (180 + BC + AD + 2025)
  // ---------------------------------------------------------------------------
  try {
    const pred = await fetch(`${LOCAL_API}/cutoffs/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cutoffMark: 180,
        community: 'BC',
        preferredDepartments: ['AD'],
        preferredDistricts: ['All'],
        academicYear: 2025,
      }),
    }).then((r) => r.json());

    assert(pred.success, 'Predictor API returned false');
    const recs = pred.data.allRecommendations;
    assert(recs.length > 0, 'Should return recommendations for 180 BC AD');
    assert(recs.every((r) => r.departmentCode === 'AD'), 'All returned records must strictly be AD');
    pass(`Branch filter verified: 180 + BC + AD + 2025 returned ${recs.length} strictly AD recommendations`);
  } catch (e) {
    fail('Predictor Branch Filter', e);
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Cutoff Predictor with District Filter (Coimbatore)
  // ---------------------------------------------------------------------------
  try {
    const predDist = await fetch(`${LOCAL_API}/cutoffs/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cutoffMark: 180,
        community: 'BC',
        preferredDepartments: ['All'],
        preferredDistricts: ['Coimbatore'],
        academicYear: 2025,
      }),
    }).then((r) => r.json());

    assert(predDist.success, 'Predictor API returned false');
    const recs = predDist.data.allRecommendations;
    assert(recs.length > 0, 'Should return recommendations for Coimbatore');
    assert(recs.every((r) => r.district.toLowerCase() === 'coimbatore'), 'All recommendations must be in Coimbatore');
    pass(`District filter verified: Returned ${recs.length} recommendations strictly from Coimbatore`);
  } catch (e) {
    fail('Predictor District Filter', e);
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Production Bundle Verification (Zero localhost URLs)
  // ---------------------------------------------------------------------------
  try {
    const distDir = path.join(__dirname, '../client/dist/assets');
    const files = fs.readdirSync(distDir);
    const jsFiles = files.filter((f) => f.endsWith('.js'));
    assert(jsFiles.length > 0, 'At least 1 built JS bundle should exist');

    for (const jsFile of jsFiles) {
      const content = fs.readFileSync(path.join(distDir, jsFile), 'utf-8');
      assert(!content.includes('http://localhost:5001'), `Bundle ${jsFile} must NOT contain http://localhost:5001`);
      assert(!content.includes('http://localhost:5000'), `Bundle ${jsFile} must NOT contain http://localhost:5000`);
      assert(content.includes('course-registration-api-gwk0.onrender.com'), `Bundle ${jsFile} MUST target Render production URL`);
    }
    pass('Production bundle verified: 0 localhost URLs and correctly targets Render backend');
  } catch (e) {
    fail('Production Bundle Verification', e);
  }

  // ---------------------------------------------------------------------------
  // TEST 6: Vercel Configuration Verification
  // ---------------------------------------------------------------------------
  try {
    const rootVercel = JSON.parse(fs.readFileSync(path.join(__dirname, '../vercel.json'), 'utf-8'));
    assert(rootVercel.rewrites && rootVercel.rewrites.length >= 2, 'root vercel.json must have API and SPA rewrites');

    const clientVercel = JSON.parse(fs.readFileSync(path.join(__dirname, '../client/vercel.json'), 'utf-8'));
    assert(clientVercel.rewrites && clientVercel.rewrites.length >= 2, 'client/vercel.json must have API and SPA rewrites');
    pass('Vercel configuration verified in root and client directories');
  } catch (e) {
    fail('Vercel Config Verification', e);
  }

  console.log('\n========================================================================');
  console.log(`DEPLOYMENT & FILTER SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('========================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
