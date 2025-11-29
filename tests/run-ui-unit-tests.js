/**
 * Test Runner for UI Unit Tests
 * Runs all unit tests for UI rendering functionality
 */

const { runUIUnitTests } = require('./unit/ui.test.js');

console.log('Starting UI Unit Tests...\n');

const passed = runUIUnitTests();

if (passed) {
  console.log('\n✅ All UI unit tests passed successfully!');
  process.exit(0);
} else {
  console.log('\n❌ Some UI unit tests failed.');
  process.exit(1);
}
