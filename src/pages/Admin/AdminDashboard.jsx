import { useQuery } from "@tanstack/react-query";
import {
  ShoppingBag,
  Users,
  Package,
  IndianRupee,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Tag,
} from "lucide-react";
import { analyticsAPI } from "../../api/endpoints.js";
import { formatPrice } from "../../utils/helpers.js";
import Loader from "../../components/ui/Loader.jsx";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => analyticsAPI.getDashboard().then((r) => r.data.data),
  });
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  const stats = data || {};

  const cards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: IndianRupee,
      gradient: "from-emerald-500 to-green-600",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      label: "Total Orders",
      value: stats.totalOrders || 0,
      icon: ShoppingBag,
      gradient: "from-primary-500 to-pink-600",
      trend: "+8.2%",
      trendUp: true,
    },
    {
      label: "Total Customers",
      value: stats.totalCustomers || 0,
      icon: Users,
      gradient: "from-secondary-500 to-purple-600",
      trend: "+15.3%",
      trendUp: true,
    },
    {
      label: "Total Products",
      value: stats.totalProducts || 0,
      icon: Package,
      gradient: "from-blue-500 to-indigo-600",
      trend: "+5.1%",
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="admin-card-grid">
        {cards.map((c, i) => (
          <div key={i} className="admin-stat-card group">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`admin-stat-icon bg-gradient-to-br ${c.gradient}`}
              >
                <c.icon size={22} />
              </div>
              <span
                className={
                  "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full " +
                  (c.trendUp
                    ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30"
                    : "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30")
                }
              >
                <TrendingUp
                  size={11}
                  className={c.trendUp ? "" : "rotate-180"}
                />{" "}
                {c.trend}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-105 origin-left transition-transform duration-300">
              {c.value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
              {c.label}
            </p>
          </div>
        ))}
      </div>

      {/* Stats Grid + Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="admin-section-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
              Overview
            </h2>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              This Month
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Today Orders",
                value: stats.todayOrders || 0,
                icon: ShoppingBag,
                color: "text-primary-600 dark:text-primary-400",
              },
              {
                label: "Month Orders",
                value: stats.monthOrders || 0,
                icon: Package,
                color: "text-blue-600 dark:text-blue-400",
              },
              {
                label: "Month Revenue",
                value: formatPrice(stats.monthRevenue),
                icon: IndianRupee,
                color: "text-emerald-600 dark:text-emerald-400",
              },
              {
                label: "Pending Orders",
                value: stats.pendingOrders || 0,
                icon: AlertCircle,
                color: "text-amber-600 dark:text-amber-400",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-50/50 dark:from-primary-900/20 dark:to-gray-800/50 border border-primary-100 dark:border-primary-800/50 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <item.icon size={14} className={item.color} />
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {item.label}
                  </p>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-section-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertCircle
                size={16}
                className="text-amber-600 dark:text-amber-400"
              />
            </div>
            <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
              Low Stock
            </h2>
          </div>
          {stats.lowStock && stats.lowStock.length > 0 ? (
            <div className="space-y-2">
              {stats.lowStock.slice(0, 5).map((p) => (
                <div
                  key={p._id}
                  className="flex justify-between items-center px-3 py-2.5 rounded-lg bg-red-50/80 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {p.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400 shrink-0 ml-2">
                    {p.stock}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Package
                  size={20}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                All products well-stocked ✓
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/orders"
            className="group admin-card p-5 hover:border-primary-200 dark:hover:border-primary-700/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag
                    size={20}
                    className="text-primary-600 dark:text-primary-400"
                  />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white">
                    Manage Orders
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    View, update, and track orders
                  </p>
                </div>
              </div>
              <ArrowRight
                size={18}
                className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300"
              />
            </div>
          </Link>

          <Link
            to="/admin/products"
            className="group admin-card p-5 hover:border-primary-200 dark:hover:border-primary-700/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Package
                    size={20}
                    className="text-primary-600 dark:text-primary-400"
                  />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white">
                    Manage Products
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Add, edit, and organize products
                  </p>
                </div>
              </div>
              <ArrowRight
                size={18}
                className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300"
              />
            </div>
          </Link>

          <Link
            to="/admin/categories"
            className="group admin-card p-5 hover:border-primary-200 dark:hover:border-primary-700/50 transition-all duration-300 sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Tag
                    size={20}
                    className="text-primary-600 dark:text-primary-400"
                  />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white">
                    Categories
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Organize product categories
                  </p>
                </div>
              </div>
              <ArrowRight
                size={18}
                className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
