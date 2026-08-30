import React from 'react';

interface RiderPendingApprovalScreenProps {
  riderData: any;
  onRefreshStatus?: () => void;
}

export const RiderPendingApprovalScreen: React.FC<RiderPendingApprovalScreenProps> = ({
  riderData,
  onRefreshStatus,
}) => {
  const isRejected = riderData?.status === 'REJECTED';

  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <style>{`
        :root {
          --surface-container-lowest: #ffffff;
          --surface-container-low: #f3f4f5;
          --surface-container: #edeeef;
          --surface-container-highest: #e1e3e4;
          --on-surface: #191c1d;
          --primary-container: #ffc700;
          --on-primary-container: #6e5400;
          --primary: #765b00;
          --background: #f8f9fa;
          --secondary: #5e5e5e;
        }

        .pending-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          background: var(--background);
          font-family: "Inter", sans-serif;
        }

        .pending-card {
          width: 100%;
          max-width: 28rem;
          background: var(--surface-container-lowest);
          border-radius: 28px;
          padding: 32px 24px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid var(--surface-container-highest);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
        }

        .status-circle {
          width: 72px;
          height: 72px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }

        .status-circle.pending {
          background: #fff8e1;
          color: #765b00;
          border: 2px solid #ffe082;
        }

        .status-circle.rejected {
          background: #ffebee;
          color: #c62828;
          border: 2px solid #ffcdd2;
        }

        .status-icon {
          font-size: 40px;
        }

        .pending-title {
          margin: 0;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: var(--on-surface);
        }

        .pending-desc {
          margin: 4px 0 0;
          font-size: 14px;
          color: var(--secondary);
          line-height: 1.4;
        }

        .info-box {
          width: 100%;
          background: var(--background);
          border: 1.5px solid var(--surface-container-highest);
          border-radius: 20px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-align: left;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }

        .info-label {
          color: var(--secondary);
          font-weight: 600;
        }

        .info-value {
          color: var(--on-surface);
          font-weight: 700;
        }

        .status-pill {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .status-pill.pending {
          background: #fff3e0;
          color: #e65100;
          border: 1px solid #ffe0b2;
        }

        .status-pill.rejected {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #ffcdd2;
        }

        .refresh-btn {
          width: 100%;
          padding: 14px;
          border-radius: 16px;
          border: 1.5px solid var(--surface-container-highest);
          background: var(--surface-container-lowest);
          color: var(--on-surface);
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
      `}</style>

      <div className="pending-page">
        <div className="pending-card">
          <div className={`status-circle ${isRejected ? 'rejected' : 'pending'}`}>
            <span className="material-symbols-outlined status-icon">
              {isRejected ? 'gavel' : 'hourglass_top'}
            </span>
          </div>

          <div>
            <h1 className="pending-title">
              {isRejected ? 'Application Declined' : 'License Verification In Progress'}
            </h1>
            <p className="pending-desc">
              {isRejected
                ? 'Your rider partner application was declined by Super Admin.'
                : 'Submitted to Super Admin Console. Vehicle plate and ID proof verification in progress.'}
            </p>
          </div>

          <div className="info-box">
            <div className="info-row">
              <span className="info-label">Rider Name</span>
              <span className="info-value">{riderData?.name || 'Alex Mercer'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Vehicle Number</span>
              <span className="info-value">{riderData?.vehicleNumber || 'KA-01-EQ-9920'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Application Status</span>
              <span className={`status-pill ${isRejected ? 'rejected' : 'pending'}`}>
                {riderData?.status || 'PENDING_APPROVAL'}
              </span>
            </div>
          </div>

          {onRefreshStatus && (
            <button onClick={onRefreshStatus} className="refresh-btn">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>sync</span>
              <span>Check Approval Status</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};
