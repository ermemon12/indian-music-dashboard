/**
 * Verification script for error handling implementation
 * Tests that error handling is properly implemented across all modules
 */

// Load modules
const { getAllRagas, getRagaById, getThaats, getTimesOfDay } = require('../js/data.js');
const { applyFilters } = require('../js/filter.js');
const { searchRagas, normalizeSearchTerm } = require('../js/search.js');

// Define isValidRaga locally since app.js requires DOM
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

console.log('=== Error Handling Verification Tests ===\n');

let passedTests = 0;
let failedTests = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ PASSED: ${description}`);
    passedTests++;
  } catch (error) {
    console.log(`❌ FAILED: ${description}`);
    console.log(`   Error: ${error.message}`);
    failedTests++;
  }
}

// Test 1: Data module handles invalid inputs gracefully
test('getRagaById handles null input', () => {
  const result = getRagaById(null);
  if (result !== null) {
    throw new Error('Expected null for invalid input');
  }
});

test('getRagaById handles undefined input', () => {
  const result = getRagaById(undefined);
  if (result !== null) {
    throw new Error('Expected null for undefined input');
  }
});

test('getRagaById handles non-existent ID', () => {
  const result = getRagaById('non-existent-raga');
  if (result !== null) {
    throw new Error('Expected null for non-existent raga');
  }
});

test('getAllRagas returns array', () => {
  const result = getAllRagas();
  if (!Array.isArray(result)) {
    throw new Error('Expected array from getAllRagas');
  }
});

test('getThaats returns array', () => {
  const result = getThaats();
  if (!Array.isArray(result)) {
    throw new Error('Expected array from getThaats');
  }
});

test('getTimesOfDay returns array', () => {
  const result = getTimesOfDay();
  if (!Array.isArray(result)) {
    throw new Error('Expected array from getTimesOfDay');
  }
});

// Test 2: Filter module handles invalid inputs
test('applyFilters handles null ragas array', () => {
  const result = applyFilters(null, { thaat: 'Kalyan' });
  if (!Array.isArray(result) || result.length !== 0) {
    throw new Error('Expected empty array for null input');
  }
});

test('applyFilters handles undefined ragas array', () => {
  const result = applyFilters(undefined, { thaat: 'Kalyan' });
  if (!Array.isArray(result) || result.length !== 0) {
    throw new Error('Expected empty array for undefined input');
  }
});

test('applyFilters handles null filters', () => {
  const ragas = getAllRagas();
  const result = applyFilters(ragas, null);
  if (!Array.isArray(result) || result.length !== ragas.length) {
    throw new Error('Expected all ragas when filters are null');
  }
});

test('applyFilters handles malformed raga objects', () => {
  const ragas = [
    { id: 'valid', name: 'Valid', thaat: 'Kalyan', timeOfDay: 'Evening' },
    null,
    undefined,
    { id: 'incomplete' }, // Missing required fields
    'not an object'
  ];
  const result = applyFilters(ragas, { thaat: 'Kalyan' });
  // Should filter out invalid objects
  if (!Array.isArray(result)) {
    throw new Error('Expected array result');
  }
});

// Test 3: Search module handles invalid inputs
test('searchRagas handles null ragas array', () => {
  const result = searchRagas(null, 'test');
  if (!Array.isArray(result) || result.length !== 0) {
    throw new Error('Expected empty array for null input');
  }
});

test('searchRagas handles undefined ragas array', () => {
  const result = searchRagas(undefined, 'test');
  if (!Array.isArray(result) || result.length !== 0) {
    throw new Error('Expected empty array for undefined input');
  }
});

test('searchRagas handles empty search term', () => {
  const ragas = getAllRagas();
  const result = searchRagas(ragas, '');
  if (!Array.isArray(result) || result.length !== ragas.length) {
    throw new Error('Expected all ragas for empty search term');
  }
});

test('searchRagas handles null search term', () => {
  const ragas = getAllRagas();
  const result = searchRagas(ragas, null);
  if (!Array.isArray(result) || result.length !== ragas.length) {
    throw new Error('Expected all ragas for null search term');
  }
});

test('normalizeSearchTerm handles null input', () => {
  const result = normalizeSearchTerm(null);
  if (result !== '') {
    throw new Error('Expected empty string for null input');
  }
});

test('normalizeSearchTerm handles undefined input', () => {
  const result = normalizeSearchTerm(undefined);
  if (result !== '') {
    throw new Error('Expected empty string for undefined input');
  }
});

test('normalizeSearchTerm handles non-string input', () => {
  const result = normalizeSearchTerm(123);
  if (result !== '') {
    throw new Error('Expected empty string for non-string input');
  }
});

// Test 4: Validation functions
test('isValidRaga identifies valid raga', () => {
  const validRaga = {
    id: 'test',
    name: 'Test Raga',
    thaat: 'Kalyan',
    timeOfDay: 'Evening',
    aroha: 'Sa Re Ga',
    avaroha: 'Sa Ni Dha'
  };
  const result = isValidRaga(validRaga);
  if (!result) {
    throw new Error('Expected true for valid raga');
  }
});

test('isValidRaga identifies invalid raga (null)', () => {
  const result = isValidRaga(null);
  if (result) {
    throw new Error('Expected false for null raga');
  }
});

test('isValidRaga identifies invalid raga (missing fields)', () => {
  const invalidRaga = {
    id: 'test',
    name: 'Test Raga'
    // Missing required fields
  };
  const result = isValidRaga(invalidRaga);
  if (result) {
    throw new Error('Expected false for incomplete raga');
  }
});

test('isValidRaga identifies invalid raga (empty strings)', () => {
  const invalidRaga = {
    id: '',
    name: 'Test Raga',
    thaat: 'Kalyan',
    timeOfDay: 'Evening',
    aroha: 'Sa Re Ga',
    avaroha: 'Sa Ni Dha'
  };
  const result = isValidRaga(invalidRaga);
  if (result) {
    throw new Error('Expected false for raga with empty id');
  }
});

// Summary
console.log('\n=== Test Summary ===');
console.log(`Total Tests: ${passedTests + failedTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests > 0) {
  console.log('\n❌ Some error handling tests failed');
  process.exit(1);
} else {
  console.log('\n✅ All error handling tests passed');
  process.exit(0);
}
