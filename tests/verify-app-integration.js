/**
 * Verification script for app.js integration
 * Tests that the main application controller properly coordinates all modules
 */

// Load required modules
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Create a DOM environment
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  resources: 'usable',
  url: 'http://localhost'
});

const { window } = dom;
const { document } = window;

// Make global functions available
global.document = document;
global.window = window;

// Load all JavaScript modules in order
const modules = [
  'data.js',
  'filter.js',
  'search.js',
  'audio.js',
  'ui.js',
  'app.js'
];

console.log('Loading modules...');
modules.forEach(module => {
  const modulePath = path.join(__dirname, '..', 'js', module);
  const code = fs.readFileSync(modulePath, 'utf-8');
  const script = new window.Function(code);
  script.call(window);
  console.log(`✓ Loaded ${module}`);
});

// Wait for DOM to be ready
setTimeout(() => {
  console.log('\n=== Testing App Integration ===\n');
  
  // Test 1: Check that appState is initialized
  console.log('Test 1: App state initialization');
  if (window.appState) {
    console.log('✓ appState exists');
    console.log(`  - allRagas: ${window.appState.allRagas.length} ragas loaded`);
    console.log(`  - filteredRagas: ${window.appState.filteredRagas.length} ragas`);
    console.log(`  - displayedRagas: ${window.appState.displayedRagas.length} ragas`);
  } else {
    console.log('✗ appState not found');
  }
  
  // Test 2: Check that filter dropdowns are populated
  console.log('\nTest 2: Filter UI initialization');
  const thaatFilter = document.getElementById('thaatFilter');
  const timeFilter = document.getElementById('timeFilter');
  
  if (thaatFilter && thaatFilter.options.length > 1) {
    console.log(`✓ Thaat filter populated with ${thaatFilter.options.length - 1} options`);
  } else {
    console.log('✗ Thaat filter not properly populated');
  }
  
  if (timeFilter && timeFilter.options.length > 1) {
    console.log(`✓ Time filter populated with ${timeFilter.options.length - 1} options`);
  } else {
    console.log('✗ Time filter not properly populated');
  }
  
  // Test 3: Check that ragas are rendered
  console.log('\nTest 3: Initial raga list rendering');
  const ragaListContainer = document.getElementById('ragaListContainer');
  if (ragaListContainer && ragaListContainer.children.length > 0) {
    console.log(`✓ Raga list rendered with ${ragaListContainer.children.length} cards`);
  } else {
    console.log('✗ Raga list not rendered');
  }
  
  // Test 4: Test filter functionality
  console.log('\nTest 4: Filter functionality');
  if (window.handleFilterChange && thaatFilter) {
    // Simulate selecting a thaat filter
    thaatFilter.value = 'Kalyan';
    const event = new window.Event('change', { bubbles: true });
    Object.defineProperty(event, 'target', { value: thaatFilter, enumerable: true });
    window.handleFilterChange(event);
    
    console.log(`✓ Filter applied: ${window.appState.displayedRagas.length} ragas match 'Kalyan' thaat`);
    
    // Verify all displayed ragas have the correct thaat
    const allCorrect = window.appState.displayedRagas.every(r => r.thaat === 'Kalyan');
    if (allCorrect) {
      console.log('✓ All displayed ragas have correct thaat');
    } else {
      console.log('✗ Some displayed ragas have incorrect thaat');
    }
  } else {
    console.log('✗ Filter functionality not available');
  }
  
  // Test 5: Test search functionality
  console.log('\nTest 5: Search functionality');
  if (window.handleSearchInput) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = 'Yaman';
      const event = new window.Event('input', { bubbles: true });
      Object.defineProperty(event, 'target', { value: searchInput, enumerable: true });
      window.handleSearchInput(event);
      
      console.log(`✓ Search applied: ${window.appState.displayedRagas.length} ragas match 'Yaman'`);
      
      // Verify search results contain the search term
      const allMatch = window.appState.displayedRagas.every(r => 
        r.name.toLowerCase().includes('yaman')
      );
      if (allMatch) {
        console.log('✓ All search results contain search term');
      } else {
        console.log('✗ Some search results do not contain search term');
      }
    }
  } else {
    console.log('✗ Search functionality not available');
  }
  
  // Test 6: Test clear filters
  console.log('\nTest 6: Clear filters functionality');
  if (window.handleClearFilters) {
    window.handleClearFilters();
    
    if (window.appState.filters.thaat === null && window.appState.filters.timeOfDay === null) {
      console.log('✓ Filters cleared in state');
    } else {
      console.log('✗ Filters not properly cleared');
    }
    
    // Note: Search is not cleared by clear filters, only filters
    console.log(`  - Displayed ragas after clear: ${window.appState.displayedRagas.length}`);
  } else {
    console.log('✗ Clear filters functionality not available');
  }
  
  // Test 7: Test updateDisplay
  console.log('\nTest 7: Update display coordination');
  if (window.updateDisplay) {
    // Reset search
    window.appState.searchTerm = '';
    window.updateDisplay();
    
    const totalRagas = window.appState.allRagas.length;
    const displayedRagas = window.appState.displayedRagas.length;
    
    if (totalRagas === displayedRagas) {
      console.log(`✓ updateDisplay correctly shows all ${totalRagas} ragas when no filters/search`);
    } else {
      console.log(`✗ updateDisplay shows ${displayedRagas} ragas, expected ${totalRagas}`);
    }
  } else {
    console.log('✗ updateDisplay function not available');
  }
  
  console.log('\n=== Integration Tests Complete ===\n');
  
}, 1000);
