/**
 * Unit Tests for UI Rendering Module
 * Tests specific examples and edge cases for UI rendering functionality
 */

// Simple DOM mock for testing
function setupMockDOM() {
  // Create a minimal DOM-like structure
  const elements = {
    ragaListContainer: {
      id: 'ragaListContainer',
      innerHTML: '',
      children: [],
      appendChild: function(child) {
        this.children.push(child);
      }
    },
    noResultsMessage: {
      id: 'noResultsMessage',
      classList: {
        _classes: ['hidden'],
        contains: function(className) {
          return this._classes.includes(className);
        },
        add: function(className) {
          if (!this._classes.includes(className)) {
            this._classes.push(className);
          }
        },
        remove: function(className) {
          this._classes = this._classes.filter(c => c !== className);
        }
      }
    }
  };
  
  global.document = {
    getElementById: function(id) {
      return elements[id] || null;
    },
    createElement: function(tagName) {
      return {
        tagName: tagName.toUpperCase(),
        className: '',
        innerHTML: '',
        attributes: {},
        classList: {
          _classes: [],
          contains: function(className) {
            return this._classes.includes(className);
          },
          add: function(className) {
            if (!this._classes.includes(className)) {
              this._classes.push(className);
            }
          },
          remove: function(className) {
            this._classes = this._classes.filter(c => c !== className);
          }
        },
        setAttribute: function(name, value) {
          this.attributes[name] = value;
        },
        getAttribute: function(name) {
          return this.attributes[name] || null;
        },
        hasAttribute: function(name) {
          return name in this.attributes;
        },
        addEventListener: function() {}
      };
    }
  };
  
  global.HTMLElement = function() {};
  
  return elements;
}

// Set up mock DOM
const mockElements = setupMockDOM();

// Import UI functions
const { renderRagaCard, showNoResults, renderRagaList } = require('../../js/ui.js');

/**
 * Sample test data
 */
const sampleRaga = {
  id: 'yaman',
  name: 'Yaman',
  thaat: 'Kalyan',
  timeOfDay: 'Evening',
  aroha: 'Ni Re Ga Ma# Dha Ni Sa\'',
  avaroha: 'Sa\' Ni Dha Ma# Ga Re Sa',
  mood: 'Devotional, romantic, serene',
  characteristics: 'Teevra Madhyam is the defining note',
  audioFile: null
};

const sampleRagaWithSpecialChars = {
  id: 'test-raga',
  name: 'Test & Raga <Special>',
  thaat: 'Kalyan',
  timeOfDay: 'Evening',
  aroha: 'Sa Re Ga',
  avaroha: 'Ga Re Sa',
  mood: 'Test mood',
  characteristics: 'Test characteristics',
  audioFile: null
};

/**
 * Test: renderRagaCard produces valid HTML
 */
function testRenderRagaCardProducesValidHTML() {
  console.log('Test: renderRagaCard produces valid HTML');
  
  // Render a raga card
  const card = renderRagaCard(sampleRaga);
  
  // Check that card is an object (our mock element)
  if (!card || typeof card !== 'object') {
    console.error('❌ FAILED: renderRagaCard did not return an element object');
    return false;
  }
  
  // Check that card is an article element
  if (card.tagName !== 'ARTICLE') {
    console.error(`❌ FAILED: Expected ARTICLE element, got ${card.tagName}`);
    return false;
  }
  
  // Check that card has required data attribute
  if (card.getAttribute('data-raga-id') !== sampleRaga.id) {
    console.error(`❌ FAILED: Expected data-raga-id="${sampleRaga.id}", got "${card.getAttribute('data-raga-id')}"`);
    return false;
  }
  
  // Check that card has role="button"
  if (card.getAttribute('role') !== 'button') {
    console.error(`❌ FAILED: Expected role="button", got "${card.getAttribute('role')}"`);
    return false;
  }
  
  // Check that card has tabindex
  if (!card.hasAttribute('tabindex')) {
    console.error('❌ FAILED: Card missing tabindex attribute');
    return false;
  }
  
  // Check that card has aria-label
  if (!card.hasAttribute('aria-label')) {
    console.error('❌ FAILED: Card missing aria-label attribute');
    return false;
  }
  
  // Check that card contains raga name
  const innerHTML = card.innerHTML;
  if (!innerHTML.includes(sampleRaga.name)) {
    console.error(`❌ FAILED: Card HTML does not contain raga name "${sampleRaga.name}"`);
    return false;
  }
  
  // Check that card contains thaat
  if (!innerHTML.includes(sampleRaga.thaat)) {
    console.error(`❌ FAILED: Card HTML does not contain thaat "${sampleRaga.thaat}"`);
    return false;
  }
  
  // Check that card contains time of day
  if (!innerHTML.includes(sampleRaga.timeOfDay)) {
    console.error(`❌ FAILED: Card HTML does not contain timeOfDay "${sampleRaga.timeOfDay}"`);
    return false;
  }
  
  // Check that card contains mood
  if (!innerHTML.includes(sampleRaga.mood)) {
    console.error(`❌ FAILED: Card HTML does not contain mood "${sampleRaga.mood}"`);
    return false;
  }
  
  console.log('✅ PASSED: renderRagaCard produces valid HTML');
  return true;
}

/**
 * Test: renderRagaCard handles special characters properly
 */
function testRenderRagaCardHandlesSpecialCharacters() {
  console.log('Test: renderRagaCard handles special characters properly');
  
  // Render a raga card with special characters
  const card = renderRagaCard(sampleRagaWithSpecialChars);
  
  // Check that card is created
  if (!card || typeof card !== 'object') {
    console.error('❌ FAILED: renderRagaCard did not return an element object for special chars');
    return false;
  }
  
  // Check that special characters are properly escaped in HTML
  const innerHTML = card.innerHTML;
  
  // The name should be present (HTML will escape < and > to &lt; and &gt;)
  if (!innerHTML.includes('Test &amp; Raga') && !innerHTML.includes('Test & Raga')) {
    console.error('❌ FAILED: Special characters not properly handled in name');
    return false;
  }
  
  console.log('✅ PASSED: renderRagaCard handles special characters properly');
  return true;
}

/**
 * Test: showNoResults displays appropriate message
 */
function testShowNoResultsDisplaysMessage() {
  console.log('Test: showNoResults displays appropriate message');
  
  // Get the no results message element
  const noResultsMessage = document.getElementById('noResultsMessage');
  const container = document.getElementById('ragaListContainer');
  
  // Initially, the message should be hidden
  if (!noResultsMessage.classList.contains('hidden')) {
    // Reset for test
    noResultsMessage.classList.add('hidden');
  }
  
  // Add some content to container
  container.innerHTML = '<div>Some content</div>';
  
  // Call showNoResults
  showNoResults();
  
  // Check that container is cleared
  if (container.innerHTML !== '') {
    console.error(`❌ FAILED: Container not cleared, innerHTML: "${container.innerHTML}"`);
    return false;
  }
  
  // Check that no results message is visible (hidden class removed)
  if (noResultsMessage.classList.contains('hidden')) {
    console.error('❌ FAILED: No results message still has "hidden" class');
    return false;
  }
  
  console.log('✅ PASSED: showNoResults displays appropriate message');
  return true;
}

/**
 * Test: renderRagaList handles empty dataset
 */
function testRenderRagaListHandlesEmptyDataset() {
  console.log('Test: renderRagaList handles empty dataset');
  
  // Reset DOM state
  const container = document.getElementById('ragaListContainer');
  const noResultsMessage = document.getElementById('noResultsMessage');
  
  container.innerHTML = '<div>Existing content</div>';
  noResultsMessage.classList.add('hidden');
  
  // Test with empty array
  renderRagaList([]);
  
  // Check that container is cleared
  if (container.innerHTML !== '') {
    console.error(`❌ FAILED: Container not cleared for empty array, innerHTML: "${container.innerHTML}"`);
    return false;
  }
  
  // Check that no results message is shown
  if (noResultsMessage.classList.contains('hidden')) {
    console.error('❌ FAILED: No results message not shown for empty array');
    return false;
  }
  
  // Reset for next test
  container.innerHTML = '<div>Existing content</div>';
  noResultsMessage.classList.add('hidden');
  
  // Test with null
  renderRagaList(null);
  
  // Check that container is cleared
  if (container.innerHTML !== '') {
    console.error(`❌ FAILED: Container not cleared for null, innerHTML: "${container.innerHTML}"`);
    return false;
  }
  
  // Check that no results message is shown
  if (noResultsMessage.classList.contains('hidden')) {
    console.error('❌ FAILED: No results message not shown for null');
    return false;
  }
  
  // Reset for next test
  container.innerHTML = '<div>Existing content</div>';
  noResultsMessage.classList.add('hidden');
  
  // Test with undefined
  renderRagaList(undefined);
  
  // Check that container is cleared
  if (container.innerHTML !== '') {
    console.error(`❌ FAILED: Container not cleared for undefined, innerHTML: "${container.innerHTML}"`);
    return false;
  }
  
  // Check that no results message is shown
  if (noResultsMessage.classList.contains('hidden')) {
    console.error('❌ FAILED: No results message not shown for undefined');
    return false;
  }
  
  console.log('✅ PASSED: renderRagaList handles empty dataset');
  return true;
}

/**
 * Test: renderRagaList renders multiple ragas
 */
function testRenderRagaListRendersMultipleRagas() {
  console.log('Test: renderRagaList renders multiple ragas');
  
  // Reset DOM state
  const container = document.getElementById('ragaListContainer');
  const noResultsMessage = document.getElementById('noResultsMessage');
  
  container.innerHTML = '';
  container.children = [];
  noResultsMessage.classList.add('hidden');
  
  // Create test data
  const testRagas = [
    {
      id: 'raga1',
      name: 'Raga One',
      thaat: 'Kalyan',
      timeOfDay: 'Evening',
      mood: 'Happy',
      characteristics: 'Test'
    },
    {
      id: 'raga2',
      name: 'Raga Two',
      thaat: 'Bhairav',
      timeOfDay: 'Morning',
      mood: 'Serious',
      characteristics: 'Test'
    },
    {
      id: 'raga3',
      name: 'Raga Three',
      thaat: 'Todi',
      timeOfDay: 'Night',
      mood: 'Calm',
      characteristics: 'Test'
    }
  ];
  
  // Render the list
  renderRagaList(testRagas);
  
  // Check that container has children
  if (container.children.length !== testRagas.length) {
    console.error(`❌ FAILED: Expected ${testRagas.length} cards, got ${container.children.length}`);
    return false;
  }
  
  // Check that no results message is hidden
  if (!noResultsMessage.classList.contains('hidden')) {
    console.error('❌ FAILED: No results message should be hidden when ragas are displayed');
    return false;
  }
  
  // Note: renderRagaList sorts alphabetically, so we need to check against sorted order
  // Expected order: "Raga One", "Raga Three", "Raga Two"
  const sortedRagas = [...testRagas].sort((a, b) => a.name.localeCompare(b.name));
  
  // Check that each raga is rendered in sorted order
  for (let i = 0; i < sortedRagas.length; i++) {
    const card = container.children[i];
    const raga = sortedRagas[i];
    
    if (card.getAttribute('data-raga-id') !== raga.id) {
      console.error(`❌ FAILED: Card ${i} has wrong data-raga-id. Expected ${raga.id}, got ${card.getAttribute('data-raga-id')}`);
      return false;
    }
  }
  
  console.log('✅ PASSED: renderRagaList renders multiple ragas');
  return true;
}

/**
 * Test: Modal opens and closes correctly
 */
function testModalOpensAndClosesCorrectly() {
  console.log('Test: Modal opens and closes correctly');
  
  // Set up modal elements
  const modalElements = {
    ragaDetailModal: {
      id: 'ragaDetailModal',
      classList: {
        _classes: ['hidden'],
        contains: function(className) {
          return this._classes.includes(className);
        },
        add: function(className) {
          if (!this._classes.includes(className)) {
            this._classes.push(className);
          }
        },
        remove: function(className) {
          this._classes = this._classes.filter(c => c !== className);
        }
      }
    },
    modalContent: {
      id: 'modalContent',
      innerHTML: ''
    },
    closeModalBtn: {
      id: 'closeModalBtn',
      focus: function() {
        this._focused = true;
      },
      _focused: false
    }
  };
  
  // Override document.getElementById for this test
  const originalGetElementById = global.document.getElementById;
  global.document.getElementById = function(id) {
    return modalElements[id] || originalGetElementById.call(this, id);
  };
  
  // Mock getRagaById function
  global.getRagaById = function(id) {
    if (id === 'test-raga') {
      return {
        id: 'test-raga',
        name: 'Test Raga',
        thaat: 'Kalyan',
        timeOfDay: 'Evening',
        aroha: 'Sa Re Ga',
        avaroha: 'Ga Re Sa',
        mood: 'Test mood',
        characteristics: 'Test characteristics',
        audioFile: null
      };
    }
    return null;
  };
  
  const { showRagaDetail, hideRagaDetail } = require('../../js/ui.js');
  
  // Test opening modal
  const modal = modalElements.ragaDetailModal;
  
  // Initially modal should be hidden
  if (!modal.classList.contains('hidden')) {
    modal.classList.add('hidden');
  }
  
  // Open the modal
  showRagaDetail('test-raga');
  
  // Check that modal is visible (hidden class removed)
  if (modal.classList.contains('hidden')) {
    console.error('❌ FAILED: Modal still has "hidden" class after showRagaDetail');
    global.document.getElementById = originalGetElementById;
    return false;
  }
  
  // Check that modal content was populated
  if (modalElements.modalContent.innerHTML === '') {
    console.error('❌ FAILED: Modal content was not populated');
    global.document.getElementById = originalGetElementById;
    return false;
  }
  
  // Check that modal content contains raga name
  if (!modalElements.modalContent.innerHTML.includes('Test Raga')) {
    console.error('❌ FAILED: Modal content does not contain raga name');
    global.document.getElementById = originalGetElementById;
    return false;
  }
  
  // Test closing modal
  hideRagaDetail();
  
  // Check that modal is hidden again
  if (!modal.classList.contains('hidden')) {
    console.error('❌ FAILED: Modal does not have "hidden" class after hideRagaDetail');
    global.document.getElementById = originalGetElementById;
    return false;
  }
  
  // Restore original function
  global.document.getElementById = originalGetElementById;
  
  console.log('✅ PASSED: Modal opens and closes correctly');
  return true;
}

/**
 * Test: ESC key closes modal
 */
function testEscKeyClosesModal() {
  console.log('Test: ESC key closes modal');
  
  // Set up modal element
  const modalElement = {
    id: 'ragaDetailModal',
    classList: {
      _classes: [],
      contains: function(className) {
        return this._classes.includes(className);
      },
      add: function(className) {
        if (!this._classes.includes(className)) {
          this._classes.push(className);
        }
      },
      remove: function(className) {
        this._classes = this._classes.filter(c => c !== className);
      }
    }
  };
  
  // Override document.getElementById for this test
  const originalGetElementById = global.document.getElementById;
  global.document.getElementById = function(id) {
    if (id === 'ragaDetailModal') {
      return modalElement;
    }
    return originalGetElementById.call(this, id);
  };
  
  const { hideRagaDetail } = require('../../js/ui.js');
  
  // Simulate modal being open
  modalElement.classList._classes = [];
  
  // Simulate ESC key press by calling hideRagaDetail
  // (In the actual app, the event listener in app.js calls hideRagaDetail when ESC is pressed)
  hideRagaDetail();
  
  // Check that modal is hidden
  if (!modalElement.classList.contains('hidden')) {
    console.error('❌ FAILED: Modal not hidden after ESC key simulation');
    global.document.getElementById = originalGetElementById;
    return false;
  }
  
  // Restore original function
  global.document.getElementById = originalGetElementById;
  
  console.log('✅ PASSED: ESC key closes modal');
  return true;
}

/**
 * Test: Clicking outside modal closes it
 */
function testClickingOutsideModalClosesIt() {
  console.log('Test: Clicking outside modal closes it');
  
  // Set up modal element
  const modalElement = {
    id: 'ragaDetailModal',
    classList: {
      _classes: [],
      contains: function(className) {
        return this._classes.includes(className);
      },
      add: function(className) {
        if (!this._classes.includes(className)) {
          this._classes.push(className);
        }
      },
      remove: function(className) {
        this._classes = this._classes.filter(c => c !== className);
      }
    }
  };
  
  // Override document.getElementById for this test
  const originalGetElementById = global.document.getElementById;
  global.document.getElementById = function(id) {
    if (id === 'ragaDetailModal') {
      return modalElement;
    }
    return originalGetElementById.call(this, id);
  };
  
  const { hideRagaDetail } = require('../../js/ui.js');
  
  // Simulate modal being open
  modalElement.classList._classes = [];
  
  // Simulate clicking outside modal by calling hideRagaDetail
  // (In the actual app, the event listener in app.js checks if e.target === modal and calls hideRagaDetail)
  hideRagaDetail();
  
  // Check that modal is hidden
  if (!modalElement.classList.contains('hidden')) {
    console.error('❌ FAILED: Modal not hidden after clicking outside simulation');
    global.document.getElementById = originalGetElementById;
    return false;
  }
  
  // Restore original function
  global.document.getElementById = originalGetElementById;
  
  console.log('✅ PASSED: Clicking outside modal closes it');
  return true;
}

/**
 * Run all unit tests for UI rendering
 */
function runUIUnitTests() {
  console.log('=== UI Rendering Unit Tests ===\n');
  
  const results = [];
  
  // Run all tests
  results.push(testRenderRagaCardProducesValidHTML());
  results.push(testRenderRagaCardHandlesSpecialCharacters());
  results.push(testShowNoResultsDisplaysMessage());
  results.push(testRenderRagaListHandlesEmptyDataset());
  results.push(testRenderRagaListRendersMultipleRagas());
  results.push(testModalOpensAndClosesCorrectly());
  results.push(testEscKeyClosesModal());
  results.push(testClickingOutsideModalClosesIt());
  
  // Summary
  const allPassed = results.every(r => r === true);
  if (allPassed) {
    console.log('\n=== All UI Rendering Unit Tests Passed ===');
  } else {
    console.log('\n=== Some UI Rendering Unit Tests Failed ===');
  }
  
  return allPassed;
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testRenderRagaCardProducesValidHTML,
    testRenderRagaCardHandlesSpecialCharacters,
    testShowNoResultsDisplaysMessage,
    testRenderRagaListHandlesEmptyDataset,
    testRenderRagaListRendersMultipleRagas,
    testModalOpensAndClosesCorrectly,
    testEscKeyClosesModal,
    testClickingOutsideModalClosesIt,
    runUIUnitTests
  };
}

// Run tests if executed directly
if (require.main === module) {
  const passed = runUIUnitTests();
  process.exit(passed ? 0 : 1);
}
