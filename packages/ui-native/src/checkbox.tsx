import * as React from "react";
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import tokens from "@fragment_ui/tokens/json";

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onCheckedChange,
  disabled = false,
  label,
  children,
  style,
  labelStyle,
}) => {
  const handlePress = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  const getBorderRadius = (): number => {
    const radius: unknown = tokens.radius.sm;
    if (typeof radius === "string") {
      return parseInt(radius.replace("px", ""), 10) || 4;
    }
    if (typeof radius === "number") {
      return radius;
    }
    return 4;
  };

  const borderRadius = getBorderRadius();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          {
            borderRadius,
            borderColor: checked
              ? tokens.color.light.brand.primary
              : tokens.color.light.fg.muted,
            backgroundColor: checked
              ? tokens.color.light.brand.primary
              : "transparent",
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        {checked && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </View>
      {(label || children) && (
        <Text
          style={[
            styles.label,
            {
              color: disabled
                ? tokens.color.light.fg.muted
                : tokens.color.light.fg.base,
            },
            labelStyle,
          ]}
        >
          {label || children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
});

