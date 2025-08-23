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
  containerHeader2: {
    marginTop: "6%",
    marginBottom: "5%",
    paddingStart: "3%",
  },
  containerHeader3: {
    marginTop: "-0.1%",
    marginBottom: "1%",
    paddingStart: "1%",
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
    paddingVertical: "5%",
  },
  title: {
    fontSize: 15,
    marginTop: 15,
    color: "#38a69d",
  },
  input: {
    borderBottomWidth: 1,
    height: 35, //<><><><><><>
    marginBottom: 15,
    fontSize: 15,
  },
  input2: {
    borderBottomWidth: 1,
    height: 35, //<><><><><><>
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
  eventContainer: {
    backgroundColor: "#A9F5E1", // balao
    padding: 15,
    marginTop: 5,
    borderRadius: 5,
  },
  actionButton: {
    color: "#FFF",
    marginRight: 5,
    backgroundColor: "#38a69d", // balao
    padding: 1,
    marginTop: 1,
    borderRadius: 10,
  },
  actionButton2: {
    color: "#FFF",
    marginRight: 205,
    backgroundColor: "#38a69d", // balao
    padding: 10,
    marginTop: 15,
    borderRadius: 10,
  },
  eventActions: {
    flexDirection: "row",
    marginTop: 1,
    alignSelf: "flex-end",
  },
  eventDate: {
    fontWeight: "bold",
  },
  title2: {
    fontSize: 50,
    // marginTop: 15,
    // color: "#38a69d",
    color: "#FFF",
  },
  /////////////////
  circle: {
    backgroundColor: "#38a69d",
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 95,
    right: 38,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: -1,
  },
  ///////////
  modalContainer: {
    backgroundColor: "#F2F2F2",
    borderRadius: 5,
    padding: 20,
    alignSelf: "center",
    justifyContent: "center",
    //alignItems: "center",
    marginTop: 0,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 350,
    height: 350,
  },
  iconePerfil: {
    backgroundColor: "#ccc",
    borderRadius: 75,
    height: 150,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  imagemPerfil: {
    height: 150,
    width: 150,
    borderRadius: 75,
    alignSelf: "center",
  },
  textoIcone: {
    color: "#fff",
    fontSize: 20,
  },
  eventImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: -3,
  },
  image: {
    width: 130,
    height: 130,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: -125,
    alignSelf: "flex-end",
  },
});
export default styles;
