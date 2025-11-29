/**
 * Filter Module
 * Handles filtering logic for ragas based on thaat and time of day
 */

/**
 * Filter state
 */
const filterState = {
  thaat: null,
  timeOfDay: null
};

/**
 * Apply filters to a list of ragas
 * Filters are combined with AND logic - ragas must match all active filters
 * 
 * Filter logic:
 * - If no filters are active (both null/empty), return all ragas
 * - If thaat filter is active, only include ragas with matching thaat
 * - If time filter is active, only include ragas with matching timeOfDay
 * - If both filters are active, ragas must match BOTH criteria (AND logic)
 * 
 * Example:
 * - Filter: { thaat: "Kalyan", timeOfDay: "Evening" }
 * - Result: Only ragas that are BOTH Kalyan thaat AND Evening time
 * 
 * @param {Array} ragas - Array of raga objects to filter
 * @param {Object} filters - Filter criteria { thaat: string|null, timeOfDay: string|null }
 * @returns {Array} Filtered array of ragas
 */
function applyFilters(ragas, filters) {
  try {
    if (!ragas || !Array.isArray(ragas)) {
      console.warn('Invalid ragas array provided to applyFilters');
      return [];
    }
    
    if (!filters) {
      return [...ragas];
    }
    
    // Use Array.filter to create a new array containing only matching ragas
    const filtered = ragas.filter(raga => {
      // Skip invalid raga objects
      if (!raga || typeof raga !== 'object') {
        console.warn('Invalid raga object encountered in filter:', raga);
        return false;
      }
      
      // Check thaat filter (if active)
      // Filter is considered active if it's not null, undefined, or empty string
      if (filters.thaat !== null && filters.thaat !== undefined && filters.thaat !== '') {
        // If raga's thaat doesn't match filter, exclude this raga
        if (raga.thaat !== filters.thaat) {
          return false;
        }
      }
      
      // Check time of day filter (if active)
      if (filters.timeOfDay !== null && filters.timeOfDay !== undefined && filters.timeOfDay !== '') {
        // If raga's timeOfDay doesn't match filter, exclude this raga
        if (raga.timeOfDay !== filters.timeOfDay) {
          return false;
        }
      }
      
      // Raga passes all active filters - include it in results
      return true;
    });
    
    console.log(`Filtered ${ragas.length} ragas to ${filtered.length} results`);
    return filtered;
  } catch (error) {
    console.error('Error applying filters:', error);
    // On error, return original array to avoid breaking the UI
    return ragas || [];
  }
}

/**
 * Set the thaat filter
 * @param {string|null} thaat - The thaat to filter by, or null to clear
 */
function setThaatFilter(thaat) {
  filterState.thaat = thaat;
}

/**
 * Set the time of day filter
 * @param {string|null} time - The time of day to filter by, or null to clear
 */
function setTimeFilter(time) {
  filterState.timeOfDay = time;
}

/**
 * Clear all filters
 */
function clearFilters() {
  filterState.thaat = null;
  filterState.timeOfDay = null;
}

/**
 * Get the current active filters
 * @returns {Object} Current filter state
 */
function getActiveFilters() {
  return { ...filterState };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    applyFilters,
    setThaatFilter,
    setTimeFilter,
    clearFilters,
    getActiveFilters,
    filterState
  };
}
