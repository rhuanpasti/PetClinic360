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
    height: 40,
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

  ///AQUI////
  eventContainer: {
    backgroundColor: "#A9F5E1", // balao
    padding: 15,
    marginTop: 15,
    borderRadius: 5,
  },
  eventDate: {
    fontWeight: "bold",
  },
  eventText: {
    marginTop: 5,
    fontWeight: "bold",
  },
  eventActions: {
    flexDirection: "row",
    marginTop: 20,
  },
  eventUserId: {
    marginTop: 5,
    fontWeight: "bold",
  },
  laudoText: {
    marginTop: 5,
    fontWeight: "bold",
  },

  actionButton: {
    color: "#FFF",
    marginRight: 20,
    backgroundColor: "#38a69d", // balao
    padding: 10,
    marginTop: 1,
    borderRadius: 30,
  },
  ///AQUI 2///
  laudoInput: {
    height: 50,
    //borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    //fontWeight: "bold",
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
  /*salvarButton: {
    backgroundColor: "#008000",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    alignItems: "center",
  },
  salvarButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  crmvButton: {
    backgroundColor: "#0D98BA",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
   crmvButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },*/
});

export default styles;
