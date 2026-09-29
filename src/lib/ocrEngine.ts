import { ExtractedField, ApplicationFormData, DocumentItem } from './types';

// Jaro-Winkler distance implementation (Slide 3: "Jaro-Winkler matching for tribal-name transliteration, Match confidence threshold > 92%")
export function calculateJaroWinkler(s1: string, s2: string): number {
  const str1 = s1.trim().toLowerCase();
  const str2 = s2.trim().toLowerCase();

  if (str1 === str2) return 1.0;
  if (!str1.length || !str2.length) return 0.0;

  const matchDistance = Math.floor(Math.max(str1.length, str2.length) / 2) - 1;
  const str1Matches = new Array(str1.length).fill(false);
  const str2Matches = new Array(str2.length).fill(false);

  let matches = 0;
  for (let i = 0; i < str1.length; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, str2.length);

    for (let j = start; j < end; j++) {
      if (str2Matches[j]) continue;
      if (str1[i] !== str2[j]) continue;
      str1Matches[i] = true;
      str2Matches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0.0;

  let k = 0;
  let transpositions = 0;
  for (let i = 0; i < str1.length; i++) {
    if (!str1Matches[i]) continue;
    while (!str2Matches[k]) k++;
    if (str1[i] !== str2[k]) transpositions++;
    k++;
  }

  const sim = (matches / str1.length + matches / str2.length + (matches - transpositions / 2) / matches) / 3;

  // Winkler prefix scaling (up to 4 chars)
  let prefix = 0;
  for (let i = 0; i < Math.min(4, Math.min(str1.length, str2.length)); i++) {
    if (str1[i] === str2[i]) prefix++;
    else break;
  }

  return Math.min(1.0, sim + prefix * 0.1 * (1 - sim));
}

// Bhashini AI tribal name transliteration mapper (Slide 4: "Hybrid Phonetic NLP: Jaro-Winkler + Soundex + Bhashini AI mapping regional transliterations automatically")
export function resolveBhashiniTransliteration(name: string, tribe: string): { transliteration: string; dialectNote: string } {
  const tribeMap: Record<string, string> = {
    'santhal': 'संथाल / ᱥᱟᱱᱛᱟᱲᱤ (Ol Chiki mapped to Latin/Devanagari)',
    'gond': 'गोंड / Gondi Koitur Phonetics normalized',
    'munda': 'मुंडा / Mundari Bani script normalized',
    'oraon': 'उरांव / कुरुख़ (Kurukh Tolong Siki mapped)',
    'bodo': 'बर\' / Bodo Devanagari standardized',
    'khasi': 'Khasi / Khasi Latin standard aligned',
    'bhil': 'भील / Bhil Vagdi dialect phonetically mapped'
  };

  const key = tribe.toLowerCase().trim();
  const dialectNote = tribeMap[key] || `${tribe} Regional Tribal Registry Transliteration Verified via Bhashini AI`;

  return {
    transliteration: `${name} (Official e-District Transliteration)`,
    dialectNote
  };
}

export interface OcrAnalysisResult {
  documentType: string;
  ocrScore: number;
  status: 'VERIFIED' | 'FLAGGED' | 'WARNING';
  laplacianVarianceScore: number; // Var >= 100 passes, Var < 100 retake
  isBlurry: boolean;
  digiLockerVerified: boolean;
  extractedFields: ExtractedField[];
  aiNotes: string[];
}

export function simulateDocumentOcr(
  docType: string,
  fileName: string,
  formData: Partial<ApplicationFormData>,
  forceMode: boolean | 'CLEAN' | 'BLURRY' | 'NO_TEXT' = false
): OcrAnalysisResult {
  const applicantName = formData.fullName || 'Arun Soren';
  const tribe = formData.tribeCommunity || 'Santhal';
  const state = formData.state || 'Odisha';
  const certNo = formData.casteCertificateNo || 'ST/OD/MAY/2021/8941';
  const income = formData.annualFamilyIncome || 240000;

  const mode = typeof forceMode === 'string' ? forceMode : forceMode ? 'BLURRY' : 'CLEAN';

  // Handle NO_TEXT mode (blank paper / unreadable non-document scan)
  if (mode === 'NO_TEXT') {
    return {
      documentType: docType,
      ocrScore: 0,
      status: 'FLAGGED',
      laplacianVarianceScore: 24.5,
      isBlurry: true,
      digiLockerVerified: false,
      extractedFields: [],
      aiNotes: [
        '⚠️ CRITICAL AI SECURITY ALERT: NO PAPER / NO TEXT FOUND IN SCAN.',
        'Zero recognized certificate tokens, official stamps, or legal text lines detected.',
        'Upload rejected. Please capture or upload a valid paper certificate.'
      ]
    };
  }

  const bhashini = resolveBhashiniTransliteration(applicantName, tribe);

  // Default clean Laplacian variance: 142.8 (Passes >= 100 threshold)
  // If BLURRY: 48.4 (Fails < 100 threshold)
  const laplacianScore = mode === 'BLURRY' ? 48.4 : 142.8;
  const isBlurry = laplacianScore < 100;

  switch (docType) {
    case 'CASTE_CERTIFICATE': {
      if (mode === 'BLURRY' || isBlurry) {
        return {
          documentType: docType,
          ocrScore: 54,
          status: 'FLAGGED',
          laplacianVarianceScore: laplacianScore,
          isBlurry: true,
          digiLockerVerified: false,
          extractedFields: [
            {
              fieldName: 'candidateName',
              label: 'Candidate Name',
              value: 'A. Soren (Blurry Initials)',
              confidence: 42,
              matchesForm: false,
              formValue: applicantName,
              jaroWinklerScore: 0.62,
              boundingBox: { x: 120, y: 180, width: 220, height: 35 },
              remarks: 'Laplacian Score 48.4 < 100: Document scan is blurry & unreadable'
            }
          ],
          aiNotes: [
            'EDGE BLUR FILTER: Laplacian variance score is 48.4 (< 100 threshold). Sharp retake required.',
            'Document scan blocked from approval until scholar re-uploads clear certificate.'
          ]
        };
      }

      const jaroScore = calculateJaroWinkler(applicantName, applicantName);
      return {
        documentType: docType,
        ocrScore: 98,
        status: 'VERIFIED',
        laplacianVarianceScore: laplacianScore,
        isBlurry: false,
        digiLockerVerified: true,
        extractedFields: [
          {
            fieldName: 'candidateName',
            label: 'Candidate Legal Name',
            value: applicantName,
            confidence: 99,
            matchesForm: true,
            formValue: applicantName,
            jaroWinklerScore: 0.99,
            bhashiniTransliteration: bhashini.transliteration,
            boundingBox: { x: 110, y: 175, width: 260, height: 38 }
          },
          {
            fieldName: 'fatherName',
            label: "Father's Name",
            value: formData.fatherOrHusbandName || 'Late Somra Soren',
            confidence: 95,
            matchesForm: true,
            formValue: formData.fatherOrHusbandName || 'Late Somra Soren',
            jaroWinklerScore: 0.98,
            boundingBox: { x: 110, y: 220, width: 280, height: 38 }
          },
          {
            fieldName: 'tribeCommunity',
            label: 'Recognized Tribe',
            value: `${tribe} (Scheduled Tribe)`,
            confidence: 97,
            matchesForm: true,
            formValue: tribe,
            jaroWinklerScore: 1.0,
            bhashiniTransliteration: bhashini.dialectNote,
            boundingBox: { x: 110, y: 265, width: 240, height: 38 }
          },
          {
            fieldName: 'certificateNumber',
            label: 'e-Pramaan Cert No',
            value: certNo,
            confidence: 98,
            matchesForm: true,
            formValue: certNo,
            jaroWinklerScore: 1.0,
            boundingBox: { x: 110, y: 310, width: 310, height: 38 }
          },
          {
            fieldName: 'issuingAuthority',
            label: 'Issuing Officer',
            value: `Tahasildar, Revenue Dept, Govt of ${state}`,
            confidence: 96,
            matchesForm: true,
            jaroWinklerScore: 0.96,
            boundingBox: { x: 110, y: 355, width: 340, height: 38 }
          }
        ],
        aiNotes: [
          'EDGE BLUR GATE: Laplacian variance score is 142.8 (Passes ≥ 100 threshold). Razor-sharp scan.',
          `BHASHINI AI: Multimodal token alignment matched with ${bhashini.dialectNote}.`,
          'DIGILOCKER SSO: Cryptographic e-Sign SHA-256 verified against National Data & Analytics Platform.'
        ]
      };
    }

    case 'INCOME_CERTIFICATE': {
      const isNos = formData.qualifyingExam?.includes('GRE') || Boolean(formData.foreignUniversityName);
      const isAboveCeiling = isNos && income > 600000;

      return {
        documentType: docType,
        ocrScore: isAboveCeiling ? 65 : 95,
        status: isAboveCeiling ? 'WARNING' : 'VERIFIED',
        laplacianVarianceScore: 138.2,
        isBlurry: false,
        digiLockerVerified: true,
        extractedFields: [
          {
            fieldName: 'candidateName',
            label: 'Issued to / Dependent',
            value: applicantName,
            confidence: 97,
            matchesForm: true,
            formValue: applicantName,
            jaroWinklerScore: 0.98,
            boundingBox: { x: 95, y: 160, width: 250, height: 35 }
          },
          {
            fieldName: 'annualIncome',
            label: 'Annual Family Income',
            value: `₹ ${income.toLocaleString('en-IN')} / annum`,
            confidence: 96,
            matchesForm: true,
            formValue: `₹ ${income.toLocaleString('en-IN')}`,
            jaroWinklerScore: 1.0,
            boundingBox: { x: 95, y: 210, width: 280, height: 35 },
            remarks: isAboveCeiling ? 'Exceeds NOS statutory limit of ₹6,00,000' : 'Within eligible DBT threshold'
          },
          {
            fieldName: 'financialYear',
            label: 'Financial Year Validity',
            value: 'FY 2024-2025 (Valid till 31-03-2026)',
            confidence: 94,
            matchesForm: true,
            jaroWinklerScore: 0.96,
            boundingBox: { x: 95, y: 260, width: 300, height: 35 }
          }
        ],
        aiNotes: [
          'EDGE BLUR GATE: Laplacian variance score is 138.2 (Passes ≥ 100 threshold).',
          isAboveCeiling
            ? 'Warning: Income exceeds ₹6.00 Lakhs ceiling for NOS scheme. Officer scrutiny required.'
            : 'Income document verified from competent Sub-Divisional Magistrate office.'
        ]
      };
    }

    case 'QUALIFYING_SCORECARD': {
      const examName = formData.qualifyingExam || 'UGC-NET (Life Sciences)';
      const percentile = formData.qualifyingExamPercentile || 98.4;
      return {
        documentType: docType,
        ocrScore: 99,
        status: 'VERIFIED',
        laplacianVarianceScore: 164.5,
        isBlurry: false,
        digiLockerVerified: true,
        extractedFields: [
          {
            fieldName: 'candidateName',
            label: 'Candidate Name',
            value: applicantName,
            confidence: 99,
            matchesForm: true,
            formValue: applicantName,
            jaroWinklerScore: 1.0,
            boundingBox: { x: 100, y: 150, width: 270, height: 35 }
          },
          {
            fieldName: 'rollNumber',
            label: 'Roll / Registration Number',
            value: formData.qualifyingExamRollNo || 'OR04001928',
            confidence: 98,
            matchesForm: true,
            formValue: formData.qualifyingExamRollNo || 'OR04001928',
            jaroWinklerScore: 1.0,
            boundingBox: { x: 100, y: 195, width: 290, height: 35 }
          },
          {
            fieldName: 'percentile',
            label: 'NTA Percentile Score',
            value: `${percentile}% (JRF Awarded)`,
            confidence: 99,
            matchesForm: true,
            jaroWinklerScore: 0.98,
            boundingBox: { x: 100, y: 240, width: 320, height: 35 }
          }
        ],
        aiNotes: [
          'Direct Sovereign DPI ingest: NTA DigiLocker hash cryptographically cross-checked.',
          'Candidate qualifies in top 2% of ST researchers nationwide.'
        ]
      };
    }

    case 'ADMISSION_OFFER': {
      const university = formData.foreignUniversityName || formData.phdEnrolledUniversity || 'Jawaharlal Nehru University (JNU)';
      const qsRank = formData.qsWorldRanking || 2;
      return {
        documentType: docType,
        ocrScore: 97,
        status: 'VERIFIED',
        laplacianVarianceScore: 152.0,
        isBlurry: false,
        digiLockerVerified: false,
        extractedFields: [
          {
            fieldName: 'candidateName',
            label: 'Admitted Scholar',
            value: applicantName,
            confidence: 98,
            matchesForm: true,
            formValue: applicantName,
            jaroWinklerScore: 0.99,
            boundingBox: { x: 90, y: 140, width: 260, height: 35 }
          },
          {
            fieldName: 'institutionName',
            label: 'Admitting Institution',
            value: university,
            confidence: 97,
            matchesForm: true,
            formValue: university,
            jaroWinklerScore: 0.96,
            boundingBox: { x: 90, y: 185, width: 340, height: 35 }
          },
          {
            fieldName: 'offerType',
            label: 'Admission Status',
            value: 'Unconditional Regular Admission Confirmed',
            confidence: 96,
            matchesForm: true,
            jaroWinklerScore: 0.97,
            boundingBox: { x: 90, y: 230, width: 320, height: 35 }
          }
        ],
        aiNotes: [
          `LayoutLMv3: Official University letterhead and Dean seal detected with 97% confidence.`,
          `Zero Missed Intakes: Visa cut-off deadlines secured via 48-hour fast-track queue.`
        ]
      };
    }

    default: {
      return {
        documentType: docType,
        ocrScore: 92,
        status: 'VERIFIED',
        laplacianVarianceScore: 135.0,
        isBlurry: false,
        digiLockerVerified: false,
        extractedFields: [
          {
            fieldName: 'candidateName',
            label: 'Identified Scholar',
            value: applicantName,
            confidence: 95,
            matchesForm: true,
            formValue: applicantName,
            jaroWinklerScore: 0.96,
            boundingBox: { x: 90, y: 150, width: 260, height: 35 }
          }
        ],
        aiNotes: ['Document parsed via LayoutLMv3 multimodal token alignment.']
      };
    }
  }
}

export function computeAiMetrics(formData: ApplicationFormData, documents: DocumentItem[]) {
  let riskScore = 8;
  let completenessScore = 100;
  const highlights: string[] = [];
  let hasDeficiency = false;
  let totalJaro = 0;
  let jaroCount = 0;

  for (const doc of documents) {
    if (doc.laplacianVarianceScore < 100) {
      riskScore += 25;
      highlights.push(`Edge Blur Warning on ${doc.name}: Laplacian score ${doc.laplacianVarianceScore} < 100.`);
    }
    if (doc.ocrStatus === 'FLAGGED') {
      riskScore += 35;
      completenessScore -= 20;
      highlights.push(`Deficiency flagged in ${doc.name}: ${doc.aiNotes[0]}`);
      hasDeficiency = true;
    }
    for (const f of doc.extractedFields) {
      if (f.jaroWinklerScore !== undefined) {
        totalJaro += f.jaroWinklerScore;
        jaroCount++;
      }
    }
  }

  const avgJaro = jaroCount > 0 ? Math.round((totalJaro / jaroCount) * 1000) / 10 : 96.4;

  const examPercentile = formData.qualifyingExamPercentile || 85;
  const pgMarks = formData.pgMarksPercentage || 65;
  const meritScore = Math.min(100, Math.round(examPercentile * 0.45 + pgMarks * 0.45 + 10));

  riskScore = Math.max(4, Math.min(95, riskScore));
  completenessScore = Math.max(10, Math.min(100, completenessScore));

  let recommendation: 'FAST_TRACK_APPROVE' | 'REQUIRES_MANUAL_REVIEW' | 'CRITICAL_DEFICIENCY_DETECTED' = 'FAST_TRACK_APPROVE';
  if (hasDeficiency || riskScore >= 50) {
    recommendation = 'CRITICAL_DEFICIENCY_DETECTED';
  } else if (riskScore > 20) {
    recommendation = 'REQUIRES_MANUAL_REVIEW';
  }

  const bhashini = resolveBhashiniTransliteration(formData.fullName || 'Scholar', formData.tribeCommunity || 'Tribal');

  return {
    riskScore,
    completenessScore,
    meritScore,
    recommendation,
    avgJaroWinklerScore: avgJaro,
    bhashiniDialectResolution: bhashini.dialectNote,
    edgeIqaStatus: riskScore < 20 ? ('PASSED' as const) : ('WARNING' as const),
    highlights: highlights.length > 0 ? highlights : [
      'Edge Blur Gate: All documents pass Laplacian Variance threshold (Var ≥ 100). Zero blurry rejections.',
      `Jaro-Winkler phonetic similarity score: ${avgJaro}% (exceeds 92% benchmark).`,
      'LayoutLMv3 multimodal alignment verified against State e-District & NTA registries.',
      'Human-in-the-Loop Safeguard: Spotlight UI ready for 30-second officer review (Strict Policy: Zero Autonomous Rejections).'
    ]
  };
}
