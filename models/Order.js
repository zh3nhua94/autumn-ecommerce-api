const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		products: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
				},
				colors: {
					type: String,
				},
				sizes: {
					type: String,
				},
				quantity: {
					type: Number,
					default: 1,
				},
			},
		],
		amount: {
			type: Number,
			required: true,
		},
		address: {
			type: Object,
			required: true,
		},
		status: {
			type: String,
			default: "pending",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
