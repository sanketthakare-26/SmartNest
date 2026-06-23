const nodemailer = require("nodemailer");

exports.submitEnquiry = async (req, res) => {
  const enquiry = await Enquiry.create(req.body);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Enquiry from ${enquiry.name}`,
    text: `Phone: ${enquiry.phone}\nMessage: ${enquiry.message}`,
  });

  res.status(201).json(enquiry);
};