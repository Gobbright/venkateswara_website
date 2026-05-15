import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { authRequest } from "../../utils/api";
import { saveUserSession } from "../../utils/userSession";
import PasswordField from "../../components/PasswordField";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  otp: "",
  resetPassword: "",
  resetConfirmPassword: "",
};

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("login");
  const [resetMethod, setResetMethod] = useState("email");
  const [form, setForm] = useState(initialForm);
  const [registerOtpSent, setRegisterOtpSent] = useState(false);
  const [resetOtpSent, setResetOtpSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setError("");
    setMessage("");
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setError("");
    setMessage("");
    setRegisterOtpSent(false);
    setResetOtpSent(false);
    setResetEmail("");
    setForm((currentForm) => ({ ...currentForm, otp: "" }));
  };

  const validateEmail = (email) => emailPattern.test(email.trim().toLowerCase());

  const login = async () => {
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const result = await authRequest("/auth/login", form);
    saveUserSession(result);
    setMessage("Login success.");
    navigate(location.state?.returnTo || "/", { replace: true });
  };

  const requestRegisterOtp = async () => {
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Password and confirm password must match.");
      return;
    }

    const result = await authRequest("/auth/register/request-otp", form);
    setRegisterOtpSent(true);
    setMessage(`OTP email sent successfully. Enter the OTP to create your account. Sent count: ${result.sendCount}.`);
  };

  const verifyRegisterOtp = async () => {
    const result = await authRequest("/auth/register/verify-otp", {
      email: form.email,
      otp: form.otp,
    });
    saveUserSession(result);
    setMessage("Account created successfully. Welcome email sent.");
    navigate(location.state?.returnTo || "/", { replace: true });
  };

  const requestResetOtp = async () => {
    if (resetMethod === "email" && !validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (resetMethod === "phone" && !form.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    const result = await authRequest("/auth/forgot-password/send-otp", {
      email: resetMethod === "email" ? form.email : "",
      phone: resetMethod === "phone" ? form.phone : "",
    });
    setResetOtpSent(true);
    setResetEmail(result.email || form.email);
    setMessage(`OTP email sent successfully. Enter the OTP to reset your password. Sent count: ${result.sendCount}.`);
  };

  const verifyResetOtp = async () => {
    if (form.resetPassword !== form.resetConfirmPassword) {
      setError("New password and confirm password must match.");
      return;
    }

    const result = await authRequest("/auth/forgot-password/verify-otp", {
      email: resetEmail || form.email,
      phone: resetMethod === "phone" ? form.phone : "",
      otp: form.otp,
      password: form.resetPassword,
    });
    saveUserSession(result);
    setMessage("Password updated successfully.");
    navigate(location.state?.returnTo || "/", { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await login();
      } else if (isRegister && registerOtpSent) {
        await verifyRegisterOtp();
      } else if (isRegister) {
        await requestRegisterOtp();
      } else if (isForgot && resetOtpSent) {
        await verifyResetOtp();
      } else {
        await requestResetOtp();
      }
    } catch (requestError) {
      setError(requestError.message || "Request failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      if (isRegister) {
        await requestRegisterOtp();
      } else {
        await requestResetOtp();
      }
      setForm((currentForm) => ({ ...currentForm, otp: "" }));
    } catch (requestError) {
      setError(requestError.message || "OTP resend failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const editOtpTarget = () => {
    setRegisterOtpSent(false);
    setResetOtpSent(false);
    setResetEmail("");
    setError("");
    setMessage("");
    setForm((currentForm) => ({ ...currentForm, otp: "" }));
  };

  const primaryText = () => {
    if (isLoading) return "Please wait...";
    if (isRegister && registerOtpSent) return "Verify OTP & Create Account";
    if (isRegister) return "Send OTP";
    if (isForgot && resetOtpSent) return "Reset Password";
    if (isForgot) return "Send OTP";
    return "Login";
  };

  return (
    <section className="min-h-screen bg-[#FAF0E6] px-5 py-8 text-[#1a0a00] md:px-16 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] md:p-8">
          <div className="grid grid-cols-2 rounded-full bg-orange-50 p-1">
            <button
              type="button"
              onClick={() => handleModeChange("login")}
              className={`h-11 rounded-full text-base font-bold transition ${
                isLogin ? "bg-orange-600 text-white shadow-[0_6px_16px_rgba(249,115,22,0.28)]" : "text-gray-700 hover:text-orange-600"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("register")}
              className={`h-11 rounded-full text-base font-bold transition ${
                isRegister ? "bg-orange-600 text-white shadow-[0_6px_16px_rgba(249,115,22,0.28)]" : "text-gray-700 hover:text-orange-600"
              }`}
            >
              Register
            </button>
          </div>

          <div className="mt-7">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {isForgot ? "Reset Password" : isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="mt-2 text-base leading-7 text-gray-600">
              {isForgot
                ? "Use email or phone number to receive a password reset OTP."
                : isLogin
                  ? "Login with your registered details."
                  : "Your account will be created after email OTP verification."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {isRegister && (
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                  <UserRound size={17} className="text-orange-600" />
                  Full Name
                </span>
                <input required disabled={registerOtpSent} value={form.name} onChange={(event) => updateField("name", event.target.value)} className="h-12 w-full rounded-full bg-orange-50 px-5 text-base outline-none transition focus:bg-white focus:ring-2 focus:ring-orange-300 disabled:opacity-70" placeholder="Enter your name" />
              </label>
            )}

            {isForgot && (
              <div className="grid grid-cols-2 rounded-full bg-orange-50 p-1">
                {["email", "phone"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => {
                      setResetMethod(method);
                      setResetOtpSent(false);
                    }}
                    className={`h-10 rounded-full text-sm font-bold capitalize transition ${resetMethod === method ? "bg-white text-orange-600 shadow-sm" : "text-slate-600"}`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            )}

            {(!isForgot || resetMethod === "email") && (
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                  <Mail size={17} className="text-orange-600" />
                  Email Address
                </span>
                <input required type="email" disabled={registerOtpSent || resetOtpSent} value={form.email} onChange={(event) => updateField("email", event.target.value)} className="h-12 w-full rounded-full bg-orange-50 px-5 text-base outline-none transition focus:bg-white focus:ring-2 focus:ring-orange-300 disabled:opacity-70" placeholder="Enter your email" />
              </label>
            )}

            {(isRegister || (isForgot && resetMethod === "phone")) && (
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                  <Phone size={17} className="text-orange-600" />
                  Phone Number
                </span>
                <input required={isForgot && resetMethod === "phone"} disabled={registerOtpSent || resetOtpSent} value={form.phone} onChange={(event) => updateField("phone", event.target.value)} className="h-12 w-full rounded-full bg-orange-50 px-5 text-base outline-none transition focus:bg-white focus:ring-2 focus:ring-orange-300 disabled:opacity-70" placeholder="Enter phone number" />
              </label>
            )}

            {!isForgot && (
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                  <LockKeyhole size={17} className="text-orange-600" />
                  Password
                </span>
                <PasswordField required disabled={registerOtpSent} value={form.password} onChange={(event) => updateField("password", event.target.value)} className="h-12 w-full rounded-full bg-orange-50 px-5 text-base outline-none transition focus:bg-white focus:ring-2 focus:ring-orange-300 disabled:opacity-70" placeholder="Enter password" />
              </label>
            )}

            {isRegister && (
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                  <LockKeyhole size={17} className="text-orange-600" />
                  Confirm Password
                </span>
                <PasswordField required disabled={registerOtpSent} value={form.confirmPassword} onChange={(event) => updateField("confirmPassword", event.target.value)} className="h-12 w-full rounded-full bg-orange-50 px-5 text-base outline-none transition focus:bg-white focus:ring-2 focus:ring-orange-300 disabled:opacity-70" placeholder="Confirm password" />
              </label>
            )}

            {(registerOtpSent || resetOtpSent) && (
              <div className="space-y-3">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                    <Mail size={17} className="text-orange-600" />
                    OTP
                  </span>
                  <input required inputMode="numeric" maxLength={6} value={form.otp} onChange={(event) => updateField("otp", event.target.value.replace(/\D/g, ""))} className="h-12 w-full rounded-full bg-orange-50 px-5 text-base font-bold tracking-[0.35em] outline-none transition focus:bg-white focus:ring-2 focus:ring-orange-300" placeholder="000000" />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={isLoading}
                    className="h-11 rounded-full border border-orange-200 bg-white px-4 text-sm font-bold text-orange-600 transition hover:border-orange-500 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Resend OTP
                  </button>
                  <button
                    type="button"
                    onClick={editOtpTarget}
                    className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    {isForgot && resetMethod === "phone" ? "Edit Phone" : "Edit Email"}
                  </button>
                </div>
              </div>
            )}

            {isForgot && resetOtpSent && (
              <>
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                    <LockKeyhole size={17} className="text-orange-600" />
                    New Password
                  </span>
                  <PasswordField required value={form.resetPassword} onChange={(event) => updateField("resetPassword", event.target.value)} className="h-12 w-full rounded-full bg-orange-50 px-5 text-base outline-none transition focus:bg-white focus:ring-2 focus:ring-orange-300" placeholder="Enter new password" />
                </label>
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                    <LockKeyhole size={17} className="text-orange-600" />
                    Confirm New Password
                  </span>
                  <PasswordField required value={form.resetConfirmPassword} onChange={(event) => updateField("resetConfirmPassword", event.target.value)} className="h-12 w-full rounded-full bg-orange-50 px-5 text-base outline-none transition focus:bg-white focus:ring-2 focus:ring-orange-300" placeholder="Confirm new password" />
                </label>
              </>
            )}

            {isLogin && (
              <div className="flex items-center justify-between gap-4 text-sm font-semibold text-gray-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 accent-orange-600" />
                  Remember me
                </label>
                <button type="button" onClick={() => handleModeChange("forgot")} className="text-orange-600 transition hover:text-[#21747b]">
                  Forgot password?
                </button>
              </div>
            )}

            {error && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center rounded-full bg-orange-600 px-5 text-base font-bold text-white transition hover:scale-[1.02] hover:bg-gradient-to-r hover:from-orange-600 hover:via-[#FFBE8A] hover:to-[#4DA7AF] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {primaryText()}
            </button>

            {isForgot && (
              <button
                type="button"
                onClick={() => handleModeChange("login")}
                className="flex h-11 w-full items-center justify-center rounded-full border border-orange-200 bg-white px-5 text-sm font-bold text-orange-600 transition hover:border-orange-500 hover:bg-orange-50"
              >
                Back to Login
              </button>
            )}

            {isLogin && (
              <Link
                to="/admin"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-orange-200 bg-white px-5 text-sm font-bold text-orange-600 transition !no-underline hover:border-orange-500 hover:bg-orange-50"
              >
                <ShieldCheck size={18} />
                Admin Login
              </Link>
            )}
          </form>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D9F0F2] to-[#FFF1E6] p-8 shadow-[0_6px_24px_rgba(77,167,175,0.16)] md:p-10">
          <span className="inline-flex rounded-full bg-orange-100 px-5 py-2 text-base font-semibold text-orange-600">
            Sri Venkateswara Family Shop Account
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
            Shop faster with your family shopping profile
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Sign in to manage wishlist items, cart products, video call appointments, and order updates in one place.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {["Email OTP register", "Password reset OTP", "Easy checkout", "Order mail updates"].map((item) => (
              <div key={item} className="rounded-2xl bg-white/70 p-4 text-sm font-bold text-gray-800 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;
