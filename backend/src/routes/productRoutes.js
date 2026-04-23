import express from "express";
import { addProduct, getProducts } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../config/multer.js";

const router = express.Router();

// Public route - all users
router.get("/", getProducts);

// Protected route - farmer only - image upload
router.post(
  "/",
  protect,
  authorizeRoles("farmer"),
  upload.single("image"),
  addProduct
);

export default router;