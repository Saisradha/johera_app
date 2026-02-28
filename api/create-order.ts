import type { VercelRequest, VercelResponse } from "@vercel/node";

const RAZORPAY_URL = "https://api.razorpay.com/v1/orders";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(500).json({ error: "Razorpay keys not configured" });
  }

  const { amount, plan, userId } = req.body as { amount: number; plan: string; userId: string };

  if (!amount || !plan || !userId) {
    return res.status(400).json({ error: "Missing amount, plan, or userId" });
  }

  const receipt = `sub_${userId.slice(0, 8)}_${Date.now()}`;

  try {
    const response = await fetch(RAZORPAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // paise
        currency: "INR",
        receipt,
        notes: { user_id: userId, plan },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.description || "Failed to create order" });
    }

    return res.status(200).json({
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId,
    });
  } catch (e) {
    console.error("Create order error:", e);
    return res.status(500).json({ error: "Failed to create order" });
  }
}
