require("dotenv").config();

const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const sns = new SNSClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY 
  },
});

async function sendSms() {
  try {
    const response = await sns.send(
      new PublishCommand({
        Message: "OG IS New CTO",
        PhoneNumber: "+27672806288",
      })
    );

    console.log("SMS sent:", response);
  } catch (err) {
    console.error("SNS error:", err);
  }
}