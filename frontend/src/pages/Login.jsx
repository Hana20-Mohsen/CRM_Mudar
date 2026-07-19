import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loggedUser = await login(email, password);
    

    if (loggedUser) {
      if (loggedUser.role === "admin") navigate("/dashboard");
      else if (loggedUser.role === "user") navigate("/leads");
      else if (loggedUser.role === "leader") navigate("/boards");
      else if(loggedUser.role === "employee") navigate("/attendance");
      else navigate("/tasks");
      console.log(loggedUser._id);
      socket.emit("joinRoom", loggedUser._id);
      
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg border-0 p-4" style={{ width: "100%", maxWidth: "400px", borderRadius: "15px" }}>
        <div className="card-body">
          <h2 className="text-center mb-4 fw-bold text-primary">login</h2>
          <p className="text-center text-muted mb-4"> Welcome! please enter your data </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="form-control form-control-lg border-0 bg-light"
                style={{ fontSize: "0.9rem" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="form-label small fw-semibold"> Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="form-control form-control-lg border-0 bg-light"
                style={{ fontSize: "0.9rem" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm" style={{ borderRadius: "10px", transition: "0.3s" }}>
              Login
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <small className="text-muted">
  Don’t have an account?{" "}
  <Link to="/register" className="text-decoration-none">
    Register here
  </Link>
</small>

          </div>
        </div>
      </div>
    </div>
  );
}
