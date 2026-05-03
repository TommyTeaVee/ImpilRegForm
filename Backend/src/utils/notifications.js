require("dotenv").config();

const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const region = process.env.AWS_REGION || "us-east-1";

const credentials =
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    : undefined;

const ses = new SESClient({ region, credentials });
const sns = new SNSClient({ region, credentials });

const DEFAULT_FROM = "no-reply@impilomag.co.za";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PHONE = process.env.ADMIN_PHONE 

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
        Subject: { Data: "Registration not Approved!" },
        Body: {
          Text: {
            Data: `Hi ${fullname},\n\n We regret to inform you that your Modelling application was not succesfully approved.\n\nBest regards,\nImpilo Team`,
          },
        },
      },
    })
    await ses.sendEmail(emailParams).promise();

    // --- SMS via SNS ---
    if (phone) {
      const smsParams = {
        Message: `Hi ${fullname}, We regret to inform you that your Modelling application was not succesfully approved, Impilo Tram`,
        PhoneNumber: phone,
      };
      await sns.publish(smsParams).promise();
    }

    console.log(`Notifications sent to ${email} and ${phone}`);
    return true;
  } catch (err) {
    console.error("Error sending notifications:", err);
    return false;
  }
}



async function notifyModelApproved(email, phone, fullname) {
  try {
    // --- Email via SES ---
    const emailParams = {
      Source: "no-reply@impilomag.co.za",
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: "Registration Approved!" },
        Body: {
          Text: {
            Data: `Hi ${fullname},\n\nYour model registration has been approved! Welcome to Impilo Talent Agency.\n\nBest regards,\nImpilo Team`,
          },
        },
      },
    };
    await ses.sendEmail(emailParams).promise();

    // --- SMS via SNS ---
    if (phone) {
      const smsParams = {
        Message: `Hi ${fullname}, your model registration has been approved! - Impilo Talent Agency`,
        PhoneNumber: phone,
      };
      await sns.publish(smsParams).promise();
    }

    console.log(`Notifications sent to ${email} and ${phone}`);
    return true;
  } catch (err) {
    console.error("Error sending notifications:", err);
    return false;
  }
}



// Notification for new submission
async function notifyNewSubmission(email, phone, fullname) {
  try {
    // --- Email to Admin ---
    const emailParams = {
      Source: "agency@impilomag.co.za", // Must be SES verified
      Destination: { ToAddresses: ["admin@impilomag.co.za"] }, // <-- your email
      Message: {
        Subject: { Data: "📩 New Model Registration Submitted" },
        Body: {
          Text: {
            Data: `Hi Admin,\n\nA new model registration has been submitted.\n\nName: ${fullname}\nEmail: ${email}\nPhone: ${phone}\n\nLogin to the dashboard to review.\n\n- Impilo Talent System`,
          },
        },
      },
    };
    await ses.sendEmail(emailParams).promise();

    // --- SMS to Admin ---
    const smsParams = {
      Message: `📩 New Model Submission: ${fullname}, ${email}, ${phone}`,
      PhoneNumber: "+27672806288", // <-- Replace with YOUR number (E.164 format)
    };

    
    await sns.publish(smsParams).promise();

    console.log(`✅ Admin notified: ${fullname}`);
    return true;
  } catch (err) {
    console.error("❌ Error notifying admin:", err);
    return false;
  }
}
// Send approval OR welcome email
async function notifySubscriber(email, phone, fullname) {
  try {
    if (!email) {
      console.error("❌ notifySubscriber called without email");
      return false;
    }

    const fullNameSafe = fullname || "Subscriber";

    const emailParams = {
      Source: "no-reply@impilomag.co.za",
      Destination: {
        ToAddresses: [email], // MUST NOT BE undefined
      },
      Message: {
        Subject: { Data: "Welcome to Impilo Magazine!" },
        Body: {
          Text: {
            Data: `Hi ${fullNameSafe},\n\nThank you for subscribing to Impilo Magazine!\n\nBest regards,\nThe Impilo Team`,
          },
        },
      },
    };

    await ses.sendEmail(emailParams).promise();

    if (phone) {
      await sns.publish({
        Message: `Hi ${fullNameSafe}, thanks for subscribing to Impilo Magazine!`,
        PhoneNumber: phone,
      }).promise();
    }

    return true;
  } catch (err) {
    console.error("Error sending notifications:", err);
    return false;
  }
}




module.exports = { notifyModelApproved, notifyModelDissApproved,  notifyNewSubmission, notifySubscriber };