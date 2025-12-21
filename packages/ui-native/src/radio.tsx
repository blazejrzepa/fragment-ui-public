import * as React from "react";
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import tokens from "@fragment_ui/tokens/json";

export interface RadioProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  children?: React.ReactNode;
  value?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export const Radio: React.FC<RadioProps> = ({
  checked = false,
  onCheckedChange,
  disabled = false,
  label,
  children,
  value,
  style,
  labelStyle,
}) => {
  const handlePress = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.radio,
          {
            borderColor: checked
              ? tokens.color.light.brand.primary
              : tokens.color.light.fg.muted,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        {checked && (
          <View
            style={[
              styles.radioInner,
              {
                backgroundColor: tokens.color.light.brand.primary,
              },
            ]}
          />
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

export interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onValueChange,
  children,
  style,
}) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<RadioProps>(child)) {
      return React.cloneElement(child, {
        checked: child.props.value === value,
        onCheckedChange: (checked: boolean) => {
          if (checked && child.props.value && onValueChange) {
            onValueChange(child.props.value);
          }
        },
      });
    }
    return child;
  });

  return <View style={[styles.group, style]}>{childrenWithProps}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
  group: {
    gap: 12,
  },
});

