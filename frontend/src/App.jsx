import { useState, useEffect } from "react";
import LoginPageNew from "./pages/LoginPageNew";
import Navbar from "./components/Navbar";
import StudentPageNew from "./pages/StudentPageNew";
import StudentJobsNew from "./pages/StudentJobsNew";
import AdminPageNew from "./pages/AdminPageNew";
import "react-toastify/dist/ReactToastify.css";

function App(){

  const [user,setUser] = useState(null);
  const [page,setPage] = useState("student");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if(savedUser){
      try {
        setUser(JSON.parse(savedUser));
      } catch(err) {
        console.error("Failed to parse saved user", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setPage("student");
  };

  if(!user){
    return <LoginPageNew setUser={handleLogin}/>
  }

  return(
    <div className="min-h-screen bg-gray-50">
      <Navbar setPage={setPage} user={user} onLogout={handleLogout}/>
      <div>
        {page==="student" && <StudentPageNew/>}
        {page==="jobs" && <StudentJobsNew/>}
        {page==="admin" && <AdminPageNew/>}
      </div>
    </div>
  )
}

export default App;