import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { Spacing } from '@/constants/theme';
import { getIncidents, Incident } from '@/utils/storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MapScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    }

    const data = await getIncidents();
    setIncidents(data.filter(i => i.location));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F39C12';
      case 'in_progress':
        return '#2D74FF';
      case 'resolved':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude || -23.5505,
          longitude: location?.coords.longitude || -46.6333,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
      >
        {incidents.map((incident, index) => (
          incident.location ? (
            <Marker
              key={incident.id || index}
              coordinate={{
                latitude: incident.location.latitude,
                longitude: incident.location.longitude,
              }}
              pinColor={getStatusColor(incident.status)}
              onPress={() => setSelectedIncident(incident)}
            />
          ) : null
        ))}
      </MapView>

      {selectedIncident ? (
        <Card style={StyleSheet.flatten([styles.detailCard, { bottom: insets.bottom + Spacing.xl }])}>
          <View style={styles.detailHeader}>
            <ThemedText style={[styles.detailTitle, { color: theme.text }]}>
              {selectedIncident.title}
            </ThemedText>
            <Pressable onPress={() => setSelectedIncident(null)}>
              <Feather name="x" size={24} color={theme.tabIconDefault} />
            </Pressable>
          </View>
          <ThemedText style={[styles.detailDesc, { color: theme.tabIconDefault }]} numberOfLines={2}>
            {selectedIncident.description}
          </ThemedText>
        </Card>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  detailCard: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    padding: Spacing.lg,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  detailDesc: {
    fontSize: 14,
  },
});
