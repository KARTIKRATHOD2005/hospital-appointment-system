app.post("/register", async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO patients (name, email, password, phone) VALUES (?, ?, ?, ?)";

        db.query(sql, [name, email, hashedPassword, phone], (err) => {
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

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});