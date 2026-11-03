import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3333;
const dbURI = process.env.MONGO_URI || "uri";

mongoose.connect(dbURI).
    then(() => {
        console.log("Successfully connected to MongoDB.")
    }).catch((err) => {
        console.error("Failes connectiong to MongoDB.")
    });

app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});
