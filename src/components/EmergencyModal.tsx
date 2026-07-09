import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Phone, Check, ShieldAlert, FileText, Heart, X, MessageSquare, Clock } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  // Handle mobile back button to close modal instead of going back in browser history
  useEffect(() => {
    if (isOpen) {
      if (!window.history.state?.emergencyModalOpen) {
        window.history.pushState({ emergencyModalOpen: true }, '');
      }
      const handlePopState = () => {
        onClose();
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const immediateActions = [
    {
      title: 'Tetap Tenang & Hubungi Kami',
      desc: 'Hubungi hotline darurat atau WhatsApp kami. Konsultan medis & duka kami akan mendampingi dan memandu Anda dalam waktu kurang dari 15 menit.'
    },
    {
      title: 'Jika Berada di Rumah Sakit',
      desc: 'Segera infokan staf rumah sakit bahwa Anda akan menggunakan layanan RestInCare. Staf kami akan berkoordinasi langsung dengan pihak rumah sakit untuk berkas rilis jenazah.'
    },
    {
      title: 'Jika Berada di Rumah/Kediaman',
      desc: 'Biarkan almarhum di posisi yang nyaman. Dokter rekanan kami dapat datang bersama tim untuk menerbitkan Surat Keterangan Kematian.'
    },
    {
      title: 'Siapkan Berkas Kependudukan',
      desc: 'Siapkan KTP almarhum, KK (Kartu Keluarga), dan KTP penanggung jawab guna mempermudah pengurusan administrasi.'
    }
  ];

  // Helper to safely close and also back out the history state if closed via UI
  const handleClose = () => {
    onClose();
    // Only back out if we are currently sitting on the dummy state we created
    if (window.history.state?.emergencyModalOpen) {
      window.history.back();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4">
      {/* Backdrop with 20% slate gray tint and 8px blur as required */}
      <div 
        className="fixed inset-0 bg-[#333e50]/40 backdrop-blur-sm transition-opacity duration-300" 
        onClick={handleClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
        id="emergency_modal_container"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#eae7e9] z-10 flex flex-col max-h-[95vh] md:max-h-[90vh]"
      >
        {/* Header - Subdued Crimson with Slate base */}
        <div className="bg-[#333e50] text-white p-4 md:p-6 lg:p-8 relative flex-shrink-0">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            aria-label="Tutup"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          <div className="flex items-center gap-2 md:gap-3 mb-2 text-[#ba1a1a]">
            <ShieldAlert className="w-6 h-6 md:w-7 md:h-7 stroke-[2]" />
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-widest font-semibold text-white/90 leading-tight">
              Pertolongan Darurat Duka 24 Jam
            </span>
          </div>
          <h2 className="font-serif text-xl md:text-2xl lg:text-3xl font-medium tracking-tight mt-1 pr-8">
            Layanan Darurat 24 Jam
          </h2>
          <p className="font-sans text-white/80 text-xs md:text-sm mt-2 max-w-lg leading-relaxed hidden sm:block">
            Tenanglah, kami ada di sini untuk membantu Anda. Tim profesional kami terlatih menangani segala keperluan dengan cepat dan penuh empati.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-4 md:p-6 lg:p-8 overflow-y-auto bg-[#fbf8fa] flex-1">
          
          {/* Main Hotlines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
            <a 
              href="tel:08001404100" 
              className="flex items-center justify-between p-3 md:p-4 bg-white hover:bg-[#f5f3f4] border border-[#ba1a1a]/30 hover:border-[#ba1a1a] rounded-xl transition-all shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 rounded-lg bg-[#ba1a1a]/10 text-[#ba1a1a]">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-gray-500">Telepon Bebas Pulsa</p>
                  <p className="text-base md:text-lg font-mono font-bold text-[#333e50]">0800-1404-100</p>
                </div>
              </div>
              <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-[#ba1a1a] transition-colors" />
            </a>

            <a 
              href="https://wa.me/6285603035172?text=Halo%20RestInCare%2C%20saya%20memerlukan%20bantuan%20darurat%20pemulasaraan%20segera." 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 md:p-4 bg-white hover:bg-[#f5f3f4] border border-[#546258]/30 hover:border-[#546258] rounded-xl transition-all shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 rounded-lg bg-[#d5e3d7] text-[#546258]">
                  <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-gray-500">WhatsApp Darurat</p>
                  <p className="text-base md:text-lg font-mono font-bold text-[#546258]">+62 856-0303-5172</p>
                </div>
              </div>
              <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-[#546258] transition-colors" />
            </a>
          </div>

          {/* Quick Guide Steps - With Custom Sage Green Checks */}
          <div className="mb-4 md:mb-6">
            <h3 className="font-serif text-base md:text-lg font-semibold text-[#333e50] mb-3 md:mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#546258]" />
              Panduan Langkah Pertama
            </h3>
            <div className="space-y-3 md:space-y-4">
              {immediateActions.map((action, i) => (
                <div key={i} className="flex gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-xl border border-[#eae7e9] shadow-sm">
                  <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#d5e3d7] text-[#546258] mt-0.5 md:mt-1 font-sans text-[10px] md:text-xs font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-[#333e50] text-xs md:text-sm">{action.title}</h4>
                    <p className="font-sans text-gray-600 text-[10px] md:text-xs mt-1 leading-relaxed">{action.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assurance text */}
          <div className="bg-[#d5e3d7]/40 p-3 md:p-4 rounded-xl border border-[#d5e3d7] text-center text-[10px] md:text-xs text-[#58665c] leading-relaxed">
            <Heart className="w-3 h-3 md:w-4 md:h-4 inline-block mr-1.5 text-[#546258] align-middle" />
            Kami siap menangani penjemputan jenazah dari rumah duka atau rumah sakit maupun penyiapan pemakaman <strong className="font-semibold">24 jam, 7 hari seminggu</strong> di seluruh wilayah Bandung Raya.
          </div>

        </div>

        {/* Footer */}
        <div className="bg-white border-t border-[#eae7e9] p-3 md:p-4 flex justify-end flex-shrink-0">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#333e50] text-white hover:bg-[#4a5568] transition-colors font-sans text-xs md:text-sm font-semibold rounded-lg"
          >
            Saya Mengerti
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
