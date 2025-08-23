import { View, Text, Modal, ActivityIndicator } from "react-native";
import React from "react";
import * as Animatable from "react-native-animatable";

const LoadingScreen = ({ visible }) => {
  return (
    <Modal transparent visible={visible}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#38a69d",
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#38a69d",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 1,
          }}
        >
          <Animatable.Image
            animation="flipInY"
            source={require("../../assets/ppts.png")}
            style={{ width: "50%" }}
            resizeMode="contain"
          />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#38a69d",
          }}
        >
          <ActivityIndicator size="large" color={"#FFF"} animating={true} />
        </View>
      </View>
    </Modal>

    /* <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Carregando...</Text>
    </View>*/
  );
};
/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});*/

export default LoadingScreen;
