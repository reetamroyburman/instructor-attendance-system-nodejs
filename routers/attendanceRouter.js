const router = require("express").Router();
const attendanceController = require("../controllers/attendanceController");

router.post("/checkin", attendanceController.checkIn);
router.post("/checkout", attendanceController.checkOut);
router.post("/monthly-report", attendanceController.monthlyReport);

module.exports = router;