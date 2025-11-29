/**
 * Node.js Test Runner for Filtering Property-Based Tests
 * Run with: node tests/run-filtering-tests.js
 */

// Check if fast-check is available
let fc;
try {
  fc = require('fast-check');
} catch (e) {
  console.error('❌ fast-check is not installed. Installing...');
  console.error('Please run: npm install fast-check');
  process.exit(1);
}

// Load the filter module
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Read and evaluate filter.js
const filterJsPath = path.join(__dirname, '../js/filter.js');
const filterJsContent = fs.readFileSync(filterJsPath, 'utf8');

// Read and evaluate generators.js
const generatorsJsPath = path.join(__dirname, 'helpers/generators.js');
const generatorsJsContent = fs.readFileSync(generatorsJsPath, 'utf8');

// Read and evaluate filtering property tests
const filteringTestsPath = path.join(__dirname, 'properties/filtering.property.test.js');
const filteringTestsContent = fs.readFileSync(filteringTestsPath, 'utf8');

// Create a context to evaluate all the files
const context = { 
  console, 
  fc,
  module: { exports: {} },
  require: () => {}
};
vm.createContext(context);

// Run the files in context
vm.runInContext(generatorsJsContent, context);
vm.runInContext(filterJsContent, context);
vm.runInContext(filteringTestsContent, context);

// Extract the functions we need
const applyFilters = context.applyFilters;
const ragaArrayArbitrary = context.ragaArrayArbitrary;
const thaatArbitrary = context.thaatArbitrary;
const timeOfDayArbitrary = context.timeOfDayArbitrary;
const runFilteringPropertyTests = context.runFilteringPropertyTests;

// Make them globally available for the test functions
global.fc = fc;
global.applyFilters = applyFilters;
global.ragaArrayArbitrary = ragaArrayArbitrary;
global.thaatArbitrary = thaatArbitrary;
global.timeOfDayArbitrary = timeOfDayArbitrary;

// Run the tests
const success = runFilteringPropertyTests();
process.exit(success ? 0 : 1);
