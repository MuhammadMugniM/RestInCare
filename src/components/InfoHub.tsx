import { useState } from 'react';
import { 
  FileText, 
  HelpCircle, 
  BookOpen, 
  Check, 
  ChevronDown, 
  ShieldCheck, 
  Award,
  Users
} from 'lucide-react';

export default function InfoHub() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const documentChecklist = [
    {
      title: 'Kami dapat membantu memandu Anda menyiapkan: Surat Kematian Rumah Sakit/RT',
      importance: 'Pendampingan',
      desc: 'Diterbitkan dokter yang merawat atau puskesmas setempat sebagai dasar penerbitan Akta Sipil resmi. Tim kami siap mendampingi pengurusannya.'
    },
    {
      title: 'Kami siap membantu memverifikasi: KTP Asli Almarhum / Almarhumah',
      importance: 'Pendampingan',
      desc: 'Digunakan untuk pelaporan pencatatan kependudukan & pemutakhiran KK secara praktis.'
    },
    {
      title: 'Kami siap membantu memverifikasi: Kartu Keluarga (KK) Almarhum / Almarhumah',
      importance: 'Pendampingan',
      desc: 'Untuk validasi data kekeluargaan dan pencantuman status terbaru dengan tenang.'
    },
    {
      title: 'Kami siap memandu kelengkapan: KTP Penanggung Jawab Duka (Ahli Waris)',
      importance: 'Pendampingan',
      desc: 'Sebagai identitas valid penandatanganan dokumen kontrak duka dan retribusi makam.'
    },
    {
      title: 'Kami bantu koordinasikan: Surat Pengantar dari RT & RW Setempat',
      importance: 'Asistensi Tambahan',
      desc: 'Diperlukan bila almarhum meninggal di rumah sebagai pengantar ke Kelurahan (Diasistensi penuh oleh Tim Lapangan RestInCare).'
    }
  ];

  const faqs = [
    {
      q: 'Bagaimana alur awal jika almarhum meninggal di luar jam kantor?',
      a: 'RestInCare beroperasi penuh 24 jam sehari termasuk hari libur nasional. Cukup tekan tombol "Layanan Darurat 24 Jam" di portal ini atau hubungi hotline bebas pulsa kami. Tim konsultan duka kami akan mendatangi kediaman Anda dalam kurun 30 menit dan langsung mengambil alih penanganan transportasi serta formalinasi.'
    },
    {
      q: 'Apakah biaya yang tertera di rincian bersifat final?',
      a: 'Ya. RestInCare memegang teguh nilai kehormatan dan kejujuran luhur. Seluruh biaya estimasi yang Anda setujui di portal perencanaan bersifat mutlak dan final (net). Tidak ada pungutan liar di liang lahat, tips berselubung untuk kru, atau biaya tambahan mendadak di luar kesepakatan tertulis.'
    },
    {
      q: 'Bagaimana jika kami belum memiliki kavling makam?',
      a: 'Jika memilih Paket Utama (Mulia) atau Heritage Elite (Luhur), konsultan kami dapat langsung membantu merekomendasikan serta mengurus pembelian kavling makam baik di pemakaman umum (TPU) Bandung maupun pemakaman swasta premium di sekitar Jawa Barat.'
    },
    {
      q: 'Apakah RestInCare melayani pengiriman jenazah ke luar kota?',
      a: 'Ya. Kami memiliki armada pesawat kargo duka terkoordinasi dan ambulans perjalanan jauh yang tersertifikasi lengkap untuk melakukan repatriasi duka (pengiriman peti jenazah) ke seluruh pelosok provinsi di Indonesia dengan standar kenyamanan tinggi.'
    }
  ];

  return (
    <section className="bg-[#fbf8fa]/70 backdrop-blur-sm border-t border-[#eae7e9]/50 py-16 md:py-24" id="info_hub_section">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#546258] mb-1.5 block">Sumber Panduan Kedukaan</span>
          <h2 className="font-serif text-3xl md:text-4.5xl text-[#333e50] font-medium tracking-tight">
            Asistensi & Prosedur Legal Kematian
          </h2>
          <p className="font-sans text-gray-600 text-sm md:text-base mt-2 leading-relaxed">
            Membantu Anda memahami langkah prosedural krusial di Indonesia agar terhindar dari kendala birokrasi di tengah suasana duka cita.
          </p>
        </div>

        {/* Section Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Document Checklist Panel (12-column grid spans) */}
          <div className="lg:col-span-7 bg-[#fbf8fa] p-6 md:p-8 rounded-2xl border border-[#eae7e9] shadow-sm">
            <h3 className="font-serif text-xl font-bold text-[#333e50] mb-3 flex items-center gap-2">
              <FileText className="w-5.5 h-5.5 text-[#546258]" />
              Daftar Dokumen yang Perlu Disiapkan
            </h3>
            <p className="font-sans text-xs md:text-sm text-gray-500 mb-6 leading-relaxed">
              Berikut adalah daftar dokumen yang perlu disiapkan oleh pihak keluarga. Tim asisten RestInCare siap membantu pengurusan akta kematian secara gratis bagi pengguna Paket Mulia atau Paket Premium.
            </p>

            <div className="space-y-4">
              {documentChecklist.map((doc, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-white rounded-xl border border-[#eae7e9] shadow-sm hover:border-[#546258] transition-all">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-6 h-6 rounded-full bg-[#d5e3d7] text-[#546258] flex items-center justify-center font-bold text-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-sans font-bold text-[#333e50] text-xs md:text-sm">{doc.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        doc.importance === 'Pendampingan' 
                          ? 'bg-neutral-100 text-neutral-600 border border-neutral-200' 
                          : 'bg-[#d5e3d7]/30 text-[#546258] border border-[#d5e3d7]'
                      }`}>
                        {doc.importance}
                      </span>
                    </div>
                    <p className="font-sans text-gray-650 text-xs leading-relaxed">{doc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Accordions Widget */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-4 bg-[#d5e3d7]/35 border border-[#546258]/20 rounded-xl">
              <h4 className="font-sans font-semibold text-xs text-[#546258] uppercase tracking-wider mb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Standar Integritas
              </h4>
              <p className="text-xs text-[#58665c] leading-relaxed">
                Setiap staf pelayanan kami bekerja sesuai dengan standar etika nasional dan diawasi oleh pemuka agama terkait untuk menjamin kesesuaian dan kesucian prosesi.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-[#333e50] mb-4 flex items-center gap-2">
                <HelpCircle className="w-5.5 h-5.5 text-[#546258]" />
                Pertanyaan yang Sering Diajukan
              </h3>
              
              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div 
                      key={idx} 
                      className="bg-white border border-[#eae7e9] rounded-xl overflow-hidden shadow-sm transition-all duration-350"
                    >
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        className="w-full p-4 text-left font-sans font-semibold text-xs md:text-sm text-[#333e50] flex justify-between items-center hover:bg-[#fbf8fa] transition-colors gap-3"
                      >
                        <span className="leading-snug">{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180 text-[#546258]' : ''}`} />
                      </button>

                      <div 
                        className={`transition-all duration-300 overflow-hidden ${
                          isOpen ? 'max-h-[300px] border-t border-[#f0edef] p-4 bg-[#fbf8fa]' : 'max-h-0'
                        }`}
                      >
                        <p className="font-sans text-xs md:text-sm text-gray-600 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Testimonial Soft Quote */}
            <div className="p-6 bg-white border border-[#eae7e9] rounded-2xl shadow-sm relative italic">
              <div className="absolute top-4 right-4 text-gray-200">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed pt-2">
                "Kehadiran tim RestInCare sangat membantu kami di saat berduka. Seluruh administrasi rumah sakit dan pemakaman diurus dengan baik, sehingga keluarga bisa fokus mendoakan almarhum tanpa repot mengurus dokumen."
              </p>
              <p className="text-[10px] font-sans font-bold text-[#546258] uppercase tracking-wider mt-4">
                — Keluarga Bpk. Kosan Garasi Biru
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
