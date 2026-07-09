import { Phone, Heart, Shield, Clock, HelpCircle, ArrowDown } from 'lucide-react';
import Logo from './Logo';

interface HeroSectionProps {
  onTriggerEmergency: () => void;
  onScrollToPlanner: () => void;
}

export default function HeroSection({ onTriggerEmergency, onScrollToPlanner }: HeroSectionProps) {
  return (
    <header 
      className="relative overflow-hidden pt-20 pb-12 md:pt-24 md:pb-20 border-b border-[#eae7e9]/50 bg-cover bg-center bg-no-repeat min-h-screen"
    >
      {/* Semi-transparent overlay to ensure text readability while keeping the image clear */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-white/10 md:from-[#fbf8fa]/70 md:via-[#fbf8fa]/40 md:to-transparent z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left column text */}
        <div className="space-y-6 text-left w-full">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d5e3d7] border border-[#546258]/25 text-[#546258] rounded-full text-xs font-semibold tracking-wider">
            <Shield className="w-3.5 h-3.5 stroke-[2.5]" />
            Layanan Perencanaan Pemakaman Digital
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#333e50] font-semibold tracking-tight leading-[1.1] leading-tight" id="hero_main_title">
            RestInCare
          </h1>
          <p className="font-serif text-xl md:text-2xl text-gray-650 font-medium italic -mt-2">
            "Layanan Kedukaan Profesional & Terpercaya"
          </p>

          <p className="font-sans text-gray-900 font-bold text-sm md:text-base leading-relaxed max-w-xl drop-shadow-md">
            Selamat datang di RestInCare. Kami hadir untuk membantu dan mendampingi Anda di masa duka. Mulai dari perawatan jenazah, prosesi keagamaan, dekorasi, hingga pengurusan pemakaman, semuanya kami layani dengan profesional dan penuh rasa hormat.
          </p>

          {/* Core values list with custom sage bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="flex gap-2.5 items-start">
              <div className="w-5 h-5 rounded-full bg-[#d5e3d7] text-[#546258] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                <Shield className="w-3 h-3" />
              </div>
              <span className="text-xs md:text-sm font-sans font-bold text-gray-900 drop-shadow-sm">Dukungan Lisensi Syari & Adat</span>
            </div>
            <div className="flex gap-2.5 items-start">
              <div className="w-5 h-5 rounded-full bg-[#d5e3d7] text-[#546258] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                <Clock className="w-3 h-3" />
              </div>
              <span className="text-xs md:text-sm font-sans font-bold text-gray-900 drop-shadow-sm">Respons Lapangan &lt; 30 Menit</span>
            </div>
            <div className="flex gap-2.5 items-start">
              <div className="w-5 h-5 rounded-full bg-[#d5e3d7] text-[#546258] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <span className="text-xs md:text-sm font-sans font-bold text-gray-900 drop-shadow-sm">Rincian Transparansi Harga Mutlak</span>
            </div>
            <div className="flex gap-2.5 items-start">
              <div className="w-5 h-5 rounded-full bg-[#d5e3d7] text-[#546258] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                <HelpCircle className="w-3 h-3" />
              </div>
              <span className="text-xs md:text-sm font-sans font-bold text-gray-900 drop-shadow-sm">Bantuan Sipil & Dukcapil Instan</span>
            </div>
          </div>

          {/* Action triggers (large touch targets, 12px 24px minimum padding) */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={onScrollToPlanner}
              className="px-6 py-3.5 bg-[#333e50] hover:bg-[#4a5568] text-white font-sans text-sm font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group h-[48px]"
            >
              Mulai Perencanaan Layanan
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>

            <button
              onClick={onTriggerEmergency}
              className="px-6 py-3.5 bg-[#ba1a1a]/10 hover:bg-[#ba1a1a]/20 text-[#ba1a1a] border border-[#ba1a1a]/30 font-sans text-sm font-bold rounded-full transition-all flex items-center justify-center gap-2 h-[48px]"
            >
              <Phone className="w-4 h-4 animate-pulse" />
              Layanan Darurat 24 Jam
            </button>
          </div>
        </div>

        {/* Right column: Beautiful calming custom cards illustration depicting RestInCare's gentle approach */}
        <div className="relative mt-8 md:mt-0 w-full">
          <div className="relative bg-white rounded-2xl border border-[#eae7e9] p-6 shadow-xl max-w-sm mx-auto overflow-hidden">
            {/* Minimalist leaf watercolor backdrop */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d5e3d7]/20 rounded-full blur-2xl pointer-events-none" />
            
            {/* Simple logo indicator */}
            <div className="flex justify-between items-center border-b border-[#eae7e9] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Logo className="w-8 h-8" variant="brand" />
                <span className="font-serif text-sm font-bold text-[#333e50] tracking-tight">RestInCare</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider bg-[#d5e3d7]/70 text-[#546258] px-2 py-0.5 rounded font-bold">Standard of Grace</span>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-[#fbf8fa] rounded-lg border border-[#eae7e9]">
                <h4 className="font-serif text-xs font-bold text-[#546258] uppercase tracking-wider mb-1">Misi Kami</h4>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Mengurus semua kebutuhan logistik agar Anda bisa fokus mendoakan dan mengenang keluarga yang ditinggalkan.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-sans font-bold text-xs text-[#333e50]">Layanan Kami</h5>
                <div className="flex gap-2.5 items-center text-xs text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#546258]" />
                  <span>Staf profesional dan berpengalaman</span>
                </div>
                <div className="flex gap-2.5 items-center text-xs text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#546258]" />
                  <span>Armada ambulans dan perlengkapan lengkap</span>
                </div>
                <div className="flex gap-2.5 items-center text-xs text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#546258]" />
                  <span>Fasilitas ruang tunggu keluarga</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#eae7e9] flex justify-between items-center">
                <span className="text-[10px] text-gray-400 font-mono">Kode S-98 Runtutan</span>
                <span className="text-[10px] text-[#546258] font-bold">100% Terverifikasi</span>
              </div>
            </div>
          </div>

          {/* Secondary overlap badge for structural depth as requested in shapes */}
          <div className="absolute -bottom-4 -left-4 bg-[#546258] text-white p-3.5 rounded-xl shadow-lg border border-[#546258]/40 max-w-[180px] hidden sm:block">
            <span className="text-[10px] uppercase font-bold tracking-widest block text-[#d5e3d7]">Kehadiran Nyata</span>
            <span className="font-serif text-sm font-semibold mt-0.5 block leading-tight">Pendampingan Instan Bandung</span>
          </div>
        </div>
      </div>
    </header>
  );
}
