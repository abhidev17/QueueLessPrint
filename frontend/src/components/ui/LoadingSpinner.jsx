import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function LoadingSpinner({ size = "md", fullPage = false, message = "Loading..." }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={`${sizeClasses[size]} text-indigo-600`} />
      </motion.div>
      {message && <p className="text-slate-600 text-sm font-medium">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

// Skeleton Loader for Cards
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-slate-200 rounded-lg flex-shrink-0"></div>
        <div className="flex-1">
          <div className="h-5 bg-slate-200 rounded-md mb-2 w-3/4"></div>
          <div className="h-4 bg-slate-100 rounded w-1/2"></div>
        </div>
        <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="h-12 bg-slate-100 rounded"></div>
        <div className="h-12 bg-slate-100 rounded"></div>
        <div className="h-12 bg-slate-100 rounded"></div>
        <div className="h-12 bg-slate-100 rounded"></div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-slate-100 rounded"></div>
        <div className="flex-1 h-10 bg-slate-100 rounded"></div>
      </div>
    </div>
  );
}
