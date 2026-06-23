import { useState } from "react";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const loginPatient = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", formData);

      alert(res.data.message);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("patient", JSON.stringify(res.data.patient));

    } catch (err) {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Patient Login</h2>

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

      <button onClick={loginPatient}>Login</button>
    </div>
  );
}

export default Login;