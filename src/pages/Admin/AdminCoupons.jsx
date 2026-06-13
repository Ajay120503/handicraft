import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { couponAPI } from "../../api/endpoints.js";
import { formatDate } from "../../utils/helpers.js";
import Loader from "../../components/ui/Loader.jsx";
import Modal from "../../components/ui/Modal.jsx";
import toast from "react-hot-toast";

const AdminCoupons = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: 0,
    maxDiscountAmount: "",
    usageLimit: "",
    usagePerUser: 1,
    validUntil: "",
  });
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: () => couponAPI.getAll().then((r) => r.data.data),
  });

  const openModal = (c) => {
    if (c) {
      setEditing(c);
      setForm({
        code: c.code,
        name: c.name,
        description: c.description || "",
        discountType: c.discountType,
        discountValue: c.discountValue,
        minOrderAmount: c.minOrderAmount,
        maxDiscountAmount: c.maxDiscountAmount || "",
        usageLimit: c.usageLimit || "",
        usagePerUser: c.usagePerUser,
        validUntil: c.validUntil ? c.validUntil.substring(0, 10) : "",
      });
    } else {
      setEditing(null);
      setForm({
        code: "",
        name: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: 0,
        maxDiscountAmount: "",
        usageLimit: "",
        usagePerUser: 1,
        validUntil: "",
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount),
        maxDiscountAmount: form.maxDiscountAmount
          ? Number(form.maxDiscountAmount)
          : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        usagePerUser: Number(form.usagePerUser),
        validUntil: new Date(form.validUntil).toISOString(),
      };
      if (editing) await couponAPI.update(editing._id, data);
      else await couponAPI.create(data);
      toast.success(editing ? "Updated" : "Created");
      queryClient.invalidateQueries(["admin-coupons"]);
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    try {
      await couponAPI.delete(id);
      queryClient.invalidateQueries(["admin-coupons"]);
      toast.success("Deleted");
    } catch (_) {
      toast.error("Failed");
    }
  };

  if (isLoading) return <Loader />;
  const coupons = data || [];

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Coupons</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create and manage discount coupons
          </p>
        </div>
        <button onClick={() => openModal(null)} className="admin-btn-primary">
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Discount</th>
                <th>Min Order</th>
                <th>Used/Limit</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td>
                    <span className="font-mono font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1 rounded-lg text-xs">
                      {c.code}
                    </span>
                  </td>
                  <td className="font-medium text-gray-900 dark:text-white">
                    {c.name}
                  </td>
                  <td className="text-gray-900 dark:text-white font-semibold">
                    {c.discountType === "percentage" ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {c.discountValue}%
                      </span>
                    ) : (
                      "₹" + c.discountValue
                    )}
                  </td>
                  <td className="text-gray-600 dark:text-gray-400">
                    <span className="text-sm">₹{c.minOrderAmount}</span>
                  </td>
                  <td className="text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {c.usedCount}
                      </span>
                      <span className="text-gray-400 dark:text-gray-600">
                        /
                      </span>
                      <span>{c.usageLimit || "∞"}</span>
                    </div>
                  </td>
                  <td className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {formatDate(c.validUntil)}
                  </td>
                  <td>
                    <span
                      className={
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium " +
                        (c.isActive
                          ? "admin-badge-success"
                          : "admin-badge-danger")
                      }
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          c.isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => openModal(c)}
                        className="admin-action-edit"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="admin-action-delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="admin-empty-state">
                      <div className="admin-empty-state-icon">
                        <Ticket size={28} className="text-gray-400" />
                      </div>
                      <p className="admin-empty-state-text">No coupons found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Coupon" : "Add Coupon"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              placeholder="Code"
              required
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
            />
            <input
              className="input"
              placeholder="Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <textarea
            className="input"
            rows={2}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid grid-cols-3 gap-2">
            <select
              className="input"
              value={form.discountType}
              onChange={(e) =>
                setForm({ ...form, discountType: e.target.value })
              }
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
            <input
              className="input"
              type="number"
              placeholder="Discount Value"
              required
              value={form.discountValue}
              onChange={(e) =>
                setForm({ ...form, discountValue: e.target.value })
              }
            />
            <input
              className="input"
              type="number"
              placeholder="Max Discount"
              value={form.maxDiscountAmount}
              onChange={(e) =>
                setForm({ ...form, maxDiscountAmount: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input
              className="input"
              type="number"
              placeholder="Min Order"
              value={form.minOrderAmount}
              onChange={(e) =>
                setForm({ ...form, minOrderAmount: e.target.value })
              }
            />
            <input
              className="input"
              type="number"
              placeholder="Usage Limit"
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
            />
            <input
              className="input"
              type="number"
              placeholder="Per User"
              value={form.usagePerUser}
              onChange={(e) =>
                setForm({ ...form, usagePerUser: e.target.value })
              }
            />
          </div>
          <input
            className="input"
            type="date"
            placeholder="Valid Until"
            required
            value={form.validUntil}
            onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
          />
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-xl text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCoupons;
