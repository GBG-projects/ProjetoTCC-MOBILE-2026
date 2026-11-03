import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import  CORES  from "@/app/constants/cores";

interface User {
  id: string;
  nome: string;
  email: string;
  role: "estudante" | "admin";
  nivel: number;
  foto: string | null;
  tempo_estudo_total: number;
  created_at: string;
}

const formatarTempo = (segundos: number) => {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
};

const formatarData = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default function UserProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [dataUser, setDataUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/usuario/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((json) => setDataUser(json))
      .catch((error) => console.log("Error fetching user:", error))
      .finally(() => setLoading(false));
  }, [id]);

  const Fundo = ({ children }: { children: React.ReactNode }) => (
<LinearGradient colors={CORES.gradiente} style={styles.container}>
    <View style={styles.blobTopRight} />
      <View style={styles.blobTopRightSmall} />
      <View style={styles.blobBottomLeft} />
      <View style={styles.blobBottomLeftSmall} />
      <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
    </LinearGradient>
  );

  if (loading) {
    return (
      <Fundo>
        <ActivityIndicator
          size="large"
          color={CORES.branco}
          style={{ marginTop: 40 }}
        />
      </Fundo>
    );
  }

  if (!dataUser) {
    return (
      <Fundo>
        <Text style={styles.vazioTexto}>Usuário não encontrado.</Text>
      </Fundo>
    );
  }

  const linhas = [
    { icone: "mail-outline", label: "E-mail", valor: dataUser.email },
    {
      icone: "calendar-outline",
      label: "Membro desde",
      valor: formatarData(dataUser.created_at),
    },
  ] as const;

  return (
    <Fundo>
      <View style={styles.perfilCard}>
        {dataUser.foto ? (
          <Image source={{ uri: dataUser.foto }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={44} color={CORES.textoSecundario} />
          </View>
        )}
        <Text style={styles.nome}>{dataUser.nome}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleTexto}>
            {dataUser.role === "admin" ? "Administrador" : "Estudante"}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="trophy-outline" size={22} color={CORES.destaque} />
          <Text style={styles.statValor}>{dataUser.nivel}</Text>
          <Text style={styles.statLabel}>Nível</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={22} color={CORES.destaque} />
          <Text style={styles.statValor}>
            {formatarTempo(dataUser.tempo_estudo_total)}
          </Text>
          <Text style={styles.statLabel}>Tempo de estudo</Text>
        </View>
      </View>

      <View style={styles.selectContainer}>
        {linhas.map((l, i) => (
          <View key={l.label}>
            {i > 0 && <View style={styles.divider} />}
            <View style={styles.infoLinha}>
              <Ionicons name={l.icone} size={20} color={CORES.textoSecundario} />
              <View style={styles.livroInfo}>
                <Text style={styles.livroAutor}>{l.label}</Text>
                <Text style={styles.livroTitulo}>{l.valor}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </Fundo>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
  safeArea: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
  },

  blobTopRight: {
    position: "absolute",
    top: -60,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#3f7fd8",
    opacity: 0.4,
  },
  blobTopRightSmall: {
    position: "absolute",
    top: 90,
    right: 60,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3f7fd8",
    opacity: 0.5,
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: -70,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#2b62b0",
    opacity: 0.45,
  },
  blobBottomLeftSmall: {
    position: "absolute",
    bottom: 30,
    left: 120,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#2f6bc0",
    opacity: 0.45,
  },

  perfilCard: {
    width: "92%",
    alignItems: "center",
    backgroundColor: CORES.painel,
    borderWidth: 1,
    borderColor: CORES.bordaFraca,
    borderRadius: 16,
    marginTop: 14,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: CORES.destaque,
    marginBottom: 14,
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: CORES.fantasma,
    borderWidth: 1,
    borderColor: CORES.borda,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  nome: {
    fontSize: 22,
    fontWeight: "700",
    color: CORES.branco,
    textAlign: "center",
  },
  roleBadge: {
    marginTop: 10,
    backgroundColor: CORES.destaque,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  roleTexto: {
    color: CORES.branco,
    fontSize: 12,
    fontWeight: "700",
  },

  statsRow: {
    width: "92%",
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: CORES.card,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    gap: 4,
  },
  statValor: {
    fontSize: 20,
    fontWeight: "700",
    color: CORES.branco,
  },
  statLabel: {
    fontSize: 13,
    color: CORES.textoSecundario,
  },

  selectContainer: {
    width: "92%",
    alignSelf: "center",
    backgroundColor: CORES.painel,
    borderWidth: 1,
    borderColor: CORES.bordaFraca,
    borderRadius: 16,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  infoLinha: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  livroInfo: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  livroTitulo: {
    fontSize: 15,
    fontWeight: "600",
    color: CORES.branco,
  },
  livroAutor: {
    fontSize: 13,
    color: CORES.textoSecundario,
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  vazioTexto: {
    color: CORES.textoFraco,
    textAlign: "center",
    marginTop: 24,
    fontSize: 14,
  },
} satisfies Record<string, ViewStyle | TextStyle | ImageStyle>);