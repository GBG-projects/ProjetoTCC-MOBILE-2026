import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";

interface User {
  id: number;
  nome: string;
  email: string;
  senha: string;
  nivel: number;
  foto: string;
}

export default function userProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [dataUser, setDataUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getUsers = () => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/usuario/${id}`)
      .then((response) => response.json())
      .then((json) => {
        setDataUser(json);
      })
      .catch((error) => {
        console.log("Error fetching user:", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getUsers();
  }, []);
  console.log(dataUser);
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!dataUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Usuário não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {dataUser.foto ? (
          <Image source={{ uri: dataUser.foto }} style={styles.avatar} />
        ) : null}
        <Text style={styles.title}>{dataUser.nome}</Text>
      <Text style={styles.text}>Email: {dataUser.email}</Text>
      <Text style={styles.text}>Nível: {dataUser.nivel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
});