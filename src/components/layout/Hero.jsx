import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Truck,
  Award,
  Clock,
  Heart,
} from "lucide-react";
import { useSettings } from "../../store/settingsStore.js";
import { getPlaceholderImage } from "../../utils/helpers.js";
import { useTheme } from "../../context/ThemeContext.jsx";


const Hero = () => {
  const heroRef = useRef(null);
  const layerBgRef = useRef(null);
  const layerMidRef = useRef(null);
  const layerFgRef = useRef(null);

  const { settings } = useSettings();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const banners = settings?.heroBanners?.filter((b) => b.isActive) || [];
  const [current, setCurrent] = useState(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // ── Synced parallax: all three layers now move together as one unit ──
  useEffect(() => {
    let tgt = { x: 0, y: 0 };
    let cur = { x: 0, y: 0 };
    let raf;

    const onMove = (e) => {
      const r = heroRef.current?.getBoundingClientRect();
      if (!r) return;
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      tgt = { x: mx * -28, y: my * -20 };
    };

    const onLeave = () => {
      tgt = { x: 0, y: 0 };
    };

    const lerp = (a, b, t) => ({
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    });

    const loop = () => {
      cur = lerp(cur, tgt, 0.07);
      const transform = `translate(${cur.x.toFixed(2)}px, ${cur.y.toFixed(
        2
      )}px) scale(1.12)`;

      if (layerBgRef.current) layerBgRef.current.style.transform = transform;
      if (layerMidRef.current) layerMidRef.current.style.transform = transform;
      if (layerFgRef.current) layerFgRef.current.style.transform = transform;

      raf = requestAnimationFrame(loop);
    };

    const el = heroRef.current;
    el?.addEventListener("mousemove", onMove);
    el?.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      el?.removeEventListener("mousemove", onMove);
      el?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On ₹999+" },
    { icon: Award, title: "Premium Quality", desc: "Handpicked" },
    { icon: Clock, title: "Easy Returns", desc: "Within 7 days" },
    { icon: Heart, title: "Custom Fit", desc: "Tailored for you" },
  ];

  // ── Empty state ─────────────────────────────────────────────
  if (banners.length === 0) {
    return (
      <section className="relative min-h-[78vh] flex items-center overflow-hidden">
        {/* <div className="pointer-events-none absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-primary-200/40 dark:bg-primary-500/10 blur-3xl" /> */}
        {/* <div className="pointer-events-none absolute -bottom-40 -left-32 w-[32rem] h-[32rem] rounded-full bg-primary-100/60 dark:bg-primary-400/10 blur-3xl" /> */}

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur border border-gray-200 dark:border-white/15 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-700 dark:text-gray-200 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
              New Season · Tailored For You
            </span>

            <h1
              className="font-display font-bold text-gray-900 dark:text-white"
              style={{
                fontSize: "clamp(2.75rem, 7vw, 6.25rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.035em",
              }}
            >
              Custom Fashion,{" "}
              <span className="font-serif-italic text-primary-600 dark:text-primary-400">
                tailored
              </span>
              <br />
              for every woman.
            </h1>

            <p
              className="mt-7 max-w-xl text-gray-600 dark:text-gray-300"
              style={{
                fontSize: "clamp(1rem, 1.15vw, 1.125rem)",
                lineHeight: 1.7,
                letterSpacing: "-0.005em",
              }}
            >
              Discover your perfect style. Every piece measured, stitched, and
              finished with care — made to move with you.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white px-7 py-3.5 text-sm font-semibold tracking-wide text-white dark:text-gray-900 hover:bg-primary-700 dark:hover:bg-primary-100 transition-all duration-200 shadow-lg shadow-gray-900/10"
              >
                Shop Collection <ArrowRight size={16} />
              </Link>
              <Link
                to="/shop?isNewArrival=true"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 transition"
              >
                New Arrivals
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // ── Slider ──────────────────────────────────────────────────
  return (
    <>
      <section
        ref={heroRef}
        className="relative min-h-[78vh] sm:min-h-[90vh] overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {banners.map(
            (banner, idx) =>
              idx === current && (
                <motion.div
                  key={idx}
                  className="absolute inset-0 overflow-hidden"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.06 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                >
                  <div
                    ref={layerBgRef}
                    className="absolute inset-0 will-change-transform"
                    style={{
                      filter: "blur(24px) brightness(0.5) saturate(1.1)",
                    }}
                  >
                    <img
                      src={
                        banner.image?.url || getPlaceholderImage(banner.title)
                      }
                      alt=""
                      className="w-full h-full object-contain object-center scale-110"
                    />
                  </div>

                  <div
                    ref={layerFgRef}
                    className="absolute inset-0 sm:inset-8 lg:inset-12 will-change-transform"
                    style={{
                      filter:
                        "drop-shadow(0 30px 60px rgba(0,0,0,0.45)) contrast(1.04)",
                    }}
                  >
                    <img
                      src={
                        banner.image?.url || getPlaceholderImage(banner.title)
                      }
                      alt={banner.title}
                      className="w-full h-full object-contain object-center"
                    />
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>

        {/* <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none" /> */}
        {/* <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" /> */}

        <div className="absolute inset-0 flex items-center">
          <div className="container-custom">
            <motion.div
              key={current + "-content"}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              {banners[current]?.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white bg-white/10 backdrop-blur-md border border-white/20"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                  {banners[current]?.subtitle}
                </motion.p>
              )}

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="font-display font-bold text-white"
                style={{
                  fontSize: "clamp(2.75rem, 7.5vw, 6.5rem)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.035em",
                  textShadow: "0 2px 24px rgba(0,0,0,0.45)",
                }}
              >
                {banners[current]?.title}
              </motion.h1>

              {banners[current]?.ctaText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-9 flex flex-wrap items-center gap-3"
                >
                  <Link
                    to={banners[current]?.ctaLink || "/shop"}
                    className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold tracking-wide text-sm bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-900/30 transition-all duration-300"
                  >
                    <span>{banners[current]?.ctaText}</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold tracking-wide text-sm text-white border border-white/25 hover:bg-white/10 backdrop-blur transition"
                  >
                    Browse All
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {banners.length > 1 && (
          <>
            <button
              aria-label="Previous"
              onClick={() =>
                setCurrent((c) => (c - 1 + banners.length) % banners.length)
              }
              className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all items-center justify-center"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              aria-label="Next"
              onClick={() => setCurrent((c) => (c + 1) % banners.length)}
              className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all items-center justify-center"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-28 sm:bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
              <span className="text-xs font-mono text-white/80 tabular-nums tracking-widest">
                {String(current + 1).padStart(2, "0")}
                <span className="mx-2 text-white/40">/</span>
                {String(banners.length).padStart(2, "0")}
              </span>
              <div className="flex gap-2">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-8 bg-primary-400"
                        : "w-4 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      {/* ── Feature Strip ── */}
      <div className="relative z-20 -mt-12 sm:-mt-16 px-3 sm:px-4">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 bg-white dark:bg-gray-900 rounded-2xl px-2 sm:px-4 py-3 sm:py-5 border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-900/5"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 py-2 px-2 sm:px-4 md:border-r md:last:border-r-0 border-gray-200 dark:border-gray-800"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/40 dark:to-primary-800/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                  <f.icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[13px] sm:text-sm text-gray-900 dark:text-white truncate tracking-tight">
                    {f.title}
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 truncate leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};


export default Hero;
