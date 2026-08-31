import assert from 'assert';
import { formatBaseApiUrl } from '../client/src/services/api.js';

function testUrlSanitization() {
  console.log('========================================================================');
  console.log('🧪 TESTING BASE API URL FORMATTING & RESILIENCE');
  console.log('========================================================================\n');

  let passed = 0;

  function check(input, expected, label) {
    const result = formatBaseApiUrl(input);
    assert.strictEqual(result, expected, `Mismatch for ${label}: got "${result}", expected "${expected}"`);
    console.log(`  ✅ [PASS] ${label}: "${input || ''}" -> "${result}"`);
    passed++;
  }

  // 1. Without /api
  check(
    'https://course-registration-api-gwk0.onrender.com',
    'https://course-registration-api-gwk0.onrender.com/api',
    'Render domain without trailing slash or /api'
  );

  // 2. With trailing slash
  check(
    'https://course-registration-api-gwk0.onrender.com/',
    'https://course-registration-api-gwk0.onrender.com/api',
    'Render domain with trailing slash'
  );

  // 3. With /api already
  check(
    'https://course-registration-api-gwk0.onrender.com/api',
    'https://course-registration-api-gwk0.onrender.com/api',
    'Render domain already with /api'
  );

  // 4. With /api/ trailing slash
  check(
    'https://course-registration-api-gwk0.onrender.com/api/',
    'https://course-registration-api-gwk0.onrender.com/api',
    'Render domain with /api/'
  );

  // 5. Localhost port 5001
  check('http://localhost:5001', 'http://localhost:5001/api', 'Localhost without /api');
  check('http://localhost:5001/api', 'http://localhost:5001/api', 'Localhost with /api');
  check('http://localhost:5001/', 'http://localhost:5001/api', 'Localhost with trailing slash');

  // 6. Relative /api
  check('/api', '/api', 'Relative /api');
  check('/api/', '/api', 'Relative /api/');

  // 7. Undefined (in Node test environment without import.meta.env.PROD)
  check(undefined, '/api', 'Undefined in dev environment');
  check('', '/api', 'Empty string in dev environment');

  console.log('\n========================================================================');
  console.log(`URL SANITIZATION TEST SUMMARY: ${passed} passed, 0 failed`);
  console.log('========================================================================');
}

testUrlSanitization();
