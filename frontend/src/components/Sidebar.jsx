import { NavLink } from "react-router";

function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className="sidebar">
      {!collapsed && <h2 className="sidebar-title">NeuroSig</h2>}
      
      <button
        className="sidebar-toggle"
        onClick={onToggle}
        type="button"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
      >
        {collapsed ? "»" : "«"}
      </button>

      <nav>
        <NavLink to="/" end title="Home">
          <span className="sidebar-icon" aria-hidden="true">
            ⌂
          </span>
          <span className="sidebar-label">Home</span>
        </NavLink>

        <NavLink to="/dashboard" title="Dashboard">
          <span className="sidebar-icon" aria-hidden="true">
            ▦
          </span>
          <span className="sidebar-label">Dashboard</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
