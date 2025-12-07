import React, { useRef } from 'react';
import { Modal, StyleSheet, View, Button } from 'react-native';
import SignatureScreen, {
  SignatureViewRef,
} from 'react-native-signature-canvas';
import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from './ThemedText';
import { Spacing, BorderRadius } from '@/constants/theme';

interface Props {
  visible: boolean;
  onOK: (signature: string) => void;
  onCancel: () => void;
}

export function SignatureModal({ visible, onOK, onCancel }: Props) {
  const ref = useRef<SignatureViewRef>(null);
  const { colors } = useTheme();

  const handleOK = (signature: string) => {
    onOK(signature); // Retorna string base64
  };

  const handleClear = () => {
    ref.current?.clearSignature();
  };

  const handleConfirm = () => {
    ref.current?.readSignature();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View
          style={[
            styles.container,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <ThemedText type="h4" style={styles.title}>
            Assinatura do Responsável
          </ThemedText>

          <View style={styles.canvasContainer}>
            <SignatureScreen
              ref={ref}
              onOK={handleOK}
              webStyle={`.m-signature-pad--footer {display: none; margin: 0px;}`}
            />
          </View>

          <View style={styles.buttonRow}>
            <Button title="Limpar" onPress={handleClear} color={colors.error} />
            <Button
              title="Cancelar"
              onPress={onCancel}
              color={colors.tabIconDefault}
            />
            <Button
              title="Confirmar"
              onPress={handleConfirm}
              color={colors.primary}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', padding: Spacing.lg },
  container: {
    height: 400,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  title: { marginBottom: Spacing.md, textAlign: 'center' },
  canvasContainer: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around' },
});
