const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/authMiddleware")
const { changeAppointmentStatus, fetchAppointmentsByMedId, updateMedProfile, fetchMedByMedId, fetchMedByUserId } = require("../controller/medCtl")

router.post("/get-med-info-by-user-id", authMiddleware, fetchMedByUserId)

router.post("/get-med-info-by-id", authMiddleware, fetchMedByMedId)

router.post("/update-med-profile", authMiddleware, updateMedProfile)

router.get(
  "/get-appointments-by-med-id",
  authMiddleware,
  fetchAppointmentsByMedId
)

router.post("/update-appointment-status", authMiddleware, changeAppointmentStatus)

module.exports = router
