const mongoose = require("mongoose");

const QuotationQuerySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  pincode: String,
  company: String,
  serviceType: String,
  jobTitle: String,
  message: String,
  status: {
    type: String,
    enum: ["Pending", "Cleared"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models?.QuotationQuery || mongoose.model("QuotationQuery", QuotationQuerySchema);
