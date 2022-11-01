const User = require("../models/userModel")
const Med = require("../models/medModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Appointment = require("../models/appointmentModel")
const moment = require("moment")


/*
    @route  api/signup
    @desc User registration
    @access public
*/

exports.signup = async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email })
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false })
    }
    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    req.body.password = hashedPassword
    const newuser = new User(req.body)
    await newuser.save()
    res
      .status(200)
      .send({ message: "User created successfully", success: true })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error })
  }
}

/*
    @route  api/login
    @desc User Login
    @access public
*/

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false })
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false })
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      })
      res
        .status(200)
        .send({ message: "Login successful", success: true, data: token })
    }
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .send({ message: "Error logging in", success: false, error })
  }
}

/*
    @route  api/user/:userId
    @desc Fetch user information by userId
    @access public
*/

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId })
    user.password = undefined
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false })
    } else {
      res.status(200).send({
        success: true,
        data: user,
      })
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error })
  }
}

/*
    @route  api/med-apply
    @desc Pharmacists and medical doctors apply to the platform
    @access public
*/

exports.medApply = async (req, res) => {
  try {
    const newDoc = new Med({ ...req.body, status: "pending" })
    await newDoc.save()
    const adminUser = await User.findOne({ isAdmin: true })

    const unseenNotifications = adminUser.unseenNotifications
    unseenNotifications.push({
      type: "new-doctor-request",
      message: `${ newDoc.firstName } ${ newDoc.lastName } has applied for a doctor account`,
      data: {
        medId: newDoc._id,
        name: newDoc.firstName + " " + newDoc.lastName,
      },
      onClickPath: "/admin/medslist",
    })
    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications })
    res.status(200).send({
      success: true,
      message: "Med account applied successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    })
  }
}

/*
    @route  api/noti-response
    @desc mark all notifications as read
    @access private
*/

exports.markNotifications = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId })
    const unseenNotifications = user.unseenNotifications
    const seenNotifications = user.seenNotifications
    seenNotifications.push(...unseenNotifications)
    user.unseenNotifications = []
    user.seenNotifications = seenNotifications
    const updatedUser = await user.save()
    updatedUser.password = undefined
    res.status(200).send({
      success: true,
      message: "All notifications marked as seen",
      data: updatedUser,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    })
  }
}

/*
    @route  api/delete-all-notifications
    @desc remove all notifications
    @access private
*/

exports.deleteNotifications = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId })
    user.seenNotifications = []
    user.unseenNotifications = []
    const updatedUser = await user.save()
    updatedUser.password = undefined
    res.status(200).send({
      success: true,
      message: "All notifications cleared",
      data: updatedUser,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    })
  }
}

/*
    @route  api/approve-all
    @desc approve all meds 
    @access private
*/

exports.approveAll = async (req, res) => {
  try {
    const doctors = await Med.find({ status: "approved" })
    res.status(200).send({
      message: "Doctors fetched successfully",
      success: true,
      data: doctors,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    })
  }
}

/*
    @route  api/book-appointment
    @desc book appointment by user
    @access public
*/

exports.bookAppointment = async (req, res) => {
  try {
    req.body.status = "pending"
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString()
    req.body.time = moment(req.body.time, "HH:mm").toISOString()
    const newAppointment = new Appointment(req.body)
    await newAppointment.save()
    //pushing notification to doctor based on his userid
    const user = await User.findOne({ _id: req.body.doctorInfo.userId })
    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `A new appointment request has been made by ${ req.body.userInfo.name }`,
      onClickPath: "/doctor/appointments",
    })
    await user.save()
    res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error,
    })
  }
}

/*
    @route  api/check-med-avilability
    @desc check if med is available
    @access public
*/

exports.checkAvailability = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString()
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString()
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString()
    const medId = req.body.medId
    const appointments = await Appointment.find({
      medId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    })
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not available",
        success: false,
      })
    } else {
      return res.status(200).send({
        message: "Appointments available",
        success: true,
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error,
    })
  }
}

/*
    @route  api/user/:userId/appointments
    @desc 
    @access public
*/

exports.getUserAppointmentsBYId = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId })
    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: appointments,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Error fetching appointments",
      success: false,
      error,
    })
  }
}
