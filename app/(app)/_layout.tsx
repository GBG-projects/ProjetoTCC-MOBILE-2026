import { FontAwesome } from '@expo/vector-icons';
import { Redirect, Stack, Tabs } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function ProtectedLayout() {
  const isAuthenticated = false; 
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
    < Tabs screenOptions={{tabBarActiveTintColor:'#ff0d0d'}}>
      <Tabs.Screen name="index" options={
        { title: 'Pagina Principal',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }
      } />
      <Tabs.Screen name="configuracao" options={
        { title: 'Configurações', 
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} /> 
        }
      } />
      <Tabs.Screen name="perfil" options={
        { title: 'Perfil',
        tabBarIcon: ({color}) => <FontAwesome size={28} name='user' color={color}></FontAwesome>
        }
      } />
      {/* <Stack.Screen name="profile" options={{ title: 'Perfil' }} /> */}
    </Tabs>
  );
}