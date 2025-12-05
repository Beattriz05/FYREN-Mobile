// components/SettingRow.tsx
import React, { ReactNode } from 'react';
import { View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import Spacer from './Spacer';
import { useTheme } from '../hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme'; 

interface SettingRowProps {
  icon?: string;
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
  const { colors } = useTheme();
  
  const getIconColor = () => {
    if (type === 'danger') return colors.error || '#F44336'; // Usar colors.error
    return colors.textLight || '#9E9E9E';
  };

  const getTextColor = () => {
    if (type === 'danger') return colors.error || '#F44336';
    return colors.text || '#2c3e50';
  };

  const Content = (
    <View style={[styles.container, onPress && styles.pressable]}>
      {icon && (
        <>
          <MaterialIcons 
            name={icon as any} 
            size={24} 
            color={getIconColor()} 
            style={styles.icon} 
          />
          <Spacer size="s" horizontal />
        </>
      )}
      
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <ThemedText style={[styles.label, { color: getTextColor() }]}>
            {label}
          </ThemedText>
          {description && (
            <ThemedText type="caption" style={styles.description}>
              {description}
            </ThemedText>
          )}
          {value && typeof value === 'string' && (
            <ThemedText type="caption" style={styles.value}>
              {value}
            </ThemedText>
          )}
        </View>
        
        {children && <View style={styles.children}>{children}</View>}
        
        {showSwitch && (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ 
              false: colors.border || '#E0E0E0', 
              true: colors.primary || '#0E2345' 
            }}
            thumbColor={switchValue ? '#FFFFFF' : colors.backgroundTertiary || '#F5F5F5'}
          />
        )}
        
        {showChevron && (
          <MaterialIcons 
            name="chevron-right" 
            size={24} 
            color={colors.textLight || '#9E9E9E'} 
          />
        )}
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pressable: {
    backgroundColor: 'transparent',
  },
  icon: {
    width: 24,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  description: {
    opacity: 0.7,
    marginBottom: 4,
    fontSize: 14,
  },
  value: {
    opacity: 0.9,
    fontWeight: '500',
    fontSize: 14,
  },
  children: {
    marginLeft: 12,
  },
});

export default SettingRow;