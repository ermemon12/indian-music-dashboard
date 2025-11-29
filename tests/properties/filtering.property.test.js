/**
 * Property-Based Tests for Filtering Logic
 * Feature: indian-music-dashboard
 */

/**
 * Feature: indian-music-dashboard, Property 4: Thaat filtering correctness
 * Validates: Requirements 2.1
 * 
 * Property: For any thaat value and any raga dataset, applying the thaat filter
 * should return only ragas where the thaat property matches the filter value.
 */
function testThaatFilteringCorrectness() {
  const property = fc.property(
    ragaArrayArbitrary(1, 50),
    thaatArbitrary(),
    (ragas, thaatFilter) => {
      // Apply the thaat filter
      const filtered = applyFilters(ragas, { thaat: thaatFilter, timeOfDay: null });
      
      // All filtered ragas must have the specified thaat
      for (const raga of filtered) {
        if (raga.thaat !== thaatFilter) {
          return false;
        }
      }
      
      // All ragas with the specified thaat must be in the filtered results
      const ragasWithThaat = ragas.filter(r => r.thaat === thaatFilter);
      if (filtered.length !== ragasWithThaat.length) {
        return false;
      }
      
      return true;
    }
  );
  
  return fc.check(property, { numRuns: 100 });
}

/**
 * Feature: indian-music-dashboard, Property 5: Time filtering correctness
 * Validates: Requirements 2.2
 * 
 * Property: For any time-of-day value and any raga dataset, applying the time filter
 * should return only ragas where the timeOfDay property matches the filter value.
 */
function testTimeFilteringCorrectness() {
  const property = fc.property(
    ragaArrayArbitrary(1, 50),
    timeOfDayArbitrary(),
    (ragas, timeFilter) => {
      // Apply the time of day filter
      const filtered = applyFilters(ragas, { thaat: null, timeOfDay: timeFilter });
      
      // All filtered ragas must have the specified time of day
      for (const raga of filtered) {
        if (raga.timeOfDay !== timeFilter) {
          return false;
        }
      }
      
      // All ragas with the specified time must be in the filtered results
      const ragasWithTime = ragas.filter(r => r.timeOfDay === timeFilter);
      if (filtered.length !== ragasWithTime.length) {
        return false;
      }
      
      return true;
    }
  );
  
  return fc.check(property, { numRuns: 100 });
}

/**
 * Feature: indian-music-dashboard, Property 6: Combined filter correctness
 * Validates: Requirements 2.3
 * 
 * Property: For any combination of thaat and time-of-day filters and any raga dataset,
 * the filtered results should satisfy all active filter criteria simultaneously.
 */
function testCombinedFilterCorrectness() {
  const property = fc.property(
    ragaArrayArbitrary(1, 50),
    thaatArbitrary(),
    timeOfDayArbitrary(),
    (ragas, thaatFilter, timeFilter) => {
      // Apply both filters
      const filtered = applyFilters(ragas, { thaat: thaatFilter, timeOfDay: timeFilter });
      
      // All filtered ragas must match both criteria
      for (const raga of filtered) {
        if (raga.thaat !== thaatFilter || raga.timeOfDay !== timeFilter) {
          return false;
        }
      }
      
      // All ragas matching both criteria must be in the filtered results
      const ragasMatchingBoth = ragas.filter(
        r => r.thaat === thaatFilter && r.timeOfDay === timeFilter
      );
      if (filtered.length !== ragasMatchingBoth.length) {
        return false;
      }
      
      return true;
    }
  );
  
  return fc.check(property, { numRuns: 100 });
}

/**
 * Feature: indian-music-dashboard, Property 7: Filter clear round-trip
 * Validates: Requirements 2.4
 * 
 * Property: For any raga dataset and any combination of applied filters,
 * clearing all filters should restore the complete original dataset.
 */
function testFilterClearRoundTrip() {
  const property = fc.property(
    ragaArrayArbitrary(1, 50),
    thaatArbitrary(),
    timeOfDayArbitrary(),
    (ragas, thaatFilter, timeFilter) => {
      // Store original dataset
      const originalCount = ragas.length;
      const originalIds = ragas.map(r => r.id).sort();
      
      // Apply filters (doesn't matter what they are)
      const filtered = applyFilters(ragas, { thaat: thaatFilter, timeOfDay: timeFilter });
      
      // Clear filters by applying with null values
      const clearedFilters = applyFilters(ragas, { thaat: null, timeOfDay: null });
      
      // Should get back the original dataset
      if (clearedFilters.length !== originalCount) {
        return false;
      }
      
      const clearedIds = clearedFilters.map(r => r.id).sort();
      if (JSON.stringify(originalIds) !== JSON.stringify(clearedIds)) {
        return false;
      }
      
      return true;
    }
  );
  
  return fc.check(property, { numRuns: 100 });
}

/**
 * Run all filtering property tests
 */
function runFilteringPropertyTests() {
  console.log('=== Filtering Property Tests ===\n');
  
  const results = [];
  
  // Test 1: Thaat filtering correctness
  console.log('Running Property Test 4: Thaat filtering correctness');
  const result1 = testThaatFilteringCorrectness();
  results.push({ name: 'Thaat filtering correctness', result: result1 });
  
  if (result1.failed) {
    console.error('❌ FAILED: Thaat filtering correctness');
    console.error('Counterexample:', result1.counterexample);
  } else {
    console.log('✅ PASSED: Thaat filtering correctness (100 runs)');
  }
  
  // Test 2: Time filtering correctness
  console.log('\nRunning Property Test 5: Time filtering correctness');
  const result2 = testTimeFilteringCorrectness();
  results.push({ name: 'Time filtering correctness', result: result2 });
  
  if (result2.failed) {
    console.error('❌ FAILED: Time filtering correctness');
    console.error('Counterexample:', result2.counterexample);
  } else {
    console.log('✅ PASSED: Time filtering correctness (100 runs)');
  }
  
  // Test 3: Combined filter correctness
  console.log('\nRunning Property Test 6: Combined filter correctness');
  const result3 = testCombinedFilterCorrectness();
  results.push({ name: 'Combined filter correctness', result: result3 });
  
  if (result3.failed) {
    console.error('❌ FAILED: Combined filter correctness');
    console.error('Counterexample:', result3.counterexample);
  } else {
    console.log('✅ PASSED: Combined filter correctness (100 runs)');
  }
  
  // Test 4: Filter clear round-trip
  console.log('\nRunning Property Test 7: Filter clear round-trip');
  const result4 = testFilterClearRoundTrip();
  results.push({ name: 'Filter clear round-trip', result: result4 });
  
  if (result4.failed) {
    console.error('❌ FAILED: Filter clear round-trip');
    console.error('Counterexample:', result4.counterexample);
  } else {
    console.log('✅ PASSED: Filter clear round-trip (100 runs)');
  }
  
  // Summary
  const allPassed = results.every(r => !r.result.failed);
  if (allPassed) {
    console.log('\n=== All Filtering Property Tests Passed ===');
  } else {
    console.log('\n=== Some Filtering Property Tests Failed ===');
  }
  
  return allPassed;
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testThaatFilteringCorrectness,
    testTimeFilteringCorrectness,
    testCombinedFilterCorrectness,
    testFilterClearRoundTrip,
    runFilteringPropertyTests
  };
}
