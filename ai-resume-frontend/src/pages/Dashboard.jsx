import { useEffect, useState } from "react";
import API from "../services/api";

/**
 * Dashboard Page
 * --------------
 * - Logged-in user-ஓட details மற்றும் data-ஐ display பண்றது
 * - Component mount ஆகும்போது backend-ல இருந்து user info fetch பண்றோம்
 * - Token இல்லன்னா automatically login page-க்கு redirect பண்றோம்
 */

function Dashboard() {
  // User details store பண்ண
  const [user, setUser] = useState(null);

  // API call நடக்கும்போது loading spinner காட்ட
  const [loading, setLoading] = useState(true);

  // Error message store பண்ண
  const [error, setError] = useState("");

  /**
   * Component முதல்ல render ஆகும்போது user data fetch பண்றோம்
   * localStorage-ல token இருந்தா மட்டும் API call போகும்
   */
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Token இல்லன்னா login page-க்கு அனுப்பு
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchUserData();
  }, []);

  /**
   * Backend-ல இருந்து logged-in user-ஓட profile data கொண்டு வருவோம்
   * Authorization header-ல Bearer token அனுப்புவோம்
   */
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Success — user data state-ல save பண்றோம்
      setUser(response.data);
    } catch (err) {
      // Token expire ஆச்சா (401) login-க்கு redirect பண்றோம்
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        setError("Failed to load user data. Please try again.");
      }
      console.log(err);
    } finally {
      // Success/Error எதுவா இருந்தாலும் loading false பண்றோம்
      setLoading(false);
    }
  };

  /**
   * Logout — localStorage-ல இருக்கற token-ஐ clear பண்ணி
   * login page-க்கு redirect பண்றோம்
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ── Render ──────────────────────────────────────────────

  // Data fetch ஆகும் வரை loading காட்டு
  if (loading) {
    return <div style={{ padding: "50px" }}>Loading...</div>;
  }

  // API error வந்தா error message காட்டு
  if (error) {
    return <div style={{ padding: "50px", color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "50px" }}>
      <h1>Dashboard</h1>

      {/* User details section */}
      {user && (
        <div>
          <p><strong>Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}
      <button onClick={() => (window.location.href = "/upload")}>
  Upload Resume
</button>

<br /><br />

      {/* Logout button */}
      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;