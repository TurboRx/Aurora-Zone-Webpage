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
function initializeWebsite() {
  try {
    console.log('🌟 Initializing Aurora Zone website...');
    
    // Show loading screen
    showLoadingScreen();
    
    // Initialize core functionality
    setTimeout(() => {
      initTheme();
      initParticles();
      initAnimations();
      initEventListeners();
      initLiveStats();
      initEventCountdown();
      initPokemonOfTheDay();
      initGames();
      setupKeyboardNavigation();
      setupScrollEffects();
      
      // Hide loading screen after everything is ready
      setTimeout(() => {
        hideLoadingScreen();
        initAOSAnimations();
        showNotification('Welcome to Aurora Zone! 🌟', 'success');
      }, 2000);
    }, 500);
    
    console.log('✅ Aurora Zone website initialized successfully!');
  } catch (error) {
    console.error('❌ Error during initialization:', error);
    hideLoadingScreen();
    showNotification('Error loading website. Please refresh.', 'error');
  }
}

// Loading Screen Management
function showLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.display = 'flex';
    isLoading = true;
  }
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      isLoading = false;
    }, 500);
  }
}

// Particle System
function initParticles() {
  if (reducedMotion.matches) return;
  
  const container = document.getElementById('particles-container');
  if (!container) return;
  
  for (let i = 0; i < 50; i++) {
    createParticle(container);
  }
}

function createParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  const size = Math.random() * 4 + 2;
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const duration = Math.random() * 3 + 3;
  
  particle.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${x}%;
    top: ${y}%;
    animation-duration: ${duration}s;
    animation-delay: ${Math.random() * 2}s;
  `;
  
  container.appendChild(particle);
  
  // Remove and recreate particle after animation
  setTimeout(() => {
    if (container.contains(particle)) {
      container.removeChild(particle);
      if (particlesEnabled && !reducedMotion.matches) {
        createParticle(container);
      }
    }
  }, (duration + 2) * 1000);
}

// Music Management
function initMusicToggle() {
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  const bgMusic = document.getElementById('bgMusic');
  
  if (!musicToggle || !bgMusic) return;
  
  musicToggle.addEventListener('click', () => {
    musicEnabled = !musicEnabled;
    
    if (musicEnabled) {
      bgMusic.play().catch(e => console.log('Music play failed:', e));
      musicIcon.textContent = 'music_note';
      musicToggle.title = 'Disable Background Music';
    } else {
      bgMusic.pause();
      musicIcon.textContent = 'music_off';
      musicToggle.title = 'Enable Background Music';
    }
    
    localStorage.setItem('musicEnabled', musicEnabled);
  });
  
  // Load saved preference
  const savedMusicPref = localStorage.getItem('musicEnabled') === 'true';
  if (savedMusicPref) {
    musicToggle.click();
  }
}

// Section Navigation
function showSection(id) {
  try {
    if (!id || typeof id !== 'string') {
      console.error('Invalid section ID provided');
      return;
    }

    // Hide all sections
    const sections = document.querySelectorAll('main section');
    sections.forEach((section) => {
      section.classList.remove('active');
      section.setAttribute('aria-hidden', 'true');
    });

    // Show target section
    const targetSection = document.getElementById(id);
    if (targetSection) {
      targetSection.classList.add('active');
      targetSection.setAttribute('aria-hidden', 'false');
      
      updateNavigation(id);
      currentSection = id;
      
      // Trigger section-specific initialization
      initSectionFeatures(id);
      
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Focus management
      const heading = targetSection.querySelector('h2');
      if (heading) {
        setTimeout(() => heading.focus(), 300);
      }
    } else {
      console.error(`Section with ID '${id}' not found`);
    }
  } catch (error) {
    console.error('Error showing section:', error);
  }
}

// Section-specific feature initialization
function initSectionFeatures(sectionId) {
  switch (sectionId) {
    case 'pokemon':
      generatePokemonGrid();
      break;
    case 'battles':
      initBattleSimulator();
      break;
    case 'leaderboard':
      updateLeaderboard();
      break;
    case 'events':
      initEventCountdown();
      break;
    case 'games':
      initGames();
      break;
  }
}

// Navigation Updates
function updateNavigation(activeId) {
  try {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach((link) => {
      const section = link.getAttribute('data-section');
      if (section === activeId) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  } catch (error) {
    console.error('Error updating navigation:', error);
  }
}

// Theme Management
function applyTheme(mode) {
  try {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    
    if (!body || !icon) {
      console.error('Theme elements not found');
      return;
    }

    body.classList.remove('light', 'dark', 'aurora');

    switch (mode) {
      case 'auto':
        const prefersDark = mediaQuery.matches;
        body.classList.add(prefersDark ? 'dark' : 'light');
        icon.textContent = 'brightness_auto';
        break;
      case 'dark':
        body.classList.add('dark');
        icon.textContent = 'dark_mode';
        break;
      case 'light':
        body.classList.add('light');
        icon.textContent = 'light_mode';
        break;
      case 'aurora':
        body.classList.add('aurora');
        icon.textContent = 'auto_awesome';
        break;
      default:
        console.warn(`Unknown theme mode: ${mode}`);
        applyTheme('auto');
        return;
    }

    announceThemeChange(mode);
  } catch (error) {
    console.error('Error applying theme:', error);
  }
}

function setTheme(mode) {
  try {
    localStorage.setItem('theme', mode);
    applyTheme(mode);
  } catch (error) {
    console.error('Error setting theme:', error);
  }
}

function initTheme() {
  try {
    const saved = localStorage.getItem('theme') || 'auto';
    const themeSelect = document.getElementById('themeMode');
    
    if (themeSelect) {
      themeSelect.value = saved;
    }
    
    applyTheme(saved);
    
    // Listen for system theme changes
    mediaQuery.addListener(() => {
      const currentTheme = localStorage.getItem('theme') || 'auto';
      if (currentTheme === 'auto') {
        applyTheme('auto');
      }
    });
  } catch (error) {
    console.error('Error initializing theme:', error);
    applyTheme('auto');
  }
}

// Live Statistics
function initLiveStats() {
  updateLiveStats();
  setInterval(updateLiveStats, 30000); // Update every 30 seconds
}

function updateLiveStats() {
  const onlineCount = document.getElementById('onlineCount');
  const battlesCount = document.getElementById('battlesCount');
  const membersCount = document.getElementById('membersCount');
  
  // Simulate dynamic stats with some randomization
  if (onlineCount) {
    const baseOnline = 42;
    const variance = Math.floor(Math.random() * 20 - 10);
    onlineCount.textContent = Math.max(1, baseOnline + variance);
  }
  
  if (battlesCount) {
    const baseBattles = 18;
    const variance = Math.floor(Math.random() * 10 - 5);
    battlesCount.textContent = Math.max(0, baseBattles + variance);
  }
  
  if (membersCount) {
    // Members count grows slowly over time
    const baseMembers = 1337;
    const growth = Math.floor(Date.now() / 86400000) - 19000; // Days since epoch - offset
    membersCount.textContent = (baseMembers + Math.max(0, growth)).toLocaleString();
  }
}

// Pokemon of the Day
function initPokemonOfTheDay() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem('pokemonOfTheDayDate');
  
  if (savedDate !== today) {
    // New day, pick new pokemon
    const randomPokemon = pokemonDatabase[Math.floor(Math.random() * pokemonDatabase.length)];
    localStorage.setItem('pokemonOfTheDay', JSON.stringify(randomPokemon));
    localStorage.setItem('pokemonOfTheDayDate', today);
  }
  
  updatePokemonOfTheDay();
}

function updatePokemonOfTheDay() {
  const pokemon = JSON.parse(localStorage.getItem('pokemonOfTheDay') || '{}');
  const nameElement = document.getElementById('pokemonName');
  const spriteElement = document.querySelector('.pokemon-sprite');
  
  if (pokemon.name && nameElement && spriteElement) {
    nameElement.textContent = pokemon.name;
    spriteElement.textContent = pokemon.sprite;
    
    // Update type and stats if elements exist
    const typeElement = document.querySelector('.pokemon-type');
    if (typeElement) {
      typeElement.textContent = `${pokemon.type.charAt(0).toUpperCase() + pokemon.type.slice(1)} Type`;
    }
    
    const stats = document.querySelectorAll('.stat');
    if (stats.length >= 3 && pokemon.stats) {
      stats[0].textContent = `HP: ${pokemon.stats.hp}`;
      stats[1].textContent = `ATK: ${pokemon.stats.attack}`;
      stats[2].textContent = `DEF: ${pokemon.stats.defense}`;
    }
  }
}

// Pokemon Grid Generation
function generatePokemonGrid() {
  const grid = document.getElementById('pokemonGrid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  pokemonDatabase.forEach((pokemon, index) => {
    const card = createPokemonCard(pokemon, index);
    grid.appendChild(card);
  });
}

function createPokemonCard(pokemon, index) {
  const card = document.createElement('div');
  card.className = `pokemon-card ${pokemon.type}-type`;
  card.setAttribute('data-type', pokemon.type);
  
  card.innerHTML = `
    <div class="pokemon-image">
      <div class="shiny-effect"></div>
      <span class="pokemon-sprite">${pokemon.sprite}</span>
    </div>
    <div class="pokemon-info">
      <h4>${pokemon.name}</h4>
      <p class="pokemon-type">${pokemon.type.charAt(0).toUpperCase() + pokemon.type.slice(1)} Type</p>
      <div class="pokemon-stats">
        <span class="stat">HP: ${pokemon.stats.hp}</span>
        <span class="stat">ATK: ${pokemon.stats.attack}</span>
        <span class="stat">DEF: ${pokemon.stats.defense}</span>
      </div>
    </div>
  `;
  
  card.addEventListener('click', () => {
    showPokemonDetails(pokemon);
  });
  
  // Add animation delay
  card.style.animationDelay = `${index * 0.1}s`;
  
  return card;
}

function filterPokemon(type) {
  const cards = document.querySelectorAll('.pokemon-card');
  const buttons = document.querySelectorAll('.type-btn');
  
  // Update active button
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  // Filter cards
  cards.forEach(card => {
    if (type === 'all' || card.dataset.type === type) {
      card.style.display = 'block';
      card.style.animation = 'fadeIn 0.5s ease';
    } else {
      card.style.display = 'none';
    }
  });
}

// Battle Simulator
function initBattleSimulator() {
  randomizePokemon();
}

function randomizePokemon() {
  const pokemon1 = pokemonDatabase[Math.floor(Math.random() * pokemonDatabase.length)];
  const pokemon2 = pokemonDatabase[Math.floor(Math.random() * pokemonDatabase.length)];
  
  const player1Element = document.querySelector('#player1Pokemon .pokemon-emoji');
  const player2Element = document.querySelector('#player2Pokemon .pokemon-emoji');
  
  if (player1Element && player2Element) {
    player1Element.textContent = pokemon1.sprite;
    player2Element.textContent = pokemon2.sprite;
    
    // Store for battle simulation
    window.battlePokemon = { player1: pokemon1, player2: pokemon2 };
  }
}

function simulateBattle() {
  const logContent = document.getElementById('logContent');
  const player1HP = document.querySelector('#player1Pokemon .hp-fill');
  const player2HP = document.querySelector('#player2Pokemon .hp-fill');
  
  if (!logContent || !window.battlePokemon) {
    console.error('Battle elements not found');
    return;
  }
  
  const { player1, player2 } = window.battlePokemon;
  
  // Clear previous log
  logContent.innerHTML = '';
  
  // Reset HP bars
  if (player1HP) player1HP.style.width = '100%';
  if (player2HP) player2HP.style.width = '100%';
  
  // Simulate battle
  addBattleLog(`${player1.name} vs ${player2.name} - Battle Start!`);
  
  let p1HP = 100;
  let p2HP = 100;
  let turn = 1;
  
  const battleInterval = setInterval(() => {
    const attacker = turn % 2 === 1 ? player1 : player2;
    const defender = turn % 2 === 1 ? player2 : player1;
    
    const damage = Math.floor(Math.random() * 30 + 10);
    
    if (turn % 2 === 1) {
      p2HP = Math.max(0, p2HP - damage);
      if (player2HP) player2HP.style.width = `${p2HP}%`;
    } else {
      p1HP = Math.max(0, p1HP - damage);
      if (player1HP) player1HP.style.width = `${p1HP}%`;
    }
    
    addBattleLog(`${attacker.name} attacks ${defender.name} for ${damage} damage!`);
    
    if (p1HP <= 0) {
      addBattleLog(`${player2.name} wins the battle! 🎉`);
      clearInterval(battleInterval);
      showNotification(`${player2.name} is victorious!`, 'success');
    } else if (p2HP <= 0) {
      addBattleLog(`${player1.name} wins the battle! 🎉`);
      clearInterval(battleInterval);
      showNotification(`${player1.name} is victorious!`, 'success');
    }
    
    turn++;
    
    // Safety check to prevent infinite battles
    if (turn > 20) {
      addBattleLog('Battle ended in a draw!');
      clearInterval(battleInterval);
    }
  }, 1500);
}

function addBattleLog(message) {
  const logContent = document.getElementById('logContent');
  if (logContent) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    logContent.appendChild(p);
    logContent.scrollTop = logContent.scrollHeight;
  }
}

// Leaderboard Management
function updateLeaderboard() {
  // This would typically fetch from an API
  console.log('Leaderboard updated');
}

function filterLeaderboard(period) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  // Here you would filter the leaderboard data
  console.log(`Filtering leaderboard for: ${period}`);
}

// Event Countdown
function initEventCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  // Set target date (example: next Saturday 8 PM UTC)
  const now = new Date();
  const nextSaturday = new Date();
  nextSaturday.setDate(now.getDate() + (6 - now.getDay()) % 7);
  nextSaturday.setHours(20, 0, 0, 0);
  
  if (nextSaturday <= now) {
    nextSaturday.setDate(nextSaturday.getDate() + 7);
  }
  
  const diff = nextSaturday - now;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  updateCountdownElement('days', days);
  updateCountdownElement('hours', hours);
  updateCountdownElement('minutes', minutes);
  updateCountdownElement('seconds', seconds);
}

function updateCountdownElement(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value.toString().padStart(2, '0');
  }
}

// Mini Games
function initGames() {
  initGuessGame();
  initTypeQuiz();
  initMemoryGame();
}

// Pokemon Guessing Game
function initGuessGame() {
  gameStates.guessGame.currentPokemon = getRandomPokemon();
  updateGuessGameUI();
}

function getRandomPokemon() {
  return pokemonDatabase[Math.floor(Math.random() * pokemonDatabase.length)];
}

function updateGuessGameUI() {
  const mysteryElement = document.querySelector('.mystery-pokemon');
  if (mysteryElement && gameStates.guessGame.currentPokemon) {
    mysteryElement.textContent = '❓';
  }
}

function checkGuess() {
  const input = document.getElementById('pokemonGuess');
  const scoreElement = document.getElementById('guessScore');
  
  if (!input || !gameStates.guessGame.currentPokemon) return;
  
  const guess = input.value.toLowerCase().trim();
  const correct = gameStates.guessGame.currentPokemon.name.toLowerCase();
  
  if (guess === correct) {
    gameStates.guessGame.score += 10;
    showNotification(`Correct! It's ${gameStates.guessGame.currentPokemon.name}! 🎉`, 'success');
    
    // Show the pokemon briefly
    const mysteryElement = document.querySelector('.mystery-pokemon');
    if (mysteryElement) {
      mysteryElement.textContent = gameStates.guessGame.currentPokemon.sprite;
      setTimeout(() => {
        gameStates.guessGame.currentPokemon = getRandomPokemon();
        updateGuessGameUI();
      }, 2000);
    }
  } else {
    showNotification(`Try again! It's not ${guess}`, 'error');
  }
  
  if (scoreElement) {
    scoreElement.textContent = gameStates.guessGame.score;
  }
  
  input.value = '';
}

// Type Effectiveness Quiz
function initTypeQuiz() {
  generateTypeQuestion();
}

function generateTypeQuestion() {
  const types = Object.keys(typeEffectiveness);
  const questionType = types[Math.floor(Math.random() * types.length)];
  
  gameStates.typeQuiz.currentQuestion = {
    type: questionType,
    correctAnswer: typeEffectiveness[questionType].weak[0] || 'normal'
  };
  
  updateTypeQuizUI();
}

function updateTypeQuizUI() {
  const questionElement = document.querySelector('#typeQuiz p');
  if (questionElement && gameStates.typeQuiz.currentQuestion) {
    const type = gameStates.typeQuiz.currentQuestion.type;
    questionElement.textContent = `What's super effective against ${type.charAt(0).toUpperCase() + type.slice(1)} type?`;
  }
}

function selectAnswer(answer) {
  const streakElement = document.getElementById('quizStreak');
  
  if (!gameStates.typeQuiz.currentQuestion) return;
  
  const correct = typeEffectiveness[gameStates.typeQuiz.currentQuestion.type].weak.includes(answer);
  
  if (correct) {
    gameStates.typeQuiz.streak++;
    showNotification('Correct! 🎯', 'success');
  } else {
    gameStates.typeQuiz.streak = 0;
    showNotification('Not quite right! Try again! 🤔', 'warning');
  }
  
  if (streakElement) {
    streakElement.textContent = gameStates.typeQuiz.streak;
  }
  
  // Generate new question
  setTimeout(generateTypeQuestion, 1000);
}

// Memory Game
function initMemoryGame() {
  gameStates.memoryGame = { moves: 0, cards: [], flippedCards: [] };
  updateMemoryGameUI();
}

function startMemoryGame() {
  const grid = document.getElementById('memoryGame');
  if (!grid) return;
  
  // Generate card pairs
  const symbols = ['🔥', '💧', '🌿', '⚡', '🔮', '👻', '🐲', '✨'];
  const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
  
  gameStates.memoryGame.cards = cards;
  gameStates.memoryGame.moves = 0;
  gameStates.memoryGame.flippedCards = [];
  
  grid.innerHTML = '';
  
  cards.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.index = index;
    card.dataset.symbol = symbol;
    card.textContent = '❓';
    
    card.addEventListener('click', () => flipMemoryCard(index));
    grid.appendChild(card);
  });
  
  updateMemoryScore();
}

function flipMemoryCard(index) {
  const card = document.querySelector(`[data-index="${index}"]`);
  if (!card || gameStates.memoryGame.flippedCards.includes(index) || gameStates.memoryGame.flippedCards.length >= 2) {
    return;
  }
  
  card.classList.add('flipped');
  card.textContent = card.dataset.symbol;
  gameStates.memoryGame.flippedCards.push(index);
  
  if (gameStates.memoryGame.flippedCards.length === 2) {
    gameStates.memoryGame.moves++;
    updateMemoryScore();
    
    const [first, second] = gameStates.memoryGame.flippedCards;
    const firstCard = document.querySelector(`[data-index="${first}"]`);
    const secondCard = document.querySelector(`[data-index="${second}"]`);
    
    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
      // Match found
      setTimeout(() => {
        firstCard.style.opacity = '0.5';
        secondCard.style.opacity = '0.5';
        gameStates.memoryGame.flippedCards = [];
        checkMemoryGameComplete();
      }, 500);
    } else {
      // No match
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '❓';
        secondCard.textContent = '❓';
        gameStates.memoryGame.flippedCards = [];
      }, 1000);
    }
  }
}

function updateMemoryScore() {
  const movesElement = document.getElementById('memoryMoves');
  if (movesElement) {
    movesElement.textContent = gameStates.memoryGame.moves;
  }
}

function checkMemoryGameComplete() {
  const cards = document.querySelectorAll('.memory-card');
  const completedCards = Array.from(cards).filter(card => card.style.opacity === '0.5');
  
  if (completedCards.length === cards.length) {
    showNotification(`Game completed in ${gameStates.memoryGame.moves} moves! 🎉`, 'success');
  }
}

// Scroll Effects
function setupScrollEffects() {
  const backToTop = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    // Show/hide back to top button
    if (window.pageYOffset > 300) {
      backToTop?.classList.add('show');
    } else {
      backToTop?.classList.remove('show');
    }
    
    // Update scroll progress (could add a progress bar)
    const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.documentElement.style.setProperty('--scroll-progress', `${scrollPercent}%`);
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Keyboard Navigation
function setupKeyboardNavigation() {
  document.addEventListener('keydown', (event) => {
    // ESC key to close modals or go back
    if (event.key === 'Escape') {
      // Close any open modals or return to home
      showSection('home');
    }
    
    // Number keys for quick section navigation
    const sectionKeys = {
      '1': 'home',
      '2': 'pokemon',
      '3': 'battles',
      '4': 'leaderboard',
      '5': 'events',
      '6': 'games',
      '7': 'rules',
      '8': 'contact',
      '9': 'credits'
    };
    
    if (sectionKeys[event.key] && !isInputFocused()) {
      showSection(sectionKeys[event.key]);
    }
    
    // Enter key for Pokemon guess game
    if (event.key === 'Enter' && event.target.id === 'pokemonGuess') {
      checkGuess();
    }
  });
}

function isInputFocused() {
  const activeElement = document.activeElement;
  return activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
}

// Animation Management
function initAnimations() {
  if (reducedMotion.matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    return;
  }
  
  // Initialize various animations
  initHeaderAnimations();
  initCardAnimations();
}

function initHeaderAnimations() {
  const header = document.querySelector('header');
  if (header) {
    header.style.opacity = '0';
    header.style.transform = 'translateY(-50px)';
    
    setTimeout(() => {
      header.style.transition = 'all 1s ease';
      header.style.opacity = '1';
      header.style.transform = 'translateY(0)';
    }, 500);
  }
}

function initCardAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'slideIn 0.6s ease forwards';
      }
    });
  }, observerOptions);
  
  // Observe all cards
  document.querySelectorAll('.feature-card, .event-card, .game-card').forEach(card => {
    observer.observe(card);
  });
}

// AOS (Animate On Scroll) Implementation
function initAOSAnimations() {
  if (reducedMotion.matches) return;
  
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('[data-aos]').forEach(element => {
    observer.observe(element);
  });
}

// Event Listeners
function initEventListeners() {
  // Theme toggle
  const themeSelect = document.getElementById('themeMode');
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => setTheme(e.target.value));
  }
  
  // Music toggle
  initMusicToggle();
  
  // Pokemon guess game
  const guessInput = document.getElementById('pokemonGuess');
  if (guessInput) {
    guessInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkGuess();
    });
  }
  
  // Navigation links
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const section = link.getAttribute('data-section');
        if (section) showSection(section);
      }
    });
  });
}

// Notification System
function showNotification(message, type = 'info', duration = 3000) {
  const container = document.getElementById('notifications');
  if (!container) return;
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  container.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Auto remove
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => container.removeChild(notification), 300);
  }, duration);
}

// Accessibility Announcements
function announceThemeChange(mode) {
  try {
    let liveRegion = document.getElementById('theme-announcement');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'theme-announcement';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    const messages = {
      'auto': 'Theme set to automatic (follows system preference)',
      'light': 'Light theme activated',
      'dark': 'Dark theme activated',
      'aurora': 'Aurora theme activated'
    };

    liveRegion.textContent = messages[mode] || 'Theme changed';
  } catch (error) {
    console.error('Error announcing theme change:', error);
  }
}

// Performance Monitoring
function initPerformanceMonitoring() {
  try {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            console.log('🚀 Page load time:', Math.round(entry.loadEventEnd - entry.startTime), 'ms');
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }
  } catch (error) {
    console.error('Error initializing performance monitoring:', error);
  }
}

// Utility Functions
function setDynamicYear() {
  try {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  } catch (error) {
    console.error('Error setting dynamic year:', error);
  }
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
  initializeWebsite();
}

// Set dynamic year
setDynamicYear();

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  showNotification('An error occurred. Some features may not work properly.', 'error');
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showSection,
    setTheme,
    applyTheme,
    initTheme,
    simulateBattle,
    checkGuess,
    selectAnswer,
    startMemoryGame
  };
}