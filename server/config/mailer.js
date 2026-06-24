const nodemailer = require("nodemailer");

// Create SMTP transport for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "smartnest.techlab@gmail.com",
    pass: process.env.EMAIL_PASS || "ssoc quvl phsi jwjq",
  },
});

/**
 * Send Welcome/Login notification email
 */
exports.sendLoginEmail = async (toEmail, userName) => {
  const mailOptions = {
    from: `"SmartNest" <${process.env.EMAIL_USER || "smartnest.techlab@gmail.com"}>`,
    to: toEmail,
    subject: "SmartNest — Successful Login Alert",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; border-bottom: 2px solid #0EA5E9; padding-bottom: 10px; margin-bottom: 20px;">
          <h2 style="color: #0EA5E9; margin: 0;">SmartNest</h2>
        </div>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>This is a quick security notification to let you know that you have successfully logged into your SmartNest account.</p>
        <p style="color: #555555; font-size: 14px;">If this was you, no action is needed. If you did not log in, please secure your account immediately or contact support.</p>
        <br />
        <p>Best regards,</p>
        <p><strong>The SmartNest Team</strong></p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Login email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending login email:", error);
  }
};

/**
 * Send Appointment booking confirmation email
 */
exports.sendAppointmentConfirmationEmail = async (toEmail, details) => {
  const { name, productName, consultancyType, date, timeSlot, phone } = details;
  const mailOptions = {
    from: `"SmartNest" <${process.env.EMAIL_USER || "smartnest.techlab@gmail.com"}>`,
    to: toEmail,
    subject: "SmartNest — Appointment Booked Successfully!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; border-bottom: 2px solid #0EA5E9; padding-bottom: 10px; margin-bottom: 20px;">
          <h2 style="color: #0EA5E9; margin: 0;">Booking Confirmed</h2>
        </div>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your appointment has been successfully scheduled! Here are your booking details:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px;">
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold; width: 35%;">Product</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${productName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Consultancy Type</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${consultancyType}</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Date</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${date}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Time Slot</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${timeSlot}</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Phone</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${phone}</td>
          </tr>
        </table>
        <p style="color: #555555; font-size: 14px;">Our representative will reach out to you shortly. If you need to make changes to your booking, please call or WhatsApp us.</p>
        <br />
        <p>Best regards,</p>
        <p><strong>The SmartNest Team</strong></p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Appointment email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending appointment email:", error);
  }
};

/**
 * Send Password Reset OTP email
 */
exports.sendResetOTPEmail = async (toEmail, userName, otpCode) => {
  const mailOptions = {
    from: `"SmartNest" <${process.env.EMAIL_USER || "smartnest.techlab@gmail.com"}>`,
    to: toEmail,
    subject: "SmartNest — Password Reset Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; border-bottom: 2px solid #0EA5E9; padding-bottom: 10px; margin-bottom: 20px;">
          <h2 style="color: #0EA5E9; margin: 0;">Password Reset</h2>
        </div>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>We received a request to reset your password. Use the following verification code (OTP) to complete your request:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0EA5E9; padding: 10px 20px; background-color: #f0f9ff; border: 1px dashed #0EA5E9; border-radius: 8px;">
            ${otpCode}
          </span>
        </div>
        <p style="color: #ff0000; font-size: 13px; font-weight: bold;">Note: This OTP code is valid for 10 minutes and should not be shared with anyone.</p>
        <p style="color: #555555; font-size: 14px;">If you did not request a password reset, please ignore this email.</p>
        <br />
        <p>Best regards,</p>
        <p><strong>The SmartNest Team</strong></p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP reset email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};
