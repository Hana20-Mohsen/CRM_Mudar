import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmationPassword: "",
    role: "user",
    phone: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        alert("Account created successfully");
        navigate("/login");
      } else {
        alert(data.message || "Register failed");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg border-0 p-4" style={{ width: "100%", maxWidth: "400px", borderRadius: "15px" }}>
        <div className="card-body">
          <h2 className="text-center mb-4 fw-bold text-primary">Register</h2>
          <p className="text-center text-muted mb-4">Create your account</p>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label small fw-semibold">Name</label>
              <input
                type="text"
                name="name"
                className="form-control form-control-lg border-0 bg-light"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email</label>
              <input
                type="email"
                name="email"
                className="form-control form-control-lg border-0 bg-light"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label small fw-semibold">Phone</label>
              <input
                type="text"
                name="phone"
                className="form-control form-control-lg border-0 bg-light"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role */}
            <div className="mb-3">
              <label className="form-label small fw-semibold">Role</label>
              <select
                name="role"
                className="form-control form-control-lg border-0 bg-light"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="leader">Leader</option>
                <option value="employee">employee</option>
                {/* <option value="admin">Admin</option> */}
              </select>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label small fw-semibold">Password</label>
              <input
                type="password"
                name="password"
                className="form-control form-control-lg border-0 bg-light"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label small fw-semibold">Confirm Password</label>
              <input
                type="password"
                name="confirmationPassword"
                className="form-control form-control-lg border-0 bg-light"
                value={formData.confirmationPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm" style={{ borderRadius: "10px" }}>
              Register
            </button>
          </form>

          <div className="mt-4 text-center">
            <small className="text-muted">
              Already have an account?{" "}
              <span
                className="text-decoration-none text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
