import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User as UserIcon, Phone, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../store/authStore.js";
import AuthShell from "../../components/auth/AuthShell.jsx";
import SEO from "../../components/common/SEO.jsx";
import Button from "../../components/ui/Button.jsx";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      await register(form);
      toast.success("Welcome to Handmate!");
      navigate("/", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 400
          ? "An account with this email already exists"
          : "Registration failed. Please try again.");
      toast.error(msg);
    }
  };

  return (
    <AuthShell
      title="Create Account"
      subtitle="Join Handmate and start shopping"
    >
      <SEO title="Create Account" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <UserIcon
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              required
              minLength={2}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
              placeholder="Your name"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Phone (optional)
          </label>
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
              placeholder="+91 9876543210"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type={showPass ? "text" : "password"}
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
              placeholder="At least 6 characters"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Create Account
        </Button>
      </form>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
};

export default Register;
