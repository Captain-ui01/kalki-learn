// src/utils/mailer.js
const nodemailer = require('nodemailer');

// ---------- SMTP TRANSPORTER ----------
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// verify SMTP connection on server start
transporter.verify((err, success) => {
  if (err) {
    console.error('SMTP transporter verify failed:', err);
  } else {
    console.log('SMTP transporter ready');
  }
});

// ---------- SEND GENERIC EMAIL ----------
async function sendMail({ to, subject, text, html, from }) {
  const mailOptions = {
    from: from || process.env.FROM_EMAIL,
    to,
    subject,
    text,
    html
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
}

// Export functions
module.exports = { sendMail };

// ---------- OTP HTML BUILDER  ----------
function buildOtpEmailHtml({ name, otp, minutes = 10 }) {
  const logo = 'https://content3.jdmagicbox.com/v2/comp/ahmedabad/x4/079pxx79.xx79.231117201306.x4x4/catalogue/kalki-orignals-sarangpur-ahmedabad-women-readymade-garment-retailers-3ldqropqb6.jpg';
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#222;">
    <div style="max-width:680px;margin:0 auto;border:1px solid #eee;">
      <div style="background:#ffffff;padding:28px 36px;border-bottom:6px solid #f3f4ff;display:flex;gap:12px;align-items:center">
        <img src="${logo}" alt="Kalki" style="width:64px;height:64px;border-radius:6px;object-fit:cover" />
        <div>
          <h2 style="margin:0;color:#303060">Kalki Learning</h2>
          <div style="color:#666;font-size:14px">One-time verification code</div>
        </div>
      </div>

      <div style="padding:36px;background:#fafbfd">
        <p style="margin:0 0 18px;color:#333;font-size:15px">
          Hi ${name || 'there'},<br/><br/>
          Use the verification code below to verify your email address for your Kalki account. The code will expire in ${minutes} minutes.
        </p>

        <div style="margin:22px 0;text-align:center">
          <div style="display:inline-block;padding:22px 32px;border-radius:12px;background:white;box-shadow:0 8px 30px rgba(40,30,120,0.08);">
            <div style="font-size:28px;letter-spacing:4px;font-weight:700;color:#222">${otp}</div>
          </div>
        </div>

        <p style="margin:0;color:#666;font-size:13px">
          If you did not request this, you can safely ignore this email. For help, contact support at <a href="mailto:support@kalki.example">support@kalki.example</a>.
        </p>
      </div>

      <div style="padding:18px 36px;background:#fff;border-top:1px solid #eee;color:#999;font-size:12px">
        Kalki Learning — Learn coding the fun way.<br/>This message was sent from Kalki Learning.
      </div>
    </div>
  </div>
  `;
}

