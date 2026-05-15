import nodemailer from "nodemailer";

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("Email service is not configured. Please add SMTP settings in backend/.env.");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS.replace(/\s/g, ""),
    },
  });
};

export const verifyEmailConfig = async () => {
  const transporter = getTransporter();
  await transporter.verify();
  return true;
};

export const sendMail = async ({ to, subject, text, html }) => {
  const transporter = getTransporter();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || "Sri Venkateswara Family Shop <no-reply@svfs.local>";
  const info = await transporter.sendMail({ from, to, subject, text, html });

  if (Array.isArray(info.rejected) && info.rejected.length > 0) {
    throw new Error(`Email was rejected for ${info.rejected.join(", ")}`);
  }

  return info;
};

export const sendOtpMail = ({ to, name = "Customer", otp, purpose }) => {
  const title = purpose === "register" ? "Verify your account" : "Reset your password";
  const text = `Hi ${name}, your Sri Venkateswara Family Shop OTP is ${otp}. It expires in 10 minutes.`;

  return sendMail({
    to,
    subject: `${title} - OTP ${otp}`,
    text,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
        <h2>${title}</h2>
        <p>Hi ${name},</p>
        <p>Your OTP is:</p>
        <p style="font-size:28px;font-weight:700;letter-spacing:6px;color:#ea580c">${otp}</p>
        <p>This OTP expires in 10 minutes.</p>
      </div>
    `,
  });
};

export const sendWelcomeMail = ({ to, name }) =>
  sendMail({
    to,
    subject: "Welcome to Sri Venkateswara Family Shop",
    text: `Hi ${name}, welcome to Sri Venkateswara Family Shop. Your account has been created successfully.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
        <h2>Welcome, ${name}</h2>
        <p>Your account has been created successfully.</p>
        <p>Happy shopping with Sri Venkateswara Family Shop.</p>
      </div>
    `,
  });

export const sendOrderConfirmationMail = ({ to, order }) => {
  const orderId = order.orderCode || order._id;
  const items = (order.items || [])
    .map((item) => `<li>${item.name || item.product || "Product"} x ${item.quantity || 1}</li>`)
    .join("");

  return sendMail({
    to,
    subject: `Order Confirmed - ${orderId}`,
    text: `Your order ${orderId} is confirmed. Track ID: ${orderId}. Total: Rs. ${Number(order.amount || 0).toLocaleString("en-IN")}. Products: ${order.product}.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
        <h2>Order Confirmed</h2>
        <p>Hi ${order.customer}, your payment is completed and order is confirmed.</p>
        <p><strong>Track ID:</strong> ${orderId}</p>
        <p><strong>Total:</strong> Rs. ${Number(order.amount || 0).toLocaleString("en-IN")}</p>
        <p><strong>Products:</strong> ${order.product}</p>
        ${items ? `<ul>${items}</ul>` : ""}
      </div>
    `,
  });
};

const formatMoney = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const getOrderItems = (order) => {
  const amount = Number(order.amount || 0);
  const items = Array.isArray(order.items) && order.items.length
    ? order.items
    : [{ name: order.product, quantity: 1, price: amount, total: amount }];

  return items.map((item) => {
    const quantity = Number(item.quantity || 1);
    const price = Number(item.price || item.amount || item.total || amount);

    return {
      name: item.name || item.product || order.product || "Product",
      quantity,
      price,
      total: Number(item.total || price * quantity),
    };
  });
};

const renderBillRows = (order) =>
  getOrderItems(order)
    .map(
      (item, index) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#64748b">${index + 1}</td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;font-weight:700;color:#10212b">${item.name}</td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:center;color:#475569">${item.quantity}</td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;color:#475569">${formatMoney(item.price)}</td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:800;color:#10212b">${formatMoney(item.total)}</td>
        </tr>
      `
    )
    .join("");

const renderMailShell = ({ title, subtitle, badge, body }) => `
  <div style="margin:0;background:#f4f7fb;padding:28px 12px;font-family:Arial,sans-serif;color:#1f2937">
    <div style="max-width:760px;margin:0 auto;overflow:hidden;border:1px solid #e2e8f0;border-radius:22px;background:#ffffff;box-shadow:0 12px 34px rgba(15,23,42,0.08)">
      <div style="background:#10212b;padding:24px;color:#ffffff">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:16px">
          <div>
            <div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:16px;background:#4DA7AF;color:#ffffff;font-weight:900;font-size:18px">SV</div>
            <h1 style="margin:14px 0 4px;font-size:24px;line-height:1.25">Sri Venkateswara Family Shop</h1>
            <p style="margin:0;color:#cbd5e1;font-size:13px;font-weight:700">${subtitle}</p>
          </div>
          ${badge ? `<div style="border-radius:999px;background:#e9fbfc;color:#23777f;padding:9px 13px;font-size:12px;font-weight:900;white-space:nowrap">${badge}</div>` : ""}
        </div>
      </div>
      <div style="padding:26px">
        <h2 style="margin:0 0 12px;color:#10212b;font-size:24px;line-height:1.25">${title}</h2>
        ${body}
      </div>
    </div>
  </div>
`;

export const sendOrderStatusMail = ({ to, order, previousStatus }) => {
  const orderId = order.orderCode || order._id;
  const amount = Number(order.amount || 0);
  const statusMessages = {
    Pending: "Your order has been received and is waiting for confirmation.",
    Confirmed: "Your order is confirmed. We will start preparing it shortly.",
    Packed: "Your order has been packed and is ready for delivery.",
    Delivered: "Your order has been delivered successfully. Your bill summary is included below.",
    Cancelled: "Your order has been cancelled. Please contact us if you need help.",
  };
  const statusMessage = statusMessages[order.status] || `Your order status is now ${order.status}.`;
  const statusLine = previousStatus
    ? `Status changed from ${previousStatus} to ${order.status}.`
    : `Current status: ${order.status}.`;
  const deliveredBillSection = order.status === "Delivered"
    ? `
      <div style="margin-top:22px;border:1px solid #dbeafe;border-radius:18px;background:#f8fafc;padding:18px">
        <h3 style="margin:0 0 12px;color:#10212b;font-size:17px">Bill Summary</h3>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;background:#ffffff">
          <thead>
            <tr style="background:#e9fbfc;color:#23777f">
              <th style="padding:11px;text-align:left">#</th>
              <th style="padding:11px;text-align:left">Item</th>
              <th style="padding:11px;text-align:center">Qty</th>
              <th style="padding:11px;text-align:right">Rate</th>
              <th style="padding:11px;text-align:right">Total</th>
            </tr>
          </thead>
          <tbody>${renderBillRows(order)}</tbody>
        </table>
        <div style="margin-top:14px;border-radius:16px;background:#10212b;color:#ffffff;padding:16px;text-align:right">
          <span style="display:block;color:#cbd5e1;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em">Grand Total</span>
          <strong style="font-size:24px">${formatMoney(amount)}</strong>
        </div>
      </div>
    `
    : "";

  return sendMail({
    to,
    subject: order.status === "Delivered" ? `Order Delivered & Bill Summary - ${orderId}` : `Order Status Updated - ${orderId}`,
    text: `Hi ${order.customer}, ${statusLine} ${statusMessage} Track ID: ${orderId}. Total: ${formatMoney(amount)}. Products: ${order.product}.`,
    html: renderMailShell({
      title: order.status === "Delivered" ? "Your Order Has Been Delivered" : "Order Status Updated",
      subtitle: "Order update from your family shopping store",
      badge: order.status,
      body: `
        <p style="margin:0 0 16px;line-height:1.7;color:#475569">Hi <strong>${order.customer}</strong>,</p>
        <p style="margin:0 0 14px;line-height:1.7;color:#475569">${statusMessage}</p>
        <div style="margin-top:18px;display:grid;gap:10px">
          <div style="border-radius:14px;background:#f8fafc;padding:13px 15px"><strong>Track ID:</strong> ${orderId}</div>
          <div style="border-radius:14px;background:#f8fafc;padding:13px 15px"><strong>Status:</strong> ${statusLine}</div>
          <div style="border-radius:14px;background:#f8fafc;padding:13px 15px"><strong>Products:</strong> ${order.product}</div>
          <div style="border-radius:14px;background:#f8fafc;padding:13px 15px"><strong>Total:</strong> ${formatMoney(amount)}</div>
        </div>
        ${deliveredBillSection}
        <p style="margin:22px 0 0;line-height:1.7;color:#64748b">Need help with this order? Please contact the shop team with your Track ID.</p>
      `,
    }),
  });
};

export const sendOrderBillMail = ({ to, order }) => {
  const orderId = order.orderCode || order._id;
  const amount = Number(order.amount || 0);

  return sendMail({
    to,
    subject: `Bill Receipt - ${orderId}`,
    text: `Hi ${order.customer}, your delivered order bill receipt for ${orderId} is ready. Total: ${formatMoney(amount)}. Status: Delivered.`,
    html: renderMailShell({
      title: "Bill Receipt",
      subtitle: "Delivered order bill from Sri Venkateswara Family Shop",
      badge: "Delivered",
      body: `
        <p style="margin:0 0 18px;line-height:1.7;color:#475569">Hi <strong>${order.customer}</strong>, your order has been delivered successfully. Your final bill is below.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px">
          <div style="border:1px solid #e2e8f0;border-radius:16px;padding:15px;background:#f8fafc">
            <p style="margin:0 0 6px;color:#23777f;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.12em">Customer</p>
            <p style="margin:0;color:#10212b;font-weight:800">${order.customer}</p>
            <p style="margin:4px 0 0;color:#64748b;font-size:13px">${order.phone || "-"}</p>
            <p style="margin:4px 0 0;color:#64748b;font-size:13px">${order.email || "-"}</p>
          </div>
          <div style="border:1px solid #e2e8f0;border-radius:16px;padding:15px;background:#f8fafc">
            <p style="margin:0 0 6px;color:#23777f;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.12em">Order</p>
            <p style="margin:0;color:#10212b;font-weight:800">${orderId}</p>
            <p style="margin:4px 0 0;color:#64748b;font-size:13px">${order.paymentMethod || "Online"} / ${order.paymentStatus || "-"}</p>
            <p style="margin:4px 0 0;color:#64748b;font-size:13px">${order.date || "-"} ${order.time || ""}</p>
          </div>
        </div>
        <div style="border:1px solid #e2e8f0;border-radius:16px;padding:15px;background:#ffffff;margin-bottom:18px">
          <p style="margin:0 0 6px;color:#23777f;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.12em">Delivery Address</p>
          <p style="margin:0;color:#475569;line-height:1.6">${order.address || "-"}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;background:#ffffff">
          <thead>
            <tr style="background:#e9fbfc;color:#23777f">
              <th style="padding:12px;text-align:left">#</th>
              <th style="padding:12px;text-align:left">Item</th>
              <th style="padding:12px;text-align:center">Qty</th>
              <th style="padding:12px;text-align:right">Rate</th>
              <th style="padding:12px;text-align:right">Amount</th>
            </tr>
          </thead>
          <tbody>${renderBillRows(order)}</tbody>
        </table>
        <div style="margin-top:18px;border-radius:18px;background:#10212b;color:#ffffff;padding:18px;text-align:right">
          <span style="display:block;color:#cbd5e1;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em">Grand Total</span>
          <strong style="font-size:28px">${formatMoney(amount)}</strong>
        </div>
        <div style="margin-top:20px;border-radius:16px;background:#fff7ed;padding:16px;color:#9a3412">
          <strong>Thank you!</strong>
          <p style="margin:6px 0 0;line-height:1.6">Keep this email as your online bill reference. For help, share your Bill ID with our shop team.</p>
        </div>
      `,
    }),
  });
};
