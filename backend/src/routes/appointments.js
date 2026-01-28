const express = require('express');
const router = express.Router();
const db = require('../db');
const dayjs = require('dayjs');

router.post('/book', async (req, res) => {
  const { customer_id, service_id, date, start_time } = req.body;

  const [[service]] = await db.query(
    'SELECT duration_minutes FROM services WHERE id = ?',
    [service_id]
  );

  const end_time = dayjs(`${date} ${start_time}`)
    .add(service.duration_minutes, 'minute')
    .format('HH:mm');

  const [conflict] = await db.query(`
      SELECT id FROM appointments
      WHERE date = ?
      AND status != 'cancelled'
      AND (? < end_time AND ? > start_time)
    `, [date, start_time, end_time]);

  if (conflict.length > 0) {
    return res.status(400).json({ message: 'คิวเต็ม' });
  }

  await db.query(`
      INSERT INTO appointments
      (customer_id, service_id, date, start_time, end_time, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `, [customer_id, service_id, date, start_time, end_time]);

  res.json({ message: 'จองสำเร็จ' });
});

// ดึงช่วงเวลาว่างของบริการนั้นๆ เพื่อเอาไปแสดงที่ ui เลือกเวลาจอง
router.get('/available', async (req, res) => {
  const { service_id } = req.params;
  const [rows] = await db.query('SELECT * FROM appointments WHERE service_id = ? AND status != "cancelled"', [service_id]);
  res.json(rows);
});

// ดูคิวทั้งหมด
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM appointments');
  res.json(rows);
});

// ดูตารางรายวัน
router.get('/calendar', async (req, res) => {
  const { date } = req.params;
  const [rows] = await db.query('SELECT * FROM appointments WHERE date = ?', [date]);
  res.json(rows);
});

module.exports = router;