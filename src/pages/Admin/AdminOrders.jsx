import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { orderAPI } from "../../api/endpoints.js";
import { formatPrice, formatDate } from "../../utils/helpers.js";
import { Ruler } from "lucide-react";
import Loader from "../../components/ui/Loader.jsx";
import Modal from "../../components/ui/Modal.jsx";
import Badge from "../../components/ui/Badge.jsx";
import toast from "react-hot-toast";

const STATUSES = [
  "Processing",
  "Confirmed",
  "Preparing",
  "Shipped",
  "Out_for_Delivery",
  "Delivered",
  "Cancelled",
  "Refunded",
];

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [modalOrder, setModalOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", page, filter],
    queryFn: () =>
      orderAPI.getAll({ page, status: filter, limit: 20 }).then((r) => r.data),
  });

  const handleStatus = async () => {
    if (!newStatus) return;
    try {
      await orderAPI.updateStatus(modalOrder._id, { status: newStatus, note });
      toast.success("Status updated");
      queryClient.invalidateQueries(["admin-orders"]);
      setModalOrder(null);
      setNewStatus("");
      setNote("");
    } catch (err) {
      toast.error("Failed");
    }
  };

  if (isLoading) return <Loader />;
  const orders = data?.data || [];
  const pagination = data?.pagination || {};

  const getStatusBadgeVariant = (status) => {
    if (status === "Delivered") return "success";
    if (status === "Cancelled" || status === "Refunded") return "danger";
    return "warning";
  };

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track and manage customer orders
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="admin-select"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>
                    <span className="font-mono text-xs font-bold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-lg">
                      #{o.orderNumber}
                    </span>
                  </td>
                  <td className="font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400 shrink-0">
                        {(o.user?.name ||
                          o.shippingAddress?.fullName ||
                          "?")[0].toUpperCase()}
                      </div>
                      <span className="truncate">
                        {o.user?.name || o.shippingAddress?.fullName}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-400">
                      {o.items.length}
                    </span>
                  </td>
                  <td className="font-bold text-gray-900 dark:text-white">
                    <span className="text-primary-600 dark:text-primary-400">
                      {formatPrice(o.totalPrice)}
                    </span>
                  </td>
                  <td>
                    <Badge variant={getStatusBadgeVariant(o.orderStatus)}>
                      {o.orderStatus.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td>
                    <span
                      className={
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium " +
                        (o.paymentStatus === "Paid"
                          ? "admin-badge-success"
                          : "admin-badge-warning")
                      }
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          o.paymentStatus === "Paid"
                            ? "bg-green-500"
                            : "bg-amber-500"
                        }`}
                      />
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <div className="flex flex-col">
                      <span>{formatDate(o.createdAt)}</span>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setModalOrder(o);
                        setNewStatus(o.orderStatus);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-all"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="admin-empty-state">
                      <div className="admin-empty-state-icon">
                        <ShoppingBag size={28} className="text-gray-400" />
                      </div>
                      <p className="admin-empty-state-text">No orders found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="admin-pagination">
          {Array.from({ length: pagination.pages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={
                page === i + 1
                  ? "admin-pagination-active"
                  : "admin-pagination-btn"
              }
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={!!modalOrder}
        onClose={() => setModalOrder(null)}
        title={"Order #" + (modalOrder?.orderNumber || "")}
        size="lg"
      >
        {modalOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  Customer
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {modalOrder.user?.name ||
                    modalOrder.shippingAddress?.fullName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  Total
                </p>
                <p className="text-sm font-bold text-primary-600 dark:text-primary-400">
                  {formatPrice(modalOrder.totalPrice)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  Current Status
                </p>
                <Badge variant={getStatusBadgeVariant(modalOrder.orderStatus)}>
                  {modalOrder.orderStatus.replace(/_/g, " ")}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  Payment
                </p>
                <Badge
                  variant={
                    modalOrder.paymentStatus === "Paid" ? "success" : "warning"
                  }
                >
                  {modalOrder.paymentStatus}
                </Badge>
              </div>
            </div>

            {/* Customer Measurements */}
            {modalOrder.userMeasurements &&
              (modalOrder.userMeasurements.bust ||
                modalOrder.userMeasurements.dressSize) && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler size={16} className="text-emerald-600" />
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      Customer Measurements
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {modalOrder.userMeasurements.bust && (
                      <p>
                        <span className="text-gray-500">Bust:</span>{" "}
                        {modalOrder.userMeasurements.bust}
                        {modalOrder.userMeasurements.measurementUnit === "cm"
                          ? " cm"
                          : '"'}
                      </p>
                    )}
                    {modalOrder.userMeasurements.waist && (
                      <p>
                        <span className="text-gray-500">Waist:</span>{" "}
                        {modalOrder.userMeasurements.waist}
                        {modalOrder.userMeasurements.measurementUnit === "cm"
                          ? " cm"
                          : '"'}
                      </p>
                    )}
                    {modalOrder.userMeasurements.hips && (
                      <p>
                        <span className="text-gray-500">Hips:</span>{" "}
                        {modalOrder.userMeasurements.hips}
                        {modalOrder.userMeasurements.measurementUnit === "cm"
                          ? " cm"
                          : '"'}
                      </p>
                    )}
                    {modalOrder.userMeasurements.shoulder && (
                      <p>
                        <span className="text-gray-500">Shoulder:</span>{" "}
                        {modalOrder.userMeasurements.shoulder}
                        {modalOrder.userMeasurements.measurementUnit === "cm"
                          ? " cm"
                          : '"'}
                      </p>
                    )}
                    {modalOrder.userMeasurements.armLength && (
                      <p>
                        <span className="text-gray-500">Arm:</span>{" "}
                        {modalOrder.userMeasurements.armLength}
                        {modalOrder.userMeasurements.measurementUnit === "cm"
                          ? " cm"
                          : '"'}
                      </p>
                    )}
                    {modalOrder.userMeasurements.inseam && (
                      <p>
                        <span className="text-gray-500">Inseam:</span>{" "}
                        {modalOrder.userMeasurements.inseam}
                        {modalOrder.userMeasurements.measurementUnit === "cm"
                          ? " cm"
                          : '"'}
                      </p>
                    )}
                    {modalOrder.userMeasurements.neck && (
                      <p>
                        <span className="text-gray-500">Neck:</span>{" "}
                        {modalOrder.userMeasurements.neck}
                        {modalOrder.userMeasurements.measurementUnit === "cm"
                          ? " cm"
                          : '"'}
                      </p>
                    )}
                    {modalOrder.userMeasurements.height && (
                      <p>
                        <span className="text-gray-500">Height:</span>{" "}
                        {modalOrder.userMeasurements.height}
                        {modalOrder.userMeasurements.heightUnit === "ft"
                          ? "ft"
                          : " cm"}
                      </p>
                    )}
                    {modalOrder.userMeasurements.weight && (
                      <p>
                        <span className="text-gray-500">Weight:</span>{" "}
                        {modalOrder.userMeasurements.weight} kg
                      </p>
                    )}
                    {modalOrder.userMeasurements.dressSize && (
                      <p>
                        <span className="text-gray-500">Dress:</span>{" "}
                        {modalOrder.userMeasurements.dressSize}
                      </p>
                    )}
                    {modalOrder.userMeasurements.topSize && (
                      <p>
                        <span className="text-gray-500">Top:</span>{" "}
                        {modalOrder.userMeasurements.topSize}
                      </p>
                    )}
                    {modalOrder.userMeasurements.bottomSize && (
                      <p>
                        <span className="text-gray-500">Bottom:</span>{" "}
                        {modalOrder.userMeasurements.bottomSize}
                      </p>
                    )}
                    {modalOrder.userMeasurements.braSize && (
                      <p>
                        <span className="text-gray-500">Bra:</span>{" "}
                        {modalOrder.userMeasurements.braSize}
                      </p>
                    )}
                  </div>
                </div>
              )}

            <div>
              <label className="label">New Status</label>
              <select
                className="input"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Note (Optional)</label>
              <textarea
                className="input"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleStatus}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold"
              >
                Update Status
              </button>
              <button
                onClick={() => setModalOrder(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-xl text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrders;
