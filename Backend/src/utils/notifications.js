require("dotenv").config();

const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const region = process.env.AWS_REGION || "us-east-1";

// Prefer IAM role in production, fallback to env locally
const credentials =
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined;

const ses = new SESClient({ region, credentials });
const sns = new SNSClient({ region, credentials });

const DEFAULT_FROM = process.env.EMAIL_FROM || "no-reply@impilomag.co.za";
const REPLY_TO = process.env.REPLY_TO || "info@impilomag.co.za";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "agency@impilomag.co.za";
const ADMIN_PHONE = process.env.ADMIN_PHONE || "+27672806288";

//const IS_SMS_ENABLED = process.env.SMS_ENABLED === "true"; // disable in sandbox easily

// ---------------------
// Helpers
// ---------------------

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

// ---------------------
// Core Services
// ---------------------

async function sendEmail({ to, subject, text, source = DEFAULT_FROM }) {
  try {
    if (!isValidEmail(to)) {
      console.warn("Invalid email skipped:", to);
      return false;
    }

    const command = new SendEmailCommand({
      Source: source,
      ReplyToAddresses: [REPLY_TO],
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
    });

    await ses.send(command);

    console.log(`📧 Email sent → ${to}`);
    return true;
  } catch (err) {
    console.error("❌ Email error:", err.message);
    return false;
  }
}

async function sendSms({ phone, message }) {
  try {
    /* f (!IS_SMS_ENABLED) {
      console.warn("⚠️ SMS disabled (sandbox mode)");
      return false;
    } */

    const phoneNumber = normalizePhone(phone);

    if (!phoneNumber) {
      console.warn("Invalid phone skipped:", phone);
      return false;
    }

    const command = new PublishCommand({
      Message: message,
      PhoneNumber: phoneNumber,
      MessageAttributes: {
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: "Transactional",
        },
      },
    });

    await sns.send(command);

    console.log(`📱 SMS sent → ${phoneNumber}`);
    return true;
  } catch (err) {
    console.error("❌ SMS error:", err.message);
    return false;
  }
}

// ---------------------
// Notifications
// ---------------------

async function notifyModelApproved(email, phone, fullname) {
  const name = fullname || "Applicant";

  await sendEmail({
    to: email,
    subject: "Welcome to Impilo Talent Agency 🎉",
    text: `Hi ${name},

Great news — your model registration has been approved!

We’re excited to have you join Impilo Talent Agency.

If you have any questions, simply reply to this email.

Warm regards,  
Impilo Team`,
  });

  await sendSms({
    phone,
    message: `Hi ${name}, your Impilo model registration is approved! 🎉`,
  });

  return true;
}

async function notifyModelDissApproved(email, phone, fullname) {
  const name = fullname || "Applicant";

  await sendEmail({
    to: email,
    subject: "Impilo Registration Update",
    text: `Hi ${name},

Thank you for your application.

Unfortunately, your submission was not approved at this time.

We encourage you to apply again in future.

Best regards,  
Impilo Team`,
  });

  await sendSms({
    phone,
    message: `Hi ${name}, your Impilo application was not approved this time.`,
  });

  return true;
}

async function notifyNewSubmission(email, phone, fullname) {
  const name = fullname || "Unknown applicant";

  await sendEmail({
    source: "agency@impilomag.co.za",
    to: ADMIN_EMAIL,
    subject: "📩 New Model Registration",
    text: `New submission received:

Name: ${name}
Email: ${email || "N/A"}
Phone: ${phone || "N/A"}

Login to review.`,
  });

  await sendSms({
    phone: ADMIN_PHONE,
    message: `New submission: ${name}`,
  });

  return true;
}

async function notifySubscriber(email, phone, fullname) {
  const name = fullname || "Subscriber";

  await sendEmail({
    to: email,
    subject: "Welcome to Impilo Magazine ✨",
    text: `Hi ${name},

Thank you for subscribing to Impilo Magazine.

Stay tuned for exclusive content and features.

– Impilo Team`,
  });

  await sendSms({
    phone,
    message: `Hi ${name}, welcome to Impilo Magazine!`,
  });

  return true;
}

// ---------------------

module.exports = {
  notifyModelApproved,
  notifyModelDissApproved,
  notifyNewSubmission,
  notifySubscriber,
};