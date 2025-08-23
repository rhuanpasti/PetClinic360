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
    marginTop: 15,
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

  //AQUI//
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
  actionButton: {
    color: "#FFF",
    marginRight: 20,
    backgroundColor: "#38a69d", // balao
    padding: 10,
    marginTop: 1,
    borderRadius: 30,
  },
  horario: {
    width: 70,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    marginHorizontal: 5,
    backgroundColor: "#38a69d", // balao
    padding: 15,
    marginTop: 15,
    borderRadius: 5,
  },
  horarioSelecionado: {
    backgroundColor: "#01ACF6",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingHorizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    height: "100%",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.5,
  },
  reportFilledButton: {
    backgroundColor: "green",
  },
  scroll: {
    backgroundColor: "#FFF",
  },
  atendido: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: -200,
    top: 15,
  },
  font: {
    fontWeight: "bold",
  },
  disabled: {
    opacity: 0.6,
  },
});
export default styles;
