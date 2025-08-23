import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import AppRoutes from "./user.routes";
import AuthRoutes from "./auth.routes";
import AppVtRoutes from "./vet.routes";
import LoadingScreen from "../pages/LoadingScreen";

function Routes() {
  const { signed, user, loading } = useContext(AuthContext);
  const [isVet, setIsVet] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      // Check if user is a veterinarian based on CRMV or role
      if (user.crmv !== undefined && user.crmv !== null && user.crmv !== '') {
        setIsVet(true);
      } else if (user.role === 'vet') {
        setIsVet(true);
      } else {
        setIsVet(false);
      }
    } else {
      setIsVet(false);
    }
  }, [user, loading]);

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Determine which routes to show based on user type
  if (isVet && signed) {
    return <AppVtRoutes />;
  } else if (signed) {
    return <AppRoutes />;
  } else {
    return <AuthRoutes />;
  }
}

export default Routes;
