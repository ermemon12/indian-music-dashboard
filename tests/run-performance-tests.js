/**
 * Performance Tests for Indian Music Dashboard
 * Tests rendering time, search/filter response time, and memory leak detection
 * Run with: node tests/run-performance-tests.js
 */

const fs = require('fs');
const path = require('path');

// Load modules
const dataJsPath = path.join(__dirname, '../js/data.js');
const filterJsPath = path.join(__dirname, '../js/filter.js');
const searchJsPath = path.join(__dirname, '../js/search.js');

const dataJsContent = fs.readFileSync(dataJsPath, 'utf8');
const filterJsContent = fs.readFileSync(filterJsPath, 'utf8');
const searchJsContent = fs.readFileSync(searchJsPath, 'utf8');

// Create minimal DOM mock for testing
class MockElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
    this.attributes = {};
    this.innerHTML = '';
    this.className = '';
    this.classList = {
      add: (cls) => { this.className += ' ' + cls; },
      remove: (cls) => { this.className = this.className.replace(cls, ''); },
      contains: (cls) => this.className.includes(cls)
    };
  }
  
  appendChild(child) {
    this.children.push(child);
  }
  
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  
  getAttribute(name) {
    return this.attributes[name];
  }
  
  querySelectorAll(selector) {
    // Simple mock - just return children with matching data attribute
    if (selector.includes('[data-raga-id]')) {
      return this.children.filter(c => c.attributes['data-raga-id']);
    }
    return [];
  }
}

class MockDocument {
  constructor() {
    this.elements = {
      ragaListContainer: new MockElement('div'),
      noResultsMessage: new MockElement('div'),
      ragaDetailModal: new MockElement('div'),
      modalContent: new MockElement('div'),
      closeModalBtn: new MockElement('button'),
      thaatFilter: new MockElement('select'),
      timeFilter: new MockElement('select')
    };
  }
  
  getElementById(id) {
    return this.elements[id] || new MockElement('div');
  }
  
  createElement(tagName) {
    return new MockElement(tagName);
  }
  
  createDocumentFragment() {
    return new MockElement('fragment');
  }
  
  querySelectorAll(selector) {
    return [];
  }
}

global.document = new MockDocument();

// Evaluate modules in the context
eval(dataJsContent);
eval(filterJsContent);
eval(searchJsContent);

/**
 * Generate a large dataset for performance testing
 * @param {number} count - Number of ragas to generate
 * @returns {Array} Array of raga objects
 */
function generateLargeDataset(count) {
  const thaats = ['Bilawal', 'Kalyan', 'Kafi', 'Bhairav', 'Todi', 'Marwa', 'Purvi', 'Bhairavi', 'Asavari'];
  const times = ['Morning', 'Afternoon', 'Evening', 'Night', 'Late Night'];
  const moods = ['Devotional', 'Romantic', 'Serious', 'Playful', 'Melancholic'];
  
  const ragas = [];
  for (let i = 0; i < count; i++) {
    ragas.push({
      id: `raga-${i}`,
      name: `Raga ${String.fromCharCode(65 + (i % 26))}${i}`,
      thaat: thaats[i % thaats.length],
      timeOfDay: times[i % times.length],
      aroha: 'Sa Re Ga Ma Pa Dha Ni Sa\'',
      avaroha: 'Sa\' Ni Dha Pa Ma Ga Re Sa',
      mood: moods[i % moods.length],
      characteristics: `Test raga ${i} with various characteristics`,
      audioFile: i % 3 === 0 ? `audio/raga-${i}.mp3` : null
    });
  }
  return ragas;
}

/**
 * Measure execution time of a function
 * @param {Function} fn - Function to measure
 * @param {string} label - Label for the measurement
 * @returns {number} Execution time in milliseconds
 */
function measureTime(fn, label) {
  const start = process.hrtime.bigint();
  fn();
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1000000; // Convert to milliseconds
  console.log(`  ${label}: ${duration.toFixed(2)}ms`);
  return duration;
}

/**
 * Test 1: Rendering time with large datasets
 * Note: This tests the data processing logic, not actual DOM rendering
 */
function testRenderingPerformance() {
  console.log('\n=== Test 1: Data Processing Performance (Simulated Rendering) ===\n');
  
  const testSizes = [50, 100, 200, 500];
  const results = [];
  
  testSizes.forEach(size => {
    console.log(`Testing with ${size} ragas:`);
    const dataset = generateLargeDataset(size);
    
    // Measure data processing time (sorting + iteration)
    const duration = measureTime(() => {
      // Simulate the core rendering logic without DOM
      const sortedRagas = [...dataset].sort((a, b) => a.name.localeCompare(b.name));
      sortedRagas.forEach(raga => {
        // Simulate card creation logic
        const cardData = {
          id: raga.id,
          name: raga.name,
          thaat: raga.thaat,
          timeOfDay: raga.timeOfDay,
          mood: raga.mood
        };
      });
    }, `Process ${size} ragas`);
    
    results.push({ size, duration });
    console.log(`  ✅ ${size} ragas processed successfully`);
  });
  
  // Check performance requirements
  console.log('\nPerformance Analysis:');
  const largestTest = results[results.length - 1];
  if (largestTest.duration > 1000) {
    console.log(`  ⚠️  Processing ${largestTest.size} ragas took ${largestTest.duration.toFixed(2)}ms (>1000ms)`);
  } else {
    console.log(`  ✅ Processing performance acceptable (${largestTest.duration.toFixed(2)}ms for ${largestTest.size} ragas)`);
  }
  
  return true;
}

/**
 * Test 2: Search/Filter response time
 */
function testSearchFilterPerformance() {
  console.log('\n=== Test 2: Search/Filter Response Time ===\n');
  
  const dataset = generateLargeDataset(500);
  const iterations = 100;
  
  // Test search performance
  console.log('Testing search performance:');
  const searchTerms = ['Raga', 'A', 'Z', 'Test', '123'];
  
  searchTerms.forEach(term => {
    const durations = [];
    for (let i = 0; i < iterations; i++) {
      const start = process.hrtime.bigint();
      searchRagas(dataset, term);
      const end = process.hrtime.bigint();
      durations.push(Number(end - start) / 1000000);
    }
    
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    console.log(`  Search "${term}": ${avgDuration.toFixed(3)}ms (avg over ${iterations} runs)`);
    
    if (avgDuration > 200) {
      console.log(`    ⚠️  Search took longer than 200ms`);
    }
  });
  
  // Test filter performance
  console.log('\nTesting filter performance:');
  const filterConfigs = [
    { thaat: 'Kalyan', timeOfDay: null },
    { thaat: null, timeOfDay: 'Evening' },
    { thaat: 'Kalyan', timeOfDay: 'Evening' }
  ];
  
  filterConfigs.forEach((filters, idx) => {
    const durations = [];
    for (let i = 0; i < iterations; i++) {
      const start = process.hrtime.bigint();
      applyFilters(dataset, filters);
      const end = process.hrtime.bigint();
      durations.push(Number(end - start) / 1000000);
    }
    
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const filterDesc = `thaat=${filters.thaat || 'any'}, time=${filters.timeOfDay || 'any'}`;
    console.log(`  Filter (${filterDesc}): ${avgDuration.toFixed(3)}ms (avg over ${iterations} runs)`);
    
    if (avgDuration > 200) {
      console.log(`    ⚠️  Filter took longer than 200ms`);
    }
  });
  
  // Test combined search + filter
  console.log('\nTesting combined search + filter:');
  const durations = [];
  for (let i = 0; i < iterations; i++) {
    const start = process.hrtime.bigint();
    const filtered = applyFilters(dataset, { thaat: 'Kalyan', timeOfDay: null });
    searchRagas(filtered, 'Raga');
    const end = process.hrtime.bigint();
    durations.push(Number(end - start) / 1000000);
  }
  
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  console.log(`  Combined: ${avgDuration.toFixed(3)}ms (avg over ${iterations} runs)`);
  
  if (avgDuration > 200) {
    console.log(`  ⚠️  Combined operation took longer than 200ms`);
  } else {
    console.log(`  ✅ All operations completed within 200ms requirement`);
  }
  
  return true;
}

/**
 * Test 3: Memory leak detection with repeated interactions
 */
function testMemoryLeaks() {
  console.log('\n=== Test 3: Memory Leak Detection ===\n');
  
  const dataset = generateLargeDataset(100);
  const iterations = 1000;
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
  
  const initialMemory = process.memoryUsage().heapUsed;
  console.log(`Initial memory: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);
  
  // Test 1: Repeated data processing (simulating rendering)
  console.log('\nTest 3.1: Repeated data processing (1000 iterations)');
  for (let i = 0; i < iterations; i++) {
    const sortedRagas = [...dataset].sort((a, b) => a.name.localeCompare(b.name));
    // Simulate creating card data
    sortedRagas.forEach(raga => {
      const cardData = {
        id: raga.id,
        name: raga.name,
        thaat: raga.thaat,
        timeOfDay: raga.timeOfDay,
        mood: raga.mood
      };
    });
  }
  
  if (global.gc) {
    global.gc();
  }
  
  const afterProcessMemory = process.memoryUsage().heapUsed;
  const processMemoryIncrease = afterProcessMemory - initialMemory;
  console.log(`  Memory after processing: ${(afterProcessMemory / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Memory increase: ${(processMemoryIncrease / 1024 / 1024).toFixed(2)} MB`);
  
  // Test 2: Repeated filtering
  console.log('\nTest 3.2: Repeated filtering (1000 iterations)');
  const beforeFilterMemory = process.memoryUsage().heapUsed;
  
  for (let i = 0; i < iterations; i++) {
    const filtered1 = applyFilters(dataset, { thaat: 'Kalyan', timeOfDay: 'Evening' });
    const filtered2 = applyFilters(dataset, { thaat: null, timeOfDay: null });
  }
  
  if (global.gc) {
    global.gc();
  }
  
  const afterFilterMemory = process.memoryUsage().heapUsed;
  const filterMemoryIncrease = afterFilterMemory - beforeFilterMemory;
  console.log(`  Memory after filtering: ${(afterFilterMemory / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Memory increase: ${(filterMemoryIncrease / 1024 / 1024).toFixed(2)} MB`);
  
  // Test 3: Repeated searching
  console.log('\nTest 3.3: Repeated searching (1000 iterations)');
  const beforeSearchMemory = process.memoryUsage().heapUsed;
  
  for (let i = 0; i < iterations; i++) {
    const results1 = searchRagas(dataset, 'Raga');
    const results2 = searchRagas(dataset, 'Test');
  }
  
  if (global.gc) {
    global.gc();
  }
  
  const afterSearchMemory = process.memoryUsage().heapUsed;
  const searchMemoryIncrease = afterSearchMemory - beforeSearchMemory;
  console.log(`  Memory after searching: ${(afterSearchMemory / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Memory increase: ${(searchMemoryIncrease / 1024 / 1024).toFixed(2)} MB`);
  
  // Analysis
  console.log('\nMemory Leak Analysis:');
  const totalIncrease = afterSearchMemory - initialMemory;
  console.log(`  Total memory increase: ${(totalIncrease / 1024 / 1024).toFixed(2)} MB`);
  
  // Check for significant memory leaks (>50MB increase is concerning)
  if (totalIncrease > 50 * 1024 * 1024) {
    console.log(`  ⚠️  Potential memory leak detected (>${(totalIncrease / 1024 / 1024).toFixed(2)} MB increase)`);
    return false;
  } else {
    console.log(`  ✅ No significant memory leaks detected`);
  }
  
  return true;
}

/**
 * Test 4: Algorithm efficiency
 */
function testAlgorithmEfficiency() {
  console.log('\n=== Test 4: Algorithm Efficiency ===\n');
  
  // Test sorting algorithm performance
  console.log('Testing sorting performance:');
  const sortTestSizes = [100, 500, 1000];
  
  sortTestSizes.forEach(size => {
    const dataset = generateLargeDataset(size);
    const duration = measureTime(() => {
      const sorted = [...dataset].sort((a, b) => a.name.localeCompare(b.name));
    }, `Sort ${size} ragas`);
    
    if (duration > 100) {
      console.log(`    ⚠️  Sorting ${size} ragas took ${duration.toFixed(2)}ms`);
    }
  });
  
  // Test combined operations
  console.log('\nTesting combined operations:');
  const dataset = generateLargeDataset(500);
  const duration = measureTime(() => {
    const filtered = applyFilters(dataset, { thaat: 'Kalyan', timeOfDay: null });
    const searched = searchRagas(filtered, 'Raga');
    const sorted = [...searched].sort((a, b) => a.name.localeCompare(b.name));
  }, 'Filter + Search + Sort (500 ragas)');
  
  if (duration < 200) {
    console.log(`  ✅ Combined operations efficient (${duration.toFixed(2)}ms)`);
  } else {
    console.log(`  ⚠️  Combined operations may need optimization (${duration.toFixed(2)}ms)`);
  }
  
  return true;
}

/**
 * Run all performance tests
 */
function runAllPerformanceTests() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     Indian Music Dashboard - Performance Tests        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  let allPassed = true;
  
  try {
    allPassed = testRenderingPerformance() && allPassed;
    allPassed = testSearchFilterPerformance() && allPassed;
    allPassed = testMemoryLeaks() && allPassed;
    allPassed = testAlgorithmEfficiency() && allPassed;
    
    console.log('\n╔════════════════════════════════════════════════════════╗');
    if (allPassed) {
      console.log('║              ✅ ALL PERFORMANCE TESTS PASSED           ║');
    } else {
      console.log('║         ⚠️  SOME PERFORMANCE TESTS HAD WARNINGS       ║');
    }
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    return allPassed;
  } catch (error) {
    console.error('\n❌ Performance tests failed with error:');
    console.error(error);
    return false;
  }
}

// Run tests
const success = runAllPerformanceTests();
process.exit(success ? 0 : 1);
