const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  checkLogin,
} = require("../controller/authController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/api/check-login", checkLogin);

module.exports = router;
