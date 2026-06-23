/**
 * ProtectedRoute Component
 * ------------------------
 * - Token இல்லாம இந்த route-க்கு access கிடையாது
 * - Login பண்ணாத user-ஐ /login page-க்கு redirect பண்றோம்
 * - Dashboard மாதிரி private pages-க்கு இதை wrap பண்ணு
 */

import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // Token இல்லன்னா login-க்கு அனுப்பு
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token இருந்தா page-ஐ காட்டு
  return children;
}

export default ProtectedRoute;