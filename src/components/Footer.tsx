import React from 'react';
import { BookOpen, Phone, MessageCircle, MapPin, Shield, Heart, Instagram } from 'lucide-react';
import { Language, CentreConfig } from '../types';
import { translations } from '../data/translations';
import { LegalModalType } from './LegalModal';
import { trackEvent } from '../utils/analytics';

interface FooterProps {
  lang: Language;
  config: CentreConfig;
  onOpenLegal: (type: LegalModalType) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  config,
  onOpenLegal,
  onOpenAdmin
}) => {
  const t = translations[lang];

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pb-20 md:pb-12 pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-extrabold text-white">
                  {lang === 'hi' ? 'हसुवा स्किल्स एकेडमी' : 'Hasuwa Skills Academy'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {t.brandSubtitle}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-4">
              {lang === 'hi'
                ? 'शिवरीनारायण, छत्तीसगढ़ के निकट स्थित आधुनिक कौशल विकास केंद्र। इंग्लिश स्पीकिंग, कंप्यूटर कोर्सेज एवं बॉलीवुड/हिंदी वोकल ट्रेनिंग में व्यावहारिक प्रशिक्षण।'
                : 'Modern education and skills centre near Shivrinayaran, Chhattisgarh. Practical training in English speaking, computer courses, and Bollywood/Hindi vocal learning.'}
            </p>

            <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
              <span>{t.tagline}</span>
            </div>

            {/* Instagram Connect Badge */}
            <a
              href={config.instagram_url || 'https://www.instagram.com/hasuwaskillsacademy'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('instagram_clicked', { customSource: 'footer' })}
              className="inline-flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-amber-900/20 border border-pink-500/30 text-white hover:border-pink-400 hover:from-pink-900/40 transition-all text-xs group"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <Instagram className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="font-bold text-pink-300 block">{config.instagram_handle || '@hasuwaskillsacademy'}</span>
                <span className="text-[10px] text-slate-400">{t.followInstagram}</span>
              </div>
            </a>
          </div>

          {/* Col 2: Courses */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              {lang === 'hi' ? 'प्रमुख कोर्सेज' : 'Our Courses'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#courses" className="hover:text-amber-300 transition-colors">
                  {lang === 'hi' ? 'इंग्लिश स्पीकिंग एवं व्यक्तित्व विकास' : 'English Speaking & Personality'}
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-amber-300 transition-colors">
                  {lang === 'hi' ? 'कंप्यूटर कोर्सेज (DCA / ADCA / टाइपिंग)' : 'Computer Courses (DCA / ADCA / Typing)'}
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-amber-300 transition-colors">
                  {lang === 'hi' ? 'बॉलीवुड एवं हिंदी वोकल ट्रेनिंग' : 'Bollywood & Hindi Vocal Training'}
                </a>
              </li>
              <li>
                <a href="#register" className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">
                  {lang === 'hi' ? 'सभी कोर्सेज की फीस पूछें' : 'Check All Course Fees'} →
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              {lang === 'hi' ? 'संपर्क एवं नीतियां' : 'Contact & Policies'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href={`tel:${config.phone_number}`} className="hover:text-white">
                  {config.phone_number}
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Instagram className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <a
                  href={config.instagram_url || 'https://www.instagram.com/hasuwaskillsacademy'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('instagram_clicked', { customSource: 'footer_links' })}
                  className="hover:text-pink-300 transition-colors"
                >
                  {config.instagram_handle || '@hasuwaskillsacademy'}
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Hasuwa, Near Shivrinayaran</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-slate-200 transition-colors cursor-pointer text-slate-400"
                >
                  {t.privacyPolicy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-slate-200 transition-colors cursor-pointer text-slate-400"
                >
                  {t.termsConditions}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('refund')}
                  className="hover:text-slate-200 transition-colors cursor-pointer text-slate-400"
                >
                  {t.refundPolicy}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Hasuwa Skills Academy. {t.allRightsReserved}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer text-[11px]"
            >
              <Shield className="w-3 h-3" />
              <span>{t.adminPortal}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
