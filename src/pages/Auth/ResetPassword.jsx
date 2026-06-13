import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { authAPI } from "../../api/endpoints.js";
import AuthShell from "../../components/auth/AuthShell.jsx";
import SEO from "../../components/common/SEO.jsx";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validate token exists
  if (!token) {
    return (
      <AuthShell title="Invalid Reset Link" subtitle="This link is invalid or has expired.">
        <SEO title="Invalid Reset Link" />
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
            <p className="text-sm text-gray-500 mb-4">
              This password reset link is invalid or has expired.
            </p>
            <Link
              to="/forgot-password"
              className="text-primary-600 hover:underline font-medium"
            >
              Request a new reset link
            </Link>
          </div>
      </AuthShell>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword(token, { password });
      setIsSuccess(true);
      toast.success("Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to reset password. The link may have expired.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthShell title="Password Reset" subtitle="Your password has been successfully updated.">
        <SEO title="Password Reset" />
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Lock size={28} className="text-green-600" />
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Your password has been successfully reset. Redirecting to login...
            </p>
            <Link
              to="/login"
              className="text-primary-600 hover:underline font-medium"
            >
              Go to Login
            </Link>
          </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Reset Password" subtitle="Enter your new password">
      <SEO title="Reset Password" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                New Password
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold"
            >
              Back to login
            </Link>
          </p>
    </AuthShell>
  );
};

export default ResetPassword;
