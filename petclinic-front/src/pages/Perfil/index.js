import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { MaskedTextInput } from "react-native-mask-text";

export default function Perfil() {
  const navigation = useNavigation();
  const { user, setUser, storageUser, signOut } = useContext(AuthContext);
  const [nome, setNome] = useState(user?.nome);
  const [endereco, setEndereco] = useState(user?.endereco);
  const [telefone, setTelefone] = useState(user?.telefone);
  const [editRede, setEditRede] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp);
  const [instagram, setInstagram] = useState(user?.instagram);
  const [facebook, setFacebook] = useState(user?.facebook);

  const EditaPerfil = () => {
    // Habilita a edição dos campos de texto
    setEditProfile(true);
  };

  const SalvaPerfil = () => {
    // Desabilita a edição dos campos de texto
    setEditProfile(false);

  // Atualiza os dados do usuário no backend
    const userRef = ref(database, `user/${user.uid}`);
    update(userRef, {
      nome: nome,
      endereco: endereco,
      telefone: telefone,
    })
      .then(() => {
        // Atualiza o estado local com os novos dados do usuário
        const updatedUser = {
          ...user,
          nome: nome,
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

  //edita as redes sociais
  const EditaRede = () => {
    setEditRede(true);
  };

  // recupera as rede sociais salvas no backend
  useEffect(() => {
    const userRef = ref(database, `user/${user.uid}`);
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      setInstagram(userData.instagram);
      setFacebook(userData.facebook);
      setWhatsapp(userData.whatsapp);
    });

    return () => {
      // No need to off() for v9+ as it's not a listener
    };
  }, []);

  //salva as alterções feitas nas redes sociais
  const SalvaRede = () => {
    setEditRede(false);

    const userRef = ref(database, `user/${user.uid}`);
    update(userRef, {
      instagram: instagram || "",
      facebook: facebook || "",
      whatsapp: whatsapp || "",
    })
      .then(() => {
        const updatedUser = {
          ...user,
          instagram: instagram || "",
          facebook: facebook || "",
          whatsapp: whatsapp || "",
        };
        setUser(updatedUser);
        storageUser(updatedUser);
      })
      .catch((error) => {
        console.log("Erro ao atualizar dados do usuário:", error);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Animatable.View
          animation="fadeInLeft"
          delay={500}
          style={styles.containerHeader}
        >
          <Text style={styles.message}>Perfil do usuario(a)</Text>
        </Animatable.View>
        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
          <TouchableOpacity style={styles.circle} onPress={() => signOut()}>
            <FontAwesome name="sign-in" size={25} color="#FFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Nome</Text>
          <TextInput
            autoCorrect={false}
            value={nome}
            editable={editProfile}
            onChangeText={(value) => setNome(value)}
            style={styles.input}
          />

          <Text style={styles.title}>Endereço</Text>
          <TextInput
            autoCorrect={false}
            value={endereco}
            editable={editProfile}
            onChangeText={(value) => setEndereco(value)}
            style={styles.input}
          />

          <Text style={styles.title}>Telefone</Text>
          <MaskedTextInput
            autoCorrect={false}
            value={telefone}
            editable={editProfile}
            onChangeText={(text, rawText) => setTelefone(rawText)}
            style={styles.input}
            keyboardType="number-pad"
            mask="(99) 99999-9999"
          />

          <Text style={styles.title}>Email</Text>
          <TextInput
            autoCorrect={false}
            value={user?.email}
            editable={false}
            style={styles.input}
          />

          <Text style={styles.title}>CPF</Text>
          <TextInput
            autoCorrect={false}
            value={user?.cpf}
            editable={false}
            style={styles.input}
          />
          {editProfile ? (
            <TouchableOpacity style={styles.button} onPress={SalvaPerfil}>
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
          <View style={styles.separator} />
          <Text style={styles.titlefinder}>Informações para o Pet Finder</Text>
          <Text style={styles.title}>
            {" "}
            {
              <MaterialCommunityIcons name="whatsapp" style={styles.title} />
            }{" "}
            Whatsapp
          </Text>

          <MaskedTextInput
            autoCorrect={false}
            value={whatsapp}
            editable={editRede}
            onChangeText={(text, rawText) => setWhatsapp(rawText)}
            style={styles.input}
            keyboardType="number-pad"
            mask="(99) 99999-9999"
          />
          <Text style={styles.title}>
            {<MaterialCommunityIcons name="instagram" style={styles.title} />}{" "}
            Instagram
          </Text>
          <TextInput
            cursorColor="#38a69d"
            placeholderTextColor="#BDBDBD"
            onChangeText={(value) => setInstagram(value)}
            autoCorrect={false}
            value={instagram}
            editable={editRede}
            keyboardType="email-address"
            style={styles.input}
          />
          <Text style={styles.title}>
            {" "}
            {
              <MaterialCommunityIcons name="facebook" style={styles.title} />
            }{" "}
            Facebook
          </Text>
          <TextInput
            cursorColor="#38a69d"
            placeholderTextColor="#BDBDBD"
            onChangeText={(value) => setFacebook(value)}
            autoCorrect={false}
            value={facebook}
            editable={editRede}
            keyboardType="email-address"
            style={styles.input}
          />

          {editRede ? (
            <TouchableOpacity style={styles.button} onPress={SalvaRede}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={EditaRede}>
              <Text style={styles.buttonText}>
                <MaterialCommunityIcons name="pencil" size={15} color="#FFF" />{" "}
                Editar Redes Sociais
              </Text>
            </TouchableOpacity>
          )}
        </Animatable.View>
      </ScrollView>
    </View>
  );
}
