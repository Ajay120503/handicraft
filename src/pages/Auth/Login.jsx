import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../store/authStore.js";
import AuthShell from "../../components/auth/AuthShell.jsx";
import SEO from "../../components/common/SEO.jsx";
import Button from "../../components/ui/Button.jsx";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form);
      toast.success("Welcome back!");
      const redirect = user?.role === "admin" ? "/admin" : "/";
      const from = location.state?.from?.pathname;
      navigate(from || redirect, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? "Invalid email or password"
          : "Login failed. Please try again.");
      toast.error(msg);
    }
  };

  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to your account">
      <SEO title="Login" />
      <form onSubmit={handleSubmit} className="space-y-4">
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
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
              placeholder="••••••••"
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
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
            <input type="checkbox" className="rounded accent-primary-600" />{" "}
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
          >
            Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Sign In
        </Button>
      </form>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold"
        >
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
};

export default Login;
