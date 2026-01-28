const express = require('express');
const router = express.Router();
const db = require('../db');

// ดูบริการทั้งหมด
router.get('/', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM services WHERE status != "D"');
    res.json(rows);
});

// เพิ่มบริการ
router.post('/', async (req, res) => {
    const { name, duration_minutes, price } = req.body;
    await db.query(
        'INSERT INTO services (name, duration_minutes, price ,status) VALUES (?, ?, ?, ?)',
        [name, duration_minutes, price, 'A']
    );
    res.json({ message: 'created' });
});

router.put('/:id', async (req, res) => {
    const { name, duration_minutes, price } = req.body;
    await db.query('UPDATE services SET name = ?, duration_minutes = ?, price = ? WHERE id = ?', [name, duration_minutes, price, req.params.id]);
    res.json({ message: 'updated' });
});

router.patch('/:id', async (req, res) => {
    const { status } = req.body;
    await db.query('UPDATE services SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'deleted' });
});

module.exports = router;