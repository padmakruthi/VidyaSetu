'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import { useRouter } from 'next/navigation';
import { UserAvatar } from './UserAvatar';
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
  Layers,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';
import { IndianFlag } from './IndianFlag';
import { VidyasetuLogo } from './VidyasetuLogo';
import { SplashScreen } from './SplashScreen';

export function Header() {
  const router = useRouter();
  const { t, lang, currentUser, switchUser, notificationsOpen, setNotificationsOpen } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [splashOpen, setSplashOpen] = useState(false);

  const isApplicant = currentUser?.role === 'APPLICANT';
  const isOfficer = currentUser && ['SCRUTINY_OFFICER', 'SELECTION_COMMITTEE', 'ADMIN'].includes(currentUser.role);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    if (switchUser) {
      await switchUser(null as any);
    }
    // Redirect directly to starting Home Page
    router.push('/');
  };

  return (
    <>
      {/* Interactive Splash Screen Component */}
      <SplashScreen forceShow={splashOpen} onClose={() => setSplashOpen(false)} />

      {/* Sovereign Tricolor Gradient Top Strip */}
      <div className="h-1 bg-linear-to-r from-amber-500 via-emerald-500 to-blue-600 w-full" />

      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: VidyaSetu Logo Image & Brand Title */}
            <div className="flex items-center space-x-3 shrink-0">
              <Link href="/" className="flex items-center space-x-2.5 group">
                {/* Exact VidyaSetu Logo Image */}
                <img
                  src="/vidyasetu_logo.png"
                  alt="VidyaSetu Logo"
                  className="h-11 sm:h-12 w-auto object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
                />

                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight group-hover:text-blue-900 transition-colors">
                      {lang === 'hi' ? 'विद्यासेतु' : 'VidyaSetu'}
                    </span>
                    <IndianFlag size="sm" />
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-300 hidden sm:inline-flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                      AI Powered
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-emerald-700 font-bold uppercase tracking-wider font-mono line-clamp-1">
                    {lang === 'hi' ? 'हर विद्यार्थी का, सफलता का मार्ग' : 'HAR VIDYARTHI KA, SAFALTA KA MARG'}
                  </p>
                </div>
              </Link>
            </div>

            {/* Middle: Primary Navigation Desktop */}
            <nav className="hidden lg:flex items-center space-x-1 font-medium text-xs xl:text-sm ml-4 shrink-0">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md transition-colors ${
                  pathname === '/' ? 'text-blue-900 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                }`}
              >
                {t.home}
              </Link>

              <Link
                href="/about"
                className={`px-3 py-2 rounded-md transition-colors ${
                  pathname === '/about' ? 'text-blue-900 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                }`}
              >
                About Us
              </Link>

              <Link
                href="/contact"
                className={`px-3 py-2 rounded-md transition-colors ${
                  pathname === '/contact' ? 'text-blue-900 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                }`}
              >
                Contact Us
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

              {/* Officer Navigation Links */}
              {isOfficer && (
                <>
                  {(currentUser.role === 'SCRUTINY_OFFICER' || currentUser.role === 'ADMIN') && (
                    <Link
                      href="/admin"
                      className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                        pathname === '/admin' ? 'text-blue-900 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                      }`}
                    >
                      <FileCheck2 className="w-4 h-4 text-blue-600" />
                      Scrutiny Queue
                    </Link>
                  )}

                  {(currentUser.role === 'SELECTION_COMMITTEE' || currentUser.role === 'ADMIN') && (
                    <Link
                      href="/admin/selection"
                      className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                        pathname === '/admin/selection' ? 'text-blue-900 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                      }`}
                    >
                      <Users className="w-4 h-4 text-purple-600" />
                      Selection Committee
                    </Link>
                  )}

                  {(currentUser.role === 'SELECTION_COMMITTEE' || currentUser.role === 'ADMIN') && (
                    <Link
                      href="/admin/rules"
                      className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                        pathname === '/admin/rules' ? 'text-blue-900 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                      }`}
                    >
                      <Sliders className="w-4 h-4 text-amber-600" />
                      Scheme Rules
                    </Link>
                  )}

                  {currentUser.role === 'ADMIN' && (
                    <Link
                      href="/admin/analytics"
                      className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                        pathname === '/admin/analytics' ? 'text-blue-900 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4 text-emerald-600" />
                      Analytics
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* Right: Notifications + Splash Intro + Sign In / Sign Up or Profile & Logout */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Splash Intro Button */}
              <button
                onClick={() => setSplashOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors"
                title="View VidyaSetu Splash Banner & Slogan"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span>Splash Slogan</span>
              </button>

              {/* Notification Button */}
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="View notifications and SMS logs"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              </button>

              {/* User Profile Badge & Logout or Sign In/Sign Up */}
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                {currentUser ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center space-x-2">
                      <UserAvatar name={currentUser.name} role={currentUser.role} sizeClassName="w-8 h-8 text-xs" />
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

                    <button
                      onClick={handleLogout}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden md:inline">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/signup"
                      className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
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
