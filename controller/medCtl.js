
const Doctor = require("../models/medModel")
const Appointment = require("../models/appointmentModel")
const User = require("../models/userModel")

/*
    @route  api/
    @desc 
    @access private
*/

exports.fetchMedByUserId = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId })
    res.status(200).send({
      success: true,
      message: "Medic info fetched successfully",
      data: doctor,
    })
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting doctor info", success: false, error })
  }
}


/*
    @route  api/
    @desc 
    @access private
*/

exports.fetchMedByMedId = async(req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.body.doctorId })
    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    })
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting doctor info", success: false, error })
  }
}

/*
    @route  api/update
    @desc Update doctor information
    @access private
*/

exports.updateMedProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    )
    res.status(200).send({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    })
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting doctor info", success: false, error })
  }
}

/*
    @route  api/appointments/:medId
    @desc fetch appointment BY MedId
    @access private
*/

exports.fetchAppointmentsByMedId = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId })
    const appointments = await Appointment.find({ doctorId: doctor._id })
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

/*
    @route  api/update-appointment-status
    @desc update appointment status
    @access private
*/

exports.changeAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
      status,
    })

    const user = await User.findOne({ _id: appointment.userId })
    const unseenNotifications = user.unseenNotifications
    unseenNotifications.push({
      type: "appointment-status-changed",
      message: `Your appointment status has been ${ status }`,
      onClickPath: "/appointments",
    })

    await user.save()

    res.status(200).send({
      message: "Appointment status updated successfully",
      success: true
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Error changing appointment status",
      success: false,
      error,
    })
  }
}