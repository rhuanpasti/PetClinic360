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
  Animated,
  Modal,
  modalVisible,
  Linking,
} from "react-native";
import * as Animatable from "react-native-animatable";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./styles";
import LoadingScreen from "../LoadingScreen";
import * as DocumentPicker from "expo-document-picker";
import { MaterialCommunityIcons, Feather, FontAwesome } from "@expo/vector-icons";
import moment from "moment";

export default function Consulta() {
  const { user: usuario } = useContext(AuthContext);
  const [scheduledAppointments, setScheduledAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isPdfSelected, setIsPdfSelected] = useState(false);
  const [pdfButtonText, setPdfButtonText] = useState("Anexar receiturário");
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [agendamento, setAgendamento] = useState([]);
  const [anamneses, setAnamneses] = useState([]);
  const [anamneseSelecionada, setAnamneseSelecionada] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  ////*********Dados do modal***********/
  const [nomePet, setNomePet] = useState("");
  const [especie, setEspecie] = useState("");
  const [idadePet, setIdadePet] = useState("");
  const [doencas, setDoencas] = useState("");
  const [sistemaDigestorio, setSistemaDigestorio] = useState("");
  const [sistemaUrogenital, setSistemaUrogenital] = useState("");
  const [sistemaCardiorespiratorio, setSistemaCardiorespiratorio] =
    useState("");
  const [sistemaNeurologico, setSistemaNeurologico] = useState("");
  const [sistemaLocomotor, setSistemaLocomotor] = useState("");
  const [pele, setPele] = useState("");
  const [olhos, setOlhos] = useState("");
  const [ouvidos, setOuvidos] = useState("");
  const [ambiente, setAmbiente] = useState("");
  const [contactantes, setContactantes] = useState("");
  const [produtosToxicos, setProdutosToxicos] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [racaoPetiscos, setRacaoPetiscos] = useState("");
  const [alimentacaoNatural, setAlimentacaoNatural] = useState("");
  const [anamneseUserId, setAnamneseUserId] = useState("");
  const [anamnesesLidas, setAnamnesesLidas] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Loading timeout
  }, []);

  const cadastroAnamnese = async () => {
    if (
      !nomePet ||
      !especie ||
      !idadePet ||
      !doencas ||
      !sistemaDigestorio ||
      !sistemaUrogenital ||
      !sistemaCardiorespiratorio ||
      !sistemaNeurologico ||
      !sistemaLocomotor ||
      !pele ||
      !olhos ||
      !ouvidos ||
      !ambiente ||
      !contactantes ||
      !produtosToxicos ||
      !observacoes ||
      !racaoPetiscos ||
      !alimentacaoNatural
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    try {
      await axios.post("http://localhost:3000/anamneses", {
        nomePet,
        especie,
        idadePet,
        doencas,
        sistemaDigestorio,
        sistemaUrogenital,
        sistemaCardiorespiratorio,
        sistemaNeurologico,
        sistemaLocomotor,
        pele,
        olhos,
        ouvidos,
        ambiente,
        contactantes,
        produtosToxicos,
        observacoes,
        racaoPetiscos,
        alimentacaoNatural,
        anamneseUserId,
      });
      setNomePet("");
      setEspecie("");
      setIdadePet("");
      setDoencas("");
      setSistemaDigestorio("");
      setSistemaUrogenital("");
      setSistemaCardiorespiratorio("");
      setSistemaNeurologico("");
      setSistemaLocomotor("");
      setPele("");
      setOlhos("");
      setOuvidos("");
      setAmbiente("");
      setContactantes("");
      setProdutosToxicos("");
      setObservacoes("");
      setRacaoPetiscos("");
      setAlimentacaoNatural("");
      setAnamneseUserId("");
      Alert.alert("Sucesso!", "Anamnese salvo com sucesso");
      setModalVisible(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Erro ao realizar Anamnese");
    }
  };

  useEffect(() => {
    // Fetch anamneses from backend
    axios.get("http://localhost:3000/anamneses")
      .then((response) => {
        setAnamnesesLidas(response.data);
      })
      .catch((e) => {
        setAnamnesesLidas([]);
        console.log(e);
      });
  }, []);

  const windowHeight = useWindowDimensions().height;
  useEffect(() => {
    // Fetch appointments from backend
    axios.get("http://localhost:3000/agendamentos")
      .then((response) => {
        setScheduledAppointments(response.data);
      })
      .catch((e) => {
        setScheduledAppointments([]);
        console.log(e);
      });
  }, []);

  const handleAddLaudo = async () => {
    try {
      await axios.put(`http://localhost:3000/agendamentos/${selectedAppointment.key}/laudo`, {
        laudo: selectedAppointment.laudo,
      });
      setSelectedAppointment(null);
      Alert.alert("Sucesso", "Laudo salvo com sucesso!");
    } catch (e) {
      Alert.alert("Erro", "Erro ao salvar laudo");
      console.log(e);
    }
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
    setPdfButtonText("Anexar receituario");
    setSelectedAppointment({
      ...selectedAppointment,
      pdfUploaded: false,
    });
    try {
      setIsUploadingPdf(true);
      const formData = new FormData();
      formData.append("pdf", {
        uri: selectedPdf.uri,
        name: selectedPdf.name,
        type: "application/pdf",
      });
      await axios.post(
        `http://localhost:3000/agendamentos/${selectedAppointment.key}/receituario`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSelectedAppointment(null);
      Alert.alert("Sucesso", "PDF salvo com sucesso!");
    } catch (e) {
      console.log(e);
      Alert.alert("Erro", "Não foi possível fazer upload do PDF.");
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const renderEvent = (event) => {
    const { data, sintomas, nome, pdfSelected } = event;
    const isLaudoSaved = !!event.laudo;
    const isPdfSaved = !!event.receituario;

    return (
      <View key={event.key} style={[styles.eventContainer]}>
        <View style={styles.iconOn}>
          {isPdfSaved ? (
            <Text style={styles.textReceit}>
              Receituário:{" "}
              <MaterialCommunityIcons
                name="clipboard-check-outline"
                size={26}
                color={"black"}
              />
            </Text>
          ) : (
            <Text style={styles.textReceit}>
              Receituário:{" "}
              <MaterialCommunityIcons
                name="clipboard-off-outline"
                size={25}
                color={"black"}
              />
            </Text>
          )}
        </View>
        <Text style={styles.eventDate}>Dia da Consulta</Text>
        <Text>{moment(event.data).format("DD/MM/YYYY")}</Text>
        <Text style={styles.eventText}>Sintomas</Text>
        <Text>{sintomas}</Text>
        <Text style={styles.eventUserId}>Nome</Text>
        <Text>{nome}</Text>
        <Text style={styles.laudoText}>Laudo do pet</Text>
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
              <Text style={styles.buttonText}>Enviar Receituário</Text>
            )}
          </TouchableOpacity>
        ) : event.receituario ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const url = event.receituario;
              Linking.openURL(url);
            }}
          >
            <Text style={styles.buttonText}>Baixar Receituário</Text>
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
            <Text style={styles.buttonText}>Anexar Receituário</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setModalVisible(true);
            setAnamneseUserId(event.key);
            console.log(anamnesesLidas);

            // Procurar a anamnese pelo ID do usuário
            const anamneseSelecionada = anamnesesLidas.find(
              (anamnese) => anamnese.anamneseUserId === event.key
            );

            // Passar os dados da anamnese selecionada para o state
            setAnamneseSelecionada(anamneseSelecionada);
          }}
        >
          <Text style={styles.buttonText}>Abrir ficha de anamnese</Text>
        </TouchableOpacity>

        <Animated.View>
          <Modal visible={modalVisible} animationType="slide">
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 30, fontWeight: "bold", color: "#38a69d" }}
              >
                Anamnese veterinária
              </Text>
              <Text></Text>
              <ScrollView>
                <Animatable.View animation="fadeInLeft" delay={500}>
                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Nome do animal
                    </Text>
                    <TextInput
                      //placeholder="Digite o nome do animal"
                      onChangeText={setNomePet}
                      value={anamneseSelecionada?.nomePet}
                      style={styles.textoDoModal}
                    />
                    <Text style={{ fontSize: 12 }}>
                      Digite aqui o nome do animal que será cadastrado na ficha
                      veterinária
                    </Text>
                    <Text></Text>
                  </View>
                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Espécie do animal
                    </Text>
                    <TextInput
                      onChangeText={setEspecie}
                      value={anamneseSelecionada?.especie}
                      style={styles.textoDoModal}
                    />

                    <Text></Text>
                  </View>

                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Idade do animal
                    </Text>
                    <TextInput
                      onChangeText={setIdadePet}
                      value={anamneseSelecionada?.idadePet}
                      style={styles.textoDoModal}
                    />

                    <Text></Text>
                  </View>

                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Doenças pregressas ou Doenças presentes
                    </Text>
                    <TextInput
                      onChangeText={setDoencas}
                      value={anamneseSelecionada?.doencas}
                      style={styles.textoDoModal}
                    />
                    <Text style={{ fontSize: 12 }}>Sim ou Não</Text>
                    <Text></Text>
                  </View>

                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Sistema digestório
                    </Text>
                    <TextInput
                      onChangeText={setSistemaDigestorio}
                      value={anamneseSelecionada?.sistemaDigestorio}
                      style={styles.textoDoModal}
                    />
                    <Text style={{ fontSize: 12 }}>
                      Vômito, Regurgitção, Diarréia, Apetite, Ingestão água ou
                      Outros
                    </Text>
                    <Text></Text>
                  </View>

                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Sistema urogenital
                    </Text>
                    <TextInput
                      onChangeText={setSistemaUrogenital}
                      value={anamneseSelecionada?.sistemaUrogenital}
                      style={styles.textoDoModal}
                    />
                    <Text style={{ fontSize: 12 }}>
                      Urina normal, Volume, Dificuldade micção, Secreção
                      Vaginal, Castrado ou Outros
                    </Text>
                    <Text></Text>
                  </View>

                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Sistema cardiorespiratório
                    </Text>
                    <TextInput
                      onChangeText={setSistemaCardiorespiratorio}
                      value={anamneseSelecionada?.sistemaCardiorespiratorio}
                      style={styles.textoDoModal}
                    />
                    <Text style={{ fontSize: 12 }}>
                      Tosse, Cansaço respiratório, Secreção nasal ou Outros
                    </Text>
                    <Text></Text>
                  </View>

                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Sistema neurológico
                    </Text>
                    <TextInput
                      onChangeText={setSistemaNeurologico}
                      value={anamneseSelecionada?.sistemaNeurologico}
                      style={styles.textoDoModal}
                    />
                    <Text style={{ fontSize: 12 }}>
                      Convulsão, Inclinação cabeça, Atoxia ou Outros
                    </Text>
                    <Text></Text>
                  </View>

                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Sistema locomotor
                    </Text>
                    <TextInput
                      onChangeText={setSistemaLocomotor}
                      value={anamneseSelecionada?.sistemaLocomotor}
                      style={styles.textoDoModal}
                    />
                    <Text style={{ fontSize: 12 }}>
                      Dificuldade locomoção, Alterações posturais, Fraturas ou
                      Outros
                    </Text>
                    <Text></Text>
                  </View>

                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Pele
                    </Text>
                    <TextInput
                      onChangeText={setPele}
                      value={anamneseSelecionada?.pele}
                      style={styles.textoDoModal}
                    />
                    <Text style={{ fontSize: 12 }}>
                      Prurido, Ectoparasitas, Queda de pelo, Alopecia ou Outros
                    </Text>
                    <Text></Text>
                  </View>

                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Olhos
                    </Text>
                    <TextInput
                      onChangeText={setOlhos}
                      value={anamneseSelecionada?.olhos}
                      style={styles.textoDoModal}
                    />
                    <Text style={{ fontSize: 12 }}>
                      Secreção ocular, Déficit visual, Prurido ou Outros
                    </Text>
                    <Text></Text>
                  </View>

                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Ouvido
                    </Text>
                    <TextInput
                      onChangeText={setOuvidos}
                      value={anamneseSelecionada?.ouvidos}
                      style={styles.textoDoModal}
                    />
                    <Text style={{ fontSize: 12 }}>
                      Prurido, Secreção ou Outros
                    </Text>
                    <Text></Text>
                  </View>

                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Ambiente
                    </Text>
                    <TextInput
                      onChangeText={setAmbiente}
                      value={anamneseSelecionada?.ambiente}
                      style={styles.textoDoModal}
                    />
                    <Text style={{ fontSize: 12 }}>
                      Rural, Urbano, Acesso à rua ou Outros
                    </Text>
                    <Text></Text>
                  </View>

                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Contactantes
                    </Text>
                    <TextInput
                      onChangeText={setContactantes}
                      value={anamneseSelecionada?.contactantes}
                      style={styles.textoDoModal}
                    />

                    <Text></Text>
                  </View>

                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Produtos Tóxicos
                    </Text>
                    <TextInput
                      onChangeText={setProdutosToxicos}
                      value={anamneseSelecionada?.produtosToxicos}
                      style={styles.textoDoModal}
                    />

                    <Text></Text>
                  </View>

                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Observações
                    </Text>
                    <TextInput
                      onChangeText={setObservacoes}
                      value={anamneseSelecionada?.observacoes}
                      style={styles.textoDoModal}
                    />

                    <Text></Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#38a69d",
                      left: 8,
                    }}
                  >
                    Alimentação
                  </Text>
                  <Text></Text>

                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Ração e petiscos
                    </Text>
                    <TextInput
                      onChangeText={setRacaoPetiscos}
                      value={anamneseSelecionada?.racaoPetiscos}
                      style={styles.textoDoModal}
                    />
                    <Text style={{ fontSize: 12 }}>
                      Ração seca comercial, Ração úmida comercial, Oferece
                      petiscos
                    </Text>
                    <Text></Text>
                  </View>

                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Alimentação natural
                    </Text>
                    <TextInput
                      onChangeText={setAlimentacaoNatural}
                      value={anamneseSelecionada?.alimentacaoNatural}
                      style={styles.textoDoModal}
                    />
                    <Text style={{ fontSize: 12 }}>
                      Crua com ossos, Crua sem ossos, Cozida
                    </Text>
                    <Text></Text>
                  </View>
                </Animatable.View>
                <TouchableOpacity
                  style={styles.buttonModal}
                  onPress={cadastroAnamnese}
                >
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonModal}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <Text></Text>
              </ScrollView>
            </View>
          </Modal>
        </Animated.View>
      </View>
    );
  };
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView style={{ height: windowHeight, backgroundColor: "#FFF" }}>
      <View style={styles.container}>
        <Animatable.View
          animation="fadeInLeft"
          delay={500}
          style={styles.containerHeader}
        >
          <Text style={styles.message}>Consultas</Text>
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
