require("dotenv").config();

const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const region = process.env.AWS_REGION || "us-east-1";

const credentials =
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
      }
    : undefined;

const ses = new SESClient({ region, credentials });
const sns = new SNSClient({ region, credentials });

const DEFAULT_FROM = "no-reply@impilomag.co.za";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@impilomag.co.za";
const ADMIN_PHONE = process.env.ADMIN_PHONE || "+27672806288";

function isValidEmail(email) {
  return typeof email === "string" && email.includes("@");
}

function normalizePhone(phone) {
  if (!phone) return null;

  let clean = String(phone).replace(/\s+/g, "");

  if (clean.startsWith("0")) {
    clean = `+27${clean.slice(1)}`;
  }

  if (!clean.startsWith("+")) {
    clean = `+${clean}`;
  }

  return clean;
}

async function sendEmail({ to, subject, text, source = DEFAULT_FROM }) {
  if (!isValidEmail(to)) {
    console.error("Invalid email:", to);
    return false;
  }

  await ses.send(
    new SendEmailCommand({
      Source: source,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: text,
            Charset: "UTF-8",
          },
        },
      },
    })
  );

  return true;
}

async function sendSms({ phone, message }) {
  const phoneNumber = normalizePhone(phone);

  if (!phoneNumber) return false;

  await sns.send(
    new PublishCommand({
      Message: message,
      PhoneNumber: phoneNumber,
    })
  );

  return true;
}

async function notifyModelDissApproved(email, phone, fullname) {
  try {
    const name = fullname || "Applicant";

    await sendEmail({
      to: email,
      subject: "Registration Not Approved",
      text: `Hi ${name},

We regret to inform you that your modelling application was not approved.

Best regards,
Impilo Team`,
    });

    await sendSms({
      phone,
      message: `Hi ${name}, we regret to inform you that your modelling application was not approved. Impilo Team`,
    });

    console.log(`Notifications sent to ${email} and ${phone || "no phone"}`);
    return true;
  } catch (err) {
    console.error("Error sending disapproval notification:", err);
    return false;
  }
}

async function notifyModelApproved(email, phone, fullname) {
  try {
    const name = fullname || "Applicant";

    await sendEmail({
      to: email,
      subject: "Registration Approved",
      text: `Hi ${name},

Your model registration has been approved! Welcome to Impilo Talent Agency.

Best regards,
Impilo Team`,
    });

    await sendSms({
      phone,
      message: `Hi ${name}, your model registration has been approved! - Impilo Talent Agency`,
    });

    console.log(`Notifications sent to ${email} and ${phone || "no phone"}`);
    return true;
  } catch (err) {
    console.error("Error sending approval notification:", err);
    return false;
  }
}

async function notifyNewSubmission(email, phone, fullname) {
  try {
    const name = fullname || "Unknown applicant";

    await sendEmail({
      source: "agency@impilomag.co.za",
      to: ADMIN_EMAIL,
      subject: "New Model Registration Submitted",
      text: `Hi Admin,

A new model registration has been submitted.

Name: ${name}
Email: ${email || "N/A"}
Phone: ${phone || "N/A"}

Login to the dashboard to review.

- Impilo Talent System`,
    });

    await sendSms({
      phone: ADMIN_PHONE,
      message: `New Model Submission: ${name}, ${email || "N/A"}, ${phone || "N/A"}`,
    });

    console.log(`Admin notified: ${name}`);
    return true;
  } catch (err) {
    console.error("Error notifying admin:", err);
    return false;
  }
}

async function notifySubscriber(email, phone, fullname) {
  try {
    const name = fullname || "Subscriber";

    await sendEmail({
      to: email,
      subject: "Welcome to Impilo Magazine",
      text: `Hi ${name},

Thank you for subscribing to Impilo Magazine!

Best regards,
The Impilo Team`,
    });

    await sendSms({
      phone,
      message: `Hi ${name}, thanks for subscribing to Impilo Magazine!`,
    });

    return true;
  } catch (err) {
    console.error("Error sending subscriber notification:", err);
    return false;
  }
}

module.exports = {
  notifyModelApproved,
  notifyModelDissApproved,
  notifyNewSubmission,
  notifySubscriber,
};