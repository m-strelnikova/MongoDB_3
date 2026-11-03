import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import productsRouter from "./routes/products.js";

const app = express();
app.use((req, res, next) => {
    console.log(`INCOMING REQUEST: ${req.method} ${req.url}`);
    next();
});

const port = process.env.PORT || 3000;
const dbURI = process.env.MONGO_URI || "uri";

mongoose.connect(dbURI).
    then(() => {
        console.log("Successfully connected to MongoDB.")
    }).catch((err) => {
        console.error("Failes connectiong to MongoDB.")
    });

app.use(express.json());
app.use("/products", productsRouter);

app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});
