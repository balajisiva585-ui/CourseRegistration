import TneaCollege from '../models/TneaCollege.js';
import TneaDepartment from '../models/TneaDepartment.js';
import TneaCutoff from '../models/TneaCutoff.js';
import TneaSeatMatrix from '../models/TneaSeatMatrix.js';
import TneaSimulation from '../models/TneaSimulation.js';

// Map community code to model field
export const getCutoffField = (community) => {
  const comm = (community || 'OC').toUpperCase().trim();
  switch (comm) {
    case 'OC':
      return 'ocCutoff';
    case 'BC':
      return 'bcCutoff';
    case 'BCM':
      return 'bcmCutoff';
    case 'MBC/DNC':
    case 'MBC':
    case 'MBCDNC':
      return 'mbcCutoff';
    case 'SC':
      return 'scCutoff';
    case 'SCA':
      return 'scaCutoff';
    case 'ST':
      return 'stCutoff';
    default:
      return 'ocCutoff';
  }
};

export const getCommunityCutoff = (record, community) => {
  if (!record) return null;
  const comm = (community || 'OC').toUpperCase().trim();
  let val = null;
  if (comm === 'OC') val = record.ocCutoff ?? record.cutoff?.oc;
  else if (comm === 'BC') val = record.bcCutoff ?? record.cutoff?.bc;
  else if (comm === 'BCM') val = record.bcmCutoff ?? record.cutoff?.bcm;
  else if (comm === 'MBC' || comm === 'MBC/DNC' || comm === 'MBCDNC') val = record.mbcCutoff ?? record.cutoff?.mbc;
  else if (comm === 'SC') val = record.scCutoff ?? record.cutoff?.sc;
  else if (comm === 'SCA') val = record.scaCutoff ?? record.cutoff?.sca;
  else if (comm === 'ST') val = record.stCutoff ?? record.cutoff?.st;

  if (val === null || val === undefined || isNaN(val)) return null;
  return Number(val);
};

/**
 * @desc Calculate TNEA Normalized Cutoff from subject marks
 * @route POST /api/tnea/simulator/calculate
 */
export const calculateCutoff = async (req, res, next) => {
  try {
    const { maths, physics, chemistry } = req.body;

    const m = Number(maths);
    const p = Number(physics);
    const c = Number(chemistry);

    if (isNaN(m) || isNaN(p) || isNaN(c)) {
      return res.status(400).json({ success: false, message: 'Maths, Physics, and Chemistry marks must be numeric.' });
    }

    if (m < 0 || m > 100 || p < 0 || p > 100 || c < 0 || c > 100) {
      return res.status(400).json({ success: false, message: 'Marks must be between 0 and 100.' });
    }

    // TNEA Formula: Maths (100) + Physics (50) + Chemistry (50) = 200 Cutoff
    const cutoff = +(m + p / 2 + c / 2).toFixed(2);

    return res.status(200).json({
      success: true,
      data: {
        maths: m,
        physics: p,
        chemistry: c,
        engineeringCutoff: cutoff,
        maxMarks: 200,
        formula: 'Maths + (Physics / 2) + (Chemistry / 2)',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get Smart College Suggestions (Safe, Target, Dream)
 * @route POST /api/tnea/simulator/suggestions
 */
export const getSmartSuggestions = async (req, res, next) => {
  try {
    const { cutoff, community = 'BC', preferredBranches = [], preferredDistricts = [], quota = 'Government', academicYear = 2025 } = req.body;

    const studentCutoff = Number(cutoff);
    if (isNaN(studentCutoff) || studentCutoff < 50 || studentCutoff > 200) {
      return res.status(400).json({ success: false, message: 'Valid cutoff between 50 and 200 is required.' });
    }

    const normCommunity = (community || 'BC').toUpperCase().trim();

    // Build query filters
    const query = { academicYear: Number(academicYear), round: 'Round 1' };
    if (preferredBranches.length > 0 && !preferredBranches.includes('All')) query.departmentCode = { $in: preferredBranches };
    if (preferredDistricts.length > 0 && !preferredDistricts.includes('All')) query.district = { $in: preferredDistricts };

    const cutoffs = await TneaCutoff.find(query)
      .populate('college', 'code name shortName district collegeType isAutonomous accreditation placements logo')
      .lean();

    const safeChoices = [];
    const targetChoices = [];
    const dreamChoices = [];

    for (const c of cutoffs) {
      const historicalCutoff = getCommunityCutoff(c, normCommunity);
      if (historicalCutoff === null) continue;

      const diff = +(studentCutoff - historicalCutoff).toFixed(2);

      const item = {
        collegeCode: c.collegeCode,
        collegeName: c.collegeName,
        shortName: c.college?.shortName || c.collegeName,
        district: c.district,
        collegeType: c.college?.collegeType || 'Autonomous',
        isAutonomous: c.college?.isAutonomous || false,
        departmentCode: c.departmentCode,
        departmentName: c.departmentName,
        historicalCutoff,
        studentCutoff,
        difference: diff,
        community: normCommunity,
        placementPercentage: c.college?.placements?.placementPercentage || 85,
        logo: c.college?.logo,
      };

      if (diff >= 1.5) {
        safeChoices.push({ ...item, category: 'Safe', chanceTier: 'Good Chance', badgeColor: '#059669' });
      } else if (diff >= -2.0 && diff < 1.5) {
        targetChoices.push({ ...item, category: 'Target', chanceTier: 'Moderate Chance', badgeColor: '#2563eb' });
      } else if (diff >= -6.0 && diff < -2.0) {
        dreamChoices.push({ ...item, category: 'Dream', chanceTier: 'Low Chance', badgeColor: '#d97706' });
      }
    }

    // Sort target choices by closest difference
    targetChoices.sort((a, b) => Math.abs(a.difference) - Math.abs(b.difference));
    safeChoices.sort((a, b) => b.difference - a.difference);
    dreamChoices.sort((a, b) => b.difference - a.difference);

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalSuggestions: safeChoices.length + targetChoices.length + dreamChoices.length,
          safeCount: safeChoices.length,
          targetCount: targetChoices.length,
          dreamCount: dreamChoices.length,
        },
        safeChoices: safeChoices.slice(0, 20),
        targetChoices: targetChoices.slice(0, 20),
        dreamChoices: dreamChoices.slice(0, 20),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Run Full TNEA Allotment Simulation
 * @route POST /api/tnea/simulator/run
 */
export const runSimulation = async (req, res, next) => {
  try {
    const {
      cutoff,
      community = 'BC',
      specialReservation = 'None',
      ranks = {},
      preferences = [],
      academicYear = 2025,
      counsellingRound = 'Round 1',
      quota = 'Government',
    } = req.body;

    const studentCutoff = Number(cutoff);
    if (isNaN(studentCutoff) || studentCutoff < 50 || studentCutoff > 200) {
      return res.status(400).json({ success: false, message: 'Valid cutoff between 50 and 200 is required.' });
    }

    if (!Array.isArray(preferences) || preferences.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one preference choice is required to run the simulation.' });
    }

    const normCommunity = (community || 'BC').toUpperCase().trim();

    // Special category cutoff margin adjustment (educational estimate)
    let specialBonus = 0;
    if (specialReservation === '7.5% Government School') specialBonus = 6.5;
    else if (specialReservation === 'Differently Abled') specialBonus = 12.0;
    else if (specialReservation === 'Eminent Sports') specialBonus = 8.0;
    else if (specialReservation === 'Ex-Servicemen') specialBonus = 5.0;

    const adjustedCutoff = studentCutoff + specialBonus;

    const results = [];
    let likelyCount = 0;
    let possibleCount = 0;
    let reachCount = 0;
    let unlikelyCount = 0;

    for (let i = 0; i < preferences.length; i++) {
      const pref = preferences[i];
      const priority = i + 1;

      // 1. Fetch multi-year cutoffs (2021-2026) for this college & department
      const cutoffHistory = await TneaCutoff.find({
        collegeCode: pref.collegeCode,
        departmentCode: pref.departmentCode,
        round: counsellingRound,
      })
        .sort({ academicYear: 1 })
        .lean();

      // Extract cutoff points strictly for the community
      const fiveYearHistory = cutoffHistory
        .map((c) => ({
          year: c.academicYear,
          cutoff: getCommunityCutoff(c, normCommunity),
          dataType: c.dataType || 'DEMO',
          source: c.source,
        }))
        .filter((h) => h.cutoff !== null);

      // Find current reference cutoff (2025 or latest)
      const currentRecord = cutoffHistory.find((c) => c.academicYear === Number(academicYear)) || cutoffHistory[cutoffHistory.length - 1];
      const historicalCutoff = currentRecord ? getCommunityCutoff(currentRecord, normCommunity) ?? 180.0 : 180.0;

      // Calculate 5-year statistics
      let fiveYearAverage = historicalCutoff;
      let highestCutoff = historicalCutoff;
      let lowestCutoff = historicalCutoff;
      let trend = 'Stable';

      if (fiveYearHistory.length > 0) {
        const cutoffsList = fiveYearHistory.map((h) => h.cutoff);
        fiveYearAverage = +(cutoffsList.reduce((acc, v) => acc + v, 0) / cutoffsList.length).toFixed(2);
        highestCutoff = Math.max(...cutoffsList);
        lowestCutoff = Math.min(...cutoffsList);

        if (fiveYearHistory.length >= 3) {
          const firstYearCutoff = fiveYearHistory[0].cutoff;
          const lastYearCutoff = fiveYearHistory[fiveYearHistory.length - 1].cutoff;
          const delta = lastYearCutoff - firstYearCutoff;
          if (delta > 0.8) trend = 'Increasing';
          else if (delta < -0.8) trend = 'Decreasing';
          else trend = 'Stable';
        }
      }

      // 2. Fetch Seat Matrix for this college & branch
      const seatMatrix = await TneaSeatMatrix.findOne({
        collegeCode: pref.collegeCode,
        departmentCode: pref.departmentCode,
        academicYear: Number(academicYear),
        round: counsellingRound,
      }).lean();

      let availableSeats = 0;
      let totalSeats = 60;
      let categoryAvailable = 0;
      let seatStatus = 'Available';

      if (seatMatrix) {
        totalSeats = seatMatrix.totalIntake || 60;
        availableSeats = seatMatrix.totalAvailable || 0;

        // Check specific community category
        const catInfo = (seatMatrix.categories || []).find((cat) => cat.category === community);
        if (catInfo) {
          categoryAvailable = catInfo.availableSeats;
        } else {
          categoryAvailable = availableSeats;
        }

        if (availableSeats <= 0) seatStatus = 'Filled';
        else if (availableSeats < 5) seatStatus = 'Few Seats Left';
      } else {
        seatStatus = 'Historical Data Used';
      }

      // 3. Difference and Tier Evaluation
      const difference = +(adjustedCutoff - historicalCutoff).toFixed(2);
      let predictionTier = 'Unlikely';
      const reasons = [];

      if (difference >= 0.0) {
        predictionTier = 'Likely';
        likelyCount++;
        reasons.push(`Your cutoff (${studentCutoff.toFixed(2)}) is above historical benchmark (${historicalCutoff.toFixed(2)}).`);
        if (categoryAvailable > 0) reasons.push(`${categoryAvailable} vacant seats indicated for ${community} category.`);
        if (specialBonus > 0) reasons.push(`Special reservation (${specialReservation}) provides additional allotment advantage.`);
        reasons.push(`5-year closing cutoff average is ${fiveYearAverage.toFixed(2)} (Trend: ${trend}).`);
      } else if (difference >= -2.5) {
        predictionTier = 'Possible';
        possibleCount++;
        reasons.push(`Your cutoff is within close competitive proximity (${Math.abs(difference).toFixed(2)} marks deficit).`);
        reasons.push(`Good target choice in ${counsellingRound}.`);
        if (categoryAvailable > 0) reasons.push(`Category seat matrix indicates ${categoryAvailable} vacancies remaining.`);
      } else if (difference >= -6.0) {
        predictionTier = 'Reach';
        reachCount++;
        reasons.push(`Cutoff is ${Math.abs(difference).toFixed(2)} marks below closing score. Viable as an aspirational dream choice.`);
        reasons.push(`Allotment subject to round-wise sliding and seat vacancy shifts.`);
      } else {
        predictionTier = 'Unlikely';
        unlikelyCount++;
        reasons.push(`Significant cutoff gap of ${Math.abs(difference).toFixed(2)} marks compared to historical admission threshold.`);
      }

      // 4. Data Confidence Score
      let dataConfidence = 'Medium';
      if (fiveYearHistory.length >= 4 && seatMatrix) {
        dataConfidence = 'High';
      } else if (fiveYearHistory.length <= 1) {
        dataConfidence = 'Limited';
      }

      results.push({
        priority,
        collegeCode: pref.collegeCode,
        collegeName: pref.collegeName,
        district: pref.district || '',
        collegeType: pref.collegeType || 'Autonomous',
        departmentCode: pref.departmentCode,
        departmentName: pref.departmentName,
        quota: pref.quota || 'Government',
        predictionTier,
        studentCutoff,
        historicalCutoff,
        difference,
        community,
        availableSeats: categoryAvailable || availableSeats,
        totalSeats,
        seatStatus,
        dataConfidence,
        fiveYearHistory,
        fiveYearAverage,
        trend,
        highestCutoff,
        lowestCutoff,
        reasons,
      });
    }

    // Determine Highest Recommended Preference Choice
    let highestRecommendedChoice = results.find((r) => r.predictionTier === 'Likely');
    if (!highestRecommendedChoice) {
      highestRecommendedChoice = results.find((r) => r.predictionTier === 'Possible');
    }
    if (!highestRecommendedChoice && results.length > 0) {
      highestRecommendedChoice = results[0];
    }

    const simulationPayload = {
      academicYear: Number(academicYear),
      counsellingRound,
      academicDetails: {
        effectiveCutoff: studentCutoff,
      },
      community,
      specialReservation,
      ranks,
      summaryCounts: {
        likelyCount,
        possibleCount,
        reachCount,
        unlikelyCount,
        totalPreferences: preferences.length,
      },
      highestRecommendedChoice,
      results,
      disclaimer:
        'This simulation is based on historical TNEA cutoff data, candidate rank/category and available seat information. It does not guarantee admission or reproduce the official TNEA allotment process. Students must verify final allotment through the official TNEA portal.',
    };

    return res.status(200).json({
      success: true,
      data: simulationPayload,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Save Student TNEA Simulation Plan
 * @route POST /api/tnea/simulator/save
 */
export const saveSimulation = async (req, res, next) => {
  try {
    const { simulationTitle, academicDetails, community, specialReservation, ranks, preferences, results, highestRecommendedChoice, summaryCounts } = req.body;

    const simulation = new TneaSimulation({
      user: req.user ? req.user._id : null,
      simulationTitle: simulationTitle || `TNEA Plan - Cutoff ${academicDetails?.effectiveCutoff || ''}`,
      academicDetails,
      community,
      specialReservation,
      ranks,
      preferences,
      results,
      highestRecommendedChoice,
      summaryCounts,
    });

    await simulation.save();

    return res.status(201).json({
      success: true,
      message: 'Simulation plan saved successfully!',
      data: {
        simulationId: simulation._id,
        shareId: simulation.shareId,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get Authenticated Student's Saved Simulation Plans
 * @route GET /api/tnea/simulator/my
 */
export const getMySimulations = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const simulations = await TneaSimulation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('simulationTitle academicDetails community specialReservation summaryCounts shareId createdAt')
      .lean();

    return res.status(200).json({
      success: true,
      data: simulations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get Simulation by Public Share ID
 * @route GET /api/tnea/simulator/share/:shareId
 */
export const getSimulationByShareId = async (req, res, next) => {
  try {
    const { shareId } = req.params;

    const simulation = await TneaSimulation.findOne({ shareId }).lean();
    if (!simulation) {
      return res.status(404).json({ success: false, message: 'Shared simulation plan not found or expired.' });
    }

    return res.status(200).json({
      success: true,
      data: simulation,
    });
  } catch (error) {
    next(error);
  }
};
