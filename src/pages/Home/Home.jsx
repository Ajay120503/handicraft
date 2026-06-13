import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Truck,
  Ruler,
  Palette,
  Scissors,
  Star,
  ChevronRight,
} from "lucide-react";
import Hero from "../../components/layout/Hero.jsx";
import ProductGrid from "../../components/product/ProductGrid.jsx";
import Loader from "../../components/ui/Loader.jsx";
import { productAPI, categoryAPI } from "../../api/endpoints.js";
import { getPlaceholderImage } from "../../utils/helpers.js";
import SEO from "../../components/common/SEO.jsx";

/* ── Shared section header ── */
const SectionHeader = ({ eyebrow, title, linkTo, linkLabel }) => (
  <div className="flex items-end justify-between mb-8">
    <div>
      <p className="text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5">
        {eyebrow}
      </p>
      <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-950 dark:text-white leading-tight">
        {title}
      </h2>
    </div>
    {linkTo && (
      <Link
        to={linkTo}
        className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors group"
      >
        {linkLabel || "View All"}
        <ArrowRight
          size={15}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    )}
  </div>
);

const Home = () => {
  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => productAPI.getFeatured(8).then((r) => r.data.data),
  });
  const { data: bestSellersData, isLoading: bestSellersLoading } = useQuery({
    queryKey: ["best-sellers"],
    queryFn: () => productAPI.getBestSellers(8).then((r) => r.data.data),
  });
  const { data: newArrivalsData, isLoading: newArrivalsLoading } = useQuery({
    queryKey: ["new-arrivals"],
    queryFn: () => productAPI.getNewArrivals(8).then((r) => r.data.data),
  });
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryAPI.getAll().then((r) => r.data.data),
  });

  const categories = (categoriesData || [])
    .filter((c) => c.isActive)
    .slice(0, 8);
  const featured = featuredData || [];
  const bestSellers = bestSellersData || [];
  const newArrivals = newArrivalsData || [];

  return (
    <div className="pb-20">
      <SEO
        title="Handmate - Custom Fashion for Every Woman"
        description="Discover premium custom-fit clothing for women. Dresses, tops, ethnic wear, and more. Every piece tailored to perfection with free shipping."
      />
      <Hero />

      <div className="container-custom pt-14">
        {/* ── Categories ── */}
        <section className="py-12">
          <SectionHeader
            eyebrow="Shop by Category"
            title="Find Your Style"
            linkTo="/shop"
            linkLabel="All Categories"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 220 }}
              >
                <Link
                  to={"/shop?category=" + cat._id}
                  className="block group relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 transition-all duration-500"
                >
                  <img
                    src={cat.image?.url || getPlaceholderImage(cat.name)}
                    alt={cat.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.currentTarget.src = getPlaceholderImage(cat.name);
                    }}
                  />
                  {/* Gradient overlay — same pattern as hero */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  {/* Hover shimmer */}
                  {/* <div className="absolute inset-0 bg-primary-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-white font-display font-bold text-base leading-tight mb-1">
                      {cat.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-white/70 text-[11px] font-medium group-hover:text-primary-300 transition-colors">
                      Shop now <ChevronRight size={11} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Featured Collection ── */}
        <section className="py-12">
          <SectionHeader
            eyebrow="Featured Collection"
            title="Handpicked For You"
            linkTo="/shop"
            linkLabel="View All"
          />
          {featuredLoading ? <Loader /> : <ProductGrid products={featured} />}
          {/* Mobile view-all link */}
          <div className="sm:hidden mt-6 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary-600 text-primary-600 text-sm font-semibold hover:bg-primary-50 transition-colors"
            >
              View All <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 text-pretty rounded-3xl my-12 px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">
              Why Choose Handmate
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every piece designed with love, tailored to perfection. Here's
              what makes us your go-to fashion destination.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Ruler,
                title: "Perfect Fit",
                desc: "Custom stitching & measurements for every body type",
              },
              {
                icon: Scissors,
                title: "Premium Craftsmanship",
                desc: "Expert tailors with years of experience",
              },
              {
                icon: Palette,
                title: "Custom Designs",
                desc: "Choose fabrics, colors, and styles you love",
              },
              {
                icon: Truck,
                title: "Free Shipping",
                desc: "On orders above ₹999 with easy returns",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group text-center p-6 rounded-2xl bg-base-100 border dark:border-white/10 border-black/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary border border-white/10 bg-black/10 flex items-center justify-center">
                  <f.icon size={28} />
                </div>

                <h3 className="font-semibold mb-2">{f.title}</h3>

                <p className="text-sm text-base-content/70">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Best Sellers ── */}
        <section className="py-12">
          <SectionHeader
            eyebrow="Most Popular"
            title="Best Sellers"
            linkTo="/shop?isBestSeller=true"
            linkLabel="View All"
          />
          {bestSellersLoading ? (
            <Loader />
          ) : (
            <ProductGrid products={bestSellers} />
          )}
          <div className="sm:hidden mt-6 text-center">
            <Link
              to="/shop?isBestSeller=true"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary-600 text-primary-600 text-sm font-semibold hover:bg-primary-50 transition-colors"
            >
              View All <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* ── Testimonial strip ── */}
        {/* <section className="py-10 my-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-10"
          >
            <div className="shrink-0 text-center sm:text-left sm:border-r border-gray-100 dark:border-gray-800 sm:pr-10">
              <p className="text-5xl font-black text-gray-950 dark:text-white tracking-tight">
                4.9
              </p>
              <div className="flex justify-center sm:justify-start gap-0.5 my-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 font-medium">
                from 2,000+ reviews
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full">
              {[
                {
                  quote:
                    "The fit is absolutely perfect. I've never felt more confident!",
                  author: "Priya M.",
                },
                {
                  quote:
                    "Quality surpassed my expectations. Will definitely order again.",
                  author: "Sneha R.",
                },
                {
                  quote: "Custom colors, beautiful finish. Worth every rupee!",
                  author: "Ananya K.",
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        size={10}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2 italic">
                    "{t.quote}"
                  </p>
                  <p className="text-[11px] font-semibold text-primary-600 dark:text-primary-400">
                    — {t.author}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </section> */}

        {/* ── New Arrivals ── */}
        <section className="py-12">
          <SectionHeader
            eyebrow="Just Landed"
            title="New Arrivals"
            linkTo="/shop?isNewArrival=true"
            linkLabel="View All"
          />
          {newArrivalsLoading ? (
            <Loader />
          ) : (
            <ProductGrid products={newArrivals} />
          )}
          <div className="sm:hidden mt-6 text-center">
            <Link
              to="/shop?isNewArrival=true"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary-600 text-primary-600 text-sm font-semibold hover:bg-primary-50 transition-colors"
            >
              View All <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
