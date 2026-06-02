import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function ProtectedLayout() {
  return (
    < Tabs screenOptions={
      
      {
        tabBarActiveTintColor:'#1f297d',
        tabBarInactiveTintColor: '#b4b4b4',
        headerStyle:{
          backgroundColor: "#2441a7",
          shadowColor:"#000000",
          height: 120
        },
        tabBarHideOnKeyboard: true,
        tabBarStyle:{
          backgroundColor: "#5f81fd",
          height: 70
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 28,
        },
      }}>
          <Tabs.Screen name="userProfile" options={
            { title: 'Perfil do Usuário',
            tabBarIcon: ({color}) => <FontAwesome size={28} name='user' color={color}></FontAwesome>
            }
          } />
      <Tabs.Screen name="performance" options={
        { title: 'Desempenho do Usuário',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }
      } />
     
    
    </Tabs>
  );
}