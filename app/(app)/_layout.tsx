import { Redirect, Stack, Tabs } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function ProtectedLayout() {
  const isAuthenticated = true; 
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
    < Tabs screenOptions={{ headerStyle: {
      backgroundColor:"red"
    } }}>
      <Tabs.Screen name="index" options={{ title: 'Pagina Principal' }} />
      <Tabs.Screen name="configuracao" options={{ title: 'Configurações' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
      {/* <Stack.Screen name="profile" options={{ title: 'Perfil' }} /> */}
    </Tabs>
  );
}