import { useState, useEffect } from "react";
import API from "../api";
import { Upload, Calendar, Copy, FileText, Loader } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

function StudentPage() {
  const [copies, setCopies] = useState(1);
  const [pageSize, setPageSize] = useState("A4");
  const [color, setColor] = useState(false);
  const [slotTime, setSlotTime] = useState("10:00 AM");
  const [printDate, setPrintDate] = useState(new Date().toISOString().split("T")[0]);
  const [file, setFile] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSlots();
  }, [printDate]);

  const loadSlots = async () => {
    try {
      const res = await API.get(`/print/slots?printDate=${printDate}`);
      setSlots(res.data);
    } catch (err) {
      toast.error("Failed to load available slots");
    }
  };

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
    formData.append("document", file);

    setLoading(true);
    try {
      await API.post("/print/create", formData);
      toast.success("Print job submitted successfully!");
      setFile(null);
      setCopies(1);
      setPageSize("A4");
      setColor(false);
      loadSlots();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit print job");
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Submit Print Job</h1>
            <p className="text-gray-600">Upload your document and choose your preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="card">
                <form onSubmit={submitPrint} className="space-y-6">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Upload Document
                    </label>
                    <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                        id="file-input"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                      />
                      <label htmlFor="file-input" className="cursor-pointer">
                        <Upload className="mx-auto mb-3 text-indigo-600" size={32} />
                        <p className="text-sm text-gray-600">
                          {file ? (
                            <>File: {file.name}</>
                          ) : (
                            <>Click to upload or drag and drop</>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">Supported: PDF, DOC, DOCX, TXT, Images</p>
                      </label>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Print Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
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
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                  <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="color"
                      checked={color}
                      onChange={(e) => setColor(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <label htmlFor="color" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Color Printing (₹5 extra per page)
                    </label>
                  </div>

                  {/* Slot Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Time Slot
                    </label>
                    <select
                      value={slotTime}
                      onChange={(e) => setSlotTime(e.target.value)}
                      className="input-field"
                    >
                      {slots.map(slot => (
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
                    className="w-full btn-primary py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader size={20} className="animate-spin" />
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
            </div>

            {/* Slot Availability */}
            <div>
              <div className="card sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={20} />
                  Availability
                </h3>
                <div className="space-y-3">
                  {slots.map(slot => {
                    const isFull = slot.available === 0;
                    return (
                      <div
                        key={slot.slot}
                        className={`p-3 rounded-lg text-center ${
                          isFull
                            ? "bg-red-100 border border-red-300"
                            : "bg-green-100 border border-green-300"
                        }`}
                      >
                        <p className="font-semibold text-gray-900">{slot.slot}</p>
                        <p className={`text-sm ${isFull ? "text-red-700" : "text-green-700"}`}>
                          {isFull ? "FULL" : `${slot.available} available`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentPage;
