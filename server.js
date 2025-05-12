const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// console.log("stripe", stripe);

const app = express();

app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  console.log("req", req.body);

  const { items } = req.body;

  const lineItems = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
      },
      unit_amount: item.price * 100, // ✅ spelling fixed here
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      // ✅ also fix `checkout.session` -> `checkout.sessions`
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
