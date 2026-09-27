import { NextRequest, NextResponse } from 'next/server';
import {
  getApplicationById,
  updateApplication,
  resolveDeficiencyInStore,
  addNotificationToStore
} from '@/lib/store';
import { DeficiencyNotice, VerificationLog } from '@/lib/types';
import { sendRealDeficiencyEmail } from '@/lib/mailer';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { action, officerName = 'Dr. Rajeshwar Rao', officerRole = 'SCRUTINY_OFFICER', remarks, data } = body;

    const application = getApplicationById(id);
    if (!application) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    const timestamp = new Date().toISOString();

    switch (action) {
      case 'RAISE_DEFICIENCY': {
        const newDeficiency: DeficiencyNotice = {
          id: `def-${Date.now()}`,
          documentType: data.documentType || 'DOCUMENT',
          title: data.title || 'Document Deficiency Flagged',
          reason: data.reason || remarks || 'Deficiency identified during scrutiny.',
          suggestedAction: data.suggestedAction || 'Please re-upload a clear and valid document.',
          flaggedBy: `${officerName} (${officerRole})`,
          flaggedAt: timestamp,
          resolved: false,
          officerRemarks: remarks
        };

        const newLog: VerificationLog = {
          id: `log-${Date.now()}`,
          applicationId: application.id,
          officerName,
          officerRole,
          action: 'DEFICIENCY_RAISED',
          details: `Deficiency flagged: ${newDeficiency.title}. ${remarks || ''}`,
          timestamp
        };

        // Also add simulated notification for the applicant
        addNotificationToStore({
          id: `notif-${Date.now()}`,
          userId: application.applicantId,
          title: `Deficiency Flagged: ${newDeficiency.title}`,
          titleHi: `त्रुटि दर्ज की गई: ${newDeficiency.title}`,
          message: newDeficiency.reason,
          messageHi: newDeficiency.reason,
          type: 'WARNING',
          channel: 'SMS',
          createdAt: timestamp,
          read: false,
          link: '/portal'
        });

        // Send real deficiency notification email via Gmail SMTP if student email exists
        if (application.formData?.emailAddress) {
          sendRealDeficiencyEmail({
            toEmail: application.formData.emailAddress,
            studentName: application.applicantName,
            applicationId: application.id,
            deficiencyTitle: newDeficiency.title,
            reason: newDeficiency.reason,
            suggestedAction: newDeficiency.suggestedAction,
            officerName: `${officerName} (${officerRole})`
          }).catch(err => console.error('[SMTP] Background deficiency email error:', err));
        }

        const updated = updateApplication(id, {
          status: 'DEFICIENCY_FLAGGED',
          deficiencyNotices: [newDeficiency, ...application.deficiencyNotices],
          verificationLogs: [...application.verificationLogs, newLog],
          aiRiskScore: Math.min(85, application.aiRiskScore + 30)
        });

        return NextResponse.json({ success: true, application: updated });
      }

      case 'RESOLVE_DEFICIENCY': {
        const { documentId, updatedDoc } = data;
        const updated = resolveDeficiencyInStore(id, documentId, updatedDoc);

        addNotificationToStore({
          id: `notif-${Date.now()}`,
          userId: 'user-scrutiny',
          title: `Resubmission: ${application.id}`,
          message: `Applicant ${application.applicantName} resubmitted document for verification.`,
          type: 'INFO',
          channel: 'IN_APP',
          createdAt: timestamp,
          read: false,
          link: `/admin/review/${application.id}`
        });

        return NextResponse.json({ success: true, application: updated });
      }

      case 'VERIFY_APPLICATION': {
        const newLog: VerificationLog = {
          id: `log-${Date.now()}`,
          applicationId: application.id,
          officerName,
          officerRole,
          action: 'APPLICATION_VERIFIED',
          details: remarks || 'All submitted documents verified authentic. Passed to Selection Committee.',
          timestamp
        };

        const updated = updateApplication(id, {
          status: 'SCRUTINY_VERIFIED',
          verificationLogs: [...application.verificationLogs, newLog],
          aiRiskScore: Math.min(application.aiRiskScore, 10)
        });

        addNotificationToStore({
          id: `notif-${Date.now()}`,
          userId: application.applicantId,
          title: 'Application Scrutiny Complete',
          titleHi: 'दस्तावेज़ सत्यापन पूर्ण',
          message: 'All your documents have been verified authentic by MoTA Scrutiny Cell.',
          messageHi: 'आपके सभी दस्तावेज़ सफलतापूर्वक सत्यापित हो चुके हैं।',
          type: 'SUCCESS',
          channel: 'EMAIL',
          createdAt: timestamp,
          read: false,
          link: '/portal'
        });

        return NextResponse.json({ success: true, application: updated });
      }

      case 'COMMITTEE_SHORTLIST': {
        const newLog: VerificationLog = {
          id: `log-${Date.now()}`,
          applicationId: application.id,
          officerName,
          officerRole,
          action: 'COMMITTEE_SHORTLISTED',
          details: remarks || 'Recommended by Selection Committee for Provisional Fellowship Award.',
          timestamp
        };

        const updated = updateApplication(id, {
          status: 'COMMITTEE_SHORTLISTED',
          committeeStatus: 'APPROVED',
          verificationLogs: [...application.verificationLogs, newLog]
        });

        return NextResponse.json({ success: true, application: updated });
      }

      case 'AWARD_FELLOWSHIP': {
        const newLog: VerificationLog = {
          id: `log-${Date.now()}`,
          applicationId: application.id,
          officerName,
          officerRole,
          action: 'PROVISIONALLY_AWARDED',
          details: remarks || 'Fellowship Sanctioned under Presidential MoTA Notification. DBT initiated.',
          timestamp
        };

        const updated = updateApplication(id, {
          status: 'PROVISIONALLY_SELECTED',
          verificationLogs: [...application.verificationLogs, newLog]
        });

        addNotificationToStore({
          id: `notif-${Date.now()}`,
          userId: application.applicantId,
          title: '🎉 Congratulations! Fellowship Award Sanctioned',
          titleHi: '🎉 बधाई! राष्ट्रीय फैलोशिप स्वीकृत की गई',
          message: `Your fellowship under ${application.schemeTitle} has been sanctioned. Download award letter from portal.`,
          messageHi: `आपका फैलोशिप आवेदन स्वीकृत हो चुका है। पोर्टल से स्वीकृति पत्र डाउनलोड करें।`,
          type: 'SUCCESS',
          channel: 'SMS',
          createdAt: timestamp,
          read: false,
          link: '/portal'
        });

        return NextResponse.json({ success: true, application: updated });
      }

      case 'OVERRIDE_MERIT_SCORE': {
        const { newScore, overrideReason } = data;
        const newLog: VerificationLog = {
          id: `log-${Date.now()}`,
          applicationId: application.id,
          officerName,
          officerRole,
          action: 'MANUAL_SCORE_OVERRIDE',
          details: `Merit score adjusted to ${newScore}. Reason: ${overrideReason}`,
          timestamp
        };

        const updated = updateApplication(id, {
          meritScore: newScore,
          committeeOverrideNote: overrideReason,
          verificationLogs: [...application.verificationLogs, newLog]
        });

        return NextResponse.json({ success: true, application: updated });
      }

      case 'REJECT_APPLICATION': {
        const newLog: VerificationLog = {
          id: `log-${Date.now()}`,
          applicationId: application.id,
          officerName,
          officerRole,
          action: 'REJECTED',
          details: remarks || 'Application does not meet statutory scheme criteria.',
          timestamp
        };

        const updated = updateApplication(id, {
          status: 'REJECTED',
          committeeStatus: 'REJECTED',
          verificationLogs: [...application.verificationLogs, newLog]
        });

        addNotificationToStore({
          id: `notif-${Date.now()}`,
          userId: application.applicantId,
          title: 'Status Update: Fellowship Application Not Selected',
          titleHi: 'आवेदन स्थिति: छात्रवृत्ति हेतु चयन नहीं',
          message: `Your application ${application.id} for ${application.schemeTitle} was evaluated by the Selection Committee but not selected.`,
          messageHi: `आपका आवेदन चयन समिति द्वारा मूल्यांकित किया गया था किंतु चयन नहीं हो सका।`,
          type: 'WARNING',
          channel: 'EMAIL',
          createdAt: timestamp,
          read: false,
          link: '/portal'
        });

        return NextResponse.json({ success: true, application: updated });
      }

      case 'ADD_REMARK': {
        const newLog: VerificationLog = {
          id: `log-${Date.now()}`,
          applicationId: application.id,
          officerName,
          officerRole,
          action: 'FIELD_VERIFIED',
          details: `Committee Remark: ${remarks || data?.remark || 'Remark recorded by panel.'}`,
          timestamp
        };

        const updated = updateApplication(id, {
          committeeOverrideNote: remarks || data?.remark,
          verificationLogs: [...application.verificationLogs, newLog]
        });

        return NextResponse.json({ success: true, application: updated });
      }

      case 'FLAG_FOR_SCRUTINY': {
        const newLog: VerificationLog = {
          id: `log-${Date.now()}`,
          applicationId: application.id,
          officerName,
          officerRole,
          action: 'DEFICIENCY_RAISED',
          details: `Flagged by Selection Committee for re-scrutiny: ${remarks || 'Requires detailed officer review.'}`,
          timestamp
        };

        const updated = updateApplication(id, {
          status: 'UNDER_SCRUTINY',
          committeeStatus: 'PENDING',
          verificationLogs: [...application.verificationLogs, newLog]
        });

        addNotificationToStore({
          id: `notif-${Date.now()}`,
          userId: 'user-scrutiny',
          title: `Selection Committee Re-Scrutiny Flag: ${application.id}`,
          message: `Prof. Kamala Tirkey flagged application ${application.id} for re-scrutiny: ${remarks || 'Review required'}`,
          type: 'WARNING',
          channel: 'IN_APP',
          createdAt: timestamp,
          read: false,
          link: `/admin/review/${application.id}`
        });

        return NextResponse.json({ success: true, application: updated });
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
