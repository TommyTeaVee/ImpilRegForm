const express= require('express');
const router= express.Router();
const prisma = require("../auth/Admin");
const { notifySubscriber } = require("../utils/notifications");

router.get("/subscribers", async (req, res) => {
  try {
    const subs = await prisma.subscriber.findMany({
      orderBy: { subscribedAt: "desc" }
    });

    res.json(subs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching subscribers" });
  }
});

router.post("/subscribe", async (req, res) => {
  try {
    const { fullname, email } = req.body;

    if (!fullname || !email) {
      return res.json({ success: false, message: "Full name and email required" });
    }

    const saved = await prisma.subscriber.upsert({
      where: { email },
      update: { fullname },
      create: { fullname, email },
    });

    // SES
    await notifySubscriber(saved.email, null, saved.fullname);

    return res.json({ success: true });
  } catch (err) {
    console.error("Subscription error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router