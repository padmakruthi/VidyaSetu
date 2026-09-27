import nodemailer from 'nodemailer';

interface SendOtpParams {
  toEmail: string;
  otp: string;
  studentName?: string;
}

export async function sendRealOtpEmail({ toEmail, otp, studentName }: SendOtpParams) {
  const smtpEmail = (process.env.SMTP_EMAIL || '').trim().replace(/@+/g, '@');
  const smtpPass = (process.env.SMTP_APP_PASSWORD || '').replace(/\s+/g, '');

  if (!smtpEmail || !smtpPass || smtpEmail.includes('your-gmail') || smtpPass.includes('your-gmail')) {
    // If credentials are placeholder defaults, return skipped notice for dev fallback
    return {
      success: true,
      emailSent: false,
      message: 'SMTP credentials set to placeholders. Simulated OTP drawer active.'
    };
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // TLS
    auth: {
      user: smtpEmail,
      pass: smtpPass
    }
  });

  const recipientName = studentName || 'ST Scholar';

  const mailOptions = {
    from: `"VidyaSetu (MoTA)" <${smtpEmail}>`,
    to: toEmail,
    subject: `Your VidyaSetu Verification Code: ${otp}`,
    text: `Dear ${recipientName},\n\nThank you for registering on VidyaSetu, Ministry of Tribal Affairs. Your 6-digit One Time Password (OTP) for student account verification is:\n\n${otp}\n\nThis OTP is valid for 10 minutes. Please do not share this code with anyone.\n\nMinistry of Tribal Affairs, Government of India`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #0f172a; padding: 16px 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #fbbf24; font-size: 20px; margin: 0; font-family: Georgia, serif;">VIDYASETU (विद्यासेतु)</h1>
          <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0;">Ministry of Tribal Affairs, Government of India</p>
        </div>
        <div style="padding: 24px; color: #334155;">
          <h2 style="color: #0f172a; font-size: 16px; margin-top: 0;">Student Account Verification OTP</h2>
          <p style="font-size: 14px; line-height: 1.5;">Dear <strong>${recipientName}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.5;">Thank you for registering on VidyaSetu. Use the 6-digit verification code below to complete your registration:</p>
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
    console.log(`[SMTP] Real OTP Email sent to ${toEmail}. MessageId: ${info.messageId}`);
    return {
      success: true,
      emailSent: true,
      messageId: info.messageId
    };
  } catch (err: any) {
    console.error(`[SMTP ERROR] Failed to send email to ${toEmail}:`, err.message);
    throw new Error(`Email delivery failed: ${err.message}`);
  }
}

interface SendDeficiencyParams {
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
  const smtpEmail = (process.env.SMTP_EMAIL || '').trim().replace(/@+/g, '@');
  const smtpPass = (process.env.SMTP_APP_PASSWORD || '').replace(/\s+/g, '');

  if (!smtpEmail || !smtpPass || smtpEmail.includes('your-gmail') || smtpPass.includes('your-gmail')) {
    return {
      success: true,
      emailSent: false,
      message: 'SMTP credentials set to placeholders. Simulated notification fallback active.'
    };
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // TLS
    auth: {
      user: smtpEmail,
      pass: smtpPass
    }
  });

  const mailOptions = {
    from: `"VidyaSetu Scrutiny Desk (MoTA)" <${smtpEmail}>`,
    to: toEmail,
    subject: `[ACTION REQUIRED] Deficiency Flagged for Application ${applicationId}`,
    text: `Dear ${studentName},\n\nA deficiency notice has been issued for your scholarship application (${applicationId}) by ${officerName}.\n\nTitle: ${deficiencyTitle}\nReason: ${reason}\nSuggested Action: ${suggestedAction}\n\nPlease log into your VidyaSetu portal to re-upload documents or book an in-person office visit.\n\nMinistry of Tribal Affairs`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #991b1b; padding: 16px 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #ffffff; font-size: 18px; margin: 0; font-family: Georgia, serif;">VIDYASETU DEFICIENCY NOTICE</h1>
          <p style="color: #fecaca; font-size: 11px; margin: 4px 0 0 0;">Ministry of Tribal Affairs Scrutiny Desk</p>
        </div>
        <div style="padding: 24px; color: #334155;">
          <h2 style="color: #991b1b; font-size: 16px; margin-top: 0;">Action Required on Application ${applicationId}</h2>
          <p style="font-size: 14px;">Dear <strong>${studentName}</strong>,</p>
          <p style="font-size: 14px;">Scrutiny Officer <strong>${officerName}</strong> has flagged a deficiency on your scholarship application:</p>
          
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #991b1b;">⚠️ ${deficiencyTitle}</p>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #7f1d1d;"><strong>Reason:</strong> ${reason}</p>
            <p style="margin: 0; font-size: 13px; color: #7f1d1d;"><strong>Required Action:</strong> ${suggestedAction}</p>
          </div>

          <p style="font-size: 13px; line-height: 1.5;">You can resolve this deficiency by logging into your VidyaSetu student portal and choosing to either <strong>re-upload the document online</strong> or <strong>book an office visit slot</strong>.</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">© 2026 Ministry of Tribal Affairs, Government of India.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP] Real Deficiency Email sent to ${toEmail}. MessageId: ${info.messageId}`);
    return { success: true, emailSent: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[SMTP ERROR] Failed to send deficiency email to ${toEmail}:`, err.message);
    return { success: false, emailSent: false, error: err.message };
  }
}

