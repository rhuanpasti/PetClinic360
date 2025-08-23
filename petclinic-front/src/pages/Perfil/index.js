import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import * as Animatable from "react-native-animatable";
import styles from "./styles";
import { AuthContext } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../config";

export default function Perfil() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const { user, token, signOut } = useContext(AuthContext);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setNome(user.nome || "");
      setEmail(user.email || "");
      setEndereco(user.endereco || "");
      setTelefone(user.telefone || "");
      setCpf(user.cpf || "");
    }
  }, [user]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    if (!nome || !email) {
      Alert.alert("Aviso!", "Nome e email são obrigatórios");
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nome,
          email,
          endereco,
          telefone,
          cpf
        })
      });

      if (response.ok) {
        Alert.alert("Sucesso!", "Perfil atualizado com sucesso!");
        setEditing(false);
      } else {
        const errorData = await response.json();
        Alert.alert("Erro", errorData.error || "Erro ao atualizar perfil");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert("Erro", "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setNome(user.nome || "");
    setEmail(user.email || "");
    setEndereco(user.endereco || "");
    setTelefone(user.telefone || "");
    setCpf(user.cpf || "");
    setEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sair",
          onPress: signOut
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Animatable.View
          animation="fadeInLeft"
          delay={500}
          style={styles.containerHeader}
        >
          <Text style={styles.message}>Meu Perfil</Text>
        </Animatable.View>
        
        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
          <Text style={styles.title}>Nome</Text>
          <TextInput
            style={[styles.input, !editing && styles.disabledInput]}
            value={nome}
            onChangeText={setNome}
            placeholder=" Seu nome"
            cursorColor="#38a69d"
            placeholderTextColor="#BDBDBD"
            editable={editing}
          />

          <Text style={styles.title}>Email</Text>
          <TextInput
            style={[styles.input, !editing && styles.disabledInput]}
            value={email}
            onChangeText={setEmail}
            placeholder=" Seu email"
            cursorColor="#38a69d"
            placeholderTextColor="#BDBDBD"
            editable={editing}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.title}>Endereço</Text>
          <TextInput
            style={[styles.input, !editing && styles.disabledInput]}
            value={endereco}
            onChangeText={setEndereco}
            placeholder=" Seu endereço"
            cursorColor="#38a69d"
            placeholderTextColor="#BDBDBD"
            editable={editing}
          />

          <Text style={styles.title}>Telefone</Text>
          <TextInput
            style={[styles.input, !editing && styles.disabledInput]}
            value={telefone}
            onChangeText={setTelefone}
            placeholder=" Seu telefone"
            cursorColor="#38a69d"
            placeholderTextColor="#BDBDBD"
            editable={editing}
            keyboardType="phone-pad"
          />

          <Text style={styles.title}>CPF</Text>
          <TextInput
            style={[styles.input, !editing && styles.disabledInput]}
            value={cpf}
            onChangeText={setCpf}
            placeholder=" Seu CPF"
            cursorColor="#38a69d"
            placeholderTextColor="#BDBDBD"
            editable={editing}
            keyboardType="numeric"
          />

          {editing ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, loading && { opacity: 0.6 }]} 
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Salvando..." : "Salvar"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.cancelButton, loading && { opacity: 0.6 }]} 
                onPress={handleCancel}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleEdit}
            >
              <Text style={styles.buttonText}>Editar Perfil</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.logoutButton]} 
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </ScrollView>
  );
}
