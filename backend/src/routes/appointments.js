const express = require('express');
const router = express.Router();
const db = require('../db');
const dayjs = require('dayjs');
const transporter = require("../services/mailer.js");

router.post('/book', async (req, res) => {
  const { service_id, date, start_time, name, email, phone } = req.body;

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
    return res.json({ error: true, message: 'คิวเต็ม กรุณาเลือกเวลาอื่น' });
  }
  let bookingCode = Math.random().toString(36).substring(2, 15);
  let [result_insert] = await db.query(`
    INSERT INTO appointments
    (service_id, date, start_time, end_time, status,name,email,phone,booking_code)
    VALUES (?, ?, ?, ?, 'pending', ?, ?, ? , ?)
    `, [service_id, date, start_time, end_time, name, email, phone, bookingCode]); // return id of inserted row
  await send_email(email, name, phone, date, start_time, bookingCode, result_insert);
  let details = {
    service_id: service_id,
    date: date,
    start_time: start_time,
    end_time: end_time,
    name: name,
    email: email,
    phone: phone,
    bookingCode: bookingCode
  };
  res.json({ error: false, message: 'จองสำเร็จ' , detail: details });

});

async function send_email(email, name, phone, date, start_time, bookingCode, result) {
  let date_thai = dayjs(date).format('DD/MM/YYYY');
  let send = await transporter.sendMail({
    from: `"Nail Queue" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "✅ ยืนยันการจองคิว Nail Queue",
    html: `
      <div style="font-family: Arial, sans-serif; background-color:#f5f7fb; padding:30px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.08);">

          <!-- Header -->
          <div style="background:#0d6efd; color:white; padding:20px; text-align:center;">
            <h1 style="margin:0;">💅 Nail Queue</h1>
            <p style="margin:5px 0 0;">ยืนยันการจองคิว</p>
          </div>

          <!-- Body -->
          <div style="padding:25px;">
            <h2 style="color:#333;">✅ จองคิวสำเร็จ</h2>
            <p style="color:#555;">สวัสดีคุณ <b>${name}</b></p>
            <p style="color:#555;">ขอบคุณที่ใช้บริการ Nail Queue รายละเอียดการจองของคุณมีดังนี้</p>

            <table style="width:100%; border-collapse:collapse; margin-top:15px;">
              <tr>
                <td style="padding:8px; color:#666;">📅 วันที่</td>
                <td style="padding:8px;"><b>${date_thai}</b></td>
              </tr>
              <tr style="background:#f9fafc;">
                <td style="padding:8px; color:#666;">⏰ เวลา</td>
                <td style="padding:8px;"><b>${start_time}</b></td>
              </tr>
              <tr>
                <td style="padding:8px; color:#666;">📞 เบอร์โทร</td>
                <td style="padding:8px;"><b>${phone}</b></td>
              </tr>
            </table>

            <div style="margin:20px 0; padding:15px; background:#f1f5ff; border-radius:8px; text-align:center;">
              <p style="margin:0; color:#333;">รหัสการจอง</p>
              <h2 style="margin:5px 0; color:#0d6efd; letter-spacing:2px;">
                ${bookingCode}
              </h2>
            </div>

            <p style="color:#777; font-size:14px;">
              กรุณาเก็บอีเมลนี้ไว้เป็นหลักฐานการจอง<br/>
              หากต้องการยกเลิกหรือแก้ไข โปรดติดต่อร้าน
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#f0f2f5; padding:15px; text-align:center; font-size:13px; color:#888;">
            © ${new Date().getFullYear()} Nail Queue<br/>
            ระบบจองคิวร้านทำเล็บ
          </div>

        </div>
      </div>
      `
  });
  if (send.accepted.length > 0) {
    await db.query('UPDATE appointments SET mail_status = "done" WHERE id = ?', [result.insertId]);
  }
}

// ดึงช่วงเวลาว่างของบริการนั้นๆ
router.get('/available_time', async (req, res) => {
  try {
    const { service_id, date } = req.query;
    if (!service_id || !date) {
      return res.status(400).json({ message: 'service_id & date required' });
    }

    /* ร้าน */
    const [[shop]] = await db.query(
      'SELECT * FROM shops WHERE is_open = 1 LIMIT 1'
    );
    if (!shop) return res.json({ available_times: [] });

    /* วันในสัปดาห์ */
    const dayOfWeek = new Date(date).getDay();

    const [[workingDay]] = await db.query(
      `SELECT * FROM shop_working_days
       WHERE shop_id = ? AND day_of_week = ? AND is_open = 1`,
      [shop.id, dayOfWeek]
    );

    if (!workingDay) {
      return res.json({
        is_open: false,
        message: "ร้านปิดวันนี้",
        available_times: [],
      });
    }
    /* service */
    const [[service]] = await db.query(
      'SELECT * FROM services WHERE id = ?',
      [service_id]
    );

    /* appointments */
    const [appointments] = await db.query(
      `SELECT start_time, end_time
       FROM appointments
       WHERE service_id = ?
       AND DATE(start_time) = ?
       AND status != 'cancelled'`,
      [service_id, date]
    );

    /* สร้างเวลาว่าง */
    const available_times = [];
    let current = new Date(`${date} ${shop.open_time}`);
    const close = new Date(`${date} ${shop.close_time}`);

    while (current < close) {
      const end = new Date(
        current.getTime() + service.duration_minutes * 60000
      );

      if (end > close) break;

      const overlap = appointments.some(a => {
        return (
          current < new Date(a.end_time) &&
          end > new Date(a.start_time)
        );
      });

      if (!overlap) {
        available_times.push(
          current.toTimeString().slice(0, 5)
        );
      }

      current = new Date(current.getTime() + 30 * 60000);
    }

    res.json({
      is_open: true,
      available_times
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
 
// ดูตารางรายวัน
router.get('/calendar', async (req, res) => {
  const { date } = req.params;
  const [rows] = await db.query('SELECT * FROM appointments WHERE date = ?', [date]);
  res.json(rows);
});

module.exports = router;