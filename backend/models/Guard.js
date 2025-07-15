const mongoose = require("mongoose");

// 🔧 Sub-schema to prevent Mongoose from auto-generating _id inside arrays
const documentSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    originalName: { type: String, required: true },
    uploadedAt: { type: Date, required: true },
  },
  { _id: false } // ✅ Important: disables _id for each document object
);

const guardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    payPerHour: { type: Number, required: true },
    dateJoined: { type: Date, required: true },
    certifications: { type: Boolean, default: false },
    licenseEndDate: { type: Date, required: true },
    dayType: { 
      type: String, 
      enum: ["weekday", "weekend"], 
      required: true 
    },
    shift: { 
      type: String, 
      enum: ["day", "night"], 
      required: true 
    },
    averageRating: {
      type: Number,
      default: 0
    },    
    documents: {
      certificates: [documentSchema],
      vaccinations: [documentSchema],
    },
    otherDocuments: [
      {
        name: String,
        url: String
      }
    ],
    reviews: [
      {
        customerName: String,
        reviewerName: String,
        site: String,
        message: String,
        rating: Number,
        date: Date,
        isRead: { type: Boolean, default: false },
      }
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Guard", guardSchema);
