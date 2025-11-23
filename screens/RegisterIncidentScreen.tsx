import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ScreenKeyboardAwareScrollView } from '@/components/ScreenKeyboardAwareScrollView';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserHomeStackParamList } from '@/navigation/UserHomeStackNavigator';
import { saveIncident } from '@/utils/storage';
import { Image } from 'expo-image';

type Props = NativeStackScreenProps<UserHomeStackParamList, 'RegisterIncident'>;

export default function RegisterIncidentScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const locationPermission = await Location.requestForegroundPermissionsAsync();
    
    if (cameraPermission.status !== 'granted' || locationPermission.status !== 'granted') {
      Alert.alert('Permissões Necessárias', 'É necessário conceder permissões de câmera e localização.');
      return false;
    }
    return true;
  };

  const captureLocation = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      Alert.alert('Sucesso', 'Localização capturada!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter a localização.');
    }
  };

  const takePicture = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true);
    try {
      await saveIncident({
        title,
        description,
        location: location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        } : undefined,
        images,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Sucesso', 'Ocorrência registrada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a ocorrência.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.container}>
        <Card style={styles.card}>
          <ThemedText style={[styles.label, { color: theme.text }]}>
            Título *
          </ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundSecondary, color: theme.text, borderColor: theme.border }]}
            placeholder="Digite o título da ocorrência"
            placeholderTextColor={theme.tabIconDefault}
            value={title}
            onChangeText={setTitle}
          />

          <ThemedText style={[styles.label, { color: theme.text }]}>
            Descrição *
          </ThemedText>
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.backgroundSecondary, color: theme.text, borderColor: theme.border }]}
            placeholder="Descreva a ocorrência em detalhes"
            placeholderTextColor={theme.tabIconDefault}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <ThemedText style={[styles.label, { color: theme.text }]}>
            Localização
          </ThemedText>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.backgroundSecondary, borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={captureLocation}
          >
            <Feather name="map-pin" size={20} color={theme.secondary} />
            <ThemedText style={[styles.actionText, { color: theme.text }]}>
              {location ? 'Localização Capturada' : 'Capturar Localização'}
            </ThemedText>
          </Pressable>

          <ThemedText style={[styles.label, { color: theme.text }]}>
            Fotos
          </ThemedText>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.backgroundSecondary, borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={takePicture}
          >
            <Feather name="camera" size={20} color={theme.secondary} />
            <ThemedText style={[styles.actionText, { color: theme.text }]}>
              Tirar Foto
            </ThemedText>
          </Pressable>

          {images.length > 0 ? (
            <View style={styles.imageGrid}>
              {images.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={styles.thumbnail}
                  contentFit="cover"
                />
              ))}
            </View>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              { backgroundColor: theme.accent, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <ThemedText style={[styles.submitText, { color: theme.textLight }]}>
              {isLoading ? 'Salvando...' : 'Registrar Ocorrência'}
            </ThemedText>
          </Pressable>
        </Card>
      </View>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  card: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 100,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 16,
    borderWidth: 1,
    textAlignVertical: 'top',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 16,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xs,
  },
  submitButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  submitText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
