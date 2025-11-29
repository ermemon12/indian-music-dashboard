/**
 * Node.js Test Runner for Property-Based Tests
 * Run with: node tests/run-property-tests.js
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

// Load the data module by reading and evaluating it
const fs = require('fs');
const path = require('path');

// Read and evaluate data.js
const dataJsPath = path.join(__dirname, '../js/data.js');
const dataJsContent = fs.readFileSync(dataJsPath, 'utf8');

// Create a context to evaluate the data.js file
const vm = require('vm');
const context = { console, fc };
vm.createContext(context);
vm.runInContext(dataJsContent, context);

// Extract the functions we need
const getAllRagas = context.getAllRagas;
const getRagaById = context.getRagaById;
const getThaats = context.getThaats;
const getTimesOfDay = context.getTimesOfDay;

/**
 * Feature: indian-music-dashboard, Property: Data structure consistency
 * Validates: Requirements 9.2
 * 
 * Property: For any raga in the dataset, it must have all required fields:
 * - id (string)
 * - name (string)
 * - thaat (string)
 * - timeOfDay (string)
 * - aroha (string)
 * - avaroha (string)
 */
function testDataStructureConsistency() {
  const requiredFields = ['id', 'name', 'thaat', 'timeOfDay', 'aroha', 'avaroha'];
  
  // Property: All ragas in the dataset must have all required fields
  const property = fc.property(
    fc.constant(getAllRagas()),
    (ragas) => {
      // For each raga in the dataset
      for (const raga of ragas) {
        // Check that all required fields exist
        for (const field of requiredFields) {
          if (!(field in raga)) {
            console.error(`Missing field '${field}' in raga:`, raga);
            return false; // Missing required field
          }
          
          // Check that the field is not null or undefined
          if (raga[field] === null || raga[field] === undefined) {
            console.error(`Field '${field}' is null/undefined in raga:`, raga);
            return false;
          }
          
          // Check that string fields are actually strings
          if (typeof raga[field] !== 'string') {
            console.error(`Field '${field}' is not a string in raga:`, raga, `(type: ${typeof raga[field]})`);
            return false;
          }
          
          // Check that string fields are not empty
          if (raga[field].trim().length === 0) {
            console.error(`Field '${field}' is empty in raga:`, raga);
            return false;
          }
        }
      }
      
      return true; // All ragas have all required fields
    }
  );
  
  // Run the property test with 100 iterations
  const result = fc.check(property, { numRuns: 100 });
  
  return result;
}

/**
 * Run all data model property tests
 */
function runDataModelPropertyTests() {
  console.log('=== Data Model Property Tests ===\n');
  
  // Test 1: Data structure consistency
  console.log('Running Property Test: Data structure consistency');
  console.log('Feature: indian-music-dashboard, Property: Data structure consistency');
  console.log('Validates: Requirements 9.2\n');
  
  const result1 = testDataStructureConsistency();
  
  if (result1.failed) {
    console.error('❌ FAILED: Data structure consistency');
    console.error('Counterexample:', result1.counterexample);
    console.error('Error:', result1.error);
    return false;
  } else {
    console.log('✅ PASSED: Data structure consistency (100 runs)');
  }
  
  console.log('\n=== All Data Model Property Tests Passed ===');
  return true;
}

// Run the tests
const success = runDataModelPropertyTests();
process.exit(success ? 0 : 1);
