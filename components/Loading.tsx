import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Easing, StyleSheet, Text, View } from "react-native";

type Props = {
  visible?: boolean;
  message?: string;
  inline?: boolean;
};

export default function LoadingScreen({
  visible = true,
  message = "Carregando...",
  inline = false,
}: Props) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [visible, pulse]);

  if (!visible) return null;

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

  return (
    <View
      style={[styles.container, inline ? styles.inline : styles.fullscreen]}
      pointerEvents="auto"
    >
      <Animated.View style={[styles.iconWrapper, { transform: [{ scale }], opacity }]}>
        <FontAwesome name="bar-chart" size={inline ? 32 : 56} color="#fff" />
      </Animated.View>

      <ActivityIndicator size="large" color="#fff" style={styles.spinner} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  fullscreen: {
      position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(36, 65, 167, 0.95)",
    zIndex: 999,
    elevation: 999, // necessário no Android
  },
  inline: {
      position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(36, 65, 167, 0.85)",
    borderRadius: 12,
    zIndex: 10,
  },
  iconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5f81fd",
    marginBottom: 24,
  },
  spinner: { marginBottom: 12 },
  message: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});