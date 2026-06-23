const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// HOME
app.get("/", (req, res) => {
    res.send("Hospital Appointment System Backend Running");
});

// REGISTER
app.post("/register", (req, res) => {
    const { name, email, password, phone } = req.body;

    const sql = "INSERT INTO patients (name, email, password, phone) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, email, password, phone], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Registration Failed"
            });
        }

        res.status(201).json({
            success: true,
            message: "Patient Registered Successfully"
        });
    });
});

// LOGIN
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM patients WHERE email = ? AND password = ?";

    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Server Error"
            });
        }

        if (result.length > 0) {
            res.json({
                success: true,
                message: "Login Successful",
                patient: result[0]
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }
    });
});

// ADD DOCTOR
app.post("/doctors", (req, res) => {
    const { name, specialization, phone, available_time } = req.body;

    const sql = "INSERT INTO doctors (name, specialization, phone, available_time) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, specialization, phone, available_time], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Doctor Add Failed"
            });
        }

        res.status(201).json({
            success: true,
            message: "Doctor Added Successfully"
        });
    });
});

// VIEW DOCTORS
app.get("/doctors", (req, res) => {
    const sql = "SELECT * FROM doctors";

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Failed to Fetch Doctors"
            });
        }

        res.json({
            success: true,
            doctors: result
        });
    });
});

// BOOK APPOINTMENT
app.post("/appointments", (req, res) => {
    const { patient_id, doctor_id, appointment_date } = req.body;

    const sql = "INSERT INTO appointments (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)";

    db.query(sql, [patient_id, doctor_id, appointment_date], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Appointment Booking Failed"
            });
        }

        res.status(201).json({
            success: true,
            message: "Appointment Booked Successfully"
        });
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
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Failed to Fetch Appointments"
            });
        }

        res.json({
            success: true,
            appointments: result
        });
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});