import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function ProtectedLayout() {
  const isAuthenticated = false; // provisório – mude para true para testar home
  const isLoading = false;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // Usuário logado → mostra as rotas protegidas
  return (
    <Stack screenOptions={{ headerStyle: {
      backgroundColor:"red"
    } }}>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      {/* <Stack.Screen name="profile" options={{ title: 'Perfil' }} /> */}
    </Stack>
  );
}