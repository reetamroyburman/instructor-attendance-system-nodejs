const router = require("express").Router();
const authController = require("../controllers/authController.js");

router.post("/signup", authController.signupController);
router.post("/login", authController.loginController);
router.post("/logout", authController.logoutController);

module.exports = router;