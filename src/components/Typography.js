import React from "react";
import { Text } from "react-native";
import { theme } from "../styles/theme";

export const Typography = {
  Header: ({ children, style, color, ...props }) => {
    return (
      <Text
        style={[
          theme.typography.header,
          { color: color || theme.colors.text.primary },
          style,
        ]}
        {...props}
      >
        {children}
      </Text>
    );
  },
  SubHeader: ({ children, style, color, ...props }) => {
    return (
      <Text
        style={[
          theme.typography.subHeader,
          { color: color || theme.colors.text.primary },
          style,
        ]}
        {...props}
      >
        {children}
      </Text>
    );
  },
  Body: ({ children, style, color, ...props }) => {
    return (
      <Text
        style={[
          theme.typography.body,
          { color: color || theme.colors.text.primary },
          style,
        ]}
        {...props}
      >
        {children}
      </Text>
    );
  },
  Caption: ({ children, style, color, ...props }) => {
    return (
      <Text
        style={[
          theme.typography.caption,
          { color: color || theme.colors.text.muted },
          style,
        ]}
        {...props}
      >
        {children}
      </Text>
    );
  },
};
