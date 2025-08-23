import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#38a69d",
  },
  containerHeader: {
    marginTop: "5%",
    marginBottom: "5%",
    paddingStart: "5%",
  },
  message: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#FFF",
  },
  containerForm: {
    backgroundColor: "#FFF",
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: "5%",
    paddingEnd: "5%",
  },
  title: {
    fontSize: 18,
    marginTop: 15,
    color: "#38a69d",
    top: 20,
  },
  input: {
    borderBottomWidth: 1,
    height: 40, //<><><><><><>
    marginBottom: 15,
    fontSize: 15,
    top: 20,
  },
  button: {
    backgroundColor: "#38a69d",
    width: "100%",
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    top: 15,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  buttonRegister: {
    marginTop: 15,
    alignSelf: "center",
  },
  registerText: {
    color: "#a1a1a1",
  },
  circle: {
    backgroundColor: "#FA5858",
    width: 60,
    height: 60,
    position: "absolute",
    bottom: "97%",
    right: 38,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: -1,
    zIndex: 999,
  },
  scroll: {
    backgroundColor: "#FFF",
  },
  iconePerfil: {
    backgroundColor: "#ccc",
    borderRadius: 75,
    height: 120,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    top: 12,
  },
  imagemPerfil: {
    height: 150,
    width: 150,
    borderRadius: 75,
    alignSelf: "center",
    top: 14,
  },
  esp: {
    top: 70,
  },
});
export default styles;
