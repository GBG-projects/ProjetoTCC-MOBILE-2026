import React from "react";
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle, TextStyle } from "react-native";

interface SignInButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function SignInButton({ onPress, title = "Continuar", style, textStyle }: SignInButtonProps) {
  return (
    <TouchableOpacity style={[styles.ContinueButton, style]} onPress={onPress}>
      <Text style={[styles.ContinueButtonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ContinueButton: {
    backgroundColor: "#0046d2",
    width: "40%",
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
  ContinueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
