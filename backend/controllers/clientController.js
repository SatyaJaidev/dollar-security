/*
const Client = require("../models/clientModel");

exports.createClient = async (req, res) => {
  try {
    console.log("📥 Received client from frontend:", req.body); // <-- Add this line
    const {
      name,
      email,
      joinedDate,
      guardType,
      numberOfGuards,
      selectedGuards,
      status,
      progress,
      startDate,
      endDate
    } = req.body;
    
    const newClient = await Client.create({
      name,
      email,
      joinedDate,
      guardType,
      numberOfGuards,
      selectedGuards,
      status,
      progress: progress ?? 0,
      startDate,
      endDate
    });
    res.status(201).json(newClient);
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message); // log the specific reason
    res.status(400).json({ error: err.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateClient = async (req, res) => {
    try {
      const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!updatedClient) return res.status(404).json({ message: "Client not found" });
      res.json(updatedClient);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.deleteClient = async (req, res) => {
    try {
      const deletedClient = await Client.findByIdAndDelete(req.params.id);
      if (!deletedClient) return res.status(404).json({ message: "Client not found" });
      res.json({ message: "Client deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  */

  /*
const Client = require("../models/clientModel");

exports.createClient = async (req, res) => {
  try {
    console.log("📥 Received client from frontend:", req.body);
    const {
      name,
      email,
      joinedDate,
      guardType,
      numberOfGuards,
      assignedGuards, // <-- renamed from selectedGuards
      status,
      progress,
      startDate,
      endDate
    } = req.body;

    const newClient = await Client.create({
      name,
      email,
      joinedDate,
      guardType,
      numberOfGuards,
      assignedGuards,
      status,
      progress: progress ?? 0,
      startDate,
      endDate
    });

    res.status(201).json(newClient);
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find()
      .populate("assignedGuards", "name email type") // only show select guard fields
      .sort({ createdAt: -1 });

    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedClient) return res.status(404).json({ message: "Client not found" });
    res.json(updatedClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);

    if (!deletedClient) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
*/

const Client = require("../models/clientModel");

// ✅ CREATE CLIENT
exports.createClient = async (req, res) => {
  try {
    console.log("📥 Received client from frontend:", req.body);

    // 🔍 Debugging dates
    console.log("📅 Date fields:", {
      joinedDate: req.body.joinedDate,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });

    // 🔍 Debugging assignedGuards structure
    console.log("🔑 Keys:", Object.keys(req.body));
    if (Array.isArray(req.body.assignedGuards)) {
      console.log("🛡 Assigned Guards:");
      req.body.assignedGuards.forEach((g, i) => {
        console.log(`  ➤ Guard ${i + 1}:`, {
          guardId: g.guardId,
          name: g.name,
          days: g.days,
          scheduleType: typeof g.schedule,
          scheduleLength: g.schedule?.length
        });
      });
    } else {
      console.warn("⚠ assignedGuards is not an array:", req.body.assignedGuards);
    }

    const {
      name,
      email,
      joinedDate,
      guardType,
      numberOfGuards,
      assignedGuards,
      progress,
      startDate,
      endDate
    } = req.body;

    const newClient = await Client.create({
      name,
      email,
      joinedDate,
      guardType,
      numberOfGuards,
      assignedGuards,
      progress: progress ?? 0,
      startDate,
      endDate
    });

    res.status(201).json(newClient);
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// ✅ GET CLIENTS
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find()
      .sort({ createdAt: -1 });

    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE CLIENT
exports.updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedClient) return res.status(404).json({ message: "Client not found" });
    res.json(updatedClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE CLIENT
exports.deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);

    if (!deletedClient) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
