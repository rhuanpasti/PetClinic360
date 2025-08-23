import * as React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PerfilVt from "../PerfilVt";
import Consulta from "../ConsultaVt";
import ExamesVt from "../ExamesVt";

const Tab = createBottomTabNavigator();

export default function HomeVt() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: "#e91e63" }}>
      <Tab.Screen
        name="Consulta"
        component={Consulta}
        options={{
          headerShown: false,
          tabBarLabel: "Consultas",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ExamesVt"
        component={ExamesVt}
        options={{
          headerShown: false,
          tabBarLabel: "Exames",
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
        component={PerfilVt}
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
