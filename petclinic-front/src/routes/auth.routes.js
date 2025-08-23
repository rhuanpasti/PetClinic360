//user não logado
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "../pages/SignIn";
import Registration from "../pages/Registration";
import Welcome from "../pages/Welcome";
import RegistrationVt from "../pages/RegistrationVt";
import NewPassword from "../pages/NewPassword";

const AuthStack = createNativeStackNavigator();

function AuthRoutes() {
  return (
    <AuthStack.Navigator initialRouteName="Welcome">
      <AuthStack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Registration"
        component={Registration}
        options={{ headerShown: false }}
      />

      <AuthStack.Screen
        name="RegistrationVt"
        component={RegistrationVt}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="NewPassword"
        component={NewPassword}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
}

export default AuthRoutes;
