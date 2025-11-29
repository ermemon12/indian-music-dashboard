#!/usr/bin/env node

/**
 * Test Runner for Error Handling Tests
 * Runs all error handling unit tests
 */

const { runErrorHandlingTests } = require('./unit/error-handling.test.js');

console.log('Starting Error Handling Tests...\n');

runErrorHandlingTests()
  .then(passed => {
    if (passed) {
      console.log('\n✅ All error handling tests passed!');
      process.exit(0);
    } else {
      console.log('\n❌ Some error handling tests failed.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n❌ Error running tests:', error);
    process.exit(1);
  });
