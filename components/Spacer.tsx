// components/Spacer.tsx
import React from 'react';
import { View, ViewStyle } from 'react-native';

interface SpacerProps {
  size?: number | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
  width?: number;
  height?: number;
  horizontal?: boolean;
}

const Spacer: React.FC<SpacerProps> = ({ 
  size = 'm', 
  width,
  height,
  horizontal = false,
}) => {
  // Função para converter tamanho nominal para valor numérico
  const getSizeValue = (sizeValue: number | string): number => {
    if (typeof sizeValue === 'number') {
      return sizeValue;
    }
    
    switch (sizeValue) {
      case 'xs': return 4;
      case 's': return 8;
      case 'm': return 16;
      case 'l': return 24;
      case 'xl': return 32;
      case 'xxl': return 48;
      default: return 16;
    }
  };

  // Determinar estilo baseado nas props
  const style: ViewStyle = {};
  
  if (width !== undefined) {
    style.width = width;
  } else if (height !== undefined) {
    style.height = height;
  } else {
    // Se não especificou width/height, usar size e horizontal
    const sizeValue = getSizeValue(size);
    if (horizontal) {
      style.width = sizeValue;
      style.height = 1; // altura mínima
    } else {
      style.height = sizeValue;
      style.width = 1; // largura mínima
    }
  }

  return <View style={style} />;
};

export default Spacer;