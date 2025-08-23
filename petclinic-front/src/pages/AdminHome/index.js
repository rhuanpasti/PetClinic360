import * as React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Registration from "../RegistrationVt";
import ListaVet from "../AdminListaVet";

const Tab = createBottomTabNavigator();

export default function AdminHome() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: "#e91e63" }}>
      <Tab.Screen
        name="RegistrationVt"
        component={Registration}
        options={{
          headerShown: false,
          tabBarLabel: "Cadastro",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ListaVet"
        component={ListaVet}
        options={{
          headerShown: false,
          tabBarLabel: "Veterinarios",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
