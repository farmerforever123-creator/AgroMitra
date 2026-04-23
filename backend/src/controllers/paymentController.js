import { generateQR } from "../utils/qrGenerator.js";
import { orders } from "./orderController.js";
import { callDeliveryAPI } from "../services/deliveryService.js";
//create payment

export const createPayment = async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.body;

  const order = orders.find((o) => o.id === orderId);

  //  security checks
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.userId !== userId) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  if (order.status === "PAID") {
    return res.status(400).json({ message: "Already paid" });
  }

  const qr = await generateQR("merchant@upi", order.totalAmount);

  res.json({
    message: "Scan QR to pay",
    qr,
    amount: order.totalAmount,
  });
};

//verify payment

export const verifyPayment = async (req, res) => {
  const userId = req.user.id;
  const { orderId, transactionId } = req.body;

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.userId !== userId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (order.status === "PAID") {
    return res.status(400).json({ message: "Already verified" });
  }

  //  basic validation
  if (!transactionId || transactionId.length < 5) {
    return res.status(400).json({
      message: "Invalid transaction",
    });
  }

  // mark paid
  order.status = "PAID";
  order.transactionId = transactionId;

  //  call delivery
  await callDeliveryAPI(order);

  res.json({
    message: "Payment verified & order confirmed",
    order,
  });
};

