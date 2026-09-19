import React from 'react';
import { X, ShieldCheck, FileText, RefreshCw } from 'lucide-react';
import { Language } from '../types';

export type LegalModalType = 'privacy' | 'terms' | 'refund' | null;

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
  lang: Language;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose, lang }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              {type === 'privacy' && <ShieldCheck className="w-5 h-5" />}
              {type === 'terms' && <FileText className="w-5 h-5" />}
              {type === 'refund' && <RefreshCw className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {type === 'privacy' && (lang === 'hi' ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy')}
                {type === 'terms' && (lang === 'hi' ? 'नियम एवं शर्तें (Terms & Conditions)' : 'Terms & Conditions')}
                {type === 'refund' && (lang === 'hi' ? 'रिफंड एवं निरस्तीकरण नीति (Refund Policy)' : 'Refund & Cancellation Policy')}
              </h3>
              <p className="text-xs text-slate-500">
                Hasuwa Skills Academy • Near Shivrinayaran, Chhattisgarh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {type === 'privacy' && (
            <>
              <p className="font-semibold text-slate-800">
                1. Data Collection & Purpose
              </p>
              <p>
                We collect your name, phone number, email address (optional), and course preferences exclusively when you voluntarily fill in our enquiry and registration forms. This data is used solely to contact you regarding syllabus information, fee structures, batch schedules, and admission procedures.
              </p>
              <p className="font-semibold text-slate-800">
                2. Privacy-Conscious Analytics
              </p>
              <p>
                We respect your digital privacy. We do NOT harvest contacts, private social media messages, passwords, or personal account details from visitors originating from Instagram, Facebook, WhatsApp, or other channels. Anonymous metrics (such as page views and general button click counts) are collected solely to understand course interest and campaign performance.
              </p>
              <p className="font-semibold text-slate-800">
                3. Data Security & Storage
              </p>
              <p>
                Your voluntarily provided lead records are protected by strict administrative authentication and database security policies. We do not sell, rent, or trade your contact details with unauthorized third-party commercial marketing brokers.
              </p>
              <p className="font-semibold text-slate-800">
                4. Contact & Rectification
              </p>
              <p>
                If you wish to update or request the deletion of your enquiry record from our admissions records, please contact our coordinator directly at 9279120271 or info@hasuwaskills.in.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p className="font-semibold text-slate-800">
                1. Educational Nature of Programmes
              </p>
              <p>
                All courses offered (English Speaking & Personality Development, Computer Courses, and Bollywood & Hindi Vocal Training) are skill-building educational and practice programmes. Course duration, batch frequency, syllabus depth, and lab hours vary depending on the chosen stream.
              </p>
              <p className="font-semibold text-slate-800">
                2. Honest & Non-Exaggerated Representation
              </p>
              <p>
                Our centre does not make deceptive or fraudulent employment guarantees, income promises, or fictitious affiliation claims. Success in English fluency, computer examinations, and musical vocal control is directly correlated with regular student practice and attendance.
              </p>
              <p className="font-semibold text-slate-800">
                3. Vocal Training Programme Scope
              </p>
              <p>
                The vocal training programme is explicitly designed for Bollywood, Hindi songs, singing practice, voice modulation, and stage confidence. It is not advertised or represented as a classical musical degree course.
              </p>
              <p className="font-semibold text-slate-800">
                4. Code of Conduct
              </p>
              <p>
                Students and applicants are expected to maintain respect, discipline, and regular adherence to classroom and computer lab guidelines.
              </p>
            </>
          )}

          {type === 'refund' && (
            <>
              <p className="font-semibold text-slate-800">
                1. Pre-Admission Enquiries
              </p>
              <p>
                Submitting an enquiry or registration form through this website is 100% free and imposes no financial obligation on the student or parent.
              </p>
              <p className="font-semibold text-slate-800">
                2. Fee Payment & Admission
              </p>
              <p>
                Course fees are only paid when a student formally joins an offline or online batch after reviewing the complete syllabus and meeting the course instructor.
              </p>
              <p className="font-semibold text-slate-800">
                3. Batch Rescheduling & Cancellation
              </p>
              <p>
                Students who encounter unavoidable scheduling conflicts may request a batch transfer or reschedule with prior written notice to the centre coordinator at Hasuwa.
              </p>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            {lang === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
