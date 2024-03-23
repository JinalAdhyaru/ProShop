import express from 'express';
import products from './data/products.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
app.use(cors());

app.get("/", (req, res) => {
    res.send("API is running");
});

app.get("/api/products", (req, res) => {
    console.log("Backend api products");
    res.json(products);
});

app.get("/api/products/:id", (req, res) => {
    const product = products.find((p) => p._id === req.params.id);
    res.json(product);
});

app.listen(port, () => {
    console.log("Server is running on port", port);
})