import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import * as Animatable from "react-native-animatable";

const LoadingScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#38a69d",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animatable.Image
        animation="flipInY"
        source={require("../../assets/ppts.png")}
        style={{ width: "50%", marginBottom: 50 }}
        resizeMode="contain"
      />
      
      <ActivityIndicator size="large" color={"#FFF"} animating={true} />
      
      <Text style={{
        color: "#FFF",
        fontSize: 18,
        marginTop: 20,
        fontWeight: "600"
      }}>
        Carregando...
      </Text>
    </View>
  );
};

export default LoadingScreen;
