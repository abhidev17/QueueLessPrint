import { Search, Filter, X } from "lucide-react";
import { motion } from "framer-motion";

export function FilterBar({
  searchValue,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  filters = [],
  clearable = true
}) {
  const hasActiveFilters = searchValue || (selectedFilter && selectedFilter !== "all");

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-slate-200 p-4 space-y-4"
    >
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>

      {/* Filter Buttons */}
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
            <Filter size={16} />
            Filter:
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => onFilterChange(filter.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === filter.value
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {clearable && hasActiveFilters && (
        <button
          onClick={() => {
            onSearchChange("");
            onFilterChange("all");
          }}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
        >
          <X size={16} />
          Clear filters
        </button>
      )}
    </motion.div>
  );
}
