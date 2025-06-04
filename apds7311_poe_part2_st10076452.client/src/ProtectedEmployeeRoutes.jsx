import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";

function ProtectedEmployeeRoutes() {
  const [isLogged, setIsLogged] = useState(false);
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    // Check the 'role' from localStorage to determine if the user is an employee
    const role = localStorage.getItem("role");
    if (role === "employee") {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
    setWaiting(false);
  }, []);

  if (waiting) {
    return (
      <div className="waiting-page">
        <div>Loading...</div>
      </div>
    );
  }

  // Only allow access to employee-protected routes if the role is 'employee'
  return isLogged ? <Outlet /> : <Navigate to="/employee-login" replace />;
}

export default ProtectedEmployeeRoutes;
