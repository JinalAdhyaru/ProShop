import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import cors from "cors";

dotenv.config();

connectDB(); 

const app = express();
const port = process.env.PORT || 8080;

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, 
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.send("API is running");
});

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//cookie parser middleware
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("API is running...");
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID }));


app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log("Server is running on port", port);
});