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
  },
  input: {
    borderBottomWidth: 1,
    height: 40, //<><><><><><>
    marginBottom: 15,
    fontSize: 15,
  },
  button: {
    backgroundColor: "#38a69d",
    width: "100%",
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
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
  labelErros: {
    alignSelf: "flex-start",
    color: "#ff375b",
    marginBottom: 1,
  },
});
export default styles;
