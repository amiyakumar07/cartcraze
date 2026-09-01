import React, { useState } from 'react';
import { X, ShieldCheck, Clock, AlertTriangle, FileText, Upload, CheckCircle2, Eye } from 'lucide-react';

interface DocumentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  riderData: any;
}

interface DocItem {
  id: string;
  title: string;
  docNumber: string;
  status: 'VERIFIED' | 'PENDING' | 'ACTION_REQUIRED';
  expiryDate: string;
  fileUrl?: string;
}

export const DocumentManagerModal: React.FC<DocumentManagerModalProps> = ({
  isOpen,
  onClose,
  riderData
}) => {
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const docs: DocItem[] = [
    {
      id: 'dl',
      title: 'Driving License (DL)',
      docNumber: riderData?.licenseNumber || 'DL-8902148902',
      status: 'VERIFIED',
      expiryDate: '2028-12-31',
      fileUrl: riderData?.drivingLicenseProof || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'rc',
      title: 'Vehicle RC (Registration Certificate)',
      docNumber: riderData?.vehicleNumber ? `RC-${riderData.vehicleNumber}` : 'KA-05-EV-4092',
      status: 'VERIFIED',
      expiryDate: '2030-05-15',
      fileUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'id',
      title: `${riderData?.idProofType || 'Aadhaar Card'}`,
      docNumber: riderData?.idProofNumber || 'XXXX-XXXX-4890',
      status: 'VERIFIED',
      expiryDate: 'Lifetime Valid',
      fileUrl: riderData?.idProofProof || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'ins',
      title: 'Vehicle Insurance Policy',
      docNumber: 'INS-BLR-2026-904',
      status: 'VERIFIED',
      expiryDate: '2027-08-20',
      fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 font-sans text-white relative max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Rider Compliance Documents</h3>
              <p className="text-[10px] text-slate-400 font-medium">Verified by CartCraze Partner Operations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Overview Badge */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 p-3.5 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <span className="text-xs font-black text-white block">Full Active Partner Status</span>
            <span className="text-[10px] text-slate-400">All 4 mandatory delivery partner documents are active &amp; verified.</span>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          {docs.map((doc) => (
            <div key={doc.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-extrabold text-white">{doc.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{doc.docNumber}</span>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {doc.status}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-700/40 text-[10px]">
                <span className="text-slate-400">Valid until: <strong className="text-slate-200">{doc.expiryDate}</strong></span>
                {doc.fileUrl && (
                  <button
                    onClick={() => setSelectedPreview(doc.fileUrl || null)}
                    className="text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Document</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Document Preview Modal */}
        {selectedPreview && (
          <div className="fixed inset-0 z-60 bg-black/90 flex flex-col justify-center items-center p-4">
            <div className="relative max-w-sm w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-3 space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-black text-white">Document Verification Image</span>
                <button onClick={() => setSelectedPreview(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <img src={selectedPreview} alt="Document Proof" className="w-full h-64 object-cover rounded-2xl border border-slate-800" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
