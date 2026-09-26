'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '@/lib/translations';
import { User } from '@/lib/types';
import { initialUsers } from '@/lib/store';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations['en'];
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  currentUser: User;
  switchUser: (user: User) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (val: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  // Load preferences from localStorage if client-side
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('vidyasetu_lang') as Language;
      if (savedLang && ['en', 'hi'].includes(savedLang)) setLang(savedLang);

      const savedContrast = localStorage.getItem('vidyasetu_contrast');
      if (savedContrast === 'true') setHighContrast(true);

      const savedUserStr = localStorage.getItem('vidyasetu_current_user');
      if (savedUserStr) {
        const u = JSON.parse(savedUserStr);
        if (u && u.id) setCurrentUser(u);
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem('vidyasetu_lang', newLang);
    } catch (e) {}
  };

  const handleSetHighContrast = (val: boolean) => {
    setHighContrast(val);
    try {
      localStorage.setItem('vidyasetu_contrast', val ? 'true' : 'false');
    } catch (e) {}
  };

  const handleSwitchUser = async (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('vidyasetu_current_user', JSON.stringify(user));
      // Notify server to update cookie
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
    } catch (e) {}
  };

  const t = translations[lang] || translations.en;

  const fontClass =
    fontSize === 'xlarge'
      ? 'text-lg'
      : fontSize === 'large'
      ? 'text-base'
      : 'text-sm';

  const contrastClass = highContrast ? 'contrast-more bg-black text-yellow-300' : '';

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang: handleSetLang,
        t,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast: handleSetHighContrast,
        currentUser,
        switchUser: handleSwitchUser,
        notificationsOpen,
        setNotificationsOpen
      }}
    >
      <div className={`${fontClass} ${contrastClass} min-h-screen flex flex-col font-sans transition-colors duration-200`}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
