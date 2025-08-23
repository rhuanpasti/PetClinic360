import * as React from "react";
import { Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Perfil from "../Perfil";
import Home from "../Home";
import DadosDoPet from "../DadosDoPet";
import ExamesPet from "../ExamesPet";

const Tab = createBottomTabNavigator();

export default function HomeUser() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: "#e91e63" }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Agendamento",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="DadosDoPet"
        component={DadosDoPet}
        options={{
          tabBarLabel: "Pet",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="gitlab" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ExamesPet"
        component={ExamesPet}
        options={{
          tabBarLabel: "Exames",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clipboard-pulse-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          headerShown: false,
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
