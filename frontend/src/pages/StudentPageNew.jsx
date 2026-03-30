import { useState, useEffect, useRef } from "react";
import API from "../api";
import { Upload, Calendar, Copy, FileText, Loader2, AlertCircle } from "lucide-react";
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
          <AlertCircle className="mx-auto mb-4 text-amber-600" size={48} />
          <h2 className="text-2xl font-bold text-amber-900 mb-2">Admin Access</h2>
          <p className="text-amber-800">
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
      toast.success("Print job submitted successfully!");
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
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50 pb-32">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white sticky top-0 z-10 shadow-lg">
          <div className="max-w-md mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold">🖨️ Print Job</h1>
            <p className="text-cyan-100 text-sm">Upload and submit your document</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          {/* Form Card */}
          <div className="bg-white shadow-lg rounded-2xl p-5 space-y-5">
            <form onSubmit={submitPrint} className="space-y-5">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  📄 Upload Document
                </label>
                <div className="border-2 border-dashed border-cyan-300 rounded-xl p-6 text-center hover:border-cyan-500 bg-cyan-50/40 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                  />
                  <label htmlFor="file-input" className="cursor-pointer">
                    <Upload className="mx-auto mb-2 text-cyan-700" size={28} />
                    <p className="text-sm text-slate-600">
                      {file ? (
                        <span className="text-green-600 font-semibold">✓ {file.name}</span>
                      ) : (
                        <>Tap to upload</>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">PDF, DOC, Images</p>
                  </label>
                </div>
              </div>

              {/* File Preview */}
              {previewUrl && (
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-3">
                  <p className="text-xs font-semibold text-slate-700 mb-2">📋 Preview:</p>
                  
                  {/* PDF Preview */}
                  {file.type === "application/pdf" && (
                    <iframe
                      src={previewUrl}
                      className="w-full h-48 border border-cyan-300 rounded-lg"
                      title="PDF Preview"
                    />
                  )}

                  {/* Image Preview */}
                  {file.type.startsWith("image/") && (
                    <img
                      src={previewUrl}
                      alt="Document preview"
                      className="w-full max-h-48 object-contain border border-cyan-300 rounded-lg"
                    />
                  )}

                  {/* Other File Types */}
                  {!file.type.startsWith("image/") && file.type !== "application/pdf" && (
                    <div className="bg-white p-3 rounded-lg border border-cyan-300 text-center">
                      <FileText className="mx-auto mb-1 text-cyan-600" size={24} />
                      <p className="text-xs text-slate-600 font-medium">{file.name}</p>
                      <p className="text-xs text-slate-500">Ready to print</p>
                    </div>
                  )}
                </div>
              )}

              {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Print Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-slate-400" size={20} />
                      <input
                        type="date"
                        value={printDate}
                        onChange={(e) => setPrintDate(e.target.value)}
                        min={minDate}
                        max={maxDate}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>

                  {/* Copies */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Number of Copies
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={copies}
                      onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                      className="input-field"
                    />
                  </div>

                  {/* Page Size */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Page Size
                    </label>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value)}
                      className="input-field"
                    >
                      <option>A4</option>
                      <option>A3</option>
                      <option>Letter</option>
                    </select>
                  </div>

                  {/* Color Option */}
                  <div className="flex items-center gap-3 p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                    <input
                      type="checkbox"
                      id="color"
                      checked={color}
                      onChange={(e) => setColor(e.target.checked)}
                      className="w-4 h-4 text-cyan-600 rounded"
                    />
                    <label htmlFor="color" className="text-sm font-medium text-slate-700 cursor-pointer">
                      Color Printing (₹5 extra per page)
                    </label>
                  </div>

                  {/* Priority Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Priority (Optional)
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High (Urgent)</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-2">
                      Higher priority jobs are processed first in the queue
                    </p>
                  </div>

                  {/* Slot Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Select Time Slot
                    </label>
                    <select
                      value={slotTime}
                      onChange={(e) => setSlotTime(e.target.value)}
                      className="input-field"
                    >
                      {safeSlots.map(slot => (
                        <option key={slot.slot} value={slot.slot} disabled={slot.available === 0}>
                          {slot.slot} ({slot.available} available)
                        </option>
                      ))}
                    </select>
                  </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !file}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Submit Print Job
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Slot Availability Card */}
          <div className="bg-white shadow-lg rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Calendar size={18} />
              ⏰ Today's Slots
            </h3>
            <div className="space-y-2">
              {safeSlots.map(slot => {
                const isFull = slot.available === 0;
                return (
                  <div
                    key={slot.slot}
                    className={`p-3 rounded-lg text-center border-2 transition-colors ${
                      isFull
                        ? "bg-red-50 border-red-200"
                        : "bg-green-50 border-green-200"
                    }`}
                  >
                    <p className="font-semibold text-slate-900 text-sm">{slot.slot}</p>
                    <p className={`text-xs font-semibold ${isFull ? "text-red-700" : "text-green-700"}`}>
                      {isFull ? "🔴 FULL" : `🟢 ${slot.available} spots`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-xl">
          <div className="max-w-md mx-auto flex justify-around py-3 px-4">
            <button className="flex flex-col items-center gap-1 text-slate-600 hover:text-cyan-600 transition-colors">
              <span className="text-xl">🏠</span>
              <span className="text-xs font-medium">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-cyan-600 bg-cyan-50 p-2 rounded-lg">
              <span className="text-xl">📄</span>
              <span className="text-xs font-medium">Jobs</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-600 hover:text-cyan-600 transition-colors">
              <span className="text-xl">👤</span>
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentPageNew;
