import http from 'http';

const BASE_URL = 'http://localhost:5001/api/tnea';

function makePostRequest(path, payload) {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(payload);
    const url = new URL(`${BASE_URL}${path}`);
    const req = http.request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(dataStr),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${body}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(dataStr);
    req.end();
  });
}

async function runChatbotTests() {
  console.log('\n========================================================================');
  console.log('🤖 RUNNING AI COLLEGE CHATBOT NATURAL LANGUAGE & ACCURACY TEST SUITE');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------------------
    // TEST 1: "PSG College of Technology pathi sollu" (Tanglish College Overview)
    // -------------------------------------------------------------------------
    console.log('--- TEST 1: "PSG College of Technology pathi sollu" ---');
    const res1 = await makePostRequest('/chat', { message: 'PSG College of Technology pathi sollu' });
    assert(res1.success === true, 'TEST 1: API returns success = true');
    assert(
      res1.reply.includes('PSG') || res1.reply.includes('2006'),
      'TEST 1: Reply contains PSG College of Technology details'
    );
    assert(res1.cards && res1.cards.length > 0, 'TEST 1: Returns college card with profile link');
    console.log('  Reply preview:', res1.reply.slice(0, 150) + '...');

    // -------------------------------------------------------------------------
    // TEST 2: "180 BC AD colleges" (Score + Category + Branch Recommendation)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 2: "180 BC AD colleges" ---');
    const res2 = await makePostRequest('/chat', { message: '180 BC AD colleges' });
    assert(res2.success === true, 'TEST 2: API returns success = true');
    assert(res2.cards && res2.cards.length > 0, 'TEST 2: Returns recommended college cards for 180 BC AD');
    const hasDifferentCutoffs = new Set(res2.cards.map((c) => c.historicalCutoff)).size > 1;
    assert(hasDifferentCutoffs, 'TEST 2: College cards contain distinct, college-specific historical cutoffs');
    console.log('  First card:', res2.cards[0]);

    // -------------------------------------------------------------------------
    // TEST 3: "Coimbatore AD colleges" (District + Branch Search)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 3: "Coimbatore AD colleges" ---');
    const res3 = await makePostRequest('/chat', { message: 'Coimbatore AD colleges' });
    assert(res3.success === true, 'TEST 3: API returns success = true');
    assert(res3.cards && res3.cards.length > 0, 'TEST 3: Returns colleges in Coimbatore offering AD');
    const allCbe = res3.cards.every((c) => c.district.toLowerCase().includes('coimbatore'));
    assert(allCbe, 'TEST 3: All returned cards strictly belong to Coimbatore district');

    // -------------------------------------------------------------------------
    // TEST 4: "Kongu AD cutoff" (Specific College Cutoff Lookup)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 4: "Kongu AD cutoff" ---');
    const res4 = await makePostRequest('/chat', { message: 'Kongu AD cutoff' });
    assert(res4.success === true, 'TEST 4: API returns success = true');
    assert(
      res4.reply.includes('Kongu') && (res4.reply.includes('AD') || res4.reply.includes('Artificial Intelligence')),
      'TEST 4: Reply contains specific Kongu AD cutoff values'
    );
    assert(res4.reply.includes('189.00') && res4.reply.includes('185.50'), 'TEST 4: Shows authentic OC (189.00) and BC (185.50) cutoffs for Kongu AD');

    // -------------------------------------------------------------------------
    // TEST 5: "PSG vs Kongu" (College Comparison)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 5: "PSG vs Kongu" ---');
    const res5 = await makePostRequest('/chat', { message: 'PSG vs Kongu compare pannu' });
    assert(res5.success === true, 'TEST 5: API returns success = true');
    assert(
      res5.reply.includes('PSG') && res5.reply.includes('Kongu'),
      'TEST 5: Reply compares both PSG and Kongu'
    );
    assert(res5.cards && res5.cards.length >= 2, 'TEST 5: Returns comparative cards for both institutions');

    // -------------------------------------------------------------------------
    // TEST 6: "Hostel information for PSG" (Facility / Hostel inquiry)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 6: "Hostel information for PSG" ---');
    const res6 = await makePostRequest('/chat', { message: 'Hostel information for PSG' });
    assert(res6.success === true, 'TEST 6: API returns success = true');
    assert(
      res6.reply.toLowerCase().includes('hostel') || res6.reply.includes('விடுதி'),
      'TEST 6: Reply addresses hostel availability accurately'
    );

    // -------------------------------------------------------------------------
    // TEST 7: Tamil Question ("180 கட் ஆப் மதிப்பெண்ணுக்கு எந்த கல்லூரி கிடைக்கும்?")
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 7: Tamil Question ---');
    const res7 = await makePostRequest('/chat', { message: '180 கட் ஆப் மதிப்பெண்ணுக்கு எந்த கல்லூரி கிடைக்கும்?' });
    assert(res7.success === true, 'TEST 7: API returns success = true');
    assert(res7.cards && res7.cards.length > 0, 'TEST 7: Returns college cards for Tamil query');

    // -------------------------------------------------------------------------
    // TEST 8: Tanglish Question ("Easwari Engineering College la hostel irukka?")
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 8: Tanglish Question ("Easwari Engineering College la hostel irukka?") ---');
    const res8 = await makePostRequest('/chat', { message: 'Easwari Engineering College la hostel irukka?' });
    assert(res8.success === true, 'TEST 8: API returns success = true');
    assert(
      res8.reply.includes('Easwari') && (res8.reply.includes('Hostel') || res8.reply.includes('விடுதி')),
      'TEST 8: Tanglish hostel query answered accurately for Easwari'
    );

  } catch (err) {
    console.error('Chatbot test failure:', err);
    failed++;
  }

  console.log(`\n========================================================================`);
  console.log(`AI CHATBOT TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log(`========================================================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runChatbotTests();
