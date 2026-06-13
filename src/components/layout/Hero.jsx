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

  useEffect(() => {
    const tgt = {
      bg: { x: 0, y: 0 },
      mid: { x: 0, y: 0 },
      fg: { x: 0, y: 0 },
    };
    const cur = {
      bg: { x: 0, y: 0 },
      mid: { x: 0, y: 0 },
      fg: { x: 0, y: 0 },
    };
    let raf;

    const onMove = (e) => {
      const r = heroRef.current?.getBoundingClientRect();
      if (!r) return;
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      tgt.bg = { x: mx * -14, y: my * -10 };
      tgt.mid = { x: mx * -28, y: my * -20 };
      tgt.fg = { x: mx * -46, y: my * -32 };
    };

    const onLeave = () => {
      tgt.bg = tgt.mid = tgt.fg = { x: 0, y: 0 };
    };

    const lerp = (a, b, t) => ({
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    });

    const loop = () => {
      cur.bg = lerp(cur.bg, tgt.bg, 0.06);
      cur.mid = lerp(cur.mid, tgt.mid, 0.07);
      cur.fg = lerp(cur.fg, tgt.fg, 0.08);

      if (layerBgRef.current)
        layerBgRef.current.style.transform = `translate(${cur.bg.x.toFixed(
          2
        )}px, ${cur.bg.y.toFixed(2)}px) scale(1.12)`;

      if (layerMidRef.current)
        layerMidRef.current.style.transform = `translate(${cur.mid.x.toFixed(
          2
        )}px, ${cur.mid.y.toFixed(2)}px) scale(1.12)`;

      if (layerFgRef.current)
        layerFgRef.current.style.transform = `translate(${cur.fg.x.toFixed(
          2
        )}px, ${cur.fg.y.toFixed(2)}px) scale(1.12)`;

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

  // No banners fallback — light/dark aware
  if (banners.length === 0) {
    return (
      <section className="relative min-h-[70vh] sm:min-h-[82vh] flex items-center overflow-hidden bg-gradient-to-br from-primary-100 via-white to-secondary-100 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/30">
        {/* Decorative background elements */}
        {/* <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, currentColor 2px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900" /> */}

        {/* Decorative shape */}
        {/* <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-primary-200/30 dark:bg-primary-500/5 blur-3xl" /> */}
        {/* <div className="absolute -left-32 -bottom-32 w-80 h-80 rounded-full bg-secondary-200/20 dark:bg-secondary-500/5 blur-3xl" /> */}

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            {/* <motion.span
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              Premium Fashion Since 2024
            </motion.span> */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-5 leading-tight text-gray-900 dark:text-white">
              Custom Fashion
              <br />
              <span className="text-primary-600 dark:text-primary-400">
                For Every Woman
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl leading-8">
              Discover your perfect style. Every piece, tailored just for you.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white px-7 py-3 text-sm font-semibold text-white dark:text-gray-900 hover:bg-primary-700 dark:hover:bg-primary-100 transition-all duration-200"
            >
              Shop Collection <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* ── Premium Slider ── */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] sm:min-h-[88vh] overflow-hidden bg-white dark:bg-gray-950  "
      >
        {/* Background Slider */}
        <AnimatePresence mode="wait">
          {banners.map(
            (banner, idx) =>
              idx === current && (
                <motion.div
                  key={idx}
                  className="absolute inset-0 overflow-hidden"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                >
                  {/* Layer 1 — Background: blurred, slowest */}
                  <div
                    ref={layerBgRef}
                    className="absolute inset-16 will-change-transform"
                    style={{
                      filter: "blur(6px) brightness(0.4) saturate(0.8)",
                    }}
                  >
                    <img
                      src={
                        banner.image?.url || getPlaceholderImage(banner.title)
                      }
                      alt=""
                      className="w-full h-full object-contain object-center"
                    />
                  </div>

                  {/* Layer 2 — Midground: slight desaturate, medium speed */}
                  <div
                    ref={layerMidRef}
                    className="absolute inset-16 will-change-transform"
                    style={{
                      opacity: 0.5,
                      mixBlendMode: "soft-light",
                    }}
                  >
                    <img
                      src={
                        banner.image?.url || getPlaceholderImage(banner.title)
                      }
                      alt=""
                      className="w-full h-full object-contain object-center"
                    />
                  </div>

                  {/* Layer 3 — Foreground: sharp, fastest — the main subject */}
                  <div
                    ref={layerFgRef}
                    className="absolute inset-16 will-change-transform"
                    style={{
                      filter:
                        "drop-shadow(-40px 20px 60px rgba(0,0,0,0.5)) drop-shadow(40px 20px 60px rgba(0,0,0,0.5)) brightness(1.05) contrast(1.05)",
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

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container-custom">
            <motion.div
              key={current + "-content"}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-6xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-tight max-w-3xl
          text-primary-700 dark:text-white
           [--stroke:white] dark:[--stroke:rgba(0,0,0,0.4)]"
                // style={{
                //   WebkitTextStroke: "1px var(--stroke)",
                // }}
              >
                {banners[current]?.title}
              </motion.h1>

              {banners[current]?.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-base inline-block sm:text-lg md:text-xl mt-4 max-w-lg
      text-gray-900 dark:text-gray-100
      px-5 py-3"
                  style={{
                    background: "var(--torn-bg, white)",
                    clipPath: `polygon(
        0% 8%, 3% 0%, 6% 6%, 9% 1%, 12% 7%, 15% 2%, 18% 8%, 21% 1%,
        24% 6%, 27% 0%, 30% 5%, 33% 1%, 36% 7%, 39% 2%, 42% 8%, 45% 1%,
        48% 6%, 51% 0%, 54% 5%, 57% 2%, 60% 8%, 63% 1%, 66% 6%, 69% 0%,
        72% 7%, 75% 2%, 78% 6%, 81% 1%, 84% 8%, 87% 2%, 90% 6%, 93% 1%,
        96% 7%, 100% 3%,
        100% 92%, 97% 100%, 94% 94%, 91% 100%, 88% 93%, 85% 99%, 82% 94%,
        79% 100%, 76% 93%, 73% 99%, 70% 94%, 67% 100%, 64% 93%, 61% 99%,
        58% 94%, 55% 100%, 52% 93%, 49% 99%, 46% 94%, 43% 100%, 40% 93%,
        37% 99%, 34% 94%, 31% 100%, 28% 93%, 25% 99%, 22% 94%, 19% 100%,
        16% 93%, 13% 99%, 10% 94%, 7% 100%, 4% 93%, 0% 100%
      )`,
                    // paper texture shadow
                    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.35))",
                  }}
                >
                  {banners[current]?.subtitle}
                </motion.p>
              )}

              {/* {banners[current]?.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-sm sm:text-base mt-3 max-w-md leading-relaxed
            text-gray-600 dark:text-white/65"
                >
                  {banners[current]?.description}
                </motion.p>
              )} */}

              {banners[current]?.ctaText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="mt-8"
                >
                  <Link
                    to={banners[current]?.ctaLink || "/shop"}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold transition-all duration-300 group
              bg-primary-700 text-white"
                  >
                    <span>{banners[current]?.ctaText}</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Premium Controls */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrent((c) => (c - 1 + banners.length) % banners.length)
              }
              className="hidden sm:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full 
        bg-black/20 hover:bg-black/40 border border-black/20 text-gray-900
        dark:bg-white/10 dark:hover:bg-white/25 dark:border-white/10 dark:text-white
        backdrop-blur-md transition-all items-center justify-center"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => setCurrent((c) => (c + 1) % banners.length)}
              className="hidden sm:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full 
        bg-black/20 hover:bg-black/40 border border-black/20 text-gray-900
        dark:bg-white/10 dark:hover:bg-white/25 dark:border-white/10 dark:text-white
        backdrop-blur-md transition-all items-center justify-center"
            >
              <ChevronRight size={20} />
            </button>

            {/* Premium Dots */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? "w-10 h-2.5 bg-primary-500 dark:bg-primary-400"
                      : "w-2.5 h-2.5 bg-black/25 hover:bg-black/50 dark:bg-white/30 dark:hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── Premium Feature Strip ── */}
      <div className="relative z-20 -mt-10 sm:-mt-12 px-3 sm:px-4">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl px-2 sm:px-6 py-3 sm:py-4 border border-gray-200 dark:border-gray-800"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 sm:gap-3 py-2 sm:py-3 px-1 sm:px-2 md:border-r md:last:border-r-0 border-gray-200 dark:border-gray-800"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                  <f.icon size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white">
                    {f.title}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
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
