import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

const faqs = [
  {
    q: "How do I place an order?",
    a: "Browse our shop, add items to your cart, and proceed to checkout. You can pay using Razorpay, UPI, or Cash on Delivery.",
  },
  {
    q: "What is the delivery time?",
    a: "We offer same-day delivery for orders placed before 6 PM. Standard delivery takes 24-48 hours.",
  },
  {
    q: "Do you offer custom sizing?",
    a: "Yes! Many products support custom sizing. Check the product details or contact us with your measurements.",
  },
  {
    q: "Can I customize an outfit?",
    a: "Absolutely! Contact us for custom orders. We can help with fabric, fit, color, styling, and occasion-based outfit requirements.",
  },
  {
    q: "What is your return policy?",
    a: "Returns are accepted according to the product policy. Defective or damaged items will be replaced or resolved by our support team.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order is shipped, you can track it in real-time from the My Orders section of your account dashboard.",
  },
  {
    q: "Do you deliver outside the city?",
    a: "Currently we deliver within the city limits. For bulk or custom orders outside the city, please contact us directly for arrangements.",
  },
  {
    q: "How can I pay?",
    a: "We accept Razorpay (cards, UPI, netbanking, wallets), Cash on Delivery, and direct UPI transfers.",
  },
  {
    q: "Do you have a loyalty program?",
    a: "Yes! New customers get a welcome bonus of 100 loyalty points. Earn points on every purchase and redeem them on future orders.",
  },
  {
    q: "Can I cancel my order?",
    a: "Yes, you can cancel your order from the My Orders page before it is shipped. Once shipped, cancellations are not possible.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? faqs.filter(
        (f) =>
          f.q.toLowerCase().includes(search.toLowerCase()) ||
          f.a.toLowerCase().includes(search.toLowerCase())
      )
    : faqs;

  return (
    <div>
      {/* Premium Header */}
      <section className="relative min-h-[35vh] flex items-center bg-primary-50 dark:bg-gray-900 overflow-hidden">
        <div className="container-custom text-center w-full py-16">
          <div>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-4">
              Help Center
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold primary-700 mb-3">
              FAQ
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Find answers to commonly asked questions
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom py-12 max-w-3xl mx-auto">
        {/* Search */}
        <div className="relative mb-8">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          />
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            filtered.map((f, i) => {
              const actualIndex = faqs.indexOf(f);
              const isOpen = open === actualIndex;
              return (
                <div
                  key={actualIndex}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-200"
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : actualIndex)}
                    className="w-full p-5 flex items-center justify-between text-left gap-4 group"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-sm sm:text-base">
                      {f.q}
                    </span>
                    <div className="shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <ChevronDown
                        size={16}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still have questions */}
        <div className="mt-12 text-center p-8 bg-primary-50 dark:bg-primary-900/20 rounded-3xl border border-primary-100 dark:border-primary-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            We're here to help! Reach out to our support team.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold transition-all duration-200 text-sm"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
