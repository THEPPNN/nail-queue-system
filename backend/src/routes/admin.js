const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    const [rows] = await db.query('SELECT * FROM appointments');
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
      SELECT c.email
      FROM appointments a
      JOIN customers c ON c.id = a.customer_id
      WHERE a.id = ?
    `, [id]);

    await db.query(
        'UPDATE appointments SET status = "cancelled" WHERE id = ?',
        [id]
    );

    await mailer.sendMail({
        to: booking.email,
        subject: 'ยกเลิกการจองคิว',
        text: 'ทางร้านขออภัย คิวของคุณถูกยกเลิก'
    });

    res.json({ message: 'cancelled' });
});

module.exports = router;