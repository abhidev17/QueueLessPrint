import { useState, useEffect, useRef } from "react";
import API from "../api";
import { Upload, Calendar, Copy, FileText, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

function StudentPageNew({ user }) {
  const fileInputRef = useRef(null);
  
  const [copies, setCopies] = useState(1);
  const [pageSize, setPageSize] = useState("A4");
  const [color, setColor] = useState(false);
  const [priority, setPriority] = useState("normal");
  const [slotTime, setSlotTime] = useState("10:00 AM");
  const [printDate, setPrintDate] = useState(new Date().toISOString().split("T")[0]);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Reset print form to initial state
  const resetPrintForm = () => {
    setFile(null);
    setPreviewUrl("");
    setCopies(1);
    setPageSize("A4");
    setColor(false);
    setPriority("normal");
    setSlotTime("10:00 AM");
    setPrintDate(new Date().toISOString().split("T")[0]);
    
    // Reset file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle file change with preview
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected) {
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
    }
  };

  const safeSlots = Array.isArray(slots)
    ? slots.filter((slot) => slot && typeof slot === "object" && slot.slot)
    : [];

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) {
      loadSlots();
    }
  }, [printDate, isAdmin]);

  const loadSlots = async () => {
    try {
      const res = await API.get(`/print/slots?printDate=${printDate}`);
      if (Array.isArray(res.data)) {
        const normalizedSlots = res.data
          .filter((slot) => slot && typeof slot === "object" && slot.slot)
          .map((slot) => ({
            slot: slot.slot,
            available: Number.isFinite(Number(slot.available)) ? Number(slot.available) : 0
          }));
        setSlots(normalizedSlots);
      } else {
        setSlots([]);
      }
    } catch (err) {
      console.error("Error loading slots:", err);
      setSlots([]);
      toast.error("Failed to load available slots");
    }
  };

  // If user is admin, show unauthorized message
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center max-w-md shadow-2xl">
          <AlertCircle className="mx-auto mb-4 text-amber-500" size={48} />
          <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
          <p className="text-slate-300">
            This page is for students only. Please use the Admin Panel to manage print jobs.
          </p>
        </div>
      </div>
    );
  }

  const submitPrint = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("copies", copies);
    formData.append("pageSize", pageSize);
    formData.append("color", color);
    formData.append("printDate", printDate);
    formData.append("slotTime", slotTime);
    formData.append("priority", priority);
    formData.append("document", file);

    setLoading(true);
    try {
      await API.post("/print/create", formData);
      toast.success("🎉 Print job submitted successfully!");
      resetPrintForm();
      loadSlots();
    } catch (err) {
      console.error("Print submission error:", err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to submit print job";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 pb-32">
        {/* Floating Header */}
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/40 border-b border-white/10 shadow-lg transition-all duration-300">
          <div className="max-w-2xl mx-auto px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Upload className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  Submit Print Job <Sparkles size={20} className="text-yellow-400" />
                </h1>
                <p className="text-slate-400 text-sm">Upload and schedule your document</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
          {/* Main Form Card - Glass Effect */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:bg-white/[0.07] transition-all duration-300">
            <form onSubmit={submitPrint} className="space-y-6">
              {/* File Upload - Modern Design */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Upload size={18} className="text-blue-400" />
                  Upload Document
                </label>
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
                  <div className="relative border-2 border-dashed border-blue-400/50 group-hover:border-blue-400 rounded-2xl p-8 text-center bg-gradient-to-br from-blue-500/5 to-indigo-600/5 hover:from-blue-500/10 hover:to-indigo-600/10 transition-all duration-300 cursor-pointer">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-input"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                    />
                    <label htmlFor="file-input" className="cursor-pointer block">
                      <Upload className="mx-auto mb-3 text-blue-400 group-hover:text-blue-300 transition" size={40} />
                      <p className="text-white font-semibold">
                        {file ? (
                          <span className="text-green-400 flex items-center justify-center gap-2">
                            ✓ {file.name}
                          </span>
                        ) : (
                          <>Click to upload or drag & drop</>
                        )}
                      </p>
                      <p className="text-slate-400 text-sm mt-1">PDF, DOC, Images • Max 50MB</p>
                    </label>
                  </div>
                </div>
              </div>

              {/* File Preview */}
              {previewUrl && (
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-blue-400/30 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-blue-300 mb-3 flex items-center gap-2">
                    <FileText size={16} /> Preview:
                  </p>
                  
                  {/* PDF Preview */}
                  {file.type === "application/pdf" && (
                    <iframe
                      src={previewUrl}
                      className="w-full h-48 border border-blue-400/30 rounded-lg bg-black/20"
                      title="PDF Preview"
                    />
                  )}

                  {/* Image Preview */}
                  {file.type.startsWith("image/") && (
                    <img
                      src={previewUrl}
                      alt="Document preview"
                      className="w-full max-h-48 object-contain border border-blue-400/30 rounded-lg bg-black/20 p-2"
                    />
                  )}

                  {/* Other File Types */}
                  {!file.type.startsWith("image/") && file.type !== "application/pdf" && (
                    <div className="bg-white/5 p-4 rounded-lg border border-blue-400/30 text-center">
                      <FileText className="mx-auto mb-2 text-blue-400" size={32} />
                      <p className="text-slate-300 font-medium text-sm">{file.name}</p>
                      <p className="text-slate-500 text-xs">Ready to print</p>
                    </div>
                  )}
                </div>
              )}

              {/* Settings Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Calendar size={16} /> Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={printDate}
                      onChange={(e) => setPrintDate(e.target.value)}
                      min={minDate}
                      max={maxDate}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition"
                    />
                  </div>
                </div>

                {/* Copies */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Copy size={16} /> Copies
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={copies}
                    onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                </div>

                {/* Page Size */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Page Size</label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition cursor-pointer"
                  >
                    <option value="A4">A4</option>
                    <option value="A3">A3</option>
                    <option value="Letter">Letter</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High 🔥</option>
                  </select>
                </div>
              </div>

              {/* Color Option */}
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-600/10 border border-blue-400/30 rounded-xl p-4 flex items-center gap-3 hover:bg-gradient-to-r hover:from-blue-500/15 hover:to-indigo-600/15 transition">
                <input
                  type="checkbox"
                  id="color"
                  checked={color}
                  onChange={(e) => setColor(e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded cursor-pointer accent-blue-500"
                />
                <label htmlFor="color" className="text-sm font-medium text-white cursor-pointer flex-1">
                  Color Printing <span className="text-slate-400 text-xs ml-1">(+₹5 per page)</span>
                </label>
              </div>

              {/* Slot Selection */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Time Slot</label>
                <select
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition cursor-pointer"
                >
                  {safeSlots.length > 0 ? (
                    safeSlots.map(slot => (
                      <option key={slot.slot} value={slot.slot} disabled={slot.available === 0}>
                        {slot.slot} ({slot.available} spots)
                      </option>
                    ))
                  ) : (
                    <option>loading slots...</option>
                  )}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !file}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg hover:shadow-blue-500/50 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Submit Print Job
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Time Slots Card - Glass Effect */}
          {safeSlots.length > 0 && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-blue-400" />
                Available Time Slots
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {safeSlots.map(slot => {
                  const isFull = slot.available === 0;
                  return (
                    <div
                      key={slot.slot}
                      className={`p-3 rounded-lg text-center border-2 transition-all duration-300 ${
                        isFull
                          ? "bg-red-500/10 border-red-500/30 text-slate-400"
                          : "bg-green-500/10 border-green-500/30 hover:border-green-500 hover:bg-green-500/20"
                      } cursor-pointer`}
                    >
                      <p className="font-semibold text-white text-sm">{slot.slot}</p>
                      <p className={`text-xs font-bold mt-1 ${isFull ? "text-red-400" : "text-green-400"}`}>
                        {isFull ? "🔴 FULL" : `🟢 ${slot.available} spots`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default StudentPageNew;
