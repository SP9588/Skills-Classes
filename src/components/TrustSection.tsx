import React from 'react';
import { CheckCircle2, ShieldCheck, Award, HeartHandshake } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface TrustSectionProps {
  lang: Language;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <section id="why-us" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.whyLearnWithUs}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {lang === 'hi' ? 'वास्तविक कौशल, पारदर्शी शिक्षण एवं प्रत्यक्ष मार्गदर्शन' : 'Practical Learning With Honest, Transparent Guidance'}
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            {t.whyLearnSubtitle}
          </p>
        </div>

        {/* 9 Verified Practical Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {t.trustPoints.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:bg-white hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Integrity Notice Banner */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white text-center border border-indigo-500/20 shadow-lg">
          <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" />
            <span>{lang === 'hi' ? 'हमारा सिद्धांत एवं प्रतिबद्धता' : 'Our Commitment to Educational Integrity'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'hi'
              ? 'हम किसी भी प्रकार का फर्जी सरकारी दावा, अवास्तविक नौकरी की गारंटी या बनावटी प्रशंसापत्र प्रस्तुत नहीं करते। हमारा पूरा ध्यान विद्यार्थी के व्यावहारिक ज्ञान, आत्मविश्वास और कौशल विकास पर केंद्रित है।'
              : 'We do not make inflated placement guarantees, fake government claims, or fabricated testimonials. Our focus is 100% committed to real learning, personal confidence building, and solid skill foundation.'}
          </p>
        </div>
      </div>
    </section>
  );
};
