/**
 * Property-Based Tests for Data Model
 * Feature: indian-music-dashboard
 */

// Load the data module
// Note: In a real test environment, you'd use proper module imports
// For now, we'll access the functions from the global scope

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
            return false; // Missing required field
          }
          
          // Check that the field is not null or undefined
          if (raga[field] === null || raga[field] === undefined) {
            return false;
          }
          
          // Check that string fields are actually strings
          if (typeof raga[field] !== 'string') {
            return false;
          }
          
          // Check that string fields are not empty
          if (raga[field].trim().length === 0) {
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
  const result1 = testDataStructureConsistency();
  
  if (result1.failed) {
    console.error('❌ FAILED: Data structure consistency');
    console.error('Counterexample:', result1.counterexample);
    return false;
  } else {
    console.log('✅ PASSED: Data structure consistency (100 runs)');
  }
  
  console.log('\n=== All Data Model Property Tests Passed ===');
  return true;
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testDataStructureConsistency,
    runDataModelPropertyTests
  };
}
