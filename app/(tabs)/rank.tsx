import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity } from "react-native";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";

interface User {
  id: number;
  nome: string;
  email: string;
  senha: string;
  pontuacao: number;
  foto: string;
}

export default function Rank() {
  const [dataUsers, setDataUsers] = useState<User[]>([]);
  const router = useRouter();
  const [ordenacao, setOrdenacao] = useState("tempo_estudo_total");

  const getUsers = () => {
  fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/usuario?ordenar_por=${ordenacao}`)
    .then((response) => response.json())
    .then((json) => {
      setDataUsers(json);
    })
    .catch((error) => {
      console.log("Error fetching users:", error);
    });
};

  useEffect(() => {
    getUsers();
  }, [ordenacao]);

  return (
    <LinearGradient
      colors={["#003D8C", "#003D8C", "#005498", "#0076C0", "#0076C0"]}
      style={styles.container}
    >
      <SafeAreaView
  edges={["left", "right", "bottom"]}
  style={styles.safeArea}
>
         <View style={styles.selectContainer}>
  <Text style={styles.selectLabel}>Ordenar por</Text>

  <Picker
    selectedValue={ordenacao}
    onValueChange={(value) => setOrdenacao(value)}
    dropdownIconColor="#fff"
    style={styles.picker}
    itemStyle={styles.pickerItem}
  >
    <Picker.Item label="Tempo de estudo" value="tempo_estudo_total" />
    <Picker.Item label="Quantidade de questões" value="acertos" />
  </Picker>
</View>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={dataUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.users}
              onPress={() => {
                router.push({
                  pathname: "/(userTabs)/[id]/userProfile", params: {id: item.id},
                
                });
              }}
            >
              {item.foto ? (
                <Image source={{ uri: item.foto }} style={styles.imgUser} />
              ) : (
                <Image
                  source={require("../../assets/images/icon.png")}
                  style={styles.imgUser}
                />
              )}

              <View style={styles.userInfo}>
                {item.email.length < 20 ? (
                  <Text style={styles.valoresTextoUserEmail}>{item.email}</Text>
                ) : (
                  <Text style={styles.valoresTextoUserEmail}>
                    {item.email.slice(0, 20)}...
                  </Text>
                )}
                <Text style={styles.valoresTextoUserNome}>{item.nome}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  alignItems: "center",
  justifyContent: "flex-start",
},
  safeArea: {
  flex: 1,
  width: "100%",
  alignItems: "center",
  paddingTop: 10,
},
  list: {
    width: "80%",
    maxHeight: "100%",
    alignSelf: "center",
  },
  listContent: {
    alignItems: "center",
    paddingVertical: 10,
    gap: 20,
  },
  users: {
    alignItems: "center",
    backgroundColor: "#d5faff",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
    borderRadius: 30,
    flexDirection: "row",
    marginVertical: 6,
  },
  imgUser: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  userInfo: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  valoresTextoUserNome: {
    fontSize: 18,
    fontWeight: "bold",
  },
  valoresTextoUserEmail: {
    fontSize: 14,
  },
  selectContainer: {
  width: "92%",
  alignSelf: "center",
  backgroundColor: "rgba(255,255,255,0.15)",
  borderRadius: 12,
  marginTop: 15,
  marginBottom: 12,
  paddingHorizontal: 12,
},

selectLabel: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
  marginTop: 10,
  marginBottom: 4,
},

picker: {
  width: "100%",
  height: 55,
  color: "#fff",
},

pickerItem: {
  color: "#fff",
  fontSize: 16,
},
});
