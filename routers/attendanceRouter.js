const router = require("express").Router();
const attendanceController = require("../controllers/attendanceController");

router.get("/checkin", attendanceController.checkIn);
router.get("/checkout", attendanceController.checkOut);
router.get("/monthlyreport", attendanceController.monthlyReport);

module.exports = router;