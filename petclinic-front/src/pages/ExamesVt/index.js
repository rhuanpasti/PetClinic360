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
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

export default function ExamesVt() {
  const [scheduledAppointments, setScheduledAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user: usuario, token } = useContext(AuthContext);

  // Load exams when component mounts
  useEffect(() => {
    if (usuario && token) {
      loadExams();
    }
  }, [usuario, token]);

  const loadExams = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/exams`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Transform backend data to match frontend format
        const transformedExams = data.map(exam => ({
          key: exam.id.toString(),
          data: exam.data,
          horario: exam.horario,
          tipoExame: exam.tipoExame,
          laudo: exam.laudo,
          pdfExame: exam.pdfExame,
          userId: exam.ownerId,
          userName: exam.User?.nome || "Usuário"
        }));
        setScheduledAppointments(transformedExams);
      } else {
        console.error('Failed to load exams');
        setScheduledAppointments([]);
      }
    } catch (error) {
      console.error('Error loading exams:', error);
      setScheduledAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const addLaudo = async () => {
    if (!selectedAppointment?.laudo) {
      Alert.alert("Aviso!", "Por favor, adicione um laudo");
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/exams/${selectedAppointment.key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          laudo: selectedAppointment.laudo
        })
      });

      if (response.ok) {
        // Update local state
        const updatedExams = scheduledAppointments.map(exam => {
          if (exam.key === selectedAppointment.key) {
            return { ...exam, laudo: selectedAppointment.laudo };
          }
          return exam;
        });
        setScheduledAppointments(updatedExams);
        setSelectedAppointment(null);
        Alert.alert("Sucesso!", "Laudo adicionado com sucesso!");
      } else {
        const errorData = await response.json();
        Alert.alert("Erro", errorData.error || "Erro ao adicionar laudo");
      }
    } catch (error) {
      console.error('Error adding laudo:', error);
      Alert.alert("Erro", "Erro ao adicionar laudo");
    } finally {
      setLoading(false);
    }
  };

  const selectAppointment = (event) => {
    setSelectedAppointment(event);
  };

  const updateLaudo = (text) => {
    if (selectedAppointment) {
      setSelectedAppointment({
        ...selectedAppointment,
        laudo: text
      });
    }
  };

  const renderEvent = (event) => (
    <View key={event.key} style={styles.eventContainer}>
      <Text style={styles.eventDate}>Data do Exame</Text>
      <Text>{event.data}</Text>
      <Text style={styles.eventDate}>Horário</Text>
      <Text>{event.horario}</Text>
      <Text style={styles.eventDate}>Paciente</Text>
      <Text>{event.userName}</Text>
      <Text style={styles.eventText}>Tipo de Exame</Text>
      <Text>{event.tipoExame}</Text>
      <Text style={styles.eventText}>Laudo Médico</Text>
      <Text>{event.laudo || "Aguardando laudo"}</Text>
      <Text style={styles.eventText}>PDF do Exame</Text>
      <View style={styles.iconPdf}>
        {event.pdfExame ? (
          <Icon name="file-pdf-box" size={36} color="#333" />
        ) : (
          <Icon name="block-helper" size={26} color="#333" />
        )}
      </View>
      
      <View style={styles.eventActions}>
        <TouchableOpacity
          onPress={() => selectAppointment(event)}
          style={styles.editButton}
        >
          <Text style={styles.actionButton}>Adicionar Laudo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Animatable.View
          animation="fadeInLeft"
          delay={500}
          style={styles.containerHeader}
        >
          <Text style={styles.message}>Exames Agendados</Text>
        </Animatable.View>
        
        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
          {selectedAppointment && (
            <View style={styles.selectedAppointmentContainer}>
              <Text style={styles.title}>Adicionar Laudo</Text>
              <Text style={styles.subtitle}>Exame: {selectedAppointment.data} às {selectedAppointment.horario}</Text>
              
              <Text style={styles.title}>Laudo Médico</Text>
              <TextInput
                style={styles.textArea}
                value={selectedAppointment.laudo || ""}
                onChangeText={updateLaudo}
                placeholder=" Digite o laudo médico..."
                cursorColor="#38a69d"
                placeholderTextColor="#BDBDBD"
                multiline
                numberOfLines={4}
              />
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, loading && { opacity: 0.6 }]} 
                  onPress={addLaudo}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Salvando..." : "Salvar Laudo"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.cancelButton, loading && { opacity: 0.6 }]} 
                  onPress={() => setSelectedAppointment(null)}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Carregando exames...</Text>
            </View>
          ) : scheduledAppointments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="file-document" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Nenhum exame agendado</Text>
            </View>
          ) : (
            scheduledAppointments.map((event) => renderEvent(event))
          )}
        </Animatable.View>
      </View>
    </ScrollView>
  );
}
