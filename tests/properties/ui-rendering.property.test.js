/**
 * Property-Based Tests for UI Rendering
 * Feature: indian-music-dashboard
 */

/**
 * Feature: indian-music-dashboard, Property 1: Raga list rendering completeness
 * Validates: Requirements 1.2
 * 
 * Property: For any raga in the dataset, when rendered in the list view,
 * the output HTML should contain the raga's name, thaat classification, and time of day.
 */
function testRagaListRenderingCompleteness() {
  // Property: Rendered raga cards must contain name, thaat, and timeOfDay
  const property = fc.property(
    ragaArbitrary(),
    (raga) => {
      // Render the raga card
      const card = renderRagaCard(raga);
      
      // Get the HTML content as a string
      const htmlContent = card.outerHTML;
      
      // Check that the card contains the raga name
      if (!htmlContent.includes(raga.name)) {
        return false;
      }
      
      // Check that the card contains the thaat
      if (!htmlContent.includes(raga.thaat)) {
        return false;
      }
      
      // Check that the card contains the time of day
      if (!htmlContent.includes(raga.timeOfDay)) {
        return false;
      }
      
      return true;
    }
  );
  
  // Run the property test with 100 iterations
  const result = fc.check(property, { numRuns: 100 });
  
  return result;
}

/**
 * Feature: indian-music-dashboard, Property 3: Alphabetical ordering invariant
 * Validates: Requirements 1.4
 * 
 * Property: For any list of ragas, when sorted by the default sorting function,
 * the resulting list should be in alphabetical order by raga name.
 */
function testAlphabeticalOrdering() {
  // Property: Rendered raga list must be in alphabetical order
  const property = fc.property(
    ragaArrayArbitrary(2, 20),
    (ragas) => {
      // Create a container for testing
      const container = document.createElement('div');
      container.id = 'ragaListContainer';
      
      // Temporarily add to document
      document.body.appendChild(container);
      
      try {
        // Render the raga list
        renderRagaList(ragas);
        
        // Get all rendered raga cards
        const cards = container.querySelectorAll('[data-raga-id]');
        
        // Extract the raga names in the order they appear
        const renderedNames = Array.from(cards).map(card => {
          const ragaId = card.getAttribute('data-raga-id');
          const raga = ragas.find(r => r.id === ragaId);
          return raga ? raga.name : '';
        });
        
        // Check if the names are in alphabetical order
        for (let i = 0; i < renderedNames.length - 1; i++) {
          if (renderedNames[i].localeCompare(renderedNames[i + 1]) > 0) {
            return false; // Not in alphabetical order
          }
        }
        
        return true;
      } finally {
        // Clean up
        document.body.removeChild(container);
      }
    }
  );
  
  // Run the property test with 100 iterations
  const result = fc.check(property, { numRuns: 100 });
  
  return result;
}

/**
 * Feature: indian-music-dashboard, Property 2: Raga detail view completeness
 * Validates: Requirements 1.3, 4.1, 4.2
 * 
 * Property: For any raga in the dataset, when the detail view is rendered,
 * the output should include aroha, avaroha, thaat, time of day, mood, and characteristic phrases.
 */
function testRagaDetailViewCompleteness() {
  // Property: Detail view must contain all required fields
  const property = fc.property(
    ragaArbitrary(),
    (raga) => {
      // Create modal elements for testing
      const modal = document.createElement('div');
      modal.id = 'ragaDetailModal';
      modal.className = 'hidden';
      
      const modalContent = document.createElement('div');
      modalContent.id = 'modalContent';
      modal.appendChild(modalContent);
      
      // Temporarily add to document
      document.body.appendChild(modal);
      
      // Mock getRagaById to return our test raga
      const originalGetRagaById = window.getRagaById;
      window.getRagaById = (id) => (id === raga.id ? raga : null);
      
      try {
        // Show the raga detail
        showRagaDetail(raga.id);
        
        // Get the rendered HTML content
        const htmlContent = modalContent.innerHTML;
        
        // Check that all required fields are present
        const hasAroha = htmlContent.includes(raga.aroha);
        const hasAvaroha = htmlContent.includes(raga.avaroha);
        const hasThaat = htmlContent.includes(raga.thaat);
        const hasTimeOfDay = htmlContent.includes(raga.timeOfDay);
        const hasMood = htmlContent.includes(raga.mood);
        const hasCharacteristics = htmlContent.includes(raga.characteristics);
        
        return hasAroha && hasAvaroha && hasThaat && hasTimeOfDay && hasMood && hasCharacteristics;
      } finally {
        // Restore original function and clean up
        window.getRagaById = originalGetRagaById;
        document.body.removeChild(modal);
      }
    }
  );
  
  // Run the property test with 100 iterations
  const result = fc.check(property, { numRuns: 100 });
  
  return result;
}

/**
 * Feature: indian-music-dashboard, Property 11: Detail view state preservation
 * Validates: Requirements 4.4, 4.5
 * 
 * Property: For any active filter and search state, opening and then closing a raga detail view
 * should preserve the filter and search state unchanged.
 */
function testDetailViewStatePreservation() {
  // Property: Opening and closing detail view preserves filter/search state
  const property = fc.property(
    ragaArbitrary(),
    thaatArbitrary(),
    timeOfDayArbitrary(),
    fc.string({ minLength: 0, maxLength: 20 }),
    (raga, thaat, timeOfDay, searchTerm) => {
      // Create modal elements for testing
      const modal = document.createElement('div');
      modal.id = 'ragaDetailModal';
      modal.className = 'hidden';
      
      const modalContent = document.createElement('div');
      modalContent.id = 'modalContent';
      modal.appendChild(modalContent);
      
      // Create filter elements
      const thaatFilter = document.createElement('select');
      thaatFilter.id = 'thaatFilter';
      thaatFilter.value = thaat;
      
      const timeFilter = document.createElement('select');
      timeFilter.id = 'timeFilter';
      timeFilter.value = timeOfDay;
      
      const searchInput = document.createElement('input');
      searchInput.id = 'searchInput';
      searchInput.value = searchTerm;
      
      // Temporarily add to document
      document.body.appendChild(modal);
      document.body.appendChild(thaatFilter);
      document.body.appendChild(timeFilter);
      document.body.appendChild(searchInput);
      
      // Mock getRagaById to return our test raga
      const originalGetRagaById = window.getRagaById;
      window.getRagaById = (id) => (id === raga.id ? raga : null);
      
      try {
        // Capture initial state
        const initialThaatValue = thaatFilter.value;
        const initialTimeValue = timeFilter.value;
        const initialSearchValue = searchInput.value;
        
        // Show the raga detail
        showRagaDetail(raga.id);
        
        // Hide the raga detail
        hideRagaDetail();
        
        // Check that state is preserved
        const thaatPreserved = thaatFilter.value === initialThaatValue;
        const timePreserved = timeFilter.value === initialTimeValue;
        const searchPreserved = searchInput.value === initialSearchValue;
        
        return thaatPreserved && timePreserved && searchPreserved;
      } finally {
        // Restore original function and clean up
        window.getRagaById = originalGetRagaById;
        document.body.removeChild(modal);
        document.body.removeChild(thaatFilter);
        document.body.removeChild(timeFilter);
        document.body.removeChild(searchInput);
      }
    }
  );
  
  // Run the property test with 100 iterations
  const result = fc.check(property, { numRuns: 100 });
  
  return result;
}

/**
 * Run all UI rendering property tests
 */
function runUIRenderingPropertyTests() {
  console.log('=== UI Rendering Property Tests ===\n');
  
  // Test 1: Raga list rendering completeness
  console.log('Running Property Test: Raga list rendering completeness');
  const result1 = testRagaListRenderingCompleteness();
  
  if (result1.failed) {
    console.error('❌ FAILED: Raga list rendering completeness');
    console.error('Counterexample:', result1.counterexample);
    return false;
  } else {
    console.log('✅ PASSED: Raga list rendering completeness (100 runs)');
  }
  
  // Test 2: Alphabetical ordering
  console.log('Running Property Test: Alphabetical ordering invariant');
  const result2 = testAlphabeticalOrdering();
  
  if (result2.failed) {
    console.error('❌ FAILED: Alphabetical ordering invariant');
    console.error('Counterexample:', result2.counterexample);
    return false;
  } else {
    console.log('✅ PASSED: Alphabetical ordering invariant (100 runs)');
  }
  
  // Test 3: Raga detail view completeness
  console.log('Running Property Test: Raga detail view completeness');
  const result3 = testRagaDetailViewCompleteness();
  
  if (result3.failed) {
    console.error('❌ FAILED: Raga detail view completeness');
    console.error('Counterexample:', result3.counterexample);
    return false;
  } else {
    console.log('✅ PASSED: Raga detail view completeness (100 runs)');
  }
  
  // Test 4: Detail view state preservation
  console.log('Running Property Test: Detail view state preservation');
  const result4 = testDetailViewStatePreservation();
  
  if (result4.failed) {
    console.error('❌ FAILED: Detail view state preservation');
    console.error('Counterexample:', result4.counterexample);
    return false;
  } else {
    console.log('✅ PASSED: Detail view state preservation (100 runs)');
  }
  
  console.log('\n=== All UI Rendering Property Tests Passed ===');
  return true;
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testRagaListRenderingCompleteness,
    testAlphabeticalOrdering,
    testRagaDetailViewCompleteness,
    testDetailViewStatePreservation,
    runUIRenderingPropertyTests
  };
}
