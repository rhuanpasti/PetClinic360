import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import * as Animatable from "react-native-animatable";
import { Calendar } from "react-native-calendars";
import { LocaleConfig } from "react-native-calendars";
import styles from "./styles";
import { AuthContext } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../config";
import { Picker } from "@react-native-picker/picker";

import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jane.",
    "Feve.",
    "Març",
    "Abri",
    "Mai",
    "Jun",
    "Jul.",
    "Agos",
    "Sete.",
    "Out.",
    "Nov.",
    "Deze.",
  ],
  dayNames: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ],
  dayNamesShort: ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb."],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

export default function ExamesPet() {
  const [selectedDate, setSelectedDate] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [selecionouUmDia, setselecionouUmDia] = useState(false);
  const [tipoExame, setTipoExame] = useState("");
  const [selectedPet, setSelectedPet] = useState("");
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user: usuario, token } = useContext(AuthContext);

  const horarios = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  const tiposExame = [
    "Exame de Sangue",
    "Raio-X",
    "Ultrassom",
    "Eletrocardiograma",
    "Exame de Urina",
    "Exame de Fezes",
    "Outros"
  ];

  // Load existing pets and exams when component mounts
  useEffect(() => {
    if (usuario && token) {
      loadPets();
      loadExams();
    }
  }, [usuario, token]);

  const loadPets = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPets(data);
        // Set first pet as default if available
        if (data.length > 0 && !selectedPet) {
          setSelectedPet(data[0].id.toString());
        }
      } else {
        console.error('Failed to load pets');
      }
    } catch (error) {
      console.error('Error loading pets:', error);
    }
  };

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
        const transformedEvents = data.map(exam => ({
          key: exam.id.toString(),
          data: exam.data,
          horario: exam.horario,
          tipoExame: exam.tipoExame,
          laudo: exam.laudo,
          pdfExame: exam.pdfExame,
          petNome: exam.Pet?.nome || 'Pet não encontrado'
        }));
        setEvents(transformedEvents);
      } else {
        console.error('Failed to load exams');
      }
    } catch (error) {
      console.error('Error loading exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const agendarExame = async () => {
    if (selectedDate == null || selectedDate == "") {
      Alert.alert("Aviso!", "Nenhuma data selecionada");
      return;
    }
    if (tipoExame == null || tipoExame == "") {
      Alert.alert("Por favor", "Escolha o tipo de exame");
      return;
    }
    if (horarioSelecionado == null || horarioSelecionado == "") {
      Alert.alert("Por favor", "Escolha um Horário");
      return;
    }
    if (!selectedPet) {
      Alert.alert("Por favor", "Escolha um pet");
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/exams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          data: selectedDate,
          horario: horarioSelecionado,
          tipoExame: tipoExame,
          petId: parseInt(selectedPet)
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add new exam to local state
        const newEvent = {
          key: data.exam.id.toString(),
          data: data.exam.data,
          horario: data.exam.horario,
          tipoExame: data.exam.tipoExame,
          laudo: data.exam.laudo,
          pdfExame: data.exam.pdfExame,
          petNome: data.exam.Pet?.nome || 'Pet não encontrado'
        };

        setEvents([...events, newEvent]);
        setSelectedDate("");
        setHorarioSelecionado("");
        setTipoExame("");
        setselecionouUmDia(false);
        Alert.alert("Sucesso!", "Exame agendado com sucesso!");
      } else {
        const errorData = await response.json();
        Alert.alert("Erro", errorData.error || "Erro ao agendar exame");
      }
    } catch (error) {
      console.error('Error creating exam:', error);
      Alert.alert("Erro", "Erro ao agendar exame, tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (event) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/exams/${event.key}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setEvents(events.filter(e => e.key !== event.key));
        Alert.alert("Sucesso!", "Exame cancelado com sucesso!");
      } else {
        Alert.alert("Erro", "Erro ao cancelar exame");
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      Alert.alert("Erro", "Erro ao cancelar exame");
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async () => {
    if (selectedDate == null || selectedDate == "") {
      Alert.alert("Aviso!", "Nenhuma data selecionada");
      return;
    }
    if (tipoExame == null || tipoExame == "") {
      Alert.alert("Por favor", "Escolha o tipo de exame");
      return;
    }
    if (horarioSelecionado == null || horarioSelecionado == "") {
      Alert.alert("Por favor", "Escolha um Horário");
      return;
    }
    if (!selectedPet) {
      Alert.alert("Por favor", "Escolha um pet");
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/exams/${selectedEvent.key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          data: selectedDate,
          horario: horarioSelecionado,
          tipoExame: tipoExame,
          petId: parseInt(selectedPet)
        })
      });

      if (response.ok) {
        const updatedEvents = events.map(event => {
          if (event.key === selectedEvent.key) {
            return {
              ...event,
              data: selectedDate,
              horario: horarioSelecionado,
              tipoExame: tipoExame,
            };
          }
          return event;
        });

        setEvents(updatedEvents);
        setSelectedEvent(null);
        setHorarioSelecionado("");
        setSelectedDate("");
        setTipoExame("");
        Alert.alert("Sucesso!", "Exame atualizado com sucesso!");
      } else {
        const errorData = await response.json();
        Alert.alert("Erro", errorData.error || "Erro ao atualizar exame");
      }
    } catch (error) {
      console.error('Error updating exam:', error);
      Alert.alert("Erro", "Erro ao atualizar exame");
    } finally {
      setLoading(false);
    }
  };

  const selecionarDia = (day) => {
    setSelectedDate(day.dateString);
    setselecionouUmDia(true);
  };

  const selecionarHorario = (horario) => {
    setHorarioSelecionado(horario);
  };

  const editEvent = (event) => {
    setSelectedEvent(event);
    setSelectedDate(event.data);
    setHorarioSelecionado(event.horario);
    setTipoExame(event.tipoExame);
    // Find and set the pet for this exam
    const pet = pets.find(p => p.nome === event.petNome);
    if (pet) {
      setSelectedPet(pet.id.toString());
    }
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Animatable.View
          animation="fadeInLeft"
          delay={500}
          style={styles.containerHeader}
        >
          <Text style={styles.message}>Agendamento de Exames</Text>
        </Animatable.View>
        
        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
          <Calendar
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#b6c1cd",
              textSectionTitleDisabledColor: "#d9e1e8",
              selectedDayBackgroundColor: "#00adf5",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#00adf5",
              dayTextColor: "#2d4150",
              textDisabledColor: "#d9e1e8",
              indicatorColor: "blue",
            }}
            onDayPress={(day) => {
              setselecionouUmDia(false);
              setSelectedDate(day.dateString);
              setselecionouUmDia(true);
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: "orange",
              },
            }}
          />
          
          {selecionouUmDia ? (
            <ScrollView horizontal>
              {horarios.map((horario) => (
                <TouchableOpacity
                  key={horario}
                  onPress={() => selecionarHorario(horario)}
                  style={[
                    styles.horario,
                    horario === horarioSelecionado && styles.horarioSelecionado,
                  ]}
                >
                  <Text style={[styles.horarioTexto, { color: "white" }]}>
                    {horario}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : null}

          <Text style={styles.title}>Selecionar Pet</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedPet}
              onValueChange={(itemValue) => setSelectedPet(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione um pet" value="" />
              {pets.map((pet) => (
                <Picker.Item key={pet.id} label={pet.nome} value={pet.id.toString()} />
              ))}
            </Picker>
          </View>

          <Text style={styles.title}>Tipo de Exame</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tipoExame}
              onValueChange={(itemValue) => setTipoExame(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione o tipo de exame" value="" />
              {tiposExame.map((tipo) => (
                <Picker.Item key={tipo} label={tipo} value={tipo} />
              ))}
            </Picker>
          </View>

          {selectedEvent === null ? (
            <TouchableOpacity 
              style={[styles.button, loading && { opacity: 0.6 }]} 
              onPress={agendarExame}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Salvando..." : "Agendar Exame"}
              </Text>
            </TouchableOpacity>
          ) : (
            <View>
              <TouchableOpacity 
                style={[styles.button, loading && { opacity: 0.6 }]} 
                onPress={updateEvent}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Atualizando..." : "Atualizar Exame"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {events.map((event) => (
            <View key={event.key} style={styles.eventContainer}>
              <Text style={styles.eventDate}>Pet</Text>
              <Text>{event.petNome}</Text>
              <Text style={styles.eventDate}>Data do Exame</Text>
              <Text>{event.data}</Text>
              <Text style={styles.eventDate}>Horário</Text>
              <Text>{event.horario}</Text>
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
                  disabled={event.laudo ? true : false}
                  onPress={() => editEvent(event)}
                  style={[
                    styles.editButton,
                    event.laudo ? styles.disabled : null,
                  ]}
                >
                  <Text style={styles.actionButton}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteEvent(event)}>
                  <Text style={styles.actionButton}>Deletar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </Animatable.View>
      </View>
    </ScrollView>
  );
}
