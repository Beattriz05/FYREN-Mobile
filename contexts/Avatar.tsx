// components/Avatar.tsx
import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '../hooks/useTheme';

interface AvatarProps {
  size?: number;
  name?: string;
  email?: string;
  imageUrl?: string;
  role?: string;
  onPress?: () => void;
  showBadge?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  size = 100,
  name = '',
  email = '',
  imageUrl,
  role,
  onPress,
  showBadge = true,
}) => {
  const { colors } = useTheme();
  
  const getInitials = () => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getRoleColor = (userRole?: string) => {
    switch (userRole?.toLowerCase()) {
      case 'admin':
        return '#4CAF50'; // Verde
      case 'chefe':
        return '#FF9800'; // Laranja
      case 'bombeiro':
        return '#2196F3'; // Azul
      default:
        return colors.bombeiros?.primary || '#D32F2F';
    }
  };

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: getRoleColor(role),
    borderWidth: 3,
    borderColor: colors.surfaceVariant,
  };

  const Content = (
    <View style={[styles.container, containerStyle]}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <ThemedText style={[styles.initials, { fontSize: size * 0.4 }]}>
          {getInitials()}
        </ThemedText>
      )}
      
      {showBadge && role && (
        <View style={[styles.badge, { backgroundColor: getRoleColor(role) }]}>
          <ThemedText style={styles.badgeText} type="caption">
            {role.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {Content}
      </TouchableOpacity>
    );
  }

  return Content;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default Avatar;