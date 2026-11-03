import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import ContinueButton from "../components/ContinueButton";
import LoadingScreen from "../components/Loading";

const ERROS: Record<string, string> = {
  invalido: "Link inválido, expirado ou já utilizado. Solicite um novo link.",
  dados: "Dados inválidos. A senha precisa ter pelo menos 8 caracteres.",
  servidor: "Não foi possível redefinir agora. Tente novamente em instantes.",
};

export default function RedefinePassword() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!token) {
      Alert.alert("Link incompleto", "Use o link enviado ao seu e-mail.");
      return;
    }
    if (senha.length < 8) {
      Alert.alert("Atenção", "A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (senha !== confirma) {
      Alert.alert("Atenção", "As senhas não são iguais.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/mudarSenha/redefinir-senha`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, senha }),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        Alert.alert("Erro", ERROS[data.erro] ?? ERROS.servidor);
        return;
      }

      Alert.alert("Pronto!", "Sua senha foi alterada. Entre com a nova senha.", [
        { text: "Ir para o login", onPress: () => router.replace("/signin") },
      ]);
    } catch (error) {
      console.error("error: ", error);
      Alert.alert("Erro", ERROS.servidor);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#003D8C", "#003D8C", "#005498", "#0076C0", "#0076C0"]}
      style={styles.container}
    >
      <Text style={styles.title}>Criar nova senha</Text>
      <Text style={styles.subtitle}>
        Escolha uma senha com pelo menos 8 caracteres.
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nova senha"
          placeholderTextColor="#26328c99"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Confirmar senha"
          placeholderTextColor="#26328c99"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          value={confirma}
          onChangeText={setConfirma}
          style={styles.input}
        />
      </View>

      <ContinueButton onPress={handleReset} />

      <LoadingScreen visible={loading} message="Salvando..." />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, color: "#fff", marginBottom: 10 },
  inputContainer: {
    backgroundColor: "#84b7ff",
    borderRadius: 12,
    paddingHorizontal: 15,
    width: "80%",
    height: 55,
    justifyContent: "center",
  },
  input: { fontSize: 16, color: "#26328c" },
});