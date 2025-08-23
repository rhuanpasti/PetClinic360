// user logged-in (regular user)
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeUser from "../pages/HomeUser";

const AppStack = createNativeStackNavigator();

function AppRoutes() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="HomeUser"
        component={HomeUser}
        options={{ headerShown: false }}
      />
    </AppStack.Navigator>
  );
}

export default AppRoutes;


