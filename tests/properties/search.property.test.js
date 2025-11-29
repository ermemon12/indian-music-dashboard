/**
 * Property-Based Tests for Search Logic
 * Feature: indian-music-dashboard
 */

/**
 * Feature: indian-music-dashboard, Property 8: Search substring matching
 * Validates: Requirements 3.1
 * 
 * Property: For any search term and any raga dataset, the search results
 * should include only ragas whose names contain the search term as a substring.
 */
function testSearchSubstringMatching() {
  const property = fc.property(
    ragaArrayArbitrary(1, 50),
    fc.string({ minLength: 0, maxLength: 20 }),
    (ragas, searchTerm) => {
      // Apply search
      const results = searchRagas(ragas, searchTerm);
      
      // Normalize the search term for comparison
      const normalizedTerm = normalizeSearchTerm(searchTerm);
      
      // If search term is empty, should return all ragas
      if (normalizedTerm === '') {
        return results.length === ragas.length;
      }
      
      // All results must contain the search term in their name (case-insensitive)
      for (const raga of results) {
        const normalizedName = raga.name.toLowerCase();
        if (!normalizedName.includes(normalizedTerm)) {
          return false;
        }
      }
      
      // All ragas whose names contain the search term must be in results
      const expectedMatches = ragas.filter(r => 
        r.name.toLowerCase().includes(normalizedTerm)
      );
      
      if (results.length !== expectedMatches.length) {
        return false;
      }
      
      return true;
    }
  );
  
  return fc.check(property, { numRuns: 100 });
}

/**
 * Feature: indian-music-dashboard, Property 9: Case-insensitive search equivalence
 * Validates: Requirements 3.3
 * 
 * Property: For any search term, searching with different case variations
 * (uppercase, lowercase, mixed) should return identical result sets.
 */
function testCaseInsensitiveSearch() {
  const property = fc.property(
    ragaArrayArbitrary(1, 50),
    fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
    (ragas, searchTerm) => {
      // Search with original term
      const resultsOriginal = searchRagas(ragas, searchTerm);
      
      // Search with lowercase version
      const resultsLower = searchRagas(ragas, searchTerm.toLowerCase());
      
      // Search with uppercase version
      const resultsUpper = searchRagas(ragas, searchTerm.toUpperCase());
      
      // Search with mixed case (alternate upper/lower)
      let mixedCase = '';
      for (let i = 0; i < searchTerm.length; i++) {
        mixedCase += i % 2 === 0 
          ? searchTerm[i].toUpperCase() 
          : searchTerm[i].toLowerCase();
      }
      const resultsMixed = searchRagas(ragas, mixedCase);
      
      // All result sets should have the same length
      if (resultsOriginal.length !== resultsLower.length ||
          resultsOriginal.length !== resultsUpper.length ||
          resultsOriginal.length !== resultsMixed.length) {
        return false;
      }
      
      // All result sets should contain the same raga IDs
      const idsOriginal = resultsOriginal.map(r => r.id).sort();
      const idsLower = resultsLower.map(r => r.id).sort();
      const idsUpper = resultsUpper.map(r => r.id).sort();
      const idsMixed = resultsMixed.map(r => r.id).sort();
      
      const idsOriginalStr = JSON.stringify(idsOriginal);
      if (idsOriginalStr !== JSON.stringify(idsLower) ||
          idsOriginalStr !== JSON.stringify(idsUpper) ||
          idsOriginalStr !== JSON.stringify(idsMixed)) {
        return false;
      }
      
      return true;
    }
  );
  
  return fc.check(property, { numRuns: 100 });
}

/**
 * Feature: indian-music-dashboard, Property 10: Search highlighting presence
 * Validates: Requirements 3.4
 * 
 * Property: For any search term and any matching raga name, the rendered
 * search result should contain HTML markup that highlights the matching substring.
 */
function testSearchHighlighting() {
  const property = fc.property(
    ragaArrayArbitrary(1, 50),
    fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
    (ragas, searchTerm) => {
      // Get search results
      const results = searchRagas(ragas, searchTerm);
      
      // For each result, the highlighted version should contain the highlight markup
      for (const raga of results) {
        const highlighted = highlightMatch(raga.name, searchTerm);
        
        // Should contain the highlight span tag
        if (!highlighted.includes('<span class="highlight">')) {
          return false;
        }
        
        // Should contain the closing span tag
        if (!highlighted.includes('</span>')) {
          return false;
        }
        
        // The highlighted text should still contain the original name content
        // (strip HTML tags to verify)
        const strippedText = highlighted.replace(/<[^>]*>/g, '');
        if (strippedText !== raga.name) {
          return false;
        }
      }
      
      return true;
    }
  );
  
  return fc.check(property, { numRuns: 100 });
}

/**
 * Run all search property tests
 */
function runSearchPropertyTests() {
  console.log('=== Search Property Tests ===\n');
  
  const results = [];
  
  // Test 1: Search substring matching
  console.log('Running Property Test 8: Search substring matching');
  const result1 = testSearchSubstringMatching();
  results.push({ name: 'Search substring matching', result: result1 });
  
  if (result1.failed) {
    console.error('❌ FAILED: Search substring matching');
    console.error('Counterexample:', result1.counterexample);
  } else {
    console.log('✅ PASSED: Search substring matching (100 runs)');
  }
  
  // Test 2: Case-insensitive search equivalence
  console.log('\nRunning Property Test 9: Case-insensitive search equivalence');
  const result2 = testCaseInsensitiveSearch();
  results.push({ name: 'Case-insensitive search equivalence', result: result2 });
  
  if (result2.failed) {
    console.error('❌ FAILED: Case-insensitive search equivalence');
    console.error('Counterexample:', result2.counterexample);
  } else {
    console.log('✅ PASSED: Case-insensitive search equivalence (100 runs)');
  }
  
  // Test 3: Search highlighting presence
  console.log('\nRunning Property Test 10: Search highlighting presence');
  const result3 = testSearchHighlighting();
  results.push({ name: 'Search highlighting presence', result: result3 });
  
  if (result3.failed) {
    console.error('❌ FAILED: Search highlighting presence');
    console.error('Counterexample:', result3.counterexample);
  } else {
    console.log('✅ PASSED: Search highlighting presence (100 runs)');
  }
  
  // Summary
  const allPassed = results.every(r => !r.result.failed);
  if (allPassed) {
    console.log('\n=== All Search Property Tests Passed ===');
  } else {
    console.log('\n=== Some Search Property Tests Failed ===');
  }
  
  return allPassed;
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testSearchSubstringMatching,
    testCaseInsensitiveSearch,
    testSearchHighlighting,
    runSearchPropertyTests
  };
}
