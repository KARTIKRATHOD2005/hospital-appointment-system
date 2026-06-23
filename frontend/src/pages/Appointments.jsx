import { useEffect, useState } from "react";
import axios from "axios";

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/appointments")
      .then(res => setAppointments(res.data.appointments))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Appointments</h2>

      {appointments.map((item) => (
        <div key={item.id} style={{ border: "1px solid gray", padding: "15px", marginBottom: "15px" }}>
          <h3>{item.patient_name}</h3>
          <p>Doctor: {item.doctor_name}</p>
          <p>Specialization: {item.specialization}</p>
          <p>Date: {item.appointment_date}</p>
          <p>Status: {item.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Appointments;