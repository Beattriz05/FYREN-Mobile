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

- Node.js 18+

- Expo CLI 6.x

- iOS Simulator (para desenvolvimento iOS)

- Android Studio (para desenvolvimento Android)

- Dispositivos físicos recomendados para testes reais

🚀 Como Executar

´´´
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm start

# Executar em iOS
npm run ios

# Executar em Android
npm run android

# Executar na web
npm run web

# Verificar formatação
npm run check:format

# Formatar código
npm run format
´´´
