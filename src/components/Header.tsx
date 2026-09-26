'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import {
  Bell,
  Menu,
  X,
  FileCheck2,
  Users,
  Sliders,
  BarChart3,
  Search,
  Sparkles,
  Award,
  Layers
} from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';

export function Header() {
  const { t, lang, currentUser, notificationsOpen, setNotificationsOpen } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isApplicant = currentUser.role === 'APPLICANT';
  const isOfficer = ['SCRUTINY_OFFICER', 'SELECTION_COMMITTEE', 'ADMIN'].includes(currentUser.role);

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Emblem + Brand */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link href="/" className="flex items-center space-x-3 group">
                {/* Simulated National Emblem SVG */}
                <div className="w-12 h-12 bg-linear-to-b from-amber-600 via-amber-700 to-amber-900 rounded-full p-1.5 flex items-center justify-center shadow-md border-2 border-amber-300">
                  <div className="text-white text-center font-serif leading-none">
                    <span className="block text-[15px] font-black tracking-widest">सत्य</span>
                    <span className="block text-[8px] font-semibold text-amber-200 uppercase tracking-tighter">MoTA</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-blue-900 transition-colors">
                      {lang === 'hi' ? 'विद्यासेतु' : 'VidyaSetu'}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      AI Powered
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 font-medium line-clamp-1">
                    {lang === 'hi'
                      ? 'जनजातीय कार्य मंत्रालय • भारत सरकार'
                      : 'Ministry of Tribal Affairs • Government of India'}
                  </p>
                </div>
              </Link>
            </div>

            {/* Middle: Primary Navigation Desktop */}
            <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md transition-colors ${
                  pathname === '/' ? 'text-blue-900 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                }`}
              >
                {t.home}
              </Link>

              {isApplicant && (
                <>
                  <Link
                    href="/apply"
                    className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                      pathname === '/apply' ? 'text-blue-900 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                    }`}
                  >
                    <Award className="w-4 h-4 text-emerald-600" />
                    {t.applyNow}
                  </Link>

                  <Link
                    href="/track"
                    className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                      pathname === '/track' ? 'text-blue-900 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                    }`}
                  >
                    <Search className="w-4 h-4 text-slate-500" />
                    {t.trackApplication}
                  </Link>

                  <Link
                    href="/portal"
                    className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                      pathname === '/portal' ? 'text-blue-900 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-blue-600" />
                    {t.studentPortal}
                  </Link>
                </>
              )}

              {/* Admin & Official Quick Links */}
              {isOfficer && (
                <>
                  <Link
                    href="/admin"
                    className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                      pathname === '/admin' ? 'text-blue-900 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4 text-blue-600" />
                    Scrutiny Queue
                  </Link>

                  <Link
                    href="/admin/selection"
                    className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                      pathname === '/admin/selection' ? 'text-blue-900 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-4 h-4 text-purple-600" />
                    Selection Committee
                  </Link>

                  <Link
                    href="/admin/rules"
                    className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                      pathname === '/admin/rules' ? 'text-blue-900 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                    }`}
                  >
                    <Sliders className="w-4 h-4 text-amber-600" />
                    Scheme Rules
                  </Link>

                  <Link
                    href="/admin/analytics"
                    className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                      pathname === '/admin/analytics' ? 'text-blue-900 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                    Analytics
                  </Link>
                </>
              )}
            </nav>

            {/* Right: Notifications + User Profile Badge */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Notification Button */}
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="View notifications and SMS logs"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              </button>

              {/* User Identity Chip */}
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <div className="relative w-8 h-8 rounded-full bg-slate-200 overflow-hidden ring-1 ring-slate-300">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-700 text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 line-clamp-1 leading-tight">
                    {lang === 'hi' && currentUser.nameHi ? currentUser.nameHi : currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {currentUser.role === 'APPLICANT'
                      ? `ST Scholar (${currentUser.community || 'Tribal'})`
                      : currentUser.role === 'SCRUTINY_OFFICER'
                      ? 'Scrutiny Officer'
                      : currentUser.role === 'SELECTION_COMMITTEE'
                      ? 'Committee Member'
                      : 'MoTA Director'}
                  </div>
                </div>
              </div>

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-slate-800 hover:bg-slate-100"
            >
              {t.home}
            </Link>
            <Link
              href="/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-slate-800 hover:bg-slate-100"
            >
              {t.applyNow}
            </Link>
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-slate-800 hover:bg-slate-100"
            >
              {t.trackApplication}
            </Link>
            <Link
              href="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-slate-800 hover:bg-slate-100"
            >
              {t.studentPortal}
            </Link>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
                Official Ministry Portals
              </span>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md font-medium text-blue-900 hover:bg-blue-50 mt-1"
              >
                Scrutiny Verification Queue
              </Link>
              <Link
                href="/admin/selection"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md font-medium text-purple-900 hover:bg-purple-50"
              >
                Selection Committee Merit Shortlist
              </Link>
              <Link
                href="/admin/rules"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md font-medium text-amber-900 hover:bg-amber-50"
              >
                Configurable Eligibility Rules Engine
              </Link>
              <Link
                href="/admin/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md font-medium text-emerald-900 hover:bg-emerald-50"
              >
                MoTA Executive Analytics
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Slide-out Notification Drawer */}
      <NotificationDrawer />
    </>
  );
}
