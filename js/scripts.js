// Aurora Zone Website JavaScript
// Enhanced with error handling, accessibility, and performance improvements

// Global variables
let currentSection = 'home';
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

/**
 * Show a specific section and hide others
 * @param {string} id - The ID of the section to show
 */
function showSection(id) {
  try {
    // Validate input
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
      
      // Update navigation aria-current
      updateNavigation(id);
      
      // Update current section tracking
      currentSection = id;
      
      // Focus management for accessibility
      const heading = targetSection.querySelector('h2');
      if (heading) {
        heading.focus();
      }
    } else {
      console.error(`Section with ID '${id}' not found`);
    }
  } catch (error) {
    console.error('Error showing section:', error);
  }
}

/**
 * Setup scroll-to-top button functionality
 */
function setupScrollToTop() {
  try {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          scrollToTopBtn.classList.add('show');
        } else {
          scrollToTopBtn.classList.remove('show');
        }
      });
      scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  } catch (error) {
    console.error('Error setting up scroll-to-top button:', error);
  }
}

/**
 * Update navigation aria-current attributes
 * @param {string} activeId - The ID of the currently active section
 */
function updateNavigation(activeId) {
  try {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  } catch (error) {
    console.error('Error updating navigation:', error);
  }
}

/**
 * Apply theme to the document
 * @param {string} mode - Theme mode: 'auto', 'light', or 'dark'
 */
function applyTheme(mode) {
  try {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    
    if (!body || !icon) {
      console.error('Theme elements not found');
      return;
    }

    // Remove existing theme classes
    body.classList.remove('light', 'dark');

    if (mode === 'auto') {
      const prefersDark = mediaQuery.matches;
      body.classList.add(prefersDark ? 'dark' : 'light');
      icon.textContent = 'brightness_auto';
      icon.setAttribute('aria-label', 'Auto theme (follows system preference)');
    } else if (mode === 'dark') {
      body.classList.add('dark');
      icon.textContent = 'dark_mode';
      icon.setAttribute('aria-label', 'Dark theme active');
    } else if (mode === 'light') {
      body.classList.add('light');
      icon.textContent = 'light_mode';
      icon.setAttribute('aria-label', 'Light theme active');
    } else {
      console.warn(`Unknown theme mode: ${mode}`);
      // Default to auto if invalid mode
      applyTheme('auto');
      return;
    }

    // Announce theme change to screen readers
    announceThemeChange(mode);
  } catch (error) {
    console.error('Error applying theme:', error);
  }
}

/**
 * Set and save theme preference
 * @param {string} mode - Theme mode to set
 */
function setTheme(mode) {
  try {
    if (!mode || typeof mode !== 'string') {
      console.error('Invalid theme mode provided');
      return;
    }

    localStorage.setItem('theme', mode);
    applyTheme(mode);
  } catch (error) {
    console.error('Error setting theme:', error);
  }
}

/**
 * Initialize theme based on saved preference or system preference
 */
function initTheme() {
  try {
    const saved = localStorage.getItem('theme') || 'auto';
    const themeSelect = document.getElementById('themeMode');
    
    if (themeSelect) {
      themeSelect.value = saved;
    }
    
    applyTheme(saved);
  } catch (error) {
    console.error('Error initializing theme:', error);
    // Fallback to auto theme
    applyTheme('auto');
  }
}

/**
 * Announce theme changes to screen readers
 * @param {string} mode - Current theme mode
 */
function announceThemeChange(mode) {
  try {
    // Create or update live region for announcements
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
      'dark': 'Dark theme activated'
    };

    liveRegion.textContent = messages[mode] || 'Theme changed';
  } catch (error) {
    console.error('Error announcing theme change:', error);
  }
}

/**
 * Set up click handlers for navigation and theme selection
 */
function setupClickHandlers() {
  try {
    // Nav links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const sectionId = link.getAttribute('href')?.substring(1);
        if (sectionId) {
          showSection(sectionId);
        }
      });
    });

    // Theme toggle
    const themeSelect = document.getElementById('themeMode');
    if (themeSelect) {
      themeSelect.addEventListener('change', () => {
        setTheme(themeSelect.value);
      });
    }
  } catch (error) {
    console.error('Error setting up click handlers:', error);
  }
}

/**
 * Set up keyboard navigation for better accessibility
 */
function setupKeyboardNavigation() {
  try {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach((link) => {
      link.addEventListener('keydown', (event) => {
        // Handle Enter and Space keys
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          link.click();
        }
      });
    });

    // Add keyboard support for theme toggle
    const themeSelect = document.getElementById('themeMode');
    if (themeSelect) {
      themeSelect.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          setTheme(themeSelect.value);
        }
      });
    }
  } catch (error) {
    console.error('Error setting up keyboard navigation:', error);
  }
}

/**
 * Handle system theme preference changes
 */
function setupSystemThemeListener() {
  try {
    mediaQuery.addListener((e) => {
      const currentTheme = localStorage.getItem('theme') || 'auto';
      if (currentTheme === 'auto') {
        applyTheme('auto');
      }
    });
  } catch (error) {
    console.error('Error setting up system theme listener:', error);
  }
}

/**
 * Set dynamic copyright year
 */
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

/**
 * Initialize performance observer for monitoring
 */
function initPerformanceMonitoring() {
  try {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            console.log('Page load time:', entry.loadEventEnd - entry.startTime, 'ms');
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }
  } catch (error) {
    console.error('Error initializing performance monitoring:', error);
  }
}

/**
 * Handle page visibility changes to pause/resume functionality
 */
function setupVisibilityHandler() {
  try {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Page is now hidden - pause unnecessary operations
        console.log('Page hidden - pausing operations');
      } else {
        // Page is now visible - resume operations
        console.log('Page visible - resuming operations');
      }
    });
  } catch (error) {
    console.error('Error setting up visibility handler:', error);
  }
}

/**
 * Initialize all functionality when DOM is ready
 */
function init() {
  try {
    console.log('Initializing Aurora Zone website...');
    
    // Set dynamic year
    setDynamicYear();
    
    // Initialize theme
    initTheme();
    
    // Setup click handlers
    setupClickHandlers();

    // Setup keyboard navigation
    setupKeyboardNavigation();
    
    // Setup system theme listener
    setupSystemThemeListener();
    
    // Setup scroll-to-top button
    setupScrollToTop();

    // Initialize performance monitoring
    initPerformanceMonitoring();
    
    // Setup visibility handler
    setupVisibilityHandler();
    
    // Set initial navigation state
    updateNavigation('home');
    
    console.log('Aurora Zone website initialized successfully!');
  } catch (error) {
    console.error('Error during initialization:', error);
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM already loaded
  init();
}

// Export functions for testing (if module system is used)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showSection,
    setTheme,
    applyTheme,
    initTheme
  };
}
