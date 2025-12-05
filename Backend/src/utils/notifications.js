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
 * @param {string} fullname - recipient name
 */
async function notifyModelDissApproved(email, phone, fullname) {
  try {
    // --- Email via SES ---
    const emailParams = {
      Source: "no-reply@impilomag.co.za",
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: "Registration not Approved!" },
        Body: {
          Text: {
            Data: `Hi ${fullname},\n\n We regret to inform you that your Modelling application was not succesfully approved.\n\nBest regards,\nImpilo Team`,
          },
        },
      },
    };
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
async function notifySubscriber(email, fullname) {
  try {
    const emailParams = {
      Source: "no-reply@impilomag.co.za",
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: "Welcome to Impilo!" },
        Body: {
          Text: {
            Data: `Hi ${fullname},\n\nYou have been successfully added to our Impilo Magazine subscriber list.\nThank you for joining us!\n\nRegards,\nImpilo Team`,
          },
        },
      },
    };

    await ses.sendEmail(emailParams).promise();

 
    console.log(`✉️ Welcome email sent to ${email}`);
    return true;
  } catch (err) {
    console.error("Error sending notifications:", err);
    return false;
  }
}


module.exports = { notifyModelApproved, notifyModelDissApproved,  notifyNewSubmission, notifySubscriber };