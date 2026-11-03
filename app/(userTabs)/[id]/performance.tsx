import { useGlobalSearchParams, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import CORES from "@/app/constants/cores";

interface Relatorio {
  id: number;
  tipo: "disciplina" | "questao" | "geral";
  titulo: string | null;
  feedback: string | null;
  data_inicio: string;
  data_fim: string;
}

const ROTULO_TIPO: Record<Relatorio["tipo"], string> = {
  geral: "Geral",
  disciplina: "Disciplinas",
  questao: "Questões",
};

const formatarData = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR");

export default function Performance() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const router = useRouter();
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!id) return
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/relatorio/usuario/${id}`)
      .then(async (res) => {
  const corpo = await res.json();
  if (!res.ok) {
    console.log("URL:", res.url);
    console.log("Resposta da API:", corpo);
    throw new Error(`HTTP ${res.status}`);
  }
  return corpo;
})
      .then(setRelatorios)
      .catch((error) => console.log("Error fetching relatorios:", error))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <LinearGradient colors={CORES.gradiente} style={styles.container}>
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />
      <SafeAreaView style={styles.safeArea}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={CORES.branco}
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContent}
            data={relatorios}
            keyExtractor={(item) => String(item.id)}
            ListEmptyComponent={
              <Text style={styles.vazioTexto}>Nenhum relatório encontrado.</Text>
            }
            renderItem={({ item }) => (
  <Pressable
    style={styles.card}
    onPress={() =>
      router.push({
        pathname: "/(userTabs)/Relatorio/[id]",
        params: { id: String(item.id) },
      })
    }
  >
    <View style={styles.cardTopo}>
      <View style={styles.tipoBadge}>
        <Text style={styles.tipoTexto}>{ROTULO_TIPO[item.tipo]}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={CORES.textoSecundario}
      />
    </View>
    <Text style={styles.cardTitulo}>
      {item.titulo || `Relatório #${item.id}`}
    </Text>
    <Text style={styles.cardPeriodo}>
      {formatarData(item.data_inicio)} a {formatarData(item.data_fim)}
    </Text>
    {item.feedback ? (
      <Text style={styles.cardFeedback}>{item.feedback}</Text>
    ) : null}
  </Pressable>
)}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
  safeArea: { flex: 1, width: "100%" },
  blobTopRight: {
    position: "absolute", top: -60, right: -40, width: 220, height: 220,
    borderRadius: 110, backgroundColor: "#3f7fd8", opacity: 0.4,
  },
  blobBottomLeft: {
    position: "absolute", bottom: -70, left: -50, width: 200, height: 200,
    borderRadius: 100, backgroundColor: "#2b62b0", opacity: 0.45,
  },
  list: { width: "92%", alignSelf: "center" },
  listContent: { paddingVertical: 10, gap: 12 },
  card: {
    backgroundColor: CORES.card,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 12,
    padding: 14,
  },
  cardTopo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tipoBadge: {
    backgroundColor: CORES.destaque,
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  tipoTexto: { color: CORES.branco, fontSize: 11, fontWeight: "700" },
  cardTitulo: { fontSize: 15, fontWeight: "600", color: CORES.branco },
  cardPeriodo: { fontSize: 13, color: CORES.textoSecundario, marginTop: 2 },
  cardFeedback: {
    fontSize: 13,
    color: CORES.textoSecundario,
    marginTop: 10,
    lineHeight: 18,
  },
  vazioTexto: {
    color: CORES.textoSecundario,
    textAlign: "center",
    marginTop: 24,
    fontSize: 14,
  },
});