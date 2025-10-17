import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    // Handle login success
    setIsAuthenticated(true);
    console.log("User logged in successfully");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <div>
              Dashboard - <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
