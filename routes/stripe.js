const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/payment", async (req, res) => {
	// const { items } = req.body;

	// Create a PaymentIntent with the order amount and currency
	const paymentIntent = await stripe.paymentIntents.create({
		amount: req.body.amount,
		currency: "myr",
		automatic_payment_methods: {
			enabled: true,
		},
	});

	res.status(200).json({
		clientSecret: paymentIntent.client_secret,
	});
});

module.exports = router;
