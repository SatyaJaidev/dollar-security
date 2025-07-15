
const mongoose = require("mongoose");

const guardScheduleSchema = new mongoose.Schema({
  date: String,
  startHour: String,
  startMinute: String,
  startPeriod: String,
  endHour: String,
  endMinute: String,
  endPeriod: String,
}, { _id: false });

const assignedGuardSchema = new mongoose.Schema({
  guardId: { type: mongoose.Schema.Types.ObjectId, ref: "Guard" },
  name: String,
  residentName: String,
  days: Number,
  schedule: [guardScheduleSchema] 
  /* chedule: {type: Array} */ 

}, { _id: false });

const clientSchema = new mongoose.Schema({
  name: String,
  email: String,
  joinedDate: String,
  startDate: String,
  endDate: String,
  guardType: String,
  numberOfGuards: Number,
  status: String,
  progress: { type: Number, default: 0 },
  assignedGuards: [assignedGuardSchema]
}, { timestamps: true });

module.exports = mongoose.model("Client", clientSchema);