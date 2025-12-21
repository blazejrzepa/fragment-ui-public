import * as React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import type { TouchableOpacityProps, TextStyle, ViewStyle } from "react-native";
import tokens from "@fragment_ui/tokens/json";

type Variant = "solid" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const getSizeStyles = (size: Size): { height: number; paddingHorizontal: number; fontSize: number } => {
  switch (size) {
    case "sm":
      return { height: 32, paddingHorizontal: 12, fontSize: 14 };
    case "lg":
      return { height: 48, paddingHorizontal: 20, fontSize: 16 };
    default:
      return { height: 40, paddingHorizontal: 16, fontSize: 14 };
  }
};

const getVariantStyles = (variant: Variant): {
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
  color: string;
} => {
  const brandColor = tokens.color.light.brand.primary;
  
  switch (variant) {
    case "outline":
      return {
        backgroundColor: "transparent",
        borderColor: tokens.color.light.fg.muted,
        borderWidth: 1,
        color: tokens.color.light.fg.base,
      };
    case "ghost":
      return {
        backgroundColor: "transparent",
        color: tokens.color.light.fg.base,
      };
    default:
      return {
        backgroundColor: brandColor,
        color: "#FFFFFF",
      };
  }
};

export const Button: React.FC<ButtonProps> = ({
  variant = "solid",
  size = "md",
  children,
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...props
}) => {
  const sizeStyles = getSizeStyles(size);
  const variantStyles = getVariantStyles(variant);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          height: sizeStyles.height,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
          borderWidth: variantStyles.borderWidth || 0,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyles.color} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              fontSize: sizeStyles.fontSize,
              color: variantStyles.color,
            },
            textStyle,
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

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

const styles = StyleSheet.create({
  button: {
    borderRadius: getBorderRadius(),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontWeight: "500",
  },
});

