import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useContext } from "react";
import * as Animatable from "react-native-animatable";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./styles";
import { MaskedTextInput } from "react-native-mask-text";

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  nome: yup
    .string()
    .matches(/(\w.+\s).+/, "Digite seu nome e sobrenome")
    .required("Nome completo é obrigatório"),
  email: yup
    .string()
    .matches(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[A-Za-z]+$/, "Infome um e-mail válido")
    .email("E-mail invalido")
    .required("Informe seu e-mail"),
  senha: yup
    .string()
    .matches(/\w*[a-z]\w*/, "A senha deve ter uma letra minúscula")
    .matches(/\w*[A-Z]\w*/, "A senha deve ter letra maiúscula")
    .matches(/\d/, "A senha deve ter um número")
    .matches(
      /[!@#$%^&*()\-_"=+{}; :,<.>]/,
      "A senha deve ter um caractere especial"
    )
    .min(
      8,
      ({ min }) => `A senha deve ser pelo menos ${min} caracteres especiais`
    )
    .required("Senha requerida"),
  endereco: yup.string().required("Infome seu endereço"),
  telefone: yup.string().required("Infome seu telefone"),
  cpf: yup
    .string()
    .matches(/^\d{3}.\d{3}.\d{3}-\d{2}$/, "Digite um CPF válido")
    .required("Infome seu CPF"),

  crmv: yup.string().required("CRMV é obrigatório"),
});

export default function RegistrationVt() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { cadastrarVt } = useContext(AuthContext);

  function handleSingUp2(data) {
    cadastrarVt(
      (email = data.email),
      (password = data.senha),
      (nome = data.nome),
      (endereco = data.endereco),
      (telefone = data.telefone),
      (cpf = data.cpf),
      (crmv = data.crmv)
    );
    reset(); // Limpa o formulário após o cadastro ser realizado
    alert("Cadastro realizado com sucesso!");
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Animatable.View
          animation="fadeInLeft"
          delay={500}
          style={styles.containerHeader}
        >
          <Text style={styles.message}>Cadastro veterinário(a)</Text>
        </Animatable.View>
        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
          <Text style={styles.title}>Nome</Text>
          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Digite seu nome completo*"
                cursorColor="#38a69d"
                placeholderTextColor="#BDBDBD"
                autoCapitalize="None"
                //autoCorrect={false}
                style={styles.input}
                onChangeText={onChange}
                onBlur={onBlur} //Chamado quando o textInput é tocado.
                value={value}
              />
            )}
          />
          {errors.nome && (
            <Text style={styles.labelErros}>{errors.nome?.message}</Text>
          )}

          <Text style={styles.title}>Endereço</Text>
          <Controller
            control={control}
            name="endereco"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Digite seu endereço*"
                cursorColor="#38a69d"
                placeholderTextColor="#BDBDBD"
                autoCapitalize="None"
                //autoCorrect={false}
                style={styles.input}
                onChangeText={onChange}
                onBlur={onBlur} //Chamado quando o textInput é tocado.
                value={value}
              />
            )}
          />
          {errors.endereco && (
            <Text style={styles.labelErros}>{errors.endereco?.message}</Text>
          )}

          <Text style={styles.title}>Telefone</Text>
          <Controller
            control={control}
            name="telefone"
            render={({ field: { onChange, onBlur, value } }) => (
              <MaskedTextInput
                placeholder="Digite seu telefone*"
                cursorColor="#38a69d"
                placeholderTextColor="#BDBDBD"
                style={styles.input}
                onChangeText={(text, rawText) => onChange(rawText)}
                onBlur={onBlur}
                value={value}
                keyboardType="number-pad"
                mask="(99) 99999-9999"
              />
            )}
          />
          {errors.telefone && (
            <Text style={styles.labelErros}>{errors.telefone?.message}</Text>
          )}

          <Text style={styles.title}>CPF</Text>
          <Controller
            control={control}
            name="cpf"
            render={({ field: { onChange, onBlur, value } }) => (
              <MaskedTextInput
                placeholder="Digite seu CPF*"
                cursorColor="#38a69d"
                placeholderTextColor="#BDBDBD"
                style={styles.input}
                onChangeText={(text, rawText) => onChange(rawText)}
                onBlur={onBlur}
                value={value}
                keyboardType="number-pad"
                mask="999.999.999-99"
              />
            )}
          />
          {errors.cpf && (
            <Text style={styles.labelErros}>{errors.cpf?.message}</Text>
          )}

          <Text style={styles.title}>CRMV</Text>
          <Controller
            control={control}
            name="crmv"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Digite seu CRMV*"
                cursorColor="#38a69d"
                placeholderTextColor="#BDBDBD"
                autoCapitalize="None"
                //autoCorrect={false}
                style={styles.input}
                onChangeText={onChange}
                onBlur={onBlur} //Chamado quando o textInput é tocado.
                value={value}
                keyboardType="number-pad"
                maxLength={5}
              />
            )}
          />
          {errors.crmv && (
            <Text style={styles.labelErros}>{errors.crmv?.message}</Text>
          )}

          <Text style={styles.title}>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder=" Digite seu E-mail*"
                cursorColor="#38a69d"
                placeholderTextColor="#BDBDBD"
                //autoCapitalize="None"
                keyboardType="email-address"
                //autoCorrect={false}
                style={styles.input}
                onChangeText={onChange}
                onBlur={onBlur} //Chamado quando o textInput é tocado.
                value={value}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.labelErros}>{errors.email?.message}</Text>
          )}

          <Text style={styles.title}>Senha</Text>
          <Controller
            control={control}
            name="senha"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Digite sua Senha*"
                cursorColor="#38a69d"
                placeholderTextColor="#BDBDBD"
                secureTextEntry={true}
                //autoCapitalize="None"
                //autoCorrect={false}
                style={styles.input}
                onChangeText={onChange}
                onBlur={onBlur} //Chamado quando o textInput é tocado.
                value={value}
              />
            )}
          />
          {errors.senha && (
            <Text style={styles.labelErros}>{errors.senha?.message}</Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(handleSingUp2)}
          >
            <Text style={styles.buttonText}>Confirmar cadastro</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </ScrollView>
  );
}
