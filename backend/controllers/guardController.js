const nodemailer = require("nodemailer");
const Guard = require("../models/Guard");
const AWS = require("aws-sdk");
const axios = require('axios');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// ✅ Share Guard Assignment to Client
const shareFullAssignmentToClient = async (req, res) => {
  const { clientName, email, guards } = req.body;

  try {
    if (!guards || guards.length === 0) {
      return res.status(400).json({ message: "No guards assigned" });
    }

    let html = `<h2>Client Assignment Summary</h2>
      <p><strong>Client Name:</strong> ${clientName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <hr />`;

    const attachments = [];

    for (const guardInfo of guards) {
      const guard = await Guard.findById(guardInfo.guardId);
      if (!guard) continue;

      html += `
        <h3>Guard: ${guard.name}</h3>
        <p><strong>Email:</strong> ${guard.email}</p>
        <p><strong>Average Rating:</strong> ${guard.averageRating?.toFixed(1) || "No reviews yet"} ⭐</p>
        <p><strong>Total Hours:</strong> ${guardInfo.totalHours}</p>
        <p><strong>Schedule:</strong></p>
        <ul>${guardInfo.schedule.map((s) => `<li>${s}</li>`).join("")}</ul>
        <hr />`;

      const docs = [
        ...(guard.documents?.certificates || []),
        ...(guard.documents?.vaccinations || []),
        ...(guard.otherDocuments || []),
      ];

      for (const doc of docs) {
        try {
          const response = await axios.get(doc.url, { responseType: "arraybuffer" });
          attachments.push({
            filename: doc.originalName || doc.name || "document.pdf",
            content: Buffer.from(response.data),
          });
        } catch (fetchErr) {
          console.error(`Failed to fetch document for ${guard.name}:`, fetchErr.message);
        }
      }
    }

    html += `<p>All related documents are attached below.</p>`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `Dollar Security <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Guard Assignment Details – ${clientName}`,
      html,
      attachments,
    });

    res.status(200).json({ message: "Full assignment email sent successfully" });
  } catch (err) {
    console.error("Error in shareFullAssignmentToClient:", err);
    res.status(500).json({ message: "Failed to send full assignment" });
  }
};


// ✅ Create Guard
const createGuard = async (req, res) => {
  try {
    const {
      name, email, phone, city, payPerHour,
      dateJoined, certifications, licenseEndDate, dayType, shift, documents,
    } = req.body;

    const guard = new Guard({
      name,
      email,
      phone,
      city,
      payPerHour,
      dateJoined,
      certifications,
      licenseEndDate,
      dayType,
      shift,
      documents: {
        certificates: documents?.certificates || [],
        vaccinations: documents?.vaccinations || [],
      },
    });

    await guard.save();
    res.status(201).json(guard);
  } catch (err) {
    console.error("Error creating guard:", err);
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get All Guards
const getGuards = async (req, res) => {
  try {
    const guards = await Guard.find().sort({ createdAt: -1 });

    const guardsWithAvg = guards.map((guard) => {
      const reviews = guard.reviews || [];
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = reviews.length > 0 ? totalRating / reviews.length : null;

      // ✅ Count unread reviews for this guard
      const unreadReviewsCount = reviews.filter(review => 
        review.isRead === undefined || review.isRead === false
      ).length;

      return {
        ...guard.toObject(),
        averageRating,
        unreadReviewsCount, // ✅ Add unread count to response
      };
    });

    res.status(200).json(guardsWithAvg);
  } catch (err) {
    console.error("Error fetching guards:", err);
    res.status(500).json({ error: err.message });
  }
};


// ✅ Update Guard
const updateGuard = async (req, res) => {
  try {
    const {
      name, email, phone, city, payPerHour,
      dateJoined, certifications, licenseEndDate, dayType, shift, documents,
    } = req.body;

    const updatedGuard = await Guard.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        city,
        payPerHour,
        dateJoined,
        certifications,
        licenseEndDate,
        dayType,
        shift,
        documents: {
          certificates: documents?.certificates || [],
          vaccinations: documents?.vaccinations || [],
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedGuard)
      return res.status(404).json({ error: "Guard not found" });

    res.status(200).json(updatedGuard);
  } catch (err) {
    console.error("Error updating guard:", err);
    res.status(400).json({ error: err.message });
  }
};

// ✅ Submit Feedback and Compute Average Rating
const submitFeedback = async (req, res) => {
  const { guardName, customerName, reviewerName, site, message, rating, date } = req.body;

  try {
    console.log("🟡 Incoming review data:", req.body);

    const guard = await Guard.findOne({
      name: { $regex: new RegExp(`^${guardName.trim()}$`, 'i') }
    });

    if (!guard) {
      console.error("❌ Guard not found:", guardName);
      return res.status(404).json({ message: "Guard not found" });
    }

    guard.reviews = guard.reviews || [];

    guard.reviews.push({
      customerName,
      reviewerName,
      site,
      message,
      rating,
      date,
    });

    // ✅ Compute updated average rating
    const totalRatings = guard.reviews.reduce((sum, r) => sum + r.rating, 0);
    guard.averageRating = totalRatings / guard.reviews.length;

    await guard.save({ validateModifiedOnly: true });

    console.log(`✅ Review saved to guard: ${guard.name}, new avg rating: ${guard.averageRating}`);
    res.status(200).json({ message: "Feedback submitted", guard });
  } catch (err) {
    console.error("🔥 Internal server error in submitFeedback:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// ✅ Replace Document (Cert or Vaccination)
const replaceDocument = async (req, res) => {
  const { id } = req.params;
  const { type, docId } = req.body;

  try {
    const guard = await Guard.findById(id);
    if (!guard) return res.status(404).json({ error: "Guard not found" });

    if (!["certificates", "vaccinations"].includes(type)) {
      return res.status(400).json({ error: "Invalid document type" });
    }

    const documentArray = guard.documents[type];
    const index = documentArray.findIndex((doc) => doc._id.toString() === docId);
    if (index === -1)
      return res.status(404).json({ error: "Document not found" });

    const file = req.file;
    const newDoc = {
      originalName: file.originalname,
      url: file.location,
      uploadedAt: new Date(),
      _id: documentArray[index]._id,
    };

    documentArray[index] = newDoc;
    await guard.save();

    res.status(200).json({ message: "Document replaced successfully", guard });
  } catch (err) {
    console.error("Error replacing document:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ DELETE all reviews for a guard
const clearGuardReviews = async (req, res) => {
  const { id } = req.params;

  try {
    const guard = await Guard.findByIdAndUpdate(
      id,
      { reviews: [], averageRating: 0 },
      { new: true }
    );

    if (!guard) return res.status(404).json({ error: "Guard not found" });

    res.status(200).json({ message: "Reviews cleared" });
  } catch (err) {
    console.error("🔥 Error in clearGuardReviews:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Delete Guard
const deleteGuard = async (req, res) => {
  try {
    const guardId = req.params.id;

    const deletedGuard = await Guard.findByIdAndDelete(guardId);
    
    if (!deletedGuard) {
      return res.status(404).json({ error: "Guard not found" });
    }

    res.status(200).json({ 
      message: "Guard deleted successfully", 
      deletedGuard: deletedGuard 
    });
  } catch (err) {
    console.error("Error deleting guard:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Unread Reviews Count
const getUnreadReviewsCount = async (req, res) => {
  try {
    const guards = await Guard.find();
    let unreadCount = 0;
    
    guards.forEach(guard => {
      if (guard.reviews) {
        unreadCount += guard.reviews.filter(review => 
          review.isRead === undefined || review.isRead === false
        ).length;
      }
    });
    
    res.status(200).json({ unreadCount });
  } catch (err) {
    console.error("Error getting unread reviews count:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Mark All Reviews as Read
const markAllReviewsAsRead = async (req, res) => {
  try {
    console.log("🔄 Starting to mark all reviews as read...");
    
    // Find all guards with reviews that need to be marked as read
    const guards = await Guard.find({ 
      reviews: { 
        $exists: true, 
        $ne: [],
        $elemMatch: {
          $or: [
            { isRead: { $exists: false } },
            { isRead: false }
          ]
        }
      }
    });
    
    console.log(`📊 Found ${guards.length} guards with unread reviews`);
    
    if (guards.length === 0) {
      return res.status(200).json({ 
        message: "No unread reviews found",
        updatedCount: 0 
      });
    }
    
    let updatedGuardsCount = 0;
    
    // Use bulk operations for better performance and reliability
    const bulkOps = [];
    
    for (const guard of guards) {
      // Mark all reviews as read using positional operator
      bulkOps.push({
        updateOne: {
          filter: { _id: guard._id },
          update: { 
            $set: { "reviews.$[].isRead": true }
          }
        }
      });
    }
    
    // Execute bulk operation
    if (bulkOps.length > 0) {
      const result = await Guard.bulkWrite(bulkOps);
      updatedGuardsCount = result.modifiedCount;
      console.log(`✅ Successfully updated ${updatedGuardsCount} guards`);
    }
    
    res.status(200).json({ 
      message: `All reviews marked as read for ${updatedGuardsCount} guards`,
      updatedCount: updatedGuardsCount
    });
  } catch (err) {
    console.error("❌ Error marking reviews as read:", err);
    
    // Return more specific error information
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation error occurred",
        details: err.message 
      });
    }
    
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        error: "Invalid data format",
        details: err.message 
      });
    }
    
    res.status(500).json({ 
      error: "Internal server error",
      details: err.message 
    });
  }
};

module.exports = {
  createGuard,
  getGuards,
  updateGuard,
  replaceDocument,
  shareFullAssignmentToClient,
  clearGuardReviews,
  submitFeedback,
  deleteGuard,
  getUnreadReviewsCount,
  markAllReviewsAsRead,
};
