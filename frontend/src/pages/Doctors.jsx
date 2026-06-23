import { useEffect, useState } from "react";
import axios from "axios";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/doctors")
      .then(res => setDoctors(res.data.doctors))
      .catch(err => console.log(err));
  }, []);

  const bookAppointment = async (doctorId) => {
    const patient = JSON.parse(localStorage.getItem("patient"));

    if (!patient) {
      alert("Please login first");
      return;
    }

    if (!appointmentDate) {
      alert("Please select appointment date");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/appointments", {
        patient_id: patient.id,
        doctor_id: doctorId,
        appointment_date: appointmentDate
      });

      alert(res.data.message);
    } catch (err) {
      alert("Appointment booking failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Available Doctors</h2>

      <div className="mb-4 mx-auto" style={{ maxWidth: "400px" }}>
        <label className="form-label">Select Appointment Date</label>
        <input
          type="date"
          className="form-control"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
        />
      </div>

      <div className="row g-4">
        {doctors.map((doctor) => (
          <div className="col-md-4" key={doctor.id}>
            <div className="card shadow h-100">
              <div className="card-body">
                <h5 className="text-primary">{doctor.name}</h5>
                <p><b>Specialization:</b> {doctor.specialization}</p>
                <p><b>Phone:</b> {doctor.phone}</p>
                <p><b>Available:</b> {doctor.available_time}</p>

                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => bookAppointment(doctor.id)}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Doctors;