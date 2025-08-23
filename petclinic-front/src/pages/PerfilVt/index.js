import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import  { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { MaskedTextInput } from "react-native-mask-text";

export default function Perfil() {
  const navigation = useNavigation();
  const { user, setUser, storageUser, signOut } = useContext(AuthContext);
  const [nomeVt, setNomeVt] = useState(user?.nomeVt);
  const [endereco, setEndereco] = useState(user?.endereco);
  const [telefone, setTelefone] = useState(user?.telefone);
  const [cpf, setCPF] = useState(user?.cpf);
  const [crmv, setCRMV] = useState(user?.crmv);
  const [email, setEmail] = useState(user?.email);
  const [imagem, setImagem] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [events, setEvents] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const uid = user.uid;
    if (!uid) {
      return;
    }
    const eventsRef = ref(database, `veterinario/${uid}`);

    get(eventsRef)
      .then((snapshot) => {
        const imageUrl = snapshot.val().imagem;
        console.log(imageUrl);
        setImageUrl(imageUrl);
      })
      .catch((error) => {
        console.log("Erro ao obter imagem:", error);
      });

    return () => {
      // No need to off() for v9+ as it's not a listener
    };
  }, [user]);

  const SalvaAmbos = () => {
    SalvaPerfil();
  };

  //edita o perfil do userVt
  const EditaPerfil = () => {
    // Habilita a edição dos campos de texto
    setEditProfile(true);
  };

  // salva as alterações feitas no perfil Vt
  const SalvaPerfil = async () => {
    const uid = user.uid;

    // Desabilita a edição dos campos de texto
    setEditProfile(false);

  // Atualiza os dados do usuário no backend
    const userRef = ref(database, `veterinario/${uid}`);
    update(userRef, {
      nomeVt: nomeVt,
      endereco: endereco,
      telefone: telefone,
    })
      .then(() => {
        // Atualiza o estado local com os novos dados do usuárioVt
        const updatedUser = {
          ...user,
          nomeVt: nomeVt,
          endereco: endereco,
          telefone: telefone,
        };
        setUser(updatedUser);
        storageUser(updatedUser);
      })
      .catch((error) => {
        console.log("Erro ao atualizar dados do usuário:", error);
      });
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Animatable.View
          animation="fadeInLeft"
          delay={500}
          style={styles.containerHeader}
        >
          <Text style={styles.message}>Perfil do veterinário(a)</Text>
        </Animatable.View>
        <Animatable.View
          animation="fadeInUp"
          style={[styles.containerForm, { flex: 1 }]}
        >
          <TouchableOpacity style={styles.circle} onPress={() => signOut()}>
            <FontAwesome name="sign-in" size={25} color="#FFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Nome</Text>
          <TextInput
            autoCorrect={false}
            value={nomeVt}
            editable={editProfile}
            onChangeText={(value) => setNomeVt(value)}
            style={styles.input}
          />

          <Text style={styles.title}>Endereco</Text>
          <TextInput
            autoCorrect={false}
            value={endereco}
            editable={editProfile}
            onChangeText={(value) => setEndereco(value)}
            style={styles.input}
          />

          <Text style={styles.title}>Telefone</Text>
          <MaskedTextInput
            cursorColor="#38a69d"
            placeholderTextColor="#BDBDBD"
            style={styles.input}
            value={telefone}
            editable={editProfile}
            onChangeText={(text, rawText) => setTelefone(rawText)}
            keyboardType="number-pad"
            mask="(99) 99999-9999"
          />
          <Text style={styles.title}>Email</Text>
          <TextInput
            autoCorrect={false}
            value={email}
            editable={false}
            onChangeText={(value) => setEmail(value)}
            style={styles.input}
          />

          <Text style={styles.title}>CPF</Text>
          <TextInput
            autoCorrect={false}
            value={cpf}
            editable={false}
            onChangeText={(value) => setCPF(value)}
            style={styles.input}
          />

          <Text style={styles.title}>CRMV</Text>
          <TextInput
            autoCorrect={false}
            value={crmv}
            editable={false}
            onChangeText={(value) => setCRMV(value)}
            style={styles.input}
          />

          {editProfile ? (
            <TouchableOpacity style={styles.button} onPress={SalvaAmbos}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={EditaPerfil}>
              <Text style={styles.buttonText}>
                <MaterialCommunityIcons name="pencil" size={15} color="#FFF" />{" "}
                Editar Perfil
              </Text>
            </TouchableOpacity>
          )}
        </Animatable.View>
      </View>
    </ScrollView>
  );
}
