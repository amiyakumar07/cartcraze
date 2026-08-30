import React from 'react';
import type { RiderProfile, AppTab } from '../App';
import type { RiderOrder, DutyStatus } from '../types';
import { SwipeToConfirm } from '../components/SwipeToConfirm';

interface Props {
  riderProfile: RiderProfile;
  dutyStatus: DutyStatus;
  setDutyStatus: (s: DutyStatus) => void;
  apiError: boolean;
  setActiveTab: (tab: AppTab) => void;
  activeOrder: RiderOrder | null;
  setActiveOrder: (o: RiderOrder) => void;
}

export const HomeScreen: React.FC<Props> = ({
  riderProfile,
  dutyStatus,
  setDutyStatus,
  setActiveTab,
  activeOrder,
  setActiveOrder,
}) => {
  const isOnDuty = dutyStatus === 'ON_DUTY';

  return (
    <>
      {/* Fonts & Icons */}
      <link
        href="https://fonts.googleapis.com"
        rel="preconnect"
      />
      <link
        href="https://fonts.gstatic.com"
        rel="preconnect"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap"
        rel="stylesheet"
      />

      <style>{`
        :root {
          --surface-container-lowest: #ffffff;
          --secondary: #5e5e5e;
          --surface-variant: #e1e3e4;
          --primary-fixed-dim: #f5bf00;
          --surface-container: #edeeef;
          --tertiary: #006d37;
          --primary: #765b00;
          --on-surface-variant: #4f4632;
          --surface-container-low: #f3f4f5;
          --background: #f8f9fa;
          --surface: #f8f9fa;
          --on-background: #191c1d;
          --on-surface: #191c1d;
          --primary-container: #ffc700;
          --on-primary-container: #6e5400;
          --outline-variant: #d2c5ab;
        }

        .dashboard-canvas {
          min-height: 100%;
          display: flex;
          flex-direction: column;
          background: var(--background);
          color: var(--on-background);
          font-family: "Inter", sans-serif;
          padding-bottom: 24px;
        }

        .top-header-bar {
          position: sticky;
          top: 0;
          z-index: 30;
          height: 60px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--surface-container);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 18px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
        }

        .brand-title-text {
          margin: 0;
          color: var(--primary);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .darkstore-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          background: var(--surface-container-low);
          border: 1px solid var(--outline-variant);
          border-radius: 9999px;
          color: var(--on-surface-variant);
        }

        .profile-avatar-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #191c1d;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 2px solid var(--surface-container-high);
        }

        .dashboard-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .earnings-row-card {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background: #ffffff;
          padding: 16px;
          border-radius: 20px;
          border: 1px solid var(--surface-container);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        }

        .earnings-label-text {
          margin: 0;
          color: var(--secondary);
          font-size: 13px;
          font-weight: 600;
        }

        .earnings-num-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-top: 4px;
        }

        .earnings-num {
          color: var(--on-surface);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .growth-badge {
          color: var(--tertiary);
          background: rgba(106, 231, 146, 0.25);
          padding: 3px 8px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 2px;
        }

        /* Toggle Switch */
        .toggle-switch-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .toggle-switch {
          position: relative;
          width: 52px;
          height: 30px;
          background: var(--surface-container-highest);
          border-radius: 9999px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .toggle-switch-on {
          background: var(--primary-container);
        }

        .toggle-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 24px;
          height: 24px;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease;
        }

        .toggle-knob-on {
          transform: translateX(22px);
        }

        .status-caption {
          font-size: 12px;
          font-weight: 700;
          color: var(--on-surface);
        }

        /* Order Section */
        .order-card-wrapper {
          position: relative;
        }

        .ambient-order-glow {
          position: absolute;
          inset: -10px;
          background: radial-gradient(circle, rgba(255, 199, 0, 0.25) 0%, rgba(255, 255, 255, 0) 70%);
          border-radius: 30px;
          pointer-events: none;
        }

        .glass-order-card {
          position: relative;
          z-index: 10;
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid rgba(225, 227, 228, 0.9);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .order-card-header {
          padding: 14px 16px;
          background: rgba(255, 249, 230, 0.6);
          border-bottom: 1px solid var(--surface-container);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .express-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #765b00;
        }

        .order-payout-text {
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #191c1d;
        }

        /* Map Canvas */
        .vector-map-frame {
          position: relative;
          width: 100%;
          height: 140px;
          background: #cfe0de;
          overflow: hidden;
        }

        .route-stops-list {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .route-stop-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .stop-dot-darkstore {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #191c1d;
          margin-top: 4px;
        }

        .stop-line-connector {
          width: 2px;
          height: 28px;
          background: #e1e3e4;
          margin: 4px 0 4px 5px;
        }

        .stop-dot-customer {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 3px solid #ffc700;
          background: #ffffff;
          margin-top: 4px;
        }

        .stop-label {
          font-size: 11px;
          font-weight: 700;
          color: #646464;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .stop-name {
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 16px;
          font-weight: 800;
          color: #191c1d;
          margin-top: 2px;
        }

        .stop-address {
          font-size: 13px;
          color: #646464;
          margin-top: 1px;
        }

        .accept-btn-cta {
          width: 100%;
          min-height: 52px;
          border-radius: 9999px;
          border: none;
          background: #ffc700;
          color: #251a00;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 16px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(255, 199, 0, 0.3);
          transition: all 0.2s ease;
          margin-top: 8px;
        }

        .accept-btn-cta:hover {
          background: #f5bf00;
        }

        .accept-btn-cta:active {
          transform: scale(0.98);
        }

        .offline-placeholder-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 32px 20px;
          text-align: center;
          border: 1px solid var(--surface-container);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .offline-icon {
          font-size: 40px;
        }

        .offline-title {
          margin: 0;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #191c1d;
        }

        .offline-desc {
          margin: 0;
          font-size: 13px;
          color: #646464;
          line-height: 1.5;
          max-width: 280px;
        }

        .go-online-btn {
          margin-top: 4px;
          padding: 12px 24px;
          border-radius: 9999px;
          border: none;
          background: #ffc700;
          color: #251a00;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(255, 199, 0, 0.25);
        }

        .stats-two-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .stat-box-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 16px;
          border: 1px solid var(--surface-container);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 104px;
        }

        .stat-box-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #646464;
          font-size: 13px;
          font-weight: 600;
        }

        .stat-box-num {
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #191c1d;
          margin: 0;
        }

        .stat-box-unit {
          font-size: 13px;
          font-weight: 600;
          color: #646464;
        }
      `}</style>

      <div className="dashboard-canvas">
        {/* Sticky Header */}
        <header className="top-header-bar">
          <h1 className="brand-title-text">CartCraze</h1>
          <span className="darkstore-pill">DS-14-HSR</span>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className="profile-avatar-btn"
          >
            AM
          </button>
        </header>

        <div className="dashboard-body">
          {/* Today's Earnings & Online Toggle */}
          <section className="earnings-row-card">
            <div
              onClick={() => setActiveTab('earnings')}
              className="cursor-pointer group"
              title="View Earnings Details"
            >
              <p className="earnings-label-text group-hover:text-amber-800 transition">Today's Earnings &rsaquo;</p>
              <div className="earnings-num-row">
                <span className="earnings-num">
                  ₹{riderProfile.todayEarnings.toLocaleString()}
                </span>
                <span className="growth-badge">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    trending_up
                  </span>
                  +12%
                </span>
              </div>
            </div>

            <div className="toggle-switch-wrapper">
              <div
                onClick={() => setDutyStatus(isOnDuty ? 'OFF_DUTY' : 'ON_DUTY')}
                className={`toggle-switch ${isOnDuty ? 'toggle-switch-on' : ''}`}
              >
                <div className={`toggle-knob ${isOnDuty ? 'toggle-knob-on' : ''}`} />
              </div>
              <span className="status-caption">
                {isOnDuty ? 'Online' : 'Offline'}
              </span>
            </div>
          </section>

          {/* Active / New Order Card */}
          {isOnDuty ? (
            activeOrder ? (
              <section className="order-card-wrapper animate-fade-in">
                <div className="ambient-order-glow" />

                <div className="glass-order-card">
                  {/* Header */}
                  <div className="order-card-header">
                    <div className="express-badge">
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#ffc700' }}>
                        bolt
                      </span>
                      <span>Express Order &bull; {activeOrder.estimatedTime || '9 mins'}</span>
                    </div>
                    <span className="order-payout-text">₹{activeOrder.payoutAmount || 85}.00</span>
                  </div>

                  {/* Route Details */}
                  <div className="route-stops-list">
                    {/* Pickup */}
                    <div className="route-stop-item">
                      <div>
                        <div className="stop-dot-darkstore" />
                        <div className="stop-line-connector" />
                      </div>
                      <div>
                        <div className="stop-label">PICKUP DARKSTORE</div>
                        <div className="stop-name">{activeOrder.restaurantName || 'Fresh Valley Market'}</div>
                        <div className="stop-address">{activeOrder.restaurantAddress || 'Sector 1, HSR Layout, Bengaluru'}</div>
                      </div>
                    </div>

                    {/* Dropoff */}
                    <div className="route-stop-item">
                      <div>
                        <div className="stop-dot-customer" />
                      </div>
                      <div className="flex-1">
                        <div className="stop-label">CUSTOMER DROPOFF</div>
                        <div className="stop-name font-bold text-gray-900">{activeOrder.customerName} • {activeOrder.customerPhone}</div>
                        <div className="stop-address text-gray-600 font-medium">{activeOrder.deliveryAddress}</div>
                        {activeOrder.customerLat && activeOrder.customerLon && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${activeOrder.customerLat},${activeOrder.customerLon}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-2.5 py-1 rounded-lg shadow-xs mt-1 transition cursor-pointer"
                          >
                            <span>🧭 Navigate on Map ({activeOrder.customerLat.toFixed(3)}, {activeOrder.customerLon.toFixed(3)})</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Items preview */}
                    <div className="bg-slate-100 p-3 rounded-2xl text-xs space-y-1 my-2">
                      <div className="font-bold text-gray-800 flex justify-between">
                        <span>Items ({activeOrder.itemsCount || 3} items)</span>
                        <span className="text-emerald-700 font-extrabold">Paid (UPI)</span>
                      </div>
                      {activeOrder.items && activeOrder.items.length > 0 && (
                        <p className="text-gray-600 font-medium truncate">
                          {activeOrder.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </p>
                      )}
                    </div>

                    {/* CTA Swipe to Accept */}
                    <div className="mt-3">
                      <SwipeToConfirm
                        label="Swipe to accept delivery"
                        confirmLabel="Order accepted ✓"
                        onConfirm={async () => {
                          try {
                            await fetch(`http://localhost:4000/api/orders/${activeOrder.id}/status`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: 'OUT_FOR_DELIVERY', riderId: riderProfile.id || 'r1' })
                            });
                          } catch (e) {
                            console.warn('API status patch error:', e);
                          }
                          setActiveOrder(activeOrder);
                          setActiveTab('delivery');
                        }}
                      />
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              /* Radar Searching State when Online and no orders placed yet */
              <div className="bg-white border border-yellow-200/80 rounded-3xl p-6 shadow-md text-center space-y-3 relative overflow-hidden">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center relative">
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32 }}>radar</span>
                    <span className="absolute inset-0 rounded-full border-2 border-amber-400 animate-ping opacity-75" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-gray-900">Online &amp; Ready for Deliveries</h3>
                  <p className="text-xs text-gray-500 font-medium leading-snug">
                    LocationIQ GPS is actively scanning for customer orders near your zone in HSR Layout.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1 rounded-full font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Scanning 2.5 km Radius</span>
                </div>
              </div>
            )
          ) : (
            /* Offline Card */
            <div className="offline-placeholder-card">
              <span className="offline-icon">🛵</span>
              <h3 className="offline-title">You are currently Offline</h3>
              <p className="offline-desc">
                Toggle the switch above to go online and start receiving instant order requests from the Darkstore.
              </p>
              <button
                type="button"
                onClick={() => setDutyStatus('ON_DUTY')}
                className="go-online-btn"
              >
                Go Online Now
              </button>
            </div>
          )}

          {/* Stat Cards */}
          <section className="stats-two-grid">
            <div className="stat-box-card">
              <div className="stat-box-top">
                <span>Completed</span>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  task_alt
                </span>
              </div>
              <p className="stat-box-num">
                {riderProfile.todayDeliveries} <span className="stat-box-unit">orders</span>
              </p>
            </div>

            <div className="stat-box-card">
              <div className="stat-box-top">
                <span>Online Time</span>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  schedule
                </span>
              </div>
              <p className="stat-box-num">
                4.5 <span className="stat-box-unit">hrs</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
