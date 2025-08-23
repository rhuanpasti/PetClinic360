
import React, { useState, createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { API_BASE_URL } from "../pages/config";


export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorage() {
      const storageUser = await AsyncStorage.getItem("Auth_user");
      if (storageUser) {
        setUser(JSON.parse(storageUser));
      }
      setLoading(false);
    }
    loadStorage();
  }, []);

  // Login for user and vet
  async function logar(email, password, isVet = false) {
    try {
      const endpoint = isVet ? '/auth/login-vet' : '/auth/login';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao logar');
      setUser(data.user);
      await AsyncStorage.setItem("Auth_user", JSON.stringify(data.user));
    } catch (error) {
      Alert.alert("Erro", error.message || "Email ou senha inválidos");
    }
  }

  // Register user
  async function cadastrar(email, password, nome, endereco, telefone, cpf) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, nome, endereco, telefone, cpf })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao cadastrar');
      setUser(data.user);
      await AsyncStorage.setItem("Auth_user", JSON.stringify(data.user));
    } catch (error) {
      Alert.alert("Aviso!", error.message || "Esse email já está sendo usado!");
    }
  }

  // Register vet
  async function cadastrarVt(email, password, nomeVt, endereco, telefone, cpf, crmv) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register-vet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, nome: nomeVt, endereco, telefone, cpf, crmv })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao cadastrar');
      setUser(data.user);
      await AsyncStorage.setItem("Auth_user", JSON.stringify(data.user));
    } catch (error) {
      Alert.alert("Aviso!", error.message || "Esse email já está sendo usado!");
    }
  }

  // Redefinir senha (password reset)
  async function redefinar(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao redefinir senha');
      Alert.alert("Aviso!", data.message || "Enviamos um e-mail para você redefinir sua senha");
    } catch (error) {
      Alert.alert("Erro", error.message || "Erro ao redefinir senha");
    }
  }

  async function signOut() {
    await AsyncStorage.removeItem("Auth_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user: user || {},
        loading,
        cadastrar,
        logar,
        setUser,
        signOut,
        cadastrarVt,
        redefinar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;


