import { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";
import { auth } from "../config";
import styles from "./styles";

export default function SignIn() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { logar, logarVt } = useContext(AuthContext);

  function handleLogin() {
    return async () => {
      if (email === "" || password === "") {
        setError(true);
        Alert.alert("Erro", "Por favor, preencha todos os campos.");
        return;
      }

      try {
        // // const emailExists = await fetchSignInMethodsForEmail(auth, email);

        // // if (emailExists.length === 0) {
        // //   setError(true);
        // //   Alert.alert("Erro", "O email não está cadastrado.");
        // //   return;
        // // }

        // // if (!emailExists.includes("password")) {
        // //   setError(true);
        // //   Alert.alert(
        // //     "Erro",
        // //     "Este email está cadastrado com um provedor de autenticação externo."
        // //   );
        // //   return;
        // // }

        // setError(false);
        logar(email, password);
        logarVt(email, password);
      } catch (error) {
        console.log(error);
        Alert.alert("Erro", "Senha inválida.");
      }
    };
  }

  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeInLeft"
        delay={500}
        style={styles.containerHeader}
      >
        <Text style={styles.message}>Bem-Vindo(a)</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Email</Text>
        <TextInput
          placeholder="E-mail*"
          cursorColor="#38a69d"
          placeholderTextColor="#BDBDBD"
          autoCorrect={false}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />

        <Text style={styles.title}>Senha</Text>
        <TextInput
          placeholder="Senha*"
          cursorColor="#38a69d"
          placeholderTextColor="#BDBDBD"
          secureTextEntry={true}
          autoCorrect={false}
          autoCapitalize="none"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin()}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={() => navigation.navigate("Registration")}
        >
          <Text style={styles.registerText}>
            Não possui uma conta?{" "}
            <Text style={styles.linkText}> Cadastre-se </Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={() => navigation.navigate("NewPassword")}
        >
          <Text style={styles.registerText}>
            Redefina sua senha <Text style={styles.linkText}>aqui</Text>
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}
