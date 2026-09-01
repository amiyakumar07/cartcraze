import React, { useEffect } from "react";

export const RatingsScreen: React.FC = () => {
  useEffect(() => {
    const links = [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
      },
    ];

    const created: HTMLLinkElement[] = [];
    links.forEach((l) => {
      const el = document.createElement("link");
      el.rel = l.rel;
      el.href = l.href;
      if (l.crossOrigin !== undefined) el.crossOrigin = l.crossOrigin;
      document.head.appendChild(el);
      created.push(el);
    });

    return () => {
      created.forEach((el) => document.head.removeChild(el));
    };
  }, []);

  return (
    <>
      <style>{`
        :root {
          --on-surface-variant: #4f4632;
          --primary: #765b00;
          --outline-variant: #d2c5ab;
          --on-primary: #ffffff;
          --surface-variant: #e1e3e4;
          --surface-container-low: #f3f4f5;
          --primary-container: #ffc700;
          --on-secondary-container: #646464;
          --tertiary: #006d37;
          --error-container: #ffdad6;
          --on-background: #191c1d;
          --surface-bright: #f8f9fa;
          --surface-container-highest: #e1e3e4;
          --on-secondary: #ffffff;
          --surface-tint: #765b00;
          --error: #ba1a1a;
          --on-primary-container: #6e5400;
          --primary-fixed-dim: #f5bf00;
          --secondary: #5e5e5e;
          --background: #f8f9fa;
          --on-error: #ffffff;
          --on-error-container: #93000a;
          --inverse-primary: #f5bf00;
          --on-tertiary-fixed-variant: #005228;
          --secondary-fixed: #e2e2e2;
          --on-primary-fixed-variant: #594400;
          --on-tertiary-container: #006633;
          --tertiary-container: #6ae792;
          --surface: #f8f9fa;
          --on-secondary-fixed-variant: #474747;
          --on-tertiary: #ffffff;
          --on-secondary-fixed: #1b1b1b;
          --inverse-surface: #2e3132;
          --surface-container-lowest: #ffffff;
          --on-primary-fixed: #251a00;
          --surface-container-high: #e7e8e9;
          --on-surface: #191c1d;
          --secondary-container: #e2e2e2;
          --inverse-on-surface: #f0f1f2;
          --on-tertiary-fixed: #00210c;
          --surface-dim: #d9dadb;
          --surface-container: #edeeef;
          --outline: #81765f;
          --tertiary-fixed: #7efba4;
          --secondary-fixed-dim: #c6c6c6;
          --tertiary-fixed-dim: #61de8a;
          --primary-fixed: #ffdf94;
        }

        .bg-background { background-color: var(--background); }
        .text-on-background { color: var(--on-background); }
        .bg-surface { background-color: var(--surface); }
        .bg-surface-dim { background-color: var(--surface-dim); }
        .text-primary { color: var(--primary); }
        .text-primary-fixed-dim { color: var(--primary-fixed-dim); }
        .bg-error { background-color: var(--error); }
        .border-surface { border-color: var(--surface); }
        .text-on-surface { color: var(--on-surface); }
        .text-secondary { color: var(--secondary); }
        .bg-surface-container-lowest { background-color: var(--surface-container-lowest); }
        .border-surface-variant\\/50 { border-color: rgba(225, 227, 228, 0.5); }
        .text-primary-container { color: var(--primary-container); }
        .bg-primary-container { background-color: var(--primary-container); }
        .bg-primary-container\\/10 { background-color: rgba(255, 199, 0, 0.1); }
        .bg-primary-container\\/80 { background-color: rgba(255, 199, 0, 0.8); }
        .text-on-primary-container { color: var(--on-primary-container); }
        .bg-surface-container { background-color: var(--surface-container); }
        .bg-surface-variant { background-color: var(--surface-variant); }
        .bg-error-container { background-color: var(--error-container); }
        .bg-tertiary-container { background-color: var(--tertiary-container); }
        .text-on-tertiary-container { color: var(--on-tertiary-container); }
        .bg-secondary-container { background-color: var(--secondary-container); }
        .text-on-secondary-container { color: var(--on-secondary-container); }
        .bg-surface-container-high { background-color: var(--surface-container-high); }
        .bg-surface-container-highest { background-color: var(--surface-container-highest); }
        .text-on-secondary-fixed-variant { color: var(--on-secondary-fixed-variant); }

        .px-container-margin { padding-left: 20px; padding-right: 20px; }
        .py-stack-sm { padding-top: 8px; padding-bottom: 8px; }
        .py-stack-lg { padding-top: 32px; padding-bottom: 32px; }
        .p-stack-md { padding: 16px; }
        .gap-gutter { gap: 16px; }
        .gap-stack-sm { gap: 8px; }
        .gap-unit { gap: 4px; }
        .space-y-stack-lg > * + * { margin-top: 32px; }
        .mb-stack-sm { margin-bottom: 8px; }

        .font-body-md { font-family: "Inter", sans-serif; font-size: 16px; line-height: 24px; font-weight: 400; }
        .font-headline-md { font-family: "Plus Jakarta Sans", sans-serif; font-size: 24px; line-height: 32px; font-weight: 700; }
        .font-headline-lg-mobile { font-family: "Plus Jakarta Sans", sans-serif; font-size: 28px; line-height: 36px; font-weight: 700; }
        .font-headline-lg { font-family: "Plus Jakarta Sans", sans-serif; font-size: 32px; line-height: 40px; letter-spacing: -0.01em; font-weight: 700; }
        .font-display-lg { font-family: "Plus Jakarta Sans", sans-serif; font-size: 48px; line-height: 56px; letter-spacing: -0.02em; font-weight: 800; }
        .font-label-bold { font-family: "Inter", sans-serif; font-size: 14px; line-height: 20px; font-weight: 700; }
        .font-label-sm { font-family: "Inter", sans-serif; font-size: 12px; line-height: 16px; font-weight: 500; }

        .ambient-shadow-lvl1 {
          box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.04);
        }
        .ambient-shadow-lvl2 {
          box-shadow: 0 6px 15px 0 rgba(255, 199, 0, 0.15);
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .rider-ratings-root {
          min-height: max(884px, 100dvh);
        }
      `}</style>

      <div className="rider-ratings-root bg-background text-on-background min-h-screen pb-24 font-body-md">
        {/* TopAppBar */}
        <header className="w-full top-0 sticky bg-surface dark:bg-surface-dim shadow-xs flex justify-between items-center px-container-margin py-stack-sm z-40">
          <button
            type="button"
            className="text-primary dark:text-primary-fixed-dim hover:opacity-80 transition-opacity active:scale-95 duration-150 p-2 -ml-2 rounded-full cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              menu
            </span>
          </button>
          <h1 className="font-headline-md text-headline-md text-primary dark:text-primary-fixed-dim tracking-tight font-black">
            CartCraze
          </h1>
          <button
            type="button"
            className="text-primary dark:text-primary-fixed-dim hover:opacity-80 transition-opacity active:scale-95 duration-150 p-2 -mr-2 rounded-full relative cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
              notifications
            </span>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface"></span>
          </button>
        </header>

        {/* Main Content Canvas */}
        <main className="px-container-margin py-stack-lg max-w-3xl mx-auto space-y-stack-lg">
          {/* Header Section */}
          <div className="flex flex-col gap-stack-sm">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">
              Rider Ratings
            </h2>
            <p className="font-body-md text-body-md text-secondary">Insights over the last 30 days</p>
          </div>

          {/* Rating Overview Bento */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {/* Big Rating Card */}
            <div className="bg-surface-container-lowest rounded-xl ambient-shadow-lvl1 p-stack-md flex flex-col items-center justify-center border border-surface-variant/50">
              <div className="flex items-baseline gap-unit">
                <span className="font-display-lg text-display-lg text-on-surface">4.8</span>
                <span
                  className="font-headline-md text-headline-md text-primary-container material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              </div>
              <p className="font-label-bold text-label-bold text-secondary mt-2">Overall Rating</p>
              <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-primary-container/10 rounded-full">
                <span className="material-symbols-outlined text-primary-container text-sm">trending_up</span>
                <span className="font-label-sm text-label-sm text-on-primary-container">+0.2 this week</span>
              </div>
            </div>

            {/* Distribution Breakdown Card */}
            <div className="bg-surface-container-lowest rounded-xl ambient-shadow-lvl1 p-stack-md border border-surface-variant/50">
              <h3 className="font-label-bold text-label-bold text-on-surface mb-4">Rating Breakdown</h3>
              <div className="space-y-3">
                {/* 5 Star */}
                <div className="flex items-center gap-3">
                  <span className="font-label-sm text-label-sm text-secondary w-4">5</span>
                  <span
                    className="material-symbols-outlined text-primary-container text-xs"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full w-[85%]"></div>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary w-6 text-right">85%</span>
                </div>
                {/* 4 Star */}
                <div className="flex items-center gap-3">
                  <span className="font-label-sm text-label-sm text-secondary w-4">4</span>
                  <span
                    className="material-symbols-outlined text-primary-container text-xs"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary-container/80 rounded-full w-[10%]"></div>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary w-6 text-right">10%</span>
                </div>
                {/* 3 Star */}
                <div className="flex items-center gap-3">
                  <span className="font-label-sm text-label-sm text-secondary w-4">3</span>
                  <span
                    className="material-symbols-outlined text-primary-container text-xs"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-surface-variant rounded-full w-[3%]"></div>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary w-6 text-right">3%</span>
                </div>
                {/* 2 Star */}
                <div className="flex items-center gap-3">
                  <span className="font-label-sm text-label-sm text-secondary w-4">2</span>
                  <span
                    className="material-symbols-outlined text-primary-container text-xs"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-surface-variant rounded-full w-[1%]"></div>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary w-6 text-right">1%</span>
                </div>
                {/* 1 Star */}
                <div className="flex items-center gap-3">
                  <span className="font-label-sm text-label-sm text-secondary w-4">1</span>
                  <span
                    className="material-symbols-outlined text-primary-container text-xs"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-error-container rounded-full w-[1%]"></div>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary w-6 text-right">1%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Key Performance Badges (Horizontal Scroller) */}
          <section>
            <h3 className="font-label-bold text-label-bold text-on-surface mb-stack-sm px-1">Performance Badges</h3>
            <div className="flex gap-gutter overflow-x-auto hide-scrollbar pb-2 pt-1 px-1 -mx-1 snap-x">
              {/* Badge 1 */}
              <div className="snap-start flex-none w-[160px] bg-surface-container-lowest rounded-xl ambient-shadow-lvl1 p-stack-md flex flex-col items-center text-center border border-surface-variant/50">
                <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center mb-3">
                  <span
                    className="material-symbols-outlined text-on-primary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    trophy
                  </span>
                </div>
                <p className="font-label-bold text-label-bold text-on-surface">Top 5%</p>
                <p className="font-label-sm text-label-sm text-secondary mt-1">Rider in City</p>
              </div>
              {/* Badge 2 */}
              <div className="snap-start flex-none w-[160px] bg-surface-container-lowest rounded-xl ambient-shadow-lvl1 p-stack-md flex flex-col items-center text-center border border-surface-variant/50">
                <div className="w-12 h-12 bg-tertiary-container rounded-full flex items-center justify-center mb-3">
                  <span
                    className="material-symbols-outlined text-on-tertiary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    timer
                  </span>
                </div>
                <p className="font-label-bold text-label-bold text-on-surface">Punctual</p>
                <p className="font-label-sm text-label-sm text-secondary mt-1">98% On-time</p>
              </div>
              {/* Badge 3 */}
              <div className="snap-start flex-none w-[160px] bg-surface-container-lowest rounded-xl ambient-shadow-lvl1 p-stack-md flex flex-col items-center text-center border border-surface-variant/50">
                <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center mb-3">
                  <span
                    className="material-symbols-outlined text-on-secondary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified_user
                  </span>
                </div>
                <p className="font-label-bold text-label-bold text-on-surface">Professional</p>
                <p className="font-label-sm text-label-sm text-secondary mt-1">Great Service</p>
              </div>
            </div>
          </section>

          {/* Customer Feedback Section */}
          <section>
            <div className="flex justify-between items-center mb-stack-sm px-1">
              <h3 className="font-label-bold text-label-bold text-on-surface">Recent Feedback</h3>
              <button
                type="button"
                className="font-label-sm text-label-sm text-primary font-bold hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="space-y-gutter">
              {/* Review 1 */}
              <div className="bg-surface-container-lowest rounded-xl ambient-shadow-lvl1 p-stack-md border border-surface-variant/50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-1">
                    <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary">Today</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface mb-3">
                  &quot;Fast delivery! The rider was very polite and handled my fragile groceries with care. Highly
                  recommend.&quot;
                </p>
                <div className="flex gap-2">
                  <span className="inline-flex px-2 py-1 bg-surface-container-high rounded-md font-label-sm text-label-sm text-secondary">
                    Polite
                  </span>
                  <span className="inline-flex px-2 py-1 bg-surface-container-high rounded-md font-label-sm text-label-sm text-secondary">
                    Careful
                  </span>
                </div>
              </div>
              {/* Review 2 */}
              <div className="bg-surface-container-lowest rounded-xl ambient-shadow-lvl1 p-stack-md border border-surface-variant/50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-1">
                    <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary">Yesterday</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface mb-3">
                  &quot;Arrived earlier than expected and followed my delivery instructions perfectly.&quot;
                </p>
                <div className="flex gap-2">
                  <span className="inline-flex px-2 py-1 bg-surface-container-high rounded-md font-label-sm text-label-sm text-secondary">
                    Fast
                  </span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};
