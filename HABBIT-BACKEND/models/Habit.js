const mongoose = require("mongoose");
const habitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  category: { type: String, default: "other" },
  time: { type: String, default: "" },
  streak: { type: Number, default: 0 },
  best: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  completedToday: { type: Boolean, default: false },
  lastCompletedDate: { type: String, default: null },
  completedDates: { type: [String], default: [] },
}, { timestamps: true });
module.exports = mongoose.model("Habit", habitSchema);