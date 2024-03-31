import express from "express";
import { getProducts, getProductsById, createProduct, updateProduct, deleteProduct, createProductReview, getTopProducts } from "../controllers/productController.js";
import { protect, admin} from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.get("/top", getTopProducts);
router.route("/:id").get(checkObjectId, getProductsById).put(protect, admin, checkObjectId, updateProduct).delete(protect, admin, checkObjectId, deleteProduct);
router.route("/:id/reviews").post(protect, checkObjectId, createProductReview);

export default router;