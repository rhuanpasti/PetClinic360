import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import * as Animatable from "react-native-animatable";
import styles from "./styles";
import { AuthContext } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../config";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

export default function AdminListaVet() {
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useContext(AuthContext);

  // Load veterinarians when component mounts
  useEffect(() => {
    if (user && token) {
      loadVeterinarians();
    }
  }, [user, token]);

  const loadVeterinarians = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users?role=vet`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVeterinarios(data);
      } else {
        console.error('Failed to load veterinarians');
      }
    } catch (error) {
      console.error('Error loading veterinarians:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteVeterinarian = async (veterinario) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja remover o veterinário ${veterinario.nome}?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              
              const response = await fetch(`${API_BASE_URL}/users/${veterinario.id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              });

              if (response.ok) {
                setVeterinarios(veterinarios.filter(v => v.id !== veterinario.id));
                Alert.alert("Sucesso!", "Veterinário removido com sucesso!");
              } else {
                Alert.alert("Erro", "Erro ao remover veterinário");
              }
            } catch (error) {
              console.error('Error deleting veterinarian:', error);
              Alert.alert("Erro", "Erro ao remover veterinário");
            } finally {
              setLoading(false);
            }
          }
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
          <Text style={styles.message}>Lista de Veterinários</Text>
        </Animatable.View>
        
        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          ) : veterinarios.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="account-group" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Nenhum veterinário cadastrado</Text>
            </View>
          ) : (
            veterinarios.map((veterinario) => (
              <View key={veterinario.id} style={styles.eventContainer}>
                <Text style={styles.eventDate}>Nome</Text>
                <Text style={styles.eventText}>{veterinario.nome}</Text>
                
                <Text style={styles.eventDate}>Email</Text>
                <Text style={styles.eventText}>{veterinario.email}</Text>
                
                <Text style={styles.eventDate}>CRMV</Text>
                <Text style={styles.eventText}>{veterinario.crmv || "Não informado"}</Text>
                
                <Text style={styles.eventDate}>Telefone</Text>
                <Text style={styles.eventText}>{veterinario.telefone || "Não informado"}</Text>
                
                <Text style={styles.eventDate}>Endereço</Text>
                <Text style={styles.eventText}>{veterinario.endereco || "Não informado"}</Text>
                
                <View style={styles.eventActions}>
                  <TouchableOpacity 
                    onPress={() => deleteVeterinarian(veterinario)}
                    style={styles.deleteButton}
                  >
                    <Icon name="delete" size={20} color="#fff" />
                    <Text style={styles.actionButton}>Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </Animatable.View>
      </View>
    </ScrollView>
  );
}
