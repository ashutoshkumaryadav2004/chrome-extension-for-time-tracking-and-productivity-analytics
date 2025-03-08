const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/timeTracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const activitySchema = new mongoose.Schema({
  url: String,
  timeSpent: Number,
  isProductive: Boolean,
  timestamp: { type: Date, default: Date.now },
});

const Activity = mongoose.model("Activity", activitySchema);

app.post("/api/track", async (req, res) => {
  const { url, timeSpent, isProductive } = req.body;
  const activity = new Activity({ url, timeSpent, isProductive });
  await activity.save();
  res.status(200).send("Data saved");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
