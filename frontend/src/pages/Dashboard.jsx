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
      .then((res) => {
        setDashboard(res.data.dashboard);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Admin Dashboard</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ border: "1px solid gray", padding: "20px" }}>
          <h3>Total Patients</h3>
          <h1>{dashboard.totalPatients}</h1>
        </div>

        <div style={{ border: "1px solid gray", padding: "20px" }}>
          <h3>Total Doctors</h3>
          <h1>{dashboard.totalDoctors}</h1>
        </div>

        <div style={{ border: "1px solid gray", padding: "20px" }}>
          <h3>Total Appointments</h3>
          <h1>{dashboard.totalAppointments}</h1>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;