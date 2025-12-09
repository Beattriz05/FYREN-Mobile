import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
// Se você não tiver o ThemedText ainda, use Text normal do RN
import { ThemedText } from '@/components/ThemedText'; 

export type ErrorFallbackProps = {
  error: Error;
  resetError: () => void;
};

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  // Hook de tema para cores dinâmicas
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundRoot }]}>
      <View style={styles.content}>
        <Feather name="alert-triangle" size={48} color={colors.error || '#FF0000'} />
        
        <ThemedText type="title" style={styles.title}>
          Ops! Algo deu errado.
        </ThemedText>
        
        <ThemedText style={[styles.message, { color: colors.textLight }]}>
          {error.toString()}
        </ThemedText>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={resetError}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    marginTop: 10,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});