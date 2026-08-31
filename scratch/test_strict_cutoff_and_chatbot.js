import assert from 'assert';

const API_BASE = 'http://localhost:5001/api/tnea';

async function runTests() {
  console.log('========================================================================');
  console.log('🧪 STRICT TNEA CUTOFF DATA & AI CHATBOT REGRESSION SUITE');
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
  // TEST 1: College Specificity on AD + BC (Saveetha, AU Coimbatore, KSR, Muthayammal, Kongu, Easwari)
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${API_BASE}/cutoffs/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cutoffScore: 180,
        community: 'BC',
        preferredDepartments: ['AD'],
        academicYear: 2025,
      }),
    });
    const json = await res.json();
    assert(json.success, 'Predictor API returned success: false');

    const results = json.data.allRecommendations;
    assert(results.length >= 6, `Expected at least 6 recommendations, got ${results.length}`);

    // Map matched colleges and check historicalCutoff
    const colMap = new Map();
    results.forEach((r) => colMap.set(r.collegeCode, r));

    const checkColleges = ['1216', '2010', '2607', '2618', '2711', '1304'];
    const cutoffSet = new Set();

    checkColleges.forEach((code) => {
      const item = colMap.get(code);
      assert(item, `Target college code ${code} should be in results`);
      assert(item.historicalCutoff !== null, `College ${code} should have a non-null historicalCutoff`);
      assert(!isNaN(item.historicalCutoff), `College ${code} historicalCutoff should be numeric`);
      cutoffSet.add(item.historicalCutoff);
    });

    // All target colleges must have distinct, college-specific cutoffs (no shared 171.25 or 175.00 fallback!)
    assert.strictEqual(cutoffSet.size, checkColleges.length, `Expected ${checkColleges.length} distinct cutoff values, got ${cutoffSet.size}: ${[...cutoffSet].join(', ')}`);
    pass(`Target colleges have strictly unique cutoffs on AD + BC: Saveetha (${colMap.get('1216').historicalCutoff}), AU Cbe (${colMap.get('2010').historicalCutoff}), KSR (${colMap.get('2607').historicalCutoff}), Muthayammal (${colMap.get('2618').historicalCutoff}), Kongu (${colMap.get('2711').historicalCutoff}), Easwari (${colMap.get('1304').historicalCutoff})`);
  } catch (e) {
    fail('College Specificity on AD + BC', e);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: Category Isolation on ST (Kongu AD ST vs Kongu AD BC)
  // ---------------------------------------------------------------------------
  try {
    const resST = await fetch(`${API_BASE}/cutoffs/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cutoffScore: 160,
        community: 'ST',
        preferredDepartments: ['AD'],
        academicYear: 2025,
      }),
    });
    const jsonST = await resST.json();
    const konguST = jsonST.data.allRecommendations.find((r) => r.collegeCode === '2711');
    assert(konguST, 'Kongu Engineering College must be in AD ST results');
    assert.strictEqual(konguST.selectedCategory, 'ST', 'Selected category must be strictly ST');
    assert(konguST.historicalCutoff < 150, `Kongu AD ST cutoff must reflect authentic ST reservation (${konguST.historicalCutoff})`);
    pass(`Category isolation verified: Kongu AD ST cutoff is ${konguST.historicalCutoff}`);
  } catch (e) {
    fail('Category Isolation on ST', e);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Branch Isolation (AD request returns ONLY AD records)
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${API_BASE}/cutoffs/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cutoffScore: 185,
        community: 'BC',
        preferredDepartments: ['AD'],
        academicYear: 2025,
      }),
    });
    const json = await res.json();
    const nonAD = json.data.allRecommendations.filter((r) => r.departmentCode !== 'AD');
    assert.strictEqual(nonAD.length, 0, `Expected 0 non-AD branches when requesting AD, found ${nonAD.length}`);
    pass(`Branch isolation verified: 100% of returned records are strictly AD`);
  } catch (e) {
    fail('Branch Isolation on AD', e);
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Missing official cutoff returns null / Official value unavailable
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${API_BASE}/cutoffs?collegeCode=0001&departmentCode=CS&academicYear=2024&counsellingRound=2`);
    const json = await res.json();
    assert(json.success, 'Cutoff query succeeded');
    const r2Record = json.data[0];
    assert(r2Record, 'R2 Record found');
    assert.strictEqual(r2Record.ocCutoff, null, 'CEG CS R2 OC cutoff must be null (100% filled in R1)');
    assert.strictEqual(r2Record.bcCutoff, null, 'CEG CS R2 BC cutoff must be null');
    assert.strictEqual(r2Record.dataStatus, 'UNAVAILABLE', 'CEG CS R2 status must be UNAVAILABLE');
    pass('Missing/filled round cutoffs strictly store null without synthetic fabrication');
  } catch (e) {
    fail('Missing official cutoff returns null', e);
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Expected range and trend are college-specific
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${API_BASE}/cutoffs/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cutoffScore: 180,
        community: 'BC',
        preferredDepartments: ['AD'],
        academicYear: 2025,
      }),
    });
    const json = await res.json();
    const saveetha = json.data.allRecommendations.find((r) => r.collegeCode === '1216');
    const kongu = json.data.allRecommendations.find((r) => r.collegeCode === '2711');
    assert(saveetha && kongu, 'Both colleges present');
    assert.notStrictEqual(saveetha.expectedCutoffRange.display, kongu.expectedCutoffRange.display, 'Expected ranges must be distinct');
    pass(`College-specific expected ranges verified: Saveetha (${saveetha.expectedCutoffRange.display}) vs Kongu (${kongu.expectedCutoffRange.display})`);
  } catch (e) {
    fail('College-specific expected range', e);
  }

  // ---------------------------------------------------------------------------
  // TEST 6: Chatbot English Query ("Tell me about PSG College of Technology")
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Tell me about PSG College of Technology' }),
    });
    const json = await res.json();
    assert(json.success, 'Chatbot query failed');
    assert(json.reply.includes('PSG College of Technology'), 'Reply should mention PSG');
    assert(json.cards.length > 0, 'Should include college profile card');
    assert(json.cards[0].profileUrl.includes('/colleges/2006'), 'Should link to /colleges/2006');
    pass('Chatbot English query successfully returned structured profile with route link');
  } catch (e) {
    fail('Chatbot English Query', e);
  }

  // ---------------------------------------------------------------------------
  // TEST 7: Chatbot Tanglish Query ("PSG College of Technology pathi sollu")
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'PSG College of Technology pathi sollu' }),
    });
    const json = await res.json();
    assert(json.success, 'Chatbot query failed');
    assert(json.reply.includes('PSG College of Technology'), 'Reply should mention PSG');
    assert(json.cards.length > 0, 'Cards should be attached');
    pass('Chatbot Tanglish query successfully parsed and responded');
  } catch (e) {
    fail('Chatbot Tanglish Query', e);
  }

  // ---------------------------------------------------------------------------
  // TEST 8: Chatbot Tamil Query ("180 கட் ஆப் மதிப்பெண்ணுக்கு எந்த கல்லூரி கிடைக்கும்?")
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '180 கட் ஆப் மதிப்பெண்ணுக்கு எந்த கல்லூரி கிடைக்கும்?' }),
    });
    const json = await res.json();
    assert(json.success, 'Chatbot query failed');
    assert(json.cards.length > 0, 'Should return college recommendation cards');
    pass('Chatbot Tamil query successfully returned recommended college cards');
  } catch (e) {
    fail('Chatbot Tamil Query', e);
  }

  // ---------------------------------------------------------------------------
  // TEST 9: Chatbot College Comparison ("PSG vs Kongu compare pannu")
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'PSG vs Kongu compare pannu' }),
    });
    const json = await res.json();
    assert(json.success, 'Chatbot query failed');
    assert(json.reply.includes('2006') && json.reply.includes('2711'), 'Reply must include both college codes');
    assert(json.cards.length === 2, 'Should return 2 comparison cards');
    pass('Chatbot comparison query successfully compared both colleges with structured cards');
  } catch (e) {
    fail('Chatbot College Comparison', e);
  }

  // ---------------------------------------------------------------------------
  // TEST 10: Chatbot Hostel Facility Inquiry ("Easwari Engineering College la hostel irukka?")
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Easwari Engineering College la hostel irukka?' }),
    });
    const json = await res.json();
    assert(json.success, 'Chatbot query failed');
    assert(json.reply.includes('Hostel') || json.reply.includes('விடுதி'), 'Reply should describe hostel');
    pass('Chatbot hostel query successfully returned verified hostel status');
  } catch (e) {
    fail('Chatbot Hostel Query', e);
  }

  // ---------------------------------------------------------------------------
  // TEST 11: Chatbot District Recommendation ("180 BC AD Coimbatore colleges")
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '180 BC AD Coimbatore colleges' }),
    });
    const json = await res.json();
    assert(json.success, 'Chatbot query failed');
    assert(json.cards.length > 0, 'Should return cards');
    assert(json.cards.every((c) => c.district.toLowerCase() === 'coimbatore'), 'All cards must be from Coimbatore');
    pass('Chatbot parsed 180 + BC + AD + Coimbatore and returned district-specific cards');
  } catch (e) {
    fail('Chatbot District Recommendation', e);
  }

  // ---------------------------------------------------------------------------
  // TEST 12: Chatbot Best Colleges in District ("Coimbatore la best engineering colleges sollu")
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Coimbatore la best engineering colleges sollu' }),
    });
    const json = await res.json();
    assert(json.success, 'Chatbot query failed');
    assert(json.cards.length > 0, 'Should return top colleges');
    pass('Chatbot answered top colleges for district with verified institutions');
  } catch (e) {
    fail('Chatbot Best Colleges in District', e);
  }

  // ---------------------------------------------------------------------------
  // TEST 13: Unknown Information Handling
  // ---------------------------------------------------------------------------
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What is the faculty details for 9999 college?' }),
    });
    const json = await res.json();
    assert(json.success, 'Chatbot responded gracefully');
    assert(json.reply.includes('not available in the verified database') || json.reply.includes('not available in the current database'), 'Must declare unavailability');
    pass('Unknown information returned strict verified unavailability message');
  } catch (e) {
    fail('Unknown Information Handling', e);
  }

  console.log('\n========================================================================');
  console.log(`STRICT REGRESSION SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('========================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
