import { FontAwesome } from "@expo/vector-icons";
import { router, Tabs, useLocalSearchParams } from "expo-router";
import { Pressable } from "react-native";

export default function ProtectedLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1f297d",
        tabBarInactiveTintColor: "#b4b4b4",
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: "#5f81fd",
          height: 70,
        },
        headerStyle: {
          backgroundColor: "#2441a7",
          shadowColor: "#000000",
          height: 120,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 28,
        },
        headerLeft: () => (
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={{ marginLeft: 16 }}
          >
            <FontAwesome name="chevron-left" size={22} color="#fff" />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="userProfile"
        options={{
          title: "Perfil do Usuário",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
        initialParams={{ id }}
      />
      <Tabs.Screen
        name="performance"
        options={{
          title: "Desempenho do Usuário",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="bar-chart" color={color} />
          ),
        }}
        initialParams={{ id }}
      />
    </Tabs>
  );
}