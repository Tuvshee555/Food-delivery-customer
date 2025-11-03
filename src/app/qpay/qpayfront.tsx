import axios from "axios";

let cachedToken: string | null = null;
let tokenExpiry = 0;

const QPAY_BASE_URL =
  process.env.QPAY_BASE_URL || "https://merchant.qpay.mn/v2";
const QPAY_USERNAME = process.env.QPAY_USERNAME || "DELIVERY_APP";
const QPAY_PASSWORD = process.env.QPAY_PASSWORD || "NwlvD0ro";

export async function getAccessToken() {
  // Return cached token if still valid
  if (cachedToken && Date.now() < tokenExpiry) {
    console.log("✅ Using cached token");
    return cachedToken;
  }

  try {
    const body = {
      username: QPAY_USERNAME,
      password: QPAY_PASSWORD,
    };

    const response = await axios.post(`${QPAY_BASE_URL}/auth/token`, body, {
      auth: {
        username: QPAY_USERNAME,
        password: QPAY_PASSWORD,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Save token and expiry
    const { access_token, expires_in } = response.data;
    cachedToken = access_token;
    tokenExpiry = Date.now() + (expires_in - 30) * 1000; // subtract 30s to be safe

    console.log("✅ New QPay token front :", cachedToken);
  } catch (err: any) {
    console.error(
      "❌ Failed to get QPay token:",
      err.response?.data || err.message
    );
    throw err;
  }
}
