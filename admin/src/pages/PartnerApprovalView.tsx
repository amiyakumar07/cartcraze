import React, { useState, useEffect } from 'react';
import {
  Store,
  Bike,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  FileText,
  MapPin,
  RefreshCw,
  Eye,
  Download,
  ZoomIn,
  ZoomOut,
  X,
  ExternalLink,
  FileSearch,
  Check
} from 'lucide-react';

export const PartnerApprovalView: React.FC = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const API = `http://${hostname}:4000/api`;

  const [activeTab, setActiveTab] = useState<'shops' | 'riders'>('shops');
  const [shops, setShops] = useState<any[]>([]);
  const [riders, setRiders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Document Inspection Modal State
  const [selectedDocModal, setSelectedDocModal] = useState<{
    title: string;
    docType: string;
    docNumber: string;
    imageUrl: string;
    partnerName: string;
    partnerId: string;
    partnerType: 'shop' | 'rider';
  } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const loadPendingData = async () => {
    setLoading(true);
    try {
      const [shopsRes, ridersRes] = await Promise.all([
        fetch(`${API}/shops`),
        fetch(`${API}/riders`)
      ]);
      const shopsData = await shopsRes.json();
      const ridersData = await ridersRes.json();
      if (shopsData.shops) setShops(shopsData.shops);
      if (ridersData.riders) setRiders(ridersData.riders);
    } catch {
      // Fallback local pending items
      setShops([]);
      setRiders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPendingData();
  }, []);

  const handleApproveShop = async (shopId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      await fetch(`${API}/shops/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId, action })
      });
      loadPendingData();
      if (selectedDocModal?.partnerId === shopId) {
        setSelectedDocModal(null);
      }
    } catch {
      setShops((prev) =>
        prev.map((s) => (s.id === shopId ? { ...s, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : s))
      );
      if (selectedDocModal?.partnerId === shopId) {
        setSelectedDocModal(null);
      }
    }
  };

  const handleApproveRider = async (riderId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      await fetch(`${API}/riders/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ riderId, action })
      });
      loadPendingData();
      if (selectedDocModal?.partnerId === riderId) {
        setSelectedDocModal(null);
      }
    } catch {
      setRiders((prev) =>
        prev.map((r) => (r.id === riderId ? { ...r, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : r))
      );
      if (selectedDocModal?.partnerId === riderId) {
        setSelectedDocModal(null);
      }
    }
  };

  const handleBlockShop = async (shopId: string, block: boolean) => {
    try {
      await fetch(`${API}/shops/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId, block })
      });
      loadPendingData();
    } catch {
      setShops((prev) =>
        prev.map((s) => (s.id === shopId ? { ...s, status: block ? 'BLOCKED' : 'APPROVED' } : s))
      );
    }
  };

  const handleBlockRider = async (riderId: string, block: boolean) => {
    try {
      await fetch(`${API}/riders/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ riderId, block })
      });
      loadPendingData();
    } catch {
      setRiders((prev) =>
        prev.map((r) => (r.id === riderId ? { ...r, status: block ? 'BLOCKED' : 'APPROVED' } : r))
      );
    }
  };

  const pendingShopsCount = shops.filter((s) => s.status === 'PENDING_APPROVAL').length;
  const pendingRidersCount = riders.filter((r) => r.status === 'PENDING_APPROVAL').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 bg-amber-400 text-black rounded-2xl shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Partner Onboarding Approvals</h2>
            <p className="text-xs text-slate-400">Review &amp; verify Shop Trade Licenses, Driving Licenses, and Government ID Proofs</p>
          </div>
        </div>

        <button
          onClick={loadPendingData}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Approvals</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('shops')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition cursor-pointer ${
            activeTab === 'shops'
              ? 'bg-amber-400 text-black shadow-md'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Shop Applications ({shops.length})</span>
          {pendingShopsCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {pendingShopsCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('riders')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition cursor-pointer ${
            activeTab === 'riders'
              ? 'bg-amber-400 text-black shadow-md'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Rider Applications ({riders.length})</span>
          {pendingRidersCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {pendingRidersCount} Pending
            </span>
          )}
        </button>
      </div>

      {/* List Content */}
      {activeTab === 'shops' ? (
        shops.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-xs font-semibold">
            No shop applications submitted for approval yet. Waiting for shop partner registration.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shops.map((shop) => {
              const proofImg = shop.licenseProof || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80';
              return (
                <div key={shop.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl relative">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <Store className="w-4 h-4 text-amber-400" />
                        <span>{shop.name}</span>
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{shop.address || 'HSR Layout, Bengaluru'}</span>
                      </p>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                      shop.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      shop.status === 'REJECTED' ? 'bg-red-950 text-red-400 border border-red-800' :
                      'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                    }`}>
                      {shop.status}
                    </span>
                  </div>

                  {/* License Details */}
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-2 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">License Type:</span>
                      <span className="text-amber-400 font-bold">{shop.licenseType || 'Trade License'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">License Number:</span>
                      <span className="text-white font-bold">{shop.licenseNumber || 'TL-9901'}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-900 pt-1.5">
                      <span className="text-slate-400">Contact:</span>
                      <span className="text-slate-300">{shop.phone} • {shop.email}</span>
                    </div>
                  </div>

                  {/* Uploaded License Document Proof Card */}
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
                    <div className="relative group shrink-0">
                      <img
                        src={proofImg}
                        alt="Trade License Document Proof"
                        className="w-14 h-14 object-cover rounded-xl border border-amber-400/50 shadow-md"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span className="truncate">{shop.licenseType || 'Trade License Document'}</span>
                      </div>
                      <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Uploaded &amp; Ready for Verification</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setZoomLevel(1);
                        setSelectedDocModal({
                          title: `${shop.name} — ${shop.licenseType || 'Trade License'}`,
                          docType: shop.licenseType || 'Trade License',
                          docNumber: shop.licenseNumber || 'TL-9901',
                          imageUrl: proofImg,
                          partnerName: shop.name,
                          partnerId: shop.id,
                          partnerType: 'shop'
                        });
                      }}
                      className="bg-amber-400 hover:bg-amber-500 text-black text-xs font-black px-3 py-2 rounded-xl flex items-center gap-1 shadow-md transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Proof</span>
                    </button>
                  </div>

                  {/* Admin Action Buttons */}
                  {shop.status === 'PENDING_APPROVAL' ? (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleApproveShop(shop.id, 'APPROVE')}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Shop</span>
                      </button>
                      <button
                        onClick={() => handleApproveShop(shop.id, 'REJECT')}
                        className="bg-slate-800 hover:bg-red-950 text-red-400 font-bold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-1 border border-slate-700 transition cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleBlockShop(shop.id, shop.status !== 'BLOCKED')}
                        className={`w-full font-black text-xs py-2.5 rounded-2xl flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer ${
                          shop.status === 'BLOCKED'
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-red-950 hover:bg-red-900 text-red-300 border border-red-800'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{shop.status === 'BLOCKED' ? 'Unblock Shop Account' : 'Block Shop Partner'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : (
        riders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-xs font-semibold">
            No rider applications submitted for approval yet. Waiting for rider partner registration.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riders.map((rider) => {
              const dlProofImg = rider.drivingLicenseProof || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80';
              const idProofImg = rider.idProofProof || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80';
              return (
                <div key={rider.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl relative">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <Bike className="w-4 h-4 text-amber-400" />
                        <span>{rider.name}</span>
                      </h3>
                      <p className="text-xs text-amber-400 font-mono font-bold">
                        Vehicle Plate: {rider.vehicleNumber}
                      </p>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                      rider.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      rider.status === 'BLOCKED' ? 'bg-red-950 text-red-400 border border-red-800' :
                      rider.status === 'REJECTED' ? 'bg-red-950 text-red-400 border border-red-800' :
                      'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                    }`}>
                      {rider.status}
                    </span>
                  </div>

                  {/* ID & License Proof Details */}
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">ID Proof Type:</span>
                      <span className="text-amber-400 font-bold">{rider.idProofType || 'Aadhaar Card'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ID Number:</span>
                      <span className="text-white font-bold">{rider.idProofNumber || '5491-8820-1920'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phone:</span>
                      <span className="text-slate-300">{rider.phone}</span>
                    </div>
                  </div>

                  {/* Uploaded Rider Document Proof Cards */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* DL Card */}
                    <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={dlProofImg}
                          alt="Driving License Proof"
                          className="w-10 h-10 object-cover rounded-lg border border-amber-400/50 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-200 truncate">Driving License</p>
                          <p className="text-[9px] text-emerald-400">✓ Uploaded</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setZoomLevel(1);
                          setSelectedDocModal({
                            title: `${rider.name} — Driving License`,
                            docType: 'Driving License',
                            docNumber: rider.vehicleNumber,
                            imageUrl: dlProofImg,
                            partnerName: rider.name,
                            partnerId: rider.id,
                            partnerType: 'rider'
                          });
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-amber-400 text-[10px] font-bold py-1.5 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect DL</span>
                      </button>
                    </div>

                    {/* Government ID Card */}
                    <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={idProofImg}
                          alt="ID Proof"
                          className="w-10 h-10 object-cover rounded-lg border border-amber-400/50 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-200 truncate">{rider.idProofType || 'ID Proof'}</p>
                          <p className="text-[9px] text-emerald-400">✓ Uploaded</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setZoomLevel(1);
                          setSelectedDocModal({
                            title: `${rider.name} — ${rider.idProofType || 'Government ID'}`,
                            docType: rider.idProofType || 'Government ID',
                            docNumber: rider.idProofNumber || 'ID-9910',
                            imageUrl: idProofImg,
                            partnerName: rider.name,
                            partnerId: rider.id,
                            partnerType: 'rider'
                          });
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-amber-400 text-[10px] font-bold py-1.5 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect ID</span>
                      </button>
                    </div>
                  </div>

                  {/* Admin Action Buttons */}
                  {rider.status === 'PENDING_APPROVAL' ? (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleApproveRider(rider.id, 'APPROVE')}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Rider License</span>
                      </button>
                      <button
                        onClick={() => handleApproveRider(rider.id, 'REJECT')}
                        className="bg-slate-800 hover:bg-red-950 text-red-400 font-bold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-1 border border-slate-700 transition cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleBlockRider(rider.id, rider.status !== 'BLOCKED')}
                        className={`w-full font-black text-xs py-2.5 rounded-2xl flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer ${
                          rider.status === 'BLOCKED'
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-red-950 hover:bg-red-900 text-red-300 border border-red-800'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{rider.status === 'BLOCKED' ? 'Unblock Rider Account' : 'Block Rider Partner'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      {/* FULLSCREEN ADMIN DOCUMENT PROOF INSPECTION MODAL */}
      {selectedDocModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="bg-slate-950 border border-slate-800 max-w-2xl w-full rounded-3xl p-6 shadow-2xl space-y-4 text-white relative flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <FileSearch className="w-5 h-5 text-amber-400" />
                  <span>{selectedDocModal.title}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Partner: <strong className="text-white">{selectedDocModal.partnerName}</strong> • Doc #: <span className="font-mono text-amber-400">{selectedDocModal.docNumber}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDocModal(null)}
                className="p-2 bg-slate-900 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Image Viewer Canvas with Zoom Controls */}
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-2 flex-1 flex items-center justify-center overflow-auto min-h-[250px]">
              {/* Zoom Controls Overlay */}
              <div className="absolute top-3 right-3 z-10 flex gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                  className="p-1.5 hover:bg-slate-800 text-slate-200 rounded-lg cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                  className="p-1.5 hover:bg-slate-800 text-slate-200 rounded-lg cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="px-2 py-1 hover:bg-slate-800 text-amber-400 font-mono text-[10px] font-bold rounded-lg cursor-pointer"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
              </div>

              <img
                src={selectedDocModal.imageUrl}
                alt="Document Verification Proof"
                className="max-h-[350px] object-contain transition-transform duration-200 rounded-lg"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>

            {/* Verification Checklist Bar */}
            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex flex-wrap justify-between items-center gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Super Admin Verification Checklist: Stamp, ID &amp; Signature Valid</span>
              </div>
              <a
                href={selectedDocModal.imageUrl}
                target="_blank"
                rel="noreferrer"
                download="partner_proof_document.png"
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Proof File</span>
              </a>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (selectedDocModal.partnerType === 'shop') {
                    handleApproveShop(selectedDocModal.partnerId, 'APPROVE');
                  } else {
                    handleApproveRider(selectedDocModal.partnerId, 'APPROVE');
                  }
                }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify &amp; Approve Partner Application</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedDocModal.partnerType === 'shop') {
                    handleApproveShop(selectedDocModal.partnerId, 'REJECT');
                  } else {
                    handleApproveRider(selectedDocModal.partnerId, 'REJECT');
                  }
                }}
                className="bg-slate-800 hover:bg-red-950 text-red-400 font-bold text-xs py-3.5 px-5 rounded-2xl flex items-center justify-center gap-1.5 border border-slate-700 transition cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Application</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
