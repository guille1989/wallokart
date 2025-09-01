const { Router } = require('express');
const nodemailer = require('nodemailer');
const router = Router();

// Configura tu transporte (puedes usar Gmail, Outlook, etc.)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, // pon tu email en .env
    pass: process.env.MAIL_PASS  // pon tu contraseña en .env
  }
});

router.post('/', async (req, res) => {
  const { to, subject, text } = req.body;
  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      text
    });
    res.json({ success: true, info });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
