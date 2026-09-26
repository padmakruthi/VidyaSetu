export type UserRole = 'APPLICANT' | 'SCRUTINY_OFFICER' | 'SELECTION_COMMITTEE' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  nameHi?: string;
  email: string;
  mobile: string;
  role: UserRole;
  state: string;
  district?: string;
  community?: string; // Tribe e.g., Santhal, Gond, Bhil, Munda, Khasi, Bodo
  avatar?: string;
}

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_SCRUTINY'
  | 'DEFICIENCY_FLAGGED'
  | 'RESUBMITTED'
  | 'SCRUTINY_VERIFIED'
  | 'COMMITTEE_SHORTLISTED'
  | 'PROVISIONALLY_SELECTED'
  | 'REJECTED';

// 5-Stage Lifecycle Audit Trail from PPT Slide 2
export type LifecycleStage =
  | 'IDENTITY_VERIFIED'
  | 'DOCS_VALIDATED'
  | 'DATA_CROSS_CHECKED'
  | 'FUNDS_TRACKED'
  | 'RENEWAL_MONITORED';

export interface ExtractedField {
  fieldName: string;
  label: string;
  value: string;
  confidence: number; // 0 to 100
  matchesForm: boolean;
  formValue?: string;
  jaroWinklerScore?: number; // Jaro-Winkler phonetic similarity
  bhashiniTransliteration?: string; // Bhashini AI mapping for tribal dialect variations
  boundingBox?: { x: number; y: number; width: number; height: number }; // Spotlight UI bounding box
  remarks?: string;
}

export interface DocumentItem {
  id: string;
  type: string; // 'CASTE_CERTIFICATE' | 'INCOME_CERTIFICATE' | 'ACADEMIC_MARKSHEET' | 'QUALIFYING_SCORECARD' | 'ADMISSION_OFFER' | 'RESEARCH_PROPOSAL' | 'PASSPORT'
  name: string;
  nameHi?: string;
  fileName: string;
  fileSizeKb: number;
  uploadedAt: string;
  ocrStatus: 'VERIFIED' | 'FLAGGED' | 'WARNING' | 'PROCESSING';
  ocrScore: number; // 0 to 100
  
  // Edge Blur & IQA Filter (PPT Slide 3)
  laplacianVarianceScore: number; // Var < 100: Retake required; Var >= 100: Passes
  isBlurry: boolean;
  digiLockerVerified: boolean;
  digiLockerUri?: string;

  extractedFields: ExtractedField[];
  aiNotes: string[];
  samplePreviewType: 'caste' | 'income' | 'net' | 'offer' | 'proposal' | 'passport';
}

export interface DeficiencyNotice {
  id: string;
  documentType: string;
  title: string;
  reason: string;
  suggestedAction: string;
  flaggedBy: string;
  flaggedAt: string;
  resolved: boolean;
  resolvedAt?: string;
  officerRemarks?: string;
}

export interface VerificationLog {
  id: string;
  applicationId: string;
  officerName: string;
  officerRole: UserRole;
  action:
    | 'FIELD_VERIFIED'
    | 'DEFICIENCY_RAISED'
    | 'DEFICIENCY_CLEARED'
    | 'APPLICATION_VERIFIED'
    | 'COMMITTEE_SHORTLISTED'
    | 'PROVISIONALLY_AWARDED'
    | 'REJECTED'
    | 'MANUAL_SCORE_OVERRIDE'
    | 'PFMS_DISBURSEMENT_TRIGGERED';
  details: string;
  timestamp: string;
}

export interface SchemeRule {
  minPgMarksPercentage: number;
  maxAge: number;
  maxAnnualFamilyIncome?: number; // e.g. 800000 for NOS, null for NFST
  qualifyingExamRequired: boolean;
  requiredExamName: string;
  stQuotaPercentage: number;
  femaleSubQuotaPercentage: number;
  stipendAmountMonthly: number;
  annualContingency: number;
}

export interface RequiredDocumentSpec {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  required: boolean;
  expectedAuthority?: string;
  allowedFormats: string[];
  maxSizeMb: number;
  extractedKeyFields: string[];
}

export interface Scheme {
  id: string; // 'nfst' | 'nos'
  code: string; // 'NFST' | 'NOS'
  title: string;
  titleHi: string;
  category: 'DOMESTIC_FELLOWSHIP' | 'OVERSEAS_SCHOLARSHIP';
  tagline: string;
  taglineHi: string;
  description: string;
  targetDegree: string;
  status: 'ACTIVE' | 'UPCOMING' | 'CLOSED';
  deadline: string;
  slotsAvailable: number;
  rules: SchemeRule;
  requiredDocuments: RequiredDocumentSpec[];
}

export interface ApplicationFormData {
  // Personal (with DPDP Act masking support)
  fullName: string;
  fatherOrHusbandName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  aadhaarLastFour: string; // Masked per DPDP Act (XXXX-XXXX-4921)
  mobileNumber: string;
  emailAddress: string;
  permanentAddress: string;
  state: string;
  district: string;
  pinCode: string;
  tribeCommunity: string;
  casteCertificateNo: string;
  casteIssuingAuthority: string;
  casteIssueDate: string;
  annualFamilyIncome: number;
  incomeCertificateNo: string;

  // Academic
  ugDegree: string;
  ugInstitute: string;
  ugMarksPercentage: number;
  pgDegree: string;
  pgInstitute: string;
  pgMarksPercentage: number;
  qualifyingExam: string;
  qualifyingExamRollNo: string;
  qualifyingExamYear: string;
  qualifyingExamPercentile: number;

  // Scheme Specific: NFST
  phdEnrolledUniversity?: string;
  phdDepartment?: string;
  phdGuideName?: string;
  phdRegistrationDate?: string;
  researchTopicTitle?: string;

  // Scheme Specific: NOS
  foreignUniversityName?: string;
  foreignCountry?: string;
  qsWorldRanking?: number;
  foreignCourseName?: string;
  ieltsOrGreScore?: string;
  passportNumber?: string;
  passportExpiryDate?: string;
  tuitionFeeRequestedInr?: number;

  // Bank & PFMS DBT Details
  bankName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  aadhaarLinkedBank: boolean;
  pfmsBeneficiaryCode?: string;
  pfmsUtrNumber?: string;
  dbtDisbursedDate?: string;
}

export interface Application {
  id: string; // e.g. MOTA-NFST-2025-0104
  schemeId: string;
  schemeCode: 'NFST' | 'NOS';
  schemeTitle: string;
  applicantId: string;
  applicantName: string;
  applicantTribe: string;
  applicantState: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  status: ApplicationStatus;
  
  // 5-Stage Lifecycle Tracker (PPT Slide 2)
  currentLifecycleStage: LifecycleStage;
  
  formData: ApplicationFormData;
  documents: DocumentItem[];
  deficiencyNotices: DeficiencyNotice[];
  verificationLogs: VerificationLog[];
  
  // AI Metrics (PPT Slide 3)
  aiRiskScore: number; // 0 - 100 (lower is safer)
  aiCompletenessScore: number; // 0 - 100
  aiRecommendation: 'FAST_TRACK_APPROVE' | 'REQUIRES_MANUAL_REVIEW' | 'CRITICAL_DEFICIENCY_DETECTED';
  aiHighlights: string[];
  
  // LayoutLMv3 & Jaro-Winkler Matching (PPT Slide 3)
  avgJaroWinklerScore: number; // e.g. 96.2% (> 92% threshold)
  bhashiniDialectResolution: string; // e.g. "Santhali (Ol Chiki) phonetics mapped to Devanagari/Latin standard"
  edgeIqaStatus: 'PASSED' | 'WARNING' | 'FAILED'; // Var >= 100

  // Merit Ranking & Human-in-the-Loop
  meritScore: number; // 0 - 100
  autoRank?: number;
  finalRank?: number;
  committeeOverrideNote?: string;
  committeeStatus?: 'PENDING' | 'APPROVED' | 'WAITLISTED' | 'REJECTED';
  
  // PFMS Rail
  pfmsPaymentStatus?: 'NOT_INITIATED' | 'PFMS_VALIDATED' | 'DISBURSED';
  
  submittedAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  titleHi?: string;
  message: string;
  messageHi?: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  channel: 'IN_APP' | 'SMS' | 'EMAIL';
  createdAt: string;
  read: boolean;
  link?: string;
}
