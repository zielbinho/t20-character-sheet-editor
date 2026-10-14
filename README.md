# Gerenciador de Ficha — Tormenta 20

Aplicação web para criar, gerenciar e automatizar fichas de personagem do sistema de RPG **Tormenta 20**. Preenchimento de atributos, perícias, equipamentos e magias com cálculos automáticos, e salvamento local no navegador.

> 🚧 Projeto em desenvolvimento.

## ✨ Funcionalidades

- Assistente de criação de personagem
- Atributos, perícias, vitais (PV/PM) e combate
- Inventário e magias
- Gerenciamento de condições e efeitos ativos
- Subida de nível (level up)
- Rolador de dados com histórico de rolagens
- Vários personagens, com seleção entre eles
- Dados salvos localmente no navegador (`localStorage`)

## 🚀 Tecnologias

- React 19
- TypeScript
- Vite

## 💻 Como rodar localmente

Pré-requisito: Node.js 18 ou superior.

```bash
git clone https://github.com/zielbinho/t20-character-sheet-editor.git
cd t20-character-sheet-editor
npm install
npm run dev
```

Acesse `http://localhost:3000` no navegador.

Para gerar o build de produção:

```bash
npm run build
npm run preview
```

## 📁 Estrutura

```
├── components/   # seções da ficha (atributos, perícias, combate, magias...)
├── data/         # dados de regras do sistema (T20Data.ts)
├── App.tsx       # componente raiz
├── constants.ts  # constantes do sistema
├── types.ts      # tipos TypeScript
└── utils.ts      # funções auxiliares e cálculos
```

## ⚠️ Aviso

Este é um projeto de fã, sem fins lucrativos e sem afiliação com a Jambô Editora. Tormenta 20 é marca e propriedade de seus respectivos titulares.
