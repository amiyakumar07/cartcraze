import React from "react";

interface FreshCartOnboardingProps {
  onJoin?: () => void;
  onSignIn?: () => void;
}

export const FreshCartOnboarding: React.FC<FreshCartOnboardingProps> = ({ onJoin, onSignIn }) => {
  return (
    <>
      {/* Google Fonts */}
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
          --on-secondary-container: #646464;
          --surface-container-low: #f3f4f5;
          --surface: #f8f9fa;
          --tertiary-fixed-dim: #61de8a;
          --surface-container-highest: #e1e3e4;
          --on-surface: #191c1d;
          --secondary-fixed: #e2e2e2;
          --on-surface-variant: #4f4632;
          --surface-container: #edeeef;
          --surface-variant: #e1e3e4;
          --on-tertiary-fixed-variant: #005228;
          --outline: #81765f;
          --inverse-surface: #2e3132;
          --on-primary-container: #6e5400;
          --primary: #765b00;
          --outline-variant: #d2c5ab;
          --on-secondary-fixed: #1b1b1b;
          --tertiary-fixed: #7efba4;
          --on-tertiary: #ffffff;
          --on-primary-fixed-variant: #594400;
          --surface-container-lowest: #ffffff;
          --on-secondary: #ffffff;
          --tertiary-container: #6ae792;
          --on-error-container: #93000a;
          --background: #f8f9fa;
          --on-background: #191c1d;
          --on-error: #ffffff;
          --on-tertiary-container: #006633;
          --secondary-fixed-dim: #c6c6c6;
          --tertiary: #006d37;
          --inverse-on-surface: #f0f1f2;
          --error-container: #ffdad6;
          --primary-fixed-dim: #f5bf00;
          --inverse-primary: #f5bf00;
          --secondary: #5e5e5e;
          --primary-container: #ffc700;
          --surface-bright: #f8f9fa;
          --surface-dim: #d9dadb;
          --surface-container-high: #e7e8e9;
          --error: #ba1a1a;
          --on-primary-fixed: #251a00;
          --on-secondary-fixed-variant: #474747;
          --on-primary: #ffffff;
          --primary-fixed: #ffdf94;
          --on-tertiary-fixed: #00210c;
          --secondary-container: #e2e2e2;
          --surface-tint: #765b00;
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
        }

        .freshcart-page {
          min-height: 100vh;
          background: var(--background);
          color: var(--on-background);
          font-family: "Inter", sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .ambient-background {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.2;
          background:
            radial-gradient(
              ellipse at top right,
              var(--primary-container),
              transparent 70%
            );
        }

        .freshcart-main {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .image-section {
          width: 100%;
          height: 16rem;
          position: relative;
          overflow: hidden;
        }

        .image-section img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mobile-image-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.6),
            transparent
          );
        }

        .mobile-brand {
          position: absolute;
          bottom: 1.5rem;
          left: 20px;
          z-index: 20;
          color: white;
        }

        .mobile-brand h1 {
          margin: 0;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 48px;
          line-height: 56px;
          letter-spacing: -0.02em;
          font-weight: 800;
        }

        .mobile-brand p {
          margin: 0;
          font-size: 16px;
          line-height: 24px;
        }

        .content-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 32px 20px;
          background: var(--surface);
          border-radius: 24px 24px 0 0;
          margin-top: -24px;
          position: relative;
          z-index: 20;
          box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.05);
        }

        .desktop-brand {
          display: none;
        }

        .desktop-brand h1 {
          margin: 0;
          color: var(--primary);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 48px;
          line-height: 56px;
          letter-spacing: -0.02em;
          font-weight: 800;
        }

        .intro {
          max-width: 32rem;
        }

        .intro h2 {
          margin: 0;
          color: var(--on-surface);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 28px;
          line-height: 36px;
          font-weight: 700;
        }

        .intro p {
          margin: 16px 0 0;
          color: var(--on-surface-variant);
          font-size: 18px;
          line-height: 28px;
          font-weight: 500;
        }

        .features {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4px;
          margin-top: 32px;
          margin-bottom: 32px;
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .feature-card {
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: flex-start;
          gap: 8px;
          transition:
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .feature-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
          background: var(--primary-container);
          color: var(--on-primary-container);
          padding: 8px;
          border-radius: 8px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
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

        .feature-content h3 {
          margin: 0;
          color: var(--on-surface);
          font-family: "Inter", sans-serif;
          font-size: 14px;
          line-height: 20px;
          font-weight: 700;
        }

        .feature-content p {
          margin: 4px 0 0;
          color: var(--on-surface-variant);
          font-family: "Inter", sans-serif;
          font-size: 12px;
          line-height: 16px;
          font-weight: 500;
        }

        .actions {
          width: 100%;
          max-width: 24rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: auto;
        }

        .action-button {
          width: 100%;
          padding: 16px;
          border-radius: 9999px;
          font-family: "Inter", sans-serif;
          font-size: 14px;
          line-height: 20px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .primary-button {
          border: none;
          background: var(--primary-container);
          color: var(--on-primary-container);
          box-shadow: 0 6px 15px rgba(255, 199, 0, 0.2);
        }

        .primary-button:hover {
          background: var(--primary-fixed);
          box-shadow: 0 8px 20px rgba(255, 199, 0, 0.3);
        }

        .secondary-button {
          background: var(--surface);
          color: var(--on-surface);
          border: 1px solid var(--outline-variant);
        }

        .secondary-button:hover {
          background: var(--surface-container-low);
        }

        .action-button:active {
          transform: scale(0.95);
        }

        .legal {
          max-width: 24rem;
          margin: 16px 0 0;
          color: var(--on-surface-variant);
          font-family: "Inter", sans-serif;
          font-size: 12px;
          line-height: 16px;
          font-weight: 500;
          text-align: center;
        }

        .legal a {
          color: var(--primary);
          text-decoration: underline;
        }

        .legal a:hover {
          color: var(--on-primary-container);
        }

        @media (min-width: 640px) {
          .features {
            grid-template-columns: repeat(2, 1fr);
            gap: 4px;
          }

          .feature-card-wide {
            grid-column: span 2;
          }
        }

        @media (min-width: 768px) {
          .freshcart-main {
            flex-direction: row;
          }

          .image-section {
            width: 50%;
            height: auto;
            min-height: 100vh;
          }

          .mobile-image-overlay,
          .mobile-brand {
            display: none;
          }

          .content-section {
            width: 50%;
            min-height: 100vh;
            padding: 32px 48px;
            margin-top: 0;
            border-radius: 0;
            box-shadow: none;
          }

          .desktop-brand {
            display: block;
            margin-bottom: 48px;
          }

          .intro h2 {
            font-size: 32px;
            line-height: 40px;
            letter-spacing: -0.01em;
          }

          .legal {
            text-align: left;
          }
        }

        @media (min-width: 1280px) {
          .content-section {
            padding-left: 96px;
            padding-right: 96px;
          }
        }
      `}</style>

      <div className="freshcart-page">
        {/* Ambient Background Pattern */}
        <div className="ambient-background" />

        <main className="freshcart-main">
          {/* Image Section */}
          <section className="image-section">
            <div className="mobile-image-overlay" />

            <img
              src="/rider_hero.png"
              alt="A delivery rider wearing a vibrant yellow jacket riding an electric scooter through a modern urban street."
            />

            {/* Mobile Brand Overlay */}
            <div className="mobile-brand">
              <h1>CartCraze</h1>
              <p>Join the fleet.</p>
            </div>
          </section>

          {/* Content Section */}
          <section className="content-section">
            {/* Desktop Brand */}
            <div className="desktop-brand">
              <h1>CartCraze</h1>
            </div>

            {/* Intro */}
            <div className="intro">
              <h2>
                Deliver Fresh.
                <br />
                Earn Fast.
              </h2>

              <p>
                Turn your free time into earnings. Join our elite fleet of
                delivery partners and enjoy unmatched flexibility.
              </p>
            </div>

            {/* Bento Features */}
            <div className="features">
              {/* Feature 1 */}
              <div className="glass-panel feature-card">
                <div className="feature-icon">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    payments
                  </span>
                </div>

                <div className="feature-content">
                  <h3>Up to ₹30,000/mo</h3>
                  <p>Competitive payouts per delivery.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="glass-panel feature-card">
                <div className="feature-icon">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    account_balance_wallet
                  </span>
                </div>

                <div className="feature-content">
                  <h3>Instant Payouts</h3>
                  <p>Cash out whenever you need it.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="glass-panel feature-card feature-card-wide">
                <div className="feature-icon">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    schedule
                  </span>
                </div>

                <div className="feature-content">
                  <h3>Flexible Hours</h3>
                  <p>
                    You're the boss. Choose when and where you want to ride.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="actions">
              <button
                type="button"
                onClick={onJoin}
                className="action-button primary-button"
              >
                Join Now
              </button>

              <button
                type="button"
                onClick={onSignIn}
                className="action-button secondary-button"
              >
                Sign In to Existing Account
              </button>
            </div>

            {/* Legal */}
            <p className="legal">
              By joining, you agree to our{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </p>
          </section>
        </main>
      </div>
    </>
  );
};

export default FreshCartOnboarding;
