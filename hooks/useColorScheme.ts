import { useColorScheme as useRNColorScheme } from "react-native";
import { useEffect, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ColorSchemePreference = "light" | "dark" | "auto";

interface UseColorSchemeOptions {
  persist?: boolean;
  storageKey?: string;
  defaultPreference?: ColorSchemePreference;
}

/**
 * Hook robusto para gerenciamento de esquema de cores
 * 
 * @param options Configurações do hook
 * @returns Objeto com informações do esquema de cores
 */
export function useColorScheme(
  options: UseColorSchemeOptions = {}
) {
  const {
    persist = true,
    storageKey = "app_color_scheme",
    defaultPreference = "auto",
  } = options;

  const systemScheme = useRNColorScheme();
  const [preference, setPreference] = useState<ColorSchemePreference>(
    defaultPreference
  );

  // Carregar preferência salva
  useEffect(() => {
    if (!persist) return;

    const loadPreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(storageKey);
        if (saved && ["light", "dark", "auto"].includes(saved)) {
          setPreference(saved as ColorSchemePreference);
        }
      } catch (error) {
        console.warn("Erro ao carregar preferência de tema:", error);
      }
    };

    loadPreference();
  }, [persist, storageKey]);

  // Calcular esquema atual
  const currentScheme =
    preference === "auto" ? systemScheme || "light" : preference;

  // Salvar preferência
  const updatePreference = async (newPreference: ColorSchemePreference) => {
    if (persist) {
      try {
        await AsyncStorage.setItem(storageKey, newPreference);
      } catch (error) {
        console.error("Erro ao salvar preferência de tema:", error);
        throw error;
      }
    }
    
    setPreference(newPreference);
  };

  // Escutar mudanças no sistema (apenas para modo auto)
  useEffect(() => {
    if (preference !== "auto") return;

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Atualiza quando o sistema muda
      setPreference("auto"); // Força recálculo
    });

    return () => subscription.remove();
  }, [preference]);

  return {
    // Informações básicas
    scheme: currentScheme,
    preference,
    systemScheme,
    
    // Boolean helpers
    isDark: currentScheme === "dark",
    isLight: currentScheme === "light",
    isAuto: preference === "auto",
    
    // Métodos
    setPreference: updatePreference,
    toggle: () => {
      const newPref: ColorSchemePreference = 
        preference === "light" ? "dark" : 
        preference === "dark" ? "auto" : "light";
      updatePreference(newPref);
    },
    
    // Para uso condicional
    when: <T>(lightValue: T, darkValue: T): T => {
      return currentScheme === "dark" ? darkValue : lightValue;
    },
    
    // Para estilos
    select: <T>(options: { light: T; dark: T }): T => {
      return currentScheme === "dark" ? options.dark : options.light;
    },
  };
}

// Hook de conveniência para componentes funcionais
export function useDarkMode() {
  const { isDark } = useColorScheme();
  return isDark;
}

// Hook para cores dinâmicas
export function useDynamicColor(
  lightColor: string,
  darkColor: string
) {
  const { scheme } = useColorScheme();
  return scheme === "dark" ? darkColor : lightColor;
}