import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  MapPin,
  CreditCard,
  ChevronLeft,
  Download,
  X,
  Star,
  Ruler,
} from "lucide-react";
import { orderAPI } from "../../api/endpoints.js";
import {
  formatPrice,
  formatDate,
  getPlaceholderImage,
} from "../../utils/helpers.js";
import Loader from "../../components/ui/Loader.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import toast from "react-hot-toast";

const OrderDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderAPI.getById(id).then((r) => r.data.data),
  });

  if (isLoading) return <Loader />;
  if (!data)
    return (
      <div className="container-custom py-20 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-100 dark:border-gray-700 max-w-md mx-auto">
          <p className="text-gray-500 dark:text-gray-400">Order not found</p>
        </div>
      </div>
    );

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await orderAPI.cancel(data._id, "Customer cancelled");
      toast.success("Order cancelled");
      window.location.reload();
    } catch (err) {
      toast.error("Failed to cancel");
    }
  };

  const handleInvoice = async () => {
    try {
      const res = await orderAPI.getInvoice(data._id);
      const blob = new Blob([res.data], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice-" + data.orderNumber + ".html";
      a.click();
    } catch (err) {
      toast.error("Failed to download");
    }
  };

  const getBadgeVariant = (status) => {
    if (status === "Delivered") return "success";
    if (status === "Cancelled" || status === "Refunded") return "danger";
    return "warning";
  };

  return (
    <div className="container-custom py-6 sm:py-8">
      {/* Back link */}
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4 transition-colors"
      >
        <ChevronLeft size={16} /> Back to orders
      </Link>

      {/* Header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 mb-6">
        <div className="min-w-0">
          <h1 className="truncate text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
            Order #{data.orderNumber}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Placed on {formatDate(data.createdAt)}
          </p>
        </div>
        <Badge variant={getBadgeVariant(data.orderStatus)} className="shrink-0">
          {data.orderStatus.replace(/_/g, " ")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Items */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h2 className="font-display font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Package size={18} className="text-primary-600" /> Items
              <span className="ml-auto text-xs font-normal text-gray-400">
                {data.items.length} {data.items.length === 1 ? "item" : "items"}
              </span>
            </h2>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.items.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[64px_minmax(0,1fr)_auto] gap-3 py-3 first:pt-0 last:pb-0 items-start"
                >
                  <img
                    src={item.image || getPlaceholderImage(item.name)}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100 dark:border-gray-700"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                    {data.orderStatus === "Delivered" && item.product && (
                      <Link
                        to={
                          "/product/" +
                          (typeof item.product === "object"
                            ? item.product.slug
                            : item.product)
                        }
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 mt-1.5 transition-colors"
                      >
                        <Star size={12} /> Write a Review
                      </Link>
                    )}
                  </div>
                  <p className="font-bold text-sm sm:text-base text-primary-600 dark:text-primary-400 shrink-0 whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Status History */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h2 className="font-display font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-4">
              Status History
            </h2>
            <ol className="relative">
              {data.statusHistory?.map((s, i) => {
                const isLast = i === data.statusHistory.length - 1;
                const isCurrent = i === 0;
                return (
                  <li
                    key={i}
                    className="grid grid-cols-[20px_minmax(0,1fr)] gap-3 pb-4 last:pb-0"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ring-4 ${
                          isCurrent
                            ? "bg-primary-600 ring-primary-100 dark:ring-primary-900/40"
                            : "bg-primary-300 ring-transparent"
                        }`}
                      />
                      {!isLast && (
                        <div className="w-0.5 flex-1 bg-gradient-to-b from-primary-300 to-primary-100 dark:from-primary-700 dark:to-primary-900 mt-1 min-h-[20px]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white capitalize">
                        {s.status?.replace(/_/g, " ").toLowerCase()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {formatDate(s.updatedAt)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        {/* RIGHT */}
        <aside className="space-y-4 sm:space-y-6">
          {/* Order Summary */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h2 className="font-display font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-4">
              Order Summary
            </h2>
            <dl className="space-y-2 text-sm">
              {[
                ["Subtotal", formatPrice(data.itemsPrice)],
                ["Tax", formatPrice(data.taxPrice)],
                ["Shipping", formatPrice(data.shippingPrice)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-3 text-gray-600 dark:text-gray-400"
                >
                  <dt>{label}</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">
                    {value}
                  </dd>
                </div>
              ))}
              {data.discountPrice > 0 && (
                <div className="flex justify-between gap-3 text-emerald-600 font-medium">
                  <dt>Discount</dt>
                  <dd>-{formatPrice(data.discountPrice)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3 text-base sm:text-lg font-bold pt-3 mt-2 border-t border-gray-100 dark:border-gray-700">
                <dt className="text-gray-900 dark:text-white">Total</dt>
                <dd className="text-primary-600 dark:text-primary-400">
                  {formatPrice(data.totalPrice)}
                </dd>
              </div>
            </dl>
          </section>

          {/* Shipping Address */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h2 className="font-display font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-primary-600" /> Shipping Address
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-0.5 break-words">
              <p className="font-medium text-gray-900 dark:text-white">
                {data.shippingAddress.fullName}
              </p>
              <p>{data.shippingAddress.addressLine1}</p>
              <p>
                {data.shippingAddress.city}, {data.shippingAddress.state}{" "}
                {data.shippingAddress.postalCode}
              </p>
              <p className="pt-1">📞 {data.shippingAddress.phone}</p>
            </div>
          </section>

          {/* Payment */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h2 className="font-display font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <CreditCard size={18} className="text-primary-600" /> Payment
            </h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between gap-3 items-center text-gray-600 dark:text-gray-400">
                <span>Method</span>
                <span className="font-medium text-gray-900 dark:text-white truncate">
                  {data.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between gap-3 items-center text-gray-600 dark:text-gray-400">
                <span>Status</span>
                <Badge
                  variant={
                    data.paymentStatus === "Paid" ? "success" : "warning"
                  }
                >
                  {data.paymentStatus}
                </Badge>
              </div>
            </div>
          </section>

          {/* Measurements */}
          {data.userMeasurements &&
            (data.userMeasurements.bust || data.userMeasurements.dressSize) && (
              <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h2 className="font-display font-semibold text-base sm:text-lg text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Ruler size={18} className="text-primary-600" /> My
                  Measurements
                </h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {[
                    [
                      "Bust",
                      data.userMeasurements.bust,
                      data.userMeasurements.measurementUnit === "cm"
                        ? " cm"
                        : '"',
                    ],
                    [
                      "Waist",
                      data.userMeasurements.waist,
                      data.userMeasurements.measurementUnit === "cm"
                        ? " cm"
                        : '"',
                    ],
                    [
                      "Hips",
                      data.userMeasurements.hips,
                      data.userMeasurements.measurementUnit === "cm"
                        ? " cm"
                        : '"',
                    ],
                    [
                      "Shoulder",
                      data.userMeasurements.shoulder,
                      data.userMeasurements.measurementUnit === "cm"
                        ? " cm"
                        : '"',
                    ],
                    [
                      "Arm",
                      data.userMeasurements.armLength,
                      data.userMeasurements.measurementUnit === "cm"
                        ? " cm"
                        : '"',
                    ],
                    [
                      "Inseam",
                      data.userMeasurements.inseam,
                      data.userMeasurements.measurementUnit === "cm"
                        ? " cm"
                        : '"',
                    ],
                    [
                      "Neck",
                      data.userMeasurements.neck,
                      data.userMeasurements.measurementUnit === "cm"
                        ? " cm"
                        : '"',
                    ],
                    [
                      "Height",
                      data.userMeasurements.height,
                      data.userMeasurements.heightUnit === "ft" ? "ft" : " cm",
                    ],
                    ["Weight", data.userMeasurements.weight, " kg"],
                    ["Dress", data.userMeasurements.dressSize, ""],
                    ["Top", data.userMeasurements.topSize, ""],
                    ["Bottom", data.userMeasurements.bottomSize, ""],
                    ["Bra", data.userMeasurements.braSize, ""],
                  ]
                    .filter(([, v]) => v)
                    .map(([label, v, unit]) => (
                      <div
                        key={label}
                        className="flex items-baseline justify-between gap-2 px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900/40"
                      >
                        <span className="text-xs text-gray-500">{label}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {v}
                          {unit}
                        </span>
                      </div>
                    ))}
                </div>
              </section>
            )}

          {/* Actions */}
          <div className="space-y-2.5">
            <button
              onClick={handleInvoice}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200"
            >
              <Download size={16} /> Download Invoice
            </button>

            {!["Delivered", "Cancelled", "Refunded"].includes(
              data.orderStatus
            ) && (
              <button
                onClick={handleCancel}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-red-400 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200"
              >
                <X size={16} /> Cancel Order
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );

};

export default OrderDetail;
