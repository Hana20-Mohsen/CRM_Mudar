
// import React, { useContext, useEffect, useState } from "react";
// import { AttendanceContext } from "../context/AttendenceContext";
// import { useOutletContext } from "react-router-dom";
// import styles from "./styles.module.css";

// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// export default function Reports() {
//   const { toggleSidebar } = useOutletContext();
//   const { getAttendance } = useContext(AttendanceContext);

//   const [attendance, setAttendance] = useState([]);
//   const [search, setSearch] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   useEffect(() => {
//     getAttendance().then(setAttendance);
//   }, []);

//   const formatHours = (minutes = 0) => {
//     const h = Math.floor(minutes / 60);
//     const m = minutes % 60;
//     return `${h}h ${m}m`;
//   };

//   // 🔍 Filter logic
//   const filteredAttendance = attendance.filter((a) => {
//     const nameMatch = a.user?.name
//       ?.toLowerCase()
//       .includes(search.toLowerCase());

//     const recordDate = new Date(a.date).toISOString().split("T")[0];

//     const fromMatch = fromDate ? recordDate >= fromDate : true;
//     const toMatch = toDate ? recordDate <= toDate : true;

//     return nameMatch && fromMatch && toMatch;
//   });

//   // 📅 Group by date
//   const groupByDate = (data) => {
//     return data.reduce((acc, record) => {
//       const date = new Date(record.date).toLocaleDateString("en-CA");
//       if (!acc[date]) acc[date] = [];
//       acc[date].push(record);
//       return acc;
//     }, {});
//   };

//   const groupedEntries = Object.entries(groupByDate(filteredAttendance)).sort(
//     (a, b) => new Date(b[0]) - new Date(a[0])
//   );

//   // 📁 Export Excel
//   const exportExcel = () => {
//     const data = filteredAttendance.map((a) => ({
//       Name: a.user?.name,
//       Date: new Date(a.date).toLocaleDateString(),
//       CheckIn: new Date(a.checkInAt).toLocaleString(),
//       CheckOut: a.checkOutAt
//         ? new Date(a.checkOutAt).toLocaleString()
//         : "Still working",
//       Late: formatHours(a.late_minutes),
//       EarlyLeave: formatHours(a.early_leave_minutes),
//       Overtime: formatHours(a.overtimeMinutes),
//       Work: formatHours(a.workHours),
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     const file = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(file, "attendance.xlsx");
//   };

//   // 📄 Export PDF


//   return (
//     <div className={`container-fluid py-4 min-vh-100 ${styles.bg_gredient}`}>

//       <i
//         className={`${styles.toggle_btn} fa-solid fa-bars me-3 fs-2 mb-3 text-light`}
//         onClick={toggleSidebar}
//       ></i>

//       <h2 className="mb-3 fw-bold text-light">Attendance Reports</h2>

//       {/* 🔍 Filters */}
//       <div className="row mb-4 g-2">

//         <div className="col-md-3">
//           <input
//             type="text"
//             placeholder="Search by user..."
//             className="form-control"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <div className="col-md-3">
//           <input
//             type="date"
//             className="form-control"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />
//         </div>

//         <div className="col-md-3">
//           <input
//             type="date"
//             className="form-control"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />
//         </div>

//         <div className="col-md-3 d-flex gap-2">
//           <button onClick={exportExcel} className="btn btn-success w-100">
//             Export Excel
//           </button>
// {/* 
//           <button onClick={exportPDF} className="btn btn-danger w-100">
//             Export PDF
//           </button> */}
//         </div>
//       </div>

//       {/* 📅 Data */}
//       {groupedEntries.map(([date, records]) => (
//         <div key={date} className="mb-4">

//           <h4 className="text-light fw-bold mb-3">{date}</h4>

//           <div className={`card shadow-sm ${styles.card}`}>
//             <table className="table table-hover mb-0">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>In</th>
//                   <th>Out</th>
//                   <th>Late</th>
//                   <th>Early</th>
//                   <th>OT</th>
//                   <th>Work</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {records.map((a) => (
//                   <tr key={a._id}>
//                     <td>{a.user?.name}</td>

//                     <td>{new Date(a.checkInAt).toLocaleString()}</td>

//                     <td>
//                       {a.checkOutAt
//                         ? new Date(a.checkOutAt).toLocaleString()
//                         : "Still working"}
//                     </td>

//                     <td>{formatHours(a.late_minutes)}</td>
//                     <td>{formatHours(a.early_leave_minutes)}</td>
//                     <td>{formatHours(a.overtimeMinutes)}</td>
//                     <td>{formatHours(a.workHours)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ))}

//     </div>
//   );
// }

import React, { useContext, useEffect, useState } from "react";
import { AttendanceContext } from "../context/AttendenceContext";
import { useOutletContext } from "react-router-dom";
import styles from "./styles.module.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Reports() {
  const { toggleSidebar } = useOutletContext();
  const { getAttendance } = useContext(AttendanceContext);

  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    getAttendance().then(setAttendance);
  }, []);

  const formatHours = (minutes = 0) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  // 🔍 Filter attendance
  const filteredAttendance = attendance.filter((a) => {
    const nameMatch = a.user?.name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const recordDate = new Date(a.date).toISOString().split("T")[0];
    const fromMatch = fromDate ? recordDate >= fromDate : true;
    const toMatch = toDate ? recordDate <= toDate : true;
    return nameMatch && fromMatch && toMatch;
  });

  // 📅 Group by date
  const groupByDate = (data) => {
    return data.reduce((acc, record) => {
      const date = new Date(record.date).toLocaleDateString("en-CA");
      if (!acc[date]) acc[date] = [];
      acc[date].push(record);
      return acc;
    }, {});
  };

  const groupedEntries = Object.entries(groupByDate(filteredAttendance)).sort(
    (a, b) => new Date(b[0]) - new Date(a[0])
  );

  // 📁 Export Excel
  const exportExcel = () => {
    const data = filteredAttendance.map((a) => ({
      Name: a.user?.name,
      Date: new Date(a.date).toLocaleDateString(),
      CheckIn: new Date(a.checkInAt).toLocaleString(),
      CheckOut: a.checkOutAt
        ? new Date(a.checkOutAt).toLocaleString()
        : "Still working",
      Late: formatHours(a.late_minutes),
      EarlyLeave: formatHours(a.early_leave_minutes),
      Overtime: formatHours(a.overtimeMinutes),
      Work_Hours: formatHours(a.workHours),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "attendance.xlsx");
  };

  return (
    <div className={`container-fluid py-4 min-vh-100 `}>

      <i
        className={`${styles.toggle_btn} fa-solid fa-bars me-3 fs-2 mb-3 text-light`}
        onClick={toggleSidebar}
      ></i>

      <h2 className="mb-3 fw-bold text-light">Attendance Reports</h2>

      {/* 🔍 Filters */}
      <div className="row mb-4 g-2">
        <div className="col-12 col-md-3">
          <label htmlFor="search" className="text-light">username...</label>
          <input
            type="text"
            placeholder="Search by user..."
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-6 col-md-3">
          <label className="text-light" htmlFor="start date">Start Date</label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="col-6 col-md-3">
          <label className="text-light" htmlFor="end date">End Date</label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="col-12 col-md-3 d-flex gap-2 mt-2 mt-md-0 d-md-flex align-items-end">
          <button onClick={exportExcel} className="btn btn-success w-100">
            Export Excel
          </button>
        </div>
      </div>

      {/* 📅 Desktop Table */}
      <div className="d-none d-md-block">
        {groupedEntries.map(([date, records]) => (
          <div key={date} className="mb-4">
            <h4 className="text-light fw-bold mb-3">{date}</h4>
            <div className={`card shadow-sm ${styles.card}`}>
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>In</th>
                    <th>Out</th>
                    <th>Late</th>
                    <th>Early</th>
                    <th>Over_Time</th>
                    <th>Work_Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((a) => (
                    <tr key={a._id}>
                      <td>{a.user?.name}</td>
                      <td>{new Date(a.checkInAt).toLocaleString()}</td>
                      <td>
                        {a.checkOutAt
                          ? (new Date(a.checkOutAt).toLocaleString())
                          : (
                            <span className="text-success fw-semibold">
                              Still working
                            </span>
                          )}
                      </td>
                      <td>{formatHours(a.late_minutes)}</td>
                      <td>{formatHours(a.early_leave_minutes)}</td>
                      <td>{formatHours(a.overtimeMinutes)}</td>
                      <td>{formatHours(a.workHours)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* 📱 Mobile Cards */}
      <div className="d-md-none">
        {groupedEntries.map(([date, records]) => (
          <div key={date} className="mb-4">
            <h5 className="text-light fw-bold mb-2">{date}</h5>
            {records.map((a) => (
              <div key={a._id} className="card mb-3 shadow-sm p-3">
                <h5 className="fw-bold text-primary mb-2">{a.user?.name}</h5>
                <p><strong style={{ color: "#478778" }}>In:</strong> {new Date(a.checkInAt).toLocaleString()}</p>
                <p><strong style={{ color: "red" }}>Out:</strong> {a.checkOutAt ? new Date(a.checkOutAt).toLocaleString() : "Still working"}</p>
                <p><strong className="text-warning">Late:</strong> {formatHours(a.late_minutes)}</p>
                <p><strong className="text-danger">Early Leave:</strong> {formatHours(a.early_leave_minutes)}</p>
                <p><strong className="text-primary">Overtime:</strong> {formatHours(a.overtimeMinutes)}</p>
                <p><strong className="text-success">Work Hours:</strong> {formatHours(a.workHours)}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}