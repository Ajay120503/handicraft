import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
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
import Button from "../../components/ui/Button.jsx";
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
      <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white leading-tight">
        {title}
      </h2>
    </div>
    {linkTo && (
      <Link to={linkTo} className="hidden sm:block">
        <Button variant="outline" size="sm">
          {linkLabel || "View All"} <ArrowRight size={14} />
        </Button>
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
    <div>
      <SEO
        title="Handmate - Custom Fashion for Every Woman"
        description="Discover premium custom-fit clothing for women. Dresses, tops, ethnic wear, and more. Every piece tailored to perfection with free shipping."
      />
      <Hero />

      <div className="container-custom">
        {/* ── Categories ── */}
        <section className="section-padding">
          <SectionHeader
            eyebrow="Shop by Category"
            title="Find Your Style"
            linkTo="/shop"
            linkLabel="All Categories"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
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
        <section className="section-padding">
          <SectionHeader
            eyebrow="Featured Collection"
            title="Handpicked For You"
            linkTo="/shop"
            linkLabel="View All"
          />
          {featuredLoading ? <Loader /> : <ProductGrid products={featured} />}
          <div className="sm:hidden mt-6 text-center">
            <Link to="/shop">
              <Button variant="outline" size="md">
                View All <ArrowRight size={15} />
              </Button>
            </Link>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="section-padding rounded-3xl my-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3 text-gray-900 dark:text-white">
              Why Choose Handmate
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
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
                className="group text-center p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                  <f.icon size={28} />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Best Sellers ── */}
        <section className="section-padding">
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
            <Link to="/shop?isBestSeller=true">
              <Button variant="outline" size="md">
                View All <ArrowRight size={15} />
              </Button>
            </Link>
          </div>
        </section>

        {/* ── New Arrivals ── */}
        <section className="section-padding">
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
            <Link to="/shop?isNewArrival=true">
              <Button variant="outline" size="md">
                View All <ArrowRight size={15} />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
