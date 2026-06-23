import { useEffect, useState } from "react";
import axios from "axios";

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = () => {
    axios.get("http://localhost:5000/appointments")
      .then(res => setAppointments(res.data.appointments))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/appointments/${id}/status`, { status });
    fetchAppointments();
  };

  const deleteAppointment = async (id) => {
    await axios.delete(`http://localhost:5000/appointments/${id}`);
    fetchAppointments();
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Appointments</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-hover shadow">
          <thead className="table-primary">
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((item) => (
              <tr key={item.id}>
                <td>{item.patient_name}</td>
                <td>{item.doctor_name}</td>
                <td>{item.specialization}</td>
                <td>{new Date(item.appointment_date).toLocaleDateString()}</td>
                <td>
                  <span className="badge bg-info">{item.status}</span>
                </td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => updateStatus(item.id, "Approved")}>Approve</button>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => updateStatus(item.id, "Rejected")}>Reject</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteAppointment(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Appointments;