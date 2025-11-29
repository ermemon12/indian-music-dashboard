/**
 * Search Module
 * Implements search functionality with case-insensitive substring matching
 */

/**
 * Normalize a search term for consistent processing
 * Converts to lowercase and trims whitespace
 * 
 * @param {string} term - The search term to normalize
 * @returns {string} Normalized search term
 */
function normalizeSearchTerm(term) {
  if (!term || typeof term !== 'string') {
    return '';
  }
  return term.toLowerCase().trim();
}

/**
 * Search ragas by name with case-insensitive substring matching
 * 
 * @param {Array} ragas - Array of raga objects to search
 * @param {string} searchTerm - The term to search for
 * @returns {Array} Array of ragas whose names contain the search term
 */
function searchRagas(ragas, searchTerm) {
  try {
    if (!ragas || !Array.isArray(ragas)) {
      console.warn('Invalid ragas array provided to searchRagas');
      return [];
    }
    
    // Normalize the search term
    const normalizedTerm = normalizeSearchTerm(searchTerm);
    
    // If search term is empty, return all ragas
    if (normalizedTerm === '') {
      return [...ragas];
    }
    
    // Filter ragas whose names contain the search term (case-insensitive)
    const results = ragas.filter(raga => {
      if (!raga || typeof raga !== 'object') {
        console.warn('Invalid raga object encountered in search:', raga);
        return false;
      }
      
      if (!raga.name || typeof raga.name !== 'string') {
        console.warn('Raga missing name field:', raga);
        return false;
      }
      
      const normalizedName = raga.name.toLowerCase();
      return normalizedName.includes(normalizedTerm);
    });
    
    console.log(`Search for "${searchTerm}" returned ${results.length} results`);
    return results;
  } catch (error) {
    console.error('Error searching ragas:', error);
    return ragas || [];
  }
}

/**
 * Highlight matching text in a string by wrapping it with HTML markup
 * 
 * @param {string} text - The text to highlight matches in
 * @param {string} searchTerm - The term to highlight
 * @returns {string} Text with HTML markup around matches
 */
function highlightMatch(text, searchTerm) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  // Normalize the search term
  const normalizedTerm = normalizeSearchTerm(searchTerm);
  
  // If search term is empty, return original text
  if (normalizedTerm === '') {
    return text;
  }
  
  // Find the match position (case-insensitive)
  const lowerText = text.toLowerCase();
  const matchIndex = lowerText.indexOf(normalizedTerm);
  
  // If no match found, return original text
  if (matchIndex === -1) {
    return text;
  }
  
  // Extract the matched portion with original casing
  const beforeMatch = text.substring(0, matchIndex);
  const matchedText = text.substring(matchIndex, matchIndex + normalizedTerm.length);
  const afterMatch = text.substring(matchIndex + normalizedTerm.length);
  
  // Wrap the matched text with a span element for highlighting
  return `${beforeMatch}<span class="highlight">${matchedText}</span>${afterMatch}`;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    searchRagas,
    highlightMatch,
    normalizeSearchTerm
  };
}
