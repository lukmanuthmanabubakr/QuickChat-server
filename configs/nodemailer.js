import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,       // your email
    pass: process.env.EMAIL_PASSWORD,   // app password
  },
});
