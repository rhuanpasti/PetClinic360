import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Image,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import * as Animatable from "react-native-animatable";
import styles from "./styles";
import { AuthContext } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../config";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

export default function DadosDoPet() {
  const [eventsPet, setEventsPet] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [nomePet, setNomePet] = useState("");
  const [especie, setEspecie] = useState("");
  const [raca, setRaca] = useState("");
  const [idade, setIdade] = useState("");
  const [peso, setPeso] = useState("");
  const [cor, setCor] = useState("");
  const [loading, setLoading] = useState(false);
  const { user: usuario, token } = useContext(AuthContext);

  const especies = [
    "Cão",
    "Gato",
    "Ave",
    "Réptil",
    "Peixe",
    "Outros"
  ];

  // Load existing pets when component mounts
  useEffect(() => {
    console.log('useEffect chamado - usuario:', usuario, 'token:', token);
    if (usuario && token) {
      console.log('Carregando pets...');
      loadPets();
    } else {
      console.log('Usuário ou token não disponível');
    }
  }, [usuario, token]);

  const loadPets = async () => {
    console.log('loadPets chamada');
    try {
      setLoading(true);
      console.log('Fazendo requisição para:', `${API_BASE_URL}/pets`);
      const response = await fetch(`${API_BASE_URL}/pets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Dados recebidos do backend:', data);
        console.log('Status da resposta:', response.status);
        // Transform backend data to match frontend format
        const transformedPets = data.map(pet => {
          console.log('Transformando pet:', pet);
          return {
            key: pet.id?.toString() || pet.key || Math.random().toString(),
            nomePet: pet.name || pet.nome || pet.nomePet || '',
            especie: pet.species || pet.especie || '',
            raca: pet.breed || pet.raca || '',
            idade: pet.age || pet.idade || 0,
            peso: pet.weight || pet.peso || 0,
            cor: pet.color || pet.cor || '',
            imageUrl: pet.imageUrl || ''
          };
        });
        console.log('Pets transformados:', transformedPets);
        setEventsPet(transformedPets);
      } else {
        console.error('Failed to load pets');
      }
    } catch (error) {
      console.error('Error loading pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const salvarPet = async () => {
    console.log('salvarPet chamada');
    console.log('aqui');
    console.log(nomePet, especie, raca, idade, peso, cor);
    if (!nomePet || !especie || !raca || !idade || !peso || !cor) {
      Alert.alert("Aviso!", "Todos os campos são obrigatórios");
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/pets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: nomePet,
          species: especie,
          breed: raca,
          age: parseInt(idade),
          weight: parseFloat(peso),
          color: cor,
          ownerId: usuario.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Pet criado com sucesso:', data);
        console.log('Status da resposta:', response.status);
        
        // Adicionar o novo pet diretamente à lista se a API retornar os dados
        if (data && data.id) {
          const newPet = {
            key: data.id.toString(),
            nomePet: data.name || nomePet,
            especie: data.species || especie,
            raca: data.breed || raca,
            idade: data.age || parseInt(idade),
            peso: data.weight || parseFloat(peso),
            cor: data.color || cor,
            imageUrl: data.imageUrl || ''
          };
          setEventsPet(prevPets => [...prevPets, newPet]);
        } else {
          // Se não retornar dados, recarregar a lista
          console.log('Recarregando lista de pets...');
          await loadPets();
        }

        // Clear form
        setNomePet("");
        setEspecie("");
        setRaca("");
        setIdade("");
        setPeso("");
        setCor("");
        
        Alert.alert("Sucesso!", "Pet cadastrado com sucesso!");
      } else {
        const errorData = await response.json();
        Alert.alert("Erro", errorData.error || "Erro ao cadastrar pet");
      }
    } catch (error) {
      console.error('Error creating pet:', error);
      Alert.alert("Erro", "Erro ao cadastrar pet, tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async (event) => {
    console.log('deletePet chamada para evento:', event);
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/pets/${event.key}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setEventsPet(eventsPet.filter(e => e.key !== event.key));
        Alert.alert("Sucesso!", "Pet removido com sucesso!");
      } else {
        Alert.alert("Erro", "Erro ao remover pet");
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      Alert.alert("Erro", "Erro ao remover pet");
    } finally {
      setLoading(false);
    }
  };

  const updatePet = async () => {
    console.log('updatePet chamada');
    if (!nomePet || !especie || !raca || !idade || !peso || !cor) {
      Alert.alert("Aviso!", "Todos os campos são obrigatórios");
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/pets/${selectedEvent.key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: nomePet,
          species: especie,
          breed: raca,
          age: parseInt(idade),
          weight: parseFloat(peso),
          color: cor
        })
      });

      if (response.ok) {
        const updatedPets = eventsPet.map(pet => {
          if (pet.key === selectedEvent.key) {
            return {
              ...pet,
              nomePet: nomePet,
              especie: especie,
              raca: raca,
              idade: idade,
              peso: peso,
              cor: cor
            };
          }
          return pet;
        });

        setEventsPet(updatedPets);
        setSelectedEvent(null);
        
        // Clear form
        setNomePet("");
        setEspecie("");
        setRaca("");
        setIdade("");
        setPeso("");
        setCor("");
        
        Alert.alert("Sucesso!", "Pet atualizado com sucesso!");
      } else {
        const errorData = await response.json();
        Alert.alert("Erro", errorData.error || "Erro ao atualizar pet");
      }
    } catch (error) {
      console.error('Error updating pet:', error);
      Alert.alert("Erro", "Erro ao atualizar pet");
    } finally {
      setLoading(false);
    }
  };

  const editPet = (event) => {
    console.log('editPet chamada para evento:', event);
    setSelectedEvent(event);
    setNomePet(event.nomePet);
    setEspecie(event.especie);
    setRaca(event.raca);
    setIdade(event.idade.toString());
    setPeso(event.peso.toString());
    setCor(event.cor);
  };

  const cancelEdit = () => {
    console.log('cancelEdit chamada');
    setSelectedEvent(null);
    setNomePet("");
    setEspecie("");
    setRaca("");
    setIdade("");
    setPeso("");
    setCor("");
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Animatable.View
          animation="fadeInLeft"
          delay={500}
          style={styles.containerHeader}
        >
          <Text style={styles.message}>Dados do Pet</Text>
        </Animatable.View>
        
        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
          <Text style={styles.title}>Nome do Pet</Text>
          <TextInput
            style={styles.input}
            value={nomePet}
            onChangeText={setNomePet}
            placeholder=" Nome do pet"
            cursorColor="#38a69d"
            placeholderTextColor="#BDBDBD"
          />

          <Text style={styles.title}>Espécie</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={especie}
              onValueChange={(itemValue) => setEspecie(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione a espécie" value="" />
              {especies.map((esp) => (
                <Picker.Item key={esp} label={esp} value={esp} />
              ))}
            </Picker>
          </View>

          <Text style={styles.title}>Raça</Text>
          <TextInput
            style={styles.input}
            value={raca}
            onChangeText={setRaca}
            placeholder=" Raça do pet"
            cursorColor="#38a69d"
            placeholderTextColor="#BDBDBD"
          />

          <Text style={styles.title}>Idade (anos)</Text>
          <TextInput
            style={styles.input}
            value={idade}
            onChangeText={setIdade}
            placeholder=" Idade em anos"
            cursorColor="#38a69d"
            placeholderTextColor="#BDBDBD"
            keyboardType="numeric"
          />

          <Text style={styles.title}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            value={peso}
            onChangeText={setPeso}
            placeholder=" Peso em kg"
            cursorColor="#38a69d"
            placeholderTextColor="#BDBDBD"
            keyboardType="numeric"
          />

          <Text style={styles.title}>Cor</Text>
          <TextInput
            style={styles.input}
            value={cor}
            onChangeText={setCor}
            placeholder=" Cor do pet"
            cursorColor="#38a69d"
            placeholderTextColor="#BDBDBD"
          />

          {selectedEvent === null ? (
            <TouchableOpacity 
              style={[styles.button, loading && { opacity: 0.6 }]} 
              onPress={salvarPet}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Salvando..." : "Cadastrar Pet"}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, loading && { opacity: 0.6 }]} 
                onPress={updatePet}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Atualizando..." : "Atualizar Pet"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.cancelButton, loading && { opacity: 0.6 }]} 
                onPress={cancelEdit}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}

          {console.log('Estado atual eventsPet:', eventsPet)}
          {eventsPet.length === 0 ? (
            <View style={styles.eventContainer}>
              <Text style={styles.eventDate}>Nenhum pet cadastrado</Text>
              <Text>Cadastre seu primeiro pet usando o formulário acima.</Text>
            </View>
          ) : (
            eventsPet.map((event) => (
              <View key={event.key} style={styles.eventContainer}>
                {console.log('Renderizando evento:', event)}
                <Text style={styles.eventDate}>Nome</Text>
                <Text>{event.nomePet}</Text>
                <Text style={styles.eventDate}>Espécie</Text>
                <Text>{event.especie}</Text>
                <Text style={styles.eventDate}>Raça</Text>
                <Text>{event.raca}</Text>
                <Text style={styles.eventDate}>Idade</Text>
                <Text>{event.idade} anos</Text>
                <Text style={styles.eventDate}>Peso</Text>
                <Text>{event.peso} kg</Text>
                <Text style={styles.eventDate}>Cor</Text>
                <Text>{event.cor}</Text>
                
                <View style={styles.eventActions}>
                  <TouchableOpacity
                    onPress={() => editPet(event)}
                    style={styles.editButton}
                  >
                    <Text style={styles.actionButton}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deletePet(event)}>
                    <Text style={styles.actionButton}>Deletar</Text>
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
