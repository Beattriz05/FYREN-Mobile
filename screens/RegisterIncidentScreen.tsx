import React, { useState } from 'react';
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
import { saveIncident, updateIncident } from '@/utils/storage';
import { Image } from 'expo-image';

type Props = NativeStackScreenProps<UserHomeStackParamList, 'RegisterIncident'>;

export default function RegisterIncidentScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const editingIncident = route.params?.incident;

  const [title, setTitle] = useState(editingIncident?.title || '');
  const [description, setDescription] = useState(editingIncident?.description || '');
  const [vehicle, setVehicle] = useState(editingIncident?.vehicle || '');
  const [team, setTeam] = useState(editingIncident?.team || '');
  const [type, setType] = useState(editingIncident?.type || 'Resgate');
  
  const [location, setLocation] = useState<Location.LocationObject | null>(
    editingIncident?.location ? { coords: { latitude: editingIncident.location.latitude, longitude: editingIncident.location.longitude } } as any : null
  );
  
  const [images, setImages] = useState<string[]>(editingIncident?.images || []);
  const [videos, setVideos] = useState<string[]>(editingIncident?.videos || []); // F-10
  const [signature, setSignature] = useState<string | null>(editingIncident?.signature || null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  // F-07: Máscara Simples para Viatura (Força letras maiúsculas e remove espaços)
  const handleVehicleChange = (text: string) => {
    setVehicle(text.toUpperCase().replace(/\s/g, ''));
  };

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: micStatus } = await ImagePicker.requestMicrophonePermissionsAsync();
    const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
    return cameraStatus === 'granted' && locStatus === 'granted' && micStatus === 'granted';
  };

  const captureLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      Alert.alert('GPS', 'Localização atualizada!');
    } catch { Alert.alert('Erro', 'Falha no GPS'); }
  };

  // F-05 (Foto) e F-10 (Vídeo)
  const captureMedia = async (mediaType: 'photo' | 'video') => {
    if (!await requestPermissions()) {
        Alert.alert('Permissão', 'Necessário acesso à câmera e microfone.');
        return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: mediaType === 'photo' 
        ? ImagePicker.MediaTypeOptions.Images 
        : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 0.5,
      videoMaxDuration: 60, // Limite de 60s para vídeo
    });

    if (!result.canceled && result.assets[0]) {
      if (mediaType === 'photo') {
        setImages([...images, result.assets[0].uri]);
      } else {
        setVideos([...videos, result.assets[0].uri]);
      }
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !vehicle || !team || !type) {
      Alert.alert('Campos Obrigatórios', 'Preencha Viatura, Equipe, Tipo e Título.');
      return;
    }
    if (!signature) {
      Alert.alert('Assinatura', 'A assinatura do responsável é obrigatória.');
      return;
    }

    setIsLoading(true);
    try {
      const incidentData = {
        title, description, vehicle, team, type, signature, images, videos,
        location: location ? { latitude: location.coords.latitude, longitude: location.coords.longitude } : undefined,
        status: editingIncident ? editingIncident.status : 'pending',
      };

      if (editingIncident?.id) {
        await updateIncident(editingIncident.id, incidentData as any);
      } else {
        await saveIncident({ ...incidentData, status: 'pending', syncStatus: 'pending_sync', createdAt: new Date().toISOString() } as any);
      }
      
      Alert.alert('Sucesso', 'Salvo com sucesso!', [{ text: 'OK', onPress: () => navigation.navigate('History') }]);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar.');
    } finally { setIsLoading(false); }
  };

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.container}>
        <Card style={styles.card}>
          <ThemedText style={styles.label}>Tipo de Ocorrência *</ThemedText>
          <View style={styles.typeRow}>
            {['Resgate', 'Incêndio', 'Salvamento'].map((t) => (
              <Pressable key={t} style={[styles.typeButton, { backgroundColor: type === t ? colors.primary : colors.backgroundDefault }]} onPress={() => setType(t)}>
                <ThemedText style={{ color: type === t ? colors.textLight : colors.text }}>{t}</ThemedText>
              </Pressable>
            ))}
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.label}>Viatura *</ThemedText>
              <TextInput 
                style={[styles.input, { borderColor: colors.border, color: colors.text }]} 
                value={vehicle} 
                onChangeText={handleVehicleChange} 
                placeholder="ABT-12" 
                placeholderTextColor={colors.tabIconDefault}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.label}>Equipe *</ThemedText>
              <TextInput 
                style={[styles.input, { borderColor: colors.border, color: colors.text }]} 
                value={team} 
                onChangeText={setTeam} 
                placeholder="Alfa" 
                placeholderTextColor={colors.tabIconDefault}
              />
            </View>
          </View>

          <ThemedText style={styles.label}>Título *</ThemedText>
          <TextInput 
            style={[styles.input, { borderColor: colors.border, color: colors.text }]} 
            value={title} 
            onChangeText={setTitle} 
            placeholder="Resumo" 
            placeholderTextColor={colors.tabIconDefault}
          />

          <ThemedText style={styles.label}>Descrição *</ThemedText>
          <TextInput 
            style={[styles.textArea, { borderColor: colors.border, color: colors.text }]} 
            value={description} 
            onChangeText={setDescription} 
            multiline 
            numberOfLines={4} 
            placeholder="Detalhes..." 
            placeholderTextColor={colors.tabIconDefault}
          />

          <View style={styles.actionRow}>
            <Pressable style={[styles.iconButton, { borderColor: colors.border }]} onPress={captureLocation}>
              <Feather name="map-pin" size={20} color={location ? colors.success : colors.secondary} />
              <ThemedText style={{fontSize: 10}}>GPS</ThemedText>
            </Pressable>
            <Pressable style={[styles.iconButton, { borderColor: colors.border }]} onPress={() => captureMedia('photo')}>
              <Feather name="camera" size={20} color={images.length > 0 ? colors.success : colors.secondary} />
              <ThemedText style={{fontSize: 10}}>Foto ({images.length})</ThemedText>
            </Pressable>
            <Pressable style={[styles.iconButton, { borderColor: colors.border }]} onPress={() => captureMedia('video')}>
              <Feather name="video" size={20} color={videos.length > 0 ? colors.success : colors.secondary} />
              <ThemedText style={{fontSize: 10}}>Vídeo ({videos.length})</ThemedText>
            </Pressable>
            <Pressable style={[styles.iconButton, { borderColor: colors.border }]} onPress={() => setShowSignatureModal(true)}>
              <Feather name="pen-tool" size={20} color={signature ? colors.success : colors.secondary} />
              <ThemedText style={{fontSize: 10}}>Assinar</ThemedText>
            </Pressable>
          </View>

          {/* Galeria de Fotos e Vídeos */}
          <View style={styles.mediaGrid}>
             {images.map((uri, idx) => (
               <Image key={`img-${idx}`} source={{ uri }} style={styles.thumbnail} />
             ))}
             {videos.map((uri, idx) => (
               <View key={`vid-${idx}`} style={[styles.thumbnail, { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }]}>
                 <Feather name="play-circle" size={24} color="#fff" />
               </View>
             ))}
          </View>

          {signature && (
            <Pressable onPress={() => setShowSignatureModal(true)} style={styles.signaturePreview}>
               <Image source={{ uri: signature }} style={{ width: '100%', height: 80 }} contentFit="contain" />
            </Pressable>
          )}

          <Pressable
            style={({ pressed }) => [styles.submitButton, { backgroundColor: colors.accent, opacity: pressed ? 0.8 : 1 }]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <ThemedText style={{ color: colors.textLight, fontSize: 18, fontWeight: '600' }}>
              {isLoading ? 'Salvando...' : 'Finalizar Registro'}
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
  iconButton: { alignItems: 'center', justifyContent: 'center', padding: Spacing.sm, borderRadius: BorderRadius.sm, borderWidth: 1, width: 70, gap: 4 },
  submitButton: { height: Spacing.buttonHeight, borderRadius: BorderRadius.sm, justifyContent: 'center', alignItems: 'center', marginTop: Spacing.lg },
  mediaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  thumbnail: { width: 60, height: 60, borderRadius: 4 },
  signaturePreview: { marginTop: Spacing.md, borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc', padding: 4 },
});