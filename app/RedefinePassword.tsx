
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function RedefinePassword() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Sem token → volta pro login
  if (!token) {
    router.replace("/signin");
    return null;
  }

  async function handleRedefine() {
    if (!password || !confirm) {
      Alert.alert("Preencha todos os campos!");
      return;
    }
    if (password !== confirm) {
      Alert.alert("As senhas não coincidem!");
      return;
    }

    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/RedefinePassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) throw new Error();

      Alert.alert("Senha alterada com sucesso!", "", [
        { text: "OK", onPress: () => router.replace("/signin") },
      ]);
    } catch {
      Alert.alert("Token inválido ou expirado.");
    }
  }

  return (
    <LinearGradient
      colors={["#003D8C", "#003D8C", "#005498", "#0076C0", "#0076C0"]}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Nova senha</Text>
        <Text style={styles.subtitle}>Digite e confirme sua nova senha.</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={22} color="#26328c" />
          <TextInput
            style={styles.input}
            placeholder="Nova senha"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye" : "eye-off"} size={22} color="#26328c" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={22} color="#26328c" />
          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            placeholderTextColor="#999"
            secureTextEntry={!showConfirm}
            value={confirm}
            onChangeText={setConfirm}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Ionicons name={showConfirm ? "eye" : "eye-off"} size={22} color="#26328c" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRedefine}>
          <Text style={styles.buttonText}>Salvar senha</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  card: {
    width: "100%", backgroundColor: "#fff",
    borderRadius: 20, padding: 32, gap: 16,
    shadowColor: "#000", shadowOpacity: 0.15,
    shadowRadius: 20, elevation: 8,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#003D8C" },
  subtitle: { fontSize: 13, color: "#5a6480", marginBottom: 8 },
  inputContainer: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#84b7ff", borderRadius: 12,
    paddingHorizontal: 14, height: 52, gap: 10,
  },
  input: { flex: 1, fontSize: 15, color: "#26328c" },
  button: {
    backgroundColor: "#003D8C", borderRadius: 50,
    height: 52, justifyContent: "center", alignItems: "center", marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});