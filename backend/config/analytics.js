const { BetaAnalyticsDataClient } = require('@google-analytics/data');

let analyticsClient = null;

function initAnalytics() {
  const clientEmail = process.env.GA_CLIENT_EMAIL;
  const privateKey = process.env.GA_PRIVATE_KEY;
  const propertyId = process.env.GA_PROPERTY_ID;

  if (!clientEmail || !privateKey || !propertyId) {
    console.warn("⚠️ Analytics disabled: GA credentials not fully set.");
    return;
  }

  try {
    analyticsClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
    });
    console.log("✅ Google Analytics initialized");
  } catch (error) {
    console.error("❌ Google Analytics init failed:", error);
  }
}

async function getVisitorStats() {
  const propertyId = process.env.GA_PROPERTY_ID;
  if (!analyticsClient || !propertyId) {
    return null;
  }

  try {
    const [response] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }],
    });

    return response.rows?.[0]?.metricValues?.[0]?.value || '0';
  } catch (error) {
    console.error('❌ Google Analytics API error:', error);
    return null;
  }
}

module.exports = {
  initAnalytics,
  getVisitorStats,
};
