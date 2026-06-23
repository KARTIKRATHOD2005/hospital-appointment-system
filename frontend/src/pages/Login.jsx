app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM patients WHERE email = ?";

    db.query(sql, [email], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Server Error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        const patient = result[0];
        const isMatch = await bcrypt.compare(password, patient.password);

        if (isMatch) {
            res.json({
                success: true,
                message: "Login Successful",
                patient: patient
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }
    });
});