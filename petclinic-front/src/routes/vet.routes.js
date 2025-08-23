// user logged-in (vet)
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeVt from "../pages/HomeVt";

const AppStack = createNativeStackNavigator();

function AppVt() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="HomeVt"
        component={HomeVt}
        options={{ headerShown: false }}
      />
    </AppStack.Navigator>
  );
}

export default AppVt;


