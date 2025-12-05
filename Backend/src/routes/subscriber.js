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

// Subscribe route
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  const {fullname}=req.body
  if (!email || !email.includes("@")) {
    return res.json({ success: false, message: "Invalid email." });
  }

  try {
    // Create subscriber (ignore duplicates)
    const saved =  prisma.subscriber.upsert({
      where: { email,fullname },
      update: {},
      create: { email, fullname },
    });
 
    // SEND WELCOME EMAIL
    await notifySubscriber(
      saved.email,
      saved.fullname || "Subscriber"  // use actual name
    );
  

    return res.json({ success: true });
  } catch (error) {
    console.error("Subscription error:", error);
    return res.json({
      success: false, 
      message: "Server error. Try again."
    });
  }
  
});

module.exports = router