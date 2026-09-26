'use client';

import React from 'react';
import { useLanguage } from './LanguageContext';
import { initialNotifications } from '@/lib/store';
import {
  Bell,
  X,
  MessageSquare,
  Mail,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export function NotificationDrawer() {
  const { notificationsOpen, setNotificationsOpen, currentUser, lang } = useLanguage();

  if (!notificationsOpen) return null;

  // Filter notifications for current user or show relevant system alerts
  const userNotifs = initialNotifications.filter(
    n => n.userId === currentUser.id || currentUser.role !== 'APPLICANT'
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-sm">
              {lang === 'hi' ? 'सूचनाएं एवं संचार लॉग (SMS/Email)' : 'Live Notifications & SMS Trail'}
            </h2>
          </div>
          <button
            onClick={() => setNotificationsOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-md"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DPDP Compliance Notice */}
        <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex items-center justify-between text-emerald-900 text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>DPDP Act 2023 Compliant Citizen Notification Rail</span>
          </div>
          <span className="font-mono text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-800">
            AES-256
          </span>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {userNotifs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No new alerts or messages.
            </div>
          ) : (
            userNotifs.map(notif => {
              const isSMS = notif.channel === 'SMS';
              const isEmail = notif.channel === 'EMAIL';
              const isWarning = notif.type === 'WARNING';

              return (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isWarning
                      ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      {isSMS ? (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded font-mono">
                          <Smartphone className="w-3 h-3 text-blue-600" />
                          SMS Dispatched
                        </span>
                      ) : isEmail ? (
                        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.5 rounded font-mono">
                          <Mail className="w-3 h-3 text-purple-600" />
                          Official Email
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-mono">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          In-App Portal
                        </span>
                      )}
                      <span className="truncate">{lang === 'hi' && notif.titleHi ? notif.titleHi : notif.title}</span>
                    </div>

                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed mb-2">
                    {lang === 'hi' && notif.messageHi ? notif.messageHi : notif.message}
                  </p>

                  {notif.link && (
                    <div className="flex justify-end">
                      <Link
                        href={notif.link}
                        onClick={() => setNotificationsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer with Helpline */}
        <div className="bg-slate-100 p-3 border-t border-slate-200 text-center text-xs text-slate-600">
          <p className="font-semibold text-slate-800">MoTA Tribal Scholar Helpline: 1800-11-7777</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Automated SMS & WhatsApp status active</p>
        </div>
      </div>
    </div>
  );
}
