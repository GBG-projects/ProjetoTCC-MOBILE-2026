import React from "react";
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle, TextStyle } from "react-native";

interface SignInButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function SignInButton({ onPress, title = "Entrar", style, textStyle }: SignInButtonProps) {
  return (
    <TouchableOpacity style={[styles.signInButton, style]} onPress={onPress}>
      <Text style={[styles.signInButtonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  signInButton: {
    backgroundColor: "#0046d2",
    width: "50%",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signInButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
