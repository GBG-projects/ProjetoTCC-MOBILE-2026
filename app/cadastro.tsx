import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Cadastro() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleCadastro() {
    if (!nome || !usuario || !email || !senha || !confirmarSenha) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    console.log("Tentativa de cadastro:", { nome, usuario, email, senha });

    Alert.alert("Sucesso", "Conta criada! (simulação)", [
      { text: "OK", onPress: () => router.replace("/login") },
    ]);
  }

  return (
    <View style={{backgroundColor: "#26328c",flex:1, justifyContent:"center", alignItems:"center"}}>

      <ScrollView
        style={{
          width:"80%",
          maxHeight: 630,
          backgroundColor: "#5c76d5",
          borderRadius:20,
          paddingVertical: 20
        }}
        contentContainerStyle={{
          alignItems:"center"
        }}
      >
        
         
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Text
              style={{
                fontSize: 30,
                textAlign: "center",
                color: "white",
                marginBottom: 20,
              }}
            >
              Focus Flow
            </Text>
          </View>

          <View
            style={{
              flex: 5,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              gap: 16,
              paddingHorizontal: 20,
            }}
          >
            <View style={{ width: 200 }}>
              <Text style={{ color: "white", marginBottom: 4 }}>Nome</Text>
              <TextInput
                value={nome}
                onChangeText={setNome}
                style={{
                  backgroundColor: "#dd9393",
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  height: 48,
                  fontSize: 16,
                }}
                placeholder="Seu nome"
                placeholderTextColor="#555"
              />
            </View>

            <View style={{ width: 200 }}>
              <Text style={{ color: "white", marginBottom: 4 }}>Usuário</Text>
              <TextInput
                value={usuario}
                onChangeText={setUsuario}
                style={{
                  backgroundColor: "#dd9393",
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  height: 48,
                  fontSize: 16,
                }}
                placeholder="@usuario"
                placeholderTextColor="#555"
                autoCapitalize="none"
              />
            </View>

            <View style={{ width: 200 }}>
              <Text style={{ color: "white", marginBottom: 4 }}>E-mail</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={{
                  backgroundColor: "#dd9393",
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  height: 48,
                  fontSize: 16,
                }}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="#555"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={{ width: 200 }}>
              <Text style={{ color: "white", marginBottom: 4 }}>Senha</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#dd9393",
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  height: 48,
                }}
              >
                <TextInput
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!showPassword}
                  style={{ flex: 1, fontSize: 16 }}
                  placeholder="••••••••"
                  placeholderTextColor="#555"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={22}
                    color="#333"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ width: 200 }}>
              <Text style={{ color: "white", marginBottom: 4 }}>
                Confirmar senha
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#dd9393",
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  height: 48,
                }}
              >
                <TextInput
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry={!showConfirmPassword}
                  style={{ flex: 1, fontSize: 16 }}
                  placeholder="••••••••"
                  placeholderTextColor="#555"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye" : "eye-off"}
                    size={22}
                    color="#333"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ marginTop: 12, width: 200 }}>
              <Button
                title="Criar conta"
                color="#1e3a8a"
                onPress={handleCadastro}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 16,
              gap: 6,
            }}
          >
            <Text style={{ color: "white" }}>Já tem uma conta?</Text>
            <TouchableOpacity onPress={() => router.navigate("/login")}>
              <Text
                style={{
                  color: "#0046d2",
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                }}
              >
                Entrar
              </Text>
            </TouchableOpacity>
          </View>

      </ScrollView>
    </View>
  );
}