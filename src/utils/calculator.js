import { PAY_SCALES } from '../data/payScales.js';

/**
 * Checks if a given date falls under the Revised 2026 Pay Scale (on or after 1st July 2026).
 */
export function isScale2026(dateObj) {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth(); // 0-indexed: 6 is July
  if (year > 2026) return true;
  if (year === 2026 && month >= 6) return true;
  return false;
}

/**
 * Returns the pay scale object for a given BPS and date.
 */
export function getPayScaleForDate(bps, dateObj) {
  const bpsData = PAY_SCALES[bps];
  if (!bpsData) return null;
  return isScale2026(dateObj) ? bpsData.scale2026 : bpsData.scale2022;
}

/**
 * Get all valid basic pay stages for a given BPS and retirement date.
 * Useful for dropdown / auto-completion and validation warnings.
 */
export function getAvailableBasicPayStages(bps, retirementDateStr) {
  const bpsData = PAY_SCALES[bps];
  if (!bpsData) return [];

  const retDate = retirementDateStr ? new Date(retirementDateStr) : new Date(2026, 6, 5);
  const scale = isScale2026(retDate) ? bpsData.scale2026 : bpsData.scale2022;
  const scaleYear = isScale2026(retDate) ? 2026 : 2022;

  const stages = [];
  for (let stage = 0; stage <= scale.stages; stage++) {
    const pay = scale.initial + stage * scale.increment;
    stages.push({
      stage,
      pay,
      label: stage === 0 ? `Stage 0 (Initial): Rs. ${pay.toLocaleString()}` :
             stage === scale.stages ? `Stage ${stage} (Maximum): Rs. ${pay.toLocaleString()}` :
             `Stage ${stage}: Rs. ${pay.toLocaleString()}`,
      scaleYear
    });
  }
  return stages;
}

/**
 * Validates the inputs strictly according to the Excel formulas.
 */
export function validateInputs(bps, lastBasicPay, personalPay, retirementDateStr) {
  const errors = {};

  if (!bps || isNaN(bps) || bps < 1 || bps > 22) {
    errors.bps = 'BPS must be between 1 and 22.';
    return { isValid: false, errors };
  }

  if (!retirementDateStr) {
    errors.retirementDate = 'Please select a valid date of retirement.';
    return { isValid: false, errors };
  }

  const retDate = new Date(retirementDateStr);
  if (isNaN(retDate.getTime())) {
    errors.retirementDate = 'Invalid date format.';
    return { isValid: false, errors };
  }

  const bpsData = PAY_SCALES[bps];
  const scale = isScale2026(retDate) ? bpsData.scale2026 : bpsData.scale2022;
  const scaleYear = isScale2026(retDate) ? 2026 : 2022;

  if (lastBasicPay === undefined || lastBasicPay === null || lastBasicPay === '' || isNaN(lastBasicPay)) {
    errors.lastBasicPay = 'Please enter Last Basic Pay.';
    return { isValid: false, errors };
  }

  const payNum = Number(lastBasicPay);
  if (payNum < scale.initial || payNum > scale.maximum) {
    errors.lastBasicPay = `Basic Pay for BPS-${bps} (${scaleYear} Scale) must be between Rs. ${scale.initial.toLocaleString()} and Rs. ${scale.maximum.toLocaleString()}.`;
  } else if ((payNum - scale.initial) % scale.increment !== 0) {
    errors.lastBasicPay = `Basic Pay must be an exact increment step (multiple of Rs. ${scale.increment.toLocaleString()} from initial Rs. ${scale.initial.toLocaleString()}).`;
  }

  const stage = (payNum - scale.initial) / scale.increment;
  if (stage > bpsData.maxStages) {
    errors.lastBasicPay = `Stage (${stage}) cannot exceed maximum allowed stages (${bpsData.maxStages}).`;
  }

  const ppNum = personalPay === '' || personalPay === null || personalPay === undefined ? 0 : Number(personalPay);
  if (isNaN(ppNum) || ppNum < 0) {
    errors.personalPay = 'Personal Pay cannot be negative.';
  } else if (ppNum > 0 && ppNum % scale.increment !== 0) {
    errors.personalPay = `Personal Pay must be a multiple of annual increment (Rs. ${scale.increment.toLocaleString()}).`;
  } else if (ppNum > 0 && stage !== scale.stages) {
    errors.personalPay = `Personal Pay is only admissible when Basic Pay is at the maximum of the scale (Stage ${scale.stages}: Rs. ${scale.maximum.toLocaleString()}).`;
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors, scale, scaleYear, stage, ppNum, retDate };
}

/**
 * Calculates the exact 24-month breakdown and average basic pay.
 * Follows the EXACT Excel formula from 'Download-Average-Basic-Pay-Finding-Calculator-24-Months.xlsx'
 */
export function calculateAverageBasicPay(bps, lastBasicPay, personalPay = 0, retirementDateStr) {
  const validation = validateInputs(bps, lastBasicPay, personalPay, retirementDateStr);
  if (!validation.isValid) {
    return {
      isValid: false,
      errors: validation.errors,
      months: [],
      totalBasic: 0,
      totalPP: 0,
      totalSum: 0,
      avgBasic: 0,
      avgPP: 0,
      avgTotal: 0,
      avgRound: 0
    };
  }

  const { scale, retDate, stage, ppNum } = validation;
  const bpsData = PAY_SCALES[bps];
  const retYear = retDate.getFullYear();
  const retMonth = retDate.getMonth() + 1; // 1-12

  const ppStages = ppNum > 0 ? ppNum / scale.increment : 0;
  const totalStagesAtRetirement = stage + ppStages;

  const months = [];

  for (let e = 1; e <= 24; e++) {
    // Excel formula: DATE(YEAR($C$5), MONTH($C$5) - 24 + $E, 1)
    const monthOffset = -24 + e;
    const totalMonthIndex = retYear * 12 + (retMonth - 1) + monthOffset;
    const mYear = Math.floor(totalMonthIndex / 12);
    const mMonth1 = (totalMonthIndex % 12) + 1; // 1-12
    const mDate = new Date(mYear, mMonth1 - 1, 1);

    // Increments deduction between month and retirement:
    // Excel formula:
    // YEAR(DATE(YEAR($C$5),MONTH($C$5),1)) - YEAR(F_k) + IF(MONTH($C$5)=12,1,0) - IF(MONTH(F_k)=12,1,0)
    const incDiff = (retYear - mYear) + (retMonth === 12 ? 1 : 0) - (mMonth1 === 12 ? 1 : 0);
    const stagesInMonth = totalStagesAtRetirement - incDiff;

    if (stagesInMonth < 0) {
      return {
        isValid: false,
        errors: { general: 'Calculation resulted in negative pay stage for past months.' },
        months: [],
        totalBasic: 0,
        totalPP: 0,
        totalSum: 0,
        avgBasic: 0,
        avgPP: 0,
        avgTotal: 0,
        avgRound: 0
      };
    }

    // Determine Pay Scale for this past month
    const mScaleYear = isScale2026(mDate) ? 2026 : 2022;
    const mScale = mScaleYear === 2026 ? bpsData.scale2026 : bpsData.scale2022;

    // Excel formula:
    // I_k = INDEX($D$50:$D$93, ...) + stagesInMonth * INDEX($E$50:$E$93, ...)
    const totalPay = mScale.initial + stagesInMonth * mScale.increment;

    // G_k = MIN(I_k, INDEX($F$50:$F$93, ...))
    const basicPay = Math.min(totalPay, mScale.maximum);

    // H_k = MAX(I_k - G_k, 0)
    const personalPayMonth = Math.max(totalPay - basicPay, 0);

    const monthName = mDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    months.push({
      srNo: e,
      monthName,
      monthDate: mDate,
      scaleYear: mScaleYear,
      stages: stagesInMonth,
      basicPay,
      personalPay: personalPayMonth,
      totalPay
    });
  }

  const totalBasic = months.reduce((acc, m) => acc + m.basicPay, 0);
  const totalPP = months.reduce((acc, m) => acc + m.personalPay, 0);
  const totalSum = months.reduce((acc, m) => acc + m.totalPay, 0);

  const avgBasic = totalBasic / 24;
  const avgPP = totalPP / 24;
  const avgTotal = totalSum / 24;
  const avgRound = Math.round(avgTotal);

  return {
    isValid: true,
    errors: {},
    bps,
    bpsLabel: bpsData.bpsLabel,
    retirementDate: retDate,
    retirementScaleYear: validation.scaleYear,
    lastBasicPay: Number(lastBasicPay),
    personalPay: ppNum,
    retirementStage: stage,
    months,
    totalBasic,
    totalPP,
    totalSum,
    avgBasic,
    avgPP,
    avgTotal,
    avgRound
  };
}

/**
 * Standard Age Next Birthday Commutation Rates (Pakistan Civil Service Pension).
 */
export const COMMUTATION_TABLE = {
  40: 34.3267,
  41: 33.3762,
  42: 32.4282,
  43: 31.4828,
  44: 30.5401,
  45: 29.5999,
  46: 28.6625,
  47: 27.7280,
  48: 26.7967,
  49: 25.8687,
  50: 24.9443,
  51: 24.0238,
  52: 23.1074,
  53: 22.1955,
  54: 21.2885,
  55: 20.3868,
  56: 19.4908,
  57: 18.6010,
  58: 17.7181,
  59: 16.8427,
  60: 15.9754,
  61: 15.1170,
  62: 14.2685,
  63: 13.4310,
  64: 12.6058,
  65: 11.7942
};

/**
 * Calculates Full Pension Estimates based on Average Basic Pay.
 * @param {number} avgBasicPay - Average 24-Month Basic Pay
 * @param {number} serviceYears - Qualifying service years (minimum 10, maximum 30)
 * @param {number} ageNextBirthday - Age on next birthday at retirement (e.g. 60 or 61)
 * @param {number} commutationPercentage - Commutation % opted (standard 35%)
 */
export function calculatePensionBenefits(avgBasicPay, serviceYears = 30, ageNextBirthday = 61, commutationPercentage = 35) {
  const cappedService = Math.min(Math.max(serviceYears, 0), 30);
  
  // Gross Pension = (Average Basic Pay * Service Years * 7) / 300
  const grossPension = (avgBasicPay * cappedService * 7) / 300;
  
  // Commutation (e.g., 35%)
  const commutationPortion = grossPension * (commutationPercentage / 100);
  
  // Net Pension (e.g., 65%)
  const netPension = grossPension - commutationPortion;
  
  // Commutation factor from table
  const commFactor = COMMUTATION_TABLE[ageNextBirthday] || 15.1170; // default for 61 (superannuation at 60)
  
  // Commutation Value (Lump Sum Gratuity) = Commutation * 12 * factor
  const commutationLumpSum = commutationPortion * 12 * commFactor;
  
  // Medical Allowance (25% for BPS 1-15, 20% for BPS 16-22 on Net Pension)
  return {
    grossPension: Math.round(grossPension),
    commutationPercentage,
    commutationPortion: Math.round(commutationPortion),
    netPension: Math.round(netPension),
    ageNextBirthday,
    commutationFactor: commFactor,
    commutationLumpSum: Math.round(commutationLumpSum)
  };
}
