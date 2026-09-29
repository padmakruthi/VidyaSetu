import nodemailer from 'nodemailer';

interface SmtpConfig {
  smtpEmail: string;
  smtpPass: string;
  isConfigured: boolean;
}

export function getSmtpConfig(): SmtpConfig {
  const smtpEmail = (process.env.SMTP_EMAIL || 'nileshchoudhary60309@gmail.com').trim().replace(/@+/g, '@');
  const smtpPass = (process.env.SMTP_APP_PASSWORD || '').replace(/\s+/g, '');
  const isConfigured = Boolean(smtpPass && !smtpPass.includes('your-gmail') && smtpPass.length >= 8);
  return { smtpEmail, smtpPass, isConfigured };
}

function createTransporter() {
  const { smtpEmail, smtpPass, isConfigured } = getSmtpConfig();
  if (!isConfigured) return null;

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    family: 4,
    auth: {
      user: smtpEmail,
      pass: smtpPass
    },
    tls: {
      rejectUnauthorized: false
    }
  } as any);
}

/**
 * Resolves destination email. If it belongs to a dummy demo domain (like @scholar.in),
 * redirects to the admin/sender email so testing in demo mode never bounces and is visible.
 */
function resolveDestinationEmail(toEmail: string, senderEmail: string): { targetEmail: string; isDemoRedirect: boolean } {
  const clean = (toEmail || '').trim();
  const isDummy =
    !clean ||
    clean.endsWith('@scholar.in') ||
    clean.endsWith('@example.com') ||
    clean.endsWith('@test.com') ||
    !clean.includes('@');

  if (isDummy) {
    return { targetEmail: senderEmail, isDemoRedirect: true };
  }
  return { targetEmail: clean, isDemoRedirect: false };
}

function buildDemoBanner(originalRecipient: string, isDemoRedirect: boolean): string {
  if (!isDemoRedirect) return '';
  return `
    <div style="background-color: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 10px 14px; border-radius: 8px; font-size: 12px; margin-bottom: 20px; font-family: sans-serif;">
      <strong>⚠️ Test Mode Notice:</strong> This notification was addressed to demo scholar <code>${originalRecipient}</code> and delivered to this inbox for testing and verification.
    </div>
  `;
}

// ----------------------------------------------------------------------
// 1. Send OTP Verification Email
// ----------------------------------------------------------------------
export interface SendOtpParams {
  toEmail: string;
  otp: string;
  studentName?: string;
}

export async function sendRealOtpEmail({ toEmail, otp, studentName }: SendOtpParams) {
  const { smtpEmail, isConfigured } = getSmtpConfig();
  const { targetEmail, isDemoRedirect } = resolveDestinationEmail(toEmail, smtpEmail);
  const recipientName = studentName || 'ST Scholar';

  if (!isConfigured) {
    console.log(`[SMTP] Notice: Real email dispatch skipped because SMTP_APP_PASSWORD is not configured in .env.local.`);
    console.log(`[SMTP Mock Preview] OTP for ${toEmail}: ${otp}`);
    return {
      success: true,
      emailSent: false,
      message: 'SMTP credentials not configured. Please add SMTP_APP_PASSWORD in .env.local.'
    };
  }

  const transporter = createTransporter();
  if (!transporter) {
    return { success: false, emailSent: false, error: 'Could not initialize mail transporter.' };
  }

  const demoNotice = isDemoRedirect ? ` [TEST FOR: ${toEmail}]` : '';

  const mailOptions = {
    from: smtpEmail,
    to: targetEmail,
    subject: `Your VidyaSetu Verification Code: ${otp}${demoNotice}`,
    text: `Dear ${recipientName},\n\nThank you for registering on VidyaSetu, Ministry of Tribal Affairs. Your 6-digit One Time Password (OTP) for student account verification is:\n\n${otp}\n\nThis OTP is valid for 10 minutes. Please do not share this code with anyone.\n\nMinistry of Tribal Affairs, Government of India`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        ${buildDemoBanner(toEmail, isDemoRedirect)}
        <div style="background-color: #0f172a; padding: 18px 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #fbbf24; font-size: 20px; margin: 0; font-family: Georgia, serif; letter-spacing: 1px;">VIDYASETU (विद्यासेतु)</h1>
          <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0;">Ministry of Tribal Affairs • Government of India</p>
        </div>
        <div style="padding: 24px; color: #334155;">
          <h2 style="color: #0f172a; font-size: 16px; margin-top: 0;">Student Account Verification OTP</h2>
          <p style="font-size: 14px; line-height: 1.5;">Dear <strong>${recipientName}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.5;">Thank you for registering on VidyaSetu. Use the 6-digit verification code below to verify your student account:</p>
          <div style="background-color: #f8fafc; border: 2px dashed #10b981; padding: 16px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #047857;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #64748b;">This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">© 2026 Ministry of Tribal Affairs, Government of India. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP SUCCESS] OTP email sent to ${targetEmail} (MessageId: ${info.messageId})`);
    return { success: true, emailSent: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[SMTP ERROR] Failed to send OTP email to ${targetEmail}:`, err.message);
    return { success: false, emailSent: false, error: err.message };
  }
}

// ----------------------------------------------------------------------
// 2. Send Application Submitted Confirmation Email
// ----------------------------------------------------------------------
export interface SendApplicationSubmittedParams {
  toEmail: string;
  applicantName: string;
  applicationId: string;
  schemeCode: string;
  schemeTitle: string;
  submittedAt: string;
}

export async function sendApplicationSubmittedEmail({
  toEmail,
  applicantName,
  applicationId,
  schemeCode,
  schemeTitle,
  submittedAt
}: SendApplicationSubmittedParams) {
  const { smtpEmail, isConfigured } = getSmtpConfig();
  const { targetEmail, isDemoRedirect } = resolveDestinationEmail(toEmail, smtpEmail);

  if (!isConfigured) {
    console.log(`[SMTP] Notice: Application submitted email skipped (SMTP_APP_PASSWORD missing). App ID: ${applicationId}, Recipient: ${toEmail}`);
    return { success: true, emailSent: false, message: 'SMTP credentials missing' };
  }

  const transporter = createTransporter();
  if (!transporter) return { success: false, emailSent: false, error: 'Transporter failed' };

  const formattedDate = new Date(submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const demoNotice = isDemoRedirect ? ` [TEST FOR: ${toEmail}]` : '';

  const mailOptions = {
    from: smtpEmail,
    to: targetEmail,
    subject: `Application Submitted: ${applicationId} (${schemeCode})${demoNotice}`,
    text: `Dear ${applicantName},\n\nYour application for ${schemeTitle} has been successfully submitted on VidyaSetu.\n\nApplication ID: ${applicationId}\nScheme: ${schemeCode}\nSubmission Time: ${formattedDate} IST\nSLA Mandate: 48-Hour Decision SLA\n\nYou can track the live status of your application on the VidyaSetu portal using your Application ID.\n\nMinistry of Tribal Affairs, Government of India`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        ${buildDemoBanner(toEmail, isDemoRedirect)}
        <div style="background-color: #0f172a; padding: 18px 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #fbbf24; font-size: 20px; margin: 0; font-family: Georgia, serif; letter-spacing: 1px;">VIDYASETU (विद्यासेतु)</h1>
          <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0;">Ministry of Tribal Affairs • Government of India</p>
        </div>

        <div style="padding: 24px; color: #334155;">
          <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 9999px; margin-bottom: 12px;">
            ✓ APPLICATION RECEIVED
          </div>

          <h2 style="color: #0f172a; font-size: 17px; margin-top: 0;">Scholarship Application Submitted Successfully</h2>
          <p style="font-size: 14px; line-height: 1.5;">Dear <strong>${applicantName}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.5;">Your application for <strong>${schemeTitle}</strong> has been received by the Ministry of Tribal Affairs scrutiny cell.</p>

          {/* Details Card */}
          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 18px 0; font-size: 13px;">
            <div style="margin-bottom: 8px;"><strong>Application ID:</strong> <span style="font-family: monospace; color: #1e40af; font-weight: bold;">${applicationId}</span></div>
            <div style="margin-bottom: 8px;"><strong>Scheme:</strong> ${schemeCode} (${schemeTitle})</div>
            <div style="margin-bottom: 8px;"><strong>Submission Timestamp:</strong> ${formattedDate} IST</div>
            <div style="margin-bottom: 8px;"><strong>Processing Mandate:</strong> <span style="color: #047857; font-weight: bold;">48-Hour Decision SLA</span></div>
            <div><strong>Disbursement Rail:</strong> Direct Benefit Transfer (PFMS / Aadhaar Bridge)</div>
          </div>

          <p style="font-size: 13px; line-height: 1.5; color: #475569;">
            Your documents have cleared in-browser edge quality analysis and sovereign AI pre-validation. They are now assigned to the MoTA Scrutiny Cell.
          </p>

          <p style="font-size: 13px; line-height: 1.5; color: #475569;">
            You can monitor the live progression of your file by entering your Application ID in the VidyaSetu portal tracker.
          </p>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">© 2026 Ministry of Tribal Affairs, Government of India. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP SUCCESS] Application submitted email sent to ${targetEmail} (MessageId: ${info.messageId})`);
    return { success: true, emailSent: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[SMTP ERROR] Failed to send submission email to ${targetEmail}:`, err.message);
    return { success: false, emailSent: false, error: err.message };
  }
}

// ----------------------------------------------------------------------
// 3. Send Application Status Update Email (Approved, Shortlisted, Sanctioned, Rejected, etc.)
// ----------------------------------------------------------------------
export interface SendStatusUpdateParams {
  toEmail: string;
  applicantName: string;
  applicationId: string;
  schemeTitle: string;
  status: 'SCRUTINY_VERIFIED' | 'COMMITTEE_SHORTLISTED' | 'PROVISIONALLY_SELECTED' | 'REJECTED' | 'UNDER_SCRUTINY' | string;
  statusTitle: string;
  message: string;
  remarks?: string;
  actionRequired?: string;
}

export async function sendApplicationStatusUpdateEmail({
  toEmail,
  applicantName,
  applicationId,
  schemeTitle,
  status,
  statusTitle,
  message,
  remarks,
  actionRequired
}: SendStatusUpdateParams) {
  const { smtpEmail, isConfigured } = getSmtpConfig();
  const { targetEmail, isDemoRedirect } = resolveDestinationEmail(toEmail, smtpEmail);

  if (!isConfigured) {
    console.log(`[SMTP] Notice: Status update email skipped (SMTP_APP_PASSWORD missing). App ID: ${applicationId}, Status: ${status}`);
    return { success: true, emailSent: false, message: 'SMTP credentials missing' };
  }

  const transporter = createTransporter();
  if (!transporter) return { success: false, emailSent: false, error: 'Transporter failed' };

  // Status visual themes
  let badgeBg = '#dbeafe';
  let badgeBorder = '#93c5fd';
  let badgeColor = '#1e40af';
  let bannerHeaderBg = '#0f172a';

  if (status === 'PROVISIONALLY_SELECTED' || status === 'SCRUTINY_VERIFIED') {
    badgeBg = '#d1fae5';
    badgeBorder = '#6ee7b7';
    badgeColor = '#065f46';
  } else if (status === 'REJECTED') {
    badgeBg = '#fee2e2';
    badgeBorder = '#fca5a5';
    badgeColor = '#991b1b';
    bannerHeaderBg = '#7f1d1d';
  } else if (status === 'COMMITTEE_SHORTLISTED') {
    badgeBg = '#f3e8ff';
    badgeBorder = '#d8b4fe';
    badgeColor = '#6b21a8';
  } else if (status === 'UNDER_SCRUTINY') {
    badgeBg = '#fef3c7';
    badgeBorder = '#fde68a';
    badgeColor = '#92400e';
  }

  const demoNotice = isDemoRedirect ? ` [TEST FOR: ${toEmail}]` : '';

  const mailOptions = {
    from: smtpEmail,
    to: targetEmail,
    subject: `[VidyaSetu Status Update] ${statusTitle} - ${applicationId}${demoNotice}`,
    text: `Dear ${applicantName},\n\nThere is an important status update on your fellowship application (${applicationId}) for ${schemeTitle}.\n\nStatus: ${statusTitle}\nDetails: ${message}\n${remarks ? `Remarks: ${remarks}\n` : ''}${actionRequired ? `Action Required: ${actionRequired}\n` : ''}\nPlease log into the VidyaSetu student portal for full details.\n\nMinistry of Tribal Affairs, Government of India`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        ${buildDemoBanner(toEmail, isDemoRedirect)}
        <div style="background-color: ${bannerHeaderBg}; padding: 18px 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #fbbf24; font-size: 20px; margin: 0; font-family: Georgia, serif; letter-spacing: 1px;">VIDYASETU (विद्यासेतु)</h1>
          <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0;">Ministry of Tribal Affairs • Government of India</p>
        </div>

        <div style="padding: 24px; color: #334155;">
          <div style="display: inline-block; background-color: ${badgeBg}; border: 1px solid ${badgeBorder}; color: ${badgeColor}; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px;">
            ${statusTitle.toUpperCase()}
          </div>

          <h2 style="color: #0f172a; font-size: 17px; margin-top: 0;">Application Status Notice</h2>
          <p style="font-size: 14px; line-height: 1.5;">Dear <strong>${applicantName}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.5;">${message}</p>

          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 18px 0; font-size: 13px;">
            <div style="margin-bottom: 8px;"><strong>Application ID:</strong> <span style="font-family: monospace; color: #1e40af; font-weight: bold;">${applicationId}</span></div>
            <div style="margin-bottom: 8px;"><strong>Scheme:</strong> ${schemeTitle}</div>
            <div style="margin-bottom: 8px;"><strong>Current Status:</strong> <span style="color: ${badgeColor}; font-weight: bold;">${status}</span></div>
            ${remarks ? `<div style="margin-bottom: 8px;"><strong>Evaluation Remarks:</strong> ${remarks}</div>` : ''}
            ${actionRequired ? `<div style="margin-top: 10px; padding: 10px; background-color: #ffffff; border-left: 3px solid ${badgeColor};"><strong>Next Action:</strong> ${actionRequired}</div>` : ''}
          </div>

          <p style="font-size: 13px; line-height: 1.5; color: #475569;">
            You can review the updated status and download relevant letters or documentation directly from your <strong>VidyaSetu Student Portal</strong>.
          </p>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">© 2026 Ministry of Tribal Affairs, Government of India. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP SUCCESS] Status update email sent to ${targetEmail} for ${applicationId} (${status}) (MessageId: ${info.messageId})`);
    return { success: true, emailSent: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[SMTP ERROR] Failed to send status email to ${targetEmail}:`, err.message);
    return { success: false, emailSent: false, error: err.message };
  }
}

// ----------------------------------------------------------------------
// 4. Send Deficiency Notice Email
// ----------------------------------------------------------------------
export interface SendDeficiencyParams {
  toEmail: string;
  studentName: string;
  applicationId: string;
  deficiencyTitle: string;
  reason: string;
  suggestedAction: string;
  officerName: string;
}

export async function sendRealDeficiencyEmail({
  toEmail,
  studentName,
  applicationId,
  deficiencyTitle,
  reason,
  suggestedAction,
  officerName
}: SendDeficiencyParams) {
  const { smtpEmail, isConfigured } = getSmtpConfig();
  const { targetEmail, isDemoRedirect } = resolveDestinationEmail(toEmail, smtpEmail);

  if (!isConfigured) {
    console.log(`[SMTP] Notice: Deficiency email skipped (SMTP_APP_PASSWORD missing). App ID: ${applicationId}`);
    return { success: true, emailSent: false, message: 'SMTP credentials missing' };
  }

  const transporter = createTransporter();
  if (!transporter) return { success: false, emailSent: false, error: 'Transporter failed' };

  const demoNotice = isDemoRedirect ? ` [TEST FOR: ${toEmail}]` : '';

  const mailOptions = {
    from: `"VidyaSetu Scrutiny Desk (MoTA)" <${smtpEmail}>`,
    to: targetEmail,
    subject: `[ACTION REQUIRED] Deficiency Flagged on Application ${applicationId}${demoNotice}`,
    text: `Dear ${studentName},\n\nA deficiency notice has been issued for your scholarship application (${applicationId}) by ${officerName}.\n\nDeficiency Title: ${deficiencyTitle}\nReason: ${reason}\nSuggested Action: ${suggestedAction}\n\nPlease log into your VidyaSetu portal to re-upload documents or book an in-person office visit.\n\nMinistry of Tribal Affairs, Government of India`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        ${buildDemoBanner(toEmail, isDemoRedirect)}
        <div style="background-color: #991b1b; padding: 18px 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #ffffff; font-size: 19px; margin: 0; font-family: Georgia, serif;">VIDYASETU DEFICIENCY NOTICE</h1>
          <p style="color: #fecaca; font-size: 11px; margin: 4px 0 0 0;">Ministry of Tribal Affairs Scrutiny Desk</p>
        </div>

        <div style="padding: 24px; color: #334155;">
          <h2 style="color: #991b1b; font-size: 16px; margin-top: 0;">Action Required: Document Deficiency Flagged</h2>
          <p style="font-size: 14px;">Dear <strong>${studentName}</strong>,</p>
          <p style="font-size: 14px;">Scrutiny Officer <strong>${officerName}</strong> has flagged a deficiency on your scholarship application (<strong>${applicationId}</strong>):</p>

          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 6px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #991b1b; font-size: 14px;">⚠️ ${deficiencyTitle}</p>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #7f1d1d;"><strong>Reason:</strong> ${reason}</p>
            <p style="margin: 0; font-size: 13px; color: #7f1d1d;"><strong>Required Action:</strong> ${suggestedAction}</p>
          </div>

          <p style="font-size: 13px; line-height: 1.5;">
            You can resolve this deficiency quickly by logging into your VidyaSetu student portal and choosing one of two options:
          </p>
          <ul style="font-size: 13px; line-height: 1.6; color: #475569;">
            <li><strong>Re-upload Document Online:</strong> Instant AI Laplacian variance check and auto-resubmission.</li>
            <li><strong>Book an In-Person Office Visit:</strong> Book a slot at your nearest district ST Welfare Office for physical verification.</li>
          </ul>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">© 2026 Ministry of Tribal Affairs, Government of India. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP SUCCESS] Deficiency email sent to ${targetEmail} (MessageId: ${info.messageId})`);
    return { success: true, emailSent: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[SMTP ERROR] Failed to send deficiency email to ${targetEmail}:`, err.message);
    return { success: false, emailSent: false, error: err.message };
  }
}

// ----------------------------------------------------------------------
// 5. Send Office Visit Slot Booking Confirmation Email
// ----------------------------------------------------------------------
export interface SendVisitBookingParams {
  toEmail: string;
  applicantName: string;
  applicationId: string;
  officeName: string;
  officeAddress: string;
  date: string;
  timeSlot: string;
  contactOfficer: string;
  referenceNo: string;
}

export async function sendOfficeVisitBookingEmail({
  toEmail,
  applicantName,
  applicationId,
  officeName,
  officeAddress,
  date,
  timeSlot,
  contactOfficer,
  referenceNo
}: SendVisitBookingParams) {
  const { smtpEmail, isConfigured } = getSmtpConfig();
  const { targetEmail, isDemoRedirect } = resolveDestinationEmail(toEmail, smtpEmail);

  if (!isConfigured) {
    console.log(`[SMTP] Notice: Office visit booking email skipped (SMTP_APP_PASSWORD missing). App ID: ${applicationId}`);
    return { success: true, emailSent: false, message: 'SMTP credentials missing' };
  }

  const transporter = createTransporter();
  if (!transporter) return { success: false, emailSent: false, error: 'Transporter failed' };

  const demoNotice = isDemoRedirect ? ` [TEST FOR: ${toEmail}]` : '';

  const mailOptions = {
    from: `"VidyaSetu (MoTA)" <${smtpEmail}>`,
    to: targetEmail,
    subject: `Office Visit Slot Confirmed: ${referenceNo} [${applicationId}]${demoNotice}`,
    text: `Dear ${applicantName},\n\nYour in-person document verification visit has been booked successfully.\n\nBooking Reference: ${referenceNo}\nApplication ID: ${applicationId}\nVenue: ${officeName} (${officeAddress})\nDate: ${date}\nTime Slot: ${timeSlot}\nNodal Officer: ${contactOfficer}\n\nPlease bring your original documents and Aadhaar card.\n\nMinistry of Tribal Affairs, Government of India`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        ${buildDemoBanner(toEmail, isDemoRedirect)}
        <div style="background-color: #0f172a; padding: 18px 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #fbbf24; font-size: 20px; margin: 0; font-family: Georgia, serif; letter-spacing: 1px;">VIDYASETU (विद्यासेतु)</h1>
          <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0;">Ministry of Tribal Affairs • Government of India</p>
        </div>

        <div style="padding: 24px; color: #334155;">
          <div style="display: inline-block; background-color: #dbeafe; border: 1px solid #93c5fd; color: #1e40af; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 9999px; margin-bottom: 12px;">
            ✓ APPOINTMENT CONFIRMED
          </div>

          <h2 style="color: #0f172a; font-size: 17px; margin-top: 0;">In-Person Verification Visit Scheduled</h2>
          <p style="font-size: 14px; line-height: 1.5;">Dear <strong>${applicantName}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.5;">Your appointment for in-person document scrutiny has been reserved at your regional ST Welfare Office:</p>

          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 18px 0; font-size: 13px;">
            <div style="margin-bottom: 8px;"><strong>Booking Reference:</strong> <span style="font-family: monospace; color: #1e40af; font-weight: bold;">${referenceNo}</span></div>
            <div style="margin-bottom: 8px;"><strong>Application ID:</strong> ${applicationId}</div>
            <div style="margin-bottom: 8px;"><strong>Center:</strong> ${officeName}</div>
            <div style="margin-bottom: 8px;"><strong>Address:</strong> ${officeAddress}</div>
            <div style="margin-bottom: 8px;"><strong>Appointment Date:</strong> <span style="font-weight: bold;">${date}</span></div>
            <div style="margin-bottom: 8px;"><strong>Time Slot:</strong> <span style="font-weight: bold; color: #047857;">${timeSlot}</span></div>
            <div><strong>Nodal Officer:</strong> ${contactOfficer}</div>
          </div>

          <p style="font-size: 13px; line-height: 1.5; color: #475569;">
            <strong>Items to bring for verification:</strong>
          </p>
          <ul style="font-size: 12px; line-height: 1.6; color: #475569;">
            <li>Original ST / Caste Certificate issued by competent Revenue Authority.</li>
            <li>Original Income Certificate / ITR acknowledgement.</li>
            <li>Original Academic Marksheets & Degree Certificates.</li>
            <li>Original Aadhaar Card and printed copy of this appointment slip.</li>
          </ul>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">© 2026 Ministry of Tribal Affairs, Government of India. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP SUCCESS] Office visit email sent to ${targetEmail} (MessageId: ${info.messageId})`);
    return { success: true, emailSent: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[SMTP ERROR] Failed to send visit booking email to ${targetEmail}:`, err.message);
    return { success: false, emailSent: false, error: err.message };
  }
}
