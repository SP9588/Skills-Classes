import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CourseCards } from './components/CourseCards';
import { TrustSection } from './components/TrustSection';
import { LeadCaptureForm } from './components/LeadCaptureForm';
import { FaqSection } from './components/FaqSection';
import { ContactLocation } from './components/ContactLocation';
import { Footer } from './components/Footer';
import { StickyMobileBar } from './components/StickyMobileBar';
import { ShareModal } from './components/ShareModal';
import { LegalModal, LegalModalType } from './components/LegalModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Language, CourseId, CentreConfig } from './types';
import { initialConfig } from './data/translations';
import { trackPageView, initScrollTracking } from './utils/analytics';

export default function App() {
  const [lang, setLang] = useState<Language>('hi'); // Default Hindi for local area relevance, toggleable to English
  const [selectedCourse, setSelectedCourse] = useState<CourseId>('english');
  const [config, setConfig] = useState<CentreConfig>(initialConfig);

  // Modals state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Initial load: fetch config & start analytics
  useEffect(() => {
    trackPageView();
    const cleanupScroll = initScrollTracking();

    // Fetch dynamic centre configuration
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.config) {
          setConfig(data.config);
        }
      })
      .catch((err) => console.log('Using default centre config:', err));

    return () => {
      cleanupScroll();
    };
  }, []);

  const scrollToRegister = () => {
    const el = document.getElementById('register');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToCourses = () => {
    const el = document.getElementById('courses');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleEnquireCourse = (courseId: CourseId) => {
    setSelectedCourse(courseId);
    scrollToRegister();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white antialiased">
      {/* 1. Header / Navigation */}
      <Header
        lang={lang}
        setLang={setLang}
        phone={config.phone_number}
        whatsapp={config.whatsapp_number}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenRegister={scrollToRegister}
      />

      {/* Main Content Sections */}
      <main id="main-content">
        {/* 2. Hero Section */}
        <Hero
          lang={lang}
          phone={config.phone_number}
          whatsapp={config.whatsapp_number}
          instagramUrl={config.instagram_url}
          instagramHandle={config.instagram_handle}
          onApplyNow={scrollToRegister}
          onSelectCourse={handleEnquireCourse}
        />

        {/* 3. Course Cards Section */}
        <CourseCards
          lang={lang}
          onEnquireCourse={handleEnquireCourse}
        />

        {/* 4. Trust & Benefits Section */}
        <TrustSection lang={lang} />

        {/* 5. Lead Capture & Registration Form */}
        <LeadCaptureForm
          lang={lang}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          phone={config.phone_number}
          whatsapp={config.whatsapp_number}
          instagramUrl={config.instagram_url}
          instagramHandle={config.instagram_handle}
        />

        {/* 6. FAQ Section */}
        <FaqSection
          lang={lang}
          phone={config.phone_number}
          whatsapp={config.whatsapp_number}
        />

        {/* 7. Contact & Location Section */}
        <ContactLocation
          lang={lang}
          config={config}
          onOpenShare={() => setIsShareOpen(true)}
        />
      </main>

      {/* 8. Footer */}
      <Footer
        lang={lang}
        config={config}
        onOpenLegal={(type) => setLegalModalType(type)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 9. Sticky Mobile CTA Bar */}
      <StickyMobileBar
        lang={lang}
        phone={config.phone_number}
        whatsapp={config.whatsapp_number}
        onRegisterClick={scrollToRegister}
      />

      {/* 10. Social Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        lang={lang}
        instagramUrl={config.instagram_url}
      />

      {/* 11. Legal & Privacy Policies Modal */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
        lang={lang}
      />

      {/* 12. Authenticated Admin & Analytics Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onUpdateConfig={(newConfig) => setConfig(newConfig)}
      />
    </div>
  );
}
