import { Stack } from "expo-router";

export default function UserStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="Relatorio/[id]/index"
        options={{
          title: "Relatório",
          headerStyle: { backgroundColor: "#2441a7" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </Stack>
  );
}