import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import CORES from "@/app/constants/cores";

interface RelatorioQuestao {
  disciplina_nome: string | null;
  quantidade_questoes: number;
  quantidade_acertos: number;
}

const COR_FEITAS = CORES.destaque;
const COR_ACERTOS = "#22c55e";

// soma por disciplina e monta as barras em pares (feitas, acertadas)
function montarDados(itens: RelatorioQuestao[]) {
  const porDisciplina = new Map<string, { feitas: number; acertos: number }>();

  for (const q of itens) {
    const nome = q.disciplina_nome ?? "Geral";
    const atual = porDisciplina.get(nome) ?? { feitas: 0, acertos: 0 };
    atual.feitas += q.quantidade_questoes;
    atual.acertos += q.quantidade_acertos;
    porDisciplina.set(nome, atual);
  }

  return Array.from(porDisciplina.entries()).flatMap(([nome, v]) => [
    {
      value: v.feitas,
      label: nome.length > 8 ? nome.slice(0, 7) + "…" : nome,
      labelWidth: 56,
      spacing: 4,
      frontColor: COR_FEITAS,
    },
    {
      value: v.acertos,
      spacing: 28,
      frontColor: COR_ACERTOS,
    },
  ]);
}

export function GraficoQuestoes({ itens }: { itens: RelatorioQuestao[] }) {
  const { width } = useWindowDimensions();
  const larguraGrafico = width * 0.92 - 32 - 36;
  const dados = montarDados(itens);

  return (
    <View style={styles.painel}>
      <Text style={styles.titulo}>Questões feitas x acertadas</Text>

      <View style={styles.legenda}>
        <View style={styles.legendaItem}>
          <View style={[styles.ponto, { backgroundColor: COR_FEITAS }]} />
          <Text style={styles.legendaTexto}>Feitas</Text>
        </View>
        <View style={styles.legendaItem}>
          <View style={[styles.ponto, { backgroundColor: COR_ACERTOS }]} />
          <Text style={styles.legendaTexto}>Acertadas</Text>
        </View>
      </View>

      {dados.length === 0 ? (
        <Text style={styles.legendaTexto}>Sem dados neste relatório.</Text>
      ) : (
        <BarChart
          data={dados}
          width={larguraGrafico}
          height={160}
          barWidth={20}
          initialSpacing={10}
          roundedTop
          isAnimated
          noOfSections={4}
          yAxisThickness={0}
          xAxisColor={CORES.borda}
          rulesColor={CORES.borda}
          yAxisTextStyle={{ color: CORES.textoSecundario, fontSize: 11 }}
          xAxisLabelTextStyle={{ color: CORES.textoSecundario, fontSize: 11 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  painel: {
    width: "92%",
    alignSelf: "center",
    backgroundColor: CORES.painel,
    borderWidth: 1,
    borderColor: CORES.bordaFraca,
    borderRadius: 16,
    marginTop: 14,
    padding: 16,
  },
  titulo: {
    color: CORES.branco,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  legenda: { flexDirection: "row", gap: 16, marginBottom: 12 },
  legendaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  ponto: { width: 10, height: 10, borderRadius: 5 },
  legendaTexto: { color: CORES.textoSecundario, fontSize: 12 },
});