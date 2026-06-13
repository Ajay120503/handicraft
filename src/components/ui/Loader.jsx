import { motion } from "framer-motion";
import clsx from "clsx";

const Loader = ({
  fullScreen = false,
  size = "md",
  className = "",
  type = "spinner",
}) => {
  const sizes = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-14 h-14" };
  const dotSizes = { sm: "w-1.5 h-1.5", md: "w-2 h-2", lg: "w-3 h-3" };
  const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  const Spinner = () => (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      <div className="relative">
        <motion.div
          className={clsx(
            "rounded-full border-[3px] border-primary-100 border-t-primary-500 dark:border-primary-900/30 dark:border-t-primary-400",
            sizes[size]
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            width={size === "sm" ? "14" : size === "lg" ? "28" : "20"}
            height={size === "sm" ? "14" : size === "lg" ? "28" : "20"}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z"
              fill="url(#loaderGrad)"
            />
            <path
              d="M11 20c0-3.314 2.239-6 5-6s5 2.686 5 6"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="loaderGrad" x1="2" y1="2" x2="30" y2="30">
                <stop stopColor="#ec4899" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </motion.span>
      </div>
      <motion.p
        className={clsx(
          "font-semibold text-primary-600 dark:text-primary-400 tracking-wide",
          textSizes[size]
        )}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        Loading...
      </motion.p>
    </div>
  );

  const Dots = () => (
    <div className={clsx("flex items-center justify-center gap-2", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={clsx(
            "rounded-full bg-primary-500 dark:bg-primary-400",
            dotSizes[size]
          )}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  const Pulse = () => (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      <motion.div
        className={clsx(
          "rounded-full bg-primary-500 dark:bg-primary-400",
          sizes[size]
        )}
        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );

  const content = (() => {
    switch (type) {
      case "dots":
        return <Dots />;
      case "pulse":
        return <Pulse />;
      default:
        return <Spinner />;
    }
  })();

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-50/90 backdrop-blur-md dark:from-gray-900/90 dark:via-gray-900/90 dark:to-primary-900/20">
        {content}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center py-12">{content}</div>
  );
};

export default Loader;

// Skeleton component for loading placeholder states
export const Skeleton = ({ className, variant = "rect", width, height }) => {
  return (
    <div
      className={clsx(
        "skeleton",
        variant === "circle" && "rounded-full",
        variant === "text" && "h-4 rounded",
        className
      )}
      style={{ width, height }}
    />
  );
};

export const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
    <div className="aspect-[3/4] skeleton" />
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="w-20 h-3" />
        <Skeleton className="w-12 h-3" />
      </div>
      <Skeleton className="w-3/4 h-4" />
      <Skeleton className="w-1/2 h-3" />
      <div className="h-px bg-gray-100 dark:bg-gray-800" />
      <div className="flex items-center justify-between">
        <Skeleton className="w-24 h-5" />
        <Skeleton className="w-16 h-3" />
      </div>
    </div>
  </div>
);
