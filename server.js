const express = require("express")
const app = express()
const path = require("path")
require("dotenv").config()
const userRoute = require("./routes/userRoute")
const adminRoute = require("./routes/adminRoute")
const doctorRoute = require("./routes/doctorsRoute")
const db_connection = require("./config/dbConfig")

// connect to mongodb
db_connection()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/user", userRoute)
app.use("/api/admin", adminRoute)
app.use("/api/doctor", doctorRoute)

if (process.env.NODE_ENV === "production") {
	app.use("/", express.static("client/build"))

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client/build/index.html"))
	})
}
const port = process.env.PORT || 5000

app.get("/", (req, res) => res.send("hi there!"))

app.listen(port, () =>
	console.log(`Node Express Server Started at http://localhost:${port}!`)
)
