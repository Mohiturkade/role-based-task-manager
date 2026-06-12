import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div style={styles.sidebar}>
      <Link to="/dashboard">Dashboard</Link>

      {user?.role === "Admin" && (
        <>
          <Link to="/users">User Management</Link>
          <Link to="/tasks">Task Monitoring</Link>
          <Link to="/logs">Activity Logs</Link>
        </>
      )}
    </div>
  );
};

export default Sidebar;

const styles = {
  sidebar: {
    width: "200px",
    height: "100vh",
    padding: "20px",
    background: "#f4f4f4",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};