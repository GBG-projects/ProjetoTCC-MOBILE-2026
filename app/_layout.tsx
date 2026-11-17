import { Stack } from 'expo-router';


export const unstable_settings = {
  initialRouteName: '/index', 
};

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(userTabs)" options={{ headerShown: false }} />
      <Stack.Screen name="forgetPassword" options={{ headerShown: false}}/>
      
    </Stack>
  );
}