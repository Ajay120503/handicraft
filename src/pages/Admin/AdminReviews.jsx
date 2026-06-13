import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Trash2, MessageSquare } from "lucide-react";
import { reviewAPI } from "../../api/endpoints.js";
import { formatDate } from "../../utils/helpers.js";
import Loader from "../../components/ui/Loader.jsx";
import Rating from "../../components/ui/Rating.jsx";
import Badge from "../../components/ui/Badge.jsx";
import toast from "react-hot-toast";

const AdminReviews = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-reviews", filter],
    queryFn: () =>
      reviewAPI.getAll({ isApproved: filter, limit: 50 }).then((r) => r.data),
  });

  const handleApprove = async (id) => {
    try {
      await reviewAPI.approve(id);
      queryClient.invalidateQueries(["admin-reviews"]);
      toast.success("Approved");
    } catch (_) {
      toast.error("Failed");
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    try {
      await reviewAPI.delete(id);
      queryClient.invalidateQueries(["admin-reviews"]);
      toast.success("Deleted");
    } catch (_) {
      toast.error("Failed");
    }
  };

  if (isLoading) return <Loader />;
  const reviews = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Reviews</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Moderate customer reviews and ratings
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="admin-select"
        >
          <option value="">All Reviews</option>
          <option value="false">Pending Approval</option>
          <option value="true">Approved</option>
        </select>
      </div>

      {reviews.length === 0 ? (
        <div className="admin-section-card text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
            <MessageSquare size={28} className="text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="admin-card p-5 hover:border-primary-200/50 dark:hover:border-primary-700/30 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={r.product?.images?.[0]?.url || "https://placehold.co/80"}
                  alt=""
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 ring-1 ring-gray-200 dark:ring-gray-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {r.user?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">
                        {r.user?.name}
                      </span>
                    </div>
                    <Rating value={r.rating} size={12} showValue={false} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(r.createdAt)}
                    </span>
                    <Badge variant={r.isApproved ? "success" : "warning"}>
                      {r.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    on{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {r.product?.name}
                    </span>
                  </p>
                  {r.title && (
                    <p className="font-medium text-gray-800 dark:text-gray-200 mt-2 text-sm">
                      {r.title}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                    {r.comment}
                  </p>
                </div>
                <div className="flex flex-row sm:flex-col gap-2 shrink-0 items-start">
                  {!r.isApproved && (
                    <button
                      onClick={() => handleApprove(r._id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-green-500 dark:border-green-600 text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-900/20 hover:bg-green-500 hover:text-white dark:hover:bg-green-600 dark:hover:text-white transition-all duration-200"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-red-400 dark:border-red-500/50 text-red-500 dark:text-red-400 bg-red-50/50 dark:bg-red-900/20 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-all duration-200"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
