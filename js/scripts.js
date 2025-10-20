// Aurora Zone Website - Advanced Interactive JavaScript
// Enhanced with games, animations, battle simulator, and engaging features

// Global variables and state management
let currentSection = 'home';
let isLoading = true;
let musicEnabled = false;
let particlesEnabled = true;
let currentPokemonData = [];
let gameStates = {
  guessGame: { score: 0, currentPokemon: null },
  typeQuiz: { streak: 0, currentQuestion: null },
  memoryGame: { moves: 0, cards: [], flippedCards: [] }
};

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Pokemon data for games and features
const pokemonDatabase = [
  { name: 'Pikachu', type: 'electric', sprite: '⚡', stats: { hp: 35, attack: 55, defense: 40 } },
  { name: 'Charizard', type: 'fire', sprite: '🔥', stats: { hp: 78, attack: 84, defense: 78 } },
  { name: 'Blastoise', type: 'water', sprite: '💧', stats: { hp: 79, attack: 83, defense: 100 } },
  { name: 'Venusaur', type: 'grass', sprite: '🌿', stats: { hp: 80, attack: 82, defense: 83 } },
  { name: 'Alakazam', type: 'psychic', sprite: '🔮', stats: { hp: 55, attack: 50, defense: 45 } },
  { name: 'Gengar', type: 'dark', sprite: '👻', stats: { hp: 60, attack: 65, defense: 60 } },
  { name: 'Dragonite', type: 'dragon', sprite: '🐲', stats: { hp: 91, attack: 134, defense: 95 } },
  { name: 'Mewtwo', type: 'psychic', sprite: '🧠', stats: { hp: 106, attack: 110, defense: 90 } },
  { name: 'Mew', type: 'psychic', sprite: '✨', stats: { hp: 100, attack: 100, defense: 100 } },
  { name: 'Gyarados', type: 'water', sprite: '🌊', stats: { hp: 95, attack: 125, defense: 79 } }
];

const typeEffectiveness = {
  fire: { weak: ['water', 'rock', 'ground'], strong: ['grass', 'ice', 'bug', 'steel'] },
  water: { weak: ['grass', 'electric'], strong: ['fire', 'ground', 'rock'] },
  grass: { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], strong: ['water', 'ground', 'rock'] },
  electric: { weak: ['ground'], strong: ['water', 'flying'] },
  psychic: { weak: ['bug', 'ghost', 'dark'], strong: ['fighting', 'poison'] },
  dark: { weak: ['fighting', 'bug', 'fairy'], strong: ['ghost', 'psychic'] }
};

// Initialization and Loading
function initializeWebsite() { /* ... truncated for brevity ... */ }
