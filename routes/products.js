import express from "express";
import fs from "fs/promises";
import Product from "../models/Product.js";

const router = express.Router();

const logOperation = async (action, data) => {
    const time = new Date().toLocaleString("ru-RU");

    const logEntry = JSON.stringify({
        action,
        timestamp: time,
        data
    }, null, 2) + ",\n";

    try {
        await fs.appendFile("backup.json", logEntry, "utf8");
    } catch (error) {
        console.error("Failed to write backup file:", error);
    }

    console.log(`[LOG] Action: ${action} | Time: ${time}`);
};

router.post("/add", async (req, res) => {
    try {

        const product = req.body;
        if (!product.name || !product.price || !product.category) {
            return res.status(400).json({ message: "Name, price, and category are required!" });
        }

        await Product.create(product);

        logOperation("CREATE", product);
        return res.status(200).json({ message: "Product successfully created." });
    } catch (error) {
        console.error("Failed creating a product: ", error);
        return res.status(500).json({ error: error.message })
    }
});

router.get("/", async (req, res) => {
    try {
        const products = await Product.find({}).sort({ name: 1 });;

        logOperation("GET_ALL", { count: products.length });
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

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { returnDocument: "after", runValidators: true }
        );

        logOperation("UPDATE", { before: product, after: updatedProduct });
        return res.status(200).json({ product: updatedProduct });
    } catch (error) {
        console.error("Failed updating product: ", error);
        return res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        logOperation("DELETE", deletedProduct);
        return res.status(200).json({
            message: "Product successfully deleted!", product: deletedProduct
        });
    } catch (error) {
        console.error("Failed deleting product by ID: ", error);
        return res.status(500).json({ error: error.message });
    }
});

export default router; 