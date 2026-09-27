'use client';

import React from 'react';

interface UserAvatarProps {
  name: string;
  role?: string;
  className?: string;
  sizeClassName?: string;
}

export function getUserInitials(name: string): string {
  if (!name) return 'U';
  // Remove common titles, honorifics, and post-nominals
  const cleaned = name
    .replace(/^(Prof\.|Dr\.|Smt\.|Shri|Mr\.|Ms\.|Mrs\.)\s+/gi, '')
    .replace(/,\s*(IAS|IPS|IFS|Ph\.D|PhD).*$/gi, '')
    .trim();

  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return name.substring(0, 2).toUpperCase();
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getRoleBadgeBg(role?: string): string {
  switch (role) {
    case 'SCRUTINY_OFFICER':
      return 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-200 shadow-sm';
    case 'SELECTION_COMMITTEE':
      return 'bg-amber-600 text-white font-bold ring-2 ring-amber-200 shadow-sm';
    case 'ADMIN':
      return 'bg-purple-700 text-white font-bold ring-2 ring-purple-200 shadow-sm';
    case 'APPLICANT':
    default:
      return 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-200 shadow-sm';
  }
}

export function UserAvatar({
  name,
  role,
  className = '',
  sizeClassName = 'w-8 h-8 text-xs'
}: UserAvatarProps) {
  const initials = getUserInitials(name);
  const colorClass = getRoleBadgeBg(role);

  return (
    <div
      className={`rounded-full shrink-0 flex items-center justify-center select-none font-bold font-mono ${colorClass} ${sizeClassName} ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
}
