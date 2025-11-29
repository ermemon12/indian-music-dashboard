/**
 * Main Application Controller
 * Coordinates all modules and handles user interactions
 */

/**
 * Application state
 */
const appState = {
  allRagas: [],
  filteredRagas: [],
  displayedRagas: [],
  searchTerm: '',
  filters: {
    thaat: null,
    timeOfDay: null
  },
  selectedRaga: null
};

/**
 * Initialize the application
 * Sets up initial state and event listeners
 */
function init() {
  try {
    console.log('Initializing Indian Music Dashboard...');
    
    // Load all ragas from data module
    appState.allRagas = getAllRagas();
    
    // Validate that we have data
    if (!appState.allRagas || appState.allRagas.length === 0) {
      throw new Error('No raga data available');
    }
    
    // Validate raga data structure
    const invalidRagas = appState.allRagas.filter(raga => !isValidRaga(raga));
    if (invalidRagas.length > 0) {
      console.warn(`Found ${invalidRagas.length} invalid raga(s) in dataset:`, invalidRagas);
      // Filter out invalid ragas
      appState.allRagas = appState.allRagas.filter(raga => isValidRaga(raga));
    }
    
    appState.filteredRagas = [...appState.allRagas];
    appState.displayedRagas = [...appState.allRagas];
    
    // Initialize UI (populate filter dropdowns)
    initializeUI();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initial display
    updateDisplay();
    
    console.log(`Dashboard initialized successfully with ${appState.allRagas.length} ragas`);
  } catch (error) {
    console.error('Failed to initialize application:', error);
    displayCriticalError('Failed to load the dashboard. Please refresh the page.');
  }
}

/**
 * Validate that a raga object has all required fields
 * @param {Object} raga - The raga object to validate
 * @returns {boolean} True if raga is valid
 */
function isValidRaga(raga) {
  if (!raga || typeof raga !== 'object') {
    return false;
  }
  
  const requiredFields = ['id', 'name', 'thaat', 'timeOfDay', 'aroha', 'avaroha'];
  return requiredFields.every(field => {
    return raga.hasOwnProperty(field) && 
           raga[field] !== null && 
           raga[field] !== undefined &&
           (typeof raga[field] === 'string' && raga[field].trim() !== '');
  });
}

/**
 * Display a critical error message to the user
 * @param {string} message - The error message to display
 */
function displayCriticalError(message) {
  const container = document.getElementById('ragaListContainer');
  if (container) {
    container.innerHTML = `
      <div class="col-span-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
        <strong class="font-bold">Error: </strong>
        <span class="block sm:inline">${message}</span>
        <button onclick="location.reload()" class="mt-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded">
          Reload Page
        </button>
      </div>
    `;
  }
}

/**
 * Reset application state to initial values
 * Useful for error recovery
 */
function resetState() {
  try {
    console.log('Resetting application state...');
    
    // Stop any playing audio
    if (typeof stopAudio === 'function') {
      stopAudio();
    }
    
    // Close any open modals
    const modal = document.getElementById('ragaDetailModal');
    if (modal && !modal.classList.contains('hidden')) {
      hideRagaDetail();
    }
    
    // Clear search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = '';
    }
    appState.searchTerm = '';
    
    // Clear filters
    appState.filters.thaat = null;
    appState.filters.timeOfDay = null;
    clearFilters();
    updateFilterUI(appState.filters);
    
    // Reset displayed ragas
    appState.filteredRagas = [...appState.allRagas];
    appState.displayedRagas = [...appState.allRagas];
    
    // Update display
    updateDisplay();
    
    console.log('State reset successfully');
  } catch (error) {
    console.error('Error resetting state:', error);
  }
}

/**
 * Set up all event listeners for user interactions
 */
function setupEventListeners() {
  // Search input with debouncing
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    // Debounce search input for better performance
    // Debouncing delays the search until user stops typing for 300ms
    // This prevents excessive re-renders while user is actively typing
    // 
    // Without debouncing: "bhairav" = 7 searches (one per keystroke)
    // With debouncing: "bhairav" = 1 search (after user stops typing)
    let searchTimeout;
    searchInput.addEventListener('input', (event) => {
      // Clear any pending search timeout
      clearTimeout(searchTimeout);
      // Set new timeout to execute search after 300ms of inactivity
      searchTimeout = setTimeout(() => {
        handleSearchInput(event);
      }, 300);
    });
  }
  
  // Thaat filter
  const thaatFilter = document.getElementById('thaatFilter');
  if (thaatFilter) {
    thaatFilter.addEventListener('change', handleFilterChange);
  }
  
  // Time of day filter
  const timeFilter = document.getElementById('timeFilter');
  if (timeFilter) {
    timeFilter.addEventListener('change', handleFilterChange);
  }
  
  // Clear filters button
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', handleClearFilters);
  }
  
  // Reset state button
  const resetStateBtn = document.getElementById('resetStateBtn');
  if (resetStateBtn) {
    resetStateBtn.addEventListener('click', resetState);
  }
  
  // Modal close button
  const closeModalBtn = document.getElementById('closeModalBtn');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideRagaDetail);
  }
  
  // Close modal when clicking outside
  const modal = document.getElementById('ragaDetailModal');
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        hideRagaDetail();
      }
    });
  }
  
  // Close modal with ESC key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      const modal = document.getElementById('ragaDetailModal');
      if (modal && !modal.classList.contains('hidden')) {
        event.preventDefault();
        hideRagaDetail();
      }
    }
  });
}

/**
 * Handle filter changes (thaat or time of day)
 * @param {Event} event - The change event
 */
function handleFilterChange(event) {
  try {
    const filterId = event.target.id;
    const filterValue = event.target.value || null;
    
    console.log(`Filter changed: ${filterId} = ${filterValue}`);
    
    // Update filter state based on which filter changed
    if (filterId === 'thaatFilter') {
      appState.filters.thaat = filterValue;
      setThaatFilter(filterValue);
    } else if (filterId === 'timeFilter') {
      appState.filters.timeOfDay = filterValue;
      setTimeFilter(filterValue);
    }
    
    // Update display with new filters
    updateDisplay();
  } catch (error) {
    console.error('Error handling filter change:', error);
    displayErrorMessage('Failed to apply filter. Please try again.');
  }
}

/**
 * Handle search input changes
 * @param {Event} event - The input event
 */
function handleSearchInput(event) {
  try {
    appState.searchTerm = event.target.value;
    console.log(`Search term: "${appState.searchTerm}"`);
    updateDisplay();
  } catch (error) {
    console.error('Error handling search input:', error);
    displayErrorMessage('Search failed. Please try again.');
  }
}

/**
 * Handle clear filters button click
 */
function handleClearFilters() {
  try {
    console.log('Clearing all filters');
    
    // Clear filter state
    appState.filters.thaat = null;
    appState.filters.timeOfDay = null;
    
    // Clear filters in filter module
    clearFilters();
    
    // Update filter UI
    updateFilterUI(appState.filters);
    
    // Update display
    updateDisplay();
  } catch (error) {
    console.error('Error clearing filters:', error);
    displayErrorMessage('Failed to clear filters. Please try again.');
  }
}

/**
 * Update the display based on current state
 * Applies filters and search, then renders the result
 */
function updateDisplay() {
  try {
    // Start with all ragas
    let ragas = [...appState.allRagas];
    
    // Apply filters
    ragas = applyFilters(ragas, appState.filters);
    appState.filteredRagas = ragas;
    
    // Apply search
    ragas = searchRagas(ragas, appState.searchTerm);
    appState.displayedRagas = ragas;
    
    console.log(`Displaying ${ragas.length} ragas (filtered: ${appState.filteredRagas.length}, total: ${appState.allRagas.length})`);
    
    // Render the raga list
    renderRagaList(ragas);
  } catch (error) {
    console.error('Error updating display:', error);
    displayErrorMessage('Failed to update display. Please try refreshing the page.');
  }
}

/**
 * Display a temporary error message to the user
 * @param {string} message - The error message to display
 */
function displayErrorMessage(message) {
  const container = document.getElementById('ragaListContainer');
  if (container) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'col-span-full bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.innerHTML = `
      <strong class="font-bold">Warning: </strong>
      <span class="block sm:inline">${message}</span>
    `;
    
    // Insert at the top of the container
    container.insertBefore(errorDiv, container.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }
}

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM is already ready
  init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    init,
    setupEventListeners,
    handleFilterChange,
    handleSearchInput,
    handleClearFilters,
    updateDisplay,
    resetState,
    isValidRaga,
    displayCriticalError,
    displayErrorMessage,
    appState
  };
}
