import nodemailer from "nodemailer";

const requiredMailSettings = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];

const getTransporter = () => {
  const missingSetting = requiredMailSettings.find((setting) => !process.env[setting]);

  if (missingSetting) {
    throw new Error(`${missingSetting} is missing in environment variables`);
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendPasswordResetEmail = async ({ to, name, temporaryPassword }) => {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to,
    subject: "Sri Venkateswara Family Shop password reset",
    text: [
      `Hi ${name || "Customer"},`,
      "",
      "Your password reset request has been processed.",
      `Temporary password: ${temporaryPassword}`,
      "",
      "Please login with this temporary password and change it after signing in.",
      "",
      "Sri Venkateswara Family Shop",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="color: #ea580c;">Sri Venkateswara Family Shop</h2>
        <p>Hi ${name || "Customer"},</p>
        <p>Your password reset request has been processed.</p>
        <p style="font-size: 16px;">
          Temporary password:
          <strong style="color: #21747b;">${temporaryPassword}</strong>
        </p>
        <p>Please login with this temporary password and change it after signing in.</p>
      </div>
    `,
  });
};
