/**
 * Unit Tests for Search Module Edge Cases
 * Tests specific examples and edge cases for search functionality
 */

// Import search functions
const { searchRagas, highlightMatch, normalizeSearchTerm } = require('../../js/search.js');

/**
 * Sample test data
 */
const sampleRagas = [
  { id: 'yaman', name: 'Yaman', thaat: 'Kalyan', timeOfDay: 'Evening' },
  { id: 'bhairav', name: 'Bhairav', thaat: 'Bhairav', timeOfDay: 'Morning' },
  { id: 'bhairavi', name: 'Bhairavi', thaat: 'Bhairavi', timeOfDay: 'Night' },
  { id: 'todi', name: 'Todi', thaat: 'Todi', timeOfDay: 'Morning' },
  { id: 'malkauns', name: 'Malkauns', thaat: 'Bhairavi', timeOfDay: 'Late Night' }
];

/**
 * Test: Empty search string returns all ragas
 */
function testEmptySearchReturnsAll() {
  console.log('Test: Empty search string returns all ragas');
  
  // Test with empty string
  const result1 = searchRagas(sampleRagas, '');
  if (result1.length !== sampleRagas.length) {
    console.error(`❌ FAILED: Expected ${sampleRagas.length} ragas, got ${result1.length}`);
    return false;
  }
  
  // Test with whitespace only
  const result2 = searchRagas(sampleRagas, '   ');
  if (result2.length !== sampleRagas.length) {
    console.error(`❌ FAILED: Whitespace search expected ${sampleRagas.length} ragas, got ${result2.length}`);
    return false;
  }
  
  // Test with null
  const result3 = searchRagas(sampleRagas, null);
  if (result3.length !== sampleRagas.length) {
    console.error(`❌ FAILED: Null search expected ${sampleRagas.length} ragas, got ${result3.length}`);
    return false;
  }
  
  // Test with undefined
  const result4 = searchRagas(sampleRagas, undefined);
  if (result4.length !== sampleRagas.length) {
    console.error(`❌ FAILED: Undefined search expected ${sampleRagas.length} ragas, got ${result4.length}`);
    return false;
  }
  
  console.log('✅ PASSED: Empty search returns all ragas');
  return true;
}

/**
 * Test: No matches returns empty array
 */
function testNoMatchesReturnsEmpty() {
  console.log('Test: No matches returns empty array');
  
  // Test with search term that doesn't match any raga
  const result1 = searchRagas(sampleRagas, 'xyz123notfound');
  if (result1.length !== 0) {
    console.error(`❌ FAILED: Expected 0 ragas for non-matching search, got ${result1.length}`);
    return false;
  }
  
  // Test with another non-matching term
  const result2 = searchRagas(sampleRagas, 'qwerty');
  if (result2.length !== 0) {
    console.error(`❌ FAILED: Expected 0 ragas for 'qwerty', got ${result2.length}`);
    return false;
  }
  
  // Test with numeric string that doesn't match
  const result3 = searchRagas(sampleRagas, '99999');
  if (result3.length !== 0) {
    console.error(`❌ FAILED: Expected 0 ragas for numeric search, got ${result3.length}`);
    return false;
  }
  
  console.log('✅ PASSED: No matches returns empty array');
  return true;
}

/**
 * Test: Special characters in search terms
 */
function testSpecialCharactersInSearch() {
  console.log('Test: Special characters in search terms');
  
  // Create test data with special characters
  const ragasWithSpecialChars = [
    { id: 'test1', name: 'Raga-One', thaat: 'Kalyan', timeOfDay: 'Evening' },
    { id: 'test2', name: 'Raga (Two)', thaat: 'Bhairav', timeOfDay: 'Morning' },
    { id: 'test3', name: 'Raga #3', thaat: 'Todi', timeOfDay: 'Night' },
    { id: 'test4', name: 'Raga@Four', thaat: 'Bhairavi', timeOfDay: 'Late Night' }
  ];
  
  // Test searching for hyphen
  const result1 = searchRagas(ragasWithSpecialChars, '-');
  if (result1.length !== 1 || result1[0].id !== 'test1') {
    console.error(`❌ FAILED: Hyphen search expected 1 raga, got ${result1.length}`);
    return false;
  }
  
  // Test searching for parenthesis
  const result2 = searchRagas(ragasWithSpecialChars, '(');
  if (result2.length !== 1 || result2[0].id !== 'test2') {
    console.error(`❌ FAILED: Parenthesis search expected 1 raga, got ${result2.length}`);
    return false;
  }
  
  // Test searching for hash
  const result3 = searchRagas(ragasWithSpecialChars, '#');
  if (result3.length !== 1 || result3[0].id !== 'test3') {
    console.error(`❌ FAILED: Hash search expected 1 raga, got ${result3.length}`);
    return false;
  }
  
  // Test searching for @ symbol
  const result4 = searchRagas(ragasWithSpecialChars, '@');
  if (result4.length !== 1 || result4[0].id !== 'test4') {
    console.error(`❌ FAILED: @ symbol search expected 1 raga, got ${result4.length}`);
    return false;
  }
  
  // Test searching with multiple special characters
  const result5 = searchRagas(ragasWithSpecialChars, 'Raga-');
  if (result5.length !== 1 || result5[0].id !== 'test1') {
    console.error(`❌ FAILED: 'Raga-' search expected 1 raga, got ${result5.length}`);
    return false;
  }
  
  // Test that special characters don't break the search
  const result6 = searchRagas(sampleRagas, '!@#$%^&*()');
  if (result6.length !== 0) {
    console.error(`❌ FAILED: Special chars only search expected 0 ragas, got ${result6.length}`);
    return false;
  }
  
  console.log('✅ PASSED: Special characters in search terms');
  return true;
}

/**
 * Run all unit tests for search edge cases
 */
function runSearchUnitTests() {
  console.log('=== Search Unit Tests (Edge Cases) ===\n');
  
  const results = [];
  
  // Run all tests
  results.push(testEmptySearchReturnsAll());
  results.push(testNoMatchesReturnsEmpty());
  results.push(testSpecialCharactersInSearch());
  
  // Summary
  const allPassed = results.every(r => r === true);
  if (allPassed) {
    console.log('\n=== All Search Unit Tests Passed ===');
  } else {
    console.log('\n=== Some Search Unit Tests Failed ===');
  }
  
  return allPassed;
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testEmptySearchReturnsAll,
    testNoMatchesReturnsEmpty,
    testSpecialCharactersInSearch,
    runSearchUnitTests
  };
}

// Run tests if executed directly
if (require.main === module) {
  const passed = runSearchUnitTests();
  process.exit(passed ? 0 : 1);
}
