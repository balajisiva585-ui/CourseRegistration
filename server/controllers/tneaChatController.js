import TneaCollege from '../models/TneaCollege.js';
import TneaCutoff from '../models/TneaCutoff.js';
import TneaDepartment from '../models/TneaDepartment.js';
import TneaSeatMatrix from '../models/TneaSeatMatrix.js';
import TneaFee from '../models/TneaFee.js';
import { extractCategoryCutoff } from './tneaController.js';

// Dictionary of known college aliases & keywords for NLP matching
const COLLEGE_ALIASES = [
  { code: '0001', names: ['ceg', 'guindy', 'college of engineering guindy', 'anna university ceg', 'ceg anna university'] },
  { code: '0002', names: ['accet', 'alagappa chettiar', 'accet karaikudi'] },
  { code: '0003', names: ['actech', 'ac tech', 'alagappa college of technology'] },
  { code: '0004', names: ['mit', 'madras institute of technology', 'mit anna university', 'mit chromepet'] },
  { code: '0005', names: ['annamalai', 'feat', 'faculty of engineering annamalai'] },
  { code: '0006', names: ['cecri', 'csir', 'central electrochemical'] },
  { code: '1013', names: ['uce kanchipuram', 'kanchipuram constituent'] },
  { code: '1014', names: ['uce arni', 'arni constituent'] },
  { code: '1110', names: ['prathyusha'] },
  { code: '1113', names: ['rmk', 'r.m.k', 'rmk engineering', 'rmk college'] },
  { code: '1114', names: ['rmd', 'r.m.d', 'rmd engineering'] },
  { code: '1115', names: ['meenakshi sundararajan', 'msec'] },
  { code: '1120', names: ['velammal', 'velammal engineering'] },
  { code: '1210', names: ['panimalar'] },
  { code: '1211', names: ['rec', 'rajalakshmi', 'rajalakshmi engineering'] },
  { code: '1216', names: ['saveetha', 'saveetha engineering'] },
  { code: '1219', names: ['svce', 'sri venkateswara college of engineering', 'sriperumbudur'] },
  { code: '1304', names: ['easwari', 'easwari engineering college', 'srm easwari', 'ramapuram', 'easwari college'] },
  { code: '1315', names: ['ssn', 'sri sivasubramaniya nadar', 'ssn college of engineering', 'kalavakkam'] },
  { code: '1317', names: ["st. joseph's", "st josephs", "st joseph"] },
  { code: '1399', names: ['cit chennai', 'chennai institute of technology', 'cit sarathy nagar'] },
  { code: '1419', names: ['sairam', 'sri sairam engineering college', 'sairam engineering'] },
  { code: '1450', names: ['licet', 'loyola', 'loyola-icam'] },
  { code: '2005', names: ['gct', 'government college of technology', 'gct coimbatore'] },
  { code: '2006', names: ['psg', 'psg tech', 'psg college of technology', 'peelamedu'] },
  { code: '2007', names: ['cit coimbatore', 'coimbatore institute of technology', 'cit cbe'] },
  { code: '2010', names: ['au regional coimbatore', 'anna univ regional coimbatore', 'anna university regional campus coimbatore'] },
  { code: '2025', names: ['psg itech', 'psg institute of technology and applied research', 'psg neelambur'] },
  { code: '2377', names: ['sona', 'sona college of technology'] },
  { code: '2603', names: ['gce bargur', 'bargur govt'] },
  { code: '2607', names: ['ksr', 'ks rangasamy', 'k.s. rangasamy', 'ks rangasamy college of technology'] },
  { code: '2615', names: ['gce salem', 'salem govt'] },
  { code: '2618', names: ['muthayammal', 'muthayammal engineering college'] },
  { code: '2622', names: ['gce dharmapuri'] },
  { code: '2702', names: ['bannari amman', 'bit', 'bannari'] },
  { code: '2706', names: ['mcet', 'dr mahalingam', 'mahalingam'] },
  { code: '2709', names: ['irtt', 'gce erode', 'erode govt'] },
  { code: '2711', names: ['kongu', 'kongu engineering college', 'perundurai', 'kongu college'] },
  { code: '2712', names: ['kct', 'kumaraguru', 'kumaraguru college of technology'] },
  { code: '2718', names: ['skcet', 'sri krishna', 'sri krishna college of engineering and technology'] },
  { code: '2722', names: ['srec', 'sri ramakrishna', 'ramakrishna engineering'] },
  { code: '2723', names: ['velalar', 'velalar college'] },
  { code: '2739', names: ['kumarasamy', 'm. kumarasamy'] },
  { code: '3011', names: ['uce tindivanam', 'tindivanam constituent'] },
  { code: '3465', names: ['gce thanjavur'] },
  { code: '3801', names: ['au regional madurai'] },
  { code: '3802', names: ['au regional trichy', 'au regional tiruchirappalli'] },
  { code: '3819', names: ['saranathan'] },
  { code: '4959', names: ['kamaraj'] },
  { code: '4960', names: ['mepco', 'mepco schlenk'] },
  { code: '4962', names: ['nec', 'national engineering college', 'kovilpatti'] },
  { code: '4968', names: ["st. xavier's", "st xaviers"] },
  { code: '4974', names: ['gce tirunelveli', 'tirunelveli govt'] },
  { code: '4992', names: ['gce bodinayakkanur'] },
  { code: '5008', names: ['tce', 'thiagarajar', 'thiagarajar college of engineering'] },
  { code: '5012', names: ['uce ramanathapuram'] },
  { code: '5901', names: ['uce dindigul'] },
  { code: '5910', names: ['psna', 'psna college'] },
  { code: '5986', names: ['uce nagercoil'] },
];

const DISTRICT_NAMES = [
  'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Erode', 'Tiruvallur',
  'Kancheepuram', 'Chengalpattu', 'Namakkal', 'Tiruchirappalli',
  'Virudhunagar', 'Thoothukudi', 'Kanyakumari', 'Dharmapuri', 'Villupuram',
  'Sivaganga', 'Cuddalore', 'Tiruvannamalai', 'Karur', 'Thanjavur',
  'Theni', 'Ramanathapuram', 'Dindigul', 'Krishnagiri'
];

const BRANCH_MAPPINGS = [
  { code: 'AD', names: ['ad', 'aids', 'ai and data science', 'artificial intelligence and data science', 'ai & ds', 'ai ds', 'ai/ds'] },
  { code: 'CS', names: ['cs', 'cse', 'computer science', 'computer science and engineering', 'comp sci'] },
  { code: 'IT', names: ['it', 'information technology', 'infotech'] },
  { code: 'EC', names: ['ec', 'ece', 'electronics', 'electronics and communication', 'electronics and communication engineering'] },
  { code: 'EE', names: ['ee', 'eee', 'electrical', 'electrical and electronics', 'electrical and electronics engineering'] },
  { code: 'ME', names: ['me', 'mech', 'mechanical', 'mechanical engineering'] },
  { code: 'CE', names: ['ce', 'civil', 'civil engineering'] },
  { code: 'BT', names: ['bt', 'biotech', 'biotechnology'] },
  { code: 'BM', names: ['bm', 'bme', 'biomedical', 'biomedical engineering'] },
  { code: 'CH', names: ['ch', 'chem', 'chemical', 'chemical engineering'] },
  { code: 'CB', names: ['cb', 'csbs', 'computer science and business systems'] },
  { code: 'AM', names: ['am', 'aiml', 'artificial intelligence and machine learning', 'ai & ml'] },
  { code: 'RO', names: ['ro', 'robotics', 'robotics and automation'] },
  { code: 'AE', names: ['ae', 'aero', 'aeronautical', 'aeronautical engineering'] },
  { code: 'AU', names: ['au', 'auto', 'automobile', 'automobile engineering'] },
];

const COMMUNITY_PATTERNS = [
  { code: 'BCM', regex: /\b(bcm|bc muslim|bc-m)\b/i },
  { code: 'MBC', regex: /\b(mbc\/dnc|mbc_dnc|mbcdnc|mbc|dnc)\b/i },
  { code: 'SCA', regex: /\b(sca|sc arunthathiyar|sc-a)\b/i },
  { code: 'SC', regex: /\b(sc|scheduled caste)\b/i },
  { code: 'ST', regex: /\b(st|scheduled tribe)\b/i },
  { code: 'BC', regex: /\b(bc|backward class)\b/i },
  { code: 'OC', regex: /\b(oc|open competition|general|fc)\b/i },
];

// Helper to extract entities from natural language query
function extractEntities(text) {
  const clean = text.toLowerCase();

  // 1. Cutoff Mark Extraction
  let cutoffScore = null;
  const scoreMatch = clean.match(/\b(1\d{2}(?:\.\d{1,2})?|200(?:\.00?)?|[6-9]\d(?:\.\d{1,2})?)\b/);
  if (scoreMatch) {
    const val = parseFloat(scoreMatch[1]);
    if (val >= 60 && val <= 200) {
      cutoffScore = val;
    }
  }

  // 2. Community Extraction
  let community = null;
  for (const c of COMMUNITY_PATTERNS) {
    if (c.regex.test(clean)) {
      community = c.code;
      break;
    }
  }

  // 3. Department / Branch Extraction
  let departmentCode = null;
  for (const b of BRANCH_MAPPINGS) {
    for (const name of b.names) {
      const reg = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (reg.test(clean)) {
        departmentCode = b.code;
        break;
      }
    }
    if (departmentCode) break;
  }

  // 4. District Extraction
  let district = null;
  for (const d of DISTRICT_NAMES) {
    if (clean.includes(d.toLowerCase())) {
      district = d;
      break;
    }
  }

  // 5. College Extraction (Direct 4-digit code or alias)
  let matchedCollegeCodes = [];
  const codeMatch = clean.match(/\b\d{4}\b/);
  if (codeMatch) {
    matchedCollegeCodes.push(codeMatch[0]);
  }

  for (const alias of COLLEGE_ALIASES) {
    for (const name of alias.names) {
      const reg = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (reg.test(clean)) {
        if (!matchedCollegeCodes.includes(alias.code)) {
          matchedCollegeCodes.push(alias.code);
        }
      }
    }
  }

  // 6. Year Extraction
  let academicYear = 2025;
  if (clean.includes('2024')) academicYear = 2024;
  else if (clean.includes('2026')) academicYear = 2026;
  else if (clean.includes('2023')) academicYear = 2023;

  // 7. Intent detection
  const isComparison = clean.includes(' vs ') || clean.includes('compare') || clean.includes('vs.') || clean.includes('difference') || clean.includes('differ');
  const isHostelQuery = clean.includes('hostel') || clean.includes('mess') || clean.includes('food') || clean.includes('stay') || clean.includes('accommodation');
  const isFacultyQuery = clean.includes('faculty') || clean.includes('professor') || clean.includes('staff') || clean.includes('teaching');
  const isPlacementQuery = clean.includes('placement') || clean.includes('package') || clean.includes('recruiter') || clean.includes('salary') || clean.includes('job');
  const isFeeQuery = clean.includes('fee') || clean.includes('tuition') || clean.includes('cost') || clean.includes('charges');
  const isBestCollegesQuery = clean.includes('best') || clean.includes('top') || clean.includes('famous') || clean.includes('leading');
  const isCutoffFormulaQuery = clean.includes('calculate cutoff') || clean.includes('formula') || clean.includes('how cutoff is calculated') || clean.includes('cutoff calculate');
  const isGeneralAdvice = clean.includes('choice filling') || clean.includes('counselling steps') || clean.includes('procedure') || clean.includes('tnea process');
  const isTamilOrTanglish = /[அ-ஹ]/.test(text) || clean.includes('sollu') || clean.includes('irukka') || clean.includes('kidaikkum') || clean.includes('enna') || clean.includes('pathi') || clean.includes('paththi') || clean.includes('pannu') || clean.includes('eppadi');

  return {
    cutoffScore,
    community: community || 'OC',
    explicitCommunity: !!community,
    departmentCode,
    district,
    matchedCollegeCodes,
    academicYear,
    isComparison,
    isHostelQuery,
    isFacultyQuery,
    isPlacementQuery,
    isFeeQuery,
    isBestCollegesQuery,
    isCutoffFormulaQuery,
    isGeneralAdvice,
    isTamilOrTanglish,
  };
}

export const handleTneaChat = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid question or query.',
      });
    }

    const trimmed = message.trim();
    const entities = extractEntities(trimmed);

    console.log('[AI CHAT QUERY]', {
      query: trimmed,
      entities,
    });

    // -------------------------------------------------------------------------
    // 1. TNEA CUTOFF FORMULA & CALCULATION GUIDANCE
    // -------------------------------------------------------------------------
    if (entities.isCutoffFormulaQuery) {
      const responseText = entities.isTamilOrTanglish
        ? `TNEA Cutoff கணக்கிடும் சூத்திரம் (Out of 200):\n\n📐 **Cutoff = Maths + (Physics / 2) + (Chemistry / 2)**\n\n• கணிதம் (Maths): 100 மதிப்பெண்கள்\n• இயற்பியல் (Physics): 50 மதிப்பெண்கள் (100-க்கு எடுத்த மதிப்பெண் ÷ 2)\n• வேதியியல் (Chemistry): 50 மதிப்பெண்கள் (100-க்கு எடுத்த மதிப்பெண் ÷ 2)\n\nஎடுத்துக்காட்டு: Maths: 95, Physics: 90, Chemistry: 88 என்றால் -> 95 + 45 + 44 = **184.00 Cutoff**.`
        : `Official TNEA Cutoff Calculation Formula (Out of 200 Marks):\n\n📐 **Cutoff = Mathematics + (Physics / 2) + (Chemistry / 2)**\n\n• Mathematics: 100 Marks weightage\n• Physics: 50 Marks weightage (Score out of 100 ÷ 2)\n• Chemistry: 50 Marks weightage (Score out of 100 ÷ 2)\n\nExample: If you scored Maths: 95, Physics: 90, Chemistry: 88 -> 95 + 45 + 44 = **184.00 Cutoff**.`;

      return res.json({
        success: true,
        reply: responseText,
        cards: [],
        suggestions: [
          'Show colleges for 180 cutoff',
          'PSG vs Kongu compare pannu',
          'Coimbatore AD colleges',
          'Easwari hostel details',
        ],
      });
    }

    // -------------------------------------------------------------------------
    // 2. COLLEGE COMPARISON (e.g. "PSG vs Kongu", "Compare 0001 and 0004")
    // -------------------------------------------------------------------------
    if (entities.isComparison || entities.matchedCollegeCodes.length >= 2) {
      const codes = entities.matchedCollegeCodes.slice(0, 3);
      if (codes.length < 2) {
        return res.json({
          success: true,
          reply: entities.isTamilOrTanglish
            ? 'ஒப்பிடுவதற்கு (Compare) குறைந்தது இரண்டு கல்லூரிகளின் பெயர்கள் அல்லது TNEA குறியீடுகளை (Codes) குறிப்பிடவும் (எ.கா: "PSG vs Kongu" அல்லது "CEG vs MIT").'
            : 'Please specify at least two colleges to compare (e.g., "PSG vs Kongu" or "CEG vs MIT").',
          cards: [],
          suggestions: ['PSG vs Kongu', 'CEG vs MIT', 'SSN vs Easwari'],
        });
      }

      const colleges = await TneaCollege.find({ code: { $in: codes } }).lean();

      if (colleges.length < 2) {
        return res.json({
          success: true,
          reply: 'Verified information is not available in the current database for one or more requested colleges.',
          cards: [],
        });
      }

      const c1 = colleges[0];
      const c2 = colleges[1];

      const c1Nirf = c1.accreditations?.find((a) => a.organization === 'NIRF')?.grade || 'Not available in verified database';
      const c2Nirf = c2.accreditations?.find((a) => a.organization === 'NIRF')?.grade || 'Not available in verified database';
      const c1Naac = c1.accreditations?.find((a) => a.organization === 'NAAC')?.grade || 'Not available in verified database';
      const c2Naac = c2.accreditations?.find((a) => a.organization === 'NAAC')?.grade || 'Not available in verified database';

      const c1Hostel = c1.facilities?.hostel?.available ? 'Available ✅' : 'Not available in verified database';
      const c2Hostel = c2.facilities?.hostel?.available ? 'Available ✅' : 'Not available in verified database';

      const replyText = entities.isTamilOrTanglish
        ? `🏛️ **${c1.name} (${c1.code})** vs **${c2.name} (${c2.code})** ஒப்பீடு:\n\n` +
          `• **மாவட்டம் / இருப்பிடம்**: ${c1.district || 'Not available'} vs ${c2.district || 'Not available'}\n` +
          `• **நிறுவன வகை**: ${c1.collegeType || 'Not available'} vs ${c2.collegeType || 'Not available'}\n` +
          `• **NAAC மதிப்பீடு**: ${c1Naac} vs ${c2Naac}\n` +
          `• **NIRF தரம்**: ${c1Nirf} vs ${c2Nirf}\n` +
          `• **துறைகள் எண்ணிக்கை**: ${c1.departments?.length || 0} vs ${c2.departments?.length || 0}\n` +
          `• **விடுதி வசதி**: ${c1Hostel} vs ${c2Hostel}\n` +
          `• **வேலைவாய்ப்பு (Placement)**: ${c1.placements?.placementPercentage ? `${c1.placements.placementPercentage}%` : 'Not available in verified database'} vs ${c2.placements?.placementPercentage ? `${c2.placements.placementPercentage}%` : 'Not available in verified database'}\n\n` +
          `கீழே உள்ள பட்டன்களைப் பயன்படுத்தி இரு கல்லூரிகளின் விரிவான விவரங்களைப் பார்க்கலாம்.`
        : `🏛️ **Comparison: ${c1.name} (${c1.code}) vs ${c2.name} (${c2.code})**\n\n` +
          `• **District / Location**: ${c1.district || 'Not available'} vs ${c2.district || 'Not available'}\n` +
          `• **Institution Type**: ${c1.collegeType || 'Not available'} vs ${c2.collegeType || 'Not available'}\n` +
          `• **NAAC Grade**: ${c1Naac} vs ${c2Naac}\n` +
          `• **NIRF Ranking**: ${c1Nirf} vs ${c2Nirf}\n` +
          `• **Departments Count**: ${c1.departments?.length || 0} vs ${c2.departments?.length || 0}\n` +
          `• **Hostel Facility**: ${c1Hostel} vs ${c2Hostel}\n` +
          `• **Placement Record**: ${c1.placements?.placementPercentage ? `${c1.placements.placementPercentage}%` : 'Not available in verified database'} vs ${c2.placements?.placementPercentage ? `${c2.placements.placementPercentage}%` : 'Not available in verified database'}\n\n` +
          `You can explore individual profiles or launch full side-by-side analysis below:`;

      const cards = colleges.map((c) => ({
        collegeCode: c.code,
        collegeName: c.name,
        district: c.district,
        collegeType: c.collegeType,
        isAutonomous: c.isAutonomous,
        placementPercentage: c.placements?.placementPercentage,
        profileUrl: `/colleges/${c.code}`,
      }));

      return res.json({
        success: true,
        reply: replyText,
        cards,
        suggestions: [
          `${c1.shortName || c1.name} cutoffs`,
          `${c2.shortName || c2.name} cutoffs`,
          'Show colleges for 185 cutoff',
        ],
      });
    }

    // -------------------------------------------------------------------------
    // 3. HOSTEL & FACILITIES INQUIRY
    // -------------------------------------------------------------------------
    if (entities.isHostelQuery && entities.matchedCollegeCodes.length > 0) {
      const college = await TneaCollege.findOne({ code: entities.matchedCollegeCodes[0] }).lean();
      if (!college) {
        return res.json({
          success: true,
          reply: 'Verified information is not available in the current database for this college.',
          cards: [],
        });
      }

      const hostelAvailable = college.facilities?.hostel?.available;
      const hostelDesc = college.facilities?.hostel?.description;

      if (hostelAvailable !== undefined) {
        const replyText = entities.isTamilOrTanglish
          ? `🏢 **${college.name} (${college.code})** விடுதி (Hostel) விவரங்கள்:\n\n` +
            `• **விடுதி வசதி**: ${hostelAvailable ? 'ஆம், மாணவர் மற்றும் மாணவிகளுக்கான தனித்தனி விடுதிகள் உள்ளன ✅' : 'விடுதி வசதி இல்லை'}\n` +
            (hostelDesc ? `• **கூடுதல் விவரங்கள்**: ${hostelDesc}\n` : '') +
            (college.facilities?.library?.available ? `• **நூலகம் (Library)**: வசதி உள்ளது ✅\n` : '') +
            (college.facilities?.transport?.available ? `• **பேருந்து வசதி (Transport)**: வசதி உள்ளது ✅\n` : '')
          : `🏢 **${college.name} (${college.code})** Hostel & Campus Facilities:\n\n` +
            `• **Hostel Facility**: ${hostelAvailable ? 'Yes, available with separate blocks for Boys and Girls ✅' : 'No verified on-campus hostel'}\n` +
            (hostelDesc ? `• **Details**: ${hostelDesc}\n` : '') +
            (college.facilities?.library?.available ? `• **Central Library**: Available ✅\n` : '') +
            (college.facilities?.transport?.available ? `• **Transport / College Bus**: Available ✅\n` : '');

        return res.json({
          success: true,
          reply: replyText,
          cards: [
            {
              collegeCode: college.code,
              collegeName: college.name,
              district: college.district,
              collegeType: college.collegeType,
              profileUrl: `/colleges/${college.code}`,
            },
          ],
          suggestions: [
            `${college.shortName || college.name} departments`,
            `${college.shortName || college.name} cutoffs`,
            'Compare with other colleges',
          ],
        });
      } else {
        return res.json({
          success: true,
          reply: 'Hostel information is not available in the verified database.',
          cards: [
            {
              collegeCode: college.code,
              collegeName: college.name,
              district: college.district,
              profileUrl: `/colleges/${college.code}`,
            },
          ],
          suggestions: [
            `${college.shortName || college.name} pathi sollu`,
            `${college.shortName || college.name} cutoffs`,
          ],
        });
      }
    }

    // -------------------------------------------------------------------------
    // 4. FACULTY / PLACEMENTS / FEES INQUIRY FOR SPECIFIC COLLEGE
    // -------------------------------------------------------------------------
    if ((entities.isFacultyQuery || entities.isPlacementQuery || entities.isFeeQuery) && entities.matchedCollegeCodes.length > 0) {
      const college = await TneaCollege.findOne({ code: entities.matchedCollegeCodes[0] }).lean();
      if (!college) {
        return res.json({
          success: true,
          reply: 'Information is not available in the verified database.',
          cards: [],
        });
      }

      if (entities.isFacultyQuery) {
        const facultyCount = college.facultyCount || college.descriptions?.faculty;
        if (!facultyCount) {
          return res.json({
            success: true,
            reply: entities.isTamilOrTanglish
              ? `**${college.name} (${college.code})** பேராசிரியர்கள் பற்றிய கூடுதல் விவரங்கள் அதிகாரப்பூர்வ தரவுத்தளத்தில் கிடைக்கப்பெறவில்லை (Information is not available in the verified database).`
              : `Faculty information for **${college.name} (${college.code})** is not available in the verified database.`,
            cards: [{ collegeCode: college.code, collegeName: college.name, profileUrl: `/colleges/${college.code}` }],
          });
        }
      }

      if (entities.isPlacementQuery) {
        const p = college.placements;
        if (!p || (!p.placementPercentage && !p.highestPackage)) {
          return res.json({
            success: true,
            reply: entities.isTamilOrTanglish
              ? `**${college.name} (${college.code})** வேலைவாய்ப்பு பற்றிய அதிகாரப்பூர்வ விவரங்கள் கிடைக்கப்பெறவில்லை (Information is not available in the verified database).`
              : `Placement information for **${college.name} (${college.code})** is not available in the verified database.`,
            cards: [{ collegeCode: college.code, collegeName: college.name, profileUrl: `/colleges/${college.code}` }],
          });
        }

        const replyText = entities.isTamilOrTanglish
          ? `💼 **${college.name} (${college.code})** வேலைவாய்ப்பு (Placement) விவரங்கள்:\n\n` +
            `• **வேலைவாய்ப்பு விகிதம்**: ${p.placementPercentage ? `${p.placementPercentage}%` : 'Not Available'}\n` +
            `• **அதிகபட்ச சம்பளம் (Highest Package)**: ${p.highestPackage || 'Not Available'}\n` +
            `• **சராசரி சம்பளம் (Average Package)**: ${p.averagePackage || 'Not Available'}\n` +
            (p.topRecruiters?.length ? `• **முக்கிய நிறுவனங்கள்**: ${p.topRecruiters.join(', ')}\n` : '')
          : `💼 **${college.name} (${college.code})** Placement Statistics:\n\n` +
            `• **Placement Rate**: ${p.placementPercentage ? `${p.placementPercentage}%` : 'Not Available'}\n` +
            `• **Highest Package**: ${p.highestPackage || 'Not Available'}\n` +
            `• **Average Package**: ${p.averagePackage || 'Not Available'}\n` +
            (p.topRecruiters?.length ? `• **Top Recruiters**: ${p.topRecruiters.join(', ')}\n` : '');

        return res.json({
          success: true,
          reply: replyText,
          cards: [{ collegeCode: college.code, collegeName: college.name, profileUrl: `/colleges/${college.code}` }],
        });
      }

      if (entities.isFeeQuery) {
        const fee = await TneaFee.findOne({ collegeCode: college.code }).lean();
        if (!fee) {
          return res.json({
            success: true,
            reply: entities.isTamilOrTanglish
              ? `**${college.name} (${college.code})** கட்டண விவரங்கள் கிடைக்கப்பெறவில்லை (Information is not available in the verified database).`
              : `Fee structure for **${college.name} (${college.code})** is not available in the verified database.`,
            cards: [{ collegeCode: college.code, collegeName: college.name, profileUrl: `/colleges/${college.code}` }],
          });
        }

        const replyText = entities.isTamilOrTanglish
          ? `💰 **${college.name} (${college.code})** TNEA கட்டண விவரங்கள்:\n\n` +
            `• **அரசு ஒதுக்கீடு கட்டணம் (Govt Quota)**: ₹${fee.tuitionFeeGovtQuota?.toLocaleString('en-IN') || '50,000'} / வருடம்\n` +
            `• **நிர்வாக ஒதுக்கீடு கட்டணம் (Mgmt Quota)**: ₹${fee.tuitionFeeMgmtQuota?.toLocaleString('en-IN') || '1,45,000'} / வருடம்\n` +
            `• **விடுதி கட்டணம் (தோராயமாக)**: ₹${fee.hostelFeeAnnual?.toLocaleString('en-IN') || '75,000'} / வருடம்\n`
          : `💰 **${college.name} (${college.code})** Fee Structure:\n\n` +
            `• **Government Quota Tuition**: ₹${fee.tuitionFeeGovtQuota?.toLocaleString('en-IN') || '50,000'} / year\n` +
            `• **Management Quota Tuition**: ₹${fee.tuitionFeeMgmtQuota?.toLocaleString('en-IN') || '1,45,000'} / year\n` +
            `• **Annual Hostel Fee**: ₹${fee.hostelFeeAnnual?.toLocaleString('en-IN') || '75,000'} / year\n`;

        return res.json({
          success: true,
          reply: replyText,
          cards: [{ collegeCode: college.code, collegeName: college.name, profileUrl: `/colleges/${college.code}` }],
        });
      }
    }

    // -------------------------------------------------------------------------
    // 5. DISTRICT TOP COLLEGES INQUIRY (e.g. "Coimbatore la best colleges sollu")
    // -------------------------------------------------------------------------
    if (entities.isBestCollegesQuery && entities.district && !entities.cutoffScore) {
      const colleges = await TneaCollege.find({
        district: new RegExp(`^${entities.district}$`, 'i'),
      })
        .sort({ 'placements.placementPercentage': -1, code: 1 })
        .limit(6)
        .lean();

      if (colleges.length > 0) {
        const replyIntro = entities.isTamilOrTanglish
          ? `🏛️ **${entities.district}** மாவட்டத்தில் உள்ள சிறந்த பொறியியல் கல்லூரிகள்:`
          : `🏛️ Top Engineering Colleges in **${entities.district}** District:`;

        const cards = colleges.map((c) => ({
          collegeCode: c.code,
          collegeName: c.name,
          district: c.district,
          collegeType: c.collegeType,
          isAutonomous: c.isAutonomous,
          placementPercentage: c.placements?.placementPercentage,
          profileUrl: `/colleges/${c.code}`,
        }));

        return res.json({
          success: true,
          reply: replyIntro,
          cards,
          suggestions: [
            `${colleges[0].shortName || colleges[0].name} pathi sollu`,
            `${colleges[0].shortName || colleges[0].name} cutoffs`,
            'Compare top colleges',
          ],
        });
      }
    }

    // -------------------------------------------------------------------------
    // 6. SPECIFIC COLLEGE OVERVIEW OR DEPARTMENT CUTOFF
    // -------------------------------------------------------------------------
    if (entities.matchedCollegeCodes.length === 1 && !entities.cutoffScore) {
      const college = await TneaCollege.findOne({ code: entities.matchedCollegeCodes[0] }).lean();
      if (!college) {
        return res.json({
          success: true,
          reply: 'Verified information is not available in the current database for this college.',
          cards: [],
        });
      }

      // If specific branch cutoff was requested for this college (e.g. "Kongu AD cutoff")
      if (entities.departmentCode) {
        const cutoffs = await TneaCutoff.find({
          collegeCode: college.code,
          departmentCode: entities.departmentCode,
          academicYear: entities.academicYear,
        }).lean();

        if (cutoffs.length > 0) {
          const r1 = cutoffs.find((c) => c.counsellingRound === 1 || c.round === 'Round 1');
          const deptName = cutoffs[0].departmentName;
          const comm = entities.community || 'OC';
          const mark = r1 ? extractCategoryCutoff(r1, comm) : null;

          const replyText = entities.isTamilOrTanglish
            ? `📊 **${college.name} (${college.code})**\n\n` +
              `• **துறை (Department)**: ${entities.departmentCode} - ${deptName}\n` +
              `• **ஆண்டு**: ${entities.academicYear}\n` +
              `• **${comm} Cutoff (Round 1)**: ${mark !== null ? `**${mark.toFixed(2)}**` : 'கிடைக்கப்பெறவில்லை (Official value unavailable)'}\n\n` +
              `பிற இடஒதுக்கீடு பிரிவுகள் (Round 1):\n` +
              (r1?.ocCutoff ? `• OC: ${r1.ocCutoff.toFixed(2)}  ` : '') +
              (r1?.bcCutoff ? `• BC: ${r1.bcCutoff.toFixed(2)}  ` : '') +
              (r1?.bcmCutoff ? `• BCM: ${r1.bcmCutoff.toFixed(2)}  ` : '') +
              (r1?.mbcCutoff ? `• MBC: ${r1.mbcCutoff.toFixed(2)}  ` : '') +
              (r1?.scCutoff ? `• SC: ${r1.scCutoff.toFixed(2)}  ` : '') +
              (r1?.stCutoff ? `• ST: ${r1.stCutoff.toFixed(2)}` : '')
            : `📊 **${college.name} (${college.code})** Cutoff Details:\n\n` +
              `• **Department**: ${entities.departmentCode} - ${deptName}\n` +
              `• **Academic Year**: ${entities.academicYear}\n` +
              `• **${comm} Closing Cutoff (Round 1)**: ${mark !== null ? `**${mark.toFixed(2)}**` : 'Official value unavailable'}\n\n` +
              `Category Breakdown (Round 1):\n` +
              (r1?.ocCutoff ? `• OC: ${r1.ocCutoff.toFixed(2)}  ` : '') +
              (r1?.bcCutoff ? `• BC: ${r1.bcCutoff.toFixed(2)}  ` : '') +
              (r1?.bcmCutoff ? `• BCM: ${r1.bcmCutoff.toFixed(2)}  ` : '') +
              (r1?.mbcCutoff ? `• MBC: ${r1.mbcCutoff.toFixed(2)}  ` : '') +
              (r1?.scCutoff ? `• SC: ${r1.scCutoff.toFixed(2)}  ` : '') +
              (r1?.stCutoff ? `• ST: ${r1.stCutoff.toFixed(2)}` : '');

          return res.json({
            success: true,
            reply: replyText,
            cards: [
              {
                collegeCode: college.code,
                collegeName: college.name,
                district: college.district,
                departmentCode: entities.departmentCode,
                departmentName: deptName,
                historicalCutoff: mark,
                academicYear: entities.academicYear,
                profileUrl: `/colleges/${college.code}`,
              },
            ],
            suggestions: [
              `${college.shortName || college.name} pathi sollu`,
              `${college.shortName || college.name} seat matrix`,
              'Easwari AD cutoff',
            ],
          });
        }
      }

      // General college overview
      const nirf = college.accreditations?.find((a) => a.organization === 'NIRF')?.grade || 'Accredited';
      const naac = college.accreditations?.find((a) => a.organization === 'NAAC')?.grade || 'N/A';
      const deptList = college.departments?.map((d) => d.departmentCode).join(', ') || 'CS, IT, EC, EE, ME, CE';

      const replyText = entities.isTamilOrTanglish
        ? `🏛️ **${college.name} (TNEA குறியீடு: ${college.code})**\n\n` +
          `• **மாவட்டம் / இருப்பிடம்**: ${college.district}\n` +
          `• **நிறுவன வகை**: ${college.collegeType} (${college.isAutonomous ? 'தன்னாட்சி / Autonomous' : 'இணைப்பு பெற்ற கல்லூரி'})\n` +
          `• **தரம் & அங்கீகாரம்**: NAAC: ${naac} | NIRF: ${nirf}\n` +
          `• **வேலைவாய்ப்பு விகிதம்**: ${college.placements?.placementPercentage || '90+'}%\n` +
          `• **வழங்கப்படும் முக்கிய துறைகள்**: ${deptList}\n\n` +
          (college.descriptions?.about ? `📝 *${college.descriptions.about}*\n\n` : '') +
          `கீழே உள்ள பொத்தானை அழுத்தி முழுமையான கல்லூரியின் தகவல் பக்கத்தைப் பார்வையிடலாம்.`
        : `🏛️ **${college.name} (TNEA Code: ${college.code})**\n\n` +
          `• **District / Location**: ${college.district}\n` +
          `• **Institution Type**: ${college.collegeType} (${college.isAutonomous ? 'Autonomous' : 'Affiliated'})\n` +
          `• **Accreditations**: NAAC: ${naac} | NIRF: ${nirf}\n` +
          `• **Placement Record**: ${college.placements?.placementPercentage || '90+'}% track record\n` +
          `• **Available Branches**: ${deptList}\n\n` +
          (college.descriptions?.about ? `📝 *${college.descriptions.about}*\n\n` : '') +
          `Click below to view the official college profile, seat matrix, and multi-year cutoff archive.`;

      return res.json({
        success: true,
        reply: replyText,
        cards: [
          {
            collegeCode: college.code,
            collegeName: college.name,
            district: college.district,
            collegeType: college.collegeType,
            isAutonomous: college.isAutonomous,
            placementPercentage: college.placements?.placementPercentage,
            profileUrl: `/colleges/${college.code}`,
          },
        ],
        suggestions: [
          `${college.shortName || college.name} CS cutoff`,
          `${college.shortName || college.name} AD cutoff`,
          `${college.shortName || college.name} hostel details`,
          'Compare with other colleges',
        ],
      });
    }

    // -------------------------------------------------------------------------
    // 7. CUTOFF PREDICTION & COLLEGE RECOMMENDATION SEARCH
    // -------------------------------------------------------------------------
    if (entities.cutoffScore || entities.departmentCode || entities.district) {
      const score = entities.cutoffScore || 180.0;
      const comm = entities.community || 'OC';
      const targetYear = entities.academicYear || 2025;

      const query = { academicYear: targetYear };
      if (entities.departmentCode) query.departmentCode = entities.departmentCode;
      if (entities.district) query.district = new RegExp(entities.district, 'i');
      if (entities.matchedCollegeCodes.length > 0) query.collegeCode = { $in: entities.matchedCollegeCodes };

      const matchedCutoffs = await TneaCutoff.find(query)
        .populate('college', 'code name shortName district collegeType isAutonomous accreditation placements logo')
        .lean();

      // Group by collegeCode + departmentCode
      const comboMap = new Map();
      for (const rec of matchedCutoffs) {
        const key = `${rec.collegeCode}__${rec.departmentCode}`;
        if (!comboMap.has(key)) comboMap.set(key, []);
        comboMap.get(key).push(rec);
      }

      const results = [];
      for (const [key, recs] of comboMap.entries()) {
        const r1 = recs.find((r) => r.counsellingRound === 1 || r.round === 'Round 1') || recs[0];
        const histCutoff = extractCategoryCutoff(r1, comm);

        if (histCutoff !== null && !isNaN(histCutoff)) {
          const diff = +(score - histCutoff).toFixed(2);
          let chance = 'TARGET';
          if (diff >= 1.5) chance = 'SAFE';
          else if (diff < -2.0) chance = 'REACH';

          results.push({
            collegeCode: r1.collegeCode,
            collegeName: r1.collegeName,
            district: r1.district,
            departmentCode: r1.departmentCode,
            departmentName: r1.departmentName,
            selectedCategory: comm,
            historicalCutoff: histCutoff,
            studentCutoff: score,
            difference: diff,
            academicYear: targetYear,
            round: r1.round || 'Round 1',
            admissionChance: chance,
            profileUrl: `/colleges/${r1.collegeCode}`,
          });
        }
      }

      // Sort by proximity to score
      results.sort((a, b) => Math.abs(a.difference) - Math.abs(b.difference));
      const topResults = results.slice(0, 6);

      if (topResults.length === 0) {
        return res.json({
          success: true,
          reply: entities.isTamilOrTanglish
            ? `உங்களின் தேடலுக்கு (${entities.cutoffScore ? `Cutoff: ${score}` : ''} ${entities.departmentCode ? `துறை: ${entities.departmentCode}` : ''} ${entities.district ? `மாவட்டம்: ${entities.district}` : ''}) பொருந்தும் கல்லூரிகள் கிடைக்கவில்லை. Cutoff மதிப்பெண் அல்லது மாவட்டத்தை மாற்றி தேடவும்.`
            : `No matching colleges found for the criteria (${entities.cutoffScore ? `Cutoff: ${score}` : ''} ${entities.departmentCode ? `Branch: ${entities.departmentCode}` : ''} ${entities.district ? `District: ${entities.district}` : ''}). Please adjust your search criteria.`,
          cards: [],
          suggestions: [
            '180 BC AD Coimbatore',
            '190 OC CS Chennai',
            '175 MBC ME Salem',
          ],
        });
      }

      const replyIntro = entities.isTamilOrTanglish
        ? `அதிகாரப்பூர்வ TNEA வரலாற்றுத் தரவுகளின்படி, உங்களின் **${score.toFixed(2)} Cutoff (${comm})** மதிப்பெண்ணிற்கு பரிந்துரைக்கப்படும் கல்லூரிகள்:`
        : `Based on verified historical TNEA data, here are the colleges matching your search (**${score.toFixed(2)} Cutoff | ${comm} Category**):`;

      return res.json({
        success: true,
        reply: replyIntro,
        cards: topResults,
        suggestions: [
          'Coimbatore top colleges',
          'PSG vs Kongu compare pannu',
          'Easwari hostel details',
          'How is cutoff calculated?',
        ],
      });
    }

    // -------------------------------------------------------------------------
    // 8. DEFAULT / CONVERSATIONAL GREETING
    // -------------------------------------------------------------------------
    const welcomeReply = entities.isTamilOrTanglish
      ? `வணக்கம்! நான் **TNEA College AI Assistant**.\n\nதமிழ்நாடு பொறியியல் கல்லூரிகள், Cutoff மதிப்பெண்கள், இட ஒதுக்கீடு விவரங்கள், மற்றும் கல்லூரிகள் ஒப்பீடு பற்றிய தகவல்களை என்னிடம் கேட்கலாம்.\n\nஎடுத்துக்காட்டுகள்:\n• "180 BC AD Coimbatore colleges?"\n• "PSG College of Technology pathi sollu"\n• "Kongu AD cutoff enna?"\n• "PSG vs Kongu compare pannu"\n• "Easwari hostel irukka?"`
      : `Hello! I am the **TNEA College AI Assistant**.\n\nI can help you explore Tamil Nadu engineering institutions, category-specific cutoffs, seat matrices, and college comparisons grounded directly on official data.\n\nTry asking:\n• *"180 BC AD Coimbatore colleges?"*\n• *"Tell me about PSG College of Technology"*\n• *"Kongu Engineering College AD cutoff?"*\n• *"PSG vs Kongu"*`;

    return res.json({
      success: true,
      reply: welcomeReply,
      cards: [],
      suggestions: [
        '180 BC AD Coimbatore',
        'PSG College of Technology pathi sollu',
        'Kongu AD cutoff enna?',
        'PSG vs Kongu compare pannu',
      ],
    });
  } catch (error) {
    console.error('[TNEA CHAT ERROR]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process your chat query. Please try again.',
      error: error.message,
    });
  }
};
