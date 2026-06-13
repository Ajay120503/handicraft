import ProductCard from "./ProductCard.jsx";
import { ProductCardSkeleton } from "../ui/Loader.jsx";

const ProductGrid = ({
  products,
  columns = 4,
  loading = false,
  emptyMessage = "No products found.",
}) => {
  const colClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  };

  if (loading) {
    return (
      <div className={"grid gap-6 " + colClasses[columns]}>
        {Array.from({ length: columns * 2 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary-50 dark:bg-gray-800 flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z"
              fill="url(#emptyGrad)"
            />
            <path
              d="M11 18c0-3.314 2.239-6 5-6s5 2.686 5 6"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path d="M14 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" fill="#fff" />
            <defs>
              <linearGradient id="emptyGrad" x1="2" y1="2" x2="30" y2="30">
                <stop stopColor="#f9a8d4" />
                <stop offset="1" stopColor="#c4b5fd" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {emptyMessage}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className={"grid gap-6 " + colClasses[columns]}>
      {products.map((product, idx) => (
        <ProductCard key={product._id} product={product} index={idx} />
      ))}
    </div>
  );
};

export default ProductGrid;
