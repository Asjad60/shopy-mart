const express = require("express");
const router = express.Router();

const { capturePayment, verifyPayment } = require("../controllers/Payment");
const { auth, isVisitor, isSupplier } = require("../middlewares/auth");
const { createOrder,cancelOrder ,changeOrderStatus} = require("../controllers/Order");

router.post("/capturePayment", auth, isVisitor, capturePayment);
router.post("/verifyPayment", auth, isVisitor, verifyPayment);

//==============Order Handler=====================
router.post("/createOrder", auth, isVisitor, createOrder);
router.post("/cancelOrder", auth, isVisitor, cancelOrder);
router.post("/changeOrderStatus", auth, isSupplier, changeOrderStatus);

module.exports = router;
