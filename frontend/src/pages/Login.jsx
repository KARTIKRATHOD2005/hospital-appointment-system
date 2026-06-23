import { useState } from "react";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const loginPatient = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("patient", JSON.stringify(res.data.patient));
      alert(res.data.message);
    } catch {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow mx-auto" style={{ maxWidth: "450px" }}>
        <div className="card-body">
          <h3 className="text-center text-success mb-4">Patient Login</h3>

          <input className="form-control mb-3" name="email" placeholder="Email" onChange={handleChange} />
          <input className="form-control mb-3" type="password" name="password" placeholder="Password" onChange={handleChange} />

          <button className="btn btn-success w-100" onClick={loginPatient}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default Login;