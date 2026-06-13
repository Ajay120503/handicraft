import { Link } from "react-router-dom";
import { useSettings } from "../../store/settingsStore.js";

const AuthShell = ({ title, subtitle, children }) => {
  const { settings } = useSettings();
  const siteName = settings?.siteName || "Handmate";
  const tagline = settings?.tagline || "Custom fashion for every woman";
  const logoSrc =
    settings?.logo?.url ||
    (typeof settings?.logo === "string" ? settings.logo : null) ||
    "/logo.png";

  const handleLogoError = (event) => {
    if (event.currentTarget.src.endsWith("/favicon.svg")) return;
    event.currentTarget.src = "/favicon.svg";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/30 px-4 py-8 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-3xl bg-white dark:bg-gray-900 lg:grid-cols-[0.95fr_1.05fr] border dark:border-white/10 border-black/10">
        <aside
          className="hidden text-white lg:flex lg:flex-col lg:justify-between relative overflow-hidden"
          style={{ background: "#0f0f0f" }}
        >
          {/* grid dot overlay */}
          {/* <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          /> */}

          {/* glow blobs */}
          {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              style={{
                position: "absolute",
                width: 320,
                height: 320,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle,rgba(83,74,183,0.18) 0%,transparent 70%)",
                top: -60,
                right: -80,
              }}
            />
            <div
              style={{
                position: "absolute",
                width: 240,
                height: 240,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle,rgba(29,158,117,0.12) 0%,transparent 70%)",
                bottom: 80,
                left: -40,
              }}
            />
            <div
              style={{
                position: "absolute",
                width: 180,
                height: 180,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle,rgba(212,83,126,0.1) 0%,transparent 70%)",
                top: 200,
                right: 40,
              }}
            />
          </div> */}

          {/* floating objects */}
          <style>{`
    @keyframes hm-float1{0%,100%{transform:translateY(0) rotate(-8deg)}50%{transform:translateY(-14px) rotate(-5deg)}}
    @keyframes hm-float2{0%,100%{transform:translateY(0) rotate(6deg)}50%{transform:translateY(-10px) rotate(9deg)}}
    @keyframes hm-float3{0%,100%{transform:translateY(0) rotate(12deg)}50%{transform:translateY(-18px) rotate(8deg)}}
    @keyframes hm-float4{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-12px) rotate(-7deg)}}
    @keyframes hm-float5{0%,100%{transform:translateY(0) rotate(15deg)}50%{transform:translateY(-8px) rotate(18deg)}}
    @keyframes hm-float6{0%,100%{transform:translateY(0) rotate(-12deg)}50%{transform:translateY(-16px) rotate(-9deg)}}
    .hm-obj{position:absolute;filter:drop-shadow(0 8px 24px rgba(0,0,0,0.35));}
    .hm-f1{animation:hm-float1 5.5s ease-in-out infinite}
    .hm-f2{animation:hm-float2 6.2s ease-in-out infinite}
    .hm-f3{animation:hm-float3 4.8s ease-in-out infinite}
    .hm-f4{animation:hm-float4 7s ease-in-out infinite}
    .hm-f5{animation:hm-float5 5.2s ease-in-out infinite}
    .hm-f6{animation:hm-float6 6.8s ease-in-out infinite}
  `}</style>

          <div className="absolute inset-0 pointer-events-none">
            {/* Handbag */}
            <div
              className="hm-obj hm-f1"
              style={{ top: 60, right: 80, width: 90 }}
            >
              <svg viewBox="0 0 90 120" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="hm-bag1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7F77DD" />
                    <stop offset="100%" stopColor="#3C3489" />
                  </linearGradient>
                  <linearGradient id="hm-bag1s" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#534AB7" />
                    <stop offset="100%" stopColor="#26215C" />
                  </linearGradient>
                </defs>
                <rect
                  x="8"
                  y="32"
                  width="74"
                  height="80"
                  rx="6"
                  fill="url(#hm-bag1)"
                />
                <rect
                  x="8"
                  y="32"
                  width="74"
                  height="8"
                  rx="3"
                  fill="url(#hm-bag1s)"
                />
                <path
                  d="M28 32 Q28 10 45 10 Q62 10 62 32"
                  fill="none"
                  stroke="#AFA9EC"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <rect
                  x="34"
                  y="58"
                  width="22"
                  height="16"
                  rx="3"
                  fill="none"
                  stroke="#AFA9EC"
                  strokeWidth="2"
                />
                <rect
                  x="40"
                  y="54"
                  width="10"
                  height="6"
                  rx="2"
                  fill="#AFA9EC"
                />
                <text
                  x="45"
                  y="102"
                  textAnchor="middle"
                  fontSize="9"
                  fill="#CECBF6"
                  fontFamily="sans-serif"
                  fontWeight="600"
                >
                  HANDMATE
                </text>
              </svg>
            </div>

            {/* Heel shoe */}
            <div
              className="hm-obj hm-f2"
              style={{ top: 180, left: 30, width: 76 }}
            >
              <svg viewBox="0 0 76 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="hm-shoe1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#D4537E" />
                    <stop offset="100%" stopColor="#993556" />
                  </linearGradient>
                </defs>
                <ellipse cx="38" cy="86" rx="35" ry="10" fill="#1a1a1a" />
                <path
                  d="M6 72 Q8 55 20 50 L32 48 L42 20 Q44 14 50 16 L56 18 Q60 20 58 26 L50 50 L66 52 Q72 54 70 62 Q68 72 58 74 Z"
                  fill="url(#hm-shoe1)"
                />
                <path
                  d="M42 20 Q44 14 50 16 L56 18 Q60 20 58 26 L50 50"
                  fill="#72243E"
                  opacity="0.5"
                />
                <path
                  d="M6 72 Q8 66 16 64 L58 64"
                  fill="none"
                  stroke="#F4C0D1"
                  strokeWidth="1.5"
                />
                <ellipse
                  cx="36"
                  cy="58"
                  rx="6"
                  ry="3"
                  fill="none"
                  stroke="#F4C0D1"
                  strokeWidth="1.2"
                />
              </svg>
            </div>

            {/* Dress */}
            <div
              className="hm-obj hm-f3"
              style={{ top: 90, left: 120, width: 68 }}
            >
              <svg viewBox="0 0 68 90" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="hm-dress1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#5DCAA5" />
                    <stop offset="100%" stopColor="#0F6E56" />
                  </linearGradient>
                  <linearGradient id="hm-dress1s" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1D9E75" />
                    <stop offset="100%" stopColor="#085041" />
                  </linearGradient>
                </defs>
                <path
                  d="M20 8 Q34 4 48 8 L52 28 Q56 48 58 88 L10 88 Q12 48 16 28 Z"
                  fill="url(#hm-dress1)"
                />
                <path
                  d="M20 8 L16 28 Q12 48 10 88"
                  fill="url(#hm-dress1s)"
                  opacity="0.5"
                />
                <path
                  d="M20 8 Q34 4 48 8 L44 16 Q34 12 24 16 Z"
                  fill="#9FE1CB"
                />
                <line
                  x1="22"
                  y1="30"
                  x2="26"
                  y2="85"
                  stroke="#9FE1CB"
                  strokeWidth="1"
                  opacity="0.5"
                />
                <line
                  x1="34"
                  y1="28"
                  x2="34"
                  y2="88"
                  stroke="#9FE1CB"
                  strokeWidth="1"
                  opacity="0.5"
                />
                <line
                  x1="46"
                  y1="30"
                  x2="42"
                  y2="85"
                  stroke="#9FE1CB"
                  strokeWidth="1"
                  opacity="0.5"
                />
                <ellipse
                  cx="34"
                  cy="8"
                  rx="8"
                  ry="4"
                  fill="#E1F5EE"
                  opacity="0.6"
                />
              </svg>
            </div>

            {/* Watch */}
            <div
              className="hm-obj hm-f4"
              style={{ bottom: 120, right: 60, width: 82 }}
            >
              <svg viewBox="0 0 82 70" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="hm-watch1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#EF9F27" />
                    <stop offset="100%" stopColor="#BA7517" />
                  </linearGradient>
                </defs>
                <rect
                  x="28"
                  y="2"
                  width="10"
                  height="14"
                  rx="2"
                  fill="#633806"
                />
                <rect
                  x="44"
                  y="2"
                  width="10"
                  height="14"
                  rx="2"
                  fill="#633806"
                />
                <rect
                  x="28"
                  y="54"
                  width="10"
                  height="14"
                  rx="2"
                  fill="#633806"
                />
                <rect
                  x="44"
                  y="54"
                  width="10"
                  height="14"
                  rx="2"
                  fill="#633806"
                />
                <rect
                  x="16"
                  y="14"
                  width="50"
                  height="42"
                  rx="10"
                  fill="url(#hm-watch1)"
                />
                <rect
                  x="20"
                  y="18"
                  width="42"
                  height="34"
                  rx="8"
                  fill="#0f0f0f"
                />
                <circle
                  cx="41"
                  cy="35"
                  r="14"
                  fill="#1a1a1a"
                  stroke="#EF9F27"
                  strokeWidth="1"
                />
                <line
                  x1="41"
                  y1="35"
                  x2="41"
                  y2="24"
                  stroke="#FAC775"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="41"
                  y1="35"
                  x2="49"
                  y2="35"
                  stroke="#FAC775"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="41" cy="35" r="2" fill="#EF9F27" />
                <text
                  x="41"
                  y="49"
                  textAnchor="middle"
                  fontSize="5"
                  fill="#FAC775"
                  fontFamily="sans-serif"
                >
                  12:00
                </text>
              </svg>
            </div>

            {/* Ring */}
            <div
              className="hm-obj hm-f5"
              style={{ bottom: 200, left: 180, width: 60 }}
            >
              <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="hm-ring1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FAC775" />
                    <stop offset="100%" stopColor="#BA7517" />
                  </linearGradient>
                </defs>
                <circle
                  cx="30"
                  cy="30"
                  r="22"
                  fill="none"
                  stroke="url(#hm-ring1)"
                  strokeWidth="7"
                />
                <ellipse
                  cx="30"
                  cy="10"
                  rx="10"
                  ry="6"
                  fill="#AFA9EC"
                  stroke="#7F77DD"
                  strokeWidth="1.5"
                />
                <ellipse
                  cx="30"
                  cy="10"
                  rx="6"
                  ry="3.5"
                  fill="#EEEDFE"
                  opacity="0.8"
                />
                <line
                  x1="24"
                  y1="10"
                  x2="20"
                  y2="14"
                  stroke="#7F77DD"
                  strokeWidth="1"
                />
                <line
                  x1="36"
                  y1="10"
                  x2="40"
                  y2="14"
                  stroke="#7F77DD"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* Perfume */}
            <div
              className="hm-obj hm-f6"
              style={{ top: 300, right: 130, width: 58 }}
            >
              <svg viewBox="0 0 58 80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="hm-perf1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F0997B" />
                    <stop offset="100%" stopColor="#993C1D" />
                  </linearGradient>
                </defs>
                <rect
                  x="14"
                  y="16"
                  width="30"
                  height="56"
                  rx="4"
                  fill="url(#hm-perf1)"
                />
                <rect
                  x="14"
                  y="16"
                  width="30"
                  height="56"
                  rx="4"
                  fill="none"
                  stroke="#F5C4B3"
                  strokeWidth="1"
                />
                <rect
                  x="18"
                  y="20"
                  width="22"
                  height="32"
                  rx="2"
                  fill="#712B13"
                  opacity="0.5"
                />
                <rect
                  x="20"
                  y="22"
                  width="18"
                  height="28"
                  rx="2"
                  fill="#FAC775"
                  opacity="0.08"
                />
                <rect
                  x="20"
                  y="52"
                  width="18"
                  height="2"
                  rx="1"
                  fill="#F5C4B3"
                  opacity="0.4"
                />
                <rect
                  x="20"
                  y="57"
                  width="14"
                  height="1.5"
                  rx="1"
                  fill="#F5C4B3"
                  opacity="0.3"
                />
                <rect
                  x="22"
                  y="8"
                  width="14"
                  height="10"
                  rx="2"
                  fill="#D85A30"
                />
                <rect x="26" y="4" width="6" height="6" rx="3" fill="#993C1D" />
                <circle cx="29" cy="4" r="2" fill="#FAC775" opacity="0.6" />
                <text
                  x="29"
                  y="76"
                  textAnchor="middle"
                  fontSize="5"
                  fill="#F5C4B3"
                  fontFamily="sans-serif"
                  fontWeight="600"
                >
                  LUXE
                </text>
              </svg>
            </div>

            {/* Sunglasses */}
            <div
              className="hm-obj hm-f2"
              style={{ bottom: 60, left: 60, width: 70 }}
            >
              <svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="hm-glasses1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#85B7EB" />
                    <stop offset="100%" stopColor="#185FA5" />
                  </linearGradient>
                </defs>
                <line
                  x1="0"
                  y1="22"
                  x2="10"
                  y2="22"
                  stroke="#0C447C"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="60"
                  y1="22"
                  x2="70"
                  y2="22"
                  stroke="#0C447C"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <rect
                  x="10"
                  y="10"
                  width="22"
                  height="22"
                  rx="9"
                  fill="none"
                  stroke="url(#hm-glasses1)"
                  strokeWidth="3"
                />
                <rect
                  x="38"
                  y="10"
                  width="22"
                  height="22"
                  rx="9"
                  fill="none"
                  stroke="url(#hm-glasses1)"
                  strokeWidth="3"
                />
                <path
                  d="M32 21 Q35 18 38 21"
                  fill="none"
                  stroke="#378ADD"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <rect
                  x="10"
                  y="10"
                  width="22"
                  height="22"
                  rx="9"
                  fill="#B5D4F4"
                  opacity="0.15"
                />
                <rect
                  x="38"
                  y="10"
                  width="22"
                  height="22"
                  rx="9"
                  fill="#B5D4F4"
                  opacity="0.15"
                />
              </svg>
            </div>
          </div>

          {/* Logo */}
          <div className="p-10 relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                <img
                  src={logoSrc}
                  alt={siteName}
                  onError={handleLogoError}
                  className="h-10 w-10 object-contain"
                />
              </span>
              <span>
                <span className="block font-display text-2xl font-bold">
                  {siteName}
                </span>
                <span className="block text-xs uppercase tracking-[0.22em] text-white/50">
                  Fashion Studio
                </span>
              </span>
            </Link>
          </div>

          {/* Bottom text */}
          <div className="px-10 pb-12 relative z-10">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-primary-300">
              Premium Custom Wear
            </p>
            <h1 className="max-w-md font-display text-5xl font-bold leading-tight">
              A softer way to manage your wardrobe.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
              Sign in to discover new collections, track orders, save fits, and
              manage custom measurements.
            </p>
          </div>
        </aside>

        <main className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 border-l border-white/10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <Link to="/" className="inline-flex flex-col items-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white border border-black/10">
                  <img
                    src={logoSrc}
                    alt={siteName}
                    onError={handleLogoError}
                    className="h-11 w-11 object-contain"
                  />
                </span>
                <h1 className="mt-3 font-display text-2xl font-bold text-primary-700 dark:text-primary-400">
                  {siteName}
                </h1>
                <p className="text-xs text-gray-400">{tagline}</p>
              </Link>
            </div>

            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold text-gray-950 dark:text-white">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthShell;
