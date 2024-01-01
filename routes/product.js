const Product = require("../models/Product");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

//CREATE PRODUCT
router.post("/", verifyTokenAndAdmin, async (req, res) => {
	const newProduct = new Product(req.body);
	try {
		const savedProduct = await newProduct.save();
		res.status(200).json(savedProduct);
	} catch (err) {
		res.status(500).json(err);
	}
});

//UPDATE PRODUCT
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		//update Product
		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedProduct);
	} catch (err) {
		res.status(500).json(err);
	}
});

//DELETE PRODUCT
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		await Product.findByIdAndDelete(req.params.id);
		res.status(200).json("Product has been deleted...");
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		res.status(200).json(product);
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
	//query "new" to get latest products
	const queryNew = req.query.new;
	//query "category" to filter products
	const queryCategory = req.query.category;
	try {
		let products;
		//if query "new" is true, return last 5 products
		if (queryNew) {
			products = await Product.find().sort({ createdAt: -1 }).limit(5);
		} else if (queryCategory) {
			//if query "category" is true, return filtered products
			products = await Product.find({
				categories: {
					$in: [queryCategory],
				},
			});
		} else {
			//else return all products
			products = await Product.find();
		}
		res.status(200).json(products);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;