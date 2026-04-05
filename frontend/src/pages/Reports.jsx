import React, { useContext, useEffect, useState } from 'react'
import { AttendanceContext } from '../context/AttendenceContext'
import { useOutletContext } from "react-router-dom";
import styles from './styles.module.css'
export default function Reports() {
  const { toggleSidebar } = useOutletContext();
  const { getAttendance } = useContext(AttendanceContext);

  const [attendance, setAttendance] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const formatHours = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };
  // 🔹 نجيب حالة اليوزر الحالية
  // useEffect(() => {
  //   fetch("/api/v1/user/attendance/status")
  //     .then((res) => res.json())
  //     .then((data) => setIsCheckedIn(data.isCheckedIn));
  // }, []);
  useEffect(() => {
    getAttendance().then(setAttendance);
    console.log(attendance)
  }, []);
  // 🔹 نجيب الريكوردز


  // useEffect(() => {
  //   getAttendance().then(setAttendance);
  //   // console.log(attendance)
  // }, []);

  return (
    <div className={`container-fluid py-4 bg-light min-vh-100 ${styles.bg_gredient}`}>
      <i class={`${styles.toggle_btn} fa-solid fa-bars me-3 fs-2 mb-3 text-light`}
        onClick={toggleSidebar}
      ></i>
      <h2 className="mb-3 fw-bold text-light">Attendance Records</h2>

      {/* 🔘 زرار ذكي */}


      <div className={`card shadow-sm border-0 overflow-auto  ${styles.card}`}>
        <table className="table table-hover align-middle mb-0 d-none d-md-block">
          <thead className="bg-white border-bottom">
            <tr>
              <th className="ps-4 py-3 text-uppercase small fw-bold text-muted">
                Name
              </th>
              <th
                className="ps-4 py-3 text-uppercase small fw-bold"
                style={{ color: "#478778" }}
              >
                In
              </th>
              <th
                className="ps-4 py-3 text-uppercase small fw-bold"
                style={{ color: "red" }}
              >
                Out
              </th>
              <th className="ps-4 py-3 text-uppercase small fw-bold text-warning">
                Late
              </th>

              <th className="ps-4 py-3 text-uppercase small fw-bold text-danger">
                Early Leave
              </th>

              <th className="ps-4 py-3 text-uppercase small fw-bold text-primary">
                Overtime
              </th>

              <th className="ps-4 py-3 text-uppercase small fw-bold text-success">
                Work Hours
              </th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((a) => (
              <tr key={a._id} className="task-row">

                <td className="ps-4 py-3 fw-bold" style={{ color: "#4682B4" }}>
                  {a.user?.name}
                </td>

                {/* checkIn */}
                <td className="ps-4 py-3" >
                  {new Date(a.checkInAt).toLocaleString()}
                </td>

                {/* checkOut */}
                <td className="ps-4 py-3">
                  {a.checkOutAt ? (
                    new Date(a.checkOutAt).toLocaleString()
                  ) : (
                    <span className="text-success fw-semibold">
                      Still working
                    </span>
                  )}
                </td>

                {/* ✅ Late */}
                <td className="ps-4 py-3">
                  {formatHours(a.late_minutes)}
                </td>

                {/* ✅ Early Leave */}
                <td className="ps-4 py-3">
                  {formatHours(a.early_leave_minutes)}
                </td>

                {/* ✅ Overtime */}
                <td className="ps-4 py-3">
                  {formatHours(a.overtimeMinutes)}
                </td>

                {/* ✅ Work Hours */}
                <td className="ps-4 py-3">
                  {formatHours(a.workHours)}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-md-none">
          {attendance.map((a) => (
            <div key={a._id} className="card mb-3 shadow-sm p-3">

              <h5 className="fw-bold text-primary mb-2" >
                {a.user?.name}
              </h5>

              <p><strong style={{ color: "#478778" }}>In:</strong> {new Date(a.checkInAt).toLocaleString()}</p>

              <p>
                <strong style={{ color: "red" }}>Out:</strong>{" "}
                {a.checkOutAt
                  ? new Date(a.checkOutAt).toLocaleString()
                  : "Still working"}
              </p>

              <p><strong className='text-warning'>Late:</strong> {formatHours(a.late_minutes)}</p>

              <p><strong className='text-danger'>Early Leave:</strong> {formatHours(a.early_leave_minutes)}</p>

              <p><strong className='text-primary'>Overtime:</strong> {formatHours(a.overtimeMinutes)}</p>

              <p><strong className='text-success'>Work Hours:</strong> {formatHours(a.workHours)}</p>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
