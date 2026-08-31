import TneaCollege from '../models/TneaCollege.js';
import TneaDepartment from '../models/TneaDepartment.js';
import TneaCutoff from '../models/TneaCutoff.js';
import TneaSeatMatrix from '../models/TneaSeatMatrix.js';
import TneaApplication from '../models/TneaApplication.js';
import TneaFavorite from '../models/TneaFavorite.js';
import TneaSearchAnalytics from '../models/TneaSearchAnalytics.js';
import TneaReport from '../models/TneaReport.js';
import TneaFee from '../models/TneaFee.js';

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// ==========================================
// 1. COLLEGES CONTROLLER
// ==========================================

export const getColleges = async (req, res) => {
  try {
    const {
      search,
      district,
      collegeType,
      department,
      isAutonomous,
      hasHostel,
      minPlacement,
      accreditation,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    // Keyword Search
    if (search && search.trim()) {
      const searchRegex = new RegExp(escapeRegex(search.trim()), 'i');
      query.$or = [
        { name: searchRegex },
        { shortName: searchRegex },
        { code: searchRegex },
        { district: searchRegex },
        { city: searchRegex },
        { taluk: searchRegex },
        { 'departments.name': searchRegex },
        { 'departments.departmentCode': searchRegex },
      ];
    }

    // District filter
    if (district && district !== 'All') {
      query.district = new RegExp(`^${escapeRegex(district.trim())}$`, 'i');
    }

    // College Type filter
    if (collegeType && collegeType !== 'All') {
      query.collegeType = collegeType;
    }

    // Department filter
    if (department && department !== 'All') {
      query['departments.departmentCode'] = department.toUpperCase();
    }

    // Autonomous filter
    if (isAutonomous !== undefined && isAutonomous !== '') {
      query.isAutonomous = isAutonomous === 'true' || isAutonomous === true;
    }

    // Hostel filter
    if (hasHostel === 'true' || hasHostel === true) {
      query['facilities.hostel.available'] = true;
    }

    // Minimum Placement %
    if (minPlacement) {
      query['placements.placementPercentage'] = { $gte: Number(minPlacement) };
    }

    // Accreditation filter (NAAC A / A+ / A++)
    if (accreditation && accreditation !== 'All') {
      query['accreditation.naacGrade'] = accreditation;
    }

    // Sorting
    const sort = {};
    if (sortBy === 'cutoff') {
      sort['placements.placementPercentage'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'established') {
      sort.establishedYear = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'nirf') {
      sort['accreditation.nirfRank'] = 1;
    } else if (sortBy === 'code') {
      sort.code = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'completeness') {
      sort.dataCompleteness = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.name = sortOrder === 'desc' ? -1 : 1;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await TneaCollege.countDocuments(query);
    const colleges = await TneaCollege.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Track search query if present
    if (search) {
      TneaSearchAnalytics.create({
        query: search,
        searchType: 'COLLEGE',
        district: district || '',
        department: department || '',
      }).catch((e) => console.warn('Analytics logging error:', e.message));
    }

    res.json({
      success: true,
      data: colleges,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCollegeByIdOrCode = async (req, res) => {
  try {
    const { idOrCode } = req.params;

    let college = null;
    if (idOrCode.match(/^[0-9a-fA-F]{24}$/)) {
      college = await TneaCollege.findById(idOrCode);
    }

    if (!college) {
      college = await TneaCollege.findOne({ code: idOrCode });
    }

    if (!college) {
      return res.status(404).json({
        success: false,
        message: `College with code or ID "${idOrCode}" not found.`,
      });
    }

    // Fetch related cutoffs, seat matrices, and applications
    const cutoffs = await TneaCutoff.find({ collegeCode: college.code }).sort({ academicYear: -1, departmentCode: 1 });
    const seatMatrices = await TneaSeatMatrix.find({ collegeCode: college.code }).sort({ academicYear: -1, round: 1 });
    const applications = await TneaApplication.find({ collegeCode: college.code });

    res.json({
      success: true,
      data: {
        ...college.toObject(),
        cutoffs,
        seatMatrices,
        applications,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCollege = async (req, res) => {
  try {
    const existing = await TneaCollege.findOne({ code: req.body.code });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `College with code ${req.body.code} already exists.`,
      });
    }

    const college = await TneaCollege.create({ ...req.body, demoData: false });
    res.status(201).json({ success: true, data: college });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const college = await TneaCollege.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found.' });
    }

    res.json({ success: true, data: college });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const college = await TneaCollege.findByIdAndDelete(id);

    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found.' });
    }

    // Also clean up related records
    await TneaCutoff.deleteMany({ collegeCode: college.code });
    await TneaSeatMatrix.deleteMany({ collegeCode: college.code });
    await TneaApplication.deleteMany({ collegeCode: college.code });

    res.json({ success: true, message: `College ${college.name} (${college.code}) deleted successfully.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. DEPARTMENTS CONTROLLER
// ==========================================

export const getDepartments = async (req, res) => {
  try {
    const departments = await TneaDepartment.find({ isActive: { $ne: false } }).sort({ name: 1 });
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const department = await TneaDepartment.create(req.body);
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await TneaDepartment.findByIdAndUpdate(id, req.body, { new: true });
    if (!department) return res.status(404).json({ success: false, message: 'Department not found.' });
    res.json({ success: true, data: department });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await TneaDepartment.findByIdAndDelete(id);
    if (!department) return res.status(404).json({ success: false, message: 'Department not found.' });
    res.json({ success: true, message: 'Department deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. CUTOFFS & PREDICTOR CONTROLLER
// ==========================================

export const normalizeRound = (input) => {
  if (!input || input === 'All' || input === 'ALL' || input === '') return null;
  const str = String(input).trim().toLowerCase();
  if (str === '1' || str === 'round 1' || str === 'round1' || str === 'r1') return 1;
  if (str === '2' || str === 'round 2' || str === 'round2' || str === 'r2') return 2;
  if (str === '3' || str === 'round 3' || str === 'round3' || str === 'r3') return 3;
  if (str === '4' || str === 'round 4' || str === 'round4' || str === 'r4') return 4;
  return null;
};

export const getCutoffs = async (req, res) => {
  try {
    const {
      year,
      academicYear,
      collegeCode,
      collegeName,
      departmentCode,
      round,
      counsellingRound,
      minCutoff,
      maxCutoff,
      district,
      community = 'ocCutoff',
      sortBy = 'ocCutoff',
      sortOrder = 'desc',
      page = 1,
      limit = 25,
    } = req.query;

    const andConditions = [];

    // Academic Year
    const effectiveYear = academicYear || year;
    if (effectiveYear && effectiveYear !== 'All') {
      andConditions.push({ academicYear: Number(effectiveYear) });
    }

    // Official 4-digit College Code
    if (collegeCode && collegeCode.trim()) {
      andConditions.push({ collegeCode: collegeCode.trim() });
    }

    // Branch / Department Code
    if (departmentCode && departmentCode !== 'All') {
      andConditions.push({ departmentCode: departmentCode.toUpperCase() });
    }

    // Normalised Counselling Round
    const effectiveRoundInput = counsellingRound || round;
    const normRound = normalizeRound(effectiveRoundInput);
    if (normRound !== null) {
      andConditions.push({
        $or: [
          { counsellingRound: normRound },
          { round: `Round ${normRound}` },
          { round: String(normRound) },
        ],
      });
    }

    // District Filter
    if (district && district !== 'All') {
      andConditions.push({ district: new RegExp(`^${escapeRegex(district.trim())}$`, 'i') });
    }

    // Global Multi-field College / Code / Department search
    if (collegeName && collegeName.trim()) {
      const termRegex = new RegExp(escapeRegex(collegeName.trim()), 'i');
      if (!collegeCode) {
        andConditions.push({
          $or: [
            { collegeName: termRegex },
            { collegeCode: termRegex },
            { district: termRegex },
            { departmentName: termRegex },
            { departmentCode: termRegex },
          ],
        });
      } else {
        andConditions.push({ collegeName: termRegex });
      }
    }

    // Community Field Mapping
    let communityField = 'ocCutoff';
    if (community) {
      const c = community.trim();
      if (c === 'OC' || c === 'ocCutoff') communityField = 'ocCutoff';
      else if (c === 'BC' || c === 'bcCutoff') communityField = 'bcCutoff';
      else if (c === 'BCM' || c === 'bcmCutoff') communityField = 'bcmCutoff';
      else if (c === 'MBC' || c === 'MBC/DNC' || c === 'MBCDNC' || c === 'MBC_DNC' || c === 'mbcCutoff') communityField = 'mbcCutoff';
      else if (c === 'SC' || c === 'scCutoff') communityField = 'scCutoff';
      else if (c === 'SCA' || c === 'scaCutoff') communityField = 'scaCutoff';
      else if (c === 'ST' || c === 'stCutoff') communityField = 'stCutoff';
      else if (c.endsWith('Cutoff')) communityField = c;
    }

    // Min & Max Cutoff range on active community
    if (minCutoff !== undefined && minCutoff !== '' && !isNaN(Number(minCutoff))) {
      andConditions.push({ [communityField]: { $gte: Number(minCutoff) } });
    }
    if (maxCutoff !== undefined && maxCutoff !== '' && !isNaN(Number(maxCutoff))) {
      andConditions.push({ [communityField]: { $lte: Number(maxCutoff) } });
    }

    const query = andConditions.length > 0 ? { $and: andConditions } : {};

    const sortKey = sortBy === 'cutoff' || sortBy === 'minCutoff' ? communityField : sortBy;
    const sort = {};
    sort[sortKey] = sortOrder === 'asc' ? 1 : -1;
    sort.collegeCode = 1;
    sort.departmentCode = 1;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 25;
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await TneaCutoff.countDocuments(query);
    const cutoffs = await TneaCutoff.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('college', 'collegeType isAutonomous accreditation logo bannerImage district');

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[CUTOFF QUERY] year: ${effectiveYear || 'ALL'}, round: ${effectiveRoundInput || 'ALL'} (norm: ${normRound || 'ALL'}), college: ${collegeName || collegeCode || 'ALL'}, district: ${district || 'ALL'}, department: ${departmentCode || 'ALL'}, community: ${communityField}, minCutoff: ${minCutoff || 'NONE'} | DB Matches: ${totalCount}, Returned: ${cutoffs.length}`);
    }

    res.json({
      success: true,
      data: cutoffs,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Extract specific community cutoff without fallback substitution
export const extractCategoryCutoff = (record, community) => {
  if (!record) return null;
  const comm = (community || 'OC').toUpperCase().trim();
  let val = null;
  if (comm === 'OC') {
    val = record.ocCutoff ?? record.cutoff?.OC?.mark ?? record.cutoff?.OC ?? record.cutoff?.oc;
  } else if (comm === 'BC') {
    val = record.bcCutoff ?? record.cutoff?.BC?.mark ?? record.cutoff?.BC ?? record.cutoff?.bc;
  } else if (comm === 'BCM') {
    val = record.bcmCutoff ?? record.cutoff?.BCM?.mark ?? record.cutoff?.BCM ?? record.cutoff?.bcm;
  } else if (comm === 'MBC' || comm === 'MBC/DNC' || comm === 'MBCDNC' || comm === 'MBC_DNC') {
    val = record.mbcCutoff ?? record.mbcDncCutoff ?? record.cutoff?.MBC_DNC?.mark ?? record.cutoff?.MBC_DNC ?? record.cutoff?.MBC?.mark ?? record.cutoff?.MBC ?? record.cutoff?.mbc;
  } else if (comm === 'SC') {
    val = record.scCutoff ?? record.cutoff?.SC?.mark ?? record.cutoff?.SC ?? record.cutoff?.sc;
  } else if (comm === 'SCA') {
    val = record.scaCutoff ?? record.cutoff?.SCA?.mark ?? record.cutoff?.SCA ?? record.cutoff?.sca;
  } else if (comm === 'ST') {
    val = record.stCutoff ?? record.cutoff?.ST?.mark ?? record.cutoff?.ST ?? record.cutoff?.st;
  }

  if (val === null || val === undefined || isNaN(val)) return null;
  return Number(val);
};

export const predictCutoff = async (req, res) => {
  try {
    const {
      cutoffMark,
      cutoff,
      cutoffScore,
      community = 'OC',
      preferredDepartments = [],
      preferredDistricts = [],
      academicYear = 2025,
      counsellingRound,
      round,
      quota = 'Government',
    } = req.body;

    const score = Number(cutoffMark ?? cutoff ?? cutoffScore);
    if (!score || score < 50 || score > 200) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid cutoff mark between 50.00 and 200.00.',
      });
    }

    const normCommunity = (community || 'OC').toUpperCase().trim();
    const targetYear = Number(academicYear) || 2025;
    const requestedRoundNum = counsellingRound
      ? Number(counsellingRound)
      : (round === 'Round 2' ? 2 : (round === 'Round 3' ? 3 : (round === 'Round 1' ? 1 : null)));

    // Build query criteria
    const query = {};
    if (preferredDepartments && preferredDepartments.length > 0 && !preferredDepartments.includes('All')) {
      const depts = (Array.isArray(preferredDepartments) ? preferredDepartments : [preferredDepartments])
        .filter((d) => d && d !== 'All')
        .map((d) => d.toUpperCase().trim());
      if (depts.length > 0) {
        query.departmentCode = { $in: depts };
      }
    }

    if (preferredDistricts && preferredDistricts.length > 0 && !preferredDistricts.includes('All')) {
      const dists = (Array.isArray(preferredDistricts) ? preferredDistricts : [preferredDistricts])
        .filter((d) => d && d !== 'All')
        .map((d) => d.trim());
      if (dists.length > 0) {
        const distRegexes = dists.map((d) => new RegExp(`^${d}$`, 'i'));
        const matchingColleges = await TneaCollege.find({ district: { $in: distRegexes } }).select('_id code').lean();
        const collegeIds = matchingColleges.map((c) => c._id);
        const collegeCodes = matchingColleges.map((c) => c.code);

        query.$or = [
          { district: { $in: distRegexes } },
          { college: { $in: collegeIds } },
          { collegeCode: { $in: collegeCodes } },
        ];
      }
    }

    console.log('[PREDICTOR QUERY FILTER]', {
      cutoffMark: score,
      community: normCommunity,
      academicYear: targetYear,
      counsellingRound: requestedRoundNum,
      preferredDepartments,
      preferredDistricts,
      mongoFilter: query,
    });

    // Fetch all cutoff records matching department and district across years & rounds
    const allRecords = await TneaCutoff.find(query)
      .populate('college', 'code name shortName district collegeType isAutonomous accreditation placements logo bannerImage')
      .lean();

    // Group records by unique collegeCode + departmentCode
    const comboMap = new Map();
    for (const record of allRecords) {
      const key = `${record.collegeCode}__${record.departmentCode}`;
      if (!comboMap.has(key)) {
        comboMap.set(key, []);
      }
      comboMap.get(key).push(record);
    }

    const safeList = [];
    const targetList = [];
    const reachList = [];

    for (const [key, records] of comboMap.entries()) {
      // 1. Extract category cutoffs across all years and rounds strictly for the requested community
      const categoryEntries = [];
      for (const rec of records) {
        const catVal = extractCategoryCutoff(rec, normCommunity);
        if (catVal !== null && !isNaN(catVal)) {
          categoryEntries.push({
            year: rec.academicYear,
            round: rec.counsellingRound || (rec.round === 'Round 2' ? 2 : (rec.round === 'Round 3' ? 3 : 1)),
            roundName: rec.round || `Round ${rec.counsellingRound || 1}`,
            cutoff: catVal,
            record: rec,
          });
        }
      }

      // If no cutoff record exists for this specific category, do NOT silently use another category
      if (categoryEntries.length === 0) {
        continue;
      }

      // Representative record for metadata
      const baseRec = records.find((r) => r.academicYear === targetYear) || records[0];
      const collegeObj = baseRec.college;

      // 2. Identify target year round-wise cutoffs (or fallback to latest available year)
      let yearEntries = categoryEntries.filter((e) => e.year === targetYear);
      let isHistoricalFallback = false;
      if (yearEntries.length === 0) {
        const availableYears = [...new Set(categoryEntries.map((e) => e.year))].sort((a, b) => b - a);
        const fallbackYear = availableYears[0];
        yearEntries = categoryEntries.filter((e) => e.year === fallbackYear);
        isHistoricalFallback = true;
      }

      const r1Entry = yearEntries.find((e) => e.round === 1);
      const r2Entry = yearEntries.find((e) => e.round === 2);
      const r3Entry = yearEntries.find((e) => e.round === 3);

      const r1Cutoff = r1Entry ? r1Entry.cutoff : null;
      const r2Cutoff = r2Entry ? r2Entry.cutoff : null;
      const r3Cutoff = r3Entry ? r3Entry.cutoff : null;

      // 3. Determine counselling round based on user selection or auto best fit
      let bestRound = 'Round 1';
      let benchmarkCutoff = r1Cutoff;

      if (requestedRoundNum === 1) {
        bestRound = 'Round 1';
        benchmarkCutoff = r1Cutoff;
      } else if (requestedRoundNum === 2) {
        bestRound = 'Round 2';
        benchmarkCutoff = r2Cutoff;
      } else if (requestedRoundNum === 3) {
        bestRound = 'Round 3';
        benchmarkCutoff = r3Cutoff;
      } else {
        // Auto best round mode based on student's score
        if (r1Cutoff !== null && score >= r1Cutoff - 1.5) {
          bestRound = 'Round 1';
          benchmarkCutoff = r1Cutoff;
        } else if (r2Cutoff !== null && score >= r2Cutoff - 1.5) {
          bestRound = 'Round 2';
          benchmarkCutoff = r2Cutoff;
        } else if (r3Cutoff !== null && score >= r3Cutoff - 2.0) {
          bestRound = 'Round 3';
          benchmarkCutoff = r3Cutoff;
        } else {
          // Find the lowest round cutoff available
          if (r3Cutoff !== null) {
            bestRound = 'Round 3';
            benchmarkCutoff = r3Cutoff;
          } else if (r2Cutoff !== null) {
            bestRound = 'Round 2';
            benchmarkCutoff = r2Cutoff;
          } else if (r1Cutoff !== null) {
            bestRound = 'Round 1';
            benchmarkCutoff = r1Cutoff;
          } else {
            benchmarkCutoff = categoryEntries[0].cutoff;
          }
        }
      }

      // Log matched record for validation
      console.log('[PREDICTOR MATCH]', {
        collegeCode: baseRec.collegeCode,
        departmentCode: baseRec.departmentCode,
        community: normCommunity,
        academicYear: targetYear,
        round: bestRound,
        matchedCutoff: benchmarkCutoff,
      });

      // 4. Calculate multi-year historical trend & range
      const allCutoffValues = categoryEntries.map((e) => e.cutoff);
      const minCutoff = allCutoffValues.length > 0 ? Math.min(...allCutoffValues) : null;
      const maxCutoff = allCutoffValues.length > 0 ? Math.max(...allCutoffValues) : null;
      const avgCutoff = allCutoffValues.length > 0 ? +(allCutoffValues.reduce((a, b) => a + b, 0) / allCutoffValues.length).toFixed(2) : null;

      // Trend: compare recent year Round 1 with earlier year Round 1 (or available records)
      const sortedByYearR1 = categoryEntries.filter((e) => e.round === 1).sort((a, b) => a.year - b.year);
      let trendDelta = 0;
      let trendLabel = 'Insufficient verified data';
      if (sortedByYearR1.length >= 2) {
        const oldest = sortedByYearR1[0].cutoff;
        const newest = sortedByYearR1[sortedByYearR1.length - 1].cutoff;
        trendDelta = +(newest - oldest).toFixed(2);
        if (trendDelta > 0.3) trendLabel = `Increasing (+${trendDelta.toFixed(2)})`;
        else if (trendDelta < -0.3) trendLabel = `Decreasing (${trendDelta.toFixed(2)})`;
        else trendLabel = `Stable (±${Math.abs(trendDelta).toFixed(2)})`;
      }

      // 5. Compare student's score against historical benchmark
      const difference = benchmarkCutoff !== null ? +(score - benchmarkCutoff).toFixed(2) : null;

      const predictionItem = {
        cutoffId: baseRec._id,
        collegeId: collegeObj?._id,
        collegeCode: baseRec.collegeCode,
        collegeName: baseRec.collegeName,
        shortName: collegeObj?.shortName || baseRec.collegeName,
        district: baseRec.district,
        departmentCode: baseRec.departmentCode,
        departmentName: baseRec.departmentName,
        selectedCategory: normCommunity,
        community: normCommunity,
        studentCutoff: score,
        historicalCutoff: benchmarkCutoff,
        benchmarkRound: bestRound,
        bestCounsellingRound: bestRound,
        round1Cutoff: r1Cutoff,
        round2Cutoff: r2Cutoff,
        round3Cutoff: r3Cutoff,
        expectedCutoffRange: {
          min: minCutoff,
          max: maxCutoff,
          average: avgCutoff,
          display: minCutoff !== null && maxCutoff !== null ? `${minCutoff.toFixed(2)} - ${maxCutoff.toFixed(2)}` : 'Official value unavailable',
        },
        historicalCutoffTrend: trendLabel,
        isHistoricalFallback,
        academicYear: targetYear,
        difference: difference,
        collegeType: collegeObj?.collegeType || 'Affiliated',
        isAutonomous: collegeObj?.isAutonomous || false,
        placementPercentage: collegeObj?.placements?.placementPercentage || 85,
        logo: collegeObj?.logo || '',
        bannerImage: collegeObj?.bannerImage || '',
      };

      if (benchmarkCutoff === null) {
        predictionItem.historicalCutoff = null;
        predictionItem.expectedCutoffRange = { min: null, max: null, average: null, display: 'Official value unavailable' };
        predictionItem.historicalCutoffTrend = 'Insufficient verified data';
        predictionItem.bestCounsellingRound = 'Unavailable';
        predictionItem.dataStatus = 'UNAVAILABLE';
        continue;
      }

      // 6. Classification into SAFE, TARGET, REACH tiers
      if (difference >= 1.5) {
        // SAFE: Student cutoff is comfortably above historical closing score
        predictionItem.admissionChance = 'SAFE';
        predictionItem.chanceTier = 'Good Chance';
        predictionItem.chanceDescription = `Cutoff is ${Math.abs(difference).toFixed(2)} marks comfortably above historical ${normCommunity} closing score (${benchmarkCutoff.toFixed(2)}) in ${bestRound}. High admission probability.`;
        predictionItem.recommendationReason = `Your score of ${score.toFixed(2)} is ${difference.toFixed(2)} marks above the historical ${normCommunity} closing score of ${benchmarkCutoff.toFixed(2)} in ${bestRound}.`;
        safeList.push(predictionItem);
      } else if (difference >= -2.0 && difference < 1.5) {
        // TARGET: Student cutoff is close to historical closing score and realistic
        predictionItem.admissionChance = 'TARGET';
        predictionItem.chanceTier = 'Moderate Chance';
        predictionItem.chanceDescription = `Cutoff is within competitive proximity (${difference >= 0 ? '+' : ''}${difference.toFixed(2)} marks) of historical ${normCommunity} cutoff (${benchmarkCutoff.toFixed(2)}) in ${bestRound}. Strong target choice.`;
        predictionItem.recommendationReason = `Your score of ${score.toFixed(2)} is within close competitive proximity (${difference >= 0 ? '+' : ''}${difference.toFixed(2)}) of the historical ${normCommunity} closing score (${benchmarkCutoff.toFixed(2)}) in ${bestRound}.`;
        targetList.push(predictionItem);
      } else if (difference >= -6.0 && difference < -2.0) {
        // REACH: Student cutoff is below closing cutoff but round movement suggests a realistic possibility
        predictionItem.admissionChance = 'REACH';
        predictionItem.chanceTier = 'Low Chance';
        predictionItem.chanceDescription = `Cutoff is ${Math.abs(difference).toFixed(2)} marks below historical ${normCommunity} score (${benchmarkCutoff.toFixed(2)}), but feasible as an ambitious reach choice in ${bestRound}.`;
        predictionItem.recommendationReason = `Your score of ${score.toFixed(2)} is ${Math.abs(difference).toFixed(2)} marks below historical ${normCommunity} cutoff (${benchmarkCutoff.toFixed(2)}), but accessible as an ambitious choice in ${bestRound}.`;
        reachList.push(predictionItem);
      }
    }

    // 7. Sort within each tier
    // SAFE: highest safety margin first
    safeList.sort((a, b) => b.difference - a.difference);
    // TARGET: closest proximity to 0 difference first
    targetList.sort((a, b) => Math.abs(a.difference) - Math.abs(b.difference));
    // REACH: closest reach (lowest negative difference) first
    reachList.sort((a, b) => b.difference - a.difference);

    const allRecommendations = [...safeList, ...targetList, ...reachList];

    // Track analytics asynchronously
    TneaSearchAnalytics.create({
      query: `${score} | ${normCommunity}`,
      searchType: 'PREDICTOR',
      district: Array.isArray(preferredDistricts) ? preferredDistricts.join(',') : preferredDistricts,
      department: Array.isArray(preferredDepartments) ? preferredDepartments.join(',') : preferredDepartments,
    }).catch(() => {});

    res.json({
      success: true,
      disclaimer: 'This is an estimate based on historical cutoff data and does not guarantee admission.',
      summary: {
        studentCutoff: score,
        community: normCommunity,
        academicYear: targetYear,
        totalEvaluated: comboMap.size,
        safeCount: safeList.length,
        targetCount: targetList.length,
        reachCount: reachList.length,
        goodChanceCount: safeList.length,
        moderateChanceCount: targetList.length,
        lowChanceCount: reachList.length,
      },
      results: {
        safe: safeList,
        target: targetList,
        reach: reachList,
        goodChance: safeList,
        moderateChance: targetList,
        lowChance: reachList,
      },
      data: {
        safe: safeList,
        target: targetList,
        reach: reachList,
        goodChance: safeList,
        moderateChance: targetList,
        lowChance: reachList,
        allRecommendations,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCutoff = async (req, res) => {
  try {
    const cutoff = await TneaCutoff.create({ ...req.body, demoData: false });
    res.status(201).json({ success: true, data: cutoff });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCutoff = async (req, res) => {
  try {
    const { id } = req.params;
    const cutoff = await TneaCutoff.findByIdAndUpdate(id, req.body, { new: true });
    if (!cutoff) return res.status(404).json({ success: false, message: 'Cutoff record not found.' });
    res.json({ success: true, data: cutoff });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCutoff = async (req, res) => {
  try {
    const { id } = req.params;
    const cutoff = await TneaCutoff.findByIdAndDelete(id);
    if (!cutoff) return res.status(404).json({ success: false, message: 'Cutoff record not found.' });
    res.json({ success: true, message: 'Cutoff record deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkUploadCutoffs = async (req, res) => {
  try {
    const { records } = req.body;
    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid records array provided.' });
    }

    const successfulRecords = [];
    const duplicateRecords = [];
    const invalidRecords = [];

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rowNum = i + 1;

      // Validate required fields
      if (!row.collegeCode || !row.departmentCode || !row.academicYear || row.ocCutoff === undefined) {
        invalidRecords.push({ row: rowNum, data: row, reason: 'Missing mandatory fields (collegeCode, departmentCode, academicYear, ocCutoff).' });
        continue;
      }

      // Check duplicates in DB
      const existing = await TneaCutoff.findOne({
        collegeCode: row.collegeCode,
        departmentCode: row.departmentCode.toUpperCase(),
        academicYear: Number(row.academicYear),
        round: row.round || 'Round 1',
      });

      if (existing) {
        duplicateRecords.push({ row: rowNum, data: row, reason: `Record already exists for Code ${row.collegeCode}, Dept ${row.departmentCode}, Year ${row.academicYear}, ${row.round || 'Round 1'}` });
        continue;
      }

      // Find matching college if exists to link
      const college = await TneaCollege.findOne({ code: row.collegeCode });

      successfulRecords.push({
        college: college ? college._id : undefined,
        collegeCode: row.collegeCode,
        collegeName: row.collegeName || (college ? college.name : `College ${row.collegeCode}`),
        district: row.district || (college ? college.district : ''),
        departmentCode: row.departmentCode.toUpperCase(),
        departmentName: row.departmentName || `Department ${row.departmentCode}`,
        academicYear: Number(row.academicYear),
        round: row.round || 'Round 1',
        ocCutoff: Number(row.ocCutoff),
        bcCutoff: Number(row.bcCutoff ?? row.ocCutoff - 1.5),
        bcmCutoff: Number(row.bcmCutoff ?? row.ocCutoff - 2.5),
        mbcCutoff: Number(row.mbcCutoff ?? row.ocCutoff - 3.5),
        scCutoff: Number(row.scCutoff ?? row.ocCutoff - 12.0),
        scaCutoff: Number(row.scaCutoff ?? row.ocCutoff - 15.0),
        stCutoff: Number(row.stCutoff ?? row.ocCutoff - 20.0),
        openingRank: Number(row.openingRank || 1),
        closingRank: Number(row.closingRank || 10000),
        demoData: false,
      });
    }

    // Insert valid batch
    let insertedCount = 0;
    if (successfulRecords.length > 0) {
      const inserted = await TneaCutoff.insertMany(successfulRecords);
      insertedCount = inserted.length;
    }

    res.json({
      success: true,
      message: `Bulk cutoff processing completed. Inserted: ${insertedCount}, Duplicates: ${duplicateRecords.length}, Invalid: ${invalidRecords.length}`,
      report: {
        totalReceived: records.length,
        successfulCount: insertedCount,
        duplicateCount: duplicateRecords.length,
        invalidCount: invalidRecords.length,
        duplicateRecords,
        invalidRecords,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. SEAT MATRIX CONTROLLER
// ==========================================

export const getSeatMatrices = async (req, res) => {
  try {
    const {
      collegeCode,
      departmentCode,
      academicYear = 2025,
      round,
      counsellingRound,
      quota,
      district,
      page = 1,
      limit = 50,
    } = req.query;

    const andConditions = [];

    // Academic Year
    if (academicYear && academicYear !== 'All') {
      const yearNum = parseInt(String(academicYear), 10);
      if (!isNaN(yearNum)) andConditions.push({ academicYear: yearNum });
    }

    // College Code
    if (collegeCode && collegeCode.trim()) {
      andConditions.push({ collegeCode: collegeCode.trim() });
    }

    // Department Code
    if (departmentCode && departmentCode !== 'All') {
      andConditions.push({ departmentCode: departmentCode.toUpperCase().trim() });
    }

    // Normalised Counselling Round
    const effectiveRoundInput = counsellingRound || round;
    const normRound = normalizeRound(effectiveRoundInput);
    if (normRound !== null) {
      andConditions.push({
        $or: [
          { counsellingRound: normRound },
          { round: `Round ${normRound}` },
          { round: String(normRound) },
        ],
      });
    }

    // Admission Quota Normalization
    if (quota && quota !== 'All' && quota !== 'Overall') {
      const qLower = quota.trim().toLowerCase();
      if (qLower.includes('gov') || qLower.includes('tnea')) {
        andConditions.push({ quota: 'Government' });
      } else if (qLower.includes('mgmt') || qLower.includes('management')) {
        andConditions.push({ quota: 'Management' });
      } else {
        andConditions.push({ quota: quota.trim() });
      }
    }

    // District
    if (district && district !== 'All') {
      andConditions.push({ district: new RegExp(`^${escapeRegex(district.trim())}$`, 'i') });
    }

    const query = andConditions.length > 0 ? { $and: andConditions } : {};

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await TneaSeatMatrix.countDocuments(query);
    const seats = await TneaSeatMatrix.find(query)
      .sort({ collegeCode: 1, departmentCode: 1 })
      .skip(skip)
      .limit(limitNum)
      .populate('college', 'collegeType isAutonomous accreditation logo district bannerImage');

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[SEAT MATRIX QUERY] College: ${collegeCode || 'ALL'}, Dept: ${departmentCode || 'ALL'}, Year: ${academicYear || 'ALL'}, Round: ${effectiveRoundInput || 'ALL'} (norm: ${normRound || 'ALL'}), Quota: ${quota || 'ALL'} | DB Matches: ${totalCount}`);
    }

    res.json({
      success: true,
      data: seats,
      lastUpdated: new Date(),
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createSeatMatrix = async (req, res) => {
  try {
    const seat = await TneaSeatMatrix.create({ ...req.body, lastUpdated: new Date(), demoData: false });
    res.status(201).json({ success: true, data: seat });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateSeatMatrix = async (req, res) => {
  try {
    const { id } = req.params;
    const seat = await TneaSeatMatrix.findByIdAndUpdate(
      id,
      { ...req.body, lastUpdated: new Date() },
      { new: true }
    );
    if (!seat) return res.status(404).json({ success: false, message: 'Seat matrix not found.' });
    res.json({ success: true, data: seat });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteSeatMatrix = async (req, res) => {
  try {
    const { id } = req.params;
    const seat = await TneaSeatMatrix.findByIdAndDelete(id);
    if (!seat) return res.status(404).json({ success: false, message: 'Seat matrix not found.' });
    res.json({ success: true, message: 'Seat matrix deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkUploadSeatMatrices = async (req, res) => {
  try {
    const { records } = req.body;
    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid records array provided.' });
    }

    const successfulRecords = [];
    const duplicateRecords = [];
    const invalidRecords = [];

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rowNum = i + 1;

      if (!row.collegeCode || !row.departmentCode || !row.totalIntake) {
        invalidRecords.push({ row: rowNum, data: row, reason: 'Missing mandatory fields (collegeCode, departmentCode, totalIntake).' });
        continue;
      }

      const college = await TneaCollege.findOne({ code: row.collegeCode });

      // Build categories array if provided or generate default breakdown
      let categories = row.categories;
      if (!categories || !Array.isArray(categories)) {
        const total = Number(row.totalIntake);
        const filled = Number(row.totalFilled || 0);
        categories = [
          { category: 'OC', totalSeats: Math.round(total * 0.31), filledSeats: Math.round(filled * 0.31), availableSeats: Math.round((total - filled) * 0.31) },
          { category: 'BC', totalSeats: Math.round(total * 0.265), filledSeats: Math.round(filled * 0.265), availableSeats: Math.round((total - filled) * 0.265) },
          { category: 'BCM', totalSeats: Math.max(1, Math.round(total * 0.035)), filledSeats: Math.round(filled * 0.035), availableSeats: Math.max(1, Math.round((total - filled) * 0.035)) },
          { category: 'MBC/DNC', totalSeats: Math.round(total * 0.20), filledSeats: Math.round(filled * 0.20), availableSeats: Math.round((total - filled) * 0.20) },
          { category: 'SC', totalSeats: Math.round(total * 0.15), filledSeats: Math.round(filled * 0.15), availableSeats: Math.round((total - filled) * 0.15) },
          { category: 'SCA', totalSeats: Math.max(1, Math.round(total * 0.03)), filledSeats: Math.round(filled * 0.03), availableSeats: Math.max(1, Math.round((total - filled) * 0.03)) },
          { category: 'ST', totalSeats: Math.max(1, Math.round(total * 0.01)), filledSeats: Math.round(filled * 0.01), availableSeats: Math.max(1, Math.round((total - filled) * 0.01)) },
        ];
      }

      successfulRecords.push({
        college: college ? college._id : undefined,
        collegeCode: row.collegeCode,
        collegeName: row.collegeName || (college ? college.name : `College ${row.collegeCode}`),
        district: row.district || (college ? college.district : ''),
        departmentCode: row.departmentCode.toUpperCase(),
        departmentName: row.departmentName || `Department ${row.departmentCode}`,
        academicYear: Number(row.academicYear || 2025),
        round: row.round || 'Round 1',
        quota: row.quota || 'Government',
        categories: categories,
        totalIntake: Number(row.totalIntake),
        totalFilled: Number(row.totalFilled || 0),
        totalAvailable: Number(row.totalIntake) - Number(row.totalFilled || 0),
        lastUpdated: new Date(),
        demoData: false,
      });
    }

    let insertedCount = 0;
    if (successfulRecords.length > 0) {
      const inserted = await TneaSeatMatrix.insertMany(successfulRecords);
      insertedCount = inserted.length;
    }

    res.json({
      success: true,
      message: `Bulk seat matrix processing completed. Inserted: ${insertedCount}, Duplicates: ${duplicateRecords.length}, Invalid: ${invalidRecords.length}`,
      report: {
        totalReceived: records.length,
        successfulCount: insertedCount,
        duplicateCount: duplicateRecords.length,
        invalidCount: invalidRecords.length,
        duplicateRecords,
        invalidRecords,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. APPLICATIONS CONTROLLER
// ==========================================

export const getApplications = async (req, res) => {
  try {
    const { status, type, academicYear = 2025 } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (type && type !== 'All') query.applicationType = type;
    if (academicYear) query.academicYear = Number(academicYear);

    const applications = await TneaApplication.find(query).sort({ status: 1, closingDate: 1 });
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createApplication = async (req, res) => {
  try {
    const app = await TneaApplication.create(req.body);
    res.status(201).json({ success: true, data: app });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const app = await TneaApplication.findByIdAndUpdate(id, req.body, { new: true });
    if (!app) return res.status(404).json({ success: false, message: 'Application record not found.' });
    res.json({ success: true, data: app });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const app = await TneaApplication.findByIdAndDelete(id);
    if (!app) return res.status(404).json({ success: false, message: 'Application record not found.' });
    res.json({ success: true, message: 'Application record deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 6. COLLEGE COMPARISON CONTROLLER
// ==========================================

export const compareColleges = async (req, res) => {
  try {
    const { codes } = req.query;
    if (!codes) {
      return res.status(400).json({ success: false, message: 'Please provide comma-separated college codes to compare.' });
    }

    const codeList = codes.split(',').map((c) => c.trim()).filter(Boolean).slice(0, 4);

    if (codeList.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one valid college code required.' });
    }

    const colleges = await TneaCollege.find({ code: { $in: codeList } });

    // Fetch cutoffs and seat matrices for each
    const comparisonData = await Promise.all(
      colleges.map(async (college) => {
        const cutoffs = await TneaCutoff.find({ collegeCode: college.code, academicYear: 2025, round: 'Round 1' });
        const seats = await TneaSeatMatrix.find({ collegeCode: college.code, academicYear: 2025, round: 'Round 1' });

        return {
          college: college,
          cutoffs: cutoffs,
          seats: seats,
        };
      })
    );

    // Track analytics
    TneaSearchAnalytics.create({
      query: codeList.join(','),
      searchType: 'COMPARE',
    }).catch(() => {});

    res.json({
      success: true,
      data: comparisonData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 7. FAVORITES CONTROLLER (STUDENT)
// ==========================================

export const getFavorites = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required to view favorites.' });
    }

    const favorites = await TneaFavorite.find({ user: req.user._id })
      .populate('college')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required to save favorites.' });
    }

    const { collegeId, savedDepartments = [] } = req.body;
    const college = await TneaCollege.findById(collegeId);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found.' });
    }

    const existing = await TneaFavorite.findOne({ user: req.user._id, college: collegeId });

    if (existing) {
      await TneaFavorite.findByIdAndDelete(existing._id);
      return res.json({ success: true, action: 'removed', message: `${college.name} removed from your favorites.` });
    } else {
      const newFav = await TneaFavorite.create({
        user: req.user._id,
        college: collegeId,
        collegeCode: college.code,
        savedDepartments,
      });
      return res.json({ success: true, action: 'added', data: newFav, message: `${college.name} saved to your favorites!` });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 8. ANALYTICS & METADATA CONTROLLER
// ==========================================

export const getHubAnalytics = async (req, res) => {
  try {
    const totalColleges = await TneaCollege.countDocuments();
    const totalDepartments = await TneaDepartment.countDocuments({ isActive: true });
    const totalCutoffs = await TneaCutoff.countDocuments();
    const totalSeatRecords = await TneaSeatMatrix.countDocuments();
    const totalApplications = await TneaApplication.countDocuments();

    // Aggregations
    const districtBreakdown = await TneaCollege.aggregate([
      { $group: { _id: '$district', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const typeBreakdown = await TneaCollege.aggregate([
      { $group: { _id: '$collegeType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const popularSearches = await TneaSearchAnalytics.aggregate([
      { $match: { query: { $exists: true, $ne: '' } } },
      { $group: { _id: '$query', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalColleges,
          totalDepartments,
          totalCutoffs,
          totalSeatRecords,
          totalApplications,
          academicYearsSupported: [2024, 2025, 2026],
          lastUpdated: new Date(),
        },
        districtBreakdown,
        typeBreakdown,
        popularSearches,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDistricts = async (req, res) => {
  try {
    const districts = await TneaCollege.aggregate([
      { $match: { district: { $ne: null, $ne: '' } } },
      { $group: { _id: '$district', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const formatted = districts.map((d) => ({
      name: d._id,
      collegeCount: d.count,
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 9. DATA VERIFICATION & PROVENANCE STATS
// ==========================================

export const getDataVerificationStats = async (req, res) => {
  try {
    const totalCutoffs = await TneaCutoff.countDocuments();
    const totalSeats = await TneaSeatMatrix.countDocuments();
    const totalRecords = totalCutoffs + totalSeats;

    // Cutoff provenance counts
    const cutoffOfficial = await TneaCutoff.countDocuments({ dataType: 'OFFICIAL' });
    const cutoffDemo = await TneaCutoff.countDocuments({ dataType: 'DEMO' });
    const cutoffImported = await TneaCutoff.countDocuments({ dataType: 'IMPORTED' });
    const cutoffMissingSource = await TneaCutoff.countDocuments({ $or: [{ source: { $exists: false } }, { source: '' }] });
    const cutoffMissingYear = await TneaCutoff.countDocuments({ $or: [{ academicYear: { $exists: false } }, { academicYear: null }] });
    const cutoffMissingCode = await TneaCutoff.countDocuments({ $or: [{ collegeCode: { $exists: false } }, { collegeCode: '' }] });

    // Seat provenance counts
    const seatOfficial = await TneaSeatMatrix.countDocuments({ dataType: 'OFFICIAL' });
    const seatDemo = await TneaSeatMatrix.countDocuments({ dataType: 'DEMO' });
    const seatImported = await TneaSeatMatrix.countDocuments({ dataType: 'IMPORTED' });
    const seatMissingSource = await TneaSeatMatrix.countDocuments({ $or: [{ source: { $exists: false } }, { source: '' }] });

    // Academic Years distribution
    const yearsDistribution = await TneaCutoff.aggregate([
      { $group: { _id: '$academicYear', count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalRecords,
          totalCutoffs,
          totalSeats,
          officialRecords: cutoffOfficial + seatOfficial,
          demoRecords: cutoffDemo + seatDemo,
          importedRecords: cutoffImported + seatImported,
          recordsMissingSource: cutoffMissingSource + seatMissingSource,
          recordsMissingYear: cutoffMissingYear,
          recordsMissingCollegeCode: cutoffMissingCode,
        },
        yearsDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 8. DISTRICTS DIRECTORY
// ==========================================

export const getDistrictDirectory = async (req, res) => {
  try {
    const districts = await TneaCollege.aggregate([
      {
        $group: {
          _id: '$district',
          collegeCount: { $sum: 1 },
          autonomousCount: { $sum: { $cond: ['$isAutonomous', 1, 0] } },
          govtCount: {
            $sum: {
              $cond: [
                { $in: ['$collegeType', ['Government', 'Government Aided', 'University Department', 'University Constituent College']] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = districts.map((d) => ({
      district: d._id,
      collegeCount: d.collegeCount,
      autonomousCount: d.autonomousCount,
      govtCount: d.govtCount,
    }));

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 9. DATA SOURCES & PROVENANCE REGISTRY
// ==========================================

export const getDataSourcesRegistry = async (req, res) => {
  try {
    const sources = [
      {
        priority: 1,
        name: 'Directorate of Technical Education (DOTE) / TNEA Official Counselling Portal',
        organization: 'Government of Tamil Nadu',
        website: 'https://www.tneaonline.org',
        type: 'Primary Government Authority',
        dataCovered: 'TNEA College Codes, Opening/Closing Cutoffs (2021–2026), Community Category Reservation Quotas (OC, BC, BCM, MBC, SC, SCA, ST), Seat Availability Matrix.',
        reliabilityTier: 'Official & Binding (Gazette Level)',
        lastUpdated: '2026-08-25',
      },
      {
        priority: 2,
        name: 'Anna University Affiliation & Academic Courses Portal',
        organization: 'Anna University, Chennai',
        website: 'https://www.annauniv.edu',
        type: 'Affiliating University Repository',
        dataCovered: 'Constituent Colleges, Autonomous Status Conferment, Affiliated Engineering Institutions, Approved Branch Sanctioned Intake.',
        reliabilityTier: 'University Official',
        lastUpdated: '2026-08-20',
      },
      {
        priority: 3,
        name: 'National Institutional Ranking Framework (NIRF)',
        organization: 'Ministry of Education, Govt. of India',
        website: 'https://www.nirfindia.org',
        type: 'National Ranking & Research Metrics',
        dataCovered: 'All India Engineering Ranks, Research Output, Median Salary Packages, Faculty-to-Student Ratios.',
        reliabilityTier: 'National Statutory Body',
        lastUpdated: '2024-06-05',
      },
      {
        priority: 4,
        name: 'National Assessment and Accreditation Council (NAAC)',
        organization: 'University Grants Commission (UGC)',
        website: 'http://naac.gov.in',
        type: 'Institutional Quality Certification',
        dataCovered: 'NAAC Institutional Accreditation Grades (A++, A+, A, B++), CGPA Scores, Cycle Validity Periods.',
        reliabilityTier: 'Statutory Body',
        lastUpdated: '2024-03-12',
      },
      {
        priority: 5,
        name: 'Verified Institutional Portals & AICTE Mandatory Public Disclosures',
        organization: 'Individual Engineering Colleges & AICTE',
        website: 'Institutional Web Portals',
        type: 'College Official Data',
        dataCovered: 'Campus Facilities, Hostels, Transport Bus Routes, Detailed Placements, Recruiters, Student Life, and Admission Helpdesks.',
        reliabilityTier: 'College Official Verified',
        lastUpdated: '2026-08-25',
      },
    ];

    const stats = await TneaCollege.aggregate([
      {
        $group: {
          _id: null,
          totalColleges: { $sum: 1 },
          avgCompleteness: { $avg: '$dataCompleteness' },
          officialVerified: { $sum: { $cond: [{ $eq: ['$verificationStatus', 'OFFICIAL'] }, 1, 0] } },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        sources,
        integrityStats: {
          totalColleges: stats[0]?.totalColleges || 0,
          averageCompleteness: Math.round(stats[0]?.avgCompleteness || 85),
          officialVerified: stats[0]?.officialVerified || 0,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 10. STUDENT ERROR REPORTING SYSTEM
// ==========================================

export const reportIncorrectInfo = async (req, res) => {
  try {
    const { idOrCode } = req.params;
    const { issueType, description, suggestedCorrection, sourceProofUrl, reporterName, reporterEmail } = req.body;

    if (!issueType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide issue type and a detailed description of the correction.',
      });
    }

    let college = null;
    if (idOrCode.match(/^[0-9a-fA-F]{24}$/)) {
      college = await TneaCollege.findById(idOrCode);
    }
    if (!college) {
      college = await TneaCollege.findOne({ code: idOrCode });
    }

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found.',
      });
    }

    const report = await TneaReport.create({
      college: college._id,
      collegeCode: college.code,
      collegeName: college.name,
      issueType,
      description,
      suggestedCorrection: suggestedCorrection || '',
      sourceProofUrl: sourceProofUrl || '',
      reporterName: reporterName || 'Student Contributor',
      reporterEmail: reporterEmail || '',
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your correction report has been submitted to the admin team for verification.',
      data: report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await TneaReport.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const report = await TneaReport.findByIdAndUpdate(
      id,
      { status, adminNotes },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFees = async (req, res) => {
  try {
    const { collegeCode, academicYear = 2025 } = req.query;
    const query = {};
    if (collegeCode) query.collegeCode = collegeCode;
    if (academicYear) query.academicYear = Number(academicYear);

    const fees = await TneaFee.find(query);
    res.json({ success: true, data: fees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const syncMasterData = async (req, res) => {
  try {
    const { seedTneaData } = await import('../seed/tneaSeedData.js');
    await seedTneaData();

    const totalColleges = await TneaCollege.countDocuments();
    const totalDepartments = await TneaDepartment.countDocuments();
    const totalCutoffs = await TneaCutoff.countDocuments();
    const totalSeats = await TneaSeatMatrix.countDocuments();
    const districts = await TneaCollege.distinct('district');

    res.json({
      success: true,
      message: 'Master dataset synchronized successfully.',
      data: {
        totalColleges,
        totalDepartments,
        totalCutoffs,
        totalSeats,
        totalDistricts: districts.length,
        districts,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};





