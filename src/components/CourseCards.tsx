import React from 'react';
import { MessageSquare, Monitor, Mic2, CheckCircle2, ArrowRight, Info, Sparkles, BookOpen, Layers } from 'lucide-react';
import { Language, CourseId } from '../types';
import { translations } from '../data/translations';
import { trackEvent } from '../utils/analytics';

interface CourseCardsProps {
  lang: Language;
  onEnquireCourse: (courseId: CourseId) => void;
}

export const CourseCards: React.FC<CourseCardsProps> = ({ lang, onEnquireCourse }) => {
  const t = translations[lang];

  const handleEnquire = (courseId: CourseId) => {
    trackEvent('course_selected', { course: courseId });
    onEnquireCourse(courseId);
  };

  return (
    <section id="courses" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.ourCourses}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {lang === 'hi' ? 'तीन प्रमुख कौशल विकास प्रशिक्षण कार्यक्रम' : 'Three Practical Skill Programs Tailored for Growth'}
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            {t.coursesSubtitle}
          </p>
        </div>

        {/* 3 Course Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* ================= CARD 1: ENGLISH SPEAKING ================= */}
          <div className="flex flex-col bg-white rounded-2xl border border-emerald-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
            <div className="h-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 w-full" />
            
            <div className="p-6 sm:p-8 flex-1 flex flex-col">
              {/* Badge & Icon */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {lang === 'hi' ? 'कोर्स 01' : 'COURSE 01'}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
                {t.course1Title}
              </h3>
              <p className="text-sm font-semibold text-emerald-700 mb-3">
                "{t.course1Subtitle}"
              </p>

              {/* Audience Pill */}
              <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 border border-slate-100 mb-6">
                <strong className="text-slate-700">{lang === 'hi' ? 'किसके लिए: ' : 'Target Audience: '}</strong>
                {t.course1Audience}
              </div>

              {/* Modules Checklist */}
              <div className="flex-1 mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{lang === 'hi' ? 'पाठ्यक्रम में शामिल विषय:' : 'Key Curriculum Modules:'}</span>
                </div>
                <ul className="grid grid-cols-1 gap-2">
                  {t.course1Modules.map((mod, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{mod}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Notice */}
              <div className="text-xs text-slate-500 bg-emerald-50/50 rounded-lg p-3 border border-emerald-100 mb-6 flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t.quickSyllabusNotice}</span>
              </div>

              {/* Enquire Button */}
              <button
                onClick={() => handleEnquire('english')}
                id="enquire-english-btn"
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.enquireNow}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ================= CARD 2: COMPUTER COURSES ================= */}
          <div className="flex flex-col bg-white rounded-2xl border border-indigo-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
            <div className="h-2.5 bg-gradient-to-r from-indigo-600 to-blue-500 w-full" />
            
            <div className="p-6 sm:p-8 flex-1 flex flex-col">
              {/* Badge & Icon */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                  <Monitor className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {lang === 'hi' ? 'कोर्स 02' : 'COURSE 02'}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
                {t.course2Title}
              </h3>
              <p className="text-sm font-semibold text-indigo-700 mb-3">
                "{t.course2Subtitle}"
              </p>

              {/* Audience Pill */}
              <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 border border-slate-100 mb-6">
                <strong className="text-slate-700">{lang === 'hi' ? 'किसके लिए: ' : 'Target Audience: '}</strong>
                {t.course2Audience}
              </div>

              {/* Modules Checklist */}
              <div className="flex-1 mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{lang === 'hi' ? 'पाठ्यक्रम में शामिल विषय:' : 'Key Curriculum Modules:'}</span>
                </div>
                <ul className="grid grid-cols-1 gap-2">
                  {t.course2Modules.map((mod, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{mod}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Notice (Clearly highlighted as requested) */}
              <div className="text-xs text-slate-700 bg-indigo-50/70 rounded-lg p-3 border border-indigo-200 mb-6 flex items-start gap-2">
                <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span className="font-medium">{t.quickSyllabusNotice}</span>
              </div>

              {/* Enquire Button */}
              <button
                onClick={() => handleEnquire('computer')}
                id="enquire-computer-btn"
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.enquireNow}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ================= CARD 3: BOLLYWOOD & HINDI VOCALS ================= */}
          <div className="flex flex-col bg-white rounded-2xl border border-rose-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
            <div className="h-2.5 bg-gradient-to-r from-rose-500 to-amber-500 w-full" />
            
            <div className="p-6 sm:p-8 flex-1 flex flex-col">
              {/* Badge & Icon */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
                  <Mic2 className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-100">
                  {lang === 'hi' ? 'कोर्स 03' : 'COURSE 03'}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
                {t.course3Title}
              </h3>
              <p className="text-sm font-semibold text-rose-700 mb-3">
                "{t.course3Subtitle}"
              </p>

              {/* Audience Pill */}
              <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 border border-slate-100 mb-6">
                <strong className="text-slate-700">{lang === 'hi' ? 'किसके लिए: ' : 'Target Audience: '}</strong>
                {t.course3Audience}
              </div>

              {/* Modules Checklist */}
              <div className="flex-1 mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-rose-500" />
                  <span>{lang === 'hi' ? 'पाठ्यक्रम में शामिल विषय:' : 'Key Curriculum Modules:'}</span>
                </div>
                <ul className="grid grid-cols-1 gap-2">
                  {t.course3Modules.map((mod, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{mod}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clear Classical Music Disclaimer as Requested */}
              <div className="text-xs text-amber-900 bg-amber-50 rounded-lg p-3 border border-amber-200 mb-6 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{t.vocalDisclaimer}</span>
              </div>

              {/* Enquire Button */}
              <button
                onClick={() => handleEnquire('bollywood')}
                id="enquire-bollywood-btn"
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.enquireNow}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
