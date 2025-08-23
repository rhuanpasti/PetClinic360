import { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./styles";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Veterinarios() {
  const [veterinarios, setVeterinarios] = useState([]);
  const [selectedVeterinario, setSelectedVeterinario] = useState(null);
  const { signOut } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const windowHeight = useWindowDimensions().height;
  
  useEffect(() => {
    const veterinariosRef = ref(database, "veterinario");
    onValue(veterinariosRef, (snapshot) => {
      if (snapshot.val()) {
        const veterinarios = [];
        try {
          Object.entries(snapshot.val()).forEach(
            ([veterinarioId, veterinario]) => {
              veterinarios.push({
                key: veterinarioId,
                nome: veterinario.nomeVt,
                crmv: veterinario.crmv,
                email: veterinario.email,
              });
            }
          );
        } catch (e) {
          console.log(e);
        }
        try {
          setVeterinarios(veterinarios);
        } catch (e) {
          console.log(e);
        }
      } else {
        try {
          setVeterinarios([]);
        } catch (e) {
          console.log(e);
        }
      }
    });

    return () => {
      // No need to off() for v9+ as it's not a listener
    };
  }, []);

  const excluirConta = (veterinario) => {
    // Use o componente Alert para perguntar ao usuário se ele realmente deseja excluir a conta
    Alert.alert("Excluir Conta", "Tem certeza de que deseja excluir a conta?", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancelado"),
        style: "cancel",
      },
      {
        text: "Excluir",
        onPress: () => {
          // Caso o usuário clique em "Excluir", exclua a conta
          const veterinariosRef = ref(database, `veterinario/${veterinario.key}`);
          remove(veterinariosRef)
            .then(() => {
              console.log("Conta excluída com sucesso!");
              // Atualize o estado 'veterinarios' após a exclusão da conta
              setVeterinarios(
                veterinarios.filter((v) => v.key !== veterinario.key)
              );
            })
            .catch((error) => {
              console.error("Erro ao excluir conta: ", error);
            });
        },
        style: "destructive",
      },
    ]);
  };
  const renderVeterinario = (veterinario) => {
    const { nome, crmv, email } = veterinario;

    return (
      <View key={veterinario.key} style={[styles.eventContainer]}>
        <Text style={styles.eventUserId}>Nome:</Text>
        <Text>{nome}</Text>
        <Text style={styles.eventUserId}>CRMV:</Text>
        <Text>{crmv}</Text>
        <Text style={styles.eventUserId}>Email:</Text>
        <Text>{email}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => excluirConta(veterinario)}
        >
          <Text style={styles.buttonText}>Excluir conta</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Animatable.View
          animation="fadeInLeft"
          delay={500}
          style={styles.containerHeader}
        >
          <Text style={styles.message}>Veteriários ativos(a)</Text>
        </Animatable.View>
        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
          <TouchableOpacity style={styles.circle} onPress={() => signOut()}>
            <Icon name="sign-in" size={25} color="#FFFF" />
          </TouchableOpacity>
          <Animatable.View
            animation="fadeInLeft"
            delay={500}
            style={styles.containerHeader}
          >
            <Text style={styles.message}>Veterinários</Text>
          </Animatable.View>
          <Animatable.View
            animation="fadeInUp"
            style={[
              styles.containerForm,
              veterinarios.length <= 2
                ? { height: windowHeight }
                : { height: "100%" },
            ]}
          >
            {veterinarios.length > 0 ? (
              veterinarios.map((veterinario) => renderVeterinario(veterinario))
            ) : (
              <Text style={styles.emptyText}>
                Nenhum veterinário cadastrado
              </Text>
            )}
          </Animatable.View>
          <Animatable.View
            animation="fadeInUp"
            delay={500}
            style={styles.containerButtons}
          ></Animatable.View>
        </Animatable.View>
      </View>
    </ScrollView>
  );
}
