import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
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

// Tipos para Incident (se não estiverem definidos no storage)
export type IncidentStatus = 'pending' | 'in_progress' | 'resolved';
export type SyncStatus = 'pending_sync' | 'synced';

export interface IncidentData {
  id: string;
  title: string;
  description: string;
  vehicle: string;
  team: string;
  type: string;
  signature: string | null;
  images: string[];
  videos: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
  status: IncidentStatus;
  syncStatus: SyncStatus;
  createdAt: string;
  updatedAt: string;
}

type Props = NativeStackScreenProps<UserHomeStackParamList, 'RegisterIncident'>;

export default function RegisterIncidentScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const editingIncident = route.params?.incident;

  const [title, setTitle] = useState(editingIncident?.title || '');
  const [description, setDescription] = useState(
    editingIncident?.description || '',
  );
  const [vehicle, setVehicle] = useState(editingIncident?.vehicle || '');
  const [team, setTeam] = useState(editingIncident?.team || '');
  const [type, setType] = useState(editingIncident?.type || 'Resgate');

  const [location, setLocation] = useState<Location.LocationObject | null>(
    editingIncident?.location
      ? ({
          coords: {
            latitude: editingIncident.location.latitude,
            longitude: editingIncident.location.longitude,
          },
        } as Location.LocationObject)
      : null,
  );

  const [images, setImages] = useState<string[]>(editingIncident?.images || []);
  const [videos, setVideos] = useState<string[]>(editingIncident?.videos || []);
  const [signature, setSignature] = useState<string | null>(
    editingIncident?.signature || null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isTakingMedia, setIsTakingMedia] = useState(false);

  // F-07: Máscara Simples para Viatura
  const handleVehicleChange = (text: string) => {
    // Permite apenas letras, números e hífen, em maiúsculas
    const formatted = text.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setVehicle(formatted);
  };

  const requestPermissions = async () => {
    try {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: micStatus } = await Audio.requestPermissionsAsync();
      const { status: locStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (cameraStatus !== 'granted') {
        Alert.alert(
          'Permissão da Câmera',
          'É necessário acesso à câmera para capturar fotos e vídeos.',
        );
        return false;
      }
      if (micStatus !== 'granted') {
        Alert.alert(
          'Permissão do Microfone',
          'É necessário acesso ao microfone para gravar vídeos.',
        );
        return false;
      }
      if (locStatus !== 'granted') {
        Alert.alert(
          'Permissão de Localização',
          'É necessário acesso à localização para registrar a posição.',
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      Alert.alert('Erro', 'Não foi possível solicitar permissões.');
      return false;
    }
  };

  const captureLocation = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      setIsTakingMedia(true);

      // CORREÇÃO: Removida a propriedade 'timeout' que não existe em LocationOptions
      // Usando apenas propriedades válidas: accuracy, maximumAge, distanceInterval
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        maximumAge: 10000, // Aceita localização com até 10 segundos -- resolver esse erro na parte de localização
        distanceInterval: 10, // Atualizar apenas após mover 10 metros
      });

      setLocation(loc);
      Alert.alert('Sucesso', 'Localização atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao capturar localização:', error);

      // Verificar tipo de erro
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        if (
          errorMessage.includes('permission') ||
          errorMessage.includes('denied')
        ) {
          Alert.alert(
            'Permissão Necessária',
            'Para usar a localização, você precisa permitir o acesso nas configurações do aplicativo.',
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Abrir Configurações',
                onPress: () => {
                  // Redirecionar para configurações do app
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:');
                  } else {
                    Linking.openSettings();
                  }
                },
              },
            ],
          );
        } else if (
          errorMessage.includes('unavailable') ||
          errorMessage.includes('disabled')
        ) {
          Alert.alert(
            'GPS Desativado',
            'O GPS parece estar desativado. Ative-o nas configurações do dispositivo e tente novamente.',
          );
        } else {
          Alert.alert(
            'Erro',
            'Não foi possível obter a localização. Tente novamente.',
          );
        }
      } else {
        Alert.alert(
          'Erro',
          'Ocorreu um erro desconhecido ao tentar obter a localização.',
        );
      }
    } finally {
      setIsTakingMedia(false);
    }
  };

  // F-05 (Foto) e F-10 (Vídeo)
  const captureMedia = async (mediaType: 'photo' | 'video') => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      setIsTakingMedia(true);

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes:
          mediaType === 'photo'
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 0.8,
        videoMaxDuration: 60,
        videoQuality: ImagePicker.UIImagePickerControllerQualityType.High,
        exif: true,
      });

      if (!result.canceled && result.assets[0]) {
        if (mediaType === 'photo') {
          setImages((prev) => [...prev, result.assets[0].uri]);
          Alert.alert('Sucesso', 'Foto capturada com sucesso!');
        } else {
          setVideos((prev) => [...prev, result.assets[0].uri]);
          Alert.alert('Sucesso', 'Vídeo capturado com sucesso!');
        }
      }
    } catch (error) {
      console.error('Erro ao capturar mídia:', error);
      Alert.alert('Erro', 'Não foi possível capturar a mídia.');
    } finally {
      setIsTakingMedia(false);
    }
  };

  const validateForm = (): boolean => {
    if (!vehicle.trim()) {
      Alert.alert('Validação', 'O campo Viatura é obrigatório.');
      return false;
    }
    if (!team.trim()) {
      Alert.alert('Validação', 'O campo Equipe é obrigatório.');
      return false;
    }
    if (!type.trim()) {
      Alert.alert('Validação', 'O campo Tipo é obrigatório.');
      return false;
    }
    if (!title.trim()) {
      Alert.alert('Validação', 'O campo Título é obrigatório.');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Validação', 'O campo Descrição é obrigatório.');
      return false;
    }
    if (!signature) {
      Alert.alert('Validação', 'A assinatura é obrigatória.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Definir status baseado no incidente existente
      const status: IncidentStatus = editingIncident
        ? editingIncident.status
        : 'pending';

      // Definir syncStatus com tipo correto
      const syncStatus: SyncStatus = editingIncident
        ? editingIncident.syncStatus
        : 'pending_sync';

      const incidentData = {
        id: editingIncident?.id || Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        vehicle: vehicle.trim(),
        team: team.trim(),
        type: type.trim(),
        signature,
        images,
        videos,
        location: location
          ? {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }
          : undefined,
        status,
        syncStatus,
        createdAt: editingIncident?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingIncident?.id) {
        // Usar Partial<IncidentData> para atualização
        await updateIncident(editingIncident.id, incidentData as any);
        Alert.alert('Sucesso', 'Ocorrência atualizada com sucesso!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        await saveIncident(incidentData as any);
        Alert.alert('Sucesso', 'Ocorrência registrada com sucesso!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      console.error('Erro ao salvar ocorrência:', error);
      Alert.alert(
        'Erro',
        'Não foi possível salvar a ocorrência. Tente novamente.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    Alert.alert('Remover Foto', 'Tem certeza que deseja remover esta foto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          const newImages = [...images];
          newImages.splice(index, 1);
          setImages(newImages);
        },
      },
    ]);
  };

  const removeVideo = (index: number) => {
    Alert.alert('Remover Vídeo', 'Tem certeza que deseja remover este vídeo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          const newVideos = [...videos];
          newVideos.splice(index, 1);
          setVideos(newVideos);
        },
      },
    ]);
  };

  const openMediaViewer = (uri: string, type: 'image' | 'video') => {
    setSelectedMedia(uri);
    setMediaType(type);
  };

  const closeMediaViewer = () => {
    setSelectedMedia(null);
    setMediaType(null);
  };

  const renderMediaItem = (
    uri: string,
    index: number,
    type: 'image' | 'video',
  ) => {
    return (
      <View key={`${type}-${index}`} style={styles.mediaItem}>
        <TouchableOpacity onPress={() => openMediaViewer(uri, type)}>
          {type === 'image' ? (
            <Image source={{ uri }} style={styles.thumbnail} />
          ) : (
            <View style={[styles.thumbnail, styles.videoThumbnail]}>
              <Feather name="play-circle" size={24} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>
        <Pressable
          style={styles.removeButton}
          onPress={() =>
            type === 'image' ? removeImage(index) : removeVideo(index)
          }
        >
          <Feather name="x" size={12} color="#FFFFFF" />
        </Pressable>
      </View>
    );
  };

  return (
    <>
      <ScreenKeyboardAwareScrollView>
        <View style={styles.container}>
          <Card elevation={2} style={styles.card}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              {editingIncident ? 'Editar Ocorrência' : 'Nova Ocorrência'}
            </ThemedText>

            {/* Tipo de Ocorrência */}
            <View style={styles.formSection}>
              <ThemedText style={styles.label}>Tipo de Ocorrência *</ThemedText>
              <View style={styles.typeRow}>
                {['Resgate', 'Incêndio', 'Salvamento'].map((t) => (
                  <Pressable
                    key={t}
                    style={[
                      styles.typeButton,
                      {
                        backgroundColor:
                          type === t
                            ? colors.primary
                            : colors.backgroundDefault,
                        borderColor:
                          type === t ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => setType(t)}
                  >
                    <ThemedText
                      style={{
                        color: type === t ? colors.buttonText : colors.text,
                        fontWeight: type === t ? '600' : '400',
                      }}
                    >
                      {t}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Viatura e Equipe */}
            <View style={styles.formSection}>
              <View style={styles.row}>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Viatura *</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: colors.border,
                        color: colors.text,
                        backgroundColor: colors.backgroundDefault,
                      },
                    ]}
                    value={vehicle}
                    onChangeText={handleVehicleChange}
                    placeholder="Ex: ABT-12"
                    placeholderTextColor={colors.tabIconDefault}
                    maxLength={10}
                    autoCapitalize="characters"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Equipe *</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: colors.border,
                        color: colors.text,
                        backgroundColor: colors.backgroundDefault,
                      },
                    ]}
                    value={team}
                    onChangeText={setTeam}
                    placeholder="Ex: Alfa"
                    placeholderTextColor={colors.tabIconDefault}
                    maxLength={20}
                  />
                </View>
              </View>
            </View>

            {/* Título e Descrição */}
            <View style={styles.formSection}>
              <ThemedText style={styles.label}>Título *</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: colors.backgroundDefault,
                  },
                ]}
                value={title}
                onChangeText={setTitle}
                placeholder="Descreva brevemente a ocorrência"
                placeholderTextColor={colors.tabIconDefault}
                maxLength={100}
              />

              <ThemedText style={[styles.label, { marginTop: Spacing.md }]}>
                Descrição *
              </ThemedText>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: colors.backgroundDefault,
                  },
                ]}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                placeholder="Descreva os detalhes da ocorrência..."
                placeholderTextColor={colors.tabIconDefault}
                textAlignVertical="top"
              />
            </View>

            {/* Ações */}
            <View style={styles.formSection}>
              <ThemedText style={styles.label}>Anexos</ThemedText>
              <View style={styles.actionRow}>
                <Pressable
                  style={[
                    styles.actionButton,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.backgroundDefault,
                    },
                  ]}
                  onPress={captureLocation}
                  disabled={isTakingMedia}
                >
                  {isTakingMedia ? (
                    <ActivityIndicator size="small" color={colors.secondary} />
                  ) : (
                    <>
                      <Feather
                        name="map-pin"
                        size={20}
                        color={location ? colors.success : colors.secondary}
                      />
                      <ThemedText type="caption" style={{ marginTop: 2 }}>
                        GPS
                      </ThemedText>
                    </>
                  )}
                </Pressable>

                <Pressable
                  style={[
                    styles.actionButton,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.backgroundDefault,
                    },
                  ]}
                  onPress={() => captureMedia('photo')}
                  disabled={isTakingMedia}
                >
                  {isTakingMedia ? (
                    <ActivityIndicator size="small" color={colors.secondary} />
                  ) : (
                    <>
                      <Feather
                        name="camera"
                        size={20}
                        color={
                          images.length > 0 ? colors.success : colors.secondary
                        }
                      />
                      <ThemedText type="caption" style={{ marginTop: 2 }}>
                        Foto ({images.length})
                      </ThemedText>
                    </>
                  )}
                </Pressable>

                <Pressable
                  style={[
                    styles.actionButton,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.backgroundDefault,
                    },
                  ]}
                  onPress={() => captureMedia('video')}
                  disabled={isTakingMedia}
                >
                  {isTakingMedia ? (
                    <ActivityIndicator size="small" color={colors.secondary} />
                  ) : (
                    <>
                      <Feather
                        name="video"
                        size={20}
                        color={
                          videos.length > 0 ? colors.success : colors.secondary
                        }
                      />
                      <ThemedText type="caption" style={{ marginTop: 2 }}>
                        Vídeo ({videos.length})
                      </ThemedText>
                    </>
                  )}
                </Pressable>

                <Pressable
                  style={[
                    styles.actionButton,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.backgroundDefault,
                    },
                  ]}
                  onPress={() => setShowSignatureModal(true)}
                >
                  <Feather
                    name="pen-tool"
                    size={20}
                    color={signature ? colors.success : colors.secondary}
                  />
                  <ThemedText type="caption" style={{ marginTop: 2 }}>
                    Assinar
                  </ThemedText>
                </Pressable>
              </View>
            </View>

            {/* Galeria de Mídias */}
            {(images.length > 0 || videos.length > 0) && (
              <View style={styles.formSection}>
                <ThemedText style={styles.label}>Mídias Anexadas</ThemedText>
                <View style={styles.mediaGrid}>
                  {images.map((uri, idx) => renderMediaItem(uri, idx, 'image'))}
                  {videos.map((uri, idx) => renderMediaItem(uri, idx, 'video'))}
                </View>
              </View>
            )}

            {/* Prévia da Assinatura */}
            {signature && (
              <View style={styles.formSection}>
                <ThemedText style={styles.label}>Assinatura</ThemedText>
                <Pressable
                  onPress={() => setShowSignatureModal(true)}
                  style={[
                    styles.signaturePreview,
                    { borderColor: colors.border },
                  ]}
                >
                  <Image
                    source={{ uri: signature }}
                    style={styles.signatureImage}
                    contentFit="contain"
                  />
                  <View style={styles.signatureOverlay}>
                    <ThemedText
                      type="caption"
                      style={{ color: colors.textLight }}
                    >
                      Toque para editar
                    </ThemedText>
                  </View>
                </Pressable>
              </View>
            )}

            {/* Botão de Envio */}
            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed || isLoading || isTakingMedia ? 0.7 : 1,
                },
              ]}
              onPress={handleSubmit}
              disabled={isLoading || isTakingMedia}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.buttonText} />
              ) : (
                <ThemedText
                  style={{
                    color: colors.buttonText,
                    fontSize: 18,
                    fontWeight: '600',
                  }}
                >
                  {editingIncident
                    ? 'ATUALIZAR OCORRÊNCIA'
                    : 'REGISTRAR OCORRÊNCIA'}
                </ThemedText>
              )}
            </Pressable>

            {/* Contador de caracteres */}
            <ThemedText
              type="caption"
              style={[styles.counter, { color: colors.textLight }]}
            >
              {title.length}/100 caracteres • {description.length}/500
              caracteres
            </ThemedText>
          </Card>
        </View>
      </ScreenKeyboardAwareScrollView>

      {/* Modal de Assinatura */}
      <SignatureModal
        visible={showSignatureModal}
        onOK={(sig) => {
          setSignature(sig);
          setShowSignatureModal(false);
        }}
        onCancel={() => setShowSignatureModal(false)}
      />

      {/* Modal de Visualização de Mídia */}
      <Modal
        visible={!!selectedMedia}
        transparent
        animationType="fade"
        onRequestClose={closeMediaViewer}
      >
        <View style={styles.mediaModal}>
          <Pressable
            style={styles.mediaModalBackdrop}
            onPress={closeMediaViewer}
          >
            {mediaType === 'image' && selectedMedia && (
              <Image
                source={{ uri: selectedMedia }}
                style={styles.mediaFullSize}
                contentFit="contain"
              />
            )}
            {mediaType === 'video' && selectedMedia && (
              <View style={styles.videoContainer}>
                <ThemedText style={{ color: 'white' }}>
                  Para visualizar o vídeo, é necessário um player de vídeo
                </ThemedText>
              </View>
            )}
          </Pressable>
          <Pressable style={styles.closeMediaButton} onPress={closeMediaViewer}>
            <Feather name="x" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    flex: 1,
  },
  card: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    borderWidth: 1,
    fontFamily: 'System',
  },
  textArea: {
    minHeight: 120,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    borderWidth: 1,
    textAlignVertical: 'top',
    fontFamily: 'System',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  inputGroup: {
    flex: 1,
  },
  typeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  typeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    width: 75,
    height: 75,
  },
  submitButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  mediaContainer: {
    marginTop: Spacing.md,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  mediaItem: {
    position: 'relative',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  videoThumbnail: {
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#F44336',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  signaturePreview: {
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    padding: 12,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  signatureImage: {
    width: '100%',
    height: '100%',
  },
  signatureOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  counter: {
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  mediaModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaModalBackdrop: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  mediaFullSize: {
    width: '100%',
    height: '80%',
    borderRadius: 4,
  },
  videoContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: Spacing.lg,
  },
  closeMediaButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
});
