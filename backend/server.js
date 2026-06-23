const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const db = require("./db");
const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = "hospital_secret_key";

// HOME
app.get("/", (req, res) => {
    res.send("Hospital Appointment System Backend Running");
});

// REGISTER
app.post("/register", async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO patients (name, email, password, phone) VALUES (?, ?, ?, ?)";

        db.query(sql, [name, email, hashedPassword, phone], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Registration Failed" });
            }

            res.status(201).json({ success: true, message: "Patient Registered Successfully" });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// LOGIN
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM patients WHERE email = ?";

    db.query(sql, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Server Error" });
        }

        if (result.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid Email or Password" });
        }

        const patient = result[0];
        const isMatch = await bcrypt.compare(password, patient.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid Email or Password" });
        }

        const token = jwt.sign(
            { id: patient.id, email: patient.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            success: true,
            message: "Login Successful",
            token,
            patient: {
                id: patient.id,
                name: patient.name,
                email: patient.email,
                phone: patient.phone
            }
        });
    });
});

// VERIFY TOKEN
function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(403).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        req.user = decoded;
        next();
    });
}

// PROFILE
app.get("/profile", verifyToken, (req, res) => {
    res.json({
        success: true,
        message: "Protected profile data",
        user: req.user
    });
});

// ADD DOCTOR
app.post("/doctors", (req, res) => {
    const { name, specialization, phone, available_time } = req.body;
    const sql = "INSERT INTO doctors (name, specialization, phone, available_time) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, specialization, phone, available_time], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Doctor Add Failed" });
        }

        res.status(201).json({ success: true, message: "Doctor Added Successfully" });
    });
});

// VIEW DOCTORS
app.get("/doctors", (req, res) => {
    db.query("SELECT * FROM doctors", (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Failed to Fetch Doctors" });
        }

        res.json({ success: true, doctors: result });
    });
});

// BOOK APPOINTMENT
app.post("/appointments", (req, res) => {
    const { patient_id, doctor_id, appointment_date } = req.body;
    const sql = "INSERT INTO appointments (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)";

    db.query(sql, [patient_id, doctor_id, appointment_date], (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Appointment Booking Failed" });
        }

        res.status(201).json({ success: true, message: "Appointment Booked Successfully" });
    });
});

// VIEW APPOINTMENTS
app.get("/appointments", (req, res) => {
    const sql = `
        SELECT
            a.id,
            p.name AS patient_name,
            d.name AS doctor_name,
            d.specialization,
            a.appointment_date,
            a.status
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN doctors d ON a.doctor_id = d.id
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Failed to Fetch Appointments" });
        }

        res.json({ success: true, appointments: result });
    });
});

// UPDATE APPOINTMENT STATUS
app.put("/appointments/:id/status", (req, res) => {
    const appointmentId = req.params.id;
    const { status } = req.body;

    const sql = "UPDATE appointments SET status = ? WHERE id = ?";

    db.query(sql, [status, appointmentId], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Status Update Failed" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Appointment Not Found" });
        }

        res.json({ success: true, message: "Appointment Status Updated Successfully" });
    });
});

// DELETE APPOINTMENT
app.delete("/appointments/:id", (req, res) => {
    const appointmentId = req.params.id;
    const sql = "DELETE FROM appointments WHERE id = ?";

    db.query(sql, [appointmentId], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Failed to Delete Appointment" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Appointment Not Found" });
        }

        res.json({ success: true, message: "Appointment Deleted Successfully" });
    });
});

// ADMIN DASHBOARD
app.get("/dashboard", (req, res) => {
    const dashboardData = {};

    db.query("SELECT COUNT(*) AS totalPatients FROM patients", (err, patientResult) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Dashboard Error" });
        }

        dashboardData.totalPatients = patientResult[0].totalPatients;

        db.query("SELECT COUNT(*) AS totalDoctors FROM doctors", (err, doctorResult) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Dashboard Error" });
            }

            dashboardData.totalDoctors = doctorResult[0].totalDoctors;

            db.query("SELECT COUNT(*) AS totalAppointments FROM appointments", (err, appointmentResult) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Dashboard Error" });
                }

                dashboardData.totalAppointments = appointmentResult[0].totalAppointments;

                res.json({
                    success: true,
                    dashboard: dashboardData
                });
            });
        });
    });
});

// START SERVER
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});