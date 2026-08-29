import TneaCollege from '../models/TneaCollege.js';
import TneaDepartment from '../models/TneaDepartment.js';
import TneaCutoff from '../models/TneaCutoff.js';
import TneaSeatMatrix from '../models/TneaSeatMatrix.js';
import TneaApplication from '../models/TneaApplication.js';
import TneaFavorite from '../models/TneaFavorite.js';
import TneaSearchAnalytics from '../models/TneaSearchAnalytics.js';
import TneaReport from '../models/TneaReport.js';

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
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { shortName: searchRegex },
        { code: searchRegex },
        { district: searchRegex },
        { city: searchRegex },
        { 'departments.name': searchRegex },
        { 'departments.departmentCode': searchRegex },
      ];
    }

    // District filter
    if (district && district !== 'All') {
      query.district = new RegExp(`^${district}$`, 'i');
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
    const departments = await TneaDepartment.find({ isActive: true }).sort({ name: 1 });
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

export const getCutoffs = async (req, res) => {
  try {
    const {
      year,
      collegeCode,
      collegeName,
      departmentCode,
      round,
      minCutoff,
      maxCutoff,
      district,
      community = 'ocCutoff',
      sortBy = 'ocCutoff',
      sortOrder = 'desc',
      page = 1,
      limit = 25,
    } = req.query;

    const query = {};

    if (year) query.academicYear = Number(year);
    if (collegeCode) query.collegeCode = collegeCode;
    if (collegeName) query.collegeName = new RegExp(collegeName.trim(), 'i');
    if (departmentCode && departmentCode !== 'All') query.departmentCode = departmentCode.toUpperCase();
    if (round && round !== 'All') query.round = round;
    if (district && district !== 'All') query.district = new RegExp(`^${district}$`, 'i');

    const communityField = community.endsWith('Cutoff') ? community : `${community.toLowerCase()}Cutoff`;

    if (minCutoff || maxCutoff) {
      query[communityField] = {};
      if (minCutoff) query[communityField].$gte = Number(minCutoff);
      if (maxCutoff) query[communityField].$lte = Number(maxCutoff);
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 25;
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await TneaCutoff.countDocuments(query);
    const cutoffs = await TneaCutoff.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('college', 'collegeType isAutonomous accreditation logo bannerImage district');

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

export const predictCutoff = async (req, res) => {
  try {
    const {
      cutoffMark,
      community = 'OC',
      preferredDepartments = [],
      preferredDistricts = [],
      academicYear = 2025,
    } = req.body;

    const score = Number(cutoffMark);
    if (!score || score < 50 || score > 200) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid cutoff mark between 50.00 and 200.00.',
      });
    }

    // Map community to field name
    const communityKeyMap = {
      OC: 'ocCutoff',
      BC: 'bcCutoff',
      BCM: 'bcmCutoff',
      MBC: 'mbcCutoff',
      'MBC/DNC': 'mbcCutoff',
      SC: 'scCutoff',
      SCA: 'scaCutoff',
      ST: 'stCutoff',
    };

    const targetField = communityKeyMap[community.toUpperCase()] || 'ocCutoff';

    const query = {
      academicYear: Number(academicYear),
      round: 'Round 1',
    };

    if (preferredDepartments && preferredDepartments.length > 0 && !preferredDepartments.includes('All')) {
      query.departmentCode = { $in: preferredDepartments.map((d) => d.toUpperCase()) };
    }

    if (preferredDistricts && preferredDistricts.length > 0 && !preferredDistricts.includes('All')) {
      query.district = { $in: preferredDistricts };
    }

    // Fetch all cutoff records matching criteria
    const cutoffRecords = await TneaCutoff.find(query).populate(
      'college',
      'collegeType isAutonomous accreditation placements logo district'
    );

    const goodChance = [];
    const moderateChance = [];
    const lowChance = [];

    cutoffRecords.forEach((record) => {
      const requiredCutoff = record[targetField] || record.ocCutoff;
      const difference = +(score - requiredCutoff).toFixed(2);

      const predictionItem = {
        cutoffId: record._id,
        collegeId: record.college?._id,
        collegeCode: record.collegeCode,
        collegeName: record.collegeName,
        district: record.district,
        departmentCode: record.departmentCode,
        departmentName: record.departmentName,
        historicalCutoff: requiredCutoff,
        studentCutoff: score,
        difference: difference,
        community: community,
        academicYear: record.academicYear,
        collegeType: record.college?.collegeType,
        isAutonomous: record.college?.isAutonomous,
        placementPercentage: record.college?.placements?.placementPercentage,
        logo: record.college?.logo,
      };

      if (difference >= 1.5) {
        // High probability / Safe zone
        predictionItem.chanceTier = 'Good Chance';
        predictionItem.chanceDescription = `Cutoff is ${Math.abs(difference)} marks above historical closing score. High admission probability.`;
        goodChance.push(predictionItem);
      } else if (difference >= -2.0 && difference < 1.5) {
        // Competitive / Target zone
        predictionItem.chanceTier = 'Moderate Chance';
        predictionItem.chanceDescription = `Cutoff is within close competitive range (diff: ${difference >= 0 ? '+' : ''}${difference}). Strong target choice.`;
        moderateChance.push(predictionItem);
      } else if (difference >= -6.0 && difference < -2.0) {
        // Dream / Reach zone
        predictionItem.chanceTier = 'Low Chance';
        predictionItem.chanceDescription = `Cutoff is ${Math.abs(difference)} marks below historical score. Can be kept as ambitious reach choice.`;
        lowChance.push(predictionItem);
      }
    });

    // Sort within each category by proximity
    goodChance.sort((a, b) => b.difference - a.difference);
    moderateChance.sort((a, b) => b.difference - a.difference);
    lowChance.sort((a, b) => b.difference - a.difference);

    // Track analytics
    TneaSearchAnalytics.create({
      query: `${score} | ${community}`,
      searchType: 'PREDICTOR',
      district: preferredDistricts.join(','),
      department: preferredDepartments.join(','),
    }).catch(() => {});

    res.json({
      success: true,
      disclaimer: 'This is an estimate based on historical cutoff data and does not guarantee admission.',
      summary: {
        studentCutoff: score,
        community: community,
        totalEvaluated: cutoffRecords.length,
        goodChanceCount: goodChance.length,
        moderateChanceCount: moderateChance.length,
        lowChanceCount: lowChance.length,
      },
      results: {
        goodChance,
        moderateChance,
        lowChance,
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
      round = 'Round 1',
      quota = 'Government',
      district,
      page = 1,
      limit = 30,
    } = req.query;

    const query = {};

    if (academicYear) query.academicYear = Number(academicYear);
    if (round && round !== 'All') query.round = round;
    if (quota && quota !== 'All' && quota !== 'Overall') query.quota = quota;
    if (collegeCode) query.collegeCode = collegeCode;
    if (departmentCode && departmentCode !== 'All') query.departmentCode = departmentCode.toUpperCase();
    if (district && district !== 'All') query.district = new RegExp(`^${district}$`, 'i');

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 30;
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await TneaSeatMatrix.countDocuments(query);
    const seats = await TneaSeatMatrix.find(query)
      .sort({ collegeCode: 1, departmentCode: 1 })
      .skip(skip)
      .limit(limitNum)
      .populate('college', 'collegeType isAutonomous accreditation logo district bannerImage');

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
      { $group: { _id: '$district', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const formatted = districts.map((d) => ({
      name: d._id,
      collegeCount: d.count,
    }));

    res.json({ success: true, data: formatted });
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


