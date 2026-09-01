import React from "react";
import type { RiderProfile } from "../App";

interface Props {
  riderProfile?: RiderProfile;
}

export const EarningsScreen: React.FC<Props> = ({ riderProfile }) => {
  const mobileProfileImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDCXmAPVy5OWQBDr1Me3-jR2n-lvYVs5iFzzL7p2CfIgNYmFjtHAG3NNg39sU14t_k3DzNyc_2hUtCM7xWwiEnPz8-LRlz56mTQ-Mn_8lOV9J1MAAggjUpP_9s6f2r16LLlJeWQLOnZvj9TPBRTwG4OHldQtPMw-JtwYSng4Ri0dcWq3BjxiLl_A41E1dpUkGa_wHE8sz9rzNUT-6wZHYT9hXfch78yU4HHKEs3m8TImAnrfVDv2xw5";

  const handleMenuClick = () => {
    console.log("Menu clicked");
  };

  const handleCashOut = () => {
    console.log("Cash Out clicked");
  };

  const handleViewHistory = () => {
    console.log("View all history clicked");
  };

  const weeklyEarningsAmount = riderProfile
    ? `₹${(riderProfile.todayEarnings * 4.5).toFixed(2)}`
    : "₹482.50";

  return (
    <>
      {/* Google Fonts */}
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />

      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap"
        rel="stylesheet"
      />

      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <style>{`
        :root {
          --surface-container-lowest: #ffffff;
          --secondary: #5e5e5e;
          --inverse-on-surface: #f0f1f2;
          --surface-variant: #e1e3e4;
          --error-container: #ffdad6;
          --primary-fixed-dim: #f5bf00;
          --on-tertiary: #ffffff;
          --secondary-fixed-dim: #c6c6c6;
          --surface-container-highest: #e1e3e4;
          --surface-container: #edeeef;
          --on-tertiary-container: #006633;
          --tertiary-container: #6ae792;
          --primary: #765b00;
          --on-surface-variant: #4f4632;
          --primary-fixed: #ffdf94;
          --on-primary-container: #6e5400;
          --on-tertiary-fixed-variant: #005228;
          --surface-container-low: #f3f4f5;
          --on-secondary-fixed: #1b1b1b;
          --tertiary: #006d37;
          --on-primary: #ffffff;
          --background: #f8f9fa;
          --surface-bright: #f8f9fa;
          --error: #ba1a1a;
          --surface: #f8f9fa;
          --inverse-primary: #f5bf00;
          --on-secondary-fixed-variant: #474747;
          --surface-dim: #d9dadb;
          --surface-container-high: #e7e8e9;
          --on-error-container: #93000a;
          --secondary-fixed: #e2e2e2;
          --on-tertiary-fixed: #00210c;
          --on-background: #191c1d;
          --on-surface: #191c1d;
          --surface-tint: #765b00;
          --on-secondary-container: #646464;
          --outline: #81765f;
          --tertiary-fixed-dim: #61de8a;
          --tertiary-fixed: #7efba4;
          --secondary-container: #e2e2e2;
          --on-error: #ffffff;
          --primary-container: #ffc700;
          --outline-variant: #d2c5ab;
          --on-primary-fixed-variant: #594400;
          --on-secondary: #ffffff;
          --on-primary-fixed: #251a00;
          --inverse-surface: #2e3132;
        }

        * {
          box-sizing: border-box;
        }

        html {
          min-height: 100%;
        }

        body {
          margin: 0;
          min-height: 100vh;
          background-color: var(--background);
          color: var(--on-background);
          font-family: "Inter", sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        button,
        a {
          font: inherit;
        }

        button {
          border: 0;
        }

        .material-symbols-outlined {
          font-family: "Material Symbols Outlined";
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-feature-settings: "liga";
          -webkit-font-smoothing: antialiased;
        }

        /* Main page */
        .earnings-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--background);
          color: var(--on-background);
          padding-bottom: 96px;
        }

        /* Mobile top bar */
        .mobile-top-bar {
          height: 64px;
          width: 100%;
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          background: var(--surface);
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.04);
        }

        .menu-button {
          width: 40px;
          height: 40px;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background: transparent;
          color: var(--primary);
          cursor: pointer;
          transition:
            transform 0.2s ease,
            background-color 0.2s ease;
        }

        .menu-button:hover {
          background: var(--surface-container-high);
        }

        .menu-button:active {
          transform: scale(0.95);
        }

        .mobile-logo {
          margin: 0;
          color: var(--primary);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 28px;
          line-height: 36px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .mobile-profile {
          width: 32px;
          height: 32px;
          overflow: hidden;
          border-radius: 50%;
          background: var(--surface-container-high);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-profile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Desktop sidebar */
        .sidebar {
          display: none;
        }

        /* Main content */
        .main-content {
          flex: 1;
          width: 100%;
          max-width: 1024px;
          margin: 0 auto;
          padding:
            20px 20px 32px;
        }

        .page-header {
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .page-title {
          margin: 0;
          color: var(--on-background);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 28px;
          line-height: 36px;
          font-weight: 700;
        }

        .page-subtitle {
          margin: 4px 0 0;
          color: var(--secondary);
          font-family: "Inter", sans-serif;
          font-size: 16px;
          line-height: 24px;
          font-weight: 400;
        }

        .cash-out-button {
          min-height: 48px;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 9999px;
          background: var(--primary-container);
          color: var(--on-primary-container);
          font-family: "Inter", sans-serif;
          font-size: 14px;
          line-height: 20px;
          font-weight: 700;
          cursor: pointer;
          box-shadow:
            0 6px 15px rgba(255, 199, 0, 0.15);
          transition:
            opacity 0.2s ease,
            transform 0.2s ease;
        }

        .cash-out-button:hover {
          opacity: 0.9;
        }

        .cash-out-button:active {
          transform: scale(0.95);
        }

        .cash-out-button .material-symbols-outlined {
          font-variation-settings: "FILL" 1;
        }

        /* Bento layout */
        .bento-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 32px;
        }

        .hero-stat {
          min-height: 240px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 12px;
          background: var(--surface-container-lowest);
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.04);
        }

        .section-label {
          margin: 0;
          color: var(--secondary);
          font-family: "Inter", sans-serif;
          font-size: 16px;
          line-height: 24px;
          font-weight: 400;
        }

        .weekly-value {
          margin: 8px 0 0;
          color: var(--on-background);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 32px;
          line-height: 40px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        /* Chart */
        .chart {
          height: 128px;
          margin-top: 16px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 8px;
        }

        .chart-column {
          height: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
        }

        .chart-bar-wrapper {
          width: 100%;
          flex: 1;
          display: flex;
          align-items: flex-end;
        }

        .chart-bar {
          width: 100%;
          border-radius: 4px 4px 0 0;
          background: var(--surface-container);
        }

        .chart-bar.active {
          background: var(--primary-container);
          box-shadow:
            0 6px 15px rgba(255, 199, 0, 0.15);
        }

        .chart-day {
          color: var(--secondary);
          font-family: "Inter", sans-serif;
          font-size: 12px;
          line-height: 16px;
          font-weight: 500;
        }

        .chart-day.active {
          color: var(--on-background);
          font-weight: 700;
        }

        /* Chart heights */
        .bar-m {
          height: 48px;
        }

        .bar-t {
          height: 80px;
        }

        .bar-w {
          height: 64px;
        }

        .bar-th {
          height: 112px;
        }

        .bar-f {
          height: 32px;
        }

        .bar-sat {
          height: 96px;
        }

        .bar-sun {
          height: 40px;
        }

        /* Stats */
        .stats-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .small-stat {
          flex: 1;
          min-height: 112px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-radius: 12px;
          background: var(--surface-container-lowest);
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.04);
        }

        .small-stat-value {
          margin: 4px 0 0;
          color: var(--on-background);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 24px;
          line-height: 32px;
          font-weight: 700;
        }

        .trend-text {
          margin: 8px 0 0;
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--tertiary);
          font-family: "Inter", sans-serif;
          font-size: 12px;
          line-height: 16px;
          font-weight: 500;
        }

        .trend-text .material-symbols-outlined {
          font-size: 16px;
        }

        /* Recent deliveries */
        .recent-section {
          width: 100%;
        }

        .recent-title {
          margin: 0 0 16px;
          color: var(--on-background);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 24px;
          line-height: 32px;
          font-weight: 700;
        }

        .delivery-list {
          overflow: hidden;
          border-radius: 12px;
          background: var(--surface-container-lowest);
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.04);
        }

        .delivery-item {
          min-height: 76px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid var(--surface-variant);
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .delivery-item:last-child {
          border-bottom: 0;
        }

        .delivery-item:hover {
          background: var(--surface-bright);
        }

        .delivery-left {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .delivery-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 50%;
          background: var(--surface-container);
          color: var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delivery-info {
          min-width: 0;
        }

        .delivery-order {
          margin: 0;
          color: var(--on-background);
          font-family: "Inter", sans-serif;
          font-size: 18px;
          line-height: 28px;
          font-weight: 500;
        }

        .delivery-meta {
          margin: 2px 0 0;
          color: var(--secondary);
          font-family: "Inter", sans-serif;
          font-size: 12px;
          line-height: 16px;
          font-weight: 500;
        }

        .delivery-right {
          flex-shrink: 0;
          text-align: right;
        }

        .delivery-amount {
          margin: 0;
          color: var(--on-background);
          font-family: "Inter", sans-serif;
          font-size: 18px;
          line-height: 28px;
          font-weight: 500;
        }

        .completed-badge {
          display: inline-block;
          margin-top: 4px;
          padding: 2px 8px;
          border-radius: 9999px;
          background: rgba(106, 231, 146, 0.3);
          color: var(--on-tertiary-container);
          font-family: "Inter", sans-serif;
          font-size: 12px;
          line-height: 16px;
          font-weight: 500;
        }

        .history-button {
          width: 100%;
          margin-top: 16px;
          padding: 12px;
          border: 1.5px solid var(--on-background);
          border-radius: 9999px;
          background: transparent;
          color: var(--on-background);
          font-family: "Inter", sans-serif;
          font-size: 14px;
          line-height: 20px;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .history-button:hover {
          background: var(--surface-variant);
        }

        /* Desktop */
        @media (min-width: 768px) {
          .earnings-page {
            padding-bottom: 0;
          }

          .mobile-top-bar {
            display: flex;
          }

          .page-header {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
          }

          .page-title {
            font-size: 32px;
            line-height: 40px;
            letter-spacing: -0.01em;
          }

          .bento-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

          .hero-stat {
            grid-column: span 2;
          }
        }

        @media (max-width: 420px) {
          .delivery-item {
            gap: 8px;
          }

          .delivery-left {
            gap: 10px;
          }

          .delivery-order,
          .delivery-amount {
            font-size: 16px;
            line-height: 24px;
          }

          .delivery-meta {
            font-size: 11px;
          }

          .delivery-icon {
            width: 36px;
            height: 36px;
          }

          .weekly-value {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="earnings-page">
        {/* Mobile Top App Bar */}
        <header className="mobile-top-bar">
          <button
            type="button"
            className="menu-button"
            onClick={handleMenuClick}
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined">
              menu
            </span>
          </button>

          <h1 className="mobile-logo">
            CartCraze
          </h1>

          <div className="mobile-profile">
            <img
              src={mobileProfileImage}
              alt="Rider profile"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          {/* Page Header */}
          <header className="page-header">
            <div>
              <h2 className="page-title">
                Earnings Overview
              </h2>

              <p className="page-subtitle">
                Oct 16 - Oct 22, 2026
              </p>
            </div>

            <button
              type="button"
              className="cash-out-button"
              onClick={handleCashOut}
            >
              <span className="material-symbols-outlined">
                account_balance_wallet
              </span>

              Cash Out
            </button>
          </header>

          {/* Bento Grid */}
          <div className="bento-grid">
            {/* Hero Stat */}
            <div className="hero-stat">
              <div>
                <h3 className="section-label">
                  Weekly Earnings
                </h3>

                <p className="weekly-value">
                  {weeklyEarningsAmount}
                </p>
              </div>

              {/* Bar Chart */}
              <div className="chart">
                <div className="chart-column">
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar bar-m" />
                  </div>

                  <span className="chart-day">
                    M
                  </span>
                </div>

                <div className="chart-column">
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar bar-t" />
                  </div>

                  <span className="chart-day">
                    T
                  </span>
                </div>

                <div className="chart-column">
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar bar-w" />
                  </div>

                  <span className="chart-day">
                    W
                  </span>
                </div>

                <div className="chart-column">
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar active bar-th" />
                  </div>

                  <span className="chart-day active">
                    T
                  </span>
                </div>

                <div className="chart-column">
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar bar-f" />
                  </div>

                  <span className="chart-day">
                    F
                  </span>
                </div>

                <div className="chart-column">
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar bar-sat" />
                  </div>

                  <span className="chart-day">
                    S
                  </span>
                </div>

                <div className="chart-column">
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar bar-sun" />
                  </div>

                  <span className="chart-day">
                    S
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Column */}
            <div className="stats-column">
              {/* Deliveries */}
              <div className="small-stat">
                <h3 className="section-label">
                  Deliveries
                </h3>

                <p className="small-stat-value">
                  42
                </p>

                <p className="trend-text">
                  <span className="material-symbols-outlined">
                    trending_up
                  </span>

                  +12% vs last week
                </p>
              </div>

              {/* Time Online */}
              <div className="small-stat">
                <h3 className="section-label">
                  Time Online
                </h3>

                <p className="small-stat-value">
                  28h 15m
                </p>
              </div>
            </div>
          </div>

          {/* Recent Deliveries */}
          <section className="recent-section">
            <h3 className="recent-title">
              Recent Deliveries
            </h3>

            <div className="delivery-list">
              {/* Order #4920 */}
              <div className="delivery-item">
                <div className="delivery-left">
                  <div className="delivery-icon">
                    <span className="material-symbols-outlined">
                      local_mall
                    </span>
                  </div>

                  <div className="delivery-info">
                    <p className="delivery-order">
                      Order #4920
                    </p>

                    <p className="delivery-meta">
                      Today, 2:15 PM • 3.2 mi
                    </p>
                  </div>
                </div>

                <div className="delivery-right">
                  <p className="delivery-amount">
                    ₹12.50
                  </p>

                  <span className="completed-badge">
                    Completed
                  </span>
                </div>
              </div>

              {/* Order #4919 */}
              <div className="delivery-item">
                <div className="delivery-left">
                  <div className="delivery-icon">
                    <span className="material-symbols-outlined">
                      local_mall
                    </span>
                  </div>

                  <div className="delivery-info">
                    <p className="delivery-order">
                      Order #4919
                    </p>

                    <p className="delivery-meta">
                      Today, 1:30 PM • 1.5 mi
                    </p>
                  </div>
                </div>

                <div className="delivery-right">
                  <p className="delivery-amount">
                    ₹8.00
                  </p>

                  <span className="completed-badge">
                    Completed
                  </span>
                </div>
              </div>

              {/* Order #4915 */}
              <div className="delivery-item">
                <div className="delivery-left">
                  <div className="delivery-icon">
                    <span className="material-symbols-outlined">
                      local_mall
                    </span>
                  </div>

                  <div className="delivery-info">
                    <p className="delivery-order">
                      Order #4915
                    </p>

                    <p className="delivery-meta">
                      Today, 11:45 AM • 4.1 mi
                    </p>
                  </div>
                </div>

                <div className="delivery-right">
                  <p className="delivery-amount">
                    ₹15.75
                  </p>

                  <span className="completed-badge">
                    Completed
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="history-button"
              onClick={handleViewHistory}
            >
              View All History
            </button>
          </section>
        </main>
      </div>
    </>
  );
};
