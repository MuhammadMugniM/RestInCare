import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { BELIEFS, PACKAGES, CUSTOM_OPTIONS } from "../types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Clock, CheckCircle, FileText, ChevronLeft, LogOut } from 'lucide-react';

import { onAuthStateChanged, signOut } from 'firebase/auth';

interface Inquiry {
  id: string;
  createdAt: string;
  deceasedName: string;
  totalCost: number;
  packageId: string;
  statusPesanan?: string;
  belief?: string;
  selectedOptions?: string[];
  applicantName?: string;
  applicantPhone?: string;
  dateOfPassing?: string;
  locationOfPassing?: string;
  coffinDimension?: string;
}

export default function OrderHistory({ onBack }: { onBack: () => void }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = undefined;
      }

      if (!user) {
        setInquiries([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const q = query(
          collection(db, 'inquiries'),
          where('userId', '==', user.uid)
        );
        
        unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
          const fetched = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Inquiry[];
          
          // Manual sort to avoid index requirements initially
          fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          setInquiries([...fetched]);
          setLoading(false);
        }, (err) => {
          console.error("Error fetching history realtime:", err);
          setLoading(false);
        });

      } catch (err) {
        console.error("Error setting up history snapshot:", err);
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      unsubscribeAuth();
    };
  }, []);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (isoStr: string) => {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(isoStr));
    } catch {
      return isoStr;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onBack(); // go back to main screen after logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Kembali
          </button>
          <h1 className="font-serif text-3xl md:text-4xl text-[#333e50]">Riwayat Pesanan</h1>
          <p className="text-gray-500 mt-2 font-sans">Daftar layanan kedukaan yang telah Anda simpan.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#546258] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#eae7e9] p-12 text-center shadow-sm">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-800 mb-2">Belum ada riwayat pesanan</h3>
          <p className="text-gray-500">Anda belum menyimpan atau menyelesaikan pemesanan paket apapun.</p>
          <button 
            onClick={onBack}
            className="mt-6 bg-[#546258] text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-[#3f4a42] transition-colors"
          >
            Mulai Perencanaan
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {inquiries.map((inquiry) => {
            const beliefConfig = BELIEFS.find(b => b.id === inquiry.belief) || BELIEFS[0];
            const packageConfig = PACKAGES.find(p => p.id === inquiry.packageId) || PACKAGES[1];
            const isExpanded = expandedInquiry === inquiry.id;

            return (
              <div key={inquiry.id} className="bg-white rounded-2xl border border-[#eae7e9] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center ${
                        inquiry.statusPesanan === 'Menunggu Konfirmasi' 
                          ? 'bg-[#fff5e6] text-[#b37400]' 
                          : inquiry.statusPesanan === 'Terselesaikan'
                          ? 'bg-[#f0f4f8] text-[#475569]'
                          : 'bg-[#e9f2eb] text-[#3f4a42]'
                      }`}>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {inquiry.statusPesanan || 'Selesai'}
                      </span>
                      <span className="text-gray-400 text-xs flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(inquiry.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Almarhum/ah: {inquiry.deceasedName || '-'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Paket: <span className="font-semibold">{packageConfig.name}</span>
                    </p>
                  </div>

                  <div className="md:text-right flex flex-col items-start md:items-end">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Total Biaya Estimasi</p>
                      <p className="text-xl font-bold text-[#546258]">
                        {formatIDR(inquiry.totalCost)}
                      </p>
                    </div>
                    <button 
                      onClick={() => setExpandedInquiry(isExpanded ? null : inquiry.id)}
                      className="mt-3 flex items-center gap-1 text-sm font-semibold text-[#546258] hover:text-[#3d4a41] transition-colors"
                    >
                      {isExpanded ? 'Sembunyikan Detail' : 'Detail Selengkapnya'}
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Details Accordion */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-[#eae7e9] animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Left side details */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Informasi Layanan</p>
                          <div className="bg-[#fcfcfc] rounded-lg border border-[#f0edef] p-4 space-y-3">
                            <div>
                              <p className="text-xs text-gray-500">Ritual Keagamaan</p>
                              <p className="text-sm font-semibold text-gray-800">{beliefConfig.name}</p>
                            </div>
                            {inquiry.dateOfPassing && (
                              <div>
                                <p className="text-xs text-gray-500">Tanggal Wafat</p>
                                <p className="text-sm font-medium text-gray-800">{inquiry.dateOfPassing}</p>
                              </div>
                            )}
                            {inquiry.locationOfPassing && (
                              <div>
                                <p className="text-xs text-gray-500">Lokasi Berpulang</p>
                                <p className="text-sm font-medium text-gray-800">{inquiry.locationOfPassing}</p>
                              </div>
                            )}
                            {inquiry.coffinDimension && inquiry.belief !== 'islamic' && (
                              <div>
                                <p className="text-xs text-gray-500">Ukuran Peti</p>
                                <p className="text-sm font-medium text-gray-800 capitalize">{inquiry.coffinDimension}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right side details */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Kontak Penanggung Jawab</p>
                          <div className="bg-[#fcfcfc] rounded-lg border border-[#f0edef] p-4 space-y-3">
                            <div>
                              <p className="text-xs text-gray-500">Nama</p>
                              <p className="text-sm font-medium text-gray-800">{inquiry.applicantName || '-'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Nomor Telepon</p>
                              <p className="text-sm font-medium text-gray-800">{inquiry.applicantPhone || '-'}</p>
                            </div>
                          </div>
                        </div>

                        {inquiry.selectedOptions && inquiry.selectedOptions.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1 mt-2">Layanan Tambahan Terpilih</p>
                            <ul className="list-disc pl-4 space-y-1">
                              {inquiry.selectedOptions.map(optId => {
                                const optConfig = CUSTOM_OPTIONS.find(o => o.id === optId);
                                return optConfig ? (
                                  <li key={optId} className="text-sm text-gray-700">{optConfig.name}</li>
                                ) : null;
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
