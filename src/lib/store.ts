import bcrypt from 'bcryptjs';
import {
  User,
  Scheme,
  Application,
  DocumentItem,
  DeficiencyNotice,
  VerificationLog,
  NotificationItem,
  LifecycleStage,
  STWelfareOffice,
  VisitSlotBooking
} from './types';

// Pre-seeded Hashed Password for Demo Accounts ("Password@123")
const SEEDED_PASSWORD_HASH = bcrypt.hashSync('Password@123', 10);

// Mock Users
export const initialUsers: User[] = [
  {
    id: 'user-arun',
    name: 'Arun Soren',
    nameHi: 'अरुण सोरेन',
    email: 'arun.soren@scholar.in',
    mobile: '9845012345',
    role: 'APPLICANT',
    state: 'Odisha',
    district: 'Mayurbhanj',
    community: 'Santhal',
    passwordHash: SEEDED_PASSWORD_HASH
  },
  {
    id: 'user-sunita',
    name: 'Sunita Munda',
    nameHi: 'सुनीता मुंडा',
    email: 'sunita.munda@scholar.in',
    mobile: '9876543210',
    role: 'APPLICANT',
    state: 'Jharkhand',
    district: 'Ranchi',
    community: 'Munda',
    passwordHash: SEEDED_PASSWORD_HASH
  },
  {
    id: 'user-vipin',
    name: 'Vipin Kumar Gond',
    nameHi: 'विपिन कुमार गोंड',
    email: 'vipin.gond@scholar.in',
    mobile: '9123456789',
    role: 'APPLICANT',
    state: 'Madhya Pradesh',
    district: 'Mandla',
    community: 'Gond',
    passwordHash: SEEDED_PASSWORD_HASH
  },
  {
    id: 'user-riza',
    name: 'Riza Hawk',
    nameHi: 'रिज़ा हॉक',
    email: 'rizahawk09@gmail.com',
    mobile: '9876543210',
    role: 'APPLICANT',
    state: 'Odisha',
    district: 'Mayurbhanj',
    community: 'Santhal',
    passwordHash: SEEDED_PASSWORD_HASH
  },
  {
    id: 'user-scrutiny',
    name: 'Dr. Rajeshwar Rao',
    nameHi: 'डॉ. राजेश्वर राव',
    email: 'officer.scrutiny@mota.gov.in',
    mobile: '9440112233',
    role: 'SCRUTINY_OFFICER',
    state: 'New Delhi',
    passwordHash: SEEDED_PASSWORD_HASH
  },
  {
    id: 'user-committee',
    name: 'Prof. Kamala Tirkey',
    nameHi: 'प्रो. कमला तिर्की',
    email: 'committee.tirkey@mota.gov.in',
    mobile: '9437001122',
    role: 'SELECTION_COMMITTEE',
    state: 'New Delhi',
    community: 'Oraon',
    passwordHash: SEEDED_PASSWORD_HASH
  },
  {
    id: 'user-admin',
    name: 'Smt. Ananya Sen, IAS',
    nameHi: 'श्रीमती अनन्या सेन, भा.प्र.से.',
    email: 'admin.director@mota.gov.in',
    mobile: '9811009988',
    role: 'ADMIN',
    state: 'New Delhi',
    passwordHash: SEEDED_PASSWORD_HASH
  }
];

export function addUser(user: User) {
  const existingIndex = initialUsers.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  if (existingIndex >= 0) {
    initialUsers[existingIndex] = user;
  } else {
    initialUsers.push(user);
  }
  return user;
}

// Mock Schemes with PPT details
export const initialSchemes: Scheme[] = [
  {
    id: 'nfst',
    code: 'NFST',
    title: 'National Fellowship for Scheduled Tribe Students (NFST)',
    titleHi: 'अनुसूचित जनजाति के छात्रों हेतु राष्ट्रीय फैलोशिप (NFST)',
    category: 'DOMESTIC_FELLOWSHIP',
    tagline: '48-Hour Fast-Track Scrutiny for regular full-time M.Phil & Ph.D in Indian Universities / IITs / NITs',
    taglineHi: 'भारतीय विश्वविद्यालयों व संस्थानों में एम.फिल व पी.एच.डी शोधार्थियों हेतु ४८-घंटे में त्वरित सत्यापन',
    description: 'Under this scheme, 750 fellowships are awarded annually to Scheduled Tribe scholars to pursue advanced research. Direct DBT integration via PFMS delivers ₹31,000/month stipend directly into Aadhaar-linked accounts.',
    targetDegree: 'Ph.D / M.Phil Research',
    status: 'ACTIVE',
    deadline: '2026-11-15',
    slotsAvailable: 750,
    rules: {
      minPgMarksPercentage: 55,
      maxAge: 36,
      maxAnnualFamilyIncome: undefined, // No income cap for NFST
      qualifyingExamRequired: true,
      requiredExamName: 'UGC-NET / CSIR-NET',
      stQuotaPercentage: 100,
      femaleSubQuotaPercentage: 33,
      stipendAmountMonthly: 31000,
      annualContingency: 25000
    },
    requiredDocuments: [
      {
        id: 'doc-caste',
        name: 'ST Caste Certificate (DigiLocker / e-Pramaan)',
        nameHi: 'अनुसूचित जनजाति (ST) प्रमाण पत्र',
        description: 'Issued by Tahasildar / SDO with digital barcode or DigiLocker sovereign verification',
        required: true,
        expectedAuthority: 'Revenue Authority / Tehsildar',
        allowedFormats: ['PDF', 'JPG', 'PNG'],
        maxSizeMb: 5,
        extractedKeyFields: ['Candidate Legal Name', 'Community/Tribe Name', 'Certificate Number', 'Issuing Authority']
      },
      {
        id: 'doc-income',
        name: 'Annual Family Income Certificate',
        nameHi: 'वार्षिक पारिवारिक आय प्रमाण पत्र',
        description: 'Current financial year certificate from revenue authority for DBT priority',
        required: true,
        allowedFormats: ['PDF', 'JPG'],
        maxSizeMb: 5,
        extractedKeyFields: ['Issued To', 'Annual Income Amount', 'Financial Year']
      },
      {
        id: 'doc-net',
        name: 'UGC-NET / CSIR-NET Scorecard (NTA DigiLocker)',
        nameHi: 'यूजीसी-नेट / सीएसआईआर-नेट स्कोरकार्ड',
        description: 'Official NTA scorecard confirming JRF / Assistant Professorship qualification',
        required: true,
        allowedFormats: ['PDF'],
        maxSizeMb: 5,
        extractedKeyFields: ['Roll Number', 'Subject', 'Percentile Score', 'JRF Eligibility']
      },
      {
        id: 'doc-admission',
        name: 'Ph.D Admission / Enrolment Letter',
        nameHi: 'पी.एच.डी प्रवेश / नामांकन पत्र',
        description: 'Letter signed by University Registrar / Head of Department',
        required: true,
        allowedFormats: ['PDF'],
        maxSizeMb: 5,
        extractedKeyFields: ['Enrolled University', 'Department', 'Research Topic', 'Date of Admission']
      },
      {
        id: 'doc-proposal',
        name: 'Research Synopsis / Proposal',
        nameHi: 'शोध सारांश / प्रस्ताव (Synopsis)',
        description: 'Detailed proposal with focus on tribal development or science impact (3-5 pages)',
        required: true,
        allowedFormats: ['PDF'],
        maxSizeMb: 10,
        extractedKeyFields: ['Topic Title', 'Hypothesis', 'Community Impact']
      }
    ]
  },
  {
    id: 'nos',
    code: 'NOS',
    title: 'National Overseas Scholarship for ST Candidates (NOS)',
    titleHi: 'अनुसूचित जनजाति के अभ्यर्थियों हेतु राष्ट्रीय प्रवासी छात्रवृत्ति (NOS)',
    category: 'OVERSEAS_SCHOLARSHIP',
    tagline: 'Zero Missed Intakes: Visa & Foreign University cut-offs secured with rapid 48-Hour MoTA Sanction',
    taglineHi: 'विश्व के शीर्ष विश्वविद्यालयों में प्रवेश व वीज़ा की समय सीमा सुरक्षित रखने हेतु त्वरित स्वीकृति',
    description: 'Under this scheme, full financial support covering entire tuition fees, contingency allowance, equipment allowance, and living allowance is provided to 20 ST scholars annually in QS Top 500 institutions.',
    targetDegree: "Master's & Ph.D Abroad (QS Top 500)",
    status: 'ACTIVE',
    deadline: '2026-10-31',
    slotsAvailable: 20,
    rules: {
      minPgMarksPercentage: 60,
      maxAge: 35,
      maxAnnualFamilyIncome: 600000, // ₹6,00,000 ceiling
      qualifyingExamRequired: true,
      requiredExamName: 'IELTS / TOEFL / GRE with Unconditional Foreign Offer Letter',
      stQuotaPercentage: 100,
      femaleSubQuotaPercentage: 30,
      stipendAmountMonthly: 125000,
      annualContingency: 150000
    },
    requiredDocuments: [
      {
        id: 'doc-caste-nos',
        name: 'ST Caste Certificate',
        nameHi: 'अनुसूचित जनजाति (ST) प्रमाण पत्र',
        description: 'Valid digitally signed ST certificate from State Government',
        required: true,
        allowedFormats: ['PDF', 'JPG'],
        maxSizeMb: 5,
        extractedKeyFields: ['Candidate Legal Name', 'Tribe Name', 'Certificate No']
      },
      {
        id: 'doc-income-nos',
        name: 'Income Certificate (≤ ₹6.00 Lakhs)',
        nameHi: 'आय प्रमाण पत्र (₹६.०० लाख से कम)',
        description: 'Mandatory certificate demonstrating total family income not exceeding ₹6,00,000 p.a.',
        required: true,
        allowedFormats: ['PDF'],
        maxSizeMb: 5,
        extractedKeyFields: ['Annual Family Income', 'Financial Year', 'Issuing SDO']
      },
      {
        id: 'doc-offer-nos',
        name: 'Unconditional Foreign University Offer Letter',
        nameHi: 'विदेशी विश्वविद्यालय का अंतिम प्रवेश पत्र',
        description: 'From an institution ranking in top 500 in latest QS World Rankings',
        required: true,
        allowedFormats: ['PDF'],
        maxSizeMb: 10,
        extractedKeyFields: ['University Name', 'Course Name', 'QS World Rank', 'Academic Session']
      },
      {
        id: 'doc-passport-nos',
        name: 'Valid Indian Passport Copy',
        nameHi: 'वैध भारतीय पासपोर्ट प्रति',
        description: 'First and last pages of valid passport',
        required: true,
        allowedFormats: ['PDF'],
        maxSizeMb: 5,
        extractedKeyFields: ['Passport Number', 'Given Name', 'Expiry Date']
      }
    ]
  }
];

export const initialApplications: Application[] = [
  {
    id: 'MOTA-NFST-2025-0104',
    schemeId: 'nfst',
    schemeCode: 'NFST',
    schemeTitle: 'National Fellowship for Scheduled Tribe Students (NFST)',
    applicantId: 'user-arun',
    applicantName: 'Arun Soren',
    applicantTribe: 'Santhal',
    applicantState: 'Odisha',
    gender: 'MALE',
    status: 'SCRUTINY_VERIFIED',
    currentLifecycleStage: 'DATA_CROSS_CHECKED',
    formData: {
      fullName: 'Arun Soren',
      fatherOrHusbandName: 'Late Somra Soren',
      dateOfBirth: '1998-04-12',
      gender: 'MALE',
      aadhaarLastFour: '4921', // DPDP Act masked
      mobileNumber: '9845012345',
      emailAddress: 'arun.soren@scholar.in',
      permanentAddress: 'Village Badampahar, P.O. Rairangpur, Dist. Mayurbhanj',
      state: 'Odisha',
      district: 'Mayurbhanj',
      pinCode: '757042',
      tribeCommunity: 'Santhal',
      casteCertificateNo: 'ST/OD/MAY/2021/8941',
      casteIssuingAuthority: 'Tahasildar, Rairangpur, Odisha',
      casteIssueDate: '2021-08-14',
      annualFamilyIncome: 180000,
      incomeCertificateNo: 'INC/OD/2024/49102',
      ugDegree: 'B.Sc. (Botany Hons)',
      ugInstitute: 'North Orissa University, Baripada',
      ugMarksPercentage: 74.5,
      pgDegree: 'M.Sc. Life Sciences (Ethnobotany)',
      pgInstitute: 'Utkal University, Bhubaneswar',
      pgMarksPercentage: 78.2,
      qualifyingExam: 'UGC-NET (Life Sciences)',
      qualifyingExamRollNo: 'OR04001928',
      qualifyingExamYear: '2024',
      qualifyingExamPercentile: 98.4,
      phdEnrolledUniversity: 'Jawaharlal Nehru University (JNU), New Delhi',
      phdDepartment: 'School of Environmental Sciences',
      phdGuideName: 'Prof. Ramchandra Hansda',
      phdRegistrationDate: '2024-09-01',
      researchTopicTitle: 'Ethnomedicinal Botanical Knowledge Systems and Conservation Paradigms of Santhal Tribes in Similipal Biosphere Reserve',
      bankName: 'State Bank of India',
      bankAccountNumber: '38291048291',
      bankIfscCode: 'SBIN0001234',
      aadhaarLinkedBank: true,
      pfmsBeneficiaryCode: 'PFMS-BEN-OD-4921',
      pfmsUtrNumber: 'SBIN-DBT-2025-091823'
    },
    documents: [
      {
        id: 'doc-arun-caste',
        type: 'CASTE_CERTIFICATE',
        name: 'ST Caste Certificate (DigiLocker)',
        fileName: 'Arun_Soren_Caste_Cert_Mayurbhanj.pdf',
        fileSizeKb: 340,
        uploadedAt: '2025-08-10T10:30:00Z',
        ocrStatus: 'VERIFIED',
        ocrScore: 98,
        laplacianVarianceScore: 148.6, // Passes >= 100
        isBlurry: false,
        digiLockerVerified: true,
        digiLockerUri: 'in.gov.digilocker/cert/ST-OD-2021-8941',
        samplePreviewType: 'caste',
        extractedFields: [
          { fieldName: 'name', label: 'Candidate Legal Name', value: 'Arun Soren', confidence: 99, matchesForm: true, formValue: 'Arun Soren', jaroWinklerScore: 1.0, bhashiniTransliteration: 'अरुण सोरेन (Santhal Ol Chiki aligned)' },
          { fieldName: 'tribe', label: 'Tribe / Community', value: 'Santhal (Scheduled Tribe)', confidence: 97, matchesForm: true, formValue: 'Santhal', jaroWinklerScore: 1.0 },
          { fieldName: 'certNo', label: 'Certificate No.', value: 'ST/OD/MAY/2021/8941', confidence: 98, matchesForm: true, formValue: 'ST/OD/MAY/2021/8941', jaroWinklerScore: 1.0 },
          { fieldName: 'authority', label: 'Issuing Officer', value: 'Tahasildar, Rairangpur', confidence: 95, matchesForm: true, jaroWinklerScore: 0.96 }
        ],
        aiNotes: ['Edge Blur Gate: Laplacian Var 148.6 (Passes ≥ 100 threshold).', 'DigiLocker sovereign URI verified. SHA-256 cryptographically matched.']
      },
      {
        id: 'doc-arun-income',
        type: 'INCOME_CERTIFICATE',
        name: 'Income Certificate',
        fileName: 'Income_Certificate_FY24-25.pdf',
        fileSizeKb: 280,
        uploadedAt: '2025-08-10T10:32:00Z',
        ocrStatus: 'VERIFIED',
        ocrScore: 95,
        laplacianVarianceScore: 139.2,
        isBlurry: false,
        digiLockerVerified: true,
        samplePreviewType: 'income',
        extractedFields: [
          { fieldName: 'name', label: 'Issued To', value: 'Arun Soren', confidence: 98, matchesForm: true, formValue: 'Arun Soren', jaroWinklerScore: 1.0 },
          { fieldName: 'income', label: 'Annual Income', value: '₹ 1,80,000', confidence: 96, matchesForm: true, formValue: '₹ 1,80,000', jaroWinklerScore: 1.0 }
        ],
        aiNotes: ['Edge Blur Gate: Laplacian Var 139.2. Valid financial year 2024-25.']
      },
      {
        id: 'doc-arun-net',
        type: 'QUALIFYING_SCORECARD',
        name: 'UGC-NET JRF Scorecard (NTA)',
        fileName: 'NTA_UGC_NET_Scorecard_Dec2024.pdf',
        fileSizeKb: 410,
        uploadedAt: '2025-08-10T10:35:00Z',
        ocrStatus: 'VERIFIED',
        ocrScore: 99,
        laplacianVarianceScore: 162.0,
        isBlurry: false,
        digiLockerVerified: true,
        samplePreviewType: 'net',
        extractedFields: [
          { fieldName: 'name', label: 'Candidate Name', value: 'Arun Soren', confidence: 99, matchesForm: true, formValue: 'Arun Soren', jaroWinklerScore: 1.0 },
          { fieldName: 'roll', label: 'Roll Number', value: 'OR04001928', confidence: 98, matchesForm: true, formValue: 'OR04001928', jaroWinklerScore: 1.0 },
          { fieldName: 'score', label: 'Percentile Score', value: '98.4002% (JRF Awarded)', confidence: 99, matchesForm: true, jaroWinklerScore: 0.98 }
        ],
        aiNotes: ['Verified against NTA DigiLocker records. Candidate in top 1.6% nationwide.']
      }
    ],
    deficiencyNotices: [],
    verificationLogs: [
      {
        id: 'log-1',
        applicationId: 'MOTA-NFST-2025-0104',
        officerName: 'Dr. Rajeshwar Rao',
        officerRole: 'SCRUTINY_OFFICER',
        action: 'APPLICATION_VERIFIED',
        details: 'Spotlight UI review completed in 24 seconds. Jaro-Winkler 99.2%. Green channel fast-track approved under 48-Hour mandate.',
        timestamp: '2025-08-14T11:45:00Z'
      }
    ],
    aiRiskScore: 6,
    aiCompletenessScore: 100,
    aiRecommendation: 'FAST_TRACK_APPROVE',
    avgJaroWinklerScore: 99.2,
    bhashiniDialectResolution: 'Santhali (Ol Chiki) phonetics mapped to Devanagari/Latin standard',
    edgeIqaStatus: 'PASSED',
    aiHighlights: [
      'Edge Blur Gate: All documents pass Laplacian Variance threshold (Var ≥ 100). Zero blurry rejections.',
      'Jaro-Winkler phonetic similarity score: 99.2% (> 92% benchmark).',
      'LayoutLMv3 multimodal token alignment verified against Odisha e-District & NTA registries.',
      'Human-in-the-Loop Safeguard: Spotlight UI ready for 30-second officer review (Strict Policy: Zero Autonomous Rejections).'
    ],
    meritScore: 92.8,
    autoRank: 4,
    finalRank: 4,
    committeeStatus: 'APPROVED',
    pfmsPaymentStatus: 'PFMS_VALIDATED',
    submittedAt: '2025-08-10T10:40:00Z',
    updatedAt: '2025-08-14T11:45:00Z'
  },
  {
    id: 'MOTA-NOS-2025-0012',
    schemeId: 'nos',
    schemeCode: 'NOS',
    schemeTitle: 'National Overseas Scholarship for ST Candidates (NOS)',
    applicantId: 'user-sunita',
    applicantName: 'Sunita Munda',
    applicantTribe: 'Munda',
    applicantState: 'Jharkhand',
    gender: 'FEMALE',
    status: 'COMMITTEE_SHORTLISTED',
    currentLifecycleStage: 'DATA_CROSS_CHECKED',
    formData: {
      fullName: 'Sunita Munda',
      fatherOrHusbandName: 'Ganga Ram Munda',
      dateOfBirth: '1999-07-21',
      gender: 'FEMALE',
      aadhaarLastFour: '8172',
      mobileNumber: '9876543210',
      emailAddress: 'sunita.munda@scholar.in',
      permanentAddress: 'Kanke Road, Near Birsa Agricultural University, Ranchi',
      state: 'Jharkhand',
      district: 'Ranchi',
      pinCode: '834006',
      tribeCommunity: 'Munda',
      casteCertificateNo: 'ST/JH/RAN/2022/1948',
      casteIssuingAuthority: 'Sub-Divisional Officer, Ranchi Sadar',
      casteIssueDate: '2022-03-19',
      annualFamilyIncome: 420000,
      incomeCertificateNo: 'INC/JH/2024/7721',
      ugDegree: 'B.Tech Mining Engineering',
      ugInstitute: 'IIT (ISM) Dhanbad',
      ugMarksPercentage: 82.4,
      pgDegree: 'M.Tech Geotechnical Engineering',
      pgInstitute: 'IIT Kharagpur',
      pgMarksPercentage: 86.8,
      qualifyingExam: 'GRE (Quantitative 168, Verbal 160) + IELTS Band 8.0',
      qualifyingExamRollNo: 'GRE-8910482',
      qualifyingExamYear: '2024',
      qualifyingExamPercentile: 96.0,
      foreignUniversityName: 'Imperial College London, United Kingdom',
      foreignCountry: 'United Kingdom',
      qsWorldRanking: 2,
      foreignCourseName: 'Ph.D. in Sustainable Clean Mining & Environmental Remediation in Indigenous Lands',
      ieltsOrGreScore: 'IELTS Band 8.0 / GRE 328',
      passportNumber: 'Z8920194',
      passportExpiryDate: '2032-11-20',
      tuitionFeeRequestedInr: 3200000,
      bankName: 'Punjab National Bank',
      bankAccountNumber: '09810029182',
      bankIfscCode: 'PUNB0001928',
      aadhaarLinkedBank: true,
      pfmsBeneficiaryCode: 'PFMS-NOS-JH-8172'
    },
    documents: [
      {
        id: 'doc-sunita-caste',
        type: 'CASTE_CERTIFICATE',
        name: 'ST Caste Certificate (Munda)',
        fileName: 'Sunita_Munda_ST_Cert_Ranchi.pdf',
        fileSizeKb: 360,
        uploadedAt: '2025-08-12T09:15:00Z',
        ocrStatus: 'VERIFIED',
        ocrScore: 97,
        laplacianVarianceScore: 154.2,
        isBlurry: false,
        digiLockerVerified: true,
        samplePreviewType: 'caste',
        extractedFields: [
          { fieldName: 'name', label: 'Candidate Legal Name', value: 'Sunita Munda', confidence: 99, matchesForm: true, formValue: 'Sunita Munda', jaroWinklerScore: 1.0 },
          { fieldName: 'tribe', label: 'Tribe Community', value: 'Munda (Scheduled Tribe)', confidence: 98, matchesForm: true, formValue: 'Munda', jaroWinklerScore: 1.0 },
          { fieldName: 'authority', label: 'Issuing Officer', value: 'Sub-Divisional Officer, Ranchi Sadar', confidence: 94, matchesForm: true }
        ],
        aiNotes: ['Edge Blur Gate: Laplacian Var 154.2. Verified against Jharkhand Jharbhoomi e-District database.']
      },
      {
        id: 'doc-sunita-offer',
        type: 'ADMISSION_OFFER',
        name: 'Imperial College London Offer Letter',
        fileName: 'Imperial_College_London_Offer_PhD_Sunita.pdf',
        fileSizeKb: 680,
        uploadedAt: '2025-08-12T09:20:00Z',
        ocrStatus: 'VERIFIED',
        ocrScore: 99,
        laplacianVarianceScore: 172.0,
        isBlurry: false,
        digiLockerVerified: false,
        samplePreviewType: 'offer' as any,
        extractedFields: [
          { fieldName: 'univ', label: 'University', value: 'Imperial College London', confidence: 99, matchesForm: true, formValue: 'Imperial College London', jaroWinklerScore: 1.0 },
          { fieldName: 'rank', label: 'QS World Rank', value: '#2 (QS World University Rankings 2025)', confidence: 98, matchesForm: true },
          { fieldName: 'status', label: 'Offer Type', value: 'Unconditional Offer of Admission', confidence: 99, matchesForm: true }
        ],
        aiNotes: ['Zero Missed Intakes: Visa cut-off secured. Admitted to QS Top 10 institution. Meets highest tier for NOS financial grant.']
      }
    ],
    deficiencyNotices: [],
    verificationLogs: [
      {
        id: 'log-2',
        applicationId: 'MOTA-NOS-2025-0012',
        officerName: 'Dr. Rajeshwar Rao',
        officerRole: 'SCRUTINY_OFFICER',
        action: 'APPLICATION_VERIFIED',
        details: 'Exceptional candidate. Unconditional offer from QS #2 Imperial College London. Income ₹4.2L is well within ₹6L cap.',
        timestamp: '2025-08-15T14:30:00Z'
      },
      {
        id: 'log-2b',
        applicationId: 'MOTA-NOS-2025-0012',
        officerName: 'Prof. Kamala Tirkey',
        officerRole: 'SELECTION_COMMITTEE',
        action: 'COMMITTEE_SHORTLISTED',
        details: 'Candidate shortlisted as Rank #1 in Engineering & Technology category for NOS 2025-26 cohort.',
        timestamp: '2025-08-18T16:00:00Z'
      }
    ],
    aiRiskScore: 4,
    aiCompletenessScore: 100,
    aiRecommendation: 'FAST_TRACK_APPROVE',
    avgJaroWinklerScore: 99.6,
    bhashiniDialectResolution: 'Mundari Bani phonetics verified via Bhashini NLP engine',
    edgeIqaStatus: 'PASSED',
    aiHighlights: [
      'Unconditional admission from Imperial College London (QS #2 world ranking).',
      'Zero Missed Intakes: UK Student Visa cut-off deadline secured via 48-Hour priority pipeline.',
      'Double IIT graduate (IIT Dhanbad B.Tech + IIT Kharagpur M.Tech).'
    ],
    meritScore: 98.2,
    autoRank: 1,
    finalRank: 1,
    committeeStatus: 'APPROVED',
    pfmsPaymentStatus: 'PFMS_VALIDATED',
    submittedAt: '2025-08-12T09:30:00Z',
    updatedAt: '2025-08-18T16:00:00Z'
  },
  {
    id: 'MOTA-NFST-2025-0219',
    schemeId: 'nfst',
    schemeCode: 'NFST',
    schemeTitle: 'National Fellowship for Scheduled Tribe Students (NFST)',
    applicantId: 'user-vipin',
    applicantName: 'Vipin Kumar Gond',
    applicantTribe: 'Gond',
    applicantState: 'Madhya Pradesh',
    gender: 'MALE',
    status: 'DEFICIENCY_FLAGGED',
    currentLifecycleStage: 'DOCS_VALIDATED',
    formData: {
      fullName: 'Vipin Kumar Gond',
      fatherOrHusbandName: 'Mansa Ram Gond',
      dateOfBirth: '1997-11-05',
      gender: 'MALE',
      aadhaarLastFour: '3049',
      mobileNumber: '9123456789',
      emailAddress: 'vipin.gond@scholar.in',
      permanentAddress: 'Ward No 4, Tehsil Niwas, Dist. Mandla',
      state: 'Madhya Pradesh',
      district: 'Mandla',
      pinCode: '481885',
      tribeCommunity: 'Gond',
      casteCertificateNo: 'ST/MP/MAN/2019/3321',
      casteIssuingAuthority: 'Sub-Divisional Magistrate, Niwas',
      casteIssueDate: '2019-06-12',
      annualFamilyIncome: 140000,
      incomeCertificateNo: 'INC/MP/2021/0091',
      ugDegree: 'B.A. (History & Sociology)',
      ugInstitute: 'Govt. Degree College Mandla',
      ugMarksPercentage: 68.0,
      pgDegree: 'M.A. Tribal Studies & Anthropology',
      pgInstitute: 'Indira Gandhi National Tribal University (IGNTU), Amarkantak',
      pgMarksPercentage: 73.5,
      qualifyingExam: 'UGC-NET (Anthropology)',
      qualifyingExamRollNo: 'MP03004812',
      qualifyingExamYear: '2024',
      qualifyingExamPercentile: 91.2,
      phdEnrolledUniversity: 'IGNTU, Amarkantak',
      phdDepartment: 'Department of Tribal Studies',
      phdGuideName: 'Dr. B. K. Maravi',
      phdRegistrationDate: '2024-07-15',
      researchTopicTitle: 'Oral Traditions and Sacred Groves (Devgudis) of Central Indian Gondwana Tribes: Ethnohistorical Continuity',
      bankName: 'Central Bank of India',
      bankAccountNumber: '20938102931',
      bankIfscCode: 'CBIN0281928',
      aadhaarLinkedBank: true
    },
    documents: [
      {
        id: 'doc-vipin-caste',
        type: 'CASTE_CERTIFICATE',
        name: 'ST Caste Certificate',
        fileName: 'Vipin_Gond_Caste_MP.pdf',
        fileSizeKb: 310,
        uploadedAt: '2025-08-14T11:00:00Z',
        ocrStatus: 'VERIFIED',
        ocrScore: 94,
        laplacianVarianceScore: 141.0,
        isBlurry: false,
        digiLockerVerified: true,
        samplePreviewType: 'caste',
        extractedFields: [
          { fieldName: 'name', label: 'Candidate Legal Name', value: 'Vipin Kumar Gond', confidence: 96, matchesForm: true, formValue: 'Vipin Kumar Gond', jaroWinklerScore: 1.0 },
          { fieldName: 'tribe', label: 'Community', value: 'Gond (Scheduled Tribe)', confidence: 95, matchesForm: true, formValue: 'Gond', jaroWinklerScore: 1.0 }
        ],
        aiNotes: ['Edge Blur Gate: Laplacian Var 141.0. Valid ST Certificate issued by SDM Niwas.']
      },
      {
        id: 'doc-vipin-income',
        type: 'INCOME_CERTIFICATE',
        name: 'Income Certificate (Expired)',
        fileName: 'Old_Income_Cert_2021.pdf',
        fileSizeKb: 210,
        uploadedAt: '2025-08-14T11:05:00Z',
        ocrStatus: 'FLAGGED',
        ocrScore: 48,
        laplacianVarianceScore: 48.4, // Edge Blur Fails < 100
        isBlurry: true,
        digiLockerVerified: false,
        samplePreviewType: 'income',
        extractedFields: [
          { fieldName: 'name', label: 'Candidate', value: 'Vipin Kumar Gond', confidence: 92, matchesForm: true, formValue: 'Vipin Kumar Gond', jaroWinklerScore: 0.98 },
          { fieldName: 'fy', label: 'Financial Year', value: 'FY 2021-2022 (Expired)', confidence: 91, matchesForm: false, remarks: 'Deficiency: Income certificate must be for FY 2024-25' }
        ],
        aiNotes: [
          'EDGE BLUR GATE: Laplacian variance score is 48.4 (< 100 threshold). Camera blur detected.',
          'DEFICIENCY: Uploaded Income Certificate is 3 years out of date (FY 2021-22).',
          'Candidate must re-upload a valid revenue certificate for FY 2024-25.'
        ]
      }
    ],
    deficiencyNotices: [
      {
        id: 'def-101',
        documentType: 'INCOME_CERTIFICATE',
        title: 'Outdated & Blurry Income Certificate (FY 2021-22)',
        reason: 'The income certificate uploaded is dated 2021 and has an edge blur score of 48.4 (< 100). Ministry guidelines mandate a fresh certificate for FY 2024-25.',
        suggestedAction: 'Please obtain a current Income Certificate for FY 2024-25 from your Tehsildar or SDM office and upload a sharp scan (Laplacian Var ≥ 100).',
        flaggedBy: 'Dr. Rajeshwar Rao (Scrutiny Officer)',
        flaggedAt: '2025-08-16T15:20:00Z',
        resolved: false,
        officerRemarks: 'All other documents including Caste Certificate and IGNTU admission are in order. Strict Policy: Zero Autonomous Rejections. Please re-upload.'
      }
    ],
    verificationLogs: [
      {
        id: 'log-3',
        applicationId: 'MOTA-NFST-2025-0219',
        officerName: 'Dr. Rajeshwar Rao',
        officerRole: 'SCRUTINY_OFFICER',
        action: 'DEFICIENCY_RAISED',
        details: 'Deficiency raised for outdated Income Certificate. Automated SMS and portal notification dispatched to applicant.',
        timestamp: '2025-08-16T15:20:00Z'
      }
    ],
    aiRiskScore: 52,
    aiCompletenessScore: 78,
    aiRecommendation: 'CRITICAL_DEFICIENCY_DETECTED',
    avgJaroWinklerScore: 98.4,
    bhashiniDialectResolution: 'Gondi Koitur phonetic mapping completed',
    edgeIqaStatus: 'FAILED',
    aiHighlights: [
      'Edge Blur Filter Alert: Income certificate scan scored Laplacian Var 48.4 (< 100 threshold).',
      'Deficiency flagged: Candidate notified with 1-click re-upload action to avoid rejection.',
      'Strict Human-in-the-Loop Safeguard: Zero autonomous rejections policy enforced.'
    ],
    meritScore: 84.5,
    autoRank: 28,
    submittedAt: '2025-08-14T11:15:00Z',
    updatedAt: '2025-08-16T15:20:00Z'
  },
  {
    id: 'MOTA-NFST-2025-0450',
    schemeId: 'nfst',
    schemeCode: 'NFST',
    schemeTitle: 'National Fellowship for Scheduled Tribe Students (NFST)',
    applicantId: 'user-dimple',
    applicantName: 'Dimple Bodo',
    applicantTribe: 'Bodo',
    applicantState: 'Assam',
    gender: 'FEMALE',
    status: 'PROVISIONALLY_SELECTED',
    currentLifecycleStage: 'FUNDS_TRACKED',
    formData: {
      fullName: 'Dimple Bodo',
      fatherOrHusbandName: 'Bipul Bodo',
      dateOfBirth: '1999-01-14',
      gender: 'FEMALE',
      aadhaarLastFour: '7721',
      mobileNumber: '9435019283',
      emailAddress: 'dimple.bodo@scholar.in',
      permanentAddress: 'Kokrajhar, Bodoland Territorial Region',
      state: 'Assam',
      district: 'Kokrajhar',
      pinCode: '783370',
      tribeCommunity: 'Bodo',
      casteCertificateNo: 'ST/AS/KOK/2021/4481',
      casteIssuingAuthority: 'Sub-Divisional Officer (Civil), Kokrajhar',
      casteIssueDate: '2021-02-10',
      annualFamilyIncome: 160000,
      incomeCertificateNo: 'INC/AS/2024/8812',
      ugDegree: 'B.A. (English Hons)',
      ugInstitute: 'Bodoland University, Kokrajhar',
      ugMarksPercentage: 79.5,
      pgDegree: 'M.A. Linguistics & Tribal Languages',
      pgInstitute: 'Gauhati University, Guwahati',
      pgMarksPercentage: 84.2,
      qualifyingExam: 'UGC-NET (Linguistics)',
      qualifyingExamRollNo: 'AS02008129',
      qualifyingExamYear: '2024',
      qualifyingExamPercentile: 97.8,
      phdEnrolledUniversity: 'Gauhati University',
      phdDepartment: 'Department of Linguistics',
      phdGuideName: 'Prof. K. Daimary',
      phdRegistrationDate: '2024-07-01',
      researchTopicTitle: 'Computational Morpho-syntax and Digital Lexicography for Endangered Tibeto-Burman Dialects of Assam',
      bankName: 'Assam Gramin Vikash Bank',
      bankAccountNumber: '71029182910',
      bankIfscCode: 'AGVB0001029',
      aadhaarLinkedBank: true,
      pfmsBeneficiaryCode: 'PFMS-BEN-AS-7721',
      pfmsUtrNumber: 'AGVB-DBT-2025-449102',
      dbtDisbursedDate: '2025-08-23T10:00:00Z'
    },
    documents: [],
    deficiencyNotices: [],
    verificationLogs: [
      {
        id: 'log-5',
        applicationId: 'MOTA-NFST-2025-0450',
        officerName: 'Prof. Kamala Tirkey',
        officerRole: 'SELECTION_COMMITTEE',
        action: 'PROVISIONALLY_AWARDED',
        details: 'Rank #2 in North-Eastern quota. Female scholar in computational tribal linguistics. Fellowship sanctioned.',
        timestamp: '2025-08-22T12:00:00Z'
      },
      {
        id: 'log-5b',
        applicationId: 'MOTA-NFST-2025-0450',
        officerName: 'Smt. Ananya Sen, IAS',
        officerRole: 'ADMIN',
        action: 'PFMS_DISBURSEMENT_TRIGGERED',
        details: 'PFMS DBT payment dispatched. First tranche ₹31,000 + ₹25,000 contingency credited via PFMS rail.',
        timestamp: '2025-08-23T10:00:00Z'
      }
    ],
    aiRiskScore: 5,
    aiCompletenessScore: 100,
    aiRecommendation: 'FAST_TRACK_APPROVE',
    avgJaroWinklerScore: 99.4,
    bhashiniDialectResolution: 'Bodo Devanagari standardized via Bhashini AI',
    edgeIqaStatus: 'PASSED',
    aiHighlights: ['Female scholar qualifying under 33% female sub-quota.', 'JRF qualified with 97.8 percentile.'],
    meritScore: 94.6,
    autoRank: 2,
    finalRank: 2,
    committeeStatus: 'APPROVED',
    pfmsPaymentStatus: 'DISBURSED',
    submittedAt: '2025-08-08T09:00:00Z',
    updatedAt: '2025-08-23T10:00:00Z'
  },
  {
    id: 'MOTA-NFST-2025-0909',
    schemeId: 'nfst',
    schemeCode: 'NFST',
    schemeTitle: 'National Fellowship for Scheduled Tribe Students (NFST)',
    applicantId: 'user-riza',
    applicantName: 'Riza Hawk',
    applicantTribe: 'Santhal',
    applicantState: 'Odisha',
    gender: 'FEMALE',
    status: 'SCRUTINY_VERIFIED',
    currentLifecycleStage: 'DATA_CROSS_CHECKED',
    formData: {
      fullName: 'Riza Hawk',
      fatherOrHusbandName: 'Kanhu Soren',
      dateOfBirth: '1998-05-12',
      gender: 'FEMALE',
      aadhaarLastFour: '9920',
      mobileNumber: '9876543210',
      emailAddress: 'rizahawk09@gmail.com',
      permanentAddress: 'Baripada, Mayurbhanj',
      state: 'Odisha',
      district: 'Mayurbhanj',
      pinCode: '757001',
      tribeCommunity: 'Santhal',
      casteCertificateNo: 'ST/OD/MAY/2022/9021',
      casteIssuingAuthority: 'Tehsildar, Baripada',
      casteIssueDate: '2022-04-15',
      annualFamilyIncome: 150000,
      incomeCertificateNo: 'INC/OD/2024/9912',
      ugDegree: 'B.Sc. (Botany Hons)',
      ugInstitute: 'MPC Autonomous College, Baripada',
      ugMarksPercentage: 82.0,
      pgDegree: 'M.Sc. (Ethnobotany)',
      pgInstitute: 'Utkal University, Bhubaneswar',
      pgMarksPercentage: 86.5,
      phdEnrolledUniversity: 'Jawaharlal Nehru University (JNU), New Delhi',
      phdDepartment: 'School of Environmental Sciences',
      phdGuideName: 'Prof. S. C. Mohapatra',
      phdRegistrationDate: '2024-07-20',
      researchTopicTitle: 'Ethnobotanical Documentation of Medicinal Flora in Similipal Biosphere Reserve',
      isPremierInstitute: true,
      bankName: 'State Bank of India',
      bankAccountNumber: '39482019283',
      bankIfscCode: 'SBIN0000034',
      aadhaarLinkedBank: true
    },
    documents: [
      {
        id: 'doc-r1',
        type: 'ST_CASTE_CERTIFICATE',
        name: 'ST Caste Certificate',
        fileName: 'Riza_Hawk_ST_Certificate.pdf',
        fileSizeKb: 280,
        uploadedAt: '2025-08-11T10:00:00Z',
        ocrStatus: 'VERIFIED',
        ocrScore: 99,
        laplacianVarianceScore: 168.4,
        isBlurry: false,
        digiLockerVerified: true,
        extractedFields: [
          { fieldName: 'name', label: 'Candidate Name', value: 'Riza Hawk', confidence: 99, matchesForm: true, formValue: 'Riza Hawk', jaroWinklerScore: 1.0 },
          { fieldName: 'caste', label: 'Tribe Category', value: 'Santhal (Scheduled Tribe)', confidence: 99, matchesForm: true, formValue: 'Santhal', jaroWinklerScore: 1.0 }
        ],
        aiNotes: ['DigiLocker SSO hash match verified.'],
        samplePreviewType: 'caste'
      }
    ],
    deficiencyNotices: [],
    verificationLogs: [
      {
        id: 'log-r1',
        applicationId: 'MOTA-NFST-2025-0909',
        officerName: 'Dr. Rajeshwar Rao',
        officerRole: 'SCRUTINY_OFFICER',
        action: 'APPLICATION_VERIFIED',
        details: 'Verified against e-District database. High Jaro-Winkler score 99.5%.',
        timestamp: '2025-08-15T14:30:00Z'
      }
    ],
    aiRiskScore: 5,
    aiCompletenessScore: 100,
    aiRecommendation: 'FAST_TRACK_APPROVE',
    avgJaroWinklerScore: 99.5,
    bhashiniDialectResolution: 'Santhali Ol Chiki script mapped to standard Latin transliteration',
    edgeIqaStatus: 'PASSED',
    aiHighlights: ['Edge Blur Gate Passed (Var 168.4)', 'DigiLocker Verified'],
    meritScore: 95.2,
    autoRank: 3,
    finalRank: 3,
    committeeStatus: 'APPROVED',
    pfmsPaymentStatus: 'PFMS_VALIDATED',
    submittedAt: '2025-08-11T10:00:00Z',
    updatedAt: '2025-08-15T14:30:00Z'
  },

  // NOS Tier 1 PVTG Scholar
  {
    id: 'MOTA-NOS-2025-0089',
    schemeId: 'nos',
    schemeCode: 'NOS',
    schemeTitle: 'National Overseas Scholarship for ST Candidates (NOS)',
    applicantId: 'user-ramesh',
    applicantName: 'Ramesh Birhor',
    applicantTribe: 'Birhor',
    applicantState: 'Jharkhand',
    gender: 'MALE',
    isPvtg: true,
    status: 'SCRUTINY_VERIFIED',
    currentLifecycleStage: 'DATA_CROSS_CHECKED',
    formData: {
      fullName: 'Ramesh Birhor',
      fatherOrHusbandName: 'Late Somra Birhor',
      dateOfBirth: '1998-09-15',
      gender: 'MALE',
      aadhaarLastFour: '9012',
      mobileNumber: '9431092831',
      emailAddress: 'ramesh.birhor@scholar.in',
      permanentAddress: 'Village Chalkari, Topchanchi, Dist. Dhanbad',
      state: 'Jharkhand',
      district: 'Dhanbad',
      pinCode: '828113',
      tribeCommunity: 'Birhor',
      isPvtg: true,
      casteCertificateNo: 'PVTG/JH/DHN/2023/0019',
      casteIssuingAuthority: 'Deputy Commissioner, Dhanbad',
      casteIssueDate: '2023-01-10',
      annualFamilyIncome: 320000,
      incomeCertificateNo: 'INC/JH/2024/9910',
      ugDegree: 'B.Sc. Forestry & Ecology',
      ugInstitute: 'Birsa Agricultural University, Ranchi',
      ugMarksPercentage: 78.4,
      pgDegree: 'M.Sc. Environmental Science',
      pgInstitute: 'Forest Research Institute (FRI), Dehradun',
      pgMarksPercentage: 81.5,
      qualifyingExam: 'GRE 318 + IELTS Band 7.5',
      qualifyingExamRollNo: 'GRE-991028',
      qualifyingExamYear: '2024',
      qualifyingExamPercentile: 92.0,
      foreignUniversityName: 'University of British Columbia (UBC), Canada',
      foreignCountry: 'Canada',
      qsWorldRanking: 34,
      foreignCourseName: 'Ph.D in Indigenous Forestry Systems & Climate Resilience',
      ieltsOrGreScore: 'IELTS Band 7.5 / GRE 318',
      hasConfirmedOffer: true,
      passportNumber: 'V9102918',
      passportExpiryDate: '2033-05-14',
      tuitionFeeRequestedInr: 2800000,
      bankName: 'State Bank of India',
      bankAccountNumber: '39102839182',
      bankIfscCode: 'SBIN0000841',
      aadhaarLinkedBank: true
    },
    documents: [],
    deficiencyNotices: [],
    verificationLogs: [
      {
        id: 'log-nos-89',
        applicationId: 'MOTA-NOS-2025-0089',
        officerName: 'Dr. Rajeshwar Rao',
        officerRole: 'SCRUTINY_OFFICER',
        action: 'APPLICATION_VERIFIED',
        details: 'Verified PVTG scholar (Birhor tribe). Confirmed unconditional offer from University of British Columbia (QS #34). Passed to Selection Committee.',
        timestamp: '2025-08-20T10:15:00Z'
      }
    ],
    aiRiskScore: 5,
    aiCompletenessScore: 100,
    aiRecommendation: 'FAST_TRACK_APPROVE',
    avgJaroWinklerScore: 99.1,
    bhashiniDialectResolution: 'Birhor tribal dialect transliteration verified',
    edgeIqaStatus: 'PASSED',
    aiHighlights: ['Particularly Vulnerable Tribal Group (PVTG) scholar.', 'Unconditional admission from UBC (QS #34).'],
    meritScore: 92.4,
    committeeStatus: 'PENDING',
    submittedAt: '2025-08-18T14:20:00Z',
    updatedAt: '2025-08-20T10:15:00Z'
  },

  // NOS Tier 2 Exam Only Scholar (No final offer yet)
  {
    id: 'MOTA-NOS-2025-0144',
    schemeId: 'nos',
    schemeCode: 'NOS',
    schemeTitle: 'National Overseas Scholarship for ST Candidates (NOS)',
    applicantId: 'user-pooja',
    applicantName: 'Pooja Khasi',
    applicantTribe: 'Khasi',
    applicantState: 'Meghalaya',
    gender: 'FEMALE',
    status: 'SCRUTINY_VERIFIED',
    currentLifecycleStage: 'DATA_CROSS_CHECKED',
    formData: {
      fullName: 'Pooja Khasi',
      fatherOrHusbandName: 'Bah John Khasi',
      dateOfBirth: '2000-03-22',
      gender: 'FEMALE',
      aadhaarLastFour: '5512',
      mobileNumber: '9436018291',
      emailAddress: 'pooja.khasi@scholar.in',
      permanentAddress: 'Laitumkhrah, Shillong',
      state: 'Meghalaya',
      district: 'East Khasi Hills',
      pinCode: '793003',
      tribeCommunity: 'Khasi',
      casteCertificateNo: 'ST/ML/SHL/2022/8812',
      casteIssuingAuthority: 'Deputy Commissioner, Shillong',
      casteIssueDate: '2022-07-19',
      annualFamilyIncome: 480000,
      incomeCertificateNo: 'INC/ML/2024/3391',
      ugDegree: 'B.Sc. Biotechnology',
      ugInstitute: 'St. Anthony\'s College, Shillong',
      ugMarksPercentage: 81.0,
      pgDegree: 'M.Sc. Molecular Biology',
      pgInstitute: 'North-Eastern Hill University (NEHU), Shillong',
      pgMarksPercentage: 84.0,
      qualifyingExam: 'GRE 322 + TOEFL 108 (Cleared)',
      qualifyingExamRollNo: 'GRE-881920',
      qualifyingExamYear: '2024',
      qualifyingExamPercentile: 94.5,
      foreignUniversityName: '',
      foreignCountry: 'United States',
      qsWorldRanking: undefined,
      foreignCourseName: 'Ph.D. in Molecular Genetics & Herbal Drug Discovery',
      ieltsOrGreScore: 'TOEFL 108 / GRE 322',
      hasConfirmedOffer: false, // Tier 2 Exam Cleared Only
      passportNumber: 'W8819201',
      passportExpiryDate: '2031-09-10',
      tuitionFeeRequestedInr: 3000000,
      bankName: 'HDFC Bank',
      bankAccountNumber: '50100291829',
      bankIfscCode: 'HDFC0000192',
      aadhaarLinkedBank: true
    },
    documents: [],
    deficiencyNotices: [],
    verificationLogs: [
      {
        id: 'log-nos-144',
        applicationId: 'MOTA-NOS-2025-0144',
        officerName: 'Dr. Rajeshwar Rao',
        officerRole: 'SCRUTINY_OFFICER',
        action: 'APPLICATION_VERIFIED',
        details: 'GRE 322 + TOEFL 108 scorecards verified. Candidate categorized under NOS Priority Tier 2 (Exam Cleared, Awaiting University Offer).',
        timestamp: '2025-08-21T11:30:00Z'
      }
    ],
    aiRiskScore: 8,
    aiCompletenessScore: 90,
    aiRecommendation: 'FAST_TRACK_APPROVE',
    avgJaroWinklerScore: 98.8,
    bhashiniDialectResolution: 'Khasi Latin standard aligned',
    edgeIqaStatus: 'PASSED',
    aiHighlights: ['Priority Tier 2: GRE 322 & TOEFL 108 cleared.', 'Eligible under 30% Female ST Sub-Quota.'],
    meritScore: 89.5,
    committeeStatus: 'PENDING',
    submittedAt: '2025-08-19T16:00:00Z',
    updatedAt: '2025-08-21T11:30:00Z'
  },

  // NFST Premier Institute + PVTG Scholar
  {
    id: 'MOTA-NFST-2025-0312',
    schemeId: 'nfst',
    schemeCode: 'NFST',
    schemeTitle: 'National Fellowship for Scheduled Tribe Students (NFST)',
    applicantId: 'user-birsa',
    applicantName: 'Dr. Birsa Chenchu',
    applicantTribe: 'Chenchu',
    applicantState: 'Andhra Pradesh',
    gender: 'MALE',
    isPvtg: true,
    status: 'SCRUTINY_VERIFIED',
    currentLifecycleStage: 'DATA_CROSS_CHECKED',
    formData: {
      fullName: 'Dr. Birsa Chenchu',
      fatherOrHusbandName: 'Late Venkata Chenchu',
      dateOfBirth: '1997-06-18',
      gender: 'MALE',
      aadhaarLastFour: '1128',
      mobileNumber: '9440918291',
      emailAddress: 'birsa.chenchu@scholar.in',
      permanentAddress: 'Srisailam Tribal Colony, Dist. Kurnool',
      state: 'Andhra Pradesh',
      district: 'Kurnool',
      pinCode: '518102',
      tribeCommunity: 'Chenchu',
      isPvtg: true,
      casteCertificateNo: 'PVTG/AP/KUR/2022/4410',
      casteIssuingAuthority: 'Tahsildar, Srisailam',
      casteIssueDate: '2022-04-12',
      annualFamilyIncome: 120000,
      incomeCertificateNo: 'INC/AP/2024/5512',
      ugDegree: 'B.Tech Earth Sciences',
      ugInstitute: 'Andhra University, Visakhapatnam',
      ugMarksPercentage: 80.2,
      pgDegree: 'M.Tech Petroleum & Geo-Resources Engg',
      pgInstitute: 'IIT (ISM) Dhanbad',
      pgMarksPercentage: 83.5,
      qualifyingExam: 'UGC-NET (Earth & Planetary Sciences)',
      qualifyingExamRollNo: 'AP08001928',
      qualifyingExamYear: '2024',
      qualifyingExamPercentile: 95.6,
      phdEnrolledUniversity: 'IIT (ISM) Dhanbad',
      phdDepartment: 'Department of Applied Geophysics',
      phdGuideName: 'Prof. S. K. Pal',
      phdRegistrationDate: '2024-08-01',
      researchTopicTitle: 'Deep Seismic Imaging and Subsurface Aquifer Mapping in Nallamala Tribal Belt',
      isPremierInstitute: true,
      bankName: 'Canara Bank',
      bankAccountNumber: '49102918291',
      bankIfscCode: 'CNRB0001928',
      aadhaarLinkedBank: true
    },
    documents: [],
    deficiencyNotices: [],
    verificationLogs: [
      {
        id: 'log-nfst-312',
        applicationId: 'MOTA-NFST-2025-0312',
        officerName: 'Dr. Rajeshwar Rao',
        officerRole: 'SCRUTINY_OFFICER',
        action: 'APPLICATION_VERIFIED',
        details: 'Premier Institute Scholar (IIT Dhanbad) from Chenchu PVTG tribe. UGC-NET 95.6%. Forwarded for automatic priority allocation.',
        timestamp: '2025-08-20T14:10:00Z'
      }
    ],
    aiRiskScore: 3,
    aiCompletenessScore: 100,
    aiRecommendation: 'FAST_TRACK_APPROVE',
    avgJaroWinklerScore: 99.5,
    bhashiniDialectResolution: 'Chenchu Telugu transliteration verified',
    edgeIqaStatus: 'PASSED',
    aiHighlights: ['Premier Institute Priority Slot (IIT Dhanbad).', 'PVTG (Chenchu) category candidate.'],
    meritScore: 96.0,
    committeeStatus: 'PENDING',
    submittedAt: '2025-08-16T10:00:00Z',
    updatedAt: '2025-08-20T14:10:00Z'
  },

  // NFST Divyangjan (PwD 45%) + PVTG Scholar
  {
    id: 'MOTA-NFST-2025-0567',
    schemeId: 'nfst',
    schemeCode: 'NFST',
    schemeTitle: 'National Fellowship for Scheduled Tribe Students (NFST)',
    applicantId: 'user-mamta',
    applicantName: 'Mamta Juang',
    applicantTribe: 'Juang',
    applicantState: 'Odisha',
    gender: 'FEMALE',
    isPvtg: true,
    isPwd: true,
    status: 'SCRUTINY_VERIFIED',
    currentLifecycleStage: 'DATA_CROSS_CHECKED',
    formData: {
      fullName: 'Mamta Juang',
      fatherOrHusbandName: 'Kanhu Juang',
      dateOfBirth: '1999-10-04',
      gender: 'FEMALE',
      aadhaarLastFour: '6630',
      mobileNumber: '9437918201',
      emailAddress: 'mamta.juang@scholar.in',
      permanentAddress: 'Gonasika Tribal Hamlet, Dist. Keonjhar',
      state: 'Odisha',
      district: 'Keonjhar',
      pinCode: '758001',
      tribeCommunity: 'Juang',
      isPvtg: true,
      isPwd: true,
      pwdDisabilityPercentage: 45,
      casteCertificateNo: 'PVTG/OD/KJR/2021/0088',
      casteIssuingAuthority: 'Collector & District Magistrate, Keonjhar',
      casteIssueDate: '2021-11-05',
      annualFamilyIncome: 95000,
      incomeCertificateNo: 'INC/OD/2024/1102',
      ugDegree: 'B.Sc. Zoology',
      ugInstitute: 'Dharani Dhar University, Keonjhar',
      ugMarksPercentage: 75.0,
      pgDegree: 'M.Sc. Environmental Biology',
      pgInstitute: 'Utkal University, Bhubaneswar',
      pgMarksPercentage: 77.8,
      qualifyingExam: 'CSIR-NET (Environmental Sciences)',
      qualifyingExamRollNo: 'OR03009918',
      qualifyingExamYear: '2024',
      qualifyingExamPercentile: 90.2,
      phdEnrolledUniversity: 'Utkal University',
      phdDepartment: 'Department of Zoology',
      phdGuideName: 'Prof. S. Nayak',
      phdRegistrationDate: '2024-07-20',
      researchTopicTitle: 'Biodiversity Conservation & Medicinal Plant Ecology in Juang Development Agency Protected Ecosystems',
      bankName: 'State Bank of India',
      bankAccountNumber: '39102910291',
      bankIfscCode: 'SBIN0000122',
      aadhaarLinkedBank: true
    },
    documents: [],
    deficiencyNotices: [],
    verificationLogs: [
      {
        id: 'log-nfst-567',
        applicationId: 'MOTA-NFST-2025-0567',
        officerName: 'Dr. Rajeshwar Rao',
        officerRole: 'SCRUTINY_OFFICER',
        action: 'APPLICATION_VERIFIED',
        details: 'Divyangjan / PwD scholar (45% locomotor disability) from Juang PVTG tribe. CSIR-NET 90.2%. High priority Category 1 allocation.',
        timestamp: '2025-08-21T15:40:00Z'
      }
    ],
    aiRiskScore: 4,
    aiCompletenessScore: 100,
    aiRecommendation: 'FAST_TRACK_APPROVE',
    avgJaroWinklerScore: 99.0,
    bhashiniDialectResolution: 'Juang Oriya phonetics mapped',
    edgeIqaStatus: 'PASSED',
    aiHighlights: ['Category 1: Divyangjan / PwD (45% disability) candidate.', 'PVTG (Juang) & Female sub-quota eligible.'],
    meritScore: 88.0,
    committeeStatus: 'PENDING',
    submittedAt: '2025-08-19T09:30:00Z',
    updatedAt: '2025-08-21T15:40:00Z'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-vipin',
    title: 'Deficiency Notice: Income Certificate (FY 2021-22)',
    titleHi: 'त्रुटि सूचना: आय प्रमाण पत्र',
    message: 'Your Income Certificate is outdated. Please upload a fresh FY 2024-25 certificate with Var ≥ 100 to clear scrutiny under the 48-Hour mandate.',
    messageHi: 'आपका आय प्रमाण पत्र पुराना है। कृपया वित्तीय वर्ष २०२४-२५ का स्पष्ट प्रमाण पत्र अपलोड करें।',
    type: 'WARNING',
    channel: 'SMS',
    createdAt: '2025-08-16T15:20:00Z',
    read: false,
    link: '/portal'
  },
  {
    id: 'notif-2',
    userId: 'user-arun',
    title: 'Application Verified in 24 Seconds via Spotlight UI',
    titleHi: 'आवेदन २४ सेकंड में सत्यापित',
    message: 'Your NFST application has been verified with 99.2% Jaro-Winkler match. Forwarded to Selection Committee.',
    messageHi: 'आपका आवेदन सफलतापूर्वक सत्यापित हो गया है। चयन समिति को अग्रेषित किया गया है।',
    type: 'SUCCESS',
    channel: 'IN_APP',
    createdAt: '2025-08-14T11:45:00Z',
    read: true,
    link: '/portal'
  },
  {
    id: 'notif-3',
    userId: 'user-sunita',
    title: 'Shortlisted for NOS Fellowship (Imperial College)',
    titleHi: 'प्रवासी छात्रवृत्ति हेतु शॉर्टलिस्ट',
    message: 'Zero Missed Intakes: Visa cut-off deadline secured! You are shortlisted at Rank #1 for Imperial College London Ph.D.',
    messageHi: 'बधाई! इम्पीरियल कॉलेज लंदन पी.एच.डी हेतु आपको मेरिट रैंक #1 पर शॉर्टलिस्ट किया गया है।',
    type: 'SUCCESS',
    channel: 'EMAIL',
    createdAt: '2025-08-18T16:00:00Z',
    read: false,
    link: '/portal'
  }
];

let applicationsData = [...initialApplications];
let schemesData = [...initialSchemes];
let notificationsData = [...initialNotifications];
let currentUser: User = initialUsers[0];

export function getCurrentUser(): User {
  return currentUser;
}

export function setCurrentUser(user: User) {
  currentUser = user;
}

export function getApplications(): Application[] {
  return applicationsData;
}

export function getApplicationById(id: string): Application | undefined {
  return applicationsData.find(a => a.id.toLowerCase() === id.toLowerCase());
}

export function createApplication(app: Application): Application {
  applicationsData = [app, ...applicationsData];
  return app;
}

export function updateApplication(id: string, updates: Partial<Application>): Application | undefined {
  const index = applicationsData.findIndex(a => a.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return undefined;
  
  applicationsData[index] = {
    ...applicationsData[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  return applicationsData[index];
}

export function resolveDeficiencyInStore(appId: string, docId: string, updatedDoc: DocumentItem): Application | undefined {
  const app = getApplicationById(appId);
  if (!app) return undefined;

  const updatedNotices = app.deficiencyNotices.map(n => ({
    ...n,
    resolved: true,
    resolvedAt: new Date().toISOString()
  }));

  const existingDocIdx = app.documents.findIndex(d => d.type === updatedDoc.type);
  let updatedDocs = [...app.documents];
  if (existingDocIdx >= 0) {
    updatedDocs[existingDocIdx] = updatedDoc;
  } else {
    updatedDocs.push(updatedDoc);
  }

  const newLog: VerificationLog = {
    id: `log-${Date.now()}`,
    applicationId: app.id,
    officerName: 'Applicant Resubmission Flow',
    officerRole: 'APPLICANT',
    action: 'DEFICIENCY_CLEARED',
    details: `Updated ${updatedDoc.name} uploaded with Laplacian Variance ${updatedDoc.laplacianVarianceScore} (Passes ≥ 100). OCR score: ${updatedDoc.ocrScore}%.`,
    timestamp: new Date().toISOString()
  };

  return updateApplication(appId, {
    status: 'RESUBMITTED',
    currentLifecycleStage: 'DOCS_VALIDATED',
    documents: updatedDocs,
    deficiencyNotices: updatedNotices,
    verificationLogs: [...app.verificationLogs, newLog],
    aiRiskScore: 8,
    aiCompletenessScore: 98,
    aiRecommendation: 'FAST_TRACK_APPROVE',
    edgeIqaStatus: 'PASSED'
  });
}

export function getSchemes(): Scheme[] {
  return schemesData;
}

export function getSchemeById(id: string): Scheme | undefined {
  return schemesData.find(s => s.id === id);
}

export function updateSchemeRulesInStore(schemeId: string, updatedRules: any): Scheme | undefined {
  const index = schemesData.findIndex(s => s.id === schemeId);
  if (index === -1) return undefined;
  schemesData[index] = {
    ...schemesData[index],
    rules: { ...schemesData[index].rules, ...updatedRules }
  };
  return schemesData[index];
}

export function getNotificationsForUser(userId: string): NotificationItem[] {
  return notificationsData.filter(n => n.userId === userId);
}

export function addNotificationToStore(notif: NotificationItem) {
  notificationsData = [notif, ...notificationsData];
}

// ST Welfare Offices Seed Data
export const initialSTWelfareOffices: STWelfareOffice[] = [
  {
    id: 'office-delhi',
    name: 'Central Tribal Welfare Nodal Office, New Delhi',
    nameHi: 'केन्द्रीय जनजातीय कल्याण नोडल कार्यालय, नई दिल्ली',
    state: 'New Delhi',
    district: 'New Delhi',
    address: 'Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001',
    contactOfficer: 'Shri Vikram Singh, Deputy Director',
    phone: '011-23381234'
  },
  {
    id: 'office-ranchi',
    name: 'Jharkhand State Tribal Welfare Directorate, Ranchi',
    nameHi: 'झारखंड राज्य जनजातीय कल्याण निदेशालय, रांची',
    state: 'Jharkhand',
    district: 'Ranchi',
    address: 'Kanke Road, Near CM Residence, Ranchi, Jharkhand - 834008',
    contactOfficer: 'Dr. Sunil Purty, Nodal Officer',
    phone: '0651-2409876'
  },
  {
    id: 'office-mayurbhanj',
    name: 'Odisha Tribal Development Nodal Agency, Mayurbhanj',
    nameHi: 'ओडिशा जनजातीय विकास नोडल एजेंसी, मयूरभंज',
    state: 'Odisha',
    district: 'Mayurbhanj',
    address: 'Collectorate Complex, Baripada, Mayurbhanj, Odisha - 757001',
    contactOfficer: 'Smt. Mamata Marandi, District Welfare Officer',
    phone: '06792-254321'
  },
  {
    id: 'office-mandla',
    name: 'Madhya Pradesh Tribal Affairs Nodal Office, Mandla',
    nameHi: 'मध्य प्रदेश जनजातीय कार्य नोडल कार्यालय, मंडला',
    state: 'Madhya Pradesh',
    district: 'Mandla',
    address: 'District Collectorate Campus, Mandla, MP - 481661',
    contactOfficer: 'Shri Rakesh Uikey, Assistant Commissioner',
    phone: '07642-260123'
  },
  {
    id: 'office-raipur',
    name: 'Chhattisgarh Tribal Welfare Directorate, Naya Raipur',
    nameHi: 'छत्तीसगढ़ जनजातीय कल्याण निदेशालय, नया रायपुर',
    state: 'Chhattisgarh',
    district: 'Raipur',
    address: 'Block 3, Indravati Bhawan, Naya Raipur, CG - 492002',
    contactOfficer: 'Shri Anil Netam, Joint Director',
    phone: '0771-2510987'
  },
  {
    id: 'office-guwahati',
    name: 'Assam Tribal Affairs Regional Office, Guwahati',
    nameHi: 'असम जनजातीय कार्य क्षेत्रीय कार्यालय, गुवाहाटी',
    state: 'Assam',
    district: 'Kamrup Metropolitan',
    address: 'Janata Bhawan, Dispur, Guwahati, Assam - 781006',
    contactOfficer: 'Smt. Bandana Boro, Regional Officer',
    phone: '0361-2265432'
  },
  {
    id: 'office-udaipur',
    name: 'Rajasthan Tribal Area Development Department, Udaipur',
    nameHi: 'राजस्थान जनजातीय क्षेत्र विकास विभाग, उदयपुर',
    state: 'Rajasthan',
    district: 'Udaipur',
    address: 'Saheli Marg, Cheetak Circle, Udaipur, Rajasthan - 313001',
    contactOfficer: 'Shri Mohan Meena, Project Officer',
    phone: '0294-2421098'
  }
];

// Global Booked Visit Slots Registry for Double-Booking Prevention
let globalVisitBookings: VisitSlotBooking[] = [
  // Seed an existing booked slot for demo evaluation
  {
    referenceNo: 'MOTA-VISIT-78491',
    appId: 'MOTA-NFST-2025-0899',
    applicantName: 'Demo Scholar',
    officeId: 'office-mayurbhanj',
    officeName: 'Odisha Tribal Development Nodal Agency, Mayurbhanj',
    officeAddress: 'Collectorate Complex, Baripada, Mayurbhanj, Odisha - 757001',
    contactOfficer: 'Smt. Mamata Marandi, District Welfare Officer',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    timeSlot: '10:30 AM - 11:00 AM',
    bookedAt: new Date().toISOString()
  }
];

export function getSTWelfareOffices(): STWelfareOffice[] {
  return initialSTWelfareOffices;
}

export function getBookedSlots(officeId: string, date: string): string[] {
  return globalVisitBookings
    .filter(b => b.officeId === officeId && b.date === date)
    .map(b => b.timeSlot);
}

export function bookOfficeVisitSlot(
  appId: string,
  officeId: string,
  date: string,
  timeSlot: string
): VisitSlotBooking {
  const app = getApplicationById(appId);
  if (!app) throw new Error('Application not found');

  const office = initialSTWelfareOffices.find(o => o.id === officeId);
  if (!office) throw new Error('ST Welfare Office not found');

  // Double-booking check
  const isAlreadyBooked = globalVisitBookings.some(
    b => b.officeId === officeId && b.date === date && b.timeSlot === timeSlot
  );

  if (isAlreadyBooked) {
    throw new Error('This time slot has just been booked by another applicant. Please select a different slot.');
  }

  const refNo = `MOTA-VISIT-${Math.floor(10000 + Math.random() * 90000)}`;

  const newBooking: VisitSlotBooking = {
    referenceNo: refNo,
    appId: app.id,
    applicantName: app.applicantName,
    officeId: office.id,
    officeName: office.name,
    officeAddress: office.address,
    contactOfficer: office.contactOfficer,
    date,
    timeSlot,
    bookedAt: new Date().toISOString()
  };

  globalVisitBookings.push(newBooking);

  const newLog: VerificationLog = {
    id: `log-${Date.now()}`,
    applicationId: app.id,
    officerName: 'ST Scholar (Visit Booking)',
    officerRole: 'APPLICANT',
    action: 'FIELD_VERIFIED',
    details: `Office Visit Slot booked for ${date} at ${timeSlot} at ${office.name}. Reference: ${refNo}`,
    timestamp: new Date().toISOString()
  };

  updateApplication(app.id, {
    bookedVisitSlot: newBooking,
    verificationLogs: [...app.verificationLogs, newLog]
  });

  return newBooking;
}
