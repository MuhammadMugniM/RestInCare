import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc } from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";
import { db, auth, googleProvider } from "../firebaseConfig";
import { 
  BELIEFS, 
  PACKAGES, 
  CUSTOM_OPTIONS, 
  BeliefType, 
  PlanningState,
  CustomOption
} from '../types';
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Moon, 
  Flame, 
  Heart, 
  Sparkles,
  User,
  Calendar,
  MapPin,
  FileText,
  Phone,
  HelpCircle,
  Clock,
  Printer,
  Upload,
  Trash2,
  AlertCircle
} from 'lucide-react';

// Dynamic import for Leaflet map component to prevent SSR issues (if used in SSR environment like Next.js)
const CemeteryMap = React.lazy(() => import('./CemeteryMap'));

// Dynamic resolver for belief icons from Lucide-React
const renderBeliefIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case 'MoonStar':
      return <Moon className={className} />;
    case 'Cross':
      return (
        <svg
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 2h2v20h-2z" />
          <path d="M5 8h14v2H5z" />
        </svg>
      );
    case 'Flame':
      return <Flame className={className} />;
    case 'Flower':
      return (
        <svg
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3" />
          <path d="M12 19v3" />
          <path d="M2 12h3" />
          <path d="M19 12h3" />
          <path d="m19 5-2.5 2.5" />
          <path d="m5 19 2.5-2.5" />
          <path d="m5 5 2.5 2.5" />
          <path d="m19 19-2.5-2.5" />
        </svg>
      );
    default:
      return <Heart className={className} />;
  }
};

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -30 : 30,
    opacity: 0,
  })
};

interface ServicePlannerProps {
  onSuccess: (summary: PlanningState & { totalCost: number }) => void;
  initialBelief?: string | null;
  key?: any;
}

export default function ServicePlanner({ onSuccess, initialBelief }: ServicePlannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);
  const [state, setState] = useState<PlanningState>({
    belief: (initialBelief as BeliefType) || 'islamic',
    packageId: 'premium',
    selectedOptions: [],
    deceasedName: '',
    applicantName: '',
    applicantPhone: '',
    applicantRelation: 'Anak',
    specialRequests: '',
    dateOfPassing: new Date().toISOString().split('T')[0],
    locationOfPassing: '',
    deathCertificateFile: '',
    funeralHomeStartDate: '',
    cateringPortions: 100,
    coffinDimension: 'standar'
  });

  const [expandedPackages, setExpandedPackages] = useState<string[]>([]);
  const [expandedOptions, setExpandedOptions] = useState<string[]>([]);
  const [showGranularPrices, setShowGranularPrices] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setState(prev => ({ ...prev, deathCertificateFile: file.name }));
    if (formErrors.deathCertificateFile) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated.deathCertificateFile;
        return updated;
      });
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'RestInCare');

      const response = await fetch('https://api.cloudinary.com/v1_1/g4im2xwb/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.secure_url) {
        setState(prev => ({ ...prev, documentUrl: data.secure_url }));
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Gagal mengunggah dokumen. Silakan coba lagi.');
      setState(prev => ({ ...prev, deathCertificateFile: '', documentUrl: '' }));
    } finally {
      setIsUploading(false);
    }
  };

  const togglePackageExpand = (pkgId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedPackages(prev => 
      prev.includes(pkgId) ? prev.filter(id => id !== pkgId) : [...prev, pkgId]
    );
  };

  const toggleOptionExpand = (optId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedOptions(prev =>
      prev.includes(optId) ? prev.filter(id => id !== optId) : [...prev, optId]
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);

  const totalSteps = 5;

  const currentBelief = BELIEFS.find(b => b.id === state.belief) || BELIEFS[0];
  const currentPackage = PACKAGES.find(p => p.id === state.packageId) || PACKAGES[1];

  // Price arithmetic
  const getAvailableOptions = () => {
    return CUSTOM_OPTIONS.filter((opt) => {
      if (state.belief === 'islamic') {
        return ['catering', 'cemetery_coordinates', 'livestreaming'].includes(opt.id);
      }
      if (state.belief === 'hindu') {
        return !['coffin_upgrade', 'memorial_hall'].includes(opt.id);
      }
      return true;
    });
  };

  const getSelectedOptionsTotal = () => {
    const availableOptionIds = getAvailableOptions().map(o => o.id);
    return state.selectedOptions.reduce((acc, optId) => {
      if (!availableOptionIds.includes(optId)) return acc; // Ignore filtered out options
      const opt = CUSTOM_OPTIONS.find(o => o.id === optId);
      if (!opt) return acc;
      if (optId === 'catering') {
        const portions = state.cateringPortions || 100;
        return acc + (opt.price / 100) * portions;
      }
      return acc + opt.price;
    }, 0);
  };

  const validSelectedOptions = state.selectedOptions.filter(id => getAvailableOptions().some(o => o.id === id));

  const totalCost = currentPackage.basePrice + getSelectedOptionsTotal();

  // Navigation handlers
  const handleNext = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (step === 3) {
      const errors: { [key: string]: string } = {};
      if (state.selectedOptions.includes('memorial_hall') && !state.funeralHomeStartDate) {
        errors.funeralHomeStartDate = 'Tanggal mulai sewa rumah duka harus dipilih';
      }
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      setFormErrors({});
    }

    if (step === 4) {
      // Validate step 4 inputs before summary
      const errors: { [key: string]: string } = {};
      if (!state.applicantName.trim()) errors.applicantName = 'Nama perwakilan harus diisi';
      if (!state.applicantPhone.trim()) errors.applicantPhone = 'Nomor telepon harus diisi';
      if (!state.deceasedName.trim()) errors.deceasedName = 'Nama mendiang/almarhum harus diisi';
      if (!state.deathCertificateFile) errors.deathCertificateFile = 'Dokumen/Surat Kematian Resmi wajib diunggah';
      if (state.deathCertificateFile && !state.documentUrl && isUploading) errors.deathCertificateFile = 'Dokumen sedang diunggah. Silakan tunggu...';
      if (state.deathCertificateFile && !state.documentUrl && !isUploading) errors.deathCertificateFile = 'Gagal mengunggah dokumen. Silakan coba lagi.';
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        // Scroll to error
        const firstErrorKey = Object.keys(errors)[0];
        const element = document.getElementsByName(firstErrorKey)[0];
        if (element) {
          element.focus();
        } else {
          const uploadArea = document.getElementById('death-certificate-upload-area');
          if (uploadArea) {
            uploadArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        return;
      }
      setFormErrors({});
    }

    if (step < totalSteps) {
      setDirection(1);
      setStep(prev => prev + 1);
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleBack = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (step > 1) {
      setDirection(-1);
      setStep(prev => prev - 1);
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const toggleOption = (id: string) => {
    setState(prev => {
      const isSelected = prev.selectedOptions.includes(id);
      const updated = isSelected 
        ? prev.selectedOptions.filter(o => o !== id)
        : [...prev.selectedOptions, id];
      return { ...prev, selectedOptions: updated };
    });
  };

  const handleSubmitFinal = async () => {
    setIsSubmitting(true);
    setFormErrors({});

    try {
      let user = auth.currentUser;

      // Check auth status, prompt login if not logged in
      if (!user) {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          user = result.user;
        } catch (authErr: any) {
          console.error("Popup Auth Error:", authErr);
          setAuthError("Gagal login dengan Google. Pastikan popup tidak diblokir oleh browser.");
          setIsSubmitting(false);
          return;
        }
      }
      
      if (!user) throw new Error("Authentication failed");

      const payload = {
        userId: user.uid,
        userEmail: user.email || '',
        statusPesanan: "Menunggu Konfirmasi",
        belief: state.belief,
        packageId: state.packageId,
        selectedOptions: state.selectedOptions,
        deceasedName: state.deceasedName || '',
        applicantName: state.applicantName || '',
        applicantPhone: state.applicantPhone || '',
        applicantRelation: state.applicantRelation || 'Anak',
        specialRequests: state.specialRequests || '',
        dateOfPassing: state.dateOfPassing || '',
        locationOfPassing: state.locationOfPassing || '',
        deathCertificateFile: state.deathCertificateFile || '',
        documentUrl: state.documentUrl || '',
        funeralHomeStartDate: state.funeralHomeStartDate || '',
        jadwalPersemayaman: state.funeralHomeStartDate || '-',
        cateringPortions: Number(state.cateringPortions || 100),
        coffinDimension: state.coffinDimension || 'standar',
        cemeteryCity: state.cemeteryCity || '',
        cemeteryName: state.cemeteryName || '',
        totalCost: Number(totalCost),
        createdAt: new Date().toISOString()
      };

      console.log("RESTINCARE_DEBUG_PAYLOAD:", payload);
      await addDoc(collection(db, "inquiries"), payload);

      setIsSubmitting(false);
      onSuccess({ ...state, totalCost });
    } catch (error) {
      setIsSubmitting(false);
      console.error("Failed during form submission setup:", error);
    }
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  // Stepper Header
  const stepTitles = [
    'Layanan Kedukaan',
    'Paket Utama',
    'Layanan Tambahan',
    'Data Keluarga',
    'Rincian Estimasi'
  ];

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto px-4 md:px-0 py-8 scroll-mt-24 overflow-x-hidden" id="service_planner_wizard">
      
      {/* Horizontal Stepper (Desktop) */}
      <div className="hidden md:flex items-center justify-between mb-12 px-6">
        {stepTitles.map((title, index) => {
          const stepNum = index + 1;
          const isCompleted = step > stepNum;
          const isActive = step === stepNum;
          
          return (
            <div key={title} className="flex-1 flex items-center relative">
              {/* Line Connector */}
              {index > 0 && (
                <div 
                  className={`absolute left-0 right-1/2 top-4 -translate-y-1/2 h-[2px] -ml-16 mr-6 transition-colors duration-500 ${
                    step > index ? 'bg-[#546258]' : 'bg-[#c5c6cd]'
                  }`} 
                />
              )}
              {index < stepTitles.length - 1 && (
                <div 
                  className={`absolute left-1/2 right-0 top-4 -translate-y-1/2 h-[2px] ml-6 -mr-16 transition-colors duration-500 ${
                    step > stepNum ? 'bg-[#546258]' : 'bg-[#c5c6cd]'
                  }`} 
                />
              )}

              {/* Node content */}
              <div className="flex flex-col items-center mx-auto z-10">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-[#546258] border-[#546258] text-white' 
                      : isActive 
                        ? 'bg-[#333e50] border-[#333e50] text-white shadow-md' 
                        : 'bg-white border-[#c5c6cd] text-gray-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 text-white stroke-[3px]" /> : stepNum}
                </div>
                <span 
                  className={`text-xs mt-3 font-semibold transition-colors ${
                    isActive ? 'text-[#333e50]' : isCompleted ? 'text-[#546258]' : 'text-gray-400'
                  }`}
                >
                  {title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile progress summary */}
      <div className="md:hidden flex items-center justify-between bg-[#f0edef] p-4 rounded-xl mb-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-gray-500">Langkah {step} dari {totalSteps}</span>
          <h3 className="font-serif text-base font-bold text-[#333e50]">{stepTitles[step - 1]}</h3>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div 
              key={idx} 
              className={`w-4 h-1.5 rounded-full transition-all duration-300 ${
                idx + 1 === step 
                  ? 'bg-[#333e50] w-6' 
                  : idx + 1 < step 
                    ? 'bg-[#546258]' 
                    : 'bg-[#c5c6cd]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Primary Card */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="bg-white rounded-2xl border border-[#eae7e9] p-6 md:p-8 shadow-xl relative min-h-[450px] flex flex-col justify-between"
          id={`wizard_step_card_${step}`}
        >
          <div>
            
            {/* STEP 1: RELIGION / BELIEF */}
            {step === 1 && (
              <div className="fade-in">
                <div className="max-w-2xl">
                  <span className="text-xs uppercase tracking-widest font-semibold text-[#546258] mb-1 block">Layanan Budaya & Keyakinan</span>
                  <h2 className="font-serif text-2xl md:text-3xl text-[#333e50] mb-3 font-medium">Bimbingan Sesuai Adat & Keyakinan</h2>
                  <p className="font-sans text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                    Mendiang akan dipulasara dengan penuh kehormatan mengikuti tata cara syariat Islam, liturgi gereja Kristen/Katolik, paritta Buddhis, ngaben Hindu, ataupun penghormatan umum universal.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 my-6">
                  {BELIEFS.map((b) => {
                    const isSelected = state.belief === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => setState(prev => ({ ...prev, belief: b.id }))}
                        className={`flex flex-col items-center text-center p-5 rounded-xl border-2 transition-all duration-300 relative ${
                          isSelected 
                            ? 'border-[#546258] bg-[#d5e3d7]/20 shadow-md transform -translate-y-1' 
                            : 'border-[#eae7e9] hover:border-[#c5c6cd] bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-[#546258] text-white rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <div className={`p-3 rounded-full mb-3 transition-colors ${isSelected ? 'bg-[#546258] text-white' : 'bg-[#f0edef] text-gray-600'}`}>
                          {renderBeliefIcon(b.icon, 'w-6 h-6')}
                        </div>
                        <h4 className="font-sans font-bold text-xs md:text-sm text-[#333e50] leading-tight mb-1">{b.name}</h4>
                        <p className="font-sans text-[11px] text-gray-500 leading-tight">{b.subtitle}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 p-6 bg-[#fbf8fa] rounded-xl border border-[#eae7e9] flex flex-col md:flex-row gap-6">
                  <div className="md:w-2/3">
                    <h4 className="font-sans font-bold text-[#333e50] mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#546258]" />
                      Standar Prosedur Pemulasaraan ({currentBelief.name})
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">{currentBelief.description}</p>
                    
                    {/* Sage Green Checkmarks List */}
                    <ul className="space-y-2">
                      {currentBelief.steps.map((st, i) => (
                        <li key={i} className="flex gap-2.5 items-start text-xs text-gray-700">
                          <Check className="w-4 h-4 text-[#546258] stroke-[3px] mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:w-1/3 bg-white p-4 rounded-lg border border-[#eae7e9] flex flex-col justify-between">
                    <div>
                      <h5 className="font-sans font-bold text-xs text-[#546258] uppercase tracking-wider mb-2">Tradisi Penghormatan Luhur</h5>
                      <div className="space-y-1.5">
                        {currentBelief.traditions.map((tr, i) => (
                          <div key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#546258] flex-shrink-0" />
                            <span>{tr}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#eae7e9] text-[11px] text-gray-500 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                      <span>Tim kami bersertifikasi keagamaan resmi</span>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* STEP 2: PACKAGES */}
            {step === 2 && (
              <div className="fade-in">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#546258] mb-1 block">Opsi Paket Peristirahatan</span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#333e50] mb-2 font-medium">Pilih Paket Utama Peristirahatan</h2>
                <p className="font-sans text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                  Setiap paket dirancang dengan kehalusan budi untuk menjaga kesucian upacara duka, mendampingi keluarga dengan hormat terbaik.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                  {PACKAGES.map((pkg) => {
                    const isSelected = state.packageId === pkg.id;
                    const isExclusive = pkg.id === 'exclusive';
                    
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setState(prev => ({ ...prev, packageId: pkg.id }))}
                        className={`cursor-pointer flex flex-col justify-between p-6 rounded-2xl border-2 transition-all duration-300 relative ${
                          isSelected 
                            ? 'border-[#546258] bg-white shadow-lg shadow-gray-200/50 transform -translate-y-1' 
                            : 'border-[#eae7e9] bg-white hover:border-[#c5c6cd]'
                        }`}
                      >
                        {isExclusive && (
                          <span className="absolute -top-3 left-6 px-3 py-1 bg-[#4b3b1f] text-[#dfc6a0] rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Paling Mulia
                          </span>
                        )}
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-serif text-lg font-bold text-[#333e50]">{pkg.name}</h3>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#546258] bg-[#546258]' : 'border-gray-300'}`}>
                              {isSelected && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                            </div>
                          </div>
                          
                          <p className="text-[11px] font-sans text-gray-400 tracking-tight leading-snug mb-3">{pkg.tagline}</p>
                          
                          <div className="my-4">
                            <span className="text-2xl font-serif font-bold text-[#333e50]">{formatIDR(pkg.basePrice)}</span>
                            <span className="text-xs text-gray-400 block mt-0.5">Biaya Paket Net</span>
                          </div>

                          <p className="text-xs text-gray-600 leading-relaxed mb-4 border-t border-[#f0edef] pt-3">{pkg.description}</p>
                        </div>

                        {/* Collapsible Feature List (Progressive Disclosure) */}
                        <div className="mt-2 pt-3 border-t border-[#f0edef]">
                          <button
                            type="button"
                            onClick={(e) => togglePackageExpand(pkg.id, e)}
                            className="w-full flex justify-between items-center text-xs font-semibold text-[#546258] hover:text-[#3d4a41] py-1 select-none"
                          >
                            <span>{expandedPackages.includes(pkg.id) ? 'Sembunyikan Detail ▲' : 'Lihat Detail Layanan ▾'}</span>
                          </button>
                          
                          {expandedPackages.includes(pkg.id) && (
                            <div className="mt-3 space-y-2 text-left bg-[#f4f7f5] p-3 rounded-lg border border-[#e2eae4] transition-all duration-300">
                              <h5 className="font-sans font-bold text-[10px] text-[#546258] uppercase tracking-wider mb-2">Mencakup Layanan:</h5>
                              <ul className="space-y-1.5 border-t border-[#e2eae4] pt-2">
                                {pkg.features.map((f, i) => (
                                  <li key={i} className="flex gap-2 items-start text-[11px] text-gray-700 leading-tight">
                                    <Check className="w-3.5 h-3.5 text-[#546258] stroke-[3px] mt-0.5 flex-shrink-0" />
                                    <span>{f}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}


            {/* STEP 3: CUSTOM / ADDITIONAL OPTIONS */}
            {step === 3 && (
              <div className="fade-in">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#546258] mb-1 block">Rencana Personal</span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#333e50] mb-2 font-medium">Layanan Tambahan Pendukung</h2>
                <p className="font-sans text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                  Sesuaikan kebutuhan keluarga secara spesifik. Opsi tambahan ini akan terintegrasi langsung dalam kalkulasi rincian biaya transparan kami.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  {getAvailableOptions().map((opt) => {
                    const isSelected = state.selectedOptions.includes(opt.id);
                    const isExpanded = expandedOptions.includes(opt.id);
                    let displayPrice = opt.price;
                    if (opt.id === 'catering') {
                      displayPrice = (opt.price / 100) * (state.cateringPortions || 100);
                    }

                    return (
                      <div
                        key={opt.id}
                        onClick={() => toggleOption(opt.id)}
                        className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between ${
                          isSelected 
                            ? 'border-[#546258] bg-[#d5e3d7]/5 shadow-sm' 
                            : 'border-[#eae7e9] bg-white hover:border-[#c5c6cd]'
                        }`}
                      >
                        <div className="flex justify-between items-start w-full">
                          <div className="flex-1 pr-4">
                            <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
                              opt.category === 'facility' 
                                ? 'bg-blue-50 text-blue-700' 
                                : opt.category === 'ritual' 
                                  ? 'bg-amber-50 text-amber-800' 
                                  : 'bg-[#d5e3d7] text-[#58665c]'
                            }`}>
                              {opt.category === 'facility' ? 'Fasilitas' : opt.category === 'ritual' ? 'Upacara Luhur' : 'Fasilitas Tamu'}
                            </span>
                            <h4 className="font-sans font-bold text-sm text-[#333e50] mt-1.5 leading-tight">
                              {opt.id === 'catering' ? `Catering Sajian Pelayat (${state.cateringPortions || 100} Porsi)` : opt.name}
                            </h4>
                          </div>
                          
                          <div className="text-right flex flex-col items-end pl-2">
                            <span className="font-mono text-xs md:text-sm font-bold text-[#333e50] whitespace-nowrap">{formatIDR(displayPrice)}</span>
                            <div className={`mt-2 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-[#546258] border-[#546258] text-white' : 'border-gray-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>
                        </div>

                        {/* Custom sub-inputs for specific options */}
                        {opt.id === 'memorial_hall' && isSelected && (
                          <div 
                            onClick={(e) => e.stopPropagation()} 
                            className="mt-3 p-3 bg-white border border-[#546258]/20 rounded-lg text-left"
                          >
                            <label className="block text-xs font-bold text-[#333e50] mb-1 font-sans">
                              Tanggal Mulai Sewa *
                            </label>
                            <input
                              type="date"
                              min={new Date().toISOString().split('T')[0]}
                              value={state.funeralHomeStartDate || ''}
                              onChange={(e) => setState(prev => ({ ...prev, funeralHomeStartDate: e.target.value }))}
                              className="w-full text-xs font-sans p-2 border border-gray-300 rounded-md focus:border-[#546258] focus:ring-1 focus:ring-[#546258] outline-none"
                            />
                            {formErrors.funeralHomeStartDate && (
                              <p className="text-[10px] text-red-500 mt-1 font-sans font-medium">{formErrors.funeralHomeStartDate}</p>
                            )}
                          </div>
                        )}

                        {opt.id === 'catering' && isSelected && (
                          <div 
                            onClick={(e) => e.stopPropagation()} 
                            className="mt-3 p-3 bg-white border border-[#546258]/20 rounded-lg flex items-center justify-between gap-4 text-left"
                          >
                            <label className="text-xs font-bold text-[#333e50] font-sans">
                              Porsi Catering:
                            </label>
                            <select
                              value={state.cateringPortions || 100}
                              onChange={(e) => setState(prev => ({ ...prev, cateringPortions: parseInt(e.target.value) }))}
                              className="text-xs font-sans p-1.5 border border-gray-300 rounded-md bg-white focus:border-[#546258] focus:ring-1 focus:ring-[#546258] outline-none font-semibold text-[#333e50]"
                            >
                              <option value={50}>50 Porsi</option>
                              <option value={100}>100 Porsi</option>
                              <option value={150}>150 Porsi</option>
                              <option value={200}>200 Porsi</option>
                              <option value={250}>250 Porsi</option>
                            </select>
                          </div>
                        )}

                        {/* Collapsible Detail Section for Custom Options */}
                        <div className="mt-3 pt-2.5 border-t border-[#f0edef] w-full">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleOptionExpand(opt.id, e);
                            }}
                            className="flex items-center text-xs font-semibold text-[#546258] hover:text-[#3d4a41] select-none"
                          >
                            <span>{isExpanded ? 'Sembunyikan Detail ▲' : 'Lihat Detail Layanan ▾'}</span>
                          </button>
                          
                          {isExpanded && (
                            <div className="mt-2 text-xs text-gray-600 bg-[#f4f7f5] p-3 rounded-lg border border-[#e2eae4] transition-all duration-300 leading-relaxed text-left">
                              {opt.description}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-[#f5f3f4] p-4 rounded-xl flex items-center justify-between border border-[#eae7e9] mt-6">
                  <div className="text-xs text-gray-500">
                    <span className="font-bold text-[#333e50]">Pilihan Paket:</span> {currentPackage.name} + {validSelectedOptions.length} Layanan Tambahan
                  </div>
                  <div className="font-sans text-right">
                    <span className="text-xs text-gray-400 block">Estimasi Sementara</span>
                    <span className="font-serif font-bold text-[#333e50] text-lg">{formatIDR(totalCost)}</span>
                  </div>
                </div>
              </div>
            )}


            {/* STEP 4: CLIENT & APPLICANT DATA FORM */}
            {step === 4 && (
              <div className="fade-in">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#546258] mb-1 block">Kelengkapan Administrasi</span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#333e50] mb-2 font-medium">Data Mendiang & Penanggung Jawab</h2>
                <p className="font-sans text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                  Kami memerlukan data dasar demi memperlancar koordinasi dengan instansi sipil (Dukcapil/Ambulans), duka cita, serta tim lapangan kami.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                  {/* Left Column: Deceased Information */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-base font-bold text-[#333e50] border-b border-[#eae7e9] pb-2 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#546258]" />
                      Informasi Mendiang / Almarhum
                    </h3>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Nama Lengkap Almarhum/Almarhumah *
                      </label>
                      <input
                        type="text"
                        name="deceasedName"
                        value={state.deceasedName}
                        onChange={(e) => setState(prev => ({ ...prev, deceasedName: e.target.value }))}
                        className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm transition-all focus:outline-none focus:border-[#546258] ${
                          formErrors.deceasedName ? 'border-red-500' : 'border-[#c5c6cd]'
                        }`}
                        placeholder="Contoh: Bpk. H. Ahmad Wijaya"
                      />
                      {formErrors.deceasedName && (
                        <p className="text-[10px] text-red-500 mt-1">{formErrors.deceasedName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Tanggal Wafat *
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={state.dateOfPassing}
                            onChange={(e) => setState(prev => ({ ...prev, dateOfPassing: e.target.value }))}
                            className="w-full px-4 py-2.5 bg-white border border-[#c5c6cd] rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#546258]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Adat/Keyakinan Terpilih
                        </label>
                        <input
                          type="text"
                          disabled
                          value={currentBelief.name}
                          className="w-full px-4 py-2.5 bg-[#f0edef] border border-[#c5c6cd] text-gray-500 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        Lokasi / Tempat Berpulang
                      </label>
                      <input
                        type="text"
                        value={state.locationOfPassing}
                        onChange={(e) => setState(prev => ({ ...prev, locationOfPassing: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-white border border-[#c5c6cd] rounded-lg text-sm focus:outline-none focus:border-[#546258]"
                        placeholder="Contoh: RS Medika Jakarta / Rumah Kediaman"
                      />
                    </div>

                    <div className="mt-4">
                      {state.belief === 'islamic' ? (
                        <div className="p-4 bg-[#f0edef] border border-[#c5c6cd] rounded-lg">
                          <p className="text-xs font-bold text-[#333e50]">Perlengkapan Standar Syariat</p>
                          <p className="text-xs text-gray-500 mt-1">Layanan ini sudah termasuk Set Kain Kafan Lengkap & Papan Lahat Standard.</p>
                        </div>
                      ) : state.belief === 'hindu' ? null : (
                        <>
                          <label className="block text-xs font-bold text-gray-700 mb-2">
                            Ukuran Peti Mati (Panjang x Lebar) *
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'standar', name: 'Standar', desc: '180 x 60 cm' },
                              { id: 'menengah', name: 'Menengah', desc: '190 x 65 cm' },
                              { id: 'ekstra', name: 'Ekstra', desc: '200 x 70 cm' }
                            ].map((dim) => {
                              const isDimSelected = state.coffinDimension === dim.id;
                              return (
                                <div
                                  key={dim.id}
                                  onClick={() => setState(prev => ({ ...prev, coffinDimension: dim.id as any }))}
                                  className={`cursor-pointer p-3 rounded-lg border-2 text-center transition-all ${
                                    isDimSelected
                                      ? 'border-[#546258] bg-[#d5e3d7]/20 shadow-sm'
                                      : 'border-gray-200 bg-white hover:border-gray-300'
                                  }`}
                                >
                                  <p className="text-xs font-bold text-[#333e50]">{dim.name}</p>
                                  <p className="text-[10px] text-gray-500 font-mono mt-1">{dim.desc}</p>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Applicant Information */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-base font-bold text-[#333e50] border-b border-[#eae7e9] pb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#546258]" />
                      Data Penanggung Jawab Duka
                    </h3>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Nama Lengkap Perwakilan Keluarga *
                      </label>
                      <input
                        type="text"
                        name="applicantName"
                        value={state.applicantName}
                        onChange={(e) => setState(prev => ({ ...prev, applicantName: e.target.value }))}
                        className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm transition-all focus:outline-none focus:border-[#546258] ${
                          formErrors.applicantName ? 'border-red-500' : 'border-[#c5c6cd]'
                        }`}
                        placeholder="Contoh: Ibu Rina Wijaya"
                      />
                      {formErrors.applicantName && (
                        <p className="text-[10px] text-red-500 mt-1">{formErrors.applicantName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Hubungan dengan Almarhum
                        </label>
                        <select
                          value={state.applicantRelation}
                          onChange={(e) => setState(prev => ({ ...prev, applicantRelation: e.target.value }))}
                          className="w-full px-3 py-2.5 bg-white border border-[#c5c6cd] rounded-lg text-xs md:text-sm focus:outline-none focus:border-[#546258]"
                        >
                          <option value="Suami / Istri">Suami / Istri</option>
                          <option value="Anak">Anak Kandung</option>
                          <option value="Orang Tua">Orang Tua</option>
                          <option value="Saudara">Saudara Kandung</option>
                          <option value="Kerabat">Kerabat Dekat / Teman</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Nomor Telepon Selsor aktif *
                        </label>
                        <input
                          type="tel"
                          name="applicantPhone"
                          value={state.applicantPhone}
                          onChange={(e) => setState(prev => ({ ...prev, applicantPhone: e.target.value }))}
                          className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm transition-all focus:outline-none focus:border-[#546258] ${
                            formErrors.applicantPhone ? 'border-red-500' : 'border-[#c5c6cd]'
                          }`}
                          placeholder="Contoh: 0812345678"
                        />
                        {formErrors.applicantPhone && (
                          <p className="text-[10px] text-red-500 mt-1">{formErrors.applicantPhone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Pesan Khusus / Amanat Tambahan
                      </label>
                      <textarea
                        value={state.specialRequests}
                        onChange={(e) => setState(prev => ({ ...prev, specialRequests: e.target.value }))}
                        className="w-full px-4 py-2 bg-white border border-[#c5c6cd] rounded-lg text-sm h-[75px] focus:outline-none focus:border-[#546258] resize-none"
                        placeholder="Contoh: Mohon koordinasi dengan pengurus makam keluarga di Sandiego Hills, Kavling Al-Halim."
                      />
                    </div>
                  </div>
                </div>

                {/* Interactive Cemetery Map Section */}
                <div className="mt-4 border-t border-[#eae7e9] pt-6">
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-[#333e50] flex items-center gap-2 mb-1">
                      <MapPin className="w-5 h-5 text-[#546258]" />
                      Pilih Lokasi Pemakaman (Opsional)
                    </label>
                    <p className="text-xs text-gray-500">Pilih dari daftar TPU atau area pemakaman yang tersedia di peta interaktif di bawah.</p>
                  </div>
                  
                  <React.Suspense fallback={
                    <div className="w-full h-[350px] bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                      <p className="text-sm text-gray-500 flex items-center gap-2"><MapPin className="animate-bounce" /> Memuat Peta Interaktif...</p>
                    </div>
                  }>
                    <CemeteryMap 
                      onSelectCemetery={(city, name) => setState(prev => ({ ...prev, cemeteryCity: city, cemeteryName: name }))}
                      selectedCemeteryName={state.cemeteryName}
                    />
                  </React.Suspense>
                </div>

                {/* Upload Dokumen Kematian Resmi */}
                <div className="mt-4 border-t border-[#eae7e9] pt-6" id="death-certificate-upload-area">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-bold text-[#333e50] flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#546258]" />
                      Dokumen / Surat Kematian Resmi *
                      <span className="text-xs font-normal text-red-500 font-sans">(Wajib Diunggah)</span>
                    </label>
                    <span className="text-[10px] text-gray-400 font-sans uppercase tracking-wider">PDF, JPG, PNG up to 10MB</span>
                  </div>
                  
                  {/* Drag and Drop Zone */}
                  {!state.deathCertificateFile ? (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          handleFileUpload(file);
                        }
                      }}
                      onClick={() => {
                        document.getElementById('death-cert-input')?.click();
                      }}
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
                        isDragging 
                          ? 'border-[#546258] bg-[#d5e3d7]/25 scale-[0.99]' 
                          : formErrors.deathCertificateFile 
                            ? 'border-red-400 bg-red-50/10 hover:border-red-500' 
                            : 'border-[#c5c6cd] hover:border-[#546258] bg-white'
                      }`}
                    >
                      <input
                        type="file"
                        id="death-cert-input"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file);
                          }
                        }}
                      />
                      <div className={`p-3 rounded-full mb-3 ${formErrors.deathCertificateFile ? 'bg-red-50 text-red-500' : 'bg-neutral-50 text-gray-400'}`}>
                        <Upload className="w-6 h-6 animate-pulse" />
                      </div>
                      <p className="font-sans font-bold text-xs text-[#333e50] mb-1">
                        Seret dan lepas file di sini, atau <span className="text-[#546258] underline hover:text-[#3d4a41]">Pilih File</span>
                      </p>
                      <p className="font-sans text-[11px] text-gray-500">
                        Unggah Surat Kematian dari Rumah Sakit, RT/RW, Kepolisian, atau Kelurahan setempat.
                      </p>
                      
                      {formErrors.deathCertificateFile && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-150">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.deathCertificateFile}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border border-[#546258]/35 bg-[#d5e3d7]/10 p-4 rounded-xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden pr-4">
                        <div className={`w-10 h-10 rounded-lg ${isUploading ? 'bg-gray-400' : 'bg-[#546258]'} text-white flex items-center justify-center flex-shrink-0`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-sans font-bold text-xs text-[#333e50] truncate">{state.deathCertificateFile}</p>
                          <p className={`font-sans text-[10px] ${isUploading ? 'text-gray-500' : 'text-emerald-700'} font-semibold flex items-center gap-1 mt-0.5`}>
                            {isUploading ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
                                Sedang mengunggah...
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Dokumen terunggah dengan aman
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setState(prev => ({ ...prev, deathCertificateFile: '', documentUrl: '' }));
                        }}
                        disabled={isUploading}
                        className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isUploading ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                        title="Hapus Dokumen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}


            {/* STEP 5: DETAILED PRICE TABLE - TRANSPARENT PRICING */}
            {step === 5 && (
              <div className="fade-in">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#546258] mb-1 block">Kalkulasi Final Transparan</span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#333e50] mb-2 font-medium">Rencana Program & Rincian Estimasi Biaya</h2>
                <p className="font-sans text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                  Terbuka dan transparan. Tidak ada biaya siluman atau tersembunyi. Pelayanan kami dijamin sepenuhnya sampai pusaran peristirahatan terakhir.
                </p>

                {/* Beautiful simplified summary card */}
                <div className="bg-[#fbf8fa] hover:bg-white border border-[#eae7e9] rounded-2xl p-6 md:p-8 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#546258] bg-[#d5e3d7]/30 px-3 py-1 bg-opacity-40 rounded-full">Paket yang Dipilih</span>
                    <h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#333e50] mt-2">
                      {currentPackage.name}
                    </h3>
                    <p className="text-xs text-gray-500">{currentPackage.tagline}</p>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#546258] inline-block" />
                      Layanan duka: <strong className="text-gray-700 font-semibold">{currentBelief.name}</strong>
                    </p>
                    {validSelectedOptions.length > 0 && (
                      <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#546258] inline-block" />
                        Layanan tambahan: <strong className="text-gray-700 font-semibold">{validSelectedOptions.length} Layanan Terpilih</strong>
                      </p>
                    )}
                  </div>
                  <div className="md:text-right border-t md:border-t-0 border-[#f0edef] pt-4 md:pt-0 space-y-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest block">Total Estimasi Akhir</span>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#ba1a1a] tracking-tight">
                      {formatIDR(totalCost)}
                    </h2>
                    <span className="text-[10px] text-gray-400 block font-sans">Semua biaya net, transparan, tanpa pungutan tambahan</span>
                  </div>
                </div>

                {/* Granular Price Line-Items Dropdown */}
                <div className="border border-[#eae7e9] rounded-xl overflow-hidden mb-6 bg-white shadow-sm transition-all duration-350">
                  <button
                    type="button"
                    onClick={() => setShowGranularPrices(!showGranularPrices)}
                    className="w-full px-6 py-4 text-left font-sans font-bold text-xs md:text-sm text-[#333e50] flex justify-between items-center hover:bg-[#fbf8fa] transition-colors gap-3"
                  >
                    <span>{showGranularPrices ? 'Sembunyikan Rincian Biaya Granular' : 'Lihat Rincian Biaya Granular'}</span>
                    <span className="text-xs transform transition-transform duration-200">
                      {showGranularPrices ? '▲' : '▼'}
                    </span>
                  </button>

                  {showGranularPrices && (
                    <div className="border-t border-[#f0edef] overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-neutral-50 border-b border-[#eae7e9]">
                            <th className="px-6 py-3 font-sans text-[11px] uppercase tracking-wider font-bold text-gray-500">Komponen Layanan</th>
                            <th className="px-6 py-3 font-sans text-[11px] uppercase tracking-wider font-bold text-gray-500">Kategori</th>
                            <th className="px-6 py-3 font-sans text-[11px] uppercase tracking-wider font-bold text-gray-500 text-right">Biaya (IDR)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eae7e9]">
                          {/* Base Package Line */}
                          <tr className="hover:bg-neutral-50 transition-colors">
                            <td className="px-6 py-4">
                              <h5 className="font-sans font-bold text-xs text-[#333e50]">{currentPackage.name}</h5>
                              <p className="text-[10px] text-gray-500 mt-0.5">{currentPackage.tagline}</p>
                              <p className="text-[10px] text-[#546258] font-semibold mt-1">✓ Termasuk Protokol {currentBelief.name}</p>
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
                                name = `Catering Sajian Pelayat (${state.cateringPortions || 100} Porsi)`;
                                price = (opt.price / 100) * (state.cateringPortions || 100);
                              } else if (opt.id === 'memorial_hall') {
                                name = `Sewa Rumah Duka Premium (Mulai: ${state.funeralHomeStartDate ? new Date(state.funeralHomeStartDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Segera'})`;
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

                {/* Confirmation checklist */}
                <div className="bg-[#f0edef] p-5 rounded-xl border border-[#eae7e9] grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-gray-500 mb-2">Penanggung Jawab Kontrak</h4>
                    <p className="font-sans font-bold text-sm text-[#333e50]">{state.applicantName} ({state.applicantRelation})</p>
                    <p className="font-sans text-xs text-gray-600 mt-1">Telp: <span className="font-mono">{state.applicantPhone}</span></p>
                    {state.locationOfPassing && (
                      <p className="font-sans text-xs text-gray-500 mt-0.5">Lokasi Berpulang: {state.locationOfPassing}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-gray-500 mb-2">Almarhum / Mendiang</h4>
                    <p className="font-sans font-bold text-sm text-[#333e50]">{state.deceasedName}</p>
                    <p className="font-sans text-xs text-gray-600 mt-1">Layanan Duka: <span className="text-[#546258] font-bold">{currentBelief.name}</span></p>
                    <p className="font-sans text-xs text-gray-500">Tanggal Wafat: {state.dateOfPassing}</p>
                    {state.belief === 'islamic' ? (
                      <p className="font-sans text-xs text-gray-600 mt-1">
                        Perlengkapan: <span className="font-bold text-[#3d4a41]">Set Kain Kafan & Papan Lahat Standard</span>
                      </p>
                    ) : state.belief === 'hindu' ? null : (
                      <p className="font-sans text-xs text-gray-600 mt-1">
                        Ukuran Peti Mati: <span className="font-bold text-[#3d4a41] capitalize">{state.coffinDimension}</span> ({state.coffinDimension === 'standar' ? '180 x 60 cm' : state.coffinDimension === 'menengah' ? '190 x 65 cm' : '200 x 70 cm'})
                      </p>
                    )}
                    {state.deathCertificateFile && (
                      <p className="font-sans text-xs text-[#546258] mt-1.5 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        Dokumen Resmi: <span className="text-[#333e50] font-semibold underline truncate max-w-[200px]" title={state.deathCertificateFile}>{state.deathCertificateFile}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {authError && (
            <div className="bg-[#fff5f5] border border-[#ffe0e0] text-[#ba1a1a] p-4 rounded-xl mt-6 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">{authError}</p>
            </div>
          )}

          {/* Stepper Buttons (Standard large touch target 48px vertical) */}
          <div className="flex justify-between items-center border-t border-[#eae7e9] pt-6 mt-8">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all h-[48px] ${
                step === 1 
                  ? 'text-gray-300 cursor-not-allowed bg-transparent' 
                  : 'text-[#333e50] hover:bg-[#f0edef] bg-white border border-[#eae7e9]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali
            </button>

            {step < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-[#333e50] hover:bg-[#4a5568] text-white rounded-lg text-sm font-semibold transition-all h-[48px]"
              >
                Lanjutkan
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitFinal}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-[#546258] hover:bg-[#3d4a41] text-white rounded-lg text-sm font-semibold transition-all h-[48px] disabled:opacity-55"
              >
                {isSubmitting ? 'Menyimpan Paket...' : 'Konfirmasi Layanan & Rencana duka'}
                <Check className="w-4 h-4 stroke-[3px]" />
              </button>
            )}
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
