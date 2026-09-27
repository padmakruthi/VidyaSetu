export type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Header & Brand
    portalTitle: 'VIDYASETU (विद्यासेतु)',
    portalSubtitle: 'Ministry of Tribal Affairs, Government of India',
    slogan: '“Har Vidyarthi Ka, Safalta Ka Marg”',
    tagline: 'AI-Enabled Lifecycle Scholarship & Fellowship Management Engine for Scheduled Tribes',
    teamBadge: 'Ministry of Tribal Affairs • Sovereign DPI Platform',
    home: 'Home',
    schemes: 'Fellowship Schemes',
    applyNow: 'Apply Now',
    trackApplication: 'Track Application',
    studentPortal: 'Student Portal',
    adminLogin: 'MoTA Official Login',
    quickSwitch: 'Demo Role Switcher',
    logout: 'Logout',
    
    // Accessibility
    accessibility: 'Accessibility Options',
    fontSize: 'Text Size',
    highContrast: 'High Contrast',
    normalContrast: 'Normal',

    // Hero & PPT Core Value Props
    heroHeading: 'Har Vidyarthi Ka, Safalta Ka Marg',
    heroSubheading: 'Empowering Tribal Scholars & Modernizing Public Scheme Delivery with Zero-Trust DPI Ingestion, Client-Side Blur Gating, and Human-in-the-Loop AI Assistance.',
    metric48Hours: '48-Hour Approval',
    metric48HoursSub: 'Reduced from 45-day manual delays (22.5x Faster Processing)',
    metricZeroBlur: 'Zero Blurry Rejections',
    metricZeroBlurSub: 'Instant browser-side Laplacian Edge Gate (Var ≥ 100)',
    metricZeroMissed: 'Zero Missed Intakes',
    metricZeroMissedSub: 'Securing Foreign Visa & Admission cut-offs on time',
    metricSavings: 'Est. ₹1.80 Cr / year',
    metricSavingsSub: 'Eliminating outsourced 3rd-party manual scrutiny',

    // PPT Audit Trail
    auditTrailTitle: 'Sovereign 6-Stage Lifecycle Audit Trail',
    stageIdentity: 'IDENTITY VERIFIED',
    stageDocs: 'DOCS VALIDATED',
    stageCrossCheck: 'DATA CROSS-CHECKED',
    stageEligibility: 'ELIGIBILITY & MERIT RANKED',
    stageFunds: 'FUNDS DISBURSED & TRACKED',
    stageAudit: 'AUDIT & COMPLIANCE MONITORED',

    // Action buttons
    applyNfstBtn: 'Apply for NFST (National Fellowship)',
    applyNosBtn: 'Apply for NOS (Overseas Scholarship)',
    checkEligibility: 'Check Eligibility in 60s',
    activeSchemesHeading: 'Flagship MoTA Scholarship & Fellowship Schemes',

    // Technical Pillars (Slide 3)
    techPillarsTitle: 'Native Digital Public Infrastructure (DPI) Architecture',
    pillar1Title: '1. Multi-Channel Auth & Ingestion',
    pillar1Desc: 'DigiLocker SSO, Google OAuth & Email/OTP capture. Sovereign DPI ingestion pipeline validates the source. OAuth 2.0 + e-KYC compliant handshake.',
    pillar2Title: '2. Edge Blur & IQA Filter',
    pillar2Desc: 'Browser-side OpenCV WebAssembly pre-processing. Laplacian variance score computed before upload. Var < 100 retake, Var ≥ 100 passes.',
    pillar3Title: '3. LayoutLMv3 & Fuzzy Matching',
    pillar3Desc: 'Multimodal token alignment on document layout. Jaro-Winkler matching for tribal-name transliteration. Match confidence threshold > 92%.',
    pillar4Title: '4. Eligibility Rules & Merit Ranking Engine',
    pillar4Desc: 'Configurable scheme rules (income, category, marks) auto-check eligibility. Ranks eligible applicants by merit score before officer review.',
    pillar5Title: '5. Officer Spotlight & PFMS Disbursement',
    pillar5Desc: 'Dual-pane bounding-box review UI for officers. 1-click bank sanction via PFMS DBT rail. Decision finalized in under 30 seconds.',
    pillar6Title: '6. Escalation, Audit & Compliance Trail',
    pillar6Desc: 'Citizen: real-time SMS/app status on every application. Officer: full audit log of AI confidence scores & overrides. System: DPDP-compliant AES-256 masking on every record.',

    // Wizard Steps
    wizardStep1: 'Personal & Tribe (e-KYC)',
    wizardStep2: 'Academic Records',
    wizardStep3: 'Scheme & Research',
    wizardStep4: 'Edge Blur & AI Document Scrutiny',
    wizardStep5: 'Review & DPDP Declaration',
    wizardStep6: 'Submission & PFMS Acknowledgment',
    
    backBtn: 'Previous Step',
    continueBtn: 'Continue to Next Step',
    saveDraft: 'Save Progress',
    submitApplication: 'Submit Verified Application',

    // AI Check & Edge Filter
    aiScanningTitle: 'In-Browser Edge Blur & LayoutLMv3 Scrutiny',
    aiScanningDesc: 'Instant zero-compute checks verify document resolution, Jaro-Winkler transliteration, and e-District authenticity.',
    ocrConfidence: 'Confidence',
    nameMatch: 'Jaro-Winkler Match',
    laplacianVariance: 'Laplacian Variance',
    statusVerified: 'Verified & Clear',
    statusDiscrepancy: 'Action Needed',
    statusProcessing: 'Scanning Document...',
    
    // Status Tracker
    trackerTitle: 'Application Lifecycle Tracker',
    submitted: 'Submitted',
    underScrutiny: 'Under Spotlight Scrutiny',
    deficiencyFound: 'Deficiency Noticed',
    verified: 'Documents Verified',
    committeeReview: 'Selection Committee',
    selected: 'Selected & Sanctioned',

    // Role names
    roleApplicant: 'ST Scholar',
    roleScrutiny: 'Nodal Scrutiny Officer',
    roleCommittee: 'Selection Committee',
    roleAdmin: 'MoTA Administrator'
  },
  hi: {
    // Header & Brand
    portalTitle: 'विद्यासेतु (VIDYASETU)',
    portalSubtitle: 'जनजातीय कार्य मंत्रालय, भारत सरकार',
    slogan: '“हर विद्यार्थी का, सफलता का मार्ग”',
    tagline: 'अनुसूचित जनजाति के छात्रों हेतु एआई-सक्षम जीवनचक्र छात्रवृत्ति एवं फैलोशिप इंजन',
    teamBadge: 'जनजातीय कार्य मंत्रालय • संप्रभु डीपीआई मंच',
    home: 'होम',
    schemes: 'फैलोशिप योजनाएं',
    applyNow: 'अभी आवेदन करें',
    trackApplication: 'आवेदन की स्थिति देखें',
    studentPortal: 'छात्र पोर्टल',
    adminLogin: 'अधिकारी लॉगिन',
    quickSwitch: 'डेमो भूमिका बदलें',
    logout: 'लॉगआउट',

    // Accessibility
    accessibility: 'सुगमता विकल्प (Accessibility)',
    fontSize: 'अक्षर का आकार',
    highContrast: 'उच्च कंट्रास्ट (High Contrast)',
    normalContrast: 'सामान्य',

    // Hero & PPT Core Value Props
    heroHeading: 'हर विद्यार्थी का, सफलता का मार्ग',
    heroSubheading: 'जनजातीय शोधार्थियों का सशक्तिकरण एवं शून्य-ट्रस्ट डीपीआई, क्लाइंट-साइड ब्लर चेकिंग और ह्यूमन-इन-द-लूप एआई द्वारा सार्वजनिक योजना वितरण का आधुनिकीकरण।',
    metric48Hours: '४८-घंटे में स्वीकृति',
    metric48HoursSub: 'पारंपरिक ४५ दिनों की देरी घटाकर २२.५ गुना तेज़ प्रक्रिया',
    metricZeroBlur: 'शून्य धुंधलेपन अस्वीकृति',
    metricZeroBlurSub: 'अपलोड से पूर्व ब्राउज़र में लेप्लासियन ब्लर गेट (Var ≥ 100)',
    metricZeroMissed: 'शून्य छूटा हुआ सत्र',
    metricZeroMissedSub: 'विदेशी वीज़ा व प्रवेश समय-सीमा का समय पर संरक्षण',
    metricSavings: 'अनुमानित ₹१.८० करोड़ / वर्ष',
    metricSavingsSub: 'तृतीय-पक्ष मैन्युअल सत्यापन एजेंसियों की लागत समाप्त',

    // PPT Audit Trail
    auditTrailTitle: 'संप्रभु ६-चरणीय जीवनचक्र ऑडिट ट्रेल',
    stageIdentity: 'पहचान सत्यापित (IDENTITY VERIFIED)',
    stageDocs: 'दस्तावेज़ वैध (DOCS VALIDATED)',
    stageCrossCheck: 'डेटा क्रॉस-चेक (DATA CROSS-CHECKED)',
    stageEligibility: 'पात्रता एवं योग्यता रैंकिंग (ELIGIBILITY & RANKED)',
    stageFunds: 'निधि वितरण एवं ट्रैकिंग (FUNDS DISBURSED)',
    stageAudit: 'ऑडिट एवं अनुपालन निगरानी (AUDIT & COMPLIANCE)',

    // Action buttons
    applyNfstBtn: 'एन.एफ.एस.टी. (NFST) हेतु आवेदन करें',
    applyNosBtn: 'एन.ओ.एस. (NOS विदेश) हेतु आवेदन करें',
    checkEligibility: '६० सेकंड में पात्रता जांचें',
    activeSchemesHeading: 'मंत्रालय की प्रमुख छात्रवृत्ति एवं फैलोशिप योजनाएं',

    // Technical Pillars (Slide 3)
    techPillarsTitle: 'डिजिटल पब्लिक इंफ्रास्ट्रक्चर (DPI) आधारित तकनीकी ढांचा',
    pillar1Title: '१. बहु-चैनल प्रमाणीकरण एवं अंतर्ग्रहण',
    pillar1Desc: 'डिजीलॉकर SSO, गूगल OAuth एवं ईमेल/ओटीपी। संप्रभु डीपीआई अंतर्ग्रहण। OAuth 2.0 व ई-केवाईसी अनुपालन।',
    pillar2Title: '२. एज ब्लर एवं आईक्यूए (IQA) फिल्टर',
    pillar2Desc: 'ब्राउज़र-साइड ओपनसीवी लेप्लासियन वेरिएंस टेस्ट। Var < 100 पर रीटेक्स, Var ≥ 100 पर स्वीकृति।',
    pillar3Title: '३. लेआउटएलएमवी३ एवं फ़ज़ी मैचिंग',
    pillar3Desc: 'मल्टीमॉडल टोकन संरेखण। जारो-विंकलर मैचिंग द्वारा जनजातीय नाम लिप्यंतरण। विश्वसनीयता > ९२%।',
    pillar4Title: '४. पात्रता नियम एवं योग्यता रैंकिंग इंजन',
    pillar4Desc: 'कॉन्फ़िगर योग्य नियम (आय, श्रेणी, अंक) स्वतः पात्रता जांचते हैं। अधिकारियों की समीक्षा से पूर्व मेरिट रैंकिंग।',
    pillar5Title: '५. अधिकारी स्पॉटलाइट एवं पीएफएमएस भुगतान',
    pillar5Desc: 'अधिकारियों हेतु डुअल-पेन रिव्यू यूआई। पीएफएमएस डीबीटी द्वारा १-क्लिक बैंक स्वीकृति। ३० सेकंड में निर्णय।',
    pillar6Title: '६. एस्केलेशन, ऑडिट एवं अनुपालन ट्रेल',
    pillar6Desc: 'नागरिक: प्रत्येक आवेदन पर वास्तविक समय एसएमएस/ऐप स्थिति। अधिकारी: एआई आत्मविश्वास स्कोर एवं ओवरराइड का संपूर्ण ऑडिट लॉग।',

    // Wizard Steps
    wizardStep1: 'व्यक्तिगत व ई-केवाईसी',
    wizardStep2: 'शैक्षणिक योग्यता',
    wizardStep3: 'योजना एवं शोध विवरण',
    wizardStep4: 'एज ब्लर व एआई दस्तावेज़ जांच',
    wizardStep5: 'समीक्षा एवं घोषणा',
    wizardStep6: 'आवेदन पावती एवं पीएफएमएस',

    backBtn: 'पिछला चरण',
    continueBtn: 'आगे बढ़ें',
    saveDraft: 'सुरक्षित रखें',
    submitApplication: 'सत्यापित आवेदन जमा करें',

    // AI Check & Edge Filter
    aiScanningTitle: 'ब्राउज़र-स्तरीय एज ब्लर एवं लेआउटएलएमवी३ जांच',
    aiScanningDesc: 'अपलोड से पूर्व दस्तावेज़ की स्पष्टता, जारो-विंकलर मिलान एवं ई-डिस्ट्रिक्ट रिकॉर्ड की त्वरित जांच।',
    ocrConfidence: 'विश्वसनीयता',
    nameMatch: 'जारो-विंकलर मिलान',
    laplacianVariance: 'लेप्लासियन वेरिएंस',
    statusVerified: 'सत्यापित एवं सही',
    statusDiscrepancy: 'सुधार की आवश्यकता',
    statusProcessing: 'दस्तावेज़ की जांच हो रही है...',

    // Status Tracker
    trackerTitle: 'आवेदन जीवनचक्र ट्रैकर',
    submitted: 'जमा हुआ',
    underScrutiny: 'स्पॉटलाइट जांच जारी',
    deficiencyFound: 'त्रुटि दर्ज की गई',
    verified: 'दस्तावेज़ सत्यापित',
    committeeReview: 'चयन समिति समीक्षा',
    selected: 'अंतिम चयन एवं स्वीकृत',

    // Role names
    roleApplicant: 'जनजातीय शोधार्थी',
    roleScrutiny: 'नोडल जांच अधिकारी (Scrutiny Officer)',
    roleCommittee: 'चयन समिति सदस्य',
    roleAdmin: 'मंत्रालय प्रशासक (MoTA Admin)'
  }
};
