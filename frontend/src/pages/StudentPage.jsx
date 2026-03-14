import { useState, useEffect } from "react";
import API from "../api";

function StudentPage() {

  const [copies, setCopies] = useState(1);
  const [pageSize, setPageSize] = useState("A4");
  const [slotTime, setSlotTime] = useState("10:00 AM");
  const [file, setFile] = useState(null);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    const res = await API.get("/print/slots");
    setSlots(res.data);
  };

  const submitPrint = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("userId", "69b454a2650a4f0d4b04ebb5");
    formData.append("copies", copies);
    formData.append("pageSize", pageSize);
    formData.append("color", false);
    formData.append("printDate", "2026-03-15");
    formData.append("slotTime", slotTime);
    formData.append("document", file);

    await API.post("/print/create", formData);

    alert("Print job submitted!");

    loadSlots(); // refresh slot availability
  };

  return (
    <div>

      <h2>Submit Print Job</h2>

      <h3>Slot Availability</h3>

<div style={{
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  justifyContent: "center",
  marginBottom: "20px"
}}>
  {slots.map((slot) => {

    const isFull = slot.available === 0;

    return (
      <div
        key={slot.slot}
        style={{
          padding: "12px 20px",
          borderRadius: "8px",
          color: "white",
          fontWeight: "bold",
          backgroundColor: isFull ? "#e74c3c" : "#2ecc71",
          minWidth: "140px",
          textAlign: "center"
        }}
      >
        <div>{slot.slot}</div>
        <div>
          {isFull ? "FULL" : `Available (${slot.available})`}
        </div>
      </div>
    );
  })}
</div>
      <br/>

      <form onSubmit={submitPrint}>

        Copies:
        <input
          type="number"
          value={copies}
          onChange={(e)=>setCopies(e.target.value)}
        />

        <br/><br/>

        Page Size:
        <select onChange={(e)=>setPageSize(e.target.value)}>
          <option>A4</option>
          <option>A3</option>
        </select>

        <br/><br/>

        Slot Time:
        <select onChange={(e)=>setSlotTime(e.target.value)}>
          <option>10:00 AM</option>
          <option>10:30 AM</option>
          <option>11:00 AM</option>
        </select>

        <br/><br/>

        Document:
        <input
          type="file"
          onChange={(e)=>setFile(e.target.files[0])}
        />

        <br/><br/>

        <button type="submit">Submit Print</button>

      </form>

    </div>
  );
}

export default StudentPage;