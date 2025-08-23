import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import React, { useState, useContext, useEffect, useRef } from "react";
import * as Animatable from "react-native-animatable";
import { Calendar } from "react-native-calendars";
import { LocaleConfig } from "react-native-calendars";
import styles from "./styles";
import { AuthContext } from "../../contexts/AuthContext";
import moment from "moment";
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
  const [selectedDate, setSelectedDate] = useState([]);
  const [events, setEvents] = useState([]);
  const [agendaClinica, setAgendaClinica] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [date, setDate] = useState("");
  const promises = [];
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [selecionouUmDia, setselecionouUmDia] = useState(false);
  const [estaCarregando, setEstaCarregando] = useState(false);
  const [examesAtivo, setExamesAtivo] = useState(true);
  const [horarioDisponivel, setHorarioDisponivel] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [tipoExame, setTipoExame] = useState("");
  const { user: usuario } = useContext(AuthContext);
  const [agendamentoAtivo, setAgendamentoAtivo] = useState(true);
  
  useEffect(() => {
    const uid = usuario.uid;
    const eventsRef = ref(database, `exames/${uid}`);

    onValue(eventsRef, (snapshot) => {
      const events = [];
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const data = childSnapshot.val().data;
        const horarioSelecionado = childSnapshot.val().horario;
        const laudo = childSnapshot.val().laudo;
        const pdfExame = childSnapshot.val().pdfExame;
        const tipoExame = childSnapshot.val().tipoExame;

        events.push({
          key: key,
          data: data,
          horario: horarioSelecionado,
          laudo: laudo,
          pdfExame: pdfExame,
          tipoExame: tipoExame,
        });
      });

      setEvents(events);
    });

    const agendaClinicaRef = ref(database, "agenda-clinica-exames");

    onValue(agendaClinicaRef, (snapshot) => {
      const agendaClinica = [];
      snapshot.forEach((dateSnapshot) => {
        const date = dateSnapshot.key;
        dateSnapshot.forEach((timeSnapshot) => {
          const time = timeSnapshot.key;
          timeSnapshot.forEach((idSnapshot) => {
            const id = idSnapshot.key;
            const laudo = idSnapshot.child("laudo").val();
            const pdfExame = idSnapshot.child("exames").val();
            const tipoExame = idSnapshot.child("exames").val();

            agendaClinica.push({
              data: date,
              horario: time,
              id: id,
              laudo: laudo,
              pdfExame: pdfExame,
              tipoExame: tipoExame,
            });
          });
        });
      });
      setAgendaClinica(agendaClinica);
    });

    return () => {
      // No off() needed for v9+ modular imports
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
    if (Picker == null || Picker == "") {
      Alert.alert("Por favor", "Escolha um exame", [
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
      const newExamRef = push(ref(database, `exames/${uid}`));
      await set(newExamRef, {
        data: selectedDate,
        horario: horarioSelecionado,
        tipoExame: selectedValue,
        nome: usuario.nome, // add the user name here
      });
      setSelectedDate("");
      setSelectedValue("");
      setHorarioSelecionado("");
      setselecionouUmDia(false);
      createAgendaClinicaTable();
      Alert.alert("Sucesso!", "Exame marcado com sucesso!");
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
      const agendaClinicaRef = ref(database, "agenda-clinica-exames");
      const eventsRef = ref(database, "exames");
             const snapshot = await get(eventsRef);
      const appointments = snapshot.val();

      Object.entries(appointments).forEach(([uid, userAppointments]) => {
        Object.entries(userAppointments).forEach(
          ([appointmentId, appointment]) => {
            const { data, horario, tipoExame } = appointment;
            const appointmentRef = ref(database, `agenda-clinica-exames/${data}/${horario}/${uid}/${appointmentId}`);
            set(appointmentRef, { tipoExame });
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
    remove(ref(database, `exames/${uid}/${eventKey}`));
    deleteEventClinica(event);
  };

  const deleteEventClinica = (event) => {
    const uid = usuario.uid;
    const key = event.key;
    const data = event.data;
    const horario = event.horario;
    remove(ref(database, `exames/${uid}/${key}`))
      .then(() => {
        remove(ref(database, `agenda-clinica-exames/${data}/${horario}/${uid}/${key}`));
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
    if (selectedDate == null || selectedDate === "") {
      Alert.alert("Aviso!", "Nenhuma data selecionada", [
        {
          text: "OK",
          onPress: () => {},
        },
      ]);

      return;
    }
    if (selectedValue == null || selectedValue === "") {
      Alert.alert("Por favor", "Escolha um exame", [
        {
          text: "OK",
          onPress: () => {},
        },
      ]);
      return;
    }
    if (horarioSelecionado == null || horarioSelecionado === "") {
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
    update(ref(database, `exames/${uid}/${eventKey}`), {
      data: selectedDate,
      horario: horarioSelecionado,
      tipoExame: selectedValue,
    });

    setSelectedEvent(null);
    setHorarioSelecionado(null);
    setSelectedValue("");
    setSelectedDate("");
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
    setSelectedValue(event.tipoExame);
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Animatable.View
          animation="fadeInLeft"
          delay={500}
          style={styles.containerHeader}
        >
          <Text style={styles.message}>Agendamento de exames</Text>
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

          <Text style={styles.title}>Qual será o exame:</Text>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedValue(itemValue)
            }
            enabled={selectedDate !== null && horarioSelecionado !== null}
            style={{
              opacity:
                selectedDate !== null && horarioSelecionado !== null ? 1 : 0.5,
            }}
          >
            <Picker.Item
              label="Selecione um exame"
              value="Selecione um exame"
            />
            <Picker.Item
              label="Hemograma completo"
              value="Hemograma completo"
            />
            <Picker.Item label="Exame de urina" value="Exame de urina" />
            <Picker.Item label="Exame de fezes" value="Exame de fezes" />
            <Picker.Item label="Radiografia" value="Radiografia" />
            <Picker.Item label="Ultrassonografia" value="Ultrassonografia" />
            <Picker.Item label="Eletrocardiograma" value="Eletrocardiograma" />
            <Picker.Item
              label="Exame de sangue para doenças infecciosas"
              value="Exame de sangue para doenças infecciosas"
            />
            <Picker.Item
              label="Exame sorológico para detecção de anticorpos"
              value="Exame sorológico para detecção de anticorpos"
            />
            <Picker.Item
              label="Teste de função renal"
              value="Teste de função renal"
            />
            <Picker.Item
              label="Teste de função hepática"
              value="Teste de função hepática"
            />
            <Picker.Item
              label="Teste de função tireoidiana"
              value="Teste de função tireoidiana"
            />
            <Picker.Item label="Biópsia" value="Biópsia" />
            <Picker.Item label="Citologia" value="Citologia" />
            <Picker.Item label="Endoscopia" value="Endoscopia" />
            <Picker.Item
              label="Cultura bacteriana"
              value="Cultura bacteriana"
            />
          </Picker>

          {selectedEvent === null ? (
            <TouchableOpacity style={styles.button} onPress={agendar}>
              <Text style={styles.buttonText}>Agendar exame</Text>
            </TouchableOpacity>
          ) : (
            <View>
              <TouchableOpacity style={styles.button} onPress={updateEvent}>
                <Text style={styles.buttonText}>Atualizar exame</Text>
              </TouchableOpacity>
            </View>
          )}

          {events.map(
            (event) => (
              console.log(event.tipoExame),
              (
                <View key={event.key} style={styles.eventContainer}>
                  <Text style={styles.eventDate}>Dia do exame</Text>
                  <Text>{moment(event.data).format("DD/MM/YYYY")}</Text>
                  <Text style={styles.eventDate}>Horário do exame</Text>
                  <Text>{event.horario}</Text>
                  <Text style={styles.eventText}>Tipo do exame</Text>
                  <Text>{event.tipoExame}</Text>
                  <Text style={styles.eventText}>Laudo do exame</Text>
                  <Text>{event.laudo}</Text>
                  <Text style={styles.eventText}>Resultado do exame</Text>
                  <View style={styles.iconPdf}>
                    {event.pdfExame ? (
                      <View style={styles.iconn}>
                        <Icon name="file-pdf-box" size={36} color="#333" />
                      </View>
                    ) : (
                      <View style={styles.iconn}>
                        <Icon name="block-helper" size={26} color="#333" />
                      </View>
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
                    {event.pdfExame ? (
                      <TouchableOpacity
                        onPress={() => {
                          const url = event.pdfExame;
                          Linking.openURL(url);
                        }}
                      >
                        <Text style={styles.actionButton}>
                          Baixar Resultado
                        </Text>
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
                        <Text style={styles.actionButton}>
                          Baixar Resultado
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )
            )
          )}
        </Animatable.View>
      </View>
    </ScrollView>
  );
}
