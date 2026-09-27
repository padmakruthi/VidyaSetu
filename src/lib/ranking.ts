import { Application } from './types';

export interface RankedNosApplication {
  application: Application;
  rank: number;
  tier: 'TIER_1_OFFER' | 'TIER_2_EXAM_ONLY';
  tierLabel: string;
  qsRankDisplay: string;
  allocatedSlot: string; // e.g. "Selected: Female ST Slot #1", "Selected: PVTG Slot #1", "Waitlisted #1"
  isSelected: boolean;
}

export interface RankedNfstApplication {
  application: Application;
  rank: number;
  isPremierInstitute: boolean;
  categoryTier: 'PWD' | 'PVTG' | 'FEMALE' | 'GENERAL_MERIT';
  categoryLabel: string;
  netScoreDisplay: string;
  allocatedSlot: string; // e.g. "Cat 3: Female ST Slot #2", "Premier Institute Priority #1"
  isSelected: boolean;
}

// NOS Ranking Engine (20 slots total)
export function rankNosApplications(applications: Application[]): RankedNosApplication[] {
  const nosApps = applications.filter(a => a.schemeCode === 'NOS');

  // Helper to determine if candidate has a confirmed offer
  const checkHasConfirmedOffer = (app: Application): boolean => {
    if (app.formData.hasConfirmedOffer !== undefined) return app.formData.hasConfirmedOffer;
    return Boolean(
      app.formData.foreignUniversityName &&
      app.formData.foreignUniversityName.length > 0 &&
      app.formData.qsWorldRanking &&
      app.formData.qsWorldRanking > 0
    );
  };

  // Sort applications according to NOS rules:
  // 1. Tier 1 (Confirmed Offer with QS Rank) ahead of Tier 2 (Exam Cleared Only)
  // 2. Within Tier 1: QS World Ranking ascending (lower QS rank number = better)
  // 3. Within Tier 2 or tie-breaker: Qualifying Degree / PG Marks (%) descending
  const sortedApps = [...nosApps].sort((a, b) => {
    const offerA = checkHasConfirmedOffer(a);
    const offerB = checkHasConfirmedOffer(b);

    if (offerA && !offerB) return -1;
    if (!offerA && offerB) return 1;

    if (offerA && offerB) {
      const qsA = a.formData.qsWorldRanking || 999;
      const qsB = b.formData.qsWorldRanking || 999;
      if (qsA !== qsB) return qsA - qsB;
    }

    // Tie-breaker: PG Marks (%)
    const pgA = a.formData.pgMarksPercentage || 0;
    const pgB = b.formData.pgMarksPercentage || 0;
    if (pgA !== pgB) return pgB - pgA;

    // Fallback: Merit score
    return b.meritScore - a.meritScore;
  });

  // Quota overlay simulation (20 slots total):
  // 3 PVTG slots, 6 Female slots (30%), 11 General ST slots
  let pvtgSlotsLeft = 3;
  let femaleSlotsLeft = 6;
  let generalSlotsLeft = 11;

  let pvtgCount = 0;
  let femaleCount = 0;
  let generalCount = 0;
  let waitlistCount = 0;

  return sortedApps.map((app, idx) => {
    const hasOffer = checkHasConfirmedOffer(app);
    const tier = hasOffer ? 'TIER_1_OFFER' : 'TIER_2_EXAM_ONLY';
    const tierLabel = hasOffer
      ? `Tier 1: Confirmed Admission Offer (${app.formData.foreignUniversityName})`
      : `Tier 2: Exam Cleared (${app.formData.qualifyingExam || 'GRE/IELTS'})`;
    
    const qsRankDisplay = hasOffer && app.formData.qsWorldRanking
      ? `QS #${app.formData.qsWorldRanking}`
      : 'Exam Cleared (No Offer)';

    const isFemale = app.gender === 'FEMALE';
    const isPvtg = app.isPvtg || app.applicantTribe === 'Birhor' || app.applicantTribe === 'Juang' || app.applicantTribe === 'Chenchu';

    let allocatedSlot = '';
    let isSelected = false;

    // Try allocating PVTG quota first
    if (isPvtg && pvtgSlotsLeft > 0) {
      pvtgCount++;
      pvtgSlotsLeft--;
      allocatedSlot = `Selected: PVTG Reserved Slot #${pvtgCount}`;
      isSelected = true;
    }
    // Try allocating Female sub-quota next
    else if (isFemale && femaleSlotsLeft > 0) {
      femaleCount++;
      femaleSlotsLeft--;
      allocatedSlot = `Selected: Female ST Sub-Quota #${femaleCount}`;
      isSelected = true;
    }
    // Try allocating General ST quota
    else if (generalSlotsLeft > 0) {
      generalCount++;
      generalSlotsLeft--;
      allocatedSlot = `Selected: General ST Slot #${generalCount}`;
      isSelected = true;
    }
    // Roll-over: If female slots unfilled and male ST candidate available
    else if (femaleSlotsLeft > 0) {
      femaleSlotsLeft--;
      generalCount++;
      allocatedSlot = `Selected: ST General Slot #${generalCount} (Female Rollover)`;
      isSelected = true;
    }
    else {
      waitlistCount++;
      allocatedSlot = `Waitlisted #${waitlistCount}`;
      isSelected = false;
    }

    return {
      application: app,
      rank: idx + 1,
      tier,
      tierLabel,
      qsRankDisplay,
      allocatedSlot,
      isSelected
    };
  });
}

// NFST Ranking Engine (750 slots total)
export function rankNfstApplications(applications: Application[]): RankedNfstApplication[] {
  const nfstApps = applications.filter(a => a.schemeCode === 'NFST');

  // Helper to check premier institute status (IIT / IIM / AIIMS / IISER)
  const checkPremierInstitute = (app: Application): boolean => {
    if (app.formData.isPremierInstitute) return true;
    const univ = (app.formData.phdEnrolledUniversity || '').toUpperCase();
    return (
      univ.includes('IIT') ||
      univ.includes('INDIAN INSTITUTE OF TECHNOLOGY') ||
      univ.includes('IIM') ||
      univ.includes('AIIMS') ||
      univ.includes('IISER') ||
      univ.includes('JNU')
    );
  };

  // Sort applications according to NFST rules:
  // 1. Premier Institute (IITs/IIMs/AIIMS/IISERs) candidates automatic priority
  // 2. Ranked by NET/CSIR-NET score combined with PG marks (%)
  const sortedApps = [...nfstApps].sort((a, b) => {
    const premA = checkPremierInstitute(a);
    const premB = checkPremierInstitute(b);

    if (premA && !premB) return -1;
    if (!premA && premB) return 1;

    // Combined score: NET percentile (50%) + PG marks (50%)
    const scoreA = (a.formData.qualifyingExamPercentile || 80) * 0.5 + (a.formData.pgMarksPercentage || 60) * 0.5;
    const scoreB = (b.formData.qualifyingExamPercentile || 80) * 0.5 + (b.formData.pgMarksPercentage || 60) * 0.5;

    if (scoreA !== scoreB) return scoreB - scoreA;
    return b.meritScore - a.meritScore;
  });

  // Category Cascade order:
  // Cat 1 — Divyangjan/PwD (5% = 38 slots)
  // Cat 2 — PVTG (25 slots)
  // Cat 3 — Female ST applicants (30% = 225 slots)
  // Cat 4 — ST-Others / General Merit (remaining balance = 462 slots)
  let pwdSlotsLeft = 38;
  let pvtgSlotsLeft = 25;
  let femaleSlotsLeft = 225;
  let generalSlotsLeft = 462;

  let pwdCount = 0;
  let pvtgCount = 0;
  let femaleCount = 0;
  let generalCount = 0;
  let waitlistCount = 0;

  return sortedApps.map((app, idx) => {
    const isPremier = checkPremierInstitute(app);
    const isPwd = app.isPwd || Boolean(app.formData.isPwd);
    const isPvtg = app.isPvtg || Boolean(app.formData.isPvtg) || app.applicantTribe === 'Birhor' || app.applicantTribe === 'Juang';
    const isFemale = app.gender === 'FEMALE';

    let categoryTier: 'PWD' | 'PVTG' | 'FEMALE' | 'GENERAL_MERIT' = 'GENERAL_MERIT';
    let categoryLabel = 'Category 4: General ST Merit';
    let allocatedSlot = '';
    let isSelected = false;

    if (isPwd && pwdSlotsLeft > 0) {
      pwdCount++;
      pwdSlotsLeft--;
      categoryTier = 'PWD';
      categoryLabel = 'Category 1: Divyangjan / PwD (≥40%)';
      allocatedSlot = `Cat 1 PwD Slot #${pwdCount}`;
      isSelected = true;
    } else if (isPvtg && pvtgSlotsLeft > 0) {
      pvtgCount++;
      pvtgSlotsLeft--;
      categoryTier = 'PVTG';
      categoryLabel = 'Category 2: Particularly Vulnerable Tribal Group (PVTG)';
      allocatedSlot = `Cat 2 PVTG Slot #${pvtgCount}`;
      isSelected = true;
    } else if (isFemale && femaleSlotsLeft > 0) {
      femaleCount++;
      femaleSlotsLeft--;
      categoryTier = 'FEMALE';
      categoryLabel = 'Category 3: Female ST Sub-Quota (30%)';
      allocatedSlot = `Cat 3 Female ST Slot #${femaleCount}`;
      isSelected = true;
    } else if (generalSlotsLeft > 0) {
      generalCount++;
      generalSlotsLeft--;
      categoryTier = 'GENERAL_MERIT';
      categoryLabel = 'Category 4: General ST Merit';
      allocatedSlot = `Cat 4 General ST Slot #${generalCount}`;
      isSelected = true;
    } else {
      waitlistCount++;
      allocatedSlot = `Waitlisted #${waitlistCount}`;
      isSelected = false;
    }

    if (isPremier && isSelected) {
      allocatedSlot = `Premier Institute Priority (${app.formData.phdEnrolledUniversity}) • ` + allocatedSlot;
    }

    const netScoreDisplay = `${app.formData.qualifyingExam || 'UGC-NET'} (${app.formData.qualifyingExamPercentile || 90}%)`;

    return {
      application: app,
      rank: idx + 1,
      isPremierInstitute: isPremier,
      categoryTier,
      categoryLabel,
      netScoreDisplay,
      allocatedSlot,
      isSelected
    };
  });
}
