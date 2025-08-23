import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";
import styles from "./styles";
import { AuthContext } from "../../contexts/AuthContext";
import React, { useState, useContext } from "react";

export default function NewPassword() {
  const { redefinar } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  function trocarSenha() {
    try {
      redefinar(email);
    } catch (e) {
      alert(e);
    }
  }

  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeInLeft"
        delay={500}
        style={styles.containerHeader}
      >
        <Text style={styles.message}>Recuperação de conta por email</Text>
      </Animatable.View>
      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Email</Text>
        <TextInput
          placeholder="Digite o e-mail criado*"
          cursorColor="#38a69d"
          placeholderTextColor="#BDBDBD"
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={trocarSenha}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}
