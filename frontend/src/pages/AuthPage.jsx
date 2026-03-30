import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Printer, CheckCircle } from "lucide-react";
import { Button, Input, Alert } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { validateEmail, validatePassword, getPasswordStrength } from "../utils/validation";
import { toast } from "react-toastify";
import clsx from "clsx";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { isDark } = useTheme();

  // Validation for login form
  const validateLoginForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  // Validation for register form
  const validateRegisterForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const formErrors = isLogin ? validateLoginForm() : validateRegisterForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.name, formData.email, formData.password);
      }

      if (result.success) {
        toast.success(isLogin ? "Login successful!" : "Registration successful!");
        setTimeout(() => {
          navigate(result.data?.role === "admin" ? "/admin" : "/dashboard");
        }, 500);
      } else {
        setErrors({ submit: result.error });
        toast.error(result.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div
      className={clsx(
        "min-h-screen flex items-center justify-center p-4",
        isDark
          ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className={clsx(
                "p-4 rounded-full",
                isDark ? "bg-blue-900/30" : "bg-blue-100"
              )}
            >
              <Printer size={40} className="text-blue-600" />
            </motion.div>
          </div>
          <h1 className={clsx("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
            QueueLess Print
          </h1>
          <p className={clsx("mt-2", isDark ? "text-slate-400" : "text-slate-600")}>
            Smart Print Management System
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={clsx(
            "rounded-2xl shadow-2xl p-8 border",
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-100"
          )}
        >
          {/* Tab Buttons */}
          <div className="flex gap-2 mb-8">
            {["Sign In", "Create Account"].map((label, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setIsLogin(idx === 0);
                  setErrors({});
                  setFormData({ name: "", email: "", password: "", confirmPassword: "" });
                }}
                className={clsx(
                  "flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all",
                  (isLogin && idx === 0) || (!isLogin && idx === 1)
                    ? "bg-blue-600 text-white shadow-lg"
                    : isDark
                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {label}
              </motion.button>
            ))}
          </div>

          {/* Error Alert */}
          {errors.submit && (
            <Alert type="error" className="mb-6">
              {errors.submit}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Register Only) */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Input
                  label="Full Name"
                  icon={User}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrors({ ...errors, name: "" });
                  }}
                  error={errors.name}
                  required
                />
              </motion.div>
            )}

            {/* Email Field */}
            <Input
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setErrors({ ...errors, email: "" });
              }}
              error={errors.email}
              required
            />

            {/* Password Field */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className={clsx("text-sm font-semibold", isDark ? "text-slate-300" : "text-slate-700")}>
                  Password <span className="text-red-500">*</span>
                </label>
                {!isLogin && formData.password && (
                  <span
                    className={clsx(
                      "text-xs px-2 py-1 rounded",
                      passwordStrength.color === "red" ? "bg-red-100 text-red-800" :
                      passwordStrength.color === "yellow" ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    )}
                  >
                    {passwordStrength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className={clsx("absolute left-3 top-3", isDark ? "text-slate-500" : "text-slate-400")} size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors({ ...errors, password: "" });
                  }}
                  className={clsx(
                    "w-full px-4 py-2.5 pl-10 pr-10 rounded-lg border-2 transition-all",
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500",
                    errors.password && "border-red-500"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={clsx("absolute right-3 top-3", isDark ? "text-slate-500" : "text-slate-400")}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password (Register Only) */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Input
                  label="Confirm Password"
                  icon={Lock}
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    setErrors({ ...errors, confirmPassword: "" });
                  }}
                  error={errors.confirmPassword}
                  required
                />
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={loading}
              className="w-full mt-6"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {/* Footer Info */}
          <div
            className={clsx(
              "mt-8 p-4 rounded-lg border",
              isDark
                ? "bg-slate-800/50 border-slate-700"
                : "bg-slate-50 border-slate-200"
            )}
          >
            <p className={clsx("text-sm font-semibold mb-3", isDark ? "text-slate-300" : "text-slate-700")}>
              Demo Accounts:
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className={clsx("font-semibold", isDark ? "text-slate-200" : "text-slate-800")}>
                    admin@print.com
                  </p>
                  <p className={isDark ? "text-slate-400" : "text-slate-600"}>Password: admin123</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className={clsx("font-semibold", isDark ? "text-slate-200" : "text-slate-800")}>
                    student@print.com
                  </p>
                  <p className={isDark ? "text-slate-400" : "text-slate-600"}>Password: student123</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={clsx("text-center text-sm mt-8", isDark ? "text-slate-400" : "text-slate-600")}
        >
          Built with React, Express & MongoDB
        </motion.p>
      </motion.div>
    </div>
  );
}
