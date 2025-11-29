/**
 * UI Manager Module
 * Manages DOM manipulation and rendering
 */

/**
 * Initialize the UI by populating filter dropdowns
 */
function initializeUI() {
  try {
    console.log('Initializing UI...');
    
    // Populate thaat filter dropdown
    const thaatFilter = document.getElementById('thaatFilter');
    if (thaatFilter) {
      const thaats = getThaats();
      
      if (!thaats || thaats.length === 0) {
        console.warn('No thaats available for filter');
      } else {
        thaats.forEach(thaat => {
          const option = document.createElement('option');
          option.value = thaat;
          option.textContent = thaat;
          thaatFilter.appendChild(option);
        });
        console.log(`Populated ${thaats.length} thaats in filter`);
      }
    } else {
      console.warn('Thaat filter element not found');
    }
    
    // Populate time of day filter dropdown
    const timeFilter = document.getElementById('timeFilter');
    if (timeFilter) {
      const times = getTimesOfDay();
      
      if (!times || times.length === 0) {
        console.warn('No times of day available for filter');
      } else {
        times.forEach(time => {
          const option = document.createElement('option');
          option.value = time;
          option.textContent = time;
          timeFilter.appendChild(option);
        });
        console.log(`Populated ${times.length} times in filter`);
      }
    } else {
      console.warn('Time filter element not found');
    }
    
    console.log('UI initialized successfully');
  } catch (error) {
    console.error('Error initializing UI:', error);
    throw error; // Re-throw to be caught by init()
  }
}

/**
 * Render a list of ragas in the grid layout
 * Ragas are sorted alphabetically before rendering
 * Uses DocumentFragment to minimize reflows
 * 
 * Performance optimization:
 * - DocumentFragment batches all DOM insertions into a single operation
 * - This minimizes browser reflows and repaints
 * - Without fragment: N reflows (one per card)
 * - With fragment: 1 reflow (all cards at once)
 * 
 * @param {Array} ragas - Array of raga objects to display
 */
function renderRagaList(ragas) {
  const container = document.getElementById('ragaListContainer');
  const noResultsMessage = document.getElementById('noResultsMessage');
  
  if (!container) {
    console.error('Raga list container not found');
    return;
  }
  
  try {
    // Clear existing content
    container.innerHTML = '';
    
    // Check if there are ragas to display
    if (!ragas || ragas.length === 0) {
      showNoResults();
      return;
    }
    
    // Hide no results message
    if (noResultsMessage) {
      noResultsMessage.classList.add('hidden');
    }
    
    // Sort ragas alphabetically by name
    // Using spread operator to create a copy (avoid mutating original array)
    // localeCompare provides proper alphabetical sorting with Unicode support
    const sortedRagas = [...ragas].sort((a, b) => {
      if (!a || !a.name || !b || !b.name) {
        console.warn('Invalid raga object encountered during sorting');
        return 0;
      }
      return a.name.localeCompare(b.name);
    });
    
    // Use DocumentFragment to batch DOM updates and minimize reflows
    // DocumentFragment is a lightweight container that exists in memory only
    // It doesn't trigger reflows until appended to the actual DOM
    const fragment = document.createDocumentFragment();
    
    // Render each raga card and add to fragment
    sortedRagas.forEach(raga => {
      try {
        const card = renderRagaCard(raga);
        if (card) {
          // Add to fragment (in-memory operation, no reflow)
          fragment.appendChild(card);
        }
      } catch (error) {
        console.error('Error rendering raga card:', error, raga);
        // Continue with other ragas even if one fails
      }
    });
    
    // Single DOM update - append all cards at once
    // This triggers only ONE reflow for all cards
    container.appendChild(fragment);
    
    // Set up event delegation for raga card clicks (if not already set up)
    // We only set this up once, not on every render
    if (!container.hasAttribute('data-delegation-setup')) {
      setupRagaListEventDelegation(container);
      container.setAttribute('data-delegation-setup', 'true');
    }
    
    console.log(`Rendered ${sortedRagas.length} raga cards`);
  } catch (error) {
    console.error('Error rendering raga list:', error);
    container.innerHTML = `
      <div class="col-span-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
        <strong class="font-bold">Error: </strong>
        <span class="block sm:inline">Failed to display ragas. Please refresh the page.</span>
      </div>
    `;
  }
}

/**
 * Create an individual raga card HTML element
 * Event listeners are handled via delegation on the container
 * 
 * @param {Object} raga - The raga object to render
 * @returns {HTMLElement|null} The raga card element or null if invalid
 */
function renderRagaCard(raga) {
  try {
    // Validate raga object
    if (!raga || typeof raga !== 'object') {
      console.warn('Invalid raga object provided to renderRagaCard');
      return null;
    }
    
    // Ensure required fields exist
    const name = raga.name || 'Unknown Raga';
    const id = raga.id || 'unknown';
    const thaat = raga.thaat || 'Unknown';
    const timeOfDay = raga.timeOfDay || 'Unknown';
    const mood = raga.mood || 'No description available';
    
    // Create card container
    const card = document.createElement('article');
    card.className = 'bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2';
    card.setAttribute('data-raga-id', id);
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View details for ${name}, ${thaat} thaat, ${timeOfDay}`);
    
    // Create card content with escaped HTML to prevent XSS
    const escapedName = escapeHtml(name);
    const escapedThaat = escapeHtml(thaat);
    const escapedTimeOfDay = escapeHtml(timeOfDay);
    const escapedMood = escapeHtml(mood);
    
    card.innerHTML = `
      <div class="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3">
        <h3 class="text-xl font-bold text-white">${escapedName}</h3>
      </div>
      <div class="p-4">
        <div class="mb-2" aria-label="Classification">
          <span class="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded" aria-label="Thaat: ${escapedThaat}">
            ${escapedThaat}
          </span>
          <span class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded ml-2" aria-label="Time: ${escapedTimeOfDay}">
            ${escapedTimeOfDay}
          </span>
        </div>
        <p class="text-gray-600 text-sm line-clamp-2" aria-label="Mood: ${escapedMood}">${escapedMood}</p>
      </div>
    `;
    
    // Note: Event listeners are now handled via event delegation on the container
    // This improves performance by reducing the number of event listeners
    
    return card;
  } catch (error) {
    console.error('Error creating raga card:', error, raga);
    return null;
  }
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Set up event delegation for raga list interactions
 * Uses a single event listener on the container instead of individual listeners on each card
 * This improves performance, especially with large datasets
 * 
 * Event delegation pattern:
 * - Instead of attaching listeners to each card (N listeners for N cards)
 * - We attach one listener to the parent container
 * - Events bubble up from cards to container
 * - We check which card was clicked using event.target.closest()
 * 
 * Performance benefits:
 * - Reduces memory usage (1 listener vs N listeners)
 * - Faster initial render (no need to attach listeners during card creation)
 * - Automatically handles dynamically added/removed cards
 * 
 * @param {HTMLElement} container - The raga list container element
 */
function setupRagaListEventDelegation(container) {
  // Handle click events via delegation
  container.addEventListener('click', (event) => {
    // Find the closest raga card element by traversing up the DOM tree
    // This works even if user clicks on a child element (like the title or badge)
    const card = event.target.closest('[data-raga-id]');
    if (card) {
      const ragaId = card.getAttribute('data-raga-id');
      if (ragaId) {
        showRagaDetail(ragaId);
      }
    }
  });
  
  // Handle keyboard events via delegation for accessibility
  container.addEventListener('keydown', (event) => {
    // Only handle Enter and Space keys (standard activation keys)
    if (event.key === 'Enter' || event.key === ' ') {
      // Find the closest raga card element
      const card = event.target.closest('[data-raga-id]');
      if (card) {
        // Prevent default to avoid page scroll on Space key
        event.preventDefault();
        const ragaId = card.getAttribute('data-raga-id');
        if (ragaId) {
          showRagaDetail(ragaId);
        }
      }
    }
  });
}

/**
 * Show the "no results" message when no ragas match filters/search
 */
function showNoResults() {
  const container = document.getElementById('ragaListContainer');
  const noResultsMessage = document.getElementById('noResultsMessage');
  
  if (container) {
    container.innerHTML = '';
  }
  
  if (noResultsMessage) {
    noResultsMessage.classList.remove('hidden');
  }
}

/**
 * Show the raga detail modal with full information
 * 
 * @param {string} ragaId - The ID of the raga to display
 */
function showRagaDetail(ragaId) {
  try {
    console.log(`Opening detail view for raga: ${ragaId}`);
    
    const raga = getRagaById(ragaId);
    
    if (!raga) {
      console.error(`Raga with ID "${ragaId}" not found`);
      displayModalError('Raga not found. Please try again.');
      return;
    }
    
    const modal = document.getElementById('ragaDetailModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) {
      console.error('Modal elements not found');
      return;
    }
  
    // Store the element that triggered the modal for focus restoration
    modal.setAttribute('data-trigger-element', document.activeElement?.getAttribute('data-raga-id') || '');
    
    // Escape HTML to prevent XSS
    const escapedName = escapeHtml(raga.name || 'Unknown');
    const escapedThaat = escapeHtml(raga.thaat || 'Unknown');
    const escapedTimeOfDay = escapeHtml(raga.timeOfDay || 'Unknown');
    const escapedAroha = escapeHtml(raga.aroha || 'Not available');
    const escapedAvaroha = escapeHtml(raga.avaroha || 'Not available');
    const escapedMood = escapeHtml(raga.mood || 'Not available');
    const escapedCharacteristics = escapeHtml(raga.characteristics || 'Not available');
    
    // Build modal content with audio player controls
    const modalDescription = modalContent.querySelector('#modalDescription');
    const contentHTML = `
    <div class="space-y-4">
      <div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">${escapedName}</h3>
        <div class="flex flex-wrap gap-2 mb-4" role="group" aria-label="Raga classification">
          <span class="inline-block bg-orange-100 text-orange-800 text-sm font-semibold px-3 py-1 rounded" role="text">
            Thaat: ${escapedThaat}
          </span>
          <span class="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded" role="text">
            ${escapedTimeOfDay}
          </span>
        </div>
      </div>
      
      <div>
        <h4 class="text-lg font-semibold text-gray-700 mb-2">Aroha (Ascending)</h4>
        <p class="text-gray-600 font-mono bg-gray-50 p-3 rounded" role="text" aria-label="Ascending note pattern: ${escapedAroha}">${escapedAroha}</p>
      </div>
      
      <div>
        <h4 class="text-lg font-semibold text-gray-700 mb-2">Avaroha (Descending)</h4>
        <p class="text-gray-600 font-mono bg-gray-50 p-3 rounded" role="text" aria-label="Descending note pattern: ${escapedAvaroha}">${escapedAvaroha}</p>
      </div>
      
      <div>
        <h4 class="text-lg font-semibold text-gray-700 mb-2">Mood</h4>
        <p class="text-gray-600" role="text">${escapedMood}</p>
      </div>
      
      <div>
        <h4 class="text-lg font-semibold text-gray-700 mb-2">Characteristics</h4>
        <p class="text-gray-600" role="text">${escapedCharacteristics}</p>
      </div>
      
      ${raga.audioFile ? `
        <div id="audioPlayerSection" role="region" aria-label="Audio player">
          <h4 class="text-lg font-semibold text-gray-700 mb-2">Audio Sample</h4>
          <div class="bg-gray-50 p-4 rounded">
            <div class="flex items-center gap-3" role="group" aria-label="Audio controls">
              <button id="playBtn" type="button" class="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2" aria-label="Play audio sample of ${escapedName}">
                Play
              </button>
              <button id="pauseBtn" type="button" class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 hidden" aria-label="Pause audio playback">
                Pause
              </button>
              <button id="stopBtn" type="button" class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 hidden" aria-label="Stop audio playback">
                Stop
              </button>
            </div>
          </div>
        </div>
      ` : `
        <div class="bg-gray-100 p-4 rounded text-center" role="status">
          <p class="text-gray-600">Audio sample not available</p>
        </div>
      `}
    </div>
  `;
    
    // Insert content after the screen reader description
    if (modalDescription) {
      modalDescription.insertAdjacentHTML('afterend', contentHTML);
    } else {
      modalContent.innerHTML = contentHTML;
    }
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Trap focus within modal
    trapFocusInModal(modal);
    
    // Set up audio player controls if audio file exists
    if (raga.audioFile && typeof playAudio === 'function') {
      const playBtn = document.getElementById('playBtn');
      const pauseBtn = document.getElementById('pauseBtn');
      const stopBtn = document.getElementById('stopBtn');
      
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          playAudio(raga.audioFile)
            .then(() => {
              playBtn.classList.add('hidden');
              playBtn.setAttribute('aria-hidden', 'true');
              pauseBtn.classList.remove('hidden');
              pauseBtn.removeAttribute('aria-hidden');
              stopBtn.classList.remove('hidden');
              stopBtn.removeAttribute('aria-hidden');
            })
            .catch(error => {
              console.error('Failed to play audio:', error);
              // Error message is already displayed by playAudio function
            });
        });
      }
      
      if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
          pauseAudio();
          pauseBtn.classList.add('hidden');
          pauseBtn.setAttribute('aria-hidden', 'true');
          playBtn.classList.remove('hidden');
          playBtn.removeAttribute('aria-hidden');
        });
      }
      
      if (stopBtn) {
        stopBtn.addEventListener('click', () => {
          stopAudio();
          pauseBtn.classList.add('hidden');
          pauseBtn.setAttribute('aria-hidden', 'true');
          stopBtn.classList.add('hidden');
          stopBtn.setAttribute('aria-hidden', 'true');
          playBtn.classList.remove('hidden');
          playBtn.removeAttribute('aria-hidden');
        });
      }
    }
    
    // Focus on close button for accessibility
    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        closeBtn.focus();
      }, 100);
    }
    
    console.log('Detail modal opened successfully');
  } catch (error) {
    console.error('Error showing raga detail:', error);
    displayModalError('Failed to load raga details. Please try again.');
  }
}

/**
 * Display an error message in a modal
 * @param {string} message - The error message to display
 */
function displayModalError(message) {
  const modal = document.getElementById('ragaDetailModal');
  const modalContent = document.getElementById('modalContent');
  
  if (modal && modalContent) {
    modalContent.innerHTML = `
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
        <strong class="font-bold">Error: </strong>
        <span class="block sm:inline">${escapeHtml(message)}</span>
      </div>
    `;
    modal.classList.remove('hidden');
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      hideRagaDetail();
    }, 3000);
  }
}

/**
 * Trap focus within the modal for keyboard navigation
 * 
 * Focus trapping is an accessibility requirement for modal dialogs:
 * - Prevents keyboard users from tabbing out of the modal
 * - Ensures focus cycles through modal elements only
 * - Meets WCAG 2.1 success criterion 2.4.3 (Focus Order)
 * 
 * How it works:
 * 1. Find all focusable elements within the modal
 * 2. When Tab is pressed on the last element, wrap to first element
 * 3. When Shift+Tab is pressed on first element, wrap to last element
 * 
 * @param {HTMLElement} modal - The modal element
 */
function trapFocusInModal(modal) {
  // Query all focusable elements within the modal
  // Includes: buttons, links, inputs, selects, textareas, and elements with tabindex >= 0
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  // Remove any existing focus trap listener to avoid duplicates
  // This is important when reopening the modal multiple times
  modal.removeEventListener('keydown', modal._focusTrapHandler);
  
  // Create and store the focus trap handler on the modal element
  // Storing it allows us to remove it later when the modal closes
  modal._focusTrapHandler = (e) => {
    // Only trap Tab key, allow other keys to work normally
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      // Shift + Tab: Moving backwards through focusable elements
      if (document.activeElement === firstFocusable) {
        // If on first element, wrap to last element
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab: Moving forwards through focusable elements
      if (document.activeElement === lastFocusable) {
        // If on last element, wrap to first element
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };
  
  // Attach the focus trap handler to the modal
  modal.addEventListener('keydown', modal._focusTrapHandler);
}

/**
 * Hide the raga detail modal
 */
function hideRagaDetail() {
  try {
    console.log('Closing detail modal');
    
    // Stop any playing audio before closing
    if (typeof stopAudio === 'function') {
      stopAudio();
    }
    
    const modal = document.getElementById('ragaDetailModal');
    
    if (modal) {
      // Remove focus trap listener
      if (modal._focusTrapHandler) {
        modal.removeEventListener('keydown', modal._focusTrapHandler);
        modal._focusTrapHandler = null;
      }
      
      // Restore focus to the element that opened the modal
      const triggerRagaId = modal.getAttribute('data-trigger-element');
      if (triggerRagaId) {
        const triggerElement = document.querySelector(`[data-raga-id="${triggerRagaId}"]`);
        if (triggerElement) {
          triggerElement.focus();
        }
      }
      
      modal.classList.add('hidden');
      
      // Clear modal content to prevent stale content
      const modalContent = document.getElementById('modalContent');
      if (modalContent) {
        const modalDescription = modalContent.querySelector('#modalDescription');
        if (modalDescription) {
          // Keep only the description, remove dynamic content
          modalContent.innerHTML = '<span id="modalDescription" class="sr-only">Detailed information about the selected raga including aroha, avaroha, mood, and characteristics</span>';
        }
      }
    }
  } catch (error) {
    console.error('Error hiding raga detail:', error);
    // Force hide modal even if error occurs
    const modal = document.getElementById('ragaDetailModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }
}

/**
 * Update filter UI to reflect current state
 * 
 * @param {Object} filters - Current filter state
 */
function updateFilterUI(filters) {
  const thaatFilter = document.getElementById('thaatFilter');
  const timeFilter = document.getElementById('timeFilter');
  
  if (thaatFilter && filters.thaat !== undefined) {
    thaatFilter.value = filters.thaat || '';
  }
  
  if (timeFilter && filters.timeOfDay !== undefined) {
    timeFilter.value = filters.timeOfDay || '';
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderRagaList,
    renderRagaCard,
    showRagaDetail,
    hideRagaDetail,
    updateFilterUI,
    showNoResults,
    initializeUI,
    trapFocusInModal,
    setupRagaListEventDelegation,
    escapeHtml,
    displayModalError
  };
}
