import * as React from "react";
import { Switch as RNSwitch, View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import tokens from "@fragment_ui/tokens/json";

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onCheckedChange,
  disabled = false,
  label,
  children,
  style,
  labelStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <RNSwitch
        value={checked}
        onValueChange={onCheckedChange}
        disabled={disabled}
        trackColor={{
          false: tokens.color.light.fg.muted,
          true: tokens.color.light.brand.primary,
        }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={tokens.color.light.fg.muted}
      />
      {(label || children) && (
        <Text
          style={[
            styles.label,
            {
              color: disabled
                ? tokens.color.light.fg.muted
                : tokens.color.light.fg.base,
              marginLeft: 12,
            },
            labelStyle,
          ]}
        >
          {label || children}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
});

