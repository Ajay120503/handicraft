import { Star } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

const Rating = ({
  value = 0,
  max = 5,
  size = 16,
  showValue = true,
  className,
  interactive = false,
  onChange,
  precision = "full", // "full" | "half"
}) => {
  const stars = [...Array(max)];

  const getStarFill = (index) => {
    const starValue = index + 1;
    if (precision === "half") {
      if (starValue <= Math.floor(value)) return "full";
      if (starValue - 0.5 <= value) return "half";
      return "empty";
    }
    return starValue <= Math.round(value) ? "full" : "empty";
  };

  if (interactive) {
    return (
      <div className={clsx("inline-flex items-center gap-0.5", className)}>
        {stars.map((_, i) => {
          const filled = i < Math.round(value);
          return (
            <motion.button
              key={i}
              type="button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange?.(i + 1)}
              className="p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
              aria-label={`Rate ${i + 1} star${i > 0 ? "s" : ""}`}
            >
              <Star
                size={size}
                className={clsx(
                  "transition-all duration-150",
                  filled
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300 dark:text-gray-600 hover:text-amber-300"
                )}
              />
            </motion.button>
          );
        })}
        {showValue && (
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-1">
            ({value.toFixed(1)})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={clsx("inline-flex items-center gap-0.5", className)}>
      {stars.map((_, i) => {
        const fill = getStarFill(i);
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
          >
            {fill === "half" ? (
              <span className="relative inline-block">
                <Star
                  size={size}
                  className="text-gray-300 dark:text-gray-600"
                />
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: "50%" }}
                >
                  <Star size={size} className="fill-amber-400 text-amber-400" />
                </span>
              </span>
            ) : (
              <Star
                size={size}
                className={clsx(
                  "transition-colors",
                  fill === "full"
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300 dark:text-gray-600"
                )}
              />
            )}
          </motion.span>
        );
      })}
      {showValue && (
        <motion.span
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-1"
        >
          {value > 0 ? value.toFixed(1) : ""}
        </motion.span>
      )}
    </div>
  );
};

export default Rating;
