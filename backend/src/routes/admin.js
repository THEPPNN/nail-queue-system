const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require("../services/mailer.js");

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await db.query(
            "SELECT * FROM admins WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: "Admin not found" });
        }

        const user = users[0];

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Wrong password" });
        }
        const token = jwt.sign(
            { id: user.id, role: user.role, company_id: user.company_id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ success: true, token, user });

    } catch (err) {
        console.error("❌ LOGIN ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/appointments', async (req, res) => {
    const [rows] = await db.query(`SELECT
        services.name as service_name,
        appointments.id,
        appointments.name,
        appointments.email,
        appointments.date,
        appointments.phone,
        appointments.start_time,
        appointments.end_time,
        appointments.status,
        appointments.created_at
        FROM appointments JOIN services ON appointments.service_id = services.id
        order by DATE(appointments.date) desc, appointments.start_time asc
        `);
    res.json(rows);
});

router.post('/appointments/:id/approve', async (req, res) => {
    const id = req.params.id;
    await db.query('UPDATE appointments SET status = "approved" WHERE id = ?', [id]);
    res.json({ message: 'approved' });
});

router.post('/appointments/:id/cancel', async (req, res) => {
    const id = req.params.id;

    const [[booking]] = await db.query(`
      SELECT email
      FROM appointments a
      WHERE a.id = ?
    `, [id]);

    await db.query(
        'UPDATE appointments SET status = "cancelled" WHERE id = ?',
        [id]
    );

    res.json({ message: 'cancelled' });
});

router.get("/appointments/calendar", async (req, res) => {
    const [rows] = await db.query(`
      SELECT 
        a.id,
        CONCAT(s.name) AS title,
        CONCAT(a.date,'T',a.start_time) AS start,
        CONCAT(a.date,'T',a.end_time) AS end,
        a.phone,
        a.name,
        CASE a.status
          WHEN 'approved' THEN '#bbdbdd'
          WHEN 'pending' THEN '#f06292'
          ELSE '#bdbdbd'
        END AS color
      FROM appointments a
      JOIN services s ON s.id = a.service_id
      WHERE a.status != 'cancelled'
    `);
  
    res.json(rows);
  });

module.exports = router;