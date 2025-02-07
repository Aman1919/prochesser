import nodemailer from "nodemailer";
import { generateToken } from "../../utils";
import { db } from "../../db";
import {
  BACKEND_URL,
  FRONTEND_URL,
  NODEMAILER_MAIL,
  NODEMAILER_PASS,
} from "../../constants";
import { BACKEND_ROUTE } from "../..";

const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: NODEMAILER_MAIL,
    pass: NODEMAILER_PASS,
  },
});
// Function to send email verification
export async function EmailVerification(email: string, name: string) {
  try {
    const token = generateToken(
      {
        data: email,
      },
      "10m"
    );
    console.log(NODEMAILER_MAIL);

    const mailConfigurations = {
      from: `${NODEMAILER_MAIL}`,
      to: email,
      subject: "Email Verification for Your ProChesser Account",
      html: `<p>Dear ${name}</p>
      <p>Thank you for visiting ProChesser! We noticed that you recently entered your email address on our website. To ensure the security of your account and enhance your experience with us, please verify your email by clicking the link below:</p>
      <a href="${BACKEND_URL}/auth/verify/${token}">Verify Your Email</a>
      <p>If you have any questions or need assistance, feel free to reach out to our support team at support@prochessser.com<p>
      <p>Thank you for choosing ProChesser!</p>
      <p>Sincerely,</p>
<p>The ProChesser Team</p>
<a href="https://www.prochesser.com/">https://www.prochesser.com/</a>    
      `,
    };

    const result = await transporter.sendMail(mailConfigurations);
    console.log("Email Sent Successfully", result);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Function to send the forgot password email with a reset link
export const SendForgotPassword = async (
  email: string,
  name: string,
  token: string
) => {
  try {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    console.log("Sending: ", token);

    const mailOptions = {
      from: `${NODEMAILER_MAIL}`,
      to: email,
      subject: "Account Password Reset",
      html: `<p>Dear ${name}</p>
             <p>To reset the password to your ProChesser account, click the link below:</p>
             <a href="${resetLink}">Reset Password</a>
             <p>This link will expire in 10 minutes.</p>
             <p>If you have any questions or need assistance, feel free to reach out to our support team at support@prochessser.com<p>
      <p>Thank you for choosing ProChesser!</p>
      <p>Sincerely,</p>
<p>The ProChesser Team</p>
<a href="https://www.prochesser.com/">https://www.prochesser.com/</a>    
             `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export async function SendModeratorNotification(
  email: string,
  name: string,
  password: string
) {
  try {
    const mailOptions = {
      from: NODEMAILER_MAIL,
      to: email,
      subject: "Welcome to ProChesser as a Moderator!",
      html: `<p>Hi ${name}</p>
             <p>You’ve been added as a moderator on ProChesser.com! Thank you for joining our team. If you have any questions, feel free to reach out.</p>
             ${
               password
                 ? `<p>Your temporary password is: <strong>${password}</strong></p>
             <p>Please log in using this password and change it immediately.</p>`
                 : ""
             }
             <p>Welcome aboard!</p>
             <p>Sincerely,</p>
             <p>The ProChesser Team</p>
             <a href="https://www.prochesser.com/">https://www.prochesser.com/</a>
             `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Moderator notification email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function sendUserSuspensionNotification(email: string) {
  try {
    const mailOptions = {
      from: NODEMAILER_MAIL,
      to: email,
      subject: "Your ProChesser Account Has Been Suspended",
      html: `
        <p>We regret to inform you that your account has been suspended by the admin.</p>
        <p>If you have any questions or need assistance, please contact our support team at <a href="mailto:support@prochesser.com">support@prochesser.com</a>.</p>
        <p>Best regards,</p>
        <p>The ProChesser Team</p>
        <p><a href="https://www.prochesser.com/">Visit ProChesser</a></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Suspension notification sent successfully.");
  } catch (error) {
    console.error("Error sending suspension notification:", error);
    throw error;
  }
}

export async function sendUserActivationNotification(email: string) {
  try {
    const mailOptions = {
      from: NODEMAILER_MAIL,
      to: email,
      subject: "Your ProChesser Account Has Been Activated",
      html: `
        <p>Congratulations! Your account has been successfully activated.</p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@prochesser.com">support@prochesser.com</a>.</p>
        <p>Best regards,</p>
        <p>The ProChesser Team</p>
        <p><a href="https://www.prochesser.com/">Visit ProChesser</a></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Activation notification sent successfully.");
  } catch (error) {
    console.error("Error sending activation notification:", error);
    throw error;
  }
}

export async function sendUserBannedNotification(
  email: string,
  reason: string
) {
  try {
    const mailOptions = {
      from: NODEMAILER_MAIL,
      to: email,
      subject: "Your ProChesser Account Has Been Banned",
      html: `
        <p>We regret to inform you that your account has been banned due to the following reason:</p>
        <p><strong>${reason}</strong></p>
        <p>If you have any questions or believe this is a mistake, please contact our support team at <a href="mailto:support@prochesser.com">support@prochesser.com</a>.</p>
        <p>Best regards,</p>
        <p>The ProChesser Team</p>
        <p><a href="https://www.prochesser.com/">Visit ProChesser</a></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Ban notification sent successfully.");
  } catch (error) {
    console.error("Error sending ban notification:", error);
    throw error;
  }
}

export async function sendWithdrawalRequestNotification(
  amount: number,
  requestId: string,
  html?: string
) {
  try {
    const admins = await db.user.findMany({ where: { role: "ADMIN" } });

    const mailConfigurations = (email: string) => ({
      from: NODEMAILER_MAIL,
      to: email,
      subject: "Withdrawal Request Notification",
      html:
        html ??
        `
        <p>A new withdrawal request has been submitted with the following details:</p>
        <p>Request ID: <strong>${requestId}</strong></p>
        <p>Amount: <strong>${amount}</strong></p>
        <p>Please review this request at your earliest convenience.</p>
      `,
    });

    for (const admin of admins) {
      await transporter.sendMail(mailConfigurations(admin.email));
    }

    console.log(
      "Withdrawal request notifications sent successfully to admins."
    );
  } catch (error) {
    console.error("Error sending withdrawal request notifications:", error);
    throw error;
  }
}

export const SendNewsletterNotification = async (email: string) => {
  try {
    const unsubscribelink = `${FRONTEND_URL}/unsubscribed`;
    const mailOptions = {
      from: `${NODEMAILER_MAIL}`,
      to: email,
      subject: "Welcome to Our Newsletter!",
      html: `
        <p>Dear Subscriber,</p>
        <p>Thank you for subscribing to our newsletter!</p>
        <p>Stay tuned for the latest updates, news, and special offers.</p>
        <p>We are excited to have you on board!</p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team at ${NODEMAILER_MAIL}.</p>
        <p>Thank you for choosing ProChesser!</p>
        <p><a href="${unsubscribelink}">Unsubscribe from ProChesser emails</a></p>
          <p>Sincerely,</p>
        <p>The ProChesser Team</p>
        <a href="https://www.prochesser.com/">https://www.prochesser.com/</a>    
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Newsletter notification sent to ${email}`);
  } catch (error) {
    console.error("Error sending newsletter notification:", error);
  }
};
