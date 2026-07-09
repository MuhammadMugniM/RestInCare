import { BELIEFS, BeliefConfig } from '../types';
import { Moon, Heart, Flame, Shield, ArrowRight } from 'lucide-react';

interface ServiceShowcaseProps {
  onSelectBelief: (id: string) => void;
}

export default function ServiceShowcase({ onSelectBelief }: ServiceShowcaseProps) {
  return (
    <section className="py-16 md:py-24 bg-[#fbf8fa]/70 backdrop-blur-sm" id="service_cards_showcase">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#546258] mb-1.5 block">
            Layanan Kami
          </span>
          <h2 className="font-serif text-3xl md:text-4.5xl text-[#333e50] font-medium tracking-tight">
            Pilihan Layanan Kedukaan
          </h2>
          <p className="font-sans text-gray-650 text-sm md:text-base mt-2 leading-relaxed">
            Layanan kedukaan yang diselenggarakan secara khidmat dan profesional sesuai dengan agama dan kepercayaan. Pilih layanan untuk melihat estimasi biaya.
          </p>
        </div>

        {/* Categories Grid (Service Cards as required with 32px padding and 0.95 opacity illustrations) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BELIEFS.map((b) => (
            <div
              key={b.id}
              className="group relative bg-[#ffffff] rounded-2xl p-8 border border-[#eae7e9] transition-all duration-300 hover:shadow-xl hover:border-[#546258] hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
              style={{ minHeight: '380px' }}
            >
              <div>
                {/* Subdued icon banner */}
                <div className="inline-flex p-3 rounded-xl bg-[#d5e3d7]/60 text-[#546258] mb-6 transition-colors group-hover:bg-[#546258] group-hover:text-white">
                  {b.id === 'islamic' && <Moon className="w-6 h-6 stroke-[2]" />}
                  {b.id === 'christian' && (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 2h2v20h-2M5 8h14v2H5" /></svg>
                  )}
                  {b.id === 'buddhist' && <Flame className="w-6 h-6" />}
                  {b.id === 'hindu' && (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>
                  )}
                  {b.id === 'general' && <Heart className="w-6 h-6" />}
                </div>

                <h3 className="font-serif text-xl font-bold text-[#1b1b1d] group-hover:text-[#333e50] mb-2">
                  {b.name}
                </h3>
                <p className="text-xs font-bold uppercase tracking-widest text-[#546258] mb-4">
                  {b.subtitle}
                </p>
                <p className="font-sans text-gray-600 text-xs md:text-sm leading-relaxed mb-6">
                  {b.description}
                </p>
              </div>

              <div>
                {/* Embedded checkmarks block depicting premium inclusions */}
                <div className="border-t border-[#f0edef] pt-4 mb-6 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Fasilitas Utama:</span>
                  <div className="text-xs text-gray-700 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#546258]" />
                    <span>Perawatan dan pemandian jenazah</span>
                  </div>
                  <div className="text-xs text-gray-700 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#546258]" />
                    <span>Standar kebersihan medis</span>
                  </div>
                </div>

                {/* Direct selector action (48px target) */}
                <button
                  onClick={() => onSelectBelief(b.id)}
                  className="w-full h-[48px] bg-[#fbf8fa] hover:bg-[#333e50] text-[#333e50] hover:text-white border border-[#eae7e9] hover:border-[#333e50] text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  Pilih Layanan Ini
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Fast advisory block */}
        <div className="mt-16 bg-[#333e50] rounded-2xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 shadow-lg">
          <div className="max-w-2xl relative z-10">
            <h3 className="font-serif text-xl md:text-2xl font-bold mb-2">
              Butuh Penjemputan Segera?
            </h3>
            <p className="font-sans text-white/80 text-xs md:text-sm leading-relaxed">
              Tim asisten kedukaan kami siap melakukan evakuasi jenazah ke tempat persemayaman dalam area Bandung dalam kurun waktu 30-45 menit. Segera komunikasikan kebutuhan Anda untuk mengaktifkan armada tercepat kami.
            </p>
          </div>
          <div className="flex-shrink-0 flex gap-4 w-full md:w-auto relative z-10">
            <a 
              href="https://wa.me/6285603035172?text=Halo%20RestInCare%2C%20saya%20memerlukan%20bantuan%20darurat%20pemulasaraan%20segera."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none text-center px-6 py-3 bg-[#ba1a1a] hover:bg-red-700 text-white font-sans text-xs uppercase tracking-wider font-bold rounded-lg transition-colors h-[48px] flex items-center justify-center"
            >
              Hubungi Ambulans Darurat
            </a>
          </div>
          {/* Subtle soft white blur orb indicator background */}
          <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        </div>

      </div>
    </section>
  );
}
