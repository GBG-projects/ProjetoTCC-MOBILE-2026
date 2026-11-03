import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import CORES from "@/app/constants/cores";

interface RelatorioDisciplina {
  disciplina_nome: string | null;
  horas_estudadas: string | number;
}

const COR_BARRA = CORES.destaque;

function formatarHorasMinutos(horas: number) {
  const totalMin = Math.round(horas * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function GraficoTempoEstudo({
  itens,
}: {
  itens: RelatorioDisciplina[];
}) {
  const { width } = useWindowDimensions();
  const larguraGrafico = width * 0.92 - 32 - 36;

  const porDisciplina = new Map<string, number>();
  for (const item of itens) {
    const nome = item.disciplina_nome ?? "Geral";
    porDisciplina.set(
      nome,
      (porDisciplina.get(nome) ?? 0) + Number(item.horas_estudadas)
    );
  }

  const dados = Array.from(porDisciplina.entries()).map(([nome, horas]) => ({
    value: horas,
    label: nome.length > 8 ? nome.slice(0, 7) + "…" : nome,
    labelWidth: 56,
    frontColor: COR_BARRA,
    topLabelComponent: () => (
      <Text style={styles.valorBarra}>{formatarHorasMinutos(horas)}</Text>
    ),
  }));

  const totalHoras = dados.reduce((soma, d) => soma + d.value, 0);
  const maiorValor = Math.max(0, ...dados.map((d) => d.value));

  return (
    <View style={styles.painel}>
      <Text style={styles.titulo}>Tempo de estudo</Text>
      <Text style={styles.subtitulo}>
        Total: {formatarHorasMinutos(totalHoras)}
      </Text>

      {dados.length === 0 ? (
        <Text style={styles.subtitulo}>Sem dados neste relatório.</Text>
      ) : (
        <BarChart
          data={dados}
          width={larguraGrafico}
          height={160}
          barWidth={32}
          spacing={20}
          initialSpacing={10}
          maxValue={maiorValor * 1.25 || 1}
          roundedTop
          isAnimated
          noOfSections={4}
          yAxisThickness={0}
          yAxisLabelSuffix="h"
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
  },
  subtitulo: {
    color: CORES.textoSecundario,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  valorBarra: {
    color: CORES.branco,
    fontSize: 10,
    fontWeight: "600",
    marginBottom: 4,
    width: 60,
    textAlign: "center",
  },
});