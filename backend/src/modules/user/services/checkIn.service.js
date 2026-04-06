import Attendance from "../../../DB/models/attendance.model.js";
import { asyncHandler } from "../../../utilities/error/error.js";

export const checkIn = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const now = new Date();

  const today = now.toISOString().split("T")[0]; // YYYY-MM-DD
  // const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

  // const shiftStart = new Date(`${today}T10:00:00`);
  const shiftStart = new Date();
  shiftStart.setHours(10, 0, 0, 0); // 10:00 AM local time
  const graceMinutes = 10;

  let attendance = await Attendance.findOne({
    user: userId,
    date: today,
  });

  if (attendance && attendance.checkInAt) {
    return res.status(400).json({ status: 'fail', message: "Already checked in" });
  }

  let lateMinutes = 0;

  const lateLimit = new Date(shiftStart.getTime() + graceMinutes * 60000);

  if (now > lateLimit) {
    lateMinutes = Math.floor((now - shiftStart) / 60000);
  }
  console.log(`lateMinutes : ${lateMinutes}`);


  if (!attendance) {
    attendance = new Attendance({
      user: userId,
      date: today,
      checkInAt: now,
      late_minutes: lateMinutes,
      status: "PRESENT",
    });
  } else {
    attendance.checkInAt = now;
    attendance.late_minutes = lateMinutes;
    attendance.status = "PRESENT";
  }

  await attendance.save();

  res.json({
    message: "Check-in successful",
    lateMinutes,
  });
})

