import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import CORES from "@/app/constants/cores";
import { GraficoQuestoes } from "@/components/graficos/RelatorioQuestao";
import { GraficoTempoEstudo } from "@/components/graficos/RelatorioTempoEstudo";
import LoadingScreen from "@/components/Loading";
interface RelatorioDetalhe {
  id: number;
  tipo: "disciplina" | "questao" | "geral";
  titulo: string | null;
  feedback: string | null;
  data_inicio: string;
  data_fim: string;
  relatorio_disciplina: {
    disciplina_nome: string | null;
    horas_estudadas: string | number;
  }[];
  relatorio_questao: {
    disciplina_nome: string | null;
    quantidade_questoes: number;
    quantidade_acertos: number;
  }[];
}

const formatarData = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR");

export default function RelatorioDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [relatorio, setRelatorio] = useState<RelatorioDetalhe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/relatorio/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setRelatorio)
      .catch((error) => console.log("Error fetching relatorio:", error))
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
        ) : !relatorio ? (
          <Text style={styles.vazioTexto}>Relatório não encontrado.</Text>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.cabecalho}>
              <Text style={styles.titulo}>
                {relatorio.titulo || `Relatório #${relatorio.id}`}
              </Text>
              <Text style={styles.periodo}>
                {formatarData(relatorio.data_inicio)} a{" "}
                {formatarData(relatorio.data_fim)}
              </Text>
              {relatorio.feedback ? (
                <Text style={styles.feedback}>{relatorio.feedback}</Text>
              ) : null}
            </View>

            {relatorio.relatorio_disciplina.length > 0 && (
              <GraficoTempoEstudo itens={relatorio.relatorio_disciplina} />
            )}
            {relatorio.relatorio_questao.length > 0 && (
              <GraficoQuestoes itens={relatorio.relatorio_questao} />
            )}
          </ScrollView>
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
  voltar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  voltarTexto: { color: CORES.branco, fontSize: 14 },
  scroll: { flex: 1 },
  cabecalho: {
    width: "92%",
    alignSelf: "center",
    backgroundColor: CORES.painel,
    borderWidth: 1,
    borderColor: CORES.bordaFraca,
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
  },
  titulo: { fontSize: 18, fontWeight: "700", color: CORES.branco },
  periodo: { fontSize: 13, color: CORES.textoSecundario, marginTop: 4 },
  feedback: {
    fontSize: 13,
    color: CORES.textoSecundario,
    marginTop: 12,
    lineHeight: 18,
  },
  vazioTexto: {
    color: CORES.textoSecundario,
    textAlign: "center",
    marginTop: 24,
    fontSize: 14,
  },
});