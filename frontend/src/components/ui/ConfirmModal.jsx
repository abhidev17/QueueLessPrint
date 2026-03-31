import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  type = "warning" // "warning" | "danger" | "info"
}) {
  const typeConfig = {
    warning: {
      icon: AlertTriangle,
      cancelBg: "bg-slate-100 hover:bg-slate-200 text-slate-900",
      confirmBg: "bg-amber-600 hover:bg-amber-700 text-white"
    },
    danger: {
      icon: AlertTriangle,
      cancelBg: "bg-slate-100 hover:bg-slate-200 text-slate-900",
      confirmBg: "bg-red-600 hover:bg-red-700 text-white"
    },
    info: {
      icon: AlertTriangle,
      cancelBg: "bg-slate-100 hover:bg-slate-200 text-slate-900",
      confirmBg: "bg-blue-600 hover:bg-blue-700 text-white"
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-md mx-4"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-lg flex-shrink-0 ${type === "danger" ? "bg-red-100" : type === "warning" ? "bg-amber-100" : "bg-blue-100"}`}>
                    <Icon
                      className={type === "danger" ? "text-red-600" : type === "warning" ? "text-amber-600" : "text-blue-600"}
                      size={24}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                  </div>
                </div>
                <button
                  onClick={onCancel}
                  className="text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Message */}
              <p className="text-slate-600 mb-6">{message}</p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${config.cancelBg}`}
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${config.confirmBg}`}
                >
                  {isLoading ? "Processing..." : confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
