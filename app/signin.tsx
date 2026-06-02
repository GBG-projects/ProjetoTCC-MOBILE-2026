import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import SignInButton from "./components/SignInButton";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  function handleLogin() {
    router.navigate('/(tabs)/rank')
    if (!user || !password) {
      alert("Preencha todos os campos!");
      return;
    }
    
  }

  return (
  <LinearGradient
    colors={['#003D8C', '#003D8C', '#005498', '#0076C0', '#0076C0']}
    style={styles.container}
  >
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/images/focusIcon.png")}
          style={styles.image}
        />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={24} color="#26328c" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={user}
            onChangeText={setUser}
            keyboardType="email-address"
          />
        </View>

        <View style={{ width: "80%", gap: 6 }}>
          <View style={styles.passwordWrapper}>
            <Ionicons name="lock-closed" size={24} color="#26328c" />
            <TextInput
              style={styles.passwordInput}
              placeholder="Senha"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={24}
                color="#26328c"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.navigate('/forgetPassword')}>
            <Text style={styles.forgetPassword}>Esqueceu a senha?</Text>
          </TouchableOpacity>

        </View>
          <SignInButton onPress={handleLogin} />
      </View> 
    </View>
  </LinearGradient>
);
}

const styles = StyleSheet.create({
   container: {
    flex:1,
    height:"100%",
    width:"100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: "#5c76d5",
    width: "90%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginBottom: 30,
    position: "relative",
    bottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  formContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 50,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#84b7ff",
    borderRadius: 12,
    paddingHorizontal: 15,
    width: "80%",
    height: 55,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#26328c",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#84b7ff",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    gap: 10,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: "#26328c",
  },
  signInButton: {
    backgroundColor: "#0046d2",
    width: "50%",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signInButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    position: "relative",
    top: 33,
  },
  label: {
    // sem estilo inline original, mantido para semântica
  },
  signupRow: {
    width: "100%",
    justifyContent: "center",
    position: "relative",
    right: 10,
    flexDirection: "row",
    marginBottom: 4,
  },
  signupText: {
    color: "white",
  },
  signupLink: {
    color: "#0046d2",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  forgetPassword: {
    color: "#a2fcff",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});