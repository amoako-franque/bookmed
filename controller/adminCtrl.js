const User = require("../models/userModel")
const Doctor = require("../models/medModel")

/*
    @route  api/meds
    @desc Fetch all pharmacists and medical docters registered
    @access Private
*/

exports.fetchMeds = async (req, res) => {
  try {
    const doctors = await Doctor.find({})
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
    @route  api/account/status
    @desc Change med account status
    @access Private
*/

exports.accountSwitch = async (req, res) => {
  try {
    const { medId, status } = req.body
    const doctor = await Doctor.findByIdAndUpdate(medId, {
      status,
    })

    const user = await User.findOne({ _id: doctor.userId })
    const unseenNotifications = user.unseenNotifications
    unseenNotifications.push({
      type: "new-doctor-request-changed",
      message: `Your doctor account has been ${ status }`,
      onClickPath: "/notifications",
    })
    user.isDoctor = status === "approved" ? true : false
    await user.save()

    res.status(200).send({
      message: "Doctor status updated successfully",
      success: true,
      data: doctor,
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
    @route  api/users
    @desc Fetch all registered users
    @access public
*/

exports.fetchUsers = async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: users,
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