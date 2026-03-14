import { useEffect, useState } from "react";
import API from "../api";

function AdminPage() {

  const [jobs, setJobs] = useState([]);
  

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const res = await API.get("/print/all");
    setJobs(res.data);
   
  };
  const updateStatus = async (id,status)=>{
  await API.put(`/print/status/${id}`,{status});
  loadJobs();
};

  return (
  <div>
    <h2>Admin Dashboard</h2>

    <button onClick={loadJobs}>Refresh Jobs</button>

    {jobs.map(job => (
        
<div key={job._id} style={{
  border:"1px solid #444",
  borderRadius:"8px",
  margin:"10px",
  padding:"15px",
  background:"#1e1e2f"
}}>
        
        <p><b>Student:</b> {job.userId.name}</p>
        <p><b>File:</b> {job.fileName}</p>
        <p><b>Slot:</b> {job.slotTime}</p>
        <p><b>Status:</b> {job.status}</p>
         <button onClick={()=>updateStatus(job._id,"Printing")}>
  Start Printing
</button>

<button onClick={()=>updateStatus(job._id,"Completed")}>
  Completed
</button>
      </div>
    ))}
  </div>
);
}

export default AdminPage;