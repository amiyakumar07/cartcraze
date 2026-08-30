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
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onEmailLogin) {
      onEmailLogin(email || "rider@cartcraze.app", password || "password123", isRegisterMode);
    }
  };

  const handleGoogleLogin = () => {
    if (onGoogleLogin) {
      onGoogleLogin();
    }
  };

  return (
    <>
      {/* Google Fonts + Material Symbols */}
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

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
        }

        * {
          box-sizing: border-box;
        }

        .login-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: var(--background);
          color: var(--on-background);
          font-family: "Inter", sans-serif;
        }

        .login-container {
          width: 100%;
          max-width: 28rem;
          background: var(--surface-container-lowest);
          display: flex;
          flex-direction: column;
          padding: 32px 24px;
          border-radius: 28px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid var(--surface-container-highest);
        }

        .login-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .back-btn {
          background: var(--surface-container);
          border: none;
          padding: 8px 14px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          color: var(--on-surface);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 24px;
        }

        .logo-circle {
          width: 64px;
          height: 64px;
          background: var(--primary-container);
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          box-shadow: 0 4px 14px rgba(255, 199, 0, 0.4);
        }

        .logo-icon {
          color: var(--on-primary-container);
          font-size: 36px;
        }

        .brand-name {
          margin: 0;
          color: var(--primary);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 40px;
          line-height: 44px;
          letter-spacing: -0.02em;
          font-weight: 800;
        }

        .brand-subtitle {
          margin: 4px 0 0;
          color: var(--on-surface-variant);
          font-size: 15px;
          font-weight: 600;
        }

        .welcome-title {
          margin: 0 0 4px;
          color: var(--on-surface);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 22px;
          font-weight: 800;
          text-align: center;
        }

        .welcome-description {
          margin: 0 0 20px;
          color: var(--secondary);
          font-size: 14px;
          text-align: center;
        }

        /* Mode Tabs */
        .tab-switcher {
          display: flex;
          background: var(--surface-container);
          padding: 4px;
          border-radius: 16px;
          margin-bottom: 20px;
        }

        .tab-btn {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          border-radius: 12px;
          font-weight: 700;
          font-size: 13px;
          color: var(--secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-btn.active {
          background: var(--surface-container-lowest);
          color: var(--on-surface);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        /* Form Inputs */
        .input-group {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--on-surface);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .custom-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 16px;
          border: 1.5px solid var(--surface-container-highest);
          background: var(--surface-bright);
          font-size: 14px;
          font-weight: 600;
          color: var(--on-surface);
          outline: none;
          transition: border-color 0.2s;
        }

        .custom-input:focus {
          border-color: var(--primary);
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 18px;
          background: var(--primary-container);
          color: var(--on-primary-container);
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(255, 199, 0, 0.35);
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 24px 0 20px;
          gap: 12px;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: var(--surface-container-highest);
          border: none;
        }

        .divider-text {
          font-size: 12px;
          font-weight: 700;
          color: var(--secondary);
          text-transform: uppercase;
        }

        .google-login-btn {
          width: 100%;
          padding: 14px;
          border-radius: 18px;
          border: 1.5px solid var(--surface-container-highest);
          background: var(--surface-container-lowest);
          color: var(--on-surface);
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .terms-note {
          font-size: 11px;
          color: var(--secondary);
          text-align: center;
          margin-top: 20px;
          line-height: 1.5;
        }
      `}</style>

      <div className="login-page">
        <main className="login-container">
          <div className="login-top-bar">
            {onBackToLanding && (
              <button onClick={onBackToLanding} className="back-btn">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                <span>Overview</span>
              </button>
            )}
          </div>

          <header className="login-header">
            <div className="logo-circle">
              <span className="material-symbols-outlined logo-icon">electric_moped</span>
            </div>
            <h1 className="brand-name">CartCraze</h1>
            <p className="brand-subtitle">Rider Partner Portal</p>
          </header>

          <h2 className="welcome-title">
            {isRegisterMode ? 'Rider Partner Signup' : 'Rider Sign In'}
          </h2>
          <p className="welcome-description">
            Earn up to ₹35,000/mo delivering 9-min instant groceries
          </p>

          <div className="tab-switcher">
            <button
              type="button"
              className={`tab-btn ${!isRegisterMode ? 'active' : ''}`}
              onClick={() => setIsRegisterMode(false)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`tab-btn ${isRegisterMode ? 'active' : ''}`}
              onClick={() => setIsRegisterMode(true)}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rider@cartcraze.app"
                className="custom-input"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secure password"
                className="custom-input"
              />
            </div>

            <button type="submit" className="submit-btn">
              <span>{isRegisterMode ? 'Register as Rider Partner' : 'Sign In as Rider'}</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <div className="divider">
            <hr className="divider-line" />
            <span className="divider-text">Or Login With</span>
            <hr className="divider-line" />
          </div>

          <button type="button" onClick={handleGoogleLogin} className="google-login-btn">
            <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.73 17.57V20.34H19.29C21.37 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
              <path d="M12 23C14.97 23 17.46 22.02 19.29 20.34L15.73 17.57C14.74 18.23 13.48 18.63 12 18.63C9.13 18.63 6.7 16.69 5.81 14.08H2.13V16.94C3.96 20.57 7.69 23 12 23Z" fill="#34A853" />
              <path d="M5.81 14.08C5.58 13.39 5.45 12.66 5.45 11.91C5.45 11.16 5.58 10.43 5.81 9.74V6.88H2.13C1.38 8.38 0.95 10.09 0.95 11.91C0.95 13.73 1.38 15.44 2.13 16.94L5.81 14.08Z" fill="#FBBC05" />
              <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.03L19.38 3.86C17.45 2.06 14.96 0.95 12 0.95C7.69 0.95 3.96 3.38 2.13 7.02L5.81 9.88C6.7 7.27 9.13 5.38 12 5.38Z" fill="#EA4335" />
            </svg>
            <span>Continue with Google Sign-In</span>
          </button>

          <p className="terms-note">
            Protected by CartCraze Security &amp; Supabase SSL. By signing in, you agree to our Terms and Partner Policy.
          </p>
        </main>
      </div>
    </>
  );
};

export default FreshCartRiderLogin;
