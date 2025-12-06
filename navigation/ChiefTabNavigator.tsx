import React from 'react';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChiefDashboardScreen from '@/screens/ChiefDashboardScreen';
import IncidentListScreen from '@/screens/IncidentListScreen';
import ReportsScreen from '@/screens/ReportsScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import { Colors } from '@/constants/theme';

// Exportação única do tipo ChiefTabParamList
export type ChiefTabParamList = {
  ChiefDashboard: undefined;
  IncidentList: undefined;
  Reports: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<ChiefTabParamList>();

export default function ChiefTabNavigator() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // Cores extraídas de forma segura
  const backgroundColor = (colors as any).background || (colors as any).backgroundRoot || (isDark ? '#121212' : '#FFFFFF');
  const primaryColor = colors.bombeiros?.primary || Colors.bombeiros.primary;
  const textColor = colors.text || (isDark ? '#FFFFFF' : '#000000');
  const secondaryColor = (colors as any).secondary || '#757575';
  const tabIconSelected = (colors as any).tabIconSelected || primaryColor;
  const tabIconDefault = (colors as any).tabIconDefault || secondaryColor;

  // Configurações de estilo do tabBar
  const tabBarStyle = {
    backgroundColor: Platform.select({
      ios: 'transparent',
      android: isDark ? 'rgba(18, 18, 18, 0.98)' : 'rgba(255, 255, 255, 0.98)',
    }),
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: Platform.OS === 'ios' ? 80 + insets.bottom : 70,
    paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10,
    paddingTop: 10,
    position: 'absolute' as const,
    left: 0,
    right: 0,
    bottom: 0,
  };

  // Configurações de header
  const headerStyle = {
    backgroundColor: Platform.select({
      ios: 'transparent',
      android: backgroundColor,
    }),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomWidth: Platform.OS === 'ios' ? 0 : 1,
    borderBottomColor: isDark ? '#333' : '#EEE',
  };

  const headerTitleStyle = {
    fontWeight: '700' as const,
    fontSize: 18,
    color: textColor,
  };

  // Configurações comuns para todas as telas
  const commonScreenOptions: BottomTabNavigationOptions = {
    tabBarActiveTintColor: tabIconSelected,
    tabBarInactiveTintColor: tabIconDefault,
    tabBarStyle,
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: '600' as const,
      marginTop: 4,
    },
    tabBarItemStyle: {
      paddingTop: 5,
    },
    tabBarBackground: () =>
      Platform.OS === 'ios' ? (
        <BlurView
          intensity={90}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      ) : null,
    headerShown: true,
    headerTransparent: Platform.OS === 'ios',
    headerTintColor: textColor,
    headerTitleAlign: 'center' as const,
    headerStyle,
    headerTitleStyle,
  };

  // Componente para ícone com animação
  const AnimatedTabIcon = ({ 
    name, 
    color, 
    size, 
    focused 
  }: { 
    name: keyof typeof Feather.glyphMap; 
    color: string; 
    size: number; 
    focused: boolean;
  }) => {
    const scale = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
      if (focused) {
        Animated.spring(scale, {
          toValue: 1.2,
          tension: 150,
          friction: 10,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(scale, {
          toValue: 1,
          tension: 150,
          friction: 10,
          useNativeDriver: true,
        }).start();
      }
    }, [focused, scale]);

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <Feather name={name} size={size} color={color} />
      </Animated.View>
    );
  };

  // Função para obter título do header
  const getHeaderTitle = (routeName: keyof ChiefTabParamList) => {
    switch (routeName) {
      case 'ChiefDashboard':
        return 'Dashboard de Comando';
      case 'IncidentList':
        return 'Ocorrências Ativas';
      case 'Reports':
        return 'Relatórios de Atuação';
      case 'Profile':
        return 'Perfil do Comandante';
      default:
        return '';
    }
  };

  // Função para obter ícone do header
  const getHeaderIcon = (routeName: keyof ChiefTabParamList) => {
    switch (routeName) {
      case 'ChiefDashboard':
        return 'home';
      case 'IncidentList':
        return 'list';
      case 'Reports':
        return 'bar-chart-2';
      case 'Profile':
        return 'user';
      default:
        return 'home';
    }
  };

  // Componente de header personalizado
  const CustomHeaderTitle = ({ routeName }: { routeName: keyof ChiefTabParamList }) => (
    <View style={styles.headerTitleContainer}>
      <Feather 
        name={getHeaderIcon(routeName)} 
        size={22} 
        color={primaryColor} 
      />
      <Text style={[styles.headerTitleText, { color: textColor, marginLeft: 8 }]}>
        {getHeaderTitle(routeName)}
      </Text>
    </View>
  );

  return (
    <Tab.Navigator
      initialRouteName="ChiefDashboard"
      screenOptions={commonScreenOptions}
    >
      <Tab.Screen
        name="ChiefDashboard"
        component={ChiefDashboardScreen}
        options={({ route }) => ({
          title: 'Dashboard',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <AnimatedTabIcon 
                name="home" 
                color={color} 
                size={size} 
                focused={focused} 
              />
              {focused && <View style={[styles.activeIndicator, { backgroundColor: color }]} />}
            </View>
          ),
          headerTitle: () => <CustomHeaderTitle routeName="ChiefDashboard" />,
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => console.log('Notificações')}
            >
              <Feather name="bell" size={22} color={textColor} />
              <View style={[styles.notificationBadge, { backgroundColor: Colors.bombeiros.emergency }]} />
            </TouchableOpacity>
          ),
        })}
      />
      
      <Tab.Screen
        name="IncidentList"
        component={IncidentListScreen}
        options={({ route }) => ({
          title: 'Ocorrências',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <AnimatedTabIcon 
                name="list" 
                color={color} 
                size={size} 
                focused={focused} 
              />
              {focused && <View style={[styles.activeIndicator, { backgroundColor: color }]} />}
            </View>
          ),
          headerTitle: () => <CustomHeaderTitle routeName="IncidentList" />,
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => console.log('Filtrar ocorrências')}
            >
              <Feather name="filter" size={22} color={textColor} />
            </TouchableOpacity>
          ),
        })}
      />
      
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={({ route }) => ({
          title: 'Relatórios',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <AnimatedTabIcon 
                name="bar-chart-2" 
                color={color} 
                size={size} 
                focused={focused} 
              />
              {focused && <View style={[styles.activeIndicator, { backgroundColor: color }]} />}
            </View>
          ),
          headerTitle: () => <CustomHeaderTitle routeName="Reports" />,
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => console.log('Gerar relatório')}
            >
              <Feather name="download" size={22} color={textColor} />
            </TouchableOpacity>
          ),
        })}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <AnimatedTabIcon 
                name="user" 
                color={color} 
                size={size} 
                focused={focused} 
              />
              {focused && <View style={[styles.activeIndicator, { backgroundColor: color }]} />}
            </View>
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerButton: {
    marginRight: 16,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

// Hook para navegação entre tabs
export const useChiefNavigation = () => {
  const navigation = useNavigation<BottomTabNavigationProp<ChiefTabParamList>>();
  
  return {
    navigateToDashboard: () => navigation.navigate('ChiefDashboard'),
    navigateToIncidents: () => navigation.navigate('IncidentList'),
    navigateToReports: () => navigation.navigate('Reports'),
    navigateToProfile: () => navigation.navigate('Profile'),
    
    // Funções com parâmetros
    navigateToIncidentDetail: (incidentId: string) => {
      // Navegar para detalhe de ocorrência (precisa de tela adicional)
      console.log('Navegar para detalhe:', incidentId);
    },
    
    navigateToReportDetail: (reportId: string) => {
      // Navegar para detalhe de relatório
      console.log('Navegar para relatório:', reportId);
    },
  };
};

// Componente para Badge de contador (ex: número de ocorrências)
export const TabBadge: React.FC<{
  count: number;
  color?: string;
  size?: number;
}> = ({ count, color = '#FF3B30', size = 18 }) => {
  if (count <= 0) return null;
  
  return (
    <View style={[
      badgeStyles.container,
      { 
        backgroundColor: color,
        width: size,
        height: size,
        borderRadius: size / 2,
      }
    ]}>
      <Text style={badgeStyles.text}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
};

const badgeStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -5,
    right: -5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

// Componente para TabBar customizada
export const CustomTabBarButton: React.FC<{
  children: React.ReactNode;
  onPress: () => void;
}> = ({ children, onPress }) => {
  return (
    <TouchableOpacity
      style={tabButtonStyles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={tabButtonStyles.content}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

const tabButtonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Função para obter ícone baseado na rota
export const getTabIcon = (
  routeName: keyof ChiefTabParamList, 
  isFocused: boolean, 
  color: string
) => {
  const iconSize = isFocused ? 24 : 22;
  
  switch (routeName) {
    case 'ChiefDashboard':
      return <Feather name="home" size={iconSize} color={color} />;
    case 'IncidentList':
      return <Feather name="list" size={iconSize} color={color} />;
    case 'Reports':
      return <Feather name="bar-chart-2" size={iconSize} color={color} />;
    case 'Profile':
      return <Feather name="user" size={iconSize} color={color} />;
    default:
      return <Feather name="home" size={iconSize} color={color} />;
  }
};

export type ChiefTabRoute = keyof ChiefTabParamList;