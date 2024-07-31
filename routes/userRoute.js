const express = require("express")
const {
	signup,
	login,
	getUserById,
	medApply,
	markNotifications,
	deleteNotifications,
	approveAll,
	bookAppointment,
	checkAvailability,
	getUserAppointmentsBYId,
} = require("../controller/userCtrl")
const router = express.Router()

const authMiddleware = require("../middlewares/authMiddleware")

router.post("/register", signup)

router.post("/login", login)

router.post("/get-user-info-by-id", authMiddleware, getUserById)

router.post("/apply-doctor-account", authMiddleware, medApply)

router.post(
	"/mark-all-notifications-as-seen",
	authMiddleware,
	markNotifications
)

router.post("/delete-all-notifications", authMiddleware, deleteNotifications)

router.get("/get-all-approved-doctors", authMiddleware, approveAll)

router.post("/book-appointment", authMiddleware, bookAppointment)

router.post("/check-booking-availability", authMiddleware, checkAvailability)

router.get(
	"/get-appointments-by-user-id",
	authMiddleware,
	getUserAppointmentsBYId
)

module.exports = router
