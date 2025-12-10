import React, { ReactNode } from 'react';
import { View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';

interface SettingRowProps {
  icon?: keyof typeof MaterialIcons.glyphMap; // Tipagem correta para ícones
  label: string;
  description?: string;
  value?: string | boolean;
  onPress?: () => void;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  showChevron?: boolean;
  children?: ReactNode;
  type?: 'default' | 'danger';
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  label,
  description,
  value,
  onPress,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
  showChevron = false,
  children,
  type = 'default',
}) => {
  const { colors, isDark } = useTheme();

  // LÓGICA DE COR CORRIGIDA:
  // Se for 'danger', usa vermelho.
  // Se não, usa colors.text (Azul no Claro, Branco no Escuro)
  // Ou usa colors.secondary (Laranja) se quiser destaque
  const baseColor = type === 'danger' ? (colors.error || '#EF4444') : colors.text;
  
  // Cor secundária para descrição e chevron
  const subColor = isDark ? '#94A3B8' : '#64748B'; 

  const Content = (
    <View style={styles.container}>
      {icon && (
        <View style={styles.iconContainer}>
          {/* O segredo está aqui: baseColor garante o contraste */}
          <MaterialIcons name={icon} size={24} color={baseColor} />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <ThemedText style={[styles.label, { color: baseColor }]}>
            {label}
          </ThemedText>
          {description && (
            <ThemedText style={[styles.description, { color: subColor }]}>
              {description}
            </ThemedText>
          )}
        </View>

        <View style={styles.rightContent}>
          {value && typeof value === 'string' && (
            <ThemedText style={[styles.value, { color: subColor }]}>
              {value}
            </ThemedText>
          )}
          
          {children}

          {showSwitch && (
            <Switch
              value={switchValue}
              onValueChange={onSwitchChange}
              // Cores do Switch ajustadas para o tema
              trackColor={{ false: isDark ? '#334155' : '#E2E8F0', true: colors.primary }}
              thumbColor={'#FFFFFF'}
            />
          )}

          {showChevron && (
            <MaterialIcons name="chevron-right" size={24} color={subColor} />
          )}
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
        {Content}
      </TouchableOpacity>
    );
  }

  return Content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16, // Aumentei um pouco para facilitar o toque
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 16,
    width: 24,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 12,
    marginTop: 4,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 14,
    marginRight: 8,
    textAlign: 'right',
  },
});

export default SettingRow;