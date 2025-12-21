import * as React from "react";
import { TextInput, StyleSheet, Text, View, TextInputProps, ViewStyle, TextStyle } from "react-native";
import tokens from "@fragment_ui/tokens/json";

export interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  style?: TextStyle;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  function Input(
    {
      label,
      error,
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      style,
      placeholderTextColor,
      ...props
    },
    ref
  ) {
    const getBorderRadius = (): number => {
      const radius: unknown = tokens.radius.md;
      if (typeof radius === "string") {
        return parseInt(radius.replace("px", ""), 10) || 12;
      }
      if (typeof radius === "number") {
        return radius;
      }
      return 12;
    };
    const borderRadius = getBorderRadius();

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, labelStyle]}>{label}</Text>
        )}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              borderRadius,
              borderColor: error ? tokens.color.light.accent.red : tokens.color.light.fg.muted,
            },
            inputStyle,
            style,
          ]}
          placeholderTextColor={placeholderTextColor || tokens.color.light.fg.muted}
          {...props}
        />
        {error && (
          <Text style={[styles.error, errorStyle]}>{error}</Text>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: tokens.color.light.fg.base,
    marginBottom: 8,
  },
  input: {
    height: 40,
    paddingHorizontal: 12,
    fontSize: 14,
    color: tokens.color.light.fg.base,
    backgroundColor: tokens.color.light.surface[1],
    borderWidth: 1,
  },
  error: {
    fontSize: 12,
    color: tokens.color.light.accent.red,
    marginTop: 4,
  },
});

