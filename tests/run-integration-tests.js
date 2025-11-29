/**
 * Test Runner for Integration Tests
 * Runs integration tests without JSDOM - tests core logic integration
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Load all modules into a shared context
function loadModules() {
  const context = { console };
  vm.createContext(context);
  
  const modules = ['data.js', 'filter.js', 'search.js'];
  
  modules.forEach(module => {
    const modulePath = path.join(__dirname, '../js', module);
    const code = fs.readFileSync(modulePath, 'utf8');
    vm.runInContext(code, context);
  });
  
  return context;
}

// Run tests
function runIntegrationTests() {
  console.log('\n=== Running Integration Tests ===\n');
  
  const context = loadModules();
  let passed = 0;
  let failed = 0;
  const errors = [];
  
  // Test 1: Filter changes update results correctly
  console.log('Test 1: Filter by thaat updates results correctly');
  try {
    const allRagas = context.getAllRagas();
    const filters = { thaat: 'Kalyan', timeOfDay: null };
    const filtered = context.applyFilters(allRagas, filters);
    
    // Verify all results have correct thaat
    const allCorrect = filtered.every(r => r.thaat === 'Kalyan');
    if (!allCorrect) {
      throw new Error('Not all filtered ragas have correct thaat');
    }
    
    // Verify filtered count is less than or equal to total
    if (filtered.length > allRagas.length) {
      throw new Error('Filtered results exceed total ragas');
    }
    
    console.log(`✓ Filtered ${filtered.length} ragas with thaat 'Kalyan'`);
    passed++;
  } catch (error) {
    console.log(`✗ ${error.message}`);
    failed++;
    errors.push({ test: 'Filter by thaat', error: error.message });
  }
  
  // Test 2: Filter by time of day
  console.log('\nTest 2: Filter by time of day updates results correctly');
  try {
    const allRagas = context.getAllRagas();
    const filters = { thaat: null, timeOfDay: 'Evening' };
    const filtered = context.applyFilters(allRagas, filters);
    
    // Verify all results have correct time
    const allCorrect = filtered.every(r => r.timeOfDay === 'Evening');
    if (!allCorrect) {
      throw new Error('Not all filtered ragas have correct time of day');
    }
    
    console.log(`✓ Filtered ${filtered.length} ragas with time 'Evening'`);
    passed++;
  } catch (error) {
    console.log(`✗ ${error.message}`);
    failed++;
    errors.push({ test: 'Filter by time', error: error.message });
  }
  
  // Test 3: Combined filters
  console.log('\nTest 3: Combined filters work correctly');
  try {
    const allRagas = context.getAllRagas();
    const filters = { thaat: 'Kalyan', timeOfDay: 'Evening' };
    const filtered = context.applyFilters(allRagas, filters);
    
    // Verify all results match both filters
    const allCorrect = filtered.every(r => r.thaat === 'Kalyan' && r.timeOfDay === 'Evening');
    if (!allCorrect) {
      throw new Error('Not all filtered ragas match both filters');
    }
    
    console.log(`✓ Filtered ${filtered.length} ragas with both filters`);
    passed++;
  } catch (error) {
    console.log(`✗ ${error.message}`);
    failed++;
    errors.push({ test: 'Combined filters', error: error.message });
  }
  
  // Test 4: Clear filters restores all ragas
  console.log('\nTest 4: Clear filters restores all ragas');
  try {
    const allRagas = context.getAllRagas();
    const filters = { thaat: null, timeOfDay: null };
    const filtered = context.applyFilters(allRagas, filters);
    
    if (filtered.length !== allRagas.length) {
      throw new Error(`Expected ${allRagas.length} ragas, got ${filtered.length}`);
    }
    
    console.log(`✓ Restored all ${filtered.length} ragas`);
    passed++;
  } catch (error) {
    console.log(`✗ ${error.message}`);
    failed++;
    errors.push({ test: 'Clear filters', error: error.message });
  }
  
  // Test 5: Search filters ragas by name
  console.log('\nTest 5: Search filters ragas by name');
  try {
    const allRagas = context.getAllRagas();
    const searchTerm = 'Yaman';
    const results = context.searchRagas(allRagas, searchTerm);
    
    // Verify all results contain search term
    const allMatch = results.every(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!allMatch) {
      throw new Error('Not all search results contain search term');
    }
    
    console.log(`✓ Found ${results.length} ragas matching '${searchTerm}'`);
    passed++;
  } catch (error) {
    console.log(`✗ ${error.message}`);
    failed++;
    errors.push({ test: 'Search by name', error: error.message });
  }
  
  // Test 6: Case-insensitive search
  console.log('\nTest 6: Search is case-insensitive');
  try {
    const allRagas = context.getAllRagas();
    const results1 = context.searchRagas(allRagas, 'YAMAN');
    const results2 = context.searchRagas(allRagas, 'yaman');
    const results3 = context.searchRagas(allRagas, 'Yaman');
    
    if (results1.length !== results2.length || results2.length !== results3.length) {
      throw new Error('Case-insensitive search returned different results');
    }
    
    console.log(`✓ All case variations returned ${results1.length} results`);
    passed++;
  } catch (error) {
    console.log(`✗ ${error.message}`);
    failed++;
    errors.push({ test: 'Case-insensitive search', error: error.message });
  }
  
  // Test 7: Empty search returns all ragas
  console.log('\nTest 7: Empty search returns all ragas');
  try {
    const allRagas = context.getAllRagas();
    const results = context.searchRagas(allRagas, '');
    
    if (results.length !== allRagas.length) {
      throw new Error(`Expected ${allRagas.length} ragas, got ${results.length}`);
    }
    
    console.log(`✓ Empty search returned all ${results.length} ragas`);
    passed++;
  } catch (error) {
    console.log(`✗ ${error.message}`);
    failed++;
    errors.push({ test: 'Empty search', error: error.message });
  }
  
  // Test 8: Search combined with filters
  console.log('\nTest 8: Search combined with filters');
  try {
    const allRagas = context.getAllRagas();
    
    // First apply filter
    const filters = { thaat: 'Kalyan', timeOfDay: null };
    const filtered = context.applyFilters(allRagas, filters);
    
    // Then apply search
    const searchTerm = 'Yaman';
    const results = context.searchRagas(filtered, searchTerm);
    
    // Verify results match both filter and search
    const allMatch = results.every(r => 
      r.thaat === 'Kalyan' && r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (!allMatch) {
      throw new Error('Results do not match both filter and search criteria');
    }
    
    console.log(`✓ Found ${results.length} ragas matching filter and search`);
    passed++;
  } catch (error) {
    console.log(`✗ ${error.message}`);
    failed++;
    errors.push({ test: 'Search with filters', error: error.message });
  }
  
  // Test 9: Get raga by ID
  console.log('\nTest 9: Get raga by ID returns correct raga');
  try {
    const allRagas = context.getAllRagas();
    if (allRagas.length === 0) {
      throw new Error('No ragas in dataset');
    }
    
    const firstRaga = allRagas[0];
    const retrieved = context.getRagaById(firstRaga.id);
    
    if (!retrieved) {
      throw new Error('getRagaById returned null');
    }
    
    if (retrieved.id !== firstRaga.id || retrieved.name !== firstRaga.name) {
      throw new Error('Retrieved raga does not match expected raga');
    }
    
    console.log(`✓ Retrieved raga '${retrieved.name}' by ID`);
    passed++;
  } catch (error) {
    console.log(`✗ ${error.message}`);
    failed++;
    errors.push({ test: 'Get raga by ID', error: error.message });
  }
  
  // Test 10: Full workflow - filter, search, retrieve
  console.log('\nTest 10: Full workflow - filter, search, retrieve');
  try {
    const allRagas = context.getAllRagas();
    
    // Step 1: Apply filter
    const filters = { thaat: 'Bhairav', timeOfDay: null };
    const filtered = context.applyFilters(allRagas, filters);
    
    // Step 2: Apply search
    const searchTerm = 'Bhairav';
    const searched = context.searchRagas(filtered, searchTerm);
    
    // Step 3: Get first result by ID
    if (searched.length > 0) {
      const raga = context.getRagaById(searched[0].id);
      
      if (!raga) {
        throw new Error('Could not retrieve raga by ID');
      }
      
      // Verify raga matches criteria
      if (raga.thaat !== 'Bhairav' || !raga.name.toLowerCase().includes('bhairav')) {
        throw new Error('Retrieved raga does not match filter and search criteria');
      }
      
      console.log(`✓ Full workflow completed successfully with raga '${raga.name}'`);
    } else {
      console.log(`✓ Full workflow completed (no matching ragas found)`);
    }
    
    passed++;
  } catch (error) {
    console.log(`✗ ${error.message}`);
    failed++;
    errors.push({ test: 'Full workflow', error: error.message });
  }
  
  // Print results
  console.log('\n=== Test Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${passed + failed}`);
  
  if (failed > 0) {
    console.log('\n=== Failed Tests ===');
    errors.forEach(({ test, error }) => {
      console.log(`\n${test}:`);
      console.log(`  ${error}`);
    });
    process.exit(1);
  } else {
    console.log('\n✓ All integration tests passed!');
    process.exit(0);
  }
}

// Run the tests
runIntegrationTests();
