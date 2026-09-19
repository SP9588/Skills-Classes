import React from 'react';
import { Phone, MessageCircle, FileText } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { trackEvent } from '../utils/analytics';

interface StickyMobileBarProps {
  lang: Language;
  phone: string;
  whatsapp: string;
  onRegisterClick: () => void;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({
  lang,
  phone,
  whatsapp,
  onRegisterClick
}) => {
  const t = translations[lang];

  const handleCall = () => {
    trackEvent('call_now_clicked', { customSource: 'sticky_mobile' });
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = () => {
    trackEvent('whatsapp_clicked', { customSource: 'sticky_mobile' });
    const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(t.default_whatsapp_msg || 'Hello, I would like information about your courses, fees and admission.')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleRegister = () => {
    trackEvent('register_now_clicked', { customSource: 'sticky_mobile' });
    onRegisterClick();
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] safe-area-bottom">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* CALL */}
        <button
          onClick={handleCall}
          id="sticky-call-btn"
          className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 active:bg-slate-200 border border-slate-200/80 transition-colors shadow-xs"
        >
          <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate">{t.stickyCall}</span>
        </button>

        {/* WHATSAPP */}
        <button
          onClick={handleWhatsApp}
          id="sticky-whatsapp-btn"
          className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-bold text-emerald-950 bg-emerald-400 active:bg-emerald-500 transition-colors shadow-xs"
        >
          <MessageCircle className="w-4 h-4 fill-emerald-950 shrink-0" />
          <span className="truncate">{t.stickyWhatsApp}</span>
        </button>

        {/* REGISTER */}
        <button
          onClick={handleRegister}
          id="sticky-register-btn"
          className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-extrabold text-white bg-indigo-600 active:bg-indigo-700 transition-colors shadow-xs"
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span className="truncate">{t.stickyRegister}</span>
        </button>
      </div>
    </div>
  );
};
