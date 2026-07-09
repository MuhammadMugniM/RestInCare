import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Printer, 
  Phone, 
  MessageSquare, 
  FileText, 
  Sparkles, 
  Share2, 
  RotateCcw,
  Heart,
  Calendar,
  User,
  MapPin
} from 'lucide-react';
import { PlanningState, BELIEFS, PACKAGES, CUSTOM_OPTIONS } from '../types';

interface SuccessReceiptProps {
  data: PlanningState & { totalCost: number };
  onReset: () => void;
}

export default function SuccessReceipt({ data, onReset }: SuccessReceiptProps) {
  const [showGranularPrices, setShowGranularPrices] = useState(false);
  const [isPreparingPrint, setIsPreparingPrint] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState('BCA');
  const currentBelief = BELIEFS.find(b => b.id === data.belief) || BELIEFS[0];
  const currentPackage = PACKAGES.find(p => p.id === data.packageId) || PACKAGES[1];

  const validSelectedOptions = data.selectedOptions.filter(id => {
    if (data.belief === 'islamic') {
      return ['catering', 'cemetery_coordinates', 'livestreaming'].includes(id);
    }
    if (data.belief === 'hindu') {
      return !['coffin_upgrade', 'memorial_hall'].includes(id);
    }
    return true;
  });

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const getWhatsAppUrl = () => {
    const message = `Halo RestInCare, saya ingin mengonfirmasi pesanan layanan duka dengan detail berikut:

- Nama Mendiang: ${data.deceasedName}
- Paket Pilihan: ${currentPackage.name}
- Total Biaya: ${formatIDR(data.totalCost)}
- Metode Pembayaran: ${selectedPayment}

Saya sudah melakukan transfer. Mohon diproses, terima kasih.`;
    return `https://wa.me/6285603035172?text=${encodeURIComponent(message)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    setIsPreparingPrint(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 md:px-0 py-12 print:py-0"
      id="success_receipt_view"
    >
      {/* Top Calming Message */}
      <div className="text-center mb-10 print:hidden">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#d5e3d7] text-[#546258] mb-4 shadow-sm">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-[#333e50] font-medium tracking-tight">
          Pesanan Berhasil Disimpan
        </h2>
        <p className="font-sans text-gray-600 text-sm md:text-base mt-2 max-w-lg mx-auto leading-relaxed">
          Terima kasih atas kepercayaan mulia Anda. Rencana penghormatan bagi <strong>{data.deceasedName}</strong> telah tersimpan aman dalam sistem penataan kami.
        </p>

        {/* Database & PDF Notification Banner */}
        <div className="mt-6 max-w-md mx-auto p-4 bg-[#f4f7f5] border border-[#d5e3d7] rounded-xl flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[#546258]">
            <span className="w-2 h-2 rounded-full bg-[#546258] animate-ping" />
            <span>Menunggu Konfirmasi Pembayaran</span>
          </div>
          <p className="text-[12px] text-gray-600 font-sans mt-2 mb-2">
            Pilih metode pembayaran:
          </p>
          <div className="w-full">
            <div className="grid grid-cols-3 gap-2 mb-3">
              {['BCA', 'Mandiri', 'BNI', 'BRI', 'BSI'].map((bank) => (
                <button
                  key={bank}
                  onClick={() => setSelectedPayment(bank)}
                  className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all ${
                    selectedPayment === bank
                      ? 'bg-[#546258] text-white border-[#546258]'
                      : 'bg-white text-[#546258] border-[#eae7e9] hover:border-[#546258]'
                  }`}
                >
                  {bank}
                </button>
              ))}
            </div>

            <div className="bg-white px-4 py-4 rounded-lg border border-[#eae7e9] w-full text-center mt-1 shadow-sm">
              <>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Bank {selectedPayment}</p>
                  <p className="font-mono text-xl font-bold text-[#333e50] tracking-widest my-2">
                    {selectedPayment === 'BCA' && '123 456 7890'}
                    {selectedPayment === 'Mandiri' && '137 000 123 4567'}
                    {selectedPayment === 'BNI' && '012 345 6789'}
                    {selectedPayment === 'BRI' && '0012 01 001234 56 7'}
                    {selectedPayment === 'BSI' && '712 345 6789'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">a.n. <strong className="font-semibold text-gray-800">RestInCare Indonesia</strong></p>
                </>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 font-sans mt-2">
            Setelah transfer, klik tombol WhatsApp di bawah ini untuk mengonfirmasi pembayaran Anda.
          </p>
        </div>

        {/* Highly Visible Document Controls at the Top */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center items-center">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#25D366] hover:bg-[#1ebd59] text-white transition-all rounded-xl font-sans text-sm font-bold flex items-center justify-center gap-2 shadow-md h-[48px]"
          >
            <MessageSquare className="w-5 h-5" />
            Konfirmasi via WhatsApp
          </a>

          <button
            onClick={handlePrint}
            className="px-5 py-3 bg-white border border-[#eae7e9] text-gray-700 hover:bg-[#f5f3f4] transition-colors rounded-xl font-sans text-xs font-semibold flex items-center justify-center gap-2 h-[48px] cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak Memo (PDF)
          </button>

          <button
            onClick={onReset}
            className="px-4 py-3 bg-white border border-[#eae7e9] text-gray-700 hover:bg-[#f5f3f4] transition-colors rounded-xl font-sans text-xs font-semibold flex items-center justify-center gap-1.5 h-[48px] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Kembali
          </button>
        </div>
      </div>

      {/* Main Document / Letterhead */}
      <div className="bg-white rounded-2xl border border-[#eae7e9] shadow-2xl p-6 md:p-12 relative overflow-hidden print:border-none print:shadow-none">
        
        {/* Subtle decorative top line matching brand colors */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#546258]" />

        {/* Logo and Date Head */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#eae7e9] pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-full bg-[#333e50] flex items-center justify-center text-[#d5e3d7] font-serif text-base font-bold">R</div>
              <h1 className="font-serif text-xl font-bold text-[#333e50] tracking-tight">RestInCare</h1>
            </div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Digital Sanctuary Pemulasaraan Indonesia</p>
          </div>
          <div className="text-left sm:text-right mt-4 sm:mt-0 font-sans text-xs text-gray-500">
            <p>No. Estimasi: <span className="font-mono font-bold text-[#333e50]">RIC-2026-{(Math.floor(1000 + Math.random() * 9000))}</span></p>
            <p>Tanggal Dibuat: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="text-[#546258] font-bold">Status: Siaga Terdaftar</p>
          </div>
        </div>

        {/* Title of Document */}
        <div className="text-center mb-8">
          <h3 className="font-serif text-xl md:text-2xl font-bold uppercase tracking-wide text-[#333e50]">
            Memo Perencanaan Duka & Estimasi Biaya
          </h3>
          <p className="text-xs text-gray-500 mt-1 font-sans italic">
            "Quiet Elegance - Memberikan Penghormatan Suci Tanpa Keraguan"
          </p>
        </div>

        {/* Master details section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 bg-[#fbf8fa] p-6 rounded-xl border border-[#eae7e9]">
          <div className="space-y-3">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#546258] border-b border-[#eae7e9] pb-1">
              Data Penerima Manfaat (Mendiang)
            </h4>
            
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>Nama Almarhum/ah: <strong className="text-[#333e50]">{data.deceasedName}</strong></span>
            </div>

            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>Wafat per Tanggal: <strong>{data.dateOfPassing}</strong></span>
            </div>

            {data.belief === 'islamic' ? (
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700">
                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>Perlengkapan: <strong>Set Kain Kafan & Papan Lahat Standard</strong></span>
              </div>
            ) : data.belief === 'hindu' ? null : (
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700">
                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>Ukuran Peti Mati: <strong className="capitalize">{data.coffinDimension || 'Standar'}</strong> ({data.coffinDimension === 'standar' ? '180 x 60 cm' : data.coffinDimension === 'menengah' ? '190 x 65 cm' : '200 x 70 cm'})</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>Lokasi Berpulang: <strong>{data.locationOfPassing || 'Kediaman / Rumah Sakit'}</strong></span>
            </div>

            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700">
              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>Ritual Adat Keagamaan: <strong>{currentBelief.name}</strong></span>
            </div>

            {data.deathCertificateFile && (
              <div className="flex items-center gap-2 text-xs md:text-sm text-[#546258] font-semibold bg-[#d5e3d7]/35 p-2 rounded-lg border border-[#546258]/15 mt-2">
                <FileText className="w-4 h-4 flex-shrink-0 text-[#546258]" />
                <span className="truncate">Dokumen Kematian: <strong className="text-[#333e50] underline">{data.deathCertificateFile}</strong></span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#546258] border-b border-[#eae7e9] pb-1">
              Penanggung Jawab Keluarga
            </h4>

            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>Nama Penanggung Jawab: <strong className="text-[#333e50]">{data.applicantName}</strong></span>
            </div>

            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700">
              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>Selsor Telepon: <strong className="font-mono text-[#333e50]">{data.applicantPhone}</strong></span>
            </div>

            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700">
              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>Hubungan Keluarga: <strong>{data.applicantRelation}</strong></span>
            </div>

            {data.specialRequests && (
              <div className="text-xs text-gray-500 italic mt-2 p-2 bg-white rounded-lg border border-[#eae7e9]">
                "Amanat: {data.specialRequests}"
              </div>
            )}
          </div>
        </div>

        {/* Beautiful simplified summary card */}
        <div className="bg-[#fbf8fa] hover:bg-white border border-[#eae7e9] rounded-2xl p-6 md:p-8 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#546258] bg-[#d5e3d7]/30 px-3 py-1 bg-opacity-40 rounded-full">Paket Terdaftar</span>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#333e50] mt-2">
              {currentPackage.name}
            </h3>
            <p className="text-xs text-gray-500">{currentPackage.tagline}</p>
            <p className="text-xs text-slate-650 flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#546258] inline-block" />
              Layanan duka: <strong className="text-gray-700 font-semibold">{currentBelief.name}</strong>
            </p>
            {validSelectedOptions.length > 0 && (
              <p className="text-xs text-slate-650 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#546258] inline-block" />
                Layanan tambahan: <strong className="text-gray-700 font-semibold">{validSelectedOptions.length} Layanan Terpilih</strong>
              </p>
            )}
          </div>
          <div className="md:text-right border-t md:border-t-0 border-[#f0edef] pt-4 md:pt-0 space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest block">Total Estimasi Akhir</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#ba1a1a] tracking-tight">
              {formatIDR(data.totalCost)}
            </h2>
            <span className="text-[10px] text-gray-400 block font-sans">Semua biaya net, transparan, tanpa pungutan tambahan</span>
          </div>
        </div>

        {/* Granular Price Line-Items Dropdown */}
        <div className="border border-[#eae7e9] rounded-xl overflow-hidden mb-8 bg-white shadow-sm transition-all duration-350 print:block">
          <button
            type="button"
            onClick={() => setShowGranularPrices(!showGranularPrices)}
            className="w-full px-6 py-4 text-left font-sans font-bold text-xs md:text-sm text-[#333e50] flex justify-between items-center hover:bg-[#fbf8fa] transition-colors gap-3 print:hidden"
          >
            <span>{showGranularPrices ? 'Sembunyikan Rincian Biaya Granular' : 'Lihat Rincian Biaya Granular'}</span>
            <span className="text-xs transform transition-transform duration-200">
              {showGranularPrices ? '▲' : '▼'}
            </span>
          </button>

          {(showGranularPrices || window.matchMedia?.('print').matches) && (
            <div className="border-t border-[#f0edef] overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-[#eae7e9]">
                    <th className="px-6 py-3 font-sans text-[11px] uppercase tracking-wider font-bold text-gray-500">Komponen Program</th>
                    <th className="px-6 py-3 font-sans text-[11px] uppercase tracking-wider font-bold text-gray-500">Kategori</th>
                    <th className="px-6 py-3 font-sans text-[11px] uppercase tracking-wider font-bold text-gray-500 text-right">Rincian Nominal (IDR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eae7e9]">
                  {/* Base Package Line */}
                  <tr className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <h5 className="font-sans font-bold text-xs text-[#333e50]">{currentPackage.name}</h5>
                      <p className="text-[10px] text-gray-500 mt-0.5">{currentPackage.tagline}</p>
                      <p className="text-[10px] text-[#546258] font-semibold mt-1">✓ Termasuk Protokol Pemulasaraan {currentBelief.name}</p>
                    </td>
                    <td className="px-6 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-widest">
                      Paket Utama
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs font-bold text-[#333e50]">
                      {formatIDR(currentPackage.basePrice)}
                    </td>
                  </tr>

                  {/* Add-ons iteration */}
                  {validSelectedOptions.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-xs text-center text-gray-400 italic">
                        Belum ada layanan tambahan opsional yang dipilih
                      </td>
                    </tr>
                  ) : (
                    validSelectedOptions.map((optId, idx) => {
                      const opt = CUSTOM_OPTIONS.find(o => o.id === optId);
                      if (!opt) return null;

                      let name = opt.name;
                      let price = opt.price;
                      if (opt.id === 'catering') {
                        name = `Catering Sajian Pelayat (${data.cateringPortions || 100} Porsi)`;
                        price = (opt.price / 100) * (data.cateringPortions || 100);
                      } else if (opt.id === 'memorial_hall') {
                        name = `Sewa Rumah Duka Premium (Mulai: ${data.funeralHomeStartDate ? new Date(data.funeralHomeStartDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Segera'})`;
                      }

                      return (
                        <tr key={opt.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-4">
                            <h5 className="font-sans font-bold text-xs text-[#333e50]">{name}</h5>
                            <p className="text-[10px] text-gray-400 mt-0.5">{opt.description}</p>
                          </td>
                          <td className="px-6 py-4 text-[11px] text-gray-500 capitalize">
                            {opt.category === 'facility' ? 'Fasilitas Utama' : opt.category === 'ritual' ? 'Upacara Luhur' : 'Sajian Tamu'}
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-xs font-bold text-[#333e50]">
                            {formatIDR(price)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Undertaking Declaration and Commitment Signature */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-[#eae7e9] mt-8 text-xs text-gray-500">
          <div>
            <h5 className="font-sans font-bold text-xs text-[#333e50] mb-2">Pernyataan Komitmen Layanan (RestInCare)</h5>
            <p className="leading-relaxed">
              Kami menjamin seluruh komponen layanan di atas dikoordinasikan secara penuh rasa hormat, tulus, tanpa biaya terselubung. Tim lapangan kami terlatih berkoordinasi secara profesional meringankan beban keluarga.
            </p>
          </div>
          <div className="text-left sm:text-right flex flex-col items-start sm:items-end justify-between">
            <div>
              <p className="font-sans text-xs italic">Tertanda Khidmat,</p>
              <p className="font-serif text-sm font-bold text-[#333e50] mt-4">RestInCare Care Assistant</p>
              <p className="text-[10px] text-gray-400">Tim Koordinasi Tanggap Darurat</p>
            </div>
            <div className="text-[10px] text-[#546258] font-semibold mt-4 sm:mt-0 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 inline text-[#546258]" />
              Terverifikasi Otentik Digital
            </div>
          </div>
        </div>

      </div>

      {/* Practical post-steps advice list / Guidelines using custom green checklists as required */}
      <div className="mt-8 bg-white border border-[#eae7e9] rounded-2xl p-6 md:p-8 shadow-md print:hidden">
        <h4 className="font-serif text-lg font-bold text-[#333e50] mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#546258]" />
          Langkah Tindak Lanjut Setelah Menyimpan Dokumen Ini
        </h4>
        <ul className="space-y-3">
          <li className="flex gap-3 text-xs md:text-sm text-gray-700">
            <CheckCircle2 className="w-5 h-5 text-[#546258] stroke-[3px] mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">
              <strong>Simpan atau Cetak Dokumen:</strong> Klik tombol "Cetak Dokumen" di bawah ini untuk mengunduh versi PDF duka atau mencetaknya sebagai pegangan fisik keluarga.
            </span>
          </li>
          <li className="flex gap-3 text-xs md:text-sm text-gray-700">
            <CheckCircle2 className="w-5 h-5 text-[#546258] stroke-[3px] mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">
              <strong>Kirim Konsultasi Instan:</strong> Klik tombol "Kirim Konsultasi ke Care Assistant" agar salah satu pendamping duka profesional kami menghubungi Anda lewat telepon/WhatsApp untuk memverifikasi detail teknis lapangan.
            </span>
          </li>
          <li className="flex gap-3 text-xs md:text-sm text-gray-700">
            <CheckCircle2 className="w-5 h-5 text-[#546258] stroke-[3px] mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">
              <strong>Pemberangkatan Tim:</strong> Jika Anda sedang membutuhkan bantuan darurat pemulasaraan instan sekarang, segera hubungi Hotline di atas dengan membacakan kode estimasi Anda.
            </span>
          </li>
        </ul>
      </div>

      {/* Document controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8 print:hidden">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-white border border-[#eae7e9] text-gray-700 hover:bg-[#f5f3f4] transition-colors rounded-lg font-sans text-sm font-semibold flex items-center justify-center gap-2 h-[48px]"
        >
          <RotateCcw className="w-4 h-4" />
          Rancang Ulang Rencana
        </button>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-white border-2 border-[#546258] text-[#546258] hover:bg-[#d5e3d7]/20 transition-colors rounded-lg font-sans text-sm font-bold flex items-center justify-center gap-2 h-[48px]"
          >
            <Printer className="w-4 h-4" />
            Cetak Dokumen
          </button>

          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-[#546258] hover:bg-[#3d4a41] text-white transition-all rounded-lg font-sans text-sm font-bold flex items-center justify-center gap-2 h-[48px]"
          >
            <MessageSquare className="w-4 h-4" />
            Kirim Konsultasi via WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
}
