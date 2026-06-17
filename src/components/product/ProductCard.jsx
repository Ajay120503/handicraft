import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye, Star, Ruler } from "lucide-react";
import {
  formatPrice,
  getDiscountPercent,
  getPlaceholderImage,
} from "../../utils/helpers.js";
import Rating from "../ui/Rating.jsx";
import { useCart } from "../../store/cartStore.js";
import { useWishlist } from "../../store/wishlistStore.js";
import { useAuth } from "../../store/authStore.js";
import toast from "react-hot-toast";

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const finalPrice =
    product.discountPrice > 0
      ? product.discountPrice
      : product.basePrice || product.price;
  const originalPrice = product.basePrice || product.price;
  const discount = getDiscountPercent(originalPrice, product.discountPrice);
  const inWishlist = isInWishlist(product._id);
  const hasSizes = product.sizes && product.sizes.length > 0;
  const hasColors = product.colors && product.colors.length > 0;
  const isCustomizable = product.isCustomizable;
  const images = product.images || [];

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login");
      return;
    }
    try {
      const defaultSize = product.sizes?.[0]?.size;
      await addToCart(product._id, 1, {
        selectedSize: defaultSize,
        selectedColor: product.colors?.[0]?.name,
        selectedColorHex: product.colors?.[0]?.hex,
      });
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add");
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login");
      return;
    }
    try {
      if (inWishlist) {
        await removeFromWishlist(product._id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product._id);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: (index % 4) * 0.08, type: "spring", stiffness: 200 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-500"
    >
      <Link
        to={"/product/" + (product.slug || product._id)}
        className="flex flex-col h-full"
      >
        {/* ── Image container ── */}
        <div className="relative overflow-hidden aspect-[3/4] bg-gray-50 dark:bg-gray-800">
          {/* Primary image */}
          <img
            src={images[0]?.url || getPlaceholderImage(product.name)}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = getPlaceholderImage(product.name);
            }}
          />

          {/* Secondary image on hover */}
          {images[1] && (
            <img
              src={images[1].url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              loading="lazy"
            />
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges — top-left stack */}
          <div className="absolute top-2 left-0 flex flex-col gap-1 z-10 max-w-[70%]">
            {discount > 0 && (
              <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-r-full bg-rose-500 text-white text-[10px] sm:text-xs font-semibold whitespace-nowrap shadow-sm">
                -{discount}% OFF
              </span>
            )}
            {product.isNewArrival && (
              <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-r-full bg-emerald-500 text-white text-[10px] sm:text-xs font-semibold whitespace-nowrap shadow-sm">
                New
              </span>
            )}
            {product.isBestSeller && (
              <span className="inline-flex w-fit items-center gap-1 px-2.5 py-1 rounded-r-full bg-amber-400 text-gray-900 text-[10px] sm:text-xs font-semibold whitespace-nowrap shadow-sm">
                Bestseller
              </span>
            )}
            {isCustomizable && (
              <span className="inline-flex w-fit items-center gap-1 px-2.5 py-1 rounded-r-full bg-primary-600 text-white text-[10px] sm:text-xs font-semibold whitespace-nowrap shadow-sm">
                Customizable
              </span>
            )}
          </div>

          {/* Wishlist button — top-right */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleWishlist}
            aria-label="Add to wishlist"
            className={`absolute top-2 right-2 z-10 h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm transition-all duration-200 ${
              inWishlist
                ? "bg-primary-600 text-white scale-110"
                : "bg-white/90 dark:bg-gray-900/80 text-gray-600 hover:bg-white hover:text-rose-500"
            }`}
          >
            <Heart size={16} className={inWishlist ? "fill-current" : ""} />
          </motion.button>

          {/* Image pagination dots */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.slice(0, 4).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === 0
                      ? "bg-white w-3"
                      : "bg-white/60 w-1.5 group-hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Hover action strip — desktop only, mobile gets a sticky button below */}
          <div className="hidden sm:flex absolute inset-x-0 bottom-0 p-3 items-center gap-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 z-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleAddToCart}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-[11px] font-bold text-gray-900 hover:bg-primary-600 hover:text-white transition-all duration-200 tracking-wide uppercase shadow-md"
            >
              <ShoppingCart size={13} /> Add to Cart
            </motion.button>
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}>
              <Link
                to={"/product/" + (product.slug || product._id)}
                className="h-10 w-10 inline-flex items-center justify-center bg-white/95 dark:bg-gray-900/85 backdrop-blur-sm rounded-full text-gray-700 hover:bg-primary-600 hover:text-white transition-all duration-200 shadow-md"
                title="View Details"
              >
                <Eye size={15} />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ── Info panel ── */}
        <div className="flex flex-col flex-1 p-3 sm:p-4">
          {/* Category + Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="truncate text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-[0.12em]">
              {product.category?.name || "Fashion"}
            </span>
            {product.ratings?.average > 0 && (
              <span className="shrink-0 inline-flex items-center gap-0.5 text-[11px] text-amber-500 font-semibold">
                <Star size={10} className="fill-amber-400" />
                {product.ratings.average.toFixed(1)}
                <span className="text-gray-400 font-normal">
                  ({product.reviewsCount || 0})
                </span>
              </span>
            )}
          </div>

          {/* Product name */}
          <h3 className="font-display font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-sm sm:text-[15px] leading-snug tracking-tight min-h-[2.5em]">
            {product.name}
          </h3>

          {/* Colors + sizes */}
          {(hasSizes || hasColors) && (
            <div className="flex items-center gap-3 mb-2.5">
              {hasColors && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="flex -space-x-1.5">
                    {product.colors.slice(0, 5).map((c, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ring-1 ring-black/10 transition-transform hover:scale-125"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                  {product.colors.length > 5 && (
                    <span className="text-[10px] text-gray-400 font-medium">
                      +{product.colors.length - 5}
                    </span>
                  )}
                </div>
              )}
              {hasSizes && (
                <div className="flex items-center gap-1 text-[10px] text-gray-400 shrink-0">
                  <Ruler size={10} />
                  <span>{product.sizes.length} sizes</span>
                </div>
              )}
            </div>
          )}

          {/* Divider pushes price to bottom */}
          <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
            {/* Price row */}
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2">
              <div className="flex items-baseline gap-2 min-w-0 flex-wrap">
                <span className="text-lg sm:text-xl font-black text-gray-950 dark:text-white tracking-tight">
                  {formatPrice(finalPrice)}
                </span>
                {product.discountPrice > 0 && (
                  <span className="text-xs text-gray-400 line-through font-medium">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>

              {(product.fabric || product.fitType) && (
                <div className="hidden sm:flex items-center gap-1 flex-wrap justify-end shrink-0">
                  {product.fabric && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full font-medium">
                      {product.fabric}
                    </span>
                  )}
                  {product.fitType && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full font-medium">
                      {product.fitType}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Mobile-only Add to Cart (since hover isn't available on touch) */}
            <button
              onClick={handleAddToCart}
              className="sm:hidden mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-primary-600 text-white py-2.5 text-[11px] font-bold uppercase tracking-wide active:scale-95 transition-transform"
            >
              <ShoppingCart size={13} /> Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );

};

export default ProductCard;
