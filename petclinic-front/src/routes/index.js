import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import AppRoutes from "./user.routes";
import AuthRoutes from "./auth.routes";
import AppVtRoutes from "./vet.routes";

function Routes() {
  const { signed, user, setUser } = useContext(AuthContext);
  const [isVet, setIsVet] = useState(false);
  // uid admin hardcoded removed

  useEffect(() => {
    if (user) {
      const uid = user.uid;

      // Verifica se o usuário é um veterinário com base no CRMV
      if (user && user.crmv !== undefined && user.crmv !== null) {
        console.log(user);
        setIsVet(true);
      } else {
        setIsVet(false);
      }
    } else {
      setIsVet(false);
    }
  }, [user]);

  useEffect(() => {
    // Limpa o usuário quando deslogado
    if (!signed && user !== undefined && user !== null) {
      setUser(null);
    }
  }, [signed, user, setUser]);

  if (isVet) {
    return <AppVtRoutes />;
  } else if (signed) {
    return <AppRoutes />;
  } else {
    return <AuthRoutes />;
  }
}

export default Routes;
