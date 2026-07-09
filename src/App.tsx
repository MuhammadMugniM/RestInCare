/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import HeroSection from './components/HeroSection';
import FloatingMenu from './components/FloatingMenu';
import ServiceShowcase from './components/ServiceShowcase';
import ServicePlanner from './components/ServicePlanner';
import SuccessReceipt from './components/SuccessReceipt';
import InfoHub from './components/InfoHub';
import EmergencyModal from './components/EmergencyModal';
import OrderHistory from './components/OrderHistory';
import Logo from './components/Logo';
import { PlanningState, BELIEFS, PACKAGES, CUSTOM_OPTIONS } from './types';
import { Phone, Heart, FileText, HelpCircle, MapPin, CheckCircle, Shield, Menu, X, User as UserIcon } from 'lucide-react';

export default function App() {
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [completedPlan, setCompletedPlan] = useState<(PlanningState & { totalCost: number }) | null>(null);
  const [plannerKey, setPlannerKey] = useState(0); // For resetting planner state
  const [preSelectedBelief, setPreSelectedBelief] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [viewHistory, setViewHistory] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const plannerSectionRef = useRef<HTMLDivElement>(null);
  const showcaseSectionRef = useRef<HTMLDivElement>(null);
  const infoSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToPlanner = () => {
    setViewHistory(false);
    setTimeout(() => {
      plannerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleScrollToShowcase = () => {
    setViewHistory(false);
    setMobileMenuOpen(false);
    setTimeout(() => {
      showcaseSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleScrollToInfo = () => {
    setViewHistory(false);
    setMobileMenuOpen(false);
    setTimeout(() => {
      infoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSelectBeliefFromShowcase = (beliefId: string) => {
    setPreSelectedBelief(beliefId);
    setPlannerKey(prev => prev + 1); // Reset the planner to apply preselected value if wanted
    // Custom trigger scroll
    setTimeout(() => {
      plannerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePlannerSuccess = (summary: PlanningState & { totalCost: number }) => {
    setCompletedPlan(summary);
    // Scroll smoothly to receipt
    setTimeout(() => {
      plannerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleResetPlanner = () => {
    setCompletedPlan(null);
    setPlannerKey(prev => prev + 1);
  };

  return (
    <div 
      className="min-h-screen text-[#1b1b1d] font-sans flex flex-col justify-between" 
      id="rest_in_care_app_root"
      style={{
        backgroundImage: `url('/BG%20Website%20RIC.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      
      {/* Respectful Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out print:hidden ${isScrolled ? 'bg-white/70 backdrop-blur-md shadow-md text-slate-800' : 'bg-white/50 backdrop-blur-md border-b border-white/20 text-slate-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-16 md:h-20 flex items-center justify-between">
          
          <button             onClick={() => { setViewHistory(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}            className="flex items-center gap-2 cursor-pointer text-left focus:outline-none"          >            <Logo className="w-10 h-10" variant="brand" />            <div>              <span className="font-serif text-lg md:text-xl font-bold tracking-tight block">RestInCare</span>              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block -mt-1 scale-90 origin-left">Standard of Grace</span>            </div>          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium uppercase tracking-widest text-slate-800">
            <button 
              onClick={handleScrollToShowcase}
              className="hover:text-[#546258] transition-colors cursor-pointer"
            >
              Layanan Kedukaan
            </button>
            <button 
              onClick={handleScrollToPlanner} 
              className="hover:text-[#546258] transition-colors cursor-pointer"
            >
              Perencana Duka
            </button>
            <button 
              onClick={handleScrollToInfo} 
              className="hover:text-[#546258] transition-colors cursor-pointer"
            >
              Panduan Sipil & Dokumen
            </button>
            {user && (
              <button 
                onClick={() => { setViewHistory(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="hover:text-[#546258] transition-colors cursor-pointer flex items-center gap-1.5 bg-white border border-[#eae7e9] px-3 py-1.5 rounded-full shadow-sm text-gray-800"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="w-3.5 h-3.5" />
                )}
                <span className="text-xs">{user.displayName?.split(' ')[0] || 'Profil'} | Riwayat Layanan</span>
              </button>
            )}
          </div>

          {/* Persistent emergency trigger button */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setIsEmergencyOpen(true)}
              className="px-5 py-2.5 bg-[#ba1a1a]/15 hover:bg-[#ba1a1a]/25 text-[#ba1a1a] font-sans text-xs uppercase tracking-widest font-extrabold rounded-full transition-all border border-[#ba1a1a]/40 flex items-center gap-1.5 h-[44px]"
            >
              <Phone className="w-4 h-4 animate-pulse" />
              Layanan Darurat 24 Jam
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setIsEmergencyOpen(true)}
              className="px-3 py-1.5 bg-[#ba1a1a]/15 text-[#ba1a1a] text-[11px] font-extrabold uppercase tracking-widest rounded-full flex items-center gap-1 border border-[#ba1a1a]/40"
            >
              <Phone className="w-3 h-3 animate-pulse" />
              Darurat
            </button>
            
            <button 
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-1.5 text-[#333e50] rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#eae7e9] p-6 space-y-4 fade-in">
            <div className="flex flex-col gap-3 text-xs uppercase tracking-widest font-extrabold text-gray-800">
              <button 
                onClick={handleScrollToShowcase}
                className="text-left py-2 border-b border-[#f0edef] text-[#333e50]"
              >
                Layanan Kedukaan
              </button>
              <button 
                onClick={() => { handleScrollToPlanner(); setMobileMenuOpen(false); }}
                className="text-left py-2 border-b border-[#f0edef] text-[#333e50]"
              >
                Perencana Duka
              </button>
              <button 
                onClick={handleScrollToInfo}
                className="text-left py-2 border-b border-[#f0edef] text-[#333e50]"
              >
                Panduan Sipil & Dokumen
              </button>
              {user && (
                <button 
                  onClick={() => { setViewHistory(true); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-left py-2 border-b border-[#f0edef] text-[#333e50] flex items-center gap-2"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5" />
                  )}
                  <span>{user.displayName?.split(' ')[0] || 'Profil'} | Riwayat Layanan</span>
                </button>
              )}
              <button 
                onClick={() => { setIsEmergencyOpen(true); setMobileMenuOpen(false); }}
                className="text-left py-2 text-[#ba1a1a] flex items-center gap-1.5 font-bold"
              >
                <Phone className="w-3.5 h-3.5 animate-pulse" />
                Layanan Darurat 24 Jam
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Container */}
      <main className="flex-grow">
        
        {viewHistory ? (
          <div className="relative overflow-hidden pt-20 pb-12 md:pt-24 md:pb-20 min-h-screen print:hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-white/10 md:from-[#fbf8fa]/70 md:via-[#fbf8fa]/40 md:to-transparent z-0" />
            <div className="relative z-10">
              <OrderHistory onBack={() => setViewHistory(false)} />
            </div>
          </div>
        ) : (
          <>
            {/* Printable/Only printable elements adjustments */}
            <div className="print:hidden">
              <HeroSection 
                onTriggerEmergency={() => setIsEmergencyOpen(true)} 
                onScrollToPlanner={handleScrollToPlanner}
              />
            </div>

            {/* Categories Showcase (Only visible if not currently viewing a completed receipt to minimize noise) */}
            {!completedPlan && (
              <div ref={showcaseSectionRef} className="print:hidden">
                <ServiceShowcase onSelectBelief={handleSelectBeliefFromShowcase} />
              </div>
            )}

            {/* Interactive Multi-step Planner or Printable Receipt summary */}
            <div 
              ref={plannerSectionRef} 
              className="bg-[#fbf8fa]/70 backdrop-blur-sm py-12 md:py-20 border-t border-b border-[#eae7e9]/50"
              id="planner_section_container"
            >
              {completedPlan ? (
                <SuccessReceipt 
                  data={completedPlan} 
                  onReset={handleResetPlanner} 
                />
              ) : (
                <div className="max-w-[1200px] mx-auto px-4 md:px-6">
                  <div className="text-center max-w-2xl mx-auto mb-8">
                    <span className="text-xs uppercase tracking-widest font-semibold text-[#546258] mb-1.5 block">Asistensi Interaktif</span>
                    <h2 className="font-serif text-3xl md:text-4xl text-[#333e50] font-medium tracking-tight">
                      Formulir Perencanaan Rencana Duka
                    </h2>
                    <p className="font-sans text-gray-600 text-xs md:text-sm mt-2 leading-relaxed">
                      Silakan isi formulir di bawah ini. Sistem kami akan memberikan estimasi biaya yang transparan berdasarkan layanan yang Anda pilih.
                    </p>
                  </div>

                  {/* Renders the planner with key-reset mechanism and initial belief override */}
                  <ServicePlanner 
                    key={plannerKey}
                    onSuccess={handlePlannerSuccess} 
                    initialBelief={preSelectedBelief}
                  />
                </div>
              )}
            </div>

            {/* Informational Documentations hub */}
            <div ref={infoSectionRef} className="print:hidden">
              <InfoHub />
            </div>
          </>
        )}

      </main>

      {/* Persistent Touch Target Floating Action Button (Emergency Pill Call) */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden hidden sm:block">
        <button
          onClick={() => setIsEmergencyOpen(true)}
          className="bg-[#ba1a1a] hover:bg-red-750 text-white font-sans text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-full shadow-2xl border border-red-700/35 transition-all flex items-center gap-2 hover:-translate-y-1 h-[48px] cursor-pointer"
        >
          <Phone className="w-4 h-4 animate-bounce" />
          Hubungi Layanan Darurat 24 Jam
        </button>
      </div>

      {/* Emergency Assistance Modal Panel */}
      <EmergencyModal 
        isOpen={isEmergencyOpen} 
        onClose={() => setIsEmergencyOpen(false)} 
      />

      {/* Footer Section */}
      <footer className="bg-[#333e50] text-[#becae0] pt-12 pb-8 border-t border-[#4a5568] print:hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#4a5568]">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Logo className="w-8 h-8" variant="dark" />
                <span className="font-serif text-base font-bold text-white tracking-tight">RestInCare</span>
              </div>
              <p className="font-sans text-[11px] leading-relaxed text-gray-450 text-[#becae0]/70">
                Layanan kedukaan terpadu di Indonesia yang menjunjung tinggi nilai penghormatan dan transparansi biaya.
              </p>
            </div>
            
            <div>
              <h5 className="font-sans font-bold text-xs uppercase tracking-widest text-[#d8e3fa] mb-3">Layanan Kedukaan</h5>
              <ul className="space-y-1 text-xs">
                <li>Pemakaman Islam (Fardhu Kifayah)</li>
                <li>Pemakaman Kristen & Katolik</li>
                <li>Kremasi Hindu (Ngaben)</li>
                <li>Pemakaman & Kremasi Buddha</li>
                <li>Layanan Umum / Universal</li>
              </ul>
            </div>

            <div>
              <h5 className="font-sans font-bold text-xs uppercase tracking-widest text-[#d8e3fa] mb-3">Hubungi Kami</h5>
              <p className="text-xs">Kantor Pusat RestInCare</p>
              <p className="text-[11px] text-[#becae0]/75 mt-1">Inhoftank</p>
              <p className="text-xs font-mono font-bold text-white mt-2">☎ 0800-1404-100 (Bebas Pulsa)</p>
            </div>

            <div>
              <h5 className="font-sans font-bold text-xs uppercase tracking-widest text-[#d8e3fa] mb-3">Sertifikasi & Layanan</h5>
              <div className="p-3.5 bg-[#4a5568]/45 border border-[#546f88]/20 rounded-lg text-center">
                <p className="text-[10px] text-white font-bold uppercase tracking-wider mb-1">Sesuai Standar & Bersertifikat</p>
                <p className="text-[10px] text-gray-300 leading-snug">Menjamin layanan yang sesuai dengan syariat agama dan peraturan yang berlaku di Indonesia.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 gap-4 text-center md:text-left">
            <div>
              <p>© 2026 RestInCare Indonesia. Hak Cipta Dilindungi Undang-Undang.</p>
              <p className="text-gray-500 mt-0.5">S-98 Sila Ketuhanan & Keadilan Pemulasaraan</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:underline text-[#becae0]/60">Kebijakan Privasi</a>
              <a href="#" className="hover:underline text-[#becae0]/60">Syarat & Ketentuan</a>
              <a href="#" className="hover:underline text-[#becae0]/60">Bantuan Layanan</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Optimized Floating Shortcut Menu */}
      <div className="block md:hidden print:hidden">
        <FloatingMenu 
          onTriggerEmergency={() => setIsEmergencyOpen(true)}
          onScrollToPlanner={handleScrollToPlanner}
        />
      </div>

    </div>
  );
}
