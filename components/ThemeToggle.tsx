// components/ThemeToggle.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  value: 'light' | 'dark' | 'auto';
  onChange: (value: 'light' | 'dark' | 'auto') => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ value, onChange }) => {
  const { colors } = useTheme();
  
  const options = [
    { id: 'light', label: 'Claro', icon: 'wb-sunny' },
    { id: 'dark', label: 'Escuro', icon: 'nights-stay' },
    { id: 'auto', label: 'Auto', icon: 'brightness-auto' },
  ];

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.option,
            value === option.id && styles.optionActive,
            value === option.id && { backgroundColor: colors.bombeiros.primary + '20' },
          ]}
          onPress={() => onChange(option.id as 'light' | 'dark' | 'auto')}
          activeOpacity={0.7}
        >
          <Icon
            name={option.icon}
            size={20}
            color={value === option.id ? colors.bombeiros.primary : colors.onSurfaceVariant}
          />
          <Spacer size="xs" />
          <ThemedText
            style={[
              styles.optionLabel,
              value === option.id && { color: colors.bombeiros.primary, fontWeight: '600' },
            ]}
          >
            {option.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 4,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  optionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  optionLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ThemeToggle;