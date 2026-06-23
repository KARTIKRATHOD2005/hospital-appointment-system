import { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const registerPatient = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/register",
        formData
      );

      alert(res.data.message);
    } catch (err) {
      alert("Registration Failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Patient Registration</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
      />
      <br /><br />

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <br /><br />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <br /><br />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
      />
      <br /><br />

      <button onClick={registerPatient}>
        Register
      </button>
    </div>
  );
}

export default Register;