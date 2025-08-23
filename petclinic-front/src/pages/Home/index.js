import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useContext } from "react";
import * as Animatable from "react-native-animatable";
import { Calendar } from "react-native-calendars";
import { LocaleConfig } from "react-native-calendars";
import styles from "./styles";
import { AuthContext } from "../../contexts/AuthContext";

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

export default function Home() {
  const [selectedDate, setSelectedDate] = useState("");
  const [events, setEvents] = useState([]);
  const [text, setText] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [selecionouUmDia, setselecionouUmDia] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { user: usuario } = useContext(AuthContext);

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

  const agendar = async () => {
    if (selectedDate == null || selectedDate == "") {
      Alert.alert("Aviso!", "Nenhuma data selecionada");
      return;
    }
    if (text == null || text == "") {
      Alert.alert("Por favor", "De uma breve descrição dos sintomas");
      return;
    }
    if (horarioSelecionado == null || horarioSelecionado == "") {
      Alert.alert("Por favor", "Escolha um Horário");
      return;
    }

    try {
      const newEvent = {
        key: Date.now().toString(),
        data: selectedDate,
        horario: horarioSelecionado,
        sintomas: text,
        laudo: null,
        receituario: null,
      };

      setEvents([...events, newEvent]);
      setSelectedDate("");
      setHorarioSelecionado("");
      setText("");
      setselecionouUmDia(false);
      Alert.alert("Sucesso!", "Agendamento realizado com sucesso!");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Erro ao realizar agendamento, tente novamente mais tarde.");
    }
  };

  const deleteEvent = (event) => {
    setEvents(events.filter(e => e.key !== event.key));
  };

  const updateEvent = () => {
    if (selectedDate == null || selectedDate == "") {
      Alert.alert("Aviso!", "Nenhuma data selecionada");
      return;
    }
    if (text == null || text == "") {
      Alert.alert("Por favor", "De uma breve descrição dos sintomas");
      return;
    }
    if (horarioSelecionado == null || horarioSelecionado == "") {
      Alert.alert("Por favor", "Escolha um Horário");
      return;
    }

    const updatedEvents = events.map(event => {
      if (event.key === selectedEvent.key) {
        return {
          ...event,
          data: selectedDate,
          horario: horarioSelecionado,
          sintomas: text,
        };
      }
      return event;
    });

    setEvents(updatedEvents);
    setSelectedEvent(null);
    setHorarioSelecionado("");
    setSelectedDate("");
    setText("");
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
    setText(event.sintomas);
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Animatable.View
          animation="fadeInLeft"
          delay={500}
          style={styles.containerHeader}
        >
          <Text style={styles.message}>Agendamento</Text>
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

          <Text style={styles.title}>Digite uma prévia dos sintomas</Text>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder=" Sintomas"
            cursorColor="#38a69d"
            placeholderTextColor="#BDBDBD"
          />

          {selectedEvent === null ? (
            <TouchableOpacity style={styles.button} onPress={agendar}>
              <Text style={styles.buttonText}>Agendar consulta</Text>
            </TouchableOpacity>
          ) : (
            <View>
              <TouchableOpacity style={styles.button} onPress={updateEvent}>
                <Text style={styles.buttonText}>Atualizar consulta</Text>
              </TouchableOpacity>
            </View>
          )}

          {events.map((event) => (
            <View key={event.key} style={styles.eventContainer}>
              <Text style={styles.eventDate}>Dia da Consulta</Text>
              <Text>{event.data}</Text>
              <Text style={styles.eventDate}>Horário</Text>
              <Text>{event.horario}</Text>
              <Text style={styles.eventText}>Sintomas do pet</Text>
              <Text>{event.sintomas}</Text>
              <Text style={styles.eventText}>Laudo Médico</Text>
              <Text>{event.laudo || "Aguardando laudo"}</Text>
              <Text style={styles.eventText}>Receituário</Text>
              <View style={styles.iconPdf}>
                {event.receituario ? (
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
