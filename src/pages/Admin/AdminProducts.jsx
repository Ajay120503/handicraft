import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { productAPI, categoryAPI } from "../../api/endpoints.js";
import { formatPrice, getPlaceholderImage } from "../../utils/helpers.js";
import Loader from "../../components/ui/Loader.jsx";
import Modal from "../../components/ui/Modal.jsx";
import Badge from "../../components/ui/Badge.jsx";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimerRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    shortDescription: "",
    basePrice: "",
    discountPrice: "",
    category: "",
    tags: "",
    fabric: "",
    material: "",
    fitType: "Regular",
    style: "",
    pattern: "",
    season: "All Season",
    occasion: "Casual",
    careInstructions: "",
    sizes: "S:0, M:0, L:0",
    colors: "Pink:#ec4899",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isTrending: false,
    isCustomizable: true,
    hasStitchingOption: false,
  });
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  // Debounce search input — only query after user stops typing for 300ms
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", debouncedSearch],
    queryFn: () =>
      productAPI
        .getAll({ search: debouncedSearch, limit: 100 })
        .then((r) => r.data),
  });
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryAPI.getAll().then((r) => r.data.data),
  });

  const openModal = (p) => {
    if (p) {
      setEditing(p);
      setForm({
        name: p.name,
        description: p.description,
        shortDescription: p.shortDescription || "",
        basePrice: p.basePrice || p.price || "",
        discountPrice: p.discountPrice || "",
        category: p.category?._id || "",
        tags: (p.tags || []).join(","),
        fabric: p.fabric || "",
        material: p.material || "",
        fitType: p.fitType || "Regular",
        style: p.style || "",
        pattern: p.pattern || "",
        season: (p.season || ["All Season"]).join(", "),
        occasion: (p.occasion || ["Casual"]).join(", "),
        careInstructions: (p.careInstructions || []).join(", "),
        sizes: (p.sizes || [])
          .map((s) => `${s.size}:${s.stock}${s.price ? `:${s.price}` : ""}`)
          .join(", "),
        colors: (p.colors || []).map((c) => `${c.name}:${c.hex}`).join(", "),
        isFeatured: p.isFeatured,
        isBestSeller: p.isBestSeller,
        isNewArrival: p.isNewArrival || false,
        isTrending: p.isTrending || false,
        isCustomizable: p.isCustomizable ?? true,
        hasStitchingOption: p.hasStitchingOption || false,
      });
    } else {
      setEditing(null);
      setForm({
        name: "",
        description: "",
        shortDescription: "",
        basePrice: "",
        discountPrice: "",
        category: "",
        tags: "",
        fabric: "",
        material: "",
        fitType: "Regular",
        style: "",
        pattern: "",
        season: "All Season",
        occasion: "Casual",
        careInstructions: "",
        sizes: "S:0, M:0, L:0",
        colors: "Pink:#ec4899",
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        isTrending: false,
        isCustomizable: true,
        hasStitchingOption: false,
      });
    }
    setFiles([]);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "sizes") {
          const sizes = String(v)
            .split(",")
            .map((item) => {
              const [size, stock = "0", price] = item
                .split(":")
                .map((s) => s.trim());
              return {
                size,
                stock: Number(stock) || 0,
                price: Number(price || form.basePrice) || 0,
                isAvailable: Number(stock) > 0,
              };
            })
            .filter((item) => item.size);
          fd.append(k, JSON.stringify(sizes));
          return;
        }
        if (k === "colors") {
          const colors = String(v)
            .split(",")
            .map((item) => {
              const [name, hex = "#ec4899"] = item
                .split(":")
                .map((s) => s.trim());
              return { name, hex, isAvailable: true };
            })
            .filter((item) => item.name);
          fd.append(k, JSON.stringify(colors));
          return;
        }
        fd.append(k, v);
      });
      files.forEach((f) => fd.append("images", f));
      if (editing) await productAPI.update(editing._id, fd);
      else await productAPI.create(fd);
      toast.success(editing ? "Product updated" : "Product created");
      queryClient.invalidateQueries(["admin-products"]);
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
      await productAPI.delete(id);
      queryClient.invalidateQueries(["admin-products"]);
      toast.success("Deleted");
    } catch (_) {
      toast.error("Failed");
    }
  };

  if (isLoading) return <Loader />;
  const products = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your product inventory
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="admin-search-input"
            />
          </div>
          <button onClick={() => openModal(null)} className="admin-btn-primary">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0]?.url || getPlaceholderImage(p.name)}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-gray-200 dark:ring-gray-700"
                      />
                      <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-xs font-medium">
                      {p.category?.name || "-"}
                    </span>
                  </td>
                  <td className="font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-1.5">
                      {p.discountPrice && p.discountPrice < p.basePrice ? (
                        <>
                          <span className="text-primary-600 dark:text-primary-400">
                            {formatPrice(p.discountPrice)}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(p.basePrice)}
                          </span>
                        </>
                      ) : (
                        formatPrice(p.discountPrice || p.basePrice || p.price)
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      className={
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium " +
                        ((p.inStockCount ?? p.stock ?? 0) < 5
                          ? "admin-badge-danger"
                          : (p.inStockCount ?? p.stock ?? 0) < 20
                          ? "admin-badge-warning"
                          : "admin-badge-success")
                      }
                    >
                      <span
                        className={
                          "w-1.5 h-1.5 rounded-full " +
                          ((p.inStockCount ?? p.stock ?? 0) < 5
                            ? "bg-red-500"
                            : (p.inStockCount ?? p.stock ?? 0) < 20
                            ? "bg-amber-500"
                            : "bg-green-500")
                        }
                      />
                      {p.inStockCount ?? p.stock ?? 0}
                    </span>
                  </td>
                  <td>
                    <Badge variant={p.isAvailable ? "success" : "danger"}>
                      {p.isAvailable ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => openModal(p)}
                        className="admin-action-edit"
                        title="Edit"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="admin-action-delete"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="admin-empty-state">
                      <div className="admin-empty-state-icon">
                        <Package size={28} className="text-gray-400" />
                      </div>
                      <p className="admin-empty-state-text">
                        No products found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Product" : "Add Product"}
        size="xl"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-3 max-h-[70vh] overflow-y-auto px-1 py-1"
        >
          <input
            className="input"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            className="input"
            rows={3}
            placeholder="Description"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              type="number"
              placeholder="Base Price"
              required
              value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
            />
            <input
              className="input"
              type="number"
              placeholder="Discount Price"
              value={form.discountPrice}
              onChange={(e) =>
                setForm({ ...form, discountPrice: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              className="input"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select category</option>
              {(categoriesData || []).map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              className="input"
              value={form.fitType}
              onChange={(e) => setForm({ ...form, fitType: e.target.value })}
            >
              {[
                "Regular",
                "Slim",
                "Oversized",
                "Relaxed",
                "Body-hugging",
                "A-line",
                "Empire",
                "Flared",
                "Asymmetric",
              ].map((fit) => (
                <option key={fit} value={fit}>
                  {fit}
                </option>
              ))}
            </select>
          </div>
          <input
            className="input"
            placeholder="Short Description"
            value={form.shortDescription}
            onChange={(e) =>
              setForm({ ...form, shortDescription: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              placeholder="Fabric (e.g. Cotton)"
              value={form.fabric}
              onChange={(e) => setForm({ ...form, fabric: e.target.value })}
            />
            <input
              className="input"
              placeholder="Material (e.g. 100% cotton)"
              value={form.material}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              placeholder="Style (e.g. Kurti, Dress)"
              value={form.style}
              onChange={(e) => setForm({ ...form, style: e.target.value })}
            />
            <input
              className="input"
              placeholder="Pattern (e.g. Floral)"
              value={form.pattern}
              onChange={(e) => setForm({ ...form, pattern: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              placeholder="Season (comma separated)"
              value={form.season}
              onChange={(e) => setForm({ ...form, season: e.target.value })}
            />
            <input
              className="input"
              placeholder="Occasion (comma separated)"
              value={form.occasion}
              onChange={(e) => setForm({ ...form, occasion: e.target.value })}
            />
          </div>
          <input
            className="input"
            placeholder="Care instructions (comma separated)"
            value={form.careInstructions}
            onChange={(e) =>
              setForm({ ...form, careInstructions: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              placeholder="Sizes as Size:Stock or Size:Stock:Price"
              value={form.sizes}
              onChange={(e) => setForm({ ...form, sizes: e.target.value })}
            />
            <input
              className="input"
              placeholder="Colors as Name:#hex"
              value={form.colors}
              onChange={(e) => setForm({ ...form, colors: e.target.value })}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              "isFeatured",
              "isBestSeller",
              "isNewArrival",
              "isTrending",
              "isCustomizable",
              "hasStitchingOption",
            ].map((k) => (
              <label
                key={k}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form[k]}
                  onChange={(e) => setForm({ ...form, [k]: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                {k
                  .replace("is", "")
                  .replace(/([A-Z])/g, " $1")
                  .trim()}
              </label>
            ))}
          </div>
          <div>
            <label className="label">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="input"
            />
          </div>
          <div className="flex gap-2 pt-2">
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

export default AdminProducts;
