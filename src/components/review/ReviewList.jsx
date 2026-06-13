import { useState } from "react";
import {
  Star,
  ThumbsUp,
  Calendar,
  Image as ImageIcon,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { reviewAPI } from "../../api/endpoints";

const ReviewList = ({ reviews, productId, onHelpfulUpdate }) => {
  const [helpfulLoading, setHelpfulLoading] = useState(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200 } },
  };

  const handleHelpful = async (reviewId) => {
    setHelpfulLoading(reviewId);
    try {
      await reviewAPI.markHelpful(reviewId);
      onHelpfulUpdate?.(reviewId);
    } catch (error) {
      console.error("Failed to mark helpful:", error);
    } finally {
      setHelpfulLoading(null);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
          <User size={24} className="text-primary-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          No reviews yet. Be the first to review this product!
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {reviews.map((review, idx) => (
        <motion.div
          key={review._id}
          variants={item}
          className="bg-white dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
        >
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {review.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {review.user?.name || "Anonymous"}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={11} />
                  <span>
                    {format(new Date(review.createdAt), "dd MMM yyyy")}
                  </span>
                  {review.isVerifiedPurchase && (
                    <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-full text-[10px] font-medium">
                      Verified Purchase
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  className={`${
                    i < review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>

          {review.title && (
            <h4 className="mt-3 font-medium text-gray-900 dark:text-gray-100 text-base">
              {review.title}
            </h4>
          )}
          <p className="mt-1.5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {review.comment}
          </p>

          {/* Review Images */}
          {review.images?.length > 0 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {review.images.map((img, i) => (
                <a
                  key={i}
                  href={img.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform group"
                >
                  <img
                    src={img.url}
                    alt="review"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <ImageIcon
                    size={12}
                    className="absolute bottom-1 right-1 text-white/80"
                  />
                </a>
              ))}
            </div>
          )}

          {/* Helpful button */}
          <button
            onClick={() => handleHelpful(review._id)}
            disabled={helpfulLoading === review._id}
            className="mt-4 flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary-600 transition-colors disabled:opacity-50"
          >
            {helpfulLoading === review._id ? (
              <span className="w-3.5 h-3.5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ThumbsUp size={13} />
            )}
            <span>Helpful ({review.helpfulCount || 0})</span>
          </button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ReviewList;
