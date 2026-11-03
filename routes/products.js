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
})

export default router; 