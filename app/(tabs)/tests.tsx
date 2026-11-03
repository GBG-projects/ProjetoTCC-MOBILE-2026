import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Link, type Href } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API = process.env.EXPO_PUBLIC_API_URL;

const USUARIO_KEY = "usuario";
const CAMPO_ARQUIVO = "arquivo";
const TIMEOUT_ENVIO_MS = 90_000;

interface Prova {
  id: number;
  titulo: string;
  disciplina_id: number;
  pdf_url: string;
  gabarito_url: string | null;
  preview_url: string | null;
}

interface Disciplina {
  id: number;
  nome: string;
}

const CORES = {
  gradiente: ["#0d2c66", "#164a8f", "#2f7fce"] as const,
  painel: "rgba(18, 36, 92, 0.7)",
  secao: "rgba(14, 28, 74, 0.55)",
  campo: "rgba(35, 90, 170, 0.55)",
  card: "rgba(35, 90, 170, 0.45)",
  borda: "rgba(255, 255, 255, 0.1)",
  bordaFraca: "rgba(255, 255, 255, 0.08)",
  fantasma: "rgba(255, 255, 255, 0.08)",
  branco: "#FFFFFF",
  textoSecundario: "rgba(255, 255, 255, 0.6)",
  textoFraco: "rgba(255, 255, 255, 0.5)",
  placeholder: "rgba(255, 255, 255, 0.6)",
  destaque: "#0ea5e9",
  perigo: "#dc2626",
  modalFundo: "#0e1c4a",
  pickerBg: "#EAF0FD",
  pickerTexto: "#0d2c66",
};

type RespostaLike = { ok: boolean; status: number; text(): Promise<string> };

async function lerJson<T>(response: RespostaLike): Promise<T> {
  const texto = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${texto.slice(0, 300)}`);
  }
  try {
    return JSON.parse(texto) as T;
  } catch {
    throw new Error(`Resposta não é JSON: ${texto.slice(0, 200)}`);
  }
}

async function lerUsuarioId(): Promise<string | number> {
  let id: string | number | null = null;
  try {
    const bruto = await SecureStore.getItemAsync(USUARIO_KEY);
    id = bruto ? (JSON.parse(bruto)?.id ?? null) : null;
  } catch {
    id = null;
  }
  if (id === null || id === "") {
    throw new Error("Usuário não identificado. Faça login novamente.");
  }
  return id;
}

function subirPdf(
  arquivo: DocumentPicker.DocumentPickerAsset,
  signal: AbortSignal,
  rotulo: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = `${API}/api/prova/upload-mobile`;
    console.log(`[upload ${rotulo}]`, url, arquivo.name, arquivo.size);

    const form = new FormData();
    form.append(CAMPO_ARQUIVO, {
      uri: arquivo.uri,
      name: arquivo.name || "arquivo.pdf",
      type: arquivo.mimeType || "application/pdf",
    } as any);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Accept", "application/json");

    xhr.onload = () => {
      console.log(`[upload ${rotulo}] status`, xhr.status, String(xhr.responseText).slice(0, 200));
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(`HTTP ${xhr.status}: ${String(xhr.responseText).slice(0, 300)}`));
        return;
      }
      try {
        const json = JSON.parse(xhr.responseText);
        if (json?.error || !json?.url) {
          throw new Error(json?.error ?? `Falha no upload (${rotulo}).`);
        }
        resolve(json.url as string);
      } catch (e: any) {
        reject(new Error(e?.message ?? "Resposta inválida do upload."));
      }
    };
    xhr.onerror = () => reject(new Error("Network request failed"));
    xhr.ontimeout = () => reject(Object.assign(new Error("Timeout"), { name: "AbortError" }));

    signal.addEventListener("abort", () => {
      xhr.abort();
      reject(Object.assign(new Error("Aborted"), { name: "AbortError" }));
    });

    xhr.send(form as any);
  });
}

export default function Provas() {
  const [provas, setProvas] = useState<Prova[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [disciplinaFiltro, setDisciplinaFiltro] = useState<string>("todas");

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [carregandoDisciplinas, setCarregandoDisciplinas] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [disciplinaId, setDisciplinaId] = useState<number | null>(null);
  const [arquivoProva, setArquivoProva] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [arquivoGabarito, setArquivoGabarito] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [salvando, setSalvando] = useState(false);

  const requisicaoProvas = useRef(0);

  const getProvas = useCallback(async () => {
    const id = ++requisicaoProvas.current;
    setCarregando(true);
    try {
      const query =
        disciplinaFiltro !== "todas"
          ? `?disciplina=${encodeURIComponent(disciplinaFiltro)}`
          : "";
      const response = await fetch(`${API}/api/prova${query}`);
      const json = await lerJson<unknown>(response);
      if (id !== requisicaoProvas.current) return;
      setProvas(Array.isArray(json) ? (json as Prova[]) : []);
    } catch (error) {
      console.log("Error fetching provas:", error);
    } finally {
      if (id === requisicaoProvas.current) setCarregando(false);
    }
  }, [disciplinaFiltro]);

  const getDisciplinas = useCallback(async () => {
    setCarregandoDisciplinas(true);
    try {
      const response = await fetch(`${API}/api/disciplina`);
      const json = await lerJson<any>(response);
      const lista: Disciplina[] = Array.isArray(json)
        ? json
        : Array.isArray(json?.disciplinas)
          ? json.disciplinas
          : Array.isArray(json?.data)
            ? json.data
            : [];

      setDisciplinas(lista);
    } catch (error) {
      console.error("Error fetching disciplinas:", error);
    } finally {
      setCarregandoDisciplinas(false);
    }
  }, []);

  useEffect(() => {
    getDisciplinas();
  }, [getDisciplinas]);

  useEffect(() => {
    getProvas();
  }, [getProvas]);

  useEffect(() => {
    if (disciplinaId === null && disciplinas.length > 0) {
      setDisciplinaId(disciplinas[0].id);
    }
  }, [disciplinas, disciplinaId]);

  const escolherPdf = async (
    aoEscolher: (arquivo: DocumentPicker.DocumentPickerAsset) => void
  ) => {
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true, 
      });
      if (!resultado.canceled && resultado.assets?.length) {
        aoEscolher(resultado.assets[0]);
      }
    } catch (error) {
      console.log("Erro ao escolher arquivo:", error);
      Alert.alert("Erro", "Não foi possível selecionar o arquivo.");
    }
  };

  const escolherArquivoProva = () => escolherPdf(setArquivoProva);
  const escolherArquivoGabarito = () => escolherPdf(setArquivoGabarito);

  const fecharModal = () => {
    if (salvando) return; 
    setModalAberto(false);
  };

  const salvarProva = async () => {
    if (salvando || !titulo.trim() || !arquivoProva || disciplinaId === null) return;

    setSalvando(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_ENVIO_MS);

    try {
      if (!API) {
        throw new Error(
          "EXPO_PUBLIC_API_URL não está definida. Crie o .env e reinicie com: npx expo start -c"
        );
      }

      const usuarioId = await lerUsuarioId();

      const pdfUrl = await subirPdf(arquivoProva, controller.signal, "prova");
      const gabaritoUrl = arquivoGabarito
        ? await subirPdf(arquivoGabarito, controller.signal, "gabarito")
        : null;

      const corpo = {
        usuarioId,
        disciplinaId,
        titulo: titulo.trim(),
        pdfUrl,
        gabaritoUrl,
      };
      console.log("[criar prova]", `${API}/api/prova`, corpo);

      const response = await fetch(`${API}/api/prova`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(corpo),
        signal: controller.signal,
      });
      await lerJson<unknown>(response);

      setModalAberto(false);
      setTitulo("");
      setArquivoProva(null);
      setArquivoGabarito(null);
      await getProvas();
    } catch (error: any) {
      console.log("Error salvando prova:", error);
      const mensagem =
        error?.name === "AbortError"
          ? "O envio demorou demais e foi cancelado. Verifique a conexão ou o tamanho dos PDFs."
          : error?.message === "Network request failed"
            ? "Não foi possível conectar ao servidor. Confira a URL da API, o Wi-Fi e se o backend está rodando."
            : String(error?.message ?? error);
      Alert.alert("Erro ao salvar", mensagem);
    } finally {
      clearTimeout(timeout);
      setSalvando(false);
    }
  };

  const desabilitado =
    !titulo.trim() || !arquivoProva || disciplinaId === null || salvando;

  return (
    <LinearGradient
      colors={CORES.gradiente}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View pointerEvents="none" style={styles.blobTopRight} />
      <View pointerEvents="none" style={styles.blobTopRightSmall} />
      <View pointerEvents="none" style={styles.blobBottomLeft} />
      <View pointerEvents="none" style={styles.blobBottomLeftSmall} />

      <SafeAreaView edges={["left", "right", "bottom"]} style={styles.safeArea}>
        <TouchableOpacity
          style={styles.btnCriar}
          activeOpacity={0.85}
          onPress={() => setModalAberto(true)}
        >
          <Ionicons name="add" size={20} color={CORES.branco} />
          <Text style={styles.btnCriarTexto}>Nova Prova</Text>
        </TouchableOpacity>

        <View style={styles.selectContainer}>
          <Text style={styles.selectLabel}>Disciplina</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={disciplinaFiltro}
              onValueChange={(value) => setDisciplinaFiltro(value)}
              dropdownIconColor={CORES.pickerTexto}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Todas as disciplinas" value="todas" />
              {disciplinas.map((d) => (
                <Picker.Item key={d.id} label={d.nome} value={d.nome} />
              ))}
            </Picker>
          </View>
        </View>

        {carregando ? (
          <ActivityIndicator
            color={CORES.branco}
            size="large"
            style={{ marginTop: 24 }}
          />
        ) : (
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContent}
            data={provas}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.vazioTexto}>
                Nenhuma prova ainda. Toque em "Nova Prova" para começar.
              </Text>
            }
            renderItem={({ item }) => (
              <View style={styles.livroCard}>
                {item.preview_url ? (
                  <Image
                    source={{ uri: item.preview_url }}
                    style={styles.previewImg}
                  />
                ) : (
                  <View style={styles.previewPlaceholder}>
                    <Ionicons
                      name="document-text"
                      size={22}
                      color={CORES.branco}
                    />
                  </View>
                )}

                <Link href={item.pdf_url as Href} style={styles.livroInfo}>
                  <Text style={styles.livroTitulo} numberOfLines={1}>
                    {item.titulo}
                  </Text>
                </Link>

                {item.gabarito_url ? (
                  <Link href={item.gabarito_url as Href} asChild>
                    <TouchableOpacity style={styles.gabaritoBotao}>
                      <Ionicons
                        name="checkmark-done"
                        size={20}
                        color={CORES.branco}
                      />
                    </TouchableOpacity>
                  </Link>
                ) : null}

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={CORES.textoSecundario}
                />
              </View>
            )}
          />
        )}
      </SafeAreaView>

      <Modal
        visible={modalAberto}
        transparent
        animationType="slide"
        onRequestClose={fecharModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalFundo}
        >
          <Pressable style={styles.modalFundoToque} onPress={fecharModal} />

          <View style={styles.modalConteudo}>
            <View style={styles.modalAlca} />

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalCabecalho}>
                <Text style={styles.modalTitulo}>Nova prova</Text>
                <TouchableOpacity onPress={fecharModal} style={styles.iconBtn}>
                  <Ionicons name="close" size={18} color={CORES.branco} />
                </TouchableOpacity>
              </View>

              <Text style={styles.campoLabel}>Título *</Text>
              <TextInput
                style={styles.campoInput}
                placeholder="Ex: Simulado ENEM 2024 - 1º dia"
                placeholderTextColor={CORES.placeholder}
                value={titulo}
                onChangeText={setTitulo}
                maxLength={150}
              />

              <Text style={styles.campoLabel}>Disciplina *</Text>
              <View style={styles.pickerBox}>
                {carregandoDisciplinas ? (
                  <ActivityIndicator
                    color={CORES.pickerTexto}
                    style={{ paddingVertical: 12 }}
                  />
                ) : (
                  <Picker
                    selectedValue={disciplinaId}
                    onValueChange={(value) => setDisciplinaId(value)}
                    dropdownIconColor={CORES.pickerTexto}
                    style={styles.picker}
                  >
                    {disciplinas.map((d) => (
                      <Picker.Item key={d.id} label={d.nome} value={d.id} />
                    ))}
                  </Picker>
                )}
              </View>

              <Text style={styles.campoLabel}>Arquivo da prova (PDF) *</Text>
              <TouchableOpacity
                style={styles.arquivoBotao}
                onPress={escolherArquivoProva}
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={18}
                  color={CORES.branco}
                />
                <Text style={styles.arquivoTexto} numberOfLines={1}>
                  {arquivoProva ? arquivoProva.name : "Selecionar PDF da prova"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.campoLabel}>Gabarito (opcional)</Text>
              <TouchableOpacity
                style={styles.arquivoBotao}
                onPress={escolherArquivoGabarito}
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={18}
                  color={CORES.branco}
                />
                <Text style={styles.arquivoTexto} numberOfLines={1}>
                  {arquivoGabarito
                    ? arquivoGabarito.name
                    : "Selecionar PDF do gabarito"}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={[styles.btnSalvar, desabilitado && styles.btnDesabilitado]}
                disabled={desabilitado}
                onPress={salvarProva}
              >
                {salvando ? (
                  <ActivityIndicator color={CORES.branco} />
                ) : (
                  <Text style={styles.btnCriarTexto}>Salvar prova</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={fecharModal}
                style={styles.btnCancelar}
                disabled={salvando}
              >
                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
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

  btnCriar: {
    width: "92%",
    backgroundColor: CORES.destaque,
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 6,
  },
  btnCriarTexto: {
    color: CORES.branco,
    fontWeight: "700",
    fontSize: 14,
  },

  selectContainer: {
    width: "92%",
    alignSelf: "center",
    backgroundColor: CORES.painel,
    borderWidth: 1,
    borderColor: CORES.bordaFraca,
    borderRadius: 16,
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  selectLabel: {
    color: CORES.branco,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  pickerBox: {
    backgroundColor: CORES.pickerBg,
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
    color: CORES.pickerTexto,
  },
  pickerItem: {
    color: CORES.pickerTexto,
    fontSize: 16,
  },

  list: {
    width: "92%",
    alignSelf: "center",
  },
  listContent: {
    paddingVertical: 10,
    gap: 12,
  },
  vazioTexto: {
    color: CORES.textoFraco,
    textAlign: "center",
    marginTop: 24,
    fontSize: 14,
  },
  livroCard: {
    backgroundColor: CORES.card,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  previewImg: {
    width: 44,
    height: 58,
    borderRadius: 8,
  },
  previewPlaceholder: {
    width: 44,
    height: 58,
    borderRadius: 8,
    backgroundColor: CORES.fantasma,
    borderWidth: 1,
    borderColor: CORES.borda,
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: 2,
  },

  gabaritoBotao: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: CORES.borda,
    backgroundColor: CORES.fantasma,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  modalFundo: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalFundoToque: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalConteudo: {
    backgroundColor: CORES.modalFundo,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: CORES.bordaFraca,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    maxHeight: "90%",
  },
  modalAlca: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginBottom: 14,
  },
  modalCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: CORES.branco,
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  campoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: CORES.branco,
    marginBottom: 8,
    marginTop: 14,
  },
  campoInput: {
    backgroundColor: CORES.campo,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: CORES.branco,
    fontSize: 14,
  },
  campoTextarea: {
    height: 90,
    textAlignVertical: "top",
  },
  arquivoBotao: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.35)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: CORES.fantasma,
  },
  arquivoTexto: {
    color: CORES.branco,
    fontSize: 14,
    flexShrink: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginTop: 18,
  },
  btnSalvar: {
    backgroundColor: CORES.destaque,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 16,
  },
  btnDesabilitado: {
    opacity: 0.5,
  },
  btnCancelar: {
    alignSelf: "center",
    marginTop: 12,
    padding: 6,
  },
  btnCancelarTexto: {
    color: CORES.textoSecundario,
    fontSize: 13,
    textDecorationLine: "underline",
  },
} satisfies Record<string, ViewStyle | TextStyle | ImageStyle>);