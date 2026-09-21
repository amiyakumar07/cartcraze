import React, { type FormEvent, useState } from "react";

interface FreshCartRiderLoginProps {
  onGoogleLogin?: () => void;
  onEmailLogin?: (email: string, pass: string, isRegister: boolean) => void;
  onBackToLanding?: () => void;
}

export const FreshCartRiderLogin: React.FC<FreshCartRiderLoginProps> = ({
  onGoogleLogin,
  onEmailLogin,
  onBackToLanding
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onEmailLogin) {
        onEmailLogin(email || "rider@cartcraze.app", password || "password123", isRegisterMode);
      }
    }, 800);
  };

  const handleGoogleLogin = () => {
    if (onGoogleLogin) onGoogleLogin();
  };

  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-3deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .rider-login-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          background: linear-gradient(145deg, #0f0c29 0%, #1a1333 35%, #24243e 70%, #0f0c29 100%);
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Decorative orbs */
        .rider-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          z-index: 0;
        }
        .rider-orb-1 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(255,199,0,0.18) 0%, transparent 70%);
          top: -60px; right: -60px;
        }
        .rider-orb-2 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
          bottom: 60px; left: -40px;
        }
        .rider-orb-3 {
          width: 150px; height: 150px;
          background: radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%);
          top: 40%; left: 60%;
        }

        /* Floating icons */
        .float-icon {
          position: absolute;
          z-index: 0;
          opacity: 0.08;
          font-size: 48px;
        }
        .float-icon-1 { top: 15%; left: 8%; animation: float 6s ease-in-out infinite; }
        .float-icon-2 { top: 25%; right: 10%; animation: float2 8s ease-in-out infinite; }
        .float-icon-3 { bottom: 25%; left: 12%; animation: float 7s ease-in-out infinite 1s; }

        /* Back button */
        .rider-back-btn {
          position: relative;
          z-index: 10;
          padding: 16px 20px 0;
        }
        .rider-back-inner {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 50px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.2s;
          border: none;
          background: rgba(255,255,255,0.08);
        }
        .rider-back-inner:hover {
          background: rgba(255,255,255,0.14);
          color: white;
        }

        /* Main scrollable content */
        .rider-scroll {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px 20px 32px;
        }

        /* Hero icon area */
        .rider-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 28px;
          animation: slideUp 0.5s ease both;
        }
        .rider-icon-wrap {
          position: relative;
          width: 80px;
          height: 80px;
          margin-bottom: 16px;
        }
        .rider-icon-bg {
          width: 80px;
          height: 80px;
          border-radius: 28px;
          background: linear-gradient(135deg, #ffc700 0%, #ff9500 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(255,199,0,0.4), 0 0 0 1px rgba(255,199,0,0.2);
          font-size: 36px;
        }
        .rider-pulse {
          position: absolute;
          inset: -6px;
          border-radius: 34px;
          border: 2px solid rgba(255,199,0,0.4);
          animation: pulse-ring 2s ease-out infinite;
        }
        .rider-brand {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 28px;
          font-weight: 900;
          color: white;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .rider-brand span {
          color: #ffc700;
        }
        .rider-tagline {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          margin: 4px 0 0;
          font-weight: 500;
        }

        /* Glass card */
        .rider-card {
          width: 100%;
          max-width: 400px;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 28px;
          padding: 28px 24px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08);
          animation: slideUp 0.5s ease 0.1s both;
        }

        /* Tab switcher */
        .rider-tabs {
          display: flex;
          background: rgba(0,0,0,0.3);
          border-radius: 16px;
          padding: 4px;
          margin-bottom: 24px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .rider-tab {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          color: rgba(255,255,255,0.4);
        }
        .rider-tab.active {
          background: rgba(255,199,0,0.15);
          color: #ffc700;
          box-shadow: 0 0 0 1px rgba(255,199,0,0.25);
        }

        /* Input group */
        .rider-input-group {
          margin-bottom: 14px;
        }
        .rider-input-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }
        .rider-input-wrap {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.2s;
        }
        .rider-input-wrap:focus-within {
          border-color: rgba(255,199,0,0.5);
          background: rgba(255,199,0,0.04);
          box-shadow: 0 0 0 3px rgba(255,199,0,0.08);
        }
        .rider-input-icon {
          padding: 0 12px;
          color: rgba(255,255,255,0.3);
          font-size: 15px;
          display: flex;
          align-items: center;
        }
        .rider-input {
          flex: 1;
          padding: 14px 14px 14px 4px;
          background: transparent;
          border: none;
          outline: none;
          font-size: 14px;
          font-weight: 600;
          color: white;
          font-family: 'Inter', sans-serif;
        }
        .rider-input::placeholder {
          color: rgba(255,255,255,0.2);
          font-weight: 400;
        }
        .rider-pw-toggle {
          padding: 0 14px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.3);
          display: flex;
          align-items: center;
          font-size: 15px;
        }
        .rider-pw-toggle:hover { color: rgba(255,255,255,0.6); }

        /* Submit button */
        .rider-submit-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 18px;
          background: linear-gradient(135deg, #ffc700 0%, #ff9500 100%);
          color: #1a1200;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 6px;
          box-shadow: 0 8px 24px rgba(255,199,0,0.35), 0 4px 8px rgba(0,0,0,0.2);
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .rider-submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shimmer 2.5s infinite;
        }
        .rider-submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 32px rgba(255,199,0,0.45), 0 4px 8px rgba(0,0,0,0.2);
        }
        .rider-submit-btn:active { transform: translateY(0); }
        .rider-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Spinner */
        .rider-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: rgba(0,0,0,0.8);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .rider-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
        }
        .rider-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }
        .rider-divider-text {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          white-space: nowrap;
        }

        /* Google button */
        .rider-google-btn {
          width: 100%;
          padding: 13px;
          border-radius: 16px;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.85);
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .rider-google-btn:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.18);
        }

        /* Toggle link */
        .rider-toggle {
          text-align: center;
          margin-top: 16px;
        }
        .rider-toggle button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          font-family: 'Inter', sans-serif;
          transition: color 0.2s;
        }
        .rider-toggle button span { color: #ffc700; }
        .rider-toggle button:hover span { text-decoration: underline; }

        /* Stats strip */
        .rider-stats {
          display: flex;
          justify-content: center;
          gap: 28px;
          margin-top: 24px;
          animation: slideUp 0.5s ease 0.2s both;
        }
        .rider-stat {
          text-align: center;
        }
        .rider-stat-val {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 18px;
          font-weight: 900;
          color: #ffc700;
          line-height: 1;
        }
        .rider-stat-label {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Footer */
        .rider-footer {
          text-align: center;
          padding: 16px 20px 24px;
          position: relative;
          z-index: 2;
        }
        .rider-footer p {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          line-height: 1.6;
          margin: 0;
        }
        .rider-footer a {
          color: rgba(255,199,0,0.6);
          text-decoration: none;
          font-weight: 700;
        }
        .rider-footer a:hover { color: #ffc700; }
      `}</style>

      <div className="rider-login-root">
        {/* Background orbs */}
        <div className="rider-orb rider-orb-1" />
        <div className="rider-orb rider-orb-2" />
        <div className="rider-orb rider-orb-3" />

        {/* Floating decoration icons */}
        <span className="float-icon float-icon-1">🛵</span>
        <span className="float-icon float-icon-2">⚡</span>
        <span className="float-icon float-icon-3">📦</span>

        {/* Back button */}
        {onBackToLanding && (
          <div className="rider-back-btn">
            <button onClick={onBackToLanding} className="rider-back-inner">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Overview
            </button>
          </div>
        )}

        {/* Main scroll area */}
        <div className="rider-scroll">
          {/* Hero */}
          <div className="rider-hero">
            <div className="rider-icon-wrap">
              <div className="rider-pulse" />
              <div className="rider-icon-bg">🛵</div>
            </div>
            <h1 className="rider-brand">Cart<span>Craze</span></h1>
            <p className="rider-tagline">Rider Partner Portal</p>
          </div>

          {/* Glass card */}
          <div className="rider-card">
            {/* Tabs */}
            <div className="rider-tabs">
              <button
                type="button"
                className={`rider-tab${!isRegisterMode ? ' active' : ''}`}
                onClick={() => setIsRegisterMode(false)}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`rider-tab${isRegisterMode ? ' active' : ''}`}
                onClick={() => setIsRegisterMode(true)}
              >
                Join as Rider
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="rider-input-group">
                <label className="rider-input-label">Email Address</label>
                <div className="rider-input-wrap">
                  <span className="rider-input-icon">✉️</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rider@cartcraze.app"
                    className="rider-input"
                  />
                </div>
              </div>

              <div className="rider-input-group">
                <label className="rider-input-label">Password</label>
                <div className="rider-input-wrap">
                  <span className="rider-input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secure password"
                    className="rider-input"
                  />
                  <button
                    type="button"
                    className="rider-pw-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="rider-submit-btn">
                {loading ? (
                  <div className="rider-spinner" />
                ) : (
                  <>
                    <span>{isRegisterMode ? 'Register as Rider Partner' : 'Sign In as Rider'}</span>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="rider-divider">
              <div className="rider-divider-line" />
              <span className="rider-divider-text">Or continue with</span>
              <div className="rider-divider-line" />
            </div>

            <button type="button" onClick={handleGoogleLogin} className="rider-google-btn">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.73 17.57V20.34H19.29C21.37 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                <path d="M12 23C14.97 23 17.46 22.02 19.29 20.34L15.73 17.57C14.74 18.23 13.48 18.63 12 18.63C9.13 18.63 6.7 16.69 5.81 14.08H2.13V16.94C3.96 20.57 7.69 23 12 23Z" fill="#34A853" />
                <path d="M5.81 14.08C5.58 13.39 5.45 12.66 5.45 11.91C5.45 11.16 5.58 10.43 5.81 9.74V6.88H2.13C1.38 8.38 0.95 10.09 0.95 11.91C0.95 13.73 1.38 15.44 2.13 16.94L5.81 14.08Z" fill="#FBBC05" />
                <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.03L19.38 3.86C17.45 2.06 14.96 0.95 12 0.95C7.69 0.95 3.96 3.38 2.13 7.02L5.81 9.88C6.7 7.27 9.13 5.38 12 5.38Z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="rider-toggle">
              <button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
              >
                {isRegisterMode
                  ? <span>Already a partner? <span>Sign In here</span></span>
                  : <span>New rider? <span>Create your account</span></span>}
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="rider-stats">
            <div className="rider-stat">
              <div className="rider-stat-val">₹35K+</div>
              <div className="rider-stat-label">Monthly Earn</div>
            </div>
            <div className="rider-stat">
              <div className="rider-stat-val">9 Min</div>
              <div className="rider-stat-label">Avg Delivery</div>
            </div>
            <div className="rider-stat">
              <div className="rider-stat-val">5K+</div>
              <div className="rider-stat-label">Active Riders</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="rider-footer">
          <p>
            Protected by CartCraze SSL &amp; Supabase.{' '}
            By signing in you agree to our{' '}
            <a href="#terms">Terms</a> &amp; <a href="#privacy">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </>
  );
};

export default FreshCartRiderLogin;
