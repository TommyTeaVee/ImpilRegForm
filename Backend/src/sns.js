const AWS = require('aws-sdk');
require('dotenv').config()
// Configure AWS with your credentials and region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1', // e.g., 'us-east-1'
});

const sns = new AWS.SNS();

const params = {
  Message: 'KWENA SKHUMBA SENJA ENDALA WENA CANDY', // The SMS message
  PhoneNumber: '+27672806288' // The recipient's phone number in E.164 format
};

sns.publish(params, (err, data) => {
  if (err) {
    console.error("Error sending SMS:", err);
  } else {
    console.log("SMS sent successfully:", data);
  }
});