import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0
  });

  useEffect(() => {
    axios.get("http://localhost:5000/dashboard")
      .then(res => setDashboard(res.data.dashboard))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow text-center border-primary">
            <div className="card-body">
              <h5>Total Patients</h5>
              <h1 className="text-primary">{dashboard.totalPatients}</h1>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow text-center border-success">
            <div className="card-body">
              <h5>Total Doctors</h5>
              <h1 className="text-success">{dashboard.totalDoctors}</h1>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow text-center border-warning">
            <div className="card-body">
              <h5>Total Appointments</h5>
              <h1 className="text-warning">{dashboard.totalAppointments}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;