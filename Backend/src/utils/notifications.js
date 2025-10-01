const AWS = require("aws-sdk");
require('dotenv').config()
// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION, 
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// SES for email
const ses = new AWS.SES({ apiVersion: "2010-12-01" });

// SNS for SMS
const sns = new AWS.SNS({ apiVersion: "2010-03-31" });

/**
 * Send email and SMS notification to model when approved
 * @param {string} email - recipient email
 * @param {string} phone - recipient phone number (include country code, e.g., +27712345678)
 * @param {string} fullName - recipient name
 */
async function notifyModelDissApproved(email, phone, fullName) {
  try {
    // --- Email via SES ---
    const emailParams = {
      Source: "no-reply@impilomag.co.za",
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: "Registration not Approved!" },
        Body: {
          Text: {
            Data: `Hi ${fullName},\n\n We regret to inform you that your Modelling application was not succesfully approved.\n\nBest regards,\nImpilo Team`,
          },
        },
      },
    };
    await ses.sendEmail(emailParams).promise();

    // --- SMS via SNS ---
    if (phone) {
      const smsParams = {
        Message: `Hi ${fullName}, We regret to inform you that your Modelling application was not succesfully approved, Impilo Tram`,
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

module.exports = { notifyModelDissApproved };

async function notifyModelApproved(email, phone, fullName) {
  try {
    // --- Email via SES ---
    const emailParams = {
      Source: "no-reply@impilomag.co.za",
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: "Registration Approved!" },
        Body: {
          Text: {
            Data: `Hi ${fullName},\n\nYour model registration has been approved! Welcome to Impilo Talent Agency.\n\nBest regards,\nImpilo Team`,
          },
        },
      },
    };
    await ses.sendEmail(emailParams).promise();

    // --- SMS via SNS ---
    if (phone) {
      const smsParams = {
        Message: `Hi ${fullName}, your model registration has been approved! - Impilo Talent Agency`,
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

module.exports = { notifyModelApproved };
