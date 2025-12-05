app.get("/api/subscribers", async (req, res) => {
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
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.json({ success: false, message: "Invalid email." });
  }

  try {
    // Create subscriber (ignore duplicates)
    await prisma.subscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
 await notifySubscriber(
      saved.email,
      null,              // no phone number
      "Subscriber"       // placeholder name
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
