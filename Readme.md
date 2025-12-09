# 🚒 Projeto Integrador – App Mobile

📌 Sobre o Projeto

 O objetivo é desenvolver uma aplicação mobile robusta que permita aos bombeiros registrar, acompanhar e gerenciar ocorrências em tempo real no campo, com sincronização eficiente e interface otimizada para uso em situações de emergência.

🎯 Funcionalidades do Aplicativo Mobile:

- Acesso seguro com autenticação por email/senha

- Perfis diferenciados: Usuário, Chefe e Administrador

- Geolocalização em tempo real do usuário

- Marcadores coloridos por status de ocorrência

- Integração com serviços de localização nativos

- Sistema de notificações personalizado e feedback tátil

- Registro completo de incidentes 

- Status em tempo real: Pendente/Em andamento/Resolvida

- Filtros avançados por data e tipo

📱 Arquitetura Técnica do Mobile

Linguagem Principal:

- TypeScript: Tipagem estática para maior segurança e manutenibilidade

Framework e Runtime:

- React Native: Framework principal para desenvolvimento cross-platform
 
- Expo SDK: Ambiente de desenvolvimento unificado com módulos nativos

Navegação e UI:

- React Navigation: Navegação robusta com stacks, tabs e drawers

- React Native Reanimated: Animações de alta performance

- Expo Vector Icons: Biblioteca de ícones consistentes

- Expo Blur & Glass Effect: Efeitos visuais modernos

Gerenciamento de Estado:

- Context API: Para tema global e autenticação

- AsyncStorage: Persistência local segura de dados

Funcionalidades Nativas:

- Expo Camera: Captura de fotos e vídeos

- React Native Maps: Integração com mapas

- Expo Location: Serviços de geolocalização

- Expo File System: Manipulação de arquivos locais

- Expo Haptics: Feedback tátil

- React Native Signature Canvas: Captura de assinaturas

Estilização e Design System:

- Sistema de Temas Dinâmico: Suporte a light/dark/high contrast

- StyleSheet: Estilização otimizada para React Native

- Componentes Customizados: Biblioteca interna reutilizável

- Design System Bombeiros: Cores e tipografia padronizadas

Segurança e Performance:

- Validação de Credenciais: Múltiplas camadas de segurança

- Otimização de Imagens: Expo Image para carregamento eficiente

- Persistência Offline: Funcionalidades disponíveis sem conexão

- Gestão de Memória: Cleanup automático de recursos

👨‍💻 Colaboradores

Desenvolvimento e Arquitetura: 

- Ana Beatriz – Gestão de projetos, Documentação e Desenvolvedora Full Stack

- Gustavo Henrique – Desenvolvedor Full Stack Mobile

Design e Experiência do Usuário: 

- Eloisa De Andrade – UX/UI Design 

- Cayo Luiz – UX/UI Design

- Matheus Ferreira – UX/UI Design

Auxiliar: 

- Larissa Monteiro - Auxiliar

📋 Requisitos do Sistema

No Computador de Desenvolvimento:

- Node.js

- Expo CLI instalado globalmente (npm install -g expo-cli)

- Git para clonar o repositório

No Dispositivo Móvel:

- Expo Go instalado (disponível na App Store e Play Store)

- Conexão com a internet (Wi-Fi ou dados móveis)

🚀 Como Executar

1. Clonar e Instalar Dependências
```
# Clonar o repositório
git clone [URL_DO_REPOSITORIO]
cd [NOME_DO_PROJETO]

# Instalar dependências
npm install
```

2. Iniciar o Servidor de Desenvolvimento
```
# Iniciar o projeto Expo
npx expo start
```
3. Escanear o QR Code no Dispositivo Móvel
   
- Abra o aplicativo Expo Go no seu celular

- Toque em "Scan QR Code" e aponte a câmera para o QR Code exibido no terminal

- Aguarde o carregamento do aplicativo (pode levar alguns minutos na primeira vez)

4. Modos de Execução Alternativos
```
# Modo desenvolvimento com tunnel (para redes diferentes)
npx expo start --tunnel

# Modo específico para iOS
npx expo start --ios

# Modo específico para Android
npx expo start --android

# Modo web (para teste no navegador)
npx expo start --web
```

5. Credenciais de Teste

- Para testar a aplicação, utilize:

- Usuário Comum: qualquer email + senha 123456

- Chefe: email contendo "chief" ou "chefe" + senha 123456

- Administrador: email contendo "admin" + senha 123456

⚠️ Limitações do Expo Go

- Algumas funcionalidades nativas podem ter comportamento limitado

- Performance pode ser inferior a um build nativo

- Funcionalidades de background podem não funcionar completamente

- Recomendado para testes de desenvolvimento e demonstrações

🔧 Scripts Disponíveis

```
# Verificar formatação do código
npm run check:format

# Formatar automaticamente o código
npm run format

# Verificar problemas de linting
npm run lint

# Iniciar com configuração específica para Replit
npm run dev
```

