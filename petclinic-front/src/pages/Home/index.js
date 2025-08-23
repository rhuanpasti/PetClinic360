import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Linking,
} from "react-native";
import React, { useState, useContext, useEffect, useRef } from "react";
import * as Animatable from "react-native-animatable";
import { Calendar } from "react-native-calendars";
import { LocaleConfig } from "react-native-calendars";
import styles from "./styles";
import { AuthContext } from "../../contexts/AuthContext";
import LoadingScreen from "../LoadingScreen";
import moment from "moment";

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
  const [selectedDate, setSelectedDate] = useState([]);
  const [events, setEvents] = useState([]);
  const [agendaClinica, setAgendaClinica] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const promises = [];
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [selecionouUmDia, setselecionouUmDia] = useState(false);
  const [estaCarregando, setEstaCarregando] = useState(false);
  const [agendamentoAtivo, setAgendamentoAtivo] = useState(true);
  const [horarioDisponivel, setHorarioDisponivel] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Loading timeout
  }, []);

  const { user: usuario } = useContext(AuthContext);

  useEffect(() => {
    const uid = usuario.uid;
    const eventsRef = ref(database, `agendamento/${uid}`);

    onValue(eventsRef, (snapshot) => {
      const events = [];
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const date = childSnapshot.val().data;
        const horarioSelecionado = childSnapshot.val().horario;
        const text = childSnapshot.val().sintomas;
        const laudo = childSnapshot.val().laudo;
        const receituario = childSnapshot.val().receituario;

        events.push({
          key: key,
          data: date,
          horario: horarioSelecionado,
          sintomas: text,
          laudo: laudo,
          receituario: receituario,
        });
      });

      setEvents(events);
    });

    const agendaClinicaRef = ref(database, "agenda-clinica");

    onValue(agendaClinicaRef, (snapshot) => {
      const agendaClinica = [];
      snapshot.forEach((dateSnapshot) => {
        const date = dateSnapshot.key;
        dateSnapshot.forEach((timeSnapshot) => {
          const time = timeSnapshot.key;
          timeSnapshot.forEach((idSnapshot) => {
            const id = idSnapshot.key;
            const text = idSnapshot.child("sintomas").val();
            const laudo = idSnapshot.child("laudo").val();
            const receituario = idSnapshot.child("agendamento").val();

            agendaClinica.push({
              data: date,
              horario: time,
              id: id,
              sintomas: text,
              laudo: laudo,
              receituario: receituario,
            });
          });
        });
      });
      setAgendaClinica(agendaClinica);
    });
    return () => {
      // No need to off() for v9+ as it's not a listener
    };
  }, [usuario]);

  //agendar
  const agendar = async () => {
    if (selectedDate == null || selectedDate == "") {
      Alert.alert("Aviso!", "Nenhuma data selecionada", [
        {
          text: "OK",
          onPress: () => {},
        },
      ]);

      return;
    }
    if (text == null || text == "") {
      Alert.alert("Por favor", "De uma breve descrição dos sintomas", [
        {
          text: "OK",
          onPress: () => {},
        },
      ]);

      return;
    }
    if (horarioSelecionado == null || horarioSelecionado == "") {
      Alert.alert("Por favor", "Escolha um Horário", [
        {
          text: "OK",
          onPress: () => {},
        },
      ]);
      return;
    }
    const uid = usuario.uid;
    try {
      const newAppointmentRef = push(ref(database, `agendamento/${uid}`));
      await set(newAppointmentRef, {
        data: selectedDate,
        horario: horarioSelecionado,
        sintomas: text,
      });
      setSelectedDate("");
      setHorarioSelecionado("");
      setText("");
      setselecionouUmDia(false);
      createAgendaClinicaTable();
      Alert.alert("Sucesso!", "Agendamento realizado com sucesso!");
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Vixi",
        "Erro ao realizar agendamento, tente novamante mais tarde. "
      );
    }
  };

  const createAgendaClinicaTable = async () => {
    try {
      const agendaClinicaRef = ref(database, "agenda-clinica");
      const eventsRef = ref(database, "agendamento");
      const snapshot = await get(eventsRef);
      const appointments = snapshot.val();

      Object.entries(appointments).forEach(([uid, userAppointments]) => {
        Object.entries(userAppointments).forEach(
          ([appointmentId, appointment]) => {
            const { data, horario, sintomas } = appointment;
            const appointmentRef = ref(agendaClinicaRef, `${data}/${horario}`);
            set(appointmentRef, { [uid]: { [appointmentId]: { sintomas } } });
          }
        );
      });

    } catch (error) {
      console.log(error);

    }
  };

  const deleteEvent = (event) => {
    const uid = usuario.uid;
    const eventKey = event.key;
    remove(ref(database, `agendamento/${uid}/${eventKey}`));
    deleteEventClinica(event);
  };

  const deleteEventClinica = (event) => {
    const uid = usuario.uid;
    const key = event.key;
    const data = event.data;
    const horario = event.horario;
    remove(ref(database, `agendamento/${uid}/${key}`))
      .then(() => {
        remove(ref(database, `${data}/${horario}/${uid}/${key}`));
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(
          "Erro",
          "Ocorreu um erro ao excluir o agendamento. Tente novamente mais tarde."
        );
      });
  };

  const updateEvent = () => {
    if (selectedDate == null || selectedDate == "") {
      Alert.alert("Aviso!", "Nenhuma data selecionada", [
        {
          text: "OK",
          onPress: () => {},
        },
      ]);

      return;
    }
    if (text == null || text == "") {
      Alert.alert("Por favor", "De uma breve descrição dos sintomas", [
        {
          text: "OK",
          onPress: () => {},
        },
      ]);
      return;
    }
    if (horarioSelecionado == null || horarioSelecionado == "") {
      Alert.alert("Por favor", "Escolha um Horário", [
        {
          text: "OK",
          onPress: () => {},
        },
      ]);
      return;
    }
    const uid = usuario.uid;
    const eventKey = events[selectedEvent].key;
    update(ref(database, `agendamento/${uid}/${eventKey}`), {
      data: selectedDate,
      horario: horarioSelecionado,
      sintomas: text,
    });
    setSelectedEvent(null);
    setHorarioSelecionado(null);
    setSelectedDate("");
    setText("");
  };


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
  //bloqueia o horário escolhido
  const blockedDates = agendaClinica.reduce((a, event, c, obj) => {
    const { data, horario } = event;
    if (!obj[data]) {
      obj[data] = {};
    }
    obj[data][horario] = { disabled: true };

    return obj;
  }, {});

  const horarioRefs = useRef([]);

  const selecionarDia = (day) => {
    setSelectedDate(day.dateString);
    desabilitarDias({ dateString: day.dateString });
  };

  useEffect(() => {
    desabilitarDias({ dateString: selectedDate });
  }, [selectedDate, blockedDates]);

  useEffect(() => {
    if (!agendamentoAtivo && horarioSelecionado) {
      const horarioIndex = horarios.indexOf(horarioSelecionado);
      horarioRefs.current[horarioIndex].setNativeProps({
        style: { backgroundColor: "#01acf1" }, //horario selecionado fica azul
      });
    }
  }, [agendamentoAtivo]);

  function desabilitarDias(day) {
    let dia = day.dateString;
    let contagem = 0;

    const dataAtual = moment();
    const horarioAtual = moment().format("HH:mm");

    // Verifica se a data do calendário é anterior à data atual
    if (moment(dia, "YYYY-MM-DD").isBefore(dataAtual, "day")) {
      // Define a cor de fundo do horário como cinza e bloqueia o horário
      horarios.forEach((horario, index) => {
        if (horarioRefs.current && horarioRefs.current[index]) {
          horarioRefs.current[index].setNativeProps({
            style: { backgroundColor: "grey" },
          });
        }
        if (dia in blockedDates) {
          blockedDates[dia][horario] = { disabled: true };
        }
      });

      setHorarioDisponivel(false);
      return;
    }

    // Itera sobre a lista de horários
    try {
      horarios.forEach((horario, index) => {
        if (dia in blockedDates && blockedDates[dia][horario]?.disabled) {
          // Define a cor de fundo do horário como cinza se estiver bloqueado
          if (horarioRefs.current && horarioRefs.current[index]) {
            horarioRefs.current[index].setNativeProps({
              style: {
                backgroundColor: "grey",
              },
            });
          }

          contagem++;
          if (contagem === horarios.length) {
            setHorarioDisponivel(false);
          }
        } else {
          // Verifica se o horário é menor ou igual ao horário atual, apenas se for o mesmo dia
          const horarioSelecionado = moment(
            `${dia} ${horario}`,
            "YYYY-MM-DD HH:mm"
          );
          if (
            dia === dataAtual.format("YYYY-MM-DD") &&
            horarioSelecionado.isSameOrBefore(dataAtual, "minute")
          ) {
            // Define a cor de fundo do horário como cinza se já tiver passado do horário atual
            if (horarioRefs.current && horarioRefs.current[index]) {
              horarioRefs.current[index].setNativeProps({
                style: { backgroundColor: "grey" },
              });
            }

            // Desabilita o horário
            if (!blockedDates[dia]) {
              blockedDates[dia] = {};
            }
            blockedDates[dia][horario] = { disabled: true };
          } else if (horarioSelecionado.isBefore(dataAtual, "minute")) {
            // Define a cor de fundo do horário como cinza se já tiver passado do horário atual
            if (horarioRefs.current && horarioRefs.current[index]) {
              horarioRefs.current[index].setNativeProps({
                style: { backgroundColor: "grey" },
              });
            }

            // Desabilita o horário
            if (!blockedDates[dia]) {
              blockedDates[dia] = {};
            }
            blockedDates[dia][horario] = { disabled: true };
          } else {
            // Define a cor de fundo do horário como verde se estiver disponível
            if (horarioRefs.current && horarioRefs.current[index]) {
              horarioRefs.current[index].setNativeProps({
                style: { backgroundColor: "#38a69d" },
              });
            }

            if (horarioDisponivel === false) {
              setHorarioDisponivel(true);
            }
          }
        }
      });
    } catch (e) {
      console.log(e);
      return;
    }
  }

  const selecionarHorario = (horario) => {
    if (!horarioDisponivel) {
      Alert.alert("Aviso", "Não há horários disponíveis para este dia.");
      return;
    }

    const diaSelecionado = selectedDate;
    if (
      diaSelecionado in blockedDates &&
      blockedDates[diaSelecionado][horario]?.disabled
    ) {
      Alert.alert("Aviso", "Este horário está indisponível.");
      return;
    }

    if (selectedEvent !== null) {
      editEvent(events[selectedEvent]);
    } else {
      setAgendamentoAtivo((prevState) => !prevState);
    }

    // Verifica se o horário está bloqueado e define a propriedade `disabled` para `true`
    if (diaSelecionado in blockedDates) {
      const horariosBloqueados = blockedDates[diaSelecionado];
      if (horario in horariosBloqueados) {
        const horarioBloqueado = horariosBloqueados[horario];
        if (horarioBloqueado) {
          horarioBloqueado.disabled = true;
        }
      }
    }

    setHorarioSelecionado(horario);
  };

  const editEvent = (event) => {
    setSelectedEvent(events.indexOf(event));
    setSelectedDate(event.data);
    setHorarioSelecionado(event.horario);
    setText(event.sintomas);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }
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
              desabilitarDias(day);
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
              {horarios.map((horario, index) => (
                <TouchableOpacity
                  key={horario}
                  ref={(ref) => (horarioRefs.current[index] = ref)}
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
              <Text>{moment(event.data).format("DD/MM/YYYY")}</Text>
              <Text style={styles.eventDate}>Horário</Text>
              <Text>{event.horario}</Text>
              <Text style={styles.eventText}>Sintomas do pet</Text>
              <Text>{event.sintomas}</Text>
              <Text style={styles.eventText}>Laudo Médico</Text>
              <Text>{event.laudo}</Text>
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
                {event.receituario ? (
                  <TouchableOpacity
                    onPress={() => {
                      const url = event.receituario;
                      Linking.openURL(url);
                    }}
                  >
                    <Text style={styles.actionButton}>Baixar Receituário</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "Sem PDF",
                        "Não há PDF disponível para essa consulta."
                      );
                    }}
                  >
                    <Text style={styles.actionButton}>Baixar Receituário</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </Animatable.View>
      </View>
    </ScrollView>
  );
}
