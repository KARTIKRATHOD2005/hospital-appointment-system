import { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const registerPatient = async () => {
    try {
      const res = await axios.post("http://localhost:5000/register", formData);
      alert(res.data.message);
    } catch {
      alert("Registration Failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow mx-auto" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          <h3 className="text-center text-primary mb-4">Patient Registration</h3>

          <input className="form-control mb-3" name="name" placeholder="Full Name" onChange={handleChange} />
          <input className="form-control mb-3" name="email" placeholder="Email" onChange={handleChange} />
          <input className="form-control mb-3" type="password" name="password" placeholder="Password" onChange={handleChange} />
          <input className="form-control mb-3" name="phone" placeholder="Phone Number" onChange={handleChange} />

          <button className="btn btn-primary w-100" onClick={registerPatient}>Register</button>
        </div>
      </div>
    </div>
  );
}

export default Register;