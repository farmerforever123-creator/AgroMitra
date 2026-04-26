import express from "express";
import {
  placeOrder,
  getOrders,
  trackOrder,
  updatePaymentStatus
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getOrders);
router.get("/track/:id", trackOrder); // Public route for order tracking
router.patch("/:orderId/payment-status", protect, updatePaymentStatus);

export default router;
