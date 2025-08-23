import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./styles";
import * as DocumentPicker from "expo-document-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";

export default function ExamesVt() {
  const { user: usuario } = useContext(AuthContext);
  const [scheduledAppointments, setScheduledAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isPdfSelected, setIsPdfSelected] = useState(false);
  const [pdfButtonText, setPdfButtonText] = useState("Anexar exame");
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [agendamento, setAgendamento] = useState([]);
  const [anamneses, setAnamneses] = useState([]);
  const [anamneseSelecionada, setAnamneseSelecionada] = useState(null);
  const [tipoExame, setTipoExame] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const windowHeight = useWindowDimensions().height;

  useEffect(() => {
    const eventsRef = ref(database, "exames");
    onValue(eventsRef, (snapshot) => {
      if (snapshot.val()) {
        const appointments = [];
        const userIdToNameMap = {}; // objeto para armazenar nomes de usuário
        const promises = [];
        try {
          Object.entries(snapshot.val()).forEach(([uid, userAppointments]) => {
            // obter o nome do usuário do banco de dados
            promises.push(
              get(ref(database, `user/${uid}/nome`))
            );
            Object.entries(userAppointments).forEach(
              ([appointmentId, appointment]) => {
                console.log("Appointment:", appointment);
                appointments.push({
                  key: appointmentId,
                  data: appointment.data,
                  laudo: appointment.laudo || "",
                  pdfExame: appointment.pdfExame || "",
                  userId: uid,
                  tipoExame: appointment.tipoExame,
                });
              }
            );
          });
        } catch (e) {
          console.log(e);
        }
        Promise.all(promises).then((snapshots) => {
          snapshots.forEach((userSnapshot) => {
            const userId = userSnapshot.ref.parent.key;
            const userName = userSnapshot.val(); // obter o nome do usuário
            console.log("Nome do usuário:", userName);
            userIdToNameMap[userId] = userName; //adicionar nome de usuário ao mapa
          });
          try {
            const appointmentsWithNames = appointments.map((appointment) => {
              const userName = userIdToNameMap[appointment.userId];
              return {
                ...appointment,
                nome: userName, // adicionar o nome do usuário ao compromisso
              };
            });
            setScheduledAppointments(appointmentsWithNames);
          } catch (e) {
            console.log(e);
          }
        });
      } else {
        try {
          setScheduledAppointments([]);
        } catch (e) {
          console.log(e);
        }
      }
    });

    return () => {
      // No need to off() for v9+ as it's not a listener
    };
  }, []);

  const handleAddLaudo = () => {
    update(
      ref(database, `exames/${selectedAppointment.userId}/${selectedAppointment.key}`),
      { laudo: selectedAppointment.laudo }
    ).then(() => {
      setSelectedAppointment(null);
    });
  };

  //############## PDF ##############################

  const handleSelectPdf = async (event) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: false,
      });

      if (result.type === "success") {
        setSelectedPdf(result);
        setIsPdfSelected(true);
        setPdfButtonText("PDF selecionado");

        // Define o agendamento selecionado como o evento passado
        setSelectedAppointment(event);

        // Atualiza a propriedade pdfSelected do evento selecionado
        const updatedAgendamento = agendamento.map((item) => {
          if (item.key === event.key) {
            return {
              ...item,
              pdfSelected: true,
            };
          }
          return item;
        });
        setAgendamento(updatedAgendamento);
      }
    } catch (err) {
      console.log("Erro ao selecionar o PDF", err);
    }
  };

  const handleUploadPdf = async () => {
    if (!selectedPdf) {
      Alert.alert("Erro", "Selecione um arquivo PDF.");
      return;
    }
    setIsPdfSelected(false);
    setPdfButtonText("Anexar Exame");
    setSelectedAppointment({
      ...selectedAppointment,
      pdfUploaded: false,
    });
    try {
      setIsUploadingPdf(true); // Ativa o indicador de carregamento

      const response = await fetch(selectedPdf.uri);
      const blob = await response.blob();
      const fileName = selectedPdf.name;
      const fileRef = storageRef(storage, `pdfsExames/${fileName}`);
      const snapshot = await uploadBytes(fileRef, blob);
      const downloadUrl = await getDownloadURL(fileRef);
      update(
        ref(database, `exames/${selectedAppointment.userId}/${selectedAppointment.key}`),
        { pdfExame: downloadUrl }
      ).then(() => {
        setSelectedAppointment(null);
        Alert.alert("Sucesso", "PDF salvo com sucesso!");
      });
    } catch (e) {
      console.log(e);
      Alert.alert("Erro", "Não foi possível fazer upload do PDF.");
    } finally {
      setIsUploadingPdf(false); // Desativa o indicador de carregamento
    }
  };

  const renderEvent = (event) => {
    const { pdfSelected } = event;
    const isLaudoSaved = !!event.laudo;
    const isPdfSaved = !!event.pdfExame;

    return (
      <View key={event.key} style={[styles.eventContainer]}>
        <View style={styles.iconOn}>
          {isPdfSaved ? (
            <Text style={styles.textReceit}>
              Exame:{" "}
              <MaterialCommunityIcons
                name="clipboard-check-outline"
                size={26}
                color={"black"}
              />
            </Text>
          ) : (
            <Text style={styles.textReceit}>
              Exame:{" "}
              <MaterialCommunityIcons
                name="clipboard-off-outline"
                size={25}
                color={"black"}
              />
            </Text>
          )}
        </View>

        <Text style={styles.eventDate}>Dia do exame</Text>
        <Text>{moment(event.data).format("DD/MM/YYYY")}</Text>
        <Text style={styles.eventText}>Exame agendado</Text>
        <Text>{event.tipoExame}</Text>
        <Text style={styles.eventUserId}>Nome</Text>
        <Text>{event.nome}</Text>
        <Text style={styles.laudoText}>Laudo do exame</Text>
        <Text>{event.laudo}</Text>
        {usuario.crmv && selectedAppointment?.key === event.key ? (
          <View style={styles.laudoContainer}>
            <TextInput
              placeholder="Adicionar laudo"
              style={styles.laudoInput}
              value={selectedAppointment.laudo}
              onChangeText={(text) =>
                setSelectedAppointment({
                  ...selectedAppointment,
                  laudo: text,
                })
              }
            />
            <TouchableOpacity style={styles.button} onPress={handleAddLaudo}>
              <Text style={styles.buttonText}>Salvar laudo</Text>
            </TouchableOpacity>
          </View>
        ) : usuario.crmv && isLaudoSaved ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setSelectedAppointment(event)}
          >
            <Text style={styles.buttonText}>Editar Laudo</Text>
          </TouchableOpacity>
        ) : usuario.crmv ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setSelectedAppointment(event)}
          >
            <Text style={styles.buttonText}>Adicionar Laudo</Text>
          </TouchableOpacity>
        ) : null}
        {selectedAppointment?.key === event.key ? (
          <TouchableOpacity style={styles.button} onPress={handleUploadPdf}>
            {isUploadingPdf ? (
              <ActivityIndicator color="#FFF" /> // Indicador de carregamento
            ) : (
              <Text style={styles.buttonText}>Enviar Resultado</Text>
            )}
          </TouchableOpacity>
        ) : event.pdfExame ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const url = event.pdfExame;
              Linking.openURL(url);
            }}
          >
            <Text style={styles.buttonText}>Baixar Exame</Text>
          </TouchableOpacity>
        ) : pdfSelected ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setSelectedAppointment(event)}
          >
            <Text style={styles.buttonText}>PDF Anexado</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSelectPdf(event)}
          >
            <Text style={styles.buttonText}>Anexar Resultado do Exame</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={{ height: windowHeight, backgroundColor: "#FFF" }}>
      <View style={styles.container}>
        <Animatable.View
          animation="fadeInLeft"
          delay={500}
          style={styles.containerHeader}
        >
          <Text style={styles.message}>Exame</Text>
        </Animatable.View>
        <Animatable.View animation="fadeInUp" style={[styles.containerForm]}>
          <View style={styles.eventsList}>
            {scheduledAppointments.map((event) => renderEvent(event))}
          </View>
        </Animatable.View>
      </View>
    </ScrollView>
  );
}
