import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!keySecret || !supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: "Server configuration missing" });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body as {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  };

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing payment details" });
  }

  // Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto.createHmac("sha256", keySecret).update(body).digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  // Fetch order to get user_id and plan from notes
  const keyId = process.env.RAZORPAY_KEY_ID;
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${razorpay_order_id}`, {
    headers: { Authorization: "Basic " + auth },
  });

  const order = await orderRes.json();
  const userId = order?.notes?.user_id;
  const plan = order?.notes?.plan || "monthly";

  if (!userId) {
    return res.status(400).json({ error: "Missing user in order" });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const days = plan === "yearly" ? 365 : 30;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  const { error } = await supabase.from("user_subscriptions").upsert(
    {
      user_id: userId,
      plan,
      status: "active",
      expires_at: expiresAt.toISOString(),
      starts_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Supabase insert error:", error);
    return res.status(500).json({ error: "Failed to activate subscription" });
  }

  return res.status(200).json({ success: true, message: "Subscription activated" });
}
