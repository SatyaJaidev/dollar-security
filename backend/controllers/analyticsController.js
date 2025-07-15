const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const path = require("path");

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: path.join(__dirname, "../config/ga-creds.json"),
});

// Replace with your GA4 property ID or use an env variable
const propertyId = process.env.GA4_PROPERTY_ID || "493329563";

exports.getVisitorCount = async (req, res) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      metrics: [{ name: "activeUsers" }],
    });

    if (!response.rows || response.rows.length === 0) {
      console.warn("⚠️ No visitor data returned.");
      return res.json({ visitorCount: 0 });
    }

    const count = response.rows[0].metricValues?.[0]?.value || "0";
    res.json({ visitorCount: parseInt(count, 10) });
  } catch (err) {
    console.error("❌ Google Analytics API error:", {
      message: err.message,
      code: err.code,
      details: err.details,
    });
    res.status(500).json({ error: "Failed to fetch visitor data" });
  }
};
