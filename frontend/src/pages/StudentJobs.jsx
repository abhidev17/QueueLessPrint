import { useEffect, useState } from "react";
import API from "../api";

function StudentJobs() {

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const res = await API.get("/print/all");
    
    // filter jobs for this user
    const userJobs = res.data.filter(
      (job) => job.userId && job.userId._id === "69b454a2650a4f0d4b04ebb5"
    );

    setJobs(userJobs);
  };

  return (
    <div>

      <h2>Your Print Jobs</h2>

      {jobs.map((job) => (

        <div
          key={job._id}
          style={{
            border: "1px solid #444",
            borderRadius: "8px",
            padding: "15px",
            margin: "10px",
            background: "#1e1e2f"
          }}
        >

          <p><b>File:</b> {job.fileName}</p>
          <p><b>Slot:</b> {job.slotTime}</p>
          <p><b>Status:</b> {job.status}</p>

        </div>

      ))}

    </div>
  );
}

export default StudentJobs;