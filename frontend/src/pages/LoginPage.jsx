import { useState } from "react";
import API from "../api";

function LoginPage({ setUser }) {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

const login = async (e) => {

  e.preventDefault();

  try{

    const res = await API.post("/users/login",{
      email,
      password
    });

    setUser(res.data.user);

  }catch(err){

    alert(err.response?.data?.message || "Login failed");

  }

};
  return (

    <div>

      <h2>Login</h2>

      <form onSubmit={login}>

        Email:
        <input
          type="text"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <br/><br/>

        Password:
        <input
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <br/><br/>

        <button type="submit">
          Login
        </button>

      </form>

    </div>

  );

}

export default LoginPage;