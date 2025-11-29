/**
 * Test Runner for Search Property Tests
 * Run this file in Node.js to execute all search property tests
 */

// Load fast-check library
const fc = require('fast-check');

// Make fc globally available for test files
global.fc = fc;

// Load test helpers
const {
  ragaIdArbitrary,
  ragaNameArbitrary,
  thaatArbitrary,
  timeOfDayArbitrary,
  swaraPatternArbitrary,
  moodArbitrary,
  characteristicsArbitrary,
  audioFileArbitrary,
  ragaArbitrary,
  ragaArrayArbitrary
} = require('./helpers/generators.js');

// Make generators globally available
global.ragaIdArbitrary = ragaIdArbitrary;
global.ragaNameArbitrary = ragaNameArbitrary;
global.thaatArbitrary = thaatArbitrary;
global.timeOfDayArbitrary = timeOfDayArbitrary;
global.swaraPatternArbitrary = swaraPatternArbitrary;
global.moodArbitrary = moodArbitrary;
global.characteristicsArbitrary = characteristicsArbitrary;
global.audioFileArbitrary = audioFileArbitrary;
global.ragaArbitrary = ragaArbitrary;
global.ragaArrayArbitrary = ragaArrayArbitrary;

// Load the search module
const {
  searchRagas,
  highlightMatch,
  normalizeSearchTerm
} = require('../js/search.js');

// Make search functions globally available
global.searchRagas = searchRagas;
global.highlightMatch = highlightMatch;
global.normalizeSearchTerm = normalizeSearchTerm;

// Load the search property tests
const {
  runSearchPropertyTests
} = require('./properties/search.property.test.js');

// Run the tests
console.log('Starting Search Property Tests...\n');
const allPassed = runSearchPropertyTests();

// Exit with appropriate code
process.exit(allPassed ? 0 : 1);
