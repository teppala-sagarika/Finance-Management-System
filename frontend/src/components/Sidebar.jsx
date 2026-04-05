import { useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2 className="logo">💰 Finance</h2>

      <div className="menu">
        <div
          className="menu-item"
          onClick={() => navigate("/dashboard")}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </div>
      </div>

      <div
        className="logout"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
      >
        <LogOut size={18} />
        <span>Logout</span>
      </div>
    </div>
  );
}