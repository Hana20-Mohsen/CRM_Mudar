import Attendance from "../../../DB/models/attendance.model.js";
import { DateTime } from "luxon";
export const logout = async (req, res) => {

  const userId = req.user.id;
  const nowDate = new Date();
  const now = DateTime.now().setZone("Africa/Cairo");
  const today = nowDate.toISOString().split("T")[0];

  // const shiftEnd = new Date(`${today}T17:30:00`);
  const shiftEnd = now.set({
    hour: 17,
    minute: 30,
    second: 0,
    millisecond: 0,
  });
  const shiftHours = 7;

  const attendance = await Attendance.findOne({
    user: userId,
    date: today,
  });

  if (!attendance || !attendance.checkInAt) {
    return res.status(400).json({ message: "Not checked in" });
  }

  if (attendance.checkOutAt) {
    return res.status(400).json({ message: "Already checked out" });
  }


  const checkIn = DateTime.fromJSDate(attendance.checkInAt).setZone("Africa/Cairo");
  const checkOut = now;




  // attendance.checkOutAt = nowDate;

  // Calculate total minutes
  // const totalMinutes = Math.floor(
  //   (attendance.checkOutAt - attendance.checkInAt) / 60000
  // );
  const totalMinutes = Math.floor(checkOut.diff(checkIn, "minutes").minutes);

  // Convert to decimal hours
  // const workHours = parseFloat((totalMinutes / 60).toFixed(2));
  const workHours = parseFloat((totalMinutes / 60).toFixed(2));
  attendance.workHours = totalMinutes;

  // Early Leave
  let early_leave_minutes = 0;
  // if (now < shiftEnd) {
  //   early_leave_minutes = Math.floor((shiftEnd - now) / 60000);
  // }
  if (checkOut < shiftEnd) {
    early_leave_minutes = Math.floor(
      shiftEnd.diff(checkOut, "minutes").minutes
    );
  }
  attendance.early_leave_minutes = early_leave_minutes;

  // Overtime
  // if (workHours > shiftHours) {
  //   attendance.overtimeMinutes = Math.floor(
  //     (workHours - shiftHours) * 60
  //   );
  // }
  // const shiftMinutes = 7 * 60;

  // attendance.overtimeMinutes = Math.max(0, totalMinutes - shiftMinutes);

  let overtimeMinutes = 0;

  if (checkOut > shiftEnd) {
    overtimeMinutes = Math.floor(
      checkOut.diff(shiftEnd, "minutes").minutes
    );
  }
  overtimeMinutes = overtimeMinutes > 0 ? overtimeMinutes - attendance.late_minutes : 0;
  attendance.overtimeMinutes = overtimeMinutes > 0 ? overtimeMinutes : 0;
  console.log(`workhours : ${workHours} ,  overtime: ${overtimeMinutes}`);
  

  attendance.checkOutAt = checkOut.toJSDate();
  await attendance.save();

  res.json({
    status: 'success',
    message: "Check-out successful",
    workHours: totalMinutes,
    overtimeMinutes: attendance.overtimeMinutes,
  });

};
