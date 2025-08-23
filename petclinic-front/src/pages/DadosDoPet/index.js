import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Animated,
  Modal,
  Dimensions,
  Linking,
  Image,
  Alert,
  Platform,
} from "react-native";

import * as Animatable from "react-native-animatable";
import styles from "./styles";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { MaterialCommunityIcons, Feather, FontAwesome } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
// removed expo-permissions (deprecated). Use platform APIs via individual modules as needed
import { KeyboardAvoidingView } from "react-native";

export default function DadosDoPet() {
  const [nome, setNome] = useState("");
  const [raca, setRaca] = useState("");
  const [animal, setAnimal] = useState("");
  const [peso, setPeso] = useState("");
  const [idade, setIdade] = useState("");
  const [eventsPet, setEventsPet] = useState([]);
  const { user: usuario } = useContext(AuthContext);
  const [petName, setPetName] = useState("");
  const [whatsapp, setWhatsapp] = useState(usuario?.whatsapp);
  const [instagram, setInstagram] = useState(usuario?.instagram);
  const [facebook, setFacebook] = useState(usuario?.facebook);
  const [imagem, setImagem] = useState(null);

  useEffect(() => {
    const userRef = ref(database, `user/${usuario.uid}`);
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      setInstagram(userData.instagram);
      setFacebook(userData.facebook);
      setWhatsapp(userData.whatsapp);
    });

    const uid = usuario.uid;
    const eventsRefPet = ref(database, `DadosPet/${uid}`);

    onValue(eventsRefPet, (snapshot) => {
      const eventsPet = [];

      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const nome = childSnapshot.val().nome;
        const raca = childSnapshot.val().raca;
        const peso = childSnapshot.val().peso;
        const idade = childSnapshot.val().idade;
        const animal = childSnapshot.val().animal;
        const imagem = childSnapshot.val().imagem;

        eventsPet.push({
          key: key,
          nome: nome,
          raca: raca,
          peso: peso,
          idade: idade,
          animal: animal,
          imagem: imagem,
        });
      });

      setEventsPet(eventsPet);
    });

    return () => {
      // No need to off() for v9+ as it's not a listener
    };
  }, [usuario]);



  function TesteDLink() {
    const url =
      "https://www.youtube.com/watch?v=0Uk-gytGg94&ab_channel=SkullMemeProductions";
    Linking.openURL(url);
  }
  function Teste() {
    alert("Okey");
  }

  const saveImage = async () => {
    console.log(instagram);
    console.log(facebook);
    console.log(whatsapp);
    // Get the URI of the QR code image

    const imageUrl = `https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=https://didyoufindmypet.firebaseapp.com/home?${
      petName != ""
        ? "petName=" + encodeURIComponent(petName)
        : "petName=" + encodeURIComponent("Não possui")
    }+${"Dono=" + usuario.nome}${
      instagram
        ? "insta=" + encodeURIComponent(instagram)
        : "insta=" + encodeURIComponent("Não possui")
    }+${
      facebook
        ? "face=" + encodeURIComponent(facebook)
        : "face=" + encodeURIComponent("Não possui")
    }+${whatsapp ? "whats=" + whatsapp : "whats=" + usuario.telefone}`;

    try {
      if (Platform.OS === "android") {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Erro",
            "Só é possível salvar as imagens caso o usuário aceite as permissões."
          );
          console.log("Permission denied");
          return;
        }
      }

      const { uri } = await FileSystem.downloadAsync(
        imageUrl,
        FileSystem.documentDirectory + "qr.png"
      );
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Sucesso", "O QR code foi salvo na sua galeria!!");
    } catch (error) {
      Alert.alert(
        "",
        "Ups, algo deu errado. Verifique se foram dadas as permissões requeridas."
      );
    }
  };

  const [pop, setPop] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  const { width, height } = Dimensions.get("window"); // obtem as dimensões da tela do dispositivo

  const handleSharePress = () => {
    setModalVisible(true);
  };

  const handlePress = () => {
    handleSharePress();
    cadastroPet();
  };

  const selectImage = async () => {
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (resultado && resultado.assets && resultado.assets.length > 0 && !resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    } else if (resultado && resultado.uri && resultado.cancelled === false) {
      setImagem(resultado.uri);
    }
  };

  const saveImageToFirebase = async (userId, image) => {
    const response = await fetch(image);
    const blob = await response.blob();

    return blob;
  };

  const cadastroPet = async () => {
    const uid = usuario.uid;
    if (!nome || !raca || !animal || !peso || !idade || !imagem) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    try {
  
      const imageUrl = imagem;
      // Salvar dados do animal de estimação no Realtime Database (v9 modular used elsewhere)
      const newRef = push(ref(database, `DadosPet/${uid}`));
      await set(newRef, {
        nome: nome,
        raca: raca,
        peso: peso,
        idade: idade,
        animal: animal,
        imagem: imageUrl, // Adicionar URL da imagem aos dados do pet
      });
      setNome("");
      setRaca("");
      setIdade("");
      setAnimal("");
      setPeso("");
      setImagem(null); // Limpar imagem depois de salvar
      Alert.alert("Sucesso!", "Pet cadastrado com sucesso!");
      setModalVisible(false);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Vixi",
        "Erro ao realizar cadastro, tente novamente mais tarde."
      );
    }
  };

  const popIn = () => {
    setPop(true);
  };

  const popOut = () => {
    setPop(false);
  };

  const deleteEvent = (event) => {
    const uid = usuario.uid;
    const eventKey = event.key;
    remove(ref(database, `DadosPet/${uid}/${eventKey}`));
  };

  const openQr = (nomePet) => {
    console.log("Linha 193 " + nomePet);
    setPetName(nomePet);
    console.log("Linha 195" + petName);
    setQrVisible(true);
  };
  const windowHeight = useWindowDimensions().height;

  return (
    <View style={[styles.container]}>
      <ScrollView>
        <Animatable.View
          animation="fadeInLeft"
          delay={500}
          style={styles.containerHeader}
        >
          <Text style={styles.message}>Cadastre seu pet</Text>
        </Animatable.View>
        <Animatable.View
          animation="fadeInUp"
          style={[
            styles.containerForm,
            eventsPet.length <= 1
              ? { height: windowHeight }
              : { height: "100%" },
          ]}
        >
          <Animatable.View
            animation="fadeInLeft"
            delay={1000}
            style={styles.containerHeader2}
          >
            <Text style={styles.eventDate}>
              "𝙋𝙖𝙧𝙖 𝙖𝙥𝙧𝙚𝙨𝙚𝙣𝙩𝙖𝙧 𝙢𝙖𝙞𝙨 𝙞𝙣𝙛𝙤𝙧𝙢𝙖𝙘̧𝙤̃𝙚𝙨 𝙦𝙪𝙚 𝙥𝙤𝙙𝙚𝙢
            </Text>
            <Text style={styles.eventDate}>
              𝙖𝙟𝙪𝙙𝙖𝙧 𝙣𝙤 𝙧𝙚𝙨𝙜𝙖𝙩𝙚 𝙙𝙤 𝙨𝙚𝙪 𝙥𝙚𝙩, 𝙥𝙧𝙚𝙚𝙣𝙘𝙝a 𝙢𝙖𝙞𝙨{" "}
            </Text>
            <Text style={styles.eventDate}>
              𝙙𝙖𝙙𝙤𝙨 𝙣𝙖 𝙖𝙧𝙚𝙖 𝙙𝙚 "𝙋𝙚𝙩 𝙁𝙞𝙣𝙙𝙚𝙧 𝙙𝙤 𝙨𝙚𝙪 𝙥𝙚𝙧𝙛𝙞𝙡"
            </Text>
            <Text style={styles.eventDate}>𝕊𝕖𝕦 "ℙ𝕖𝕥" 𝕖𝕞 𝕡𝕣𝕚𝕞𝕖𝕚𝕣𝕠 𝕝𝕦𝕘𝕒𝕣</Text>
          </Animatable.View>
          {
            (console.log(eventsPet),
            eventsPet.map((event) => (
              <View
                style={styles.eventContainer}
                key={
                  event.nome
                } /* Para evitar o erro "Cada child em uma lista deve ter uma prop "chave" única", 
                você precisa adicionar uma propriedade "key" única para cada elemento do array retornado pelo método "map()".*/
              >
                <View style={styles.imageContainer}>
                  <Image source={{ uri: event.imagem }} style={styles.image} />
                </View>
                <Text style={styles.eventDate}>Nome do pet</Text>
                <Text>{event.nome}</Text>
                <Text style={styles.eventDate}>Raça</Text>
                <Text>{event.raca}</Text>
                <Text style={styles.eventDate}>Peso</Text>
                <Text>{event.peso}</Text>
                <Text style={styles.eventDate}>Que animal você tem ?</Text>
                <Text>{event.animal}</Text>
                <Text style={styles.eventDate}>Idade</Text>
                <Text>{event.idade}</Text>

                <View style={styles.eventActions}>
                  <TouchableOpacity onPress={() => deleteEvent(event)}>
                    <Text style={styles.actionButton2}>Deletar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openQr(event.nome)}>
                    <Text style={styles.actionButton}>
                      <MaterialCommunityIcons
                        name="qrcode"
                        style={styles.title2}
                      />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )))
          }

          <View
            style={{
              flex: 1,
            }}
          >
            <Animated.View>
              <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide" // adiciona uma animação de slide ao Modal
              >
                <KeyboardAvoidingView
                  behavior="padding"
                  style={[
                    styles.modalContainer,
                    { width: width * 1, height: height * 1 },
                  ]}
                >
                  <Animatable.View
                    animation="fadeInLeft"
                    delay={500}
                    style={styles.containerHeader3}
                  >
                    <TouchableOpacity onPress={selectImage}>
                      {imagem ? (
                        <Image
                          source={{ uri: imagem }}
                          style={styles.imagemPerfil}
                        />
                      ) : (
                        <View style={styles.iconePerfil}>
                          <Feather name="camera" size={24} color="black" />
                        </View>
                      )}
                    </TouchableOpacity>
                    <Text style={styles.title}>Nome do Pet</Text>
                    <TextInput
                      //placeholder="Nome"
                      autoCorrect={false}
                      autoCapitalize="none"
                      value={nome}
                      onChangeText={(text) => setNome(text)}
                      style={styles.input2}
                    />
                    <Text style={styles.title}>Raça</Text>
                    <TextInput
                      //placeholder="Nome"
                      autoCorrect={false}
                      autoCapitalize="none"
                      value={raca}
                      onChangeText={(text) => setRaca(text)}
                      style={styles.input2}
                    />
                    <Text style={styles.title}>Peso</Text>
                    <TextInput
                      //placeholder="Nome"
                      autoCorrect={false}
                      autoCapitalize="none"
                      keyboardType="number-pad"
                      value={peso}
                      onChangeText={(text) => setPeso(text)}
                      style={styles.input2}
                    />
                    <Text style={styles.title}>
                      Qual seu animal de estimação
                    </Text>
                    <TextInput
                      //placeholder="Nome"
                      autoCorrect={false}
                      autoCapitalize="none"
                      value={animal}
                      onChangeText={(text) => setAnimal(text)}
                      style={styles.input2}
                    />
                    <Text style={styles.title}>Idade</Text>
                    <TextInput
                      //placeholder="Nome"
                      autoCorrect={false}
                      autoCapitalize="none"
                      keyboardType="number-pad"
                      value={idade}
                      onChangeText={(text) => setIdade(text)}
                      style={styles.input2}
                    />
                  </Animatable.View>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handlePress()}
                  >
                    <Text style={styles.buttonText}>Salvar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              </Modal>
            </Animated.View>
          </View>

          <View
            style={{
              flex: 2,
            }}
          >
            <Animated.View>
              <Modal
                visible={qrVisible}
                transparent={true}
                animationType="slide" // adiciona uma animação de slide ao Modal
              >
                <View
                  style={[
                    styles.modalContainer,
                    {
                      width: width * 1,
                      height: height * 0.94,
                      marginTop: "0%",
                    },
                  ]}
                >
                  <ScrollView>
                    <Animatable.View
                      animation="fadeInLeft"
                      delay={500}
                      style={styles.containerHeader3}
                    >
                      <Text
                        style={[
                          styles.message,
                          { color: "black", marginTop: 25, color: "#38a69d" },
                        ]}
                      >
                        QR code - Pet finder
                      </Text>
                      <Animatable.View
                        animation="fadeInLeft"
                        delay={1000}
                        style={styles.containerHeader2}
                      >
                        <Text style={styles.eventDate}>
                          "𝙋𝙖𝙧𝙖 𝙖𝙥𝙧𝙚𝙨𝙚𝙣𝙩𝙖𝙧 𝙢𝙖𝙞𝙨 𝙞𝙣𝙛𝙤𝙧𝙢𝙖𝙘̧𝙤̃𝙚𝙨 𝙦𝙪𝙚 𝙥𝙤𝙙𝙚𝙢
                        </Text>
                        <Text style={styles.eventDate}>
                          𝙖𝙟𝙪𝙙𝙖𝙧 𝙣𝙤 𝙧𝙚𝙨𝙜𝙖𝙩𝙚 𝙙𝙤 𝙨𝙚𝙪 𝙥𝙚𝙩, 𝙥𝙧𝙚𝙚𝙣𝙘𝙝a 𝙢𝙖𝙞𝙨{" "}
                        </Text>
                        <Text style={styles.eventDate}>
                          𝙙𝙖𝙙𝙤𝙨 𝙣𝙖 𝙖𝙧𝙚𝙖 𝙙𝙚 "𝙋𝙚𝙩 𝙁𝙞𝙣𝙙𝙚𝙧 𝙙𝙤 𝙨𝙚𝙪 𝙥𝙚𝙧𝙛𝙞𝙡"
                        </Text>
                      </Animatable.View>
                      <Image
                        style={[styles.logo, { marginTop: "10%" }]}
                        source={{
                          uri: `https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=https://didyoufindmypet.firebaseapp.com/home?${
                            petName != ""
                              ? "petName=" + encodeURIComponent(petName)
                              : "petName=" + encodeURIComponent("Não possui")
                          }+${"Dono=" + usuario.nome}${
                            instagram
                              ? "insta=" + encodeURIComponent(instagram)
                              : "insta=" + encodeURIComponent("Não possui")
                          }+${
                            facebook
                              ? "face=" + encodeURIComponent(facebook)
                              : "face=" + encodeURIComponent("Não possui")
                          }+${
                            whatsapp
                              ? "whats=" + whatsapp
                              : "whats=" + usuario.telefone
                          }`,
                        }}
                      />
                    </Animatable.View>
                  </ScrollView>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => saveImage()}
                  >
                    <Text style={styles.buttonText}>Salvar QR code</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setQrVisible(false)}
                  >
                    <Text style={styles.buttonText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </Animated.View>
          </View>
        </Animatable.View>
      </ScrollView>
      <TouchableOpacity style={styles.circle} onPress={handleSharePress}>
        <FontAwesome name="plus" size={25} color="#FFFF" />
      </TouchableOpacity>
    </View>
  );
}
