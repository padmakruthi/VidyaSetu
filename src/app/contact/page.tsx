'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { IndianFlag } from '@/components/IndianFlag';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  FileText,
  ShieldCheck
} from 'lucide-react';

export default function ContactPage() {
  const { lang } = useLanguage();

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: 'NFST Fellowship Query',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <IndianFlag size="sm" />
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                OFFICIAL HELPDESK & GRIEVANCE CELL
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Contact Us & Support Portal
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              Ministry of Tribal Affairs (MoTA), Government of India. Have questions regarding your NFST or NOS fellowship application, stipend disbursement, or document verification? Our support team is here to assist you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Side Cards */}
          <div className="space-y-4 lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="font-black text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>Ministry Headquarters</span>
              </h2>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Ministry of Tribal Affairs</span>
                    <span>Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001, India</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Toll-Free Helpline</span>
                    <span className="font-mono font-bold text-blue-700">1800-11-7788</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-purple-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Email Support</span>
                    <span className="font-mono text-purple-700">support-mota@nic.in</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Working Hours</span>
                    <span>Mon - Fri: 9:30 AM - 6:00 PM IST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-linear-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 border border-slate-800 space-y-3">
              <h3 className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>48-Hour Decision SLA SLA</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                All uploaded documents clear in-browser OpenCV Laplacian variance pre-verification to guarantee fast-track decisioning within 48 working hours.
              </p>
            </div>
          </div>

          {/* Interactive Inquiry Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-blue-600" />
                  <span>Submit an Inquiry or Grievance Ticket</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill out the form below. Your query will be assigned a trackable support ticket number.
                </p>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-black text-emerald-950">Inquiry Ticket Submitted Successfully!</h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    Your query has been logged under Ticket ID: <strong className="font-mono text-emerald-950">TKT-MOTA-{Math.floor(10000 + Math.random() * 90000)}</strong>. A support officer will respond to <strong>{formData.email}</strong> within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Arun Soren"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. scholar@gmail.com"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.mobile}
                        onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="e.g. 9845012345"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Subject / Category *</label>
                      <select
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900"
                      >
                        <option value="NFST Fellowship Query">NFST Fellowship Query</option>
                        <option value="NOS Overseas Scholarship">NOS Overseas Scholarship</option>
                        <option value="Stipend / PFMS Disbursement Issue">Stipend / PFMS Disbursement Issue</option>
                        <option value="Document Verification / Deficiency">Document Verification / Deficiency</option>
                        <option value="Other Technical Support">Other Technical Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Message / Inquiry Details *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your query or issue in detail..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry Ticket</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
