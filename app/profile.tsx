import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState, type ComponentProps } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { clearUser, useUser } from "@/contexts/useUser";

const TOKEN_KEY = "token";
const USUARIO_KEY = "usuario";

const ROTA_LOGIN = "/signin";

type NomeIcone = ComponentProps<typeof Ionicons>["name"];

interface LinhaInfo {
  icone: NomeIcone;
  rotulo: string;
  valor: string;
}

import CORES from "@/app/constants/cores"

const ROTULO_ROLE: Record<string, string> = {
  estudante: "Estudante",
  admin: "Administrador",
};

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

function formatarData(valor?: string) {
  if (!valor) return null;
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return null;
  return data.toLocaleDateString("pt-BR");
}

export default function Perfil() {
  const router = useRouter();
  const { user: usuario, loading: carregando, refetch } = useUser();

  const [atualizando, setAtualizando] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const [fotoFalhou, setFotoFalhou] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    setFotoFalhou(false);
  }, [usuario?.foto]);

  const atualizar = useCallback(async () => {
    setAtualizando(true);
    await refetch();
    setAtualizando(false);
  }, [refetch]);

  const irParaLogin = useCallback(() => {
    router.replace(ROTA_LOGIN);
  }, [router]);

  const confirmarSaida = useCallback(async () => {
    setSaindo(true);
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(USUARIO_KEY),
      ]);
      clearUser(); 
      irParaLogin();
    } catch (error) {
      console.error("Erro ao sair:", error);
      Alert.alert("Erro", "Não foi possível sair da conta. Tente novamente.");
      setSaindo(false);
    }
  }, [irParaLogin]);

  const sair = useCallback(() => {
    Alert.alert("Sair da conta", "Tem certeza de que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: confirmarSaida },
    ]);
  }, [confirmarSaida]);

  const linhas: LinhaInfo[] = [];
  if (usuario) {
    linhas.push({
      icone: "mail-outline",
      rotulo: "E-mail",
      valor: usuario.email,
    });
    linhas.push({
      icone: "shield-checkmark-outline",
      rotulo: "Tipo de conta",
      valor: ROTULO_ROLE[usuario.role] ?? usuario.role,
    });
    const desde = formatarData(usuario.created_at);
    if (desde) {
      linhas.push({
        icone: "calendar-outline",
        rotulo: "Membro desde",
        valor: desde,
      });
    }
  }

  const mostrarFoto = !!usuario?.foto && !fotoFalhou;

  return (
    <LinearGradient
      colors={CORES.gradiente}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View pointerEvents="none" style={styles.blobTopRight} />
      <View pointerEvents="none" style={styles.blobBottomLeft} />

      <SafeAreaView edges={["left", "right", "bottom"]} style={styles.safeArea}>
        {carregando ? (
          <ActivityIndicator
            color={CORES.branco}
            size="large"
            style={{ marginTop: 40 }}
          />
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={atualizando}
                onRefresh={atualizar}
                tintColor={CORES.branco}
                colors={[CORES.destaque]}
              />
            }
          >
            {usuario ? (
              <>
                <View style={styles.cabecalho}>
                  {mostrarFoto ? (
                    <Image
                      source={{ uri: usuario.foto as string }}
                      style={styles.avatarImg}
                      onError={() => setFotoFalhou(true)}
                    />
                  ) : (
                    <View style={styles.avatar}>
                      <Text style={styles.avatarTexto}>
                        {iniciais(usuario.nome)}
                      </Text>
                    </View>
                  )}

                  <Text style={styles.nome} numberOfLines={2}>
                    {usuario.nome}
                  </Text>
                  <View style={styles.selo}>
                    <Text style={styles.seloTexto}>
                      {ROTULO_ROLE[usuario.role] ?? usuario.role}
                    </Text>
                  </View>
                </View>

                <View style={styles.secao}>
                  <Text style={styles.secaoTitulo}>Informações da conta</Text>
                  {linhas.map((linha, i) => (
                    <View
                      key={linha.rotulo}
                      style={[
                        styles.linha,
                        i === linhas.length - 1 && styles.linhaUltima,
                      ]}
                    >
                      <View style={styles.linhaIcone}>
                        <Ionicons
                          name={linha.icone}
                          size={18}
                          color={CORES.branco}
                        />
                      </View>
                      <View style={styles.linhaTextos}>
                        <Text style={styles.linhaRotulo}>{linha.rotulo}</Text>
                        <Text style={styles.linhaValor}>{linha.valor}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.btnSair, saindo && styles.btnDesabilitado]}
                  activeOpacity={0.85}
                  disabled={saindo}
                  onPress={sair}
                >
                  {saindo ? (
                    <ActivityIndicator color={CORES.perigoTexto} />
                  ) : (
                    <>
                      <Ionicons
                        name="log-out-outline"
                        size={20}
                        color={CORES.perigoTexto}
                      />
                      <Text style={styles.btnSairTexto}>Sair da conta</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.vazio}>
                <Ionicons
                  name="person-circle-outline"
                  size={64}
                  color={CORES.textoSecundario}
                />
                <Text style={styles.vazioTexto}>
                  Não foi possível carregar os dados do usuário.
                </Text>
                <TouchableOpacity
                  style={styles.btnEntrar}
                  activeOpacity={0.85}
                  onPress={refetch}
                >
                  <Text style={styles.btnEntrarTexto}>Tentar novamente</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnEntrar}
                  activeOpacity={0.85}
                  onPress={irParaLogin}
                >
                  <Text style={styles.btnEntrarTexto}>Entrar novamente</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
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
  },
  scroll: {
    width: "100%",
  },
  scrollContent: {
    width: "92%",
    alignSelf: "center",
    paddingTop: 24,
    paddingBottom: 32,
    gap: 16,
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

  cabecalho: {
    alignItems: "center",
    paddingVertical: 8,
    gap: 10,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: CORES.card,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
  },
  avatarTexto: {
    color: CORES.branco,
    fontSize: 32,
    fontWeight: "700",
  },
  nome: {
    color: CORES.branco,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  selo: {
    backgroundColor: CORES.fantasma,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  seloTexto: {
    color: CORES.branco,
    fontSize: 13,
    fontWeight: "600",
  },

  secao: {
    backgroundColor: CORES.painel,
    borderWidth: 1,
    borderColor: CORES.bordaFraca,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  secaoTitulo: {
    color: CORES.branco,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: CORES.bordaFraca,
  },
  linhaUltima: {
    borderBottomWidth: 0,
  },
  linhaIcone: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: CORES.fantasma,
    borderWidth: 1,
    borderColor: CORES.borda,
    alignItems: "center",
    justifyContent: "center",
  },
  linhaTextos: {
    flex: 1,
  },
  linhaRotulo: {
    color: CORES.textoSecundario,
    fontSize: 12,
  },
  linhaValor: {
    color: CORES.branco,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 2,
  },

  btnSair: {
    borderWidth: 1,
    borderColor: CORES.perigo,
    backgroundColor: "rgba(220, 38, 38, 0.12)",
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnSairTexto: {
    color: CORES.perigoTexto,
    fontWeight: "700",
    fontSize: 14,
  },
  btnDesabilitado: {
    opacity: 0.5,
  },

  vazio: {
    alignItems: "center",
    gap: 14,
    marginTop: 40,
  },
  vazioTexto: {
    color: CORES.textoSecundario,
    textAlign: "center",
    fontSize: 14,
  },
  btnEntrar: {
    backgroundColor: CORES.destaque,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  btnEntrarTexto: {
    color: CORES.branco,
    fontWeight: "700",
    fontSize: 14,
  },
} satisfies Record<string, ViewStyle | TextStyle | ImageStyle>);