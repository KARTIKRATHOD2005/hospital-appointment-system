import { useEffect, useState } from "react";
import axios from "axios";

function Doctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/doctors")
      .then(res => setDoctors(res.data.doctors))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Available Doctors</h2>

      {doctors.map((doctor) => (
        <div key={doctor.id} style={{ border: "1px solid gray", padding: "15px", marginBottom: "15px" }}>
          <h3>{doctor.name}</h3>
          <p>Specialization: {doctor.specialization}</p>
          <p>Phone: {doctor.phone}</p>
          <p>Available Time: {doctor.available_time}</p>
        </div>
      ))}
    </div>
  );
}

export default Doctors;