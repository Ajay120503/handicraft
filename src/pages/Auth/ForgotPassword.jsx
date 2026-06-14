import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { authAPI } from "../../api/endpoints.js";
import AuthShell from "../../components/auth/AuthShell.jsx";
import Button from "../../components/ui/Button.jsx";
import SEO from "../../components/common/SEO.jsx";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email: email.trim() });
      setSent(true);
      toast.success("Reset link sent to your email");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 404
          ? "No account found with that email"
          : "Failed to send reset email. Please try again.");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={sent ? "Check your email" : "Forgot Password?"}
      subtitle={
        sent
          ? "We sent a password reset link to your inbox."
          : "Enter your email and we'll send you a reset link."
      }
    >
      <SEO title="Forgot Password" />
      <Link
        to="/login"
        className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 mb-5"
      >
        <ArrowLeft size={16} className="mr-1" /> Back to login
      </Link>
      {sent ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Mail size={28} className="text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            We've sent a password reset link to{" "}
            <strong className="text-gray-700 dark:text-gray-200">
              {email}
            </strong>
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Didn't receive it? Check your spam folder or{" "}
            <button
              onClick={() => setSent(false)}
              className="text-primary-600 hover:underline"
            >
              try again
            </button>
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold"
          >
            Back to Login
          </Link>
        </div>
      ) : (
        <>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Send Reset Link
            </Button>
          </form>
        </>
      )}
    </AuthShell>
  );
};

export default ForgotPassword;
