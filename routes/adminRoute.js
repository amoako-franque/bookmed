const express = require("express")
const {
	fetchUsers,
	accountSwitch,
	fetchMds,
} = require("../controller/adminCtrl")
const router = express.Router()
const authMiddleware = require("../middlewares/authMiddleware")

router.get("/get-all-doctors", authMiddleware, fetchMds)

router.get("/get-all-users", authMiddleware, fetchUsers)

router.post("/change-doctor-account-status", authMiddleware, accountSwitch)

module.exports = router
