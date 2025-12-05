import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons'; // Importar MaterialIcons
import Spacer from './Spacer'; // Importar Spacer

interface ThemeToggleProps {
  value: 'light' | 'dark' | 'auto';
  onChange: (value: 'light' | 'dark' | 'auto') => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ value, onChange }) => {
  const { colors } = useTheme();
  
  const options = [
    { id: 'light' as const, label: 'Claro', icon: 'wb-sunny' as const },
    { id: 'dark' as const, label: 'Escuro', icon: 'nights-stay' as const },
    { id: 'auto' as const, label: 'Auto', icon: 'brightness-auto' as const },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundTertiary || 'rgba(0,0,0,0.05)' }]}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.option,
            value === option.id && styles.optionActive,
            value === option.id && { backgroundColor: colors.bombeiros?.primary + '20' },
          ]}
          onPress={() => onChange(option.id)}
          activeOpacity={0.7}
        >
          <MaterialIcons // Alterado de Icon para MaterialIcons
            name={option.icon}
            size={20}
            color={value === option.id ? colors.bombeiros?.primary : colors.textLight}
          />
          <Spacer size={4} /> {/* Alterado para número, já que o Spacer aceita number */}
          <ThemedText
            style={[
              styles.optionLabel,
              value === option.id && { 
                color: colors.bombeiros?.primary || colors.primary, 
                fontWeight: '600' 
              },
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