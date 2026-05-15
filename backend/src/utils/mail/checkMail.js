import dotenv from "dotenv";
import { verifyEmailConfig } from "./mailer.js";

dotenv.config();

const maskEmail = (email = "") => email.replace(/^(.{2}).*(@.*)$/, "$1***$2");

verifyEmailConfig()
  .then(() => {
    console.log(`Mail config OK for ${maskEmail(process.env.SMTP_USER)}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Mail config check failed:", error.message);

    if (String(error.message).includes("535-5.7.8")) {
      console.error("");
      console.error("Gmail rejected the login. Fix backend/.env:");
      console.error("1. SMTP_USER must be the same Gmail account that created the app password.");
      console.error("2. SMTP_PASS must be a fresh 16-character Gmail App Password, not your normal Gmail password.");
      console.error("3. Gmail account must have 2-Step Verification enabled before creating an App Password.");
      console.error("4. After changing .env, run: npm run check:mail");
    }

    process.exit(1);
  });
