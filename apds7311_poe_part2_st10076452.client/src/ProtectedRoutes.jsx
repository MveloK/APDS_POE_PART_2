import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoutes() {
  const [isLogged, setIsLogged] = useState(false);
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    // Check the user's session on initial mount
    fetch("api/SecureWebsite/cookies", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.users && data.users.accNumber) {
          setIsLogged(true);
          localStorage.setItem("users", data.users.accNumber);
        } else {
          setIsLogged(false);
          localStorage.removeItem("users");
        }
        setWaiting(false);
      })
      .catch((err) => {
        console.log("Error protected routes: ", err);
        setWaiting(false);
        localStorage.removeItem("users");
      });
  }, []); // Empty dependency array ensures this effect runs only once

  // Show a loading page while we check the login status
  if (waiting) {
    return (
      <div className="waiting-page">
        <div>Waiting..........</div>
      </div>
    );
  }

  // If the user is logged in, render the nested route (outlet)
  // If not, navigate to login page
  return isLogged ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;
