
import Attendance from "../../../DB/models/attendance.model.js";

export const getMyAttendanceStatus = async (req, res) => {
  const userId = req.user._id;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // نهاية اليوم (23:59:59)
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  console.log(`startOfDay : ${startOfDay} , endOfDay : ${endOfDay}`);
  
  const activeAttendance = await Attendance.findOne({
    user: userId,
    checkOutAt: null,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  console.log('activeAttendance :' , activeAttendance);

  return res.status(200).json({
    isCheckedIn: !!activeAttendance,
    attendance: activeAttendance || null,
  });
};