const axios = require("axios");
require("dotenv").config();

const AVIATIONSTACK_BASE_URL = "http://api.aviationstack.com/v1/";

const fetchFlightData = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${AVIATIONSTACK_BASE_URL}${endpoint}`, {
      params: {
        access_key: process.env.AVIATIONSTACK_API_KEY,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching data from AviationStack API:", error.message);
    return null;
  }
};

module.exports = fetchFlightData;
