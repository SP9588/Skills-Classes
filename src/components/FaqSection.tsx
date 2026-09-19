import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { trackEvent } from '../utils/analytics';

interface FaqSectionProps {
  lang: Language;
  phone: string;
  whatsapp: string;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ lang, phone, whatsapp }) => {
  const t = translations[lang];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleCall = () => {
    trackEvent('call_now_clicked', { customSource: 'faq' });
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = () => {
    trackEvent('whatsapp_clicked', { customSource: 'faq' });
    const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(t.default_whatsapp_msg || 'Hello, I would like information about your courses, fees and admission.')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.faqTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            {lang === 'hi' ? 'कोर्स और प्रवेश से संबंधित महत्वपूर्ण सवाल' : 'Clear Answers to Frequent Course Enquiries'}
          </h2>
          <p className="text-xs sm:text-base text-slate-600">
            {t.faqSubtitle}
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3.5 mb-10">
          {t.faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left px-5 sm:px-6 py-4.5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <span className="flex items-start gap-3">
                    <span className="text-indigo-600 font-mono text-xs sm:text-sm font-black mt-0.5">
                      Q{idx + 1}.
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Contact Help Box */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-xs">
          <div>
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900 mb-1">
              {lang === 'hi' ? 'कोई अन्य प्रश्न या विशेष जानकारी चाहिए?' : 'Have a different question or need batch details?'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              {lang === 'hi'
                ? 'हमारे केंद्र समन्वयक से सीधे बात करें या WhatsApp पर संदेश भेजें।'
                : 'Speak directly with our centre coordinator or send a quick WhatsApp message.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCall}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>{phone}</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
