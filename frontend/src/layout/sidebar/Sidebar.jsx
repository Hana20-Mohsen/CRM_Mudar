import { Link, NavLink } from "react-router-dom";
import styles from '../sidebar/side.module.css'

export default function Sidebar({ user, isOpen, toggleSidebar }) {
  const menuItems =
    user.role === "admin" || user.role === "leader"
      ? [
        { name: "Dashboard", path: "/dashboard", end: true },
        { name: "Leads", path: "/leads" },
        { name: "Contacts", path: "/contacts" },
        { name: "Deals", path: "/deals" },
        { name: "Boards", path: "/boards" },
        { name: "Tasks", path: "/tasks" },
        { name: "Reports", path: "/reports" },
        { name: "MonthlyReport", path: "/report" },
      ]
      : user.role === "employee"
        ? [
          // { name: "Boards", path: "/boards", end: false },
          // { name: "Tasks", path: "/tasks" },
          // { name: "Leads", path: "/leads" },
          { name: "attendance", path: "/attendance" },
        ]
        : [{ name: "Leads", path: "/leads" }];

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}

      <aside
        className={` ${styles.sidebar} ${isOpen ? styles.open : ""
          }`}
      >
        {/* Logo */}
        <Link
          to="/dashboard"
          className="d-flex align-items-center justify-content-center p-2 text-decoration-none"
        >
          <img
            src="https://res.cloudinary.com/dvxokqq78/image/upload/v1771939975/%D9%85%D8%AF%D8%A7%D8%B1-02_jjarln.png"
            alt="logo"
            style={{ height: "150px", width: "150px" }}
          />
        </Link>

        {/* Menu */}
        <nav className="flex-grow-1 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              onClick={toggleSidebar} // يقفل بعد الضغط في الموبايل
              className={({ isActive }) =>
                `d-block px-3 py-2 mb-1 rounded text-decoration-none `
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#FF8911" : "transparent", color: "white"
              })}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
