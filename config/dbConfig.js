const mongoose = require("mongoose")

mongoose.Promise = global.Promise

const db_connection = async () => {
	try {
		await mongoose.connect(process.env.DB_URL)

		console.log("Connected to database")
	} catch (error) {
		console.log(error)
	}
}

module.exports = db_connection
// const connectDB = async () => {
// 	try {
// 		await mongoose.connect(process.env.DB_URL)
// 		console.log("Connected to database")
// 	} catch (err) {
// 		console.log(err)
// 	}
// }
