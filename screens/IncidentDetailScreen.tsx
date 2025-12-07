import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Spacing, BorderRadius } from '@/constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserHomeStackParamList } from '@/navigation/UserHomeStackNavigator';
import {
  getComments,
  saveComment,
  Comment,
  getIncidents,
} from '@/utils/storage';
import { Image } from 'expo-image';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<UserHomeStackParamList, 'IncidentDetail'>;

export default function IncidentDetailScreen({ route, navigation }: Props) {
  const [incident, setIncident] = useState(route.params.incident);
  const { colors } = useTheme();
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  // Aba ativa: 'details' ou 'timeline'
  const [activeTab, setActiveTab] = useState<'details' | 'timeline'>('details');

  useFocusEffect(
    useCallback(() => {
      const refreshData = async () => {
        const allIncidents = await getIncidents();
        const updated = allIncidents.find((i) => i.id === incident.id);
        if (updated) setIncident(updated);

        if (incident.id) {
          const data = await getComments(incident.id);
          setComments(data);
        }
      };
      refreshData();
    }, [incident.id]),
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
    if (status === 'pending') return colors.warning;
    if (status === 'in_progress') return colors.info;
    return colors.success;
  };

  // Verifica se há imagens
  const hasImages = incident.images && incident.images.length > 0;

  // Verifica se há vídeos
  const hasVideos = incident.videos && incident.videos.length > 0;

  // Verifica se há mídia (imagens ou vídeos)
  const hasMedia = hasImages || hasVideos;

  // Verifica se há timeline
  const hasTimeline = incident.timeline && incident.timeline.length > 0;

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        {/* Botão de Edição */}
        {incident.syncStatus === 'pending_sync' && (
          <Pressable
            style={({ pressed }) => [
              styles.editButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() =>
              navigation.navigate('RegisterIncident', { incident })
            }
          >
            <Feather name="edit-2" size={16} color={colors.textLight} />
            <ThemedText style={{ color: colors.textLight, fontWeight: '600' }}>
              Editar Dados
            </ThemedText>
          </Pressable>
        )}

        {/* Resto do código permanece igual... */}
        {/* Abas de Navegação */}
        <View style={styles.tabRow}>
          <Pressable
            style={[
              styles.tab,
              activeTab === 'details' && {
                borderBottomColor: colors.primary,
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => setActiveTab('details')}
          >
            <ThemedText
              style={{
                fontWeight: activeTab === 'details' ? '700' : '400',
                color: colors.text,
              }}
            >
              Detalhes
            </ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles.tab,
              activeTab === 'timeline' && {
                borderBottomColor: colors.primary,
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => setActiveTab('timeline')}
          >
            <ThemedText
              style={{
                fontWeight: activeTab === 'timeline' ? '700' : '400',
                color: colors.text,
              }}
            >
              Linha do Tempo
            </ThemedText>
          </Pressable>
        </View>

        {activeTab === 'details' ? (
          <>
            <Card style={styles.card}>
              <View style={styles.headerRow}>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: colors.primary + '20' },
                  ]}
                >
                  <ThemedText
                    style={[styles.badgeText, { color: colors.primary }]}
                  >
                    {incident.type || 'Geral'}
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: getStatusColor(incident.status) + '20' },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.badgeText,
                      { color: getStatusColor(incident.status) },
                    ]}
                  >
                    {incident.status}
                  </ThemedText>
                </View>
              </View>

              <ThemedText style={[styles.title, { color: colors.text }]}>
                {incident.title}
              </ThemedText>

              <View
                style={[
                  styles.infoBox,
                  { backgroundColor: colors.backgroundDefault },
                ]}
              >
                <View style={styles.infoCol}>
                  <ThemedText style={styles.label}>Viatura:</ThemedText>
                  <ThemedText style={styles.value}>
                    {incident.vehicle || '-'}
                  </ThemedText>
                </View>
                <View style={styles.infoCol}>
                  <ThemedText style={styles.label}>Equipe:</ThemedText>
                  <ThemedText style={styles.value}>
                    {incident.team || '-'}
                  </ThemedText>
                </View>
              </View>

              <ThemedText style={[styles.description, { color: colors.text }]}>
                {incident.description}
              </ThemedText>

              {/* Mídia - Verificação segura */}
              {hasMedia && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.imageScroll}
                >
                  {hasImages &&
                    incident.images?.map((uri, index) => (
                      <Image
                        key={`i-${index}`}
                        source={{ uri }}
                        style={styles.image}
                        contentFit="cover"
                      />
                    ))}
                  {hasVideos &&
                    incident.videos?.map((uri, index) => (
                      <View
                        key={`v-${index}`}
                        style={[
                          styles.image,
                          {
                            backgroundColor: '#000',
                            justifyContent: 'center',
                            alignItems: 'center',
                          },
                        ]}
                      >
                        <Feather name="play" size={24} color="#fff" />
                      </View>
                    ))}
                </ScrollView>
              )}

              {incident.signature && (
                <View style={styles.signatureBox}>
                  <ThemedText style={styles.label}>Assinatura:</ThemedText>
                  <Image
                    source={{ uri: incident.signature }}
                    style={styles.signatureImage}
                    contentFit="contain"
                  />
                </View>
              )}
            </Card>

            <Card style={styles.card}>
              <ThemedText style={[styles.title, { fontSize: 18 }]}>
                Comentários
              </ThemedText>
              {comments.map((comment) => (
                <View
                  key={comment.id}
                  style={[
                    styles.comment,
                    { backgroundColor: colors.backgroundDefault },
                  ]}
                >
                  <ThemedText style={styles.commentAuthor}>
                    {comment.userName}
                  </ThemedText>
                  <ThemedText style={styles.commentText}>
                    {comment.text}
                  </ThemedText>
                </View>
              ))}
              <View style={styles.commentInput}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.backgroundSecondary,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  value={newComment}
                  onChangeText={setNewComment}
                  placeholder="Comentar..."
                  placeholderTextColor={colors.tabIconDefault}
                />
                <Pressable
                  style={[
                    styles.sendButton,
                    { backgroundColor: colors.secondary },
                  ]}
                  onPress={handleAddComment}
                >
                  <Feather name="send" size={20} color="#fff" />
                </Pressable>
              </View>
            </Card>
          </>
        ) : (
          <Card style={styles.card}>
            <ThemedText style={styles.title}>Histórico de Eventos</ThemedText>
            <View style={styles.timelineContainer}>
              {hasTimeline ? (
                incident.timeline?.map((event, index) => (
                  <View
                    key={event.id || `event-${index}`}
                    style={styles.timelineItem}
                  >
                    <View style={styles.timelineLeft}>
                      <View
                        style={[
                          styles.timelineDot,
                          { backgroundColor: colors.primary },
                        ]}
                      />
                      {index < (incident.timeline?.length || 0) - 1 && (
                        <View
                          style={[
                            styles.timelineLine,
                            { backgroundColor: colors.border },
                          ]}
                        />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <ThemedText style={styles.timelineTitle}>
                        {event.title}
                      </ThemedText>
                      <ThemedText
                        style={[
                          styles.timelineDesc,
                          { color: colors.tabIconDefault },
                        ]}
                      >
                        {event.description}
                      </ThemedText>
                      <ThemedText
                        style={[
                          styles.timelineDate,
                          { color: colors.tabIconDefault },
                        ]}
                      >
                        {new Date(event.date).toLocaleString('pt-BR')}
                      </ThemedText>
                    </View>
                  </View>
                ))
              ) : (
                <ThemedText
                  style={[
                    styles.emptyTimeline,
                    { color: colors.tabIconDefault },
                  ]}
                >
                  Nenhum evento registrado.
                </ThemedText>
              )}
            </View>
          </Card>
        )}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, gap: Spacing.lg },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  card: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xl,
  },
  infoCol: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  imageScroll: {
    flexDirection: 'row',
    marginTop: Spacing.xs,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
  },
  signatureBox: {
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: Spacing.sm,
  },
  signatureImage: {
    width: '100%',
    height: 80,
    backgroundColor: '#f9f9f9',
    marginTop: 4,
  },
  comment: {
    padding: 12,
    borderRadius: 8,
    gap: 4,
    marginBottom: 8,
  },
  commentAuthor: {
    fontWeight: '700',
    fontSize: 14,
  },
  commentText: {
    fontSize: 14,
  },
  commentInput: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Estilos da Timeline
  timelineContainer: {
    marginTop: Spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineLeft: {
    width: 20,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 12,
  },
  timelineTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  timelineDesc: {
    fontSize: 14,
    marginTop: 2,
  },
  timelineDate: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyTimeline: {
    textAlign: 'center',
    paddingVertical: Spacing.xl,
    fontSize: 16,
  },
});
