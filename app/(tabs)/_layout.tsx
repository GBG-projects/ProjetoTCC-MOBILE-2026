import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router, Stack, Tabs } from 'expo-router';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../contexts/useUser';

function HeaderAvatar() {
  const { user } = useUser();

  return (
    <TouchableOpacity onPress={() => router.push('/profile')} style={{ marginRight: 16 }}>
      {user?.foto ? (
        <Image
          source={{ uri: user.foto }}
          style={{ width: 45, height: 45, borderRadius: 22.5, borderWidth: 2, borderColor: '#fff' }}
        />
      ) : (
        <Ionicons name="person-circle-outline" size={45} color="#fff" />
      )}
    </TouchableOpacity>
  );
}


export default function ProtectedLayout() {
  
  return (
    < Tabs screenOptions={
      
      {
        headerTitleAlign: 'center',
        tabBarActiveTintColor:'#000000',
        tabBarInactiveTintColor: '#b4b4b4',
        headerStyle:{
          shadowColor:"#ce1414",
        },
        tabBarHideOnKeyboard: true,
        tabBarStyle:{
          backgroundColor: "#003D8C",
          height: 70
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 28,
          color: "white"
        },

      headerBackground: () => (
        <LinearGradient
          colors={['#14214f', '#2a398d']}
          style={{ flex: 1 }}
        />
      ),

      headerLeft: () => (
        <Image
          source={require('../../assets/images/focusIcon.png')}
          style={{ width: 50, height: 50, borderRadius: 8, marginLeft: 16 }}
        />
      ),

      headerRight: () => <HeaderAvatar />,

      }}>
      <Tabs.Screen name="rank" options={
        { title: 'Rank',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }
      } />
      <Tabs.Screen name="books" options={
        { title: 'Livros',
        tabBarIcon: ({color}) => <FontAwesome size={28} name='user' color={color}></FontAwesome>
        }
      } />
      <Tabs.Screen name="tests" options={
        { title: 'Provas',
        tabBarIcon: ({color}) => <FontAwesome size={28} name='user' color={color}></FontAwesome>
        }
      } />
      
    </Tabs>
  );
}