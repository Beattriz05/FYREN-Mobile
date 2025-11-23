import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Spacing, BorderRadius } from '@/constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserHomeStackParamList } from '@/navigation/UserHomeStackNavigator';
import { getComments, saveComment, Comment } from '@/utils/storage';
import { Image } from 'expo-image';

type Props = NativeStackScreenProps<UserHomeStackParamList, 'IncidentDetail'>;

export default function IncidentDetailScreen({ route }: Props) {
  const { incident } = route.params;
  const { theme } = useTheme();
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    if (incident.id) {
      const data = await getComments(incident.id);
      setComments(data);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !incident.id || !user) return;

    await saveComment({
      incidentId: incident.id,
      userId: user.id,
      userName: user.name,
      text: newComment,
    });

    setNewComment('');
    await loadComments();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return theme.warning;
      case 'in_progress':
        return theme.info;
      case 'resolved':
        return theme.success;
      default:
        return theme.tabIconDefault;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Andamento';
      case 'resolved':
        return 'Resolvido';
      default:
        return status;
    }
  };

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <Card style={styles.card}>
          <ThemedText style={[styles.title, { color: theme.text }]}>
            {incident.title}
          </ThemedText>

          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(incident.status) + '20' }]}>
            <ThemedText style={[styles.statusText, { color: getStatusColor(incident.status) }]}>
              {getStatusLabel(incident.status)}
            </ThemedText>
          </View>

          <ThemedText style={[styles.description, { color: theme.text }]}>
            {incident.description}
          </ThemedText>

          {incident.location ? (
            <View style={styles.infoRow}>
              <Feather name="map-pin" size={20} color={theme.secondary} />
              <ThemedText style={[styles.infoText, { color: theme.tabIconDefault }]}>
                Lat: {incident.location.latitude.toFixed(4)}, Long: {incident.location.longitude.toFixed(4)}
              </ThemedText>
            </View>
          ) : null}

          {incident.images && incident.images.length > 0 ? (
            <View style={styles.imageGrid}>
              {incident.images.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={styles.image}
                  contentFit="cover"
                />
              ))}
            </View>
          ) : null}

          <ThemedText style={[styles.date, { color: theme.tabIconDefault }]}>
            Criado em: {new Date(incident.createdAt).toLocaleString('pt-BR')}
          </ThemedText>
        </Card>

        <Card style={styles.card}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
            Comentários
          </ThemedText>

          {comments.map((comment) => (
            <View key={comment.id} style={[styles.comment, { backgroundColor: theme.backgroundDefault }]}>
              <ThemedText style={[styles.commentAuthor, { color: theme.text }]}>
                {comment.userName}
              </ThemedText>
              <ThemedText style={[styles.commentText, { color: theme.text }]}>
                {comment.text}
              </ThemedText>
              <ThemedText style={[styles.commentDate, { color: theme.tabIconDefault }]}>
                {new Date(comment.createdAt).toLocaleString('pt-BR')}
              </ThemedText>
            </View>
          ))}

          <View style={styles.commentInput}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.backgroundSecondary, color: theme.text, borderColor: theme.border }]}
              placeholder="Adicionar comentário..."
              placeholderTextColor={theme.tabIconDefault}
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <Pressable
              style={({ pressed }) => [
                styles.sendButton,
                { backgroundColor: theme.secondary, opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={handleAddComment}
            >
              <Feather name="send" size={20} color={theme.textLight} />
            </Pressable>
          </View>
        </Card>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  card: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: 14,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.xs,
  },
  date: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  comment: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xs,
    gap: Spacing.xs,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentText: {
    fontSize: 14,
  },
  commentDate: {
    fontSize: 12,
  },
  commentInput: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  input: {
    flex: 1,
    minHeight: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 16,
    borderWidth: 1,
  },
  sendButton: {
    width: Spacing.inputHeight,
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
