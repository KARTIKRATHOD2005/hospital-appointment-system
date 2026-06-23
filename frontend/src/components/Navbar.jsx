import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "15px", background: "#0d6efd" }}>
      <Link to="/" style={{ color: "white", marginRight: "20px" }}>
        Register
      </Link>

      <Link to="/login" style={{ color: "white", marginRight: "20px" }}>
        Login
      </Link>

      <Link to="/doctors" style={{ color: "white", marginRight: "20px" }}>
        Doctors
      </Link>

      <Link to="/appointments" style={{ color: "white", marginRight: "20px" }}>
        Appointments
      </Link>

      <Link to="/dashboard" style={{ color: "white" }}>
        Dashboard
      </Link>
    </nav>
  );
}

export default Navbar;