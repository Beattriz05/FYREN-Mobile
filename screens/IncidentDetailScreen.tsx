import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Spacing, BorderRadius } from '@/constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserHomeStackParamList } from '@/navigation/UserHomeStackNavigator';
import { getComments, saveComment, Comment, getIncidents } from '@/utils/storage';
import { Image } from 'expo-image';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<UserHomeStackParamList, 'IncidentDetail'>;

export default function IncidentDetailScreen({ route, navigation }: Props) {
  // Inicializa com o parâmetro da rota, mas vamos atualizar se editarmos
  const [incident, setIncident] = useState(route.params.incident);
  
  const { theme } = useTheme();
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  // Atualiza os dados se a tela receber foco (voltar da edição)
  useFocusEffect(
    useCallback(() => {
      const refreshData = async () => {
        const allIncidents = await getIncidents();
        const updated = allIncidents.find(i => i.id === incident.id);
        if (updated) setIncident(updated);
        
        if (incident.id) {
          const data = await getComments(incident.id);
          setComments(data);
        }
      };
      refreshData();
    }, [incident.id])
  );

  const handleAddComment = async () => {
    if (!newComment.trim() || !incident.id || !user) return;
    await saveComment({
      incidentId: incident.id,
      userId: user.id,
      userName: user.name,
      text: newComment,
    });
    setNewComment('');
    const data = await getComments(incident.id);
    setComments(data);
  };

  const getStatusColor = (status: string) => {
    if (status === 'pending') return theme.warning;
    if (status === 'in_progress') return theme.info;
    return theme.success;
  };

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        
        {/* F-09: Botão de Edição (Apenas se pendente de sincronização) */}
        {incident.syncStatus === 'pending_sync' && (
          <Pressable
            style={({ pressed }) => [
              styles.editButton,
              { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={() => navigation.navigate('RegisterIncident', { incident })}
          >
            <Feather name="edit-2" size={16} color={theme.textLight} />
            <ThemedText style={{ color: theme.textLight, fontWeight: '600' }}>
              Editar Dados (Não Sincronizado)
            </ThemedText>
          </Pressable>
        )}

        <Card style={styles.card}>
          <View style={styles.headerRow}>
            <View style={[styles.badge, { backgroundColor: theme.primary + '20' }]}>
              <ThemedText style={[styles.badgeText, { color: theme.primary }]}>{incident.type || 'Geral'}</ThemedText>
            </View>
            <View style={[styles.badge, { backgroundColor: getStatusColor(incident.status) + '20' }]}>
              <ThemedText style={[styles.badgeText, { color: getStatusColor(incident.status) }]}>{incident.status}</ThemedText>
            </View>
          </View>

          <ThemedText style={[styles.title, { color: theme.text }]}>{incident.title}</ThemedText>

          <View style={[styles.infoBox, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.infoCol}>
              <ThemedText style={styles.label}>Viatura:</ThemedText>
              <ThemedText style={styles.value}>{incident.vehicle || '-'}</ThemedText>
            </View>
            <View style={styles.infoCol}>
              <ThemedText style={styles.label}>Equipe:</ThemedText>
              <ThemedText style={styles.value}>{incident.team || '-'}</ThemedText>
            </View>
          </View>

          <ThemedText style={[styles.description, { color: theme.text }]}>{incident.description}</ThemedText>

          {incident.location && (
            <View style={styles.iconRow}>
              <Feather name="map-pin" size={16} color={theme.secondary} />
              <ThemedText style={[styles.smallText, { color: theme.tabIconDefault }]}>
                {incident.location.latitude.toFixed(5)}, {incident.location.longitude.toFixed(5)}
              </ThemedText>
            </View>
          )}

          {incident.images && incident.images.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
              {incident.images.map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.image} contentFit="cover" />
              ))}
            </ScrollView>
          )}

          {incident.signature && (
            <View style={styles.signatureBox}>
              <ThemedText style={styles.label}>Assinatura:</ThemedText>
              <Image source={{ uri: incident.signature }} style={styles.signatureImage} contentFit="contain" />
            </View>
          )}
        </Card>

        {/* Card Comentários (Mesmo código anterior) */}
        <Card style={styles.card}>
          <ThemedText style={[styles.title, { fontSize: 18 }]}>Comentários</ThemedText>
          {comments.map((comment) => (
            <View key={comment.id} style={[styles.comment, { backgroundColor: theme.backgroundDefault }]}>
              <ThemedText style={styles.commentAuthor}>{comment.userName}</ThemedText>
              <ThemedText style={styles.commentText}>{comment.text}</ThemedText>
            </View>
          ))}
          <View style={styles.commentInput}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.backgroundSecondary, color: theme.text, borderColor: theme.border }]}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Comentar..."
              placeholderTextColor={theme.tabIconDefault}
            />
            <Pressable style={[styles.sendButton, { backgroundColor: theme.secondary }]} onPress={handleAddComment}>
              <Feather name="send" size={20} color="#fff" />
            </Pressable>
          </View>
        </Card>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, gap: Spacing.lg },
  editButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, gap: 8, marginBottom: 8 },
  card: { padding: Spacing.lg, gap: Spacing.md },
  headerRow: { flexDirection: 'row', gap: Spacing.sm },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  title: { fontSize: 22, fontWeight: '700' },
  infoBox: { flexDirection: 'row', padding: Spacing.md, borderRadius: BorderRadius.sm, gap: Spacing.xl },
  infoCol: { flex: 1 },
  label: { fontSize: 12, opacity: 0.7, marginBottom: 2 },
  value: { fontSize: 16, fontWeight: '600' },
  description: { fontSize: 16, lineHeight: 24 },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  smallText: { fontSize: 14 },
  imageScroll: { flexDirection: 'row', marginTop: Spacing.xs },
  image: { width: 120, height: 120, borderRadius: 8, marginRight: 8 },
  signatureBox: { marginTop: Spacing.sm, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: Spacing.sm },
  signatureImage: { width: '100%', height: 80, backgroundColor: '#f9f9f9', marginTop: 4 },
  comment: { padding: 12, borderRadius: 8, gap: 4, marginBottom: 8 },
  commentAuthor: { fontWeight: '700', fontSize: 14 },
  commentText: { fontSize: 14 },
  commentInput: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, height: 44, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 },
  sendButton: { width: 44, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});