import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/add", async (req, res) => {
    try {

        const product = req.body;
        if (!product.name || !product.price || !product.category) {
            return res.status(400).json({ message: "Name, price, and category are required!" });
        }

        await Product.create(product);

        console.log("Product added.");
        return res.status(200).json({ message: "Product successfully created." });
    } catch (error) {
        console.error("Failed creating a product: ", error);
        return res.status(500).json({ error: error.message })
    }
});

router.get("/", async (req, res) => {
    try {
        const products = await Product.find({}).sort({ name: 1 });;

        console.log(products);
        return res.status(200).json({ products });
    } catch (error) {
        console.error("Failed fetching products: ", error);
        return res.status(500).json({ error: error.message })
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            { returnDocument: "after", runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        console.log("Product updated:", product);
        return res.status(200).json({ product });
    } catch (error) {
        console.error("Failed updating product: ", error);
        return res.status(500).json({ error: error.message });
    }
});


export default router; 