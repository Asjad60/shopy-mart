const express = require("express");
const router = express.Router();

const {
  getAllUserDetails,
  updateProfilePicture,
  updateProfile,
  getMyOrders,
  deleteAccount,
  getSupplierDashboard,
  getSupplierOrders
} = require("../controllers/profile");
const { auth, isSupplier,isVisitor } = require("../middlewares/auth");

router.get("/getUserDetails", auth, getAllUserDetails);
router.put("/updateProfilePicture", auth, updateProfilePicture);
router.put("/updateProfile", auth, updateProfile);
router.delete("/deleteAccount", auth, deleteAccount);
router.get("/getMyOrders", auth, isVisitor, getMyOrders);

router.get("/getSupplierDashboard", auth, isSupplier, getSupplierDashboard);
router.get("/getSupplierOrders", auth, isSupplier, getSupplierOrders);

module.exports = router;
