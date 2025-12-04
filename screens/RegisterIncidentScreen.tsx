import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ScreenKeyboardAwareScrollView } from '@/components/ScreenKeyboardAwareScrollView';
import { SignatureModal } from '@/components/SignatureModal';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserHomeStackParamList } from '@/navigation/UserHomeStackNavigator';
import { saveIncident, updateIncident } from '@/utils/storage'; // Importe updateIncident
import { Image } from 'expo-image';

type Props = NativeStackScreenProps<UserHomeStackParamList, 'RegisterIncident'>;

export default function RegisterIncidentScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const editingIncident = route.params?.incident; // Verifica se é edição

  // Inicializa estados com dados existentes (se houver) ou vazios
  const [title, setTitle] = useState(editingIncident?.title || '');
  const [description, setDescription] = useState(editingIncident?.description || '');
  const [vehicle, setVehicle] = useState(editingIncident?.vehicle || '');
  const [team, setTeam] = useState(editingIncident?.team || '');
  const [type, setType] = useState(editingIncident?.type || 'Resgate');
  
  const [location, setLocation] = useState<Location.LocationObject | null>(
    editingIncident?.location ? { 
      coords: { 
        latitude: editingIncident.location.latitude, 
        longitude: editingIncident.location.longitude 
      } 
    } as any : null
  );
  
  const [images, setImages] = useState<string[]>(editingIncident?.images || []);
  const [signature, setSignature] = useState<string | null>(editingIncident?.signature || null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  // Permissões e Capturas (GPS/Camera) permanecem iguais
  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const locationPermission = await Location.requestForegroundPermissionsAsync();
    return cameraPermission.status === 'granted' && locationPermission.status === 'granted';
  };

  const captureLocation = async () => {
    if (!await requestPermissions()) {
        Alert.alert('Permissões', 'Necessário acesso à localização.');
        return;
    }
    try {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      Alert.alert('Sucesso', 'Localização atualizada!');
    } catch {
      Alert.alert('Erro', 'Falha ao obter GPS.');
    }
  };

  const takePicture = async () => {
    if (!await requestPermissions()) {
        Alert.alert('Permissões', 'Necessário acesso à câmera.');
        return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !vehicle || !team || !type) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }
    if (!signature) {
      Alert.alert('Atenção', 'A assinatura é obrigatória.');
      return;
    }

    setIsLoading(true);
    try {
      const incidentData = {
        title,
        description,
        vehicle,
        team,
        type,
        signature,
        location: location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        } : undefined,
        images,
        status: editingIncident ? editingIncident.status : 'pending', // Mantém status original se editando
        // F-09: Ao editar, o storage.ts já define syncStatus = 'pending_sync' automaticamente
      };

      if (editingIncident?.id) {
        // MODO EDIÇÃO
        await updateIncident(editingIncident.id, incidentData as any);
        Alert.alert('Atualizado', 'Ocorrência atualizada com sucesso!', [
          { text: 'OK', onPress: () => navigation.navigate('History') },
        ]);
      } else {
        // MODO CRIAÇÃO
        await saveIncident({
            ...incidentData,
            status: 'pending',
            syncStatus: 'pending_sync',
            createdAt: new Date().toISOString()
        } as any);
        Alert.alert('Registrado', 'Ocorrência criada com sucesso!', [
          { text: 'OK', onPress: () => navigation.navigate('History') },
        ]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar dados.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.container}>
        <Card style={styles.card}>
          <ThemedText style={[styles.label, { color: theme.text }]}>Tipo de Ocorrência *</ThemedText>
          <View style={styles.typeRow}>
            {['Resgate', 'Incêndio', 'Salvamento'].map((t) => (
              <Pressable
                key={t}
                style={[
                  styles.typeButton,
                  { backgroundColor: type === t ? theme.primary : theme.backgroundDefault }
                ]}
                onPress={() => setType(t)}
              >
                <ThemedText style={{ color: type === t ? theme.textLight : theme.text }}>{t}</ThemedText>
              </Pressable>
            ))}
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.label, { color: theme.text }]}>Viatura *</ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: theme.backgroundSecondary, color: theme.text, borderColor: theme.border }]}
                value={vehicle}
                onChangeText={setVehicle}
                placeholder="Ex: ABT-12"
                placeholderTextColor={theme.tabIconDefault}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.label, { color: theme.text }]}>Equipe *</ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: theme.backgroundSecondary, color: theme.text, borderColor: theme.border }]}
                value={team}
                onChangeText={setTeam}
                placeholder="Ex: Alfa"
                placeholderTextColor={theme.tabIconDefault}
              />
            </View>
          </View>

          <ThemedText style={[styles.label, { color: theme.text }]}>Título *</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundSecondary, color: theme.text, borderColor: theme.border }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Resumo"
            placeholderTextColor={theme.tabIconDefault}
          />

          <ThemedText style={[styles.label, { color: theme.text }]}>Descrição *</ThemedText>
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.backgroundSecondary, color: theme.text, borderColor: theme.border }]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholder="Detalhes..."
            placeholderTextColor={theme.tabIconDefault}
          />

          <View style={styles.actionRow}>
            <Pressable style={[styles.iconButton, { borderColor: theme.border }]} onPress={captureLocation}>
              <Feather name="map-pin" size={20} color={location ? theme.success : theme.secondary} />
              <ThemedText style={{fontSize: 12}}>GPS</ThemedText>
            </Pressable>
            <Pressable style={[styles.iconButton, { borderColor: theme.border }]} onPress={takePicture}>
              <Feather name="camera" size={20} color={images.length > 0 ? theme.success : theme.secondary} />
              <ThemedText style={{fontSize: 12}}>Foto ({images.length})</ThemedText>
            </Pressable>
            <Pressable style={[styles.iconButton, { borderColor: theme.border }]} onPress={() => setShowSignatureModal(true)}>
              <Feather name="pen-tool" size={20} color={signature ? theme.success : theme.secondary} />
              <ThemedText style={{fontSize: 12}}>Assinar</ThemedText>
            </Pressable>
          </View>

          {/* Galeria simples para remover fotos se necessário */}
          <View style={styles.imageGrid}>
             {images.map((uri, idx) => (
               <Pressable key={idx} onPress={() => {
                 // Remover foto ao clicar (opcional)
                 Alert.alert('Remover', 'Excluir esta foto?', [
                   { text: 'Não', style: 'cancel' },
                   { text: 'Sim', onPress: () => setImages(images.filter((_, i) => i !== idx)) }
                 ]);
               }}>
                 <Image source={{ uri }} style={styles.thumbnail} />
               </Pressable>
             ))}
          </View>

          {signature && (
            <Pressable onPress={() => setShowSignatureModal(true)} style={styles.signaturePreview}>
               <Image source={{ uri: signature }} style={{ width: '100%', height: 80 }} contentFit="contain" />
            </Pressable>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              { backgroundColor: theme.accent, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <ThemedText style={[styles.submitText, { color: theme.textLight }]}>
              {isLoading ? 'Processando...' : (editingIncident ? 'Salvar Alterações' : 'Registrar')}
            </ThemedText>
          </Pressable>
        </Card>

        <SignatureModal
          visible={showSignatureModal}
          onOK={(sig) => { setSignature(sig); setShowSignatureModal(false); }}
          onCancel={() => setShowSignatureModal(false)}
        />
      </View>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg },
  card: { padding: Spacing.xl, gap: Spacing.md },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  input: { height: Spacing.inputHeight, borderRadius: BorderRadius.sm, paddingHorizontal: Spacing.md, fontSize: 16, borderWidth: 1 },
  textArea: { minHeight: 100, borderRadius: BorderRadius.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, fontSize: 16, borderWidth: 1, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: Spacing.md },
  typeRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  typeButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: 'transparent' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md },
  iconButton: { alignItems: 'center', justifyContent: 'center', padding: Spacing.sm, borderRadius: BorderRadius.sm, borderWidth: 1, width: 80, gap: 4 },
  submitButton: { height: Spacing.buttonHeight, borderRadius: BorderRadius.sm, justifyContent: 'center', alignItems: 'center', marginTop: Spacing.lg },
  submitText: { fontSize: 18, fontWeight: '600' },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  thumbnail: { width: 60, height: 60, borderRadius: 4 },
  signaturePreview: { marginTop: Spacing.md, borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc', padding: 4 },
});