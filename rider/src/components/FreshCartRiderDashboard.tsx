import React, { useState } from "react";

const FreshCartRiderDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);

  const handleAcceptOrder = () => {
    console.log("Order accepted");
  };

  const handleMenuClick = () => {
    console.log("Menu clicked");
  };

  return (
    <>
      {/* Fonts */}
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

        html,
        body,
        #root {
          margin: 0;
          min-height: 100%;
        }

        body {
          min-height: 100vh;
          background: var(--background);
          color: var(--on-background);
          font-family: "Inter", sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .dashboard-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--background);
          color: var(--on-background);
          font-family: "Inter", sans-serif;
        }

        /* Material Symbols */
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

        /* Safe Area */
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 20px);
        }

        /* Glassmorphism */
        .glass-panel {
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        /* Header */
        .top-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 64px;
          z-index: 50;
          background: var(--surface);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
        }

        .menu-button {
          border: none;
          background: transparent;
          color: var(--primary);
          padding: 8px;
          margin-left: -8px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition:
            background-color 0.2s ease,
            transform 0.2s ease;
        }

        .menu-button:hover {
          background: var(--surface-container-high);
        }

        .menu-button:active {
          transform: scale(0.95);
        }

        .brand-title {
          margin: 0;
          color: var(--primary);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 28px;
          line-height: 36px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .profile-button {
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          overflow: hidden;
          border: 2px solid var(--surface-container-high);
          flex-shrink: 0;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .profile-button:active {
          transform: scale(0.95);
        }

        .profile-button img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Main Canvas */
        .dashboard-main {
          flex-grow: 1;
          padding-top: 80px;
          padding-bottom: 100px;
          padding-left: 20px;
          padding-right: 20px;
          width: 100%;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* Earnings */
        .earnings-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-top: 8px;
        }

        .earnings-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .earnings-label {
          margin: 0;
          color: var(--secondary);
          font-size: 16px;
          line-height: 24px;
          font-weight: 400;
        }

        .earnings-value-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .earnings-value {
          color: var(--on-surface);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 40px;
          line-height: 48px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .earnings-growth {
          color: var(--tertiary);
          background: rgba(106, 231, 146, 0.3);
          padding: 4px 8px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          font-size: 14px;
          line-height: 20px;
          font-weight: 700;
        }

        .growth-icon {
          font-size: 16px;
          margin-right: 4px;
        }

        /* Online Toggle */
        .online-control {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .toggle-label {
          position: relative;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .toggle-label:active {
          transform: scale(0.95);
        }

        .toggle-input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .toggle-track {
          position: relative;
          width: 56px;
          height: 32px;
          background: var(--surface-container-highest);
          border-radius: 9999px;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.08);
          transition: background-color 0.25s ease;
        }

        .toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 28px;
          height: 28px;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 50%;
          transition: transform 0.25s ease;
        }

        .toggle-input:checked + .toggle-track {
          background: var(--primary-container);
        }

        .toggle-input:checked + .toggle-track .toggle-thumb {
          transform: translateX(24px);
          border-color: #ffffff;
        }

        .online-text {
          color: var(--on-surface);
          font-size: 14px;
          line-height: 20px;
          font-weight: 700;
        }

        /* Active Order */
        .order-section {
          position: relative;
        }

        .ambient-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 75%;
          height: 75%;
          transform: translate(-50%, -50%);
          background: rgba(255, 199, 0, 0.2);
          filter: blur(48px);
          border-radius: 9999px;
          z-index: 0;
          pointer-events: none;
        }

        .order-card {
          position: relative;
          z-index: 10;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
        }

        .order-header {
          min-height: 60px;
          padding: 16px;
          border-bottom: 1px solid var(--surface-container);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.4);
        }

        .order-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .bolt-icon {
          color: var(--primary-container);
          font-variation-settings: "FILL" 1;
          animation: pulse 1.5s infinite;
        }

        .order-title {
          color: var(--on-surface);
          font-size: 14px;
          line-height: 20px;
          font-weight: 700;
        }

        .order-price {
          color: var(--on-surface-variant);
          font-size: 16px;
          line-height: 24px;
          font-weight: 700;
        }

        /* Map */
        .map-container {
          position: relative;
          width: 100%;
          height: 128px;
          background: var(--surface-container-low);
          overflow: hidden;
        }

        .map-background {
          position: absolute;
          inset: 0;
          background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAndw_4P4MLHUywMUkcE1-kMQrjXdG0LjBXz5ByVLZEZ1kgoEvQCzTjZJk0FKy9nz58XabBmA8EZII4XN1qywfCnadYamQ1jr10dCsjUXgSKdu49mU4VKj0Xub8jGc1SLzUDUPthm5P8snQGYK-upokQYrY8VE9cDSt6p_5tlmOafKj1J382pk0lnySoCXNLc0xG_uGJwjTI_Bte6G4Ll2YaiAYeB8m6CijTbZSuGk9MMHqNsS0dbY2");
          background-size: cover;
          background-position: center;
        }

        .map-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            var(--surface-container-lowest),
            transparent
          );
        }

        .map-pin {
          position: absolute;
          padding: 4px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
          z-index: 10;
        }

        .pickup-pin {
          top: 25%;
          left: 25%;
          background: var(--on-surface);
          color: var(--surface-container-lowest);
        }

        .dropoff-pin {
          bottom: 25%;
          right: 25%;
          background: var(--primary-container);
          color: var(--on-primary-container);
        }

        .map-pin .material-symbols-outlined {
          font-size: 16px;
          font-variation-settings: "FILL" 1;
        }

        .route-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .route-path {
          animation: dash 1s linear infinite;
        }

        /* Route Details */
        .route-details {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .route-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .route-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 4px;
        }

        .pickup-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--on-surface);
        }

        .connector {
          width: 2px;
          height: 32px;
          background: var(--surface-variant);
          margin: 4px 0;
        }

        .dropoff-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid var(--primary-container);
          background: var(--surface-container-lowest);
        }

        .route-label {
          margin: 0;
          color: var(--secondary);
          font-size: 12px;
          line-height: 16px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .route-name {
          margin: 2px 0 0;
          color: var(--on-surface);
          font-size: 18px;
          line-height: 28px;
          font-weight: 600;
        }

        .route-address {
          margin: 0;
          color: var(--secondary);
          font-size: 14px;
          line-height: 20px;
        }

        /* Accept Button */
        .accept-container {
          padding: 0 16px 16px;
        }

        .accept-button {
          width: 100%;
          border: none;
          background: var(--primary-container);
          color: var(--on-primary-container);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 18px;
          line-height: 28px;
          font-weight: 700;
          padding: 16px;
          border-radius: 9999px;
          box-shadow: 0 6px 15px rgba(255, 199, 0, 0.25);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .accept-button:hover {
          background: var(--primary-fixed);
        }

        .accept-button:active {
          transform: scale(0.98);
        }

        .accept-button .material-symbols-outlined {
          font-variation-settings: "FILL" 1;
        }

        /* Stats */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .stat-card {
          height: 112px;
          background: var(--surface-container-lowest);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          border: 1px solid var(--surface-container-low);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .stat-title {
          color: var(--secondary);
          font-size: 14px;
          line-height: 20px;
          font-weight: 700;
        }

        .stat-icon {
          color: var(--secondary-fixed-dim);
        }

        .stat-value {
          margin: 0;
          color: var(--on-surface);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 32px;
          line-height: 40px;
          font-weight: 700;
        }

        .stat-unit {
          color: var(--secondary);
          font-family: "Inter", sans-serif;
          font-size: 14px;
          line-height: 20px;
          font-weight: 400;
        }

        /* Bottom Navigation */
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 80px;
          z-index: 50;
          border-radius: 20px 20px 0 0;
          background: var(--surface);
          box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.06);
          border-top: 1px solid rgba(237, 238, 239, 0.5);
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding-bottom: env(safe-area-inset-bottom, 20px);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          border: none;
          background: transparent;
          cursor: pointer;
          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .nav-item:active {
          transform: scale(0.9);
        }

        .nav-item .material-symbols-outlined {
          font-size: 24px;
          margin-bottom: 2px;
        }

        .nav-label {
          font-family: "Inter", sans-serif;
          font-size: 12px;
          line-height: 16px;
          font-weight: 500;
        }

        .nav-active {
          background: var(--primary-container);
          color: var(--on-primary-container);
          border-radius: 9999px;
          padding: 6px 20px;
        }

        .nav-active .material-symbols-outlined {
          font-variation-settings: "FILL" 1;
        }

        .nav-inactive {
          color: var(--secondary);
          padding: 4px 12px;
        }

        .nav-inactive:hover {
          color: var(--primary);
        }

        .nav-inactive .material-symbols-outlined {
          font-variation-settings: "FILL" 0;
        }

        /* Animations */
        @keyframes dash {
          to {
            stroke-dashoffset: -12;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0.55;
          }
        }

        /* Desktop */
        @media (min-width: 768px) {
          .dashboard-main {
            max-width: 672px;
            margin-left: auto;
            margin-right: auto;
            width: 100%;
          }

          .bottom-nav {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .dashboard-main {
            padding-left: 20px;
            padding-right: 20px;
          }

          .earnings-value {
            font-size: 36px;
            line-height: 44px;
          }

          .order-title {
            font-size: 13px;
          }

          .order-price {
            font-size: 15px;
          }

          .route-name {
            font-size: 16px;
            line-height: 24px;
          }
        }
      `}</style>

      <div className="dashboard-page">
        {/* Top App Bar */}
        <header className="top-header">
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

          <h1 className="brand-title">CartCraze</h1>

          <button
            type="button"
            className="profile-button"
            aria-label="Open profile"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVbZ6QNcCiSJH22SNUgqgV2Pw0Mt4-Oti9JII_raWOYAhZJRntrNdtiSeYMkKhVDvmQQqS2WmxxhVGKiAyR7gJ1ZGlWJ_i2ph0gWWxazMdKVReg4IPZ6lHHGSBhg7H-q1gVCHHYdUg7F4UES_jJl8x1WSCLfpjuu6-dl8MiwG1AL9AR8X-1IO3btZYAelGk22-aEdM7ELbFyTPt6ZHAYWB7ouqdrRZ0Ord970H-ez4C9M70O7SyGGS"
              alt="Rider Profile"
            />
          </button>
        </header>

        {/* Main Canvas */}
        <main className="dashboard-main">
          {/* Status & Earnings */}
          <section className="earnings-section">
            <div className="earnings-row">
              <div>
                <p className="earnings-label">
                  Today's Earnings
                </p>

                <div className="earnings-value-row">
                  <span className="earnings-value">
                    ₹1,240
                  </span>

                  <span className="earnings-growth">
                    <span className="material-symbols-outlined growth-icon">
                      trending_up
                    </span>
                    +12%
                  </span>
                </div>
              </div>

              {/* Online Toggle */}
              <div className="online-control">
                <label
                  className="toggle-label"
                  aria-label="Toggle online status"
                >
                  <input
                    className="toggle-input"
                    type="checkbox"
                    checked={isOnline}
                    onChange={(event) =>
                      setIsOnline(event.target.checked)
                    }
                  />

                  <div className="toggle-track">
                    <div className="toggle-thumb" />
                  </div>
                </label>

                <span className="online-text">
                  Online
                </span>
              </div>
            </div>
          </section>

          {/* Active Order Card */}
          <section className="order-section">
            <div className="ambient-glow" />

            <div className="glass-panel order-card">
              {/* Card Header */}
              <div className="order-header">
                <div className="order-header-left">
                  <span className="material-symbols-outlined bolt-icon">
                    bolt
                  </span>

                  <span className="order-title">
                    New Order • 12 mins
                  </span>
                </div>

                <span className="order-price">
                  ₹85.00
                </span>
              </div>

              {/* Map */}
              <div className="map-container">
                <div className="map-background" />

                <div className="map-gradient" />

                {/* Pickup Pin */}
                <div className="map-pin pickup-pin">
                  <span className="material-symbols-outlined">
                    storefront
                  </span>
                </div>

                {/* Dropoff Pin */}
                <div className="map-pin dropoff-pin">
                  <span className="material-symbols-outlined">
                    home
                  </span>
                </div>

                {/* Route Line */}
                <svg
                  className="route-svg"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100"
                >
                  <path
                    className="route-path"
                    d="M 25 25 Q 50 10, 75 75"
                    fill="none"
                    stroke="#ffc700"
                    strokeDasharray="6,6"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>

              {/* Route Details */}
              <div className="route-details">
                {/* Pickup */}
                <div className="route-item">
                  <div className="route-indicator">
                    <div className="pickup-dot" />
                    <div className="connector" />
                  </div>

                  <div>
                    <p className="route-label">
                      Pickup
                    </p>

                    <p className="route-name">
                      FreshMart Greens
                    </p>

                    <p className="route-address">
                      Plot 42, Bandra West
                    </p>
                  </div>
                </div>

                {/* Dropoff */}
                <div className="route-item">
                  <div className="route-indicator">
                    <div className="dropoff-dot" />
                  </div>

                  <div>
                    <p className="route-label">
                      Dropoff
                    </p>

                    <p className="route-name">
                      Sarah Jenkins
                    </p>

                    <p className="route-address">
                      Apt 402, Sea View Towers
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="accept-container">
                <button
                  type="button"
                  className="accept-button"
                  onClick={handleAcceptOrder}
                >
                  Accept Order

                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Summary / Stats */}
          <section className="stats-grid">
            {/* Completed */}
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">
                  Completed
                </span>

                <span className="material-symbols-outlined stat-icon">
                  task_alt
                </span>
              </div>

              <p className="stat-value">
                14{" "}
                <span className="stat-unit">
                  orders
                </span>
              </p>
            </div>

            {/* Online Time */}
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">
                  Online Time
                </span>

                <span className="material-symbols-outlined stat-icon">
                  schedule
                </span>
              </div>

              <p className="stat-value">
                4.5{" "}
                <span className="stat-unit">
                  hrs
                </span>
              </p>
            </div>
          </section>
        </main>

        {/* Bottom Navigation - Mobile */}
        <nav className="bottom-nav">
          {/* Orders */}
          <a
            href="#"
            className="nav-item nav-active"
            onClick={(event) => event.preventDefault()}
          >
            <span className="material-symbols-outlined">
              moped
            </span>

            <span className="nav-label">
              Orders
            </span>
          </a>

          {/* Earnings */}
          <a
            href="#"
            className="nav-item nav-inactive"
            onClick={(event) => event.preventDefault()}
          >
            <span className="material-symbols-outlined">
              payments
            </span>

            <span className="nav-label">
              Earnings
            </span>
          </a>

          {/* Map */}
          <a
            href="#"
            className="nav-item nav-inactive"
            onClick={(event) => event.preventDefault()}
          >
            <span className="material-symbols-outlined">
              explore
            </span>

            <span className="nav-label">
              Map
            </span>
          </a>

          {/* Profile */}
          <a
            href="#"
            className="nav-item nav-inactive"
            onClick={(event) => event.preventDefault()}
          >
            <span className="material-symbols-outlined">
              person
            </span>

            <span className="nav-label">
              Profile
            </span>
          </a>
        </nav>
      </div>
    </>
  );
};

export default FreshCartRiderDashboard;
