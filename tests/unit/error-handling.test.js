/**
 * Unit Tests for Error Handling Scenarios
 * Tests handling of malformed data, network errors, and state corruption
 */

// Mock console methods to suppress error logs during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
let consoleErrorCalls = [];
let consoleWarnCalls = [];

function mockConsole() {
  consoleErrorCalls = [];
  consoleWarnCalls = [];
  console.error = (...args) => {
    consoleErrorCalls.push(args);
  };
  console.warn = (...args) => {
    consoleWarnCalls.push(args);
  };
}

function restoreConsole() {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
}

// Import modules
const { getAllRagas, getRagaById, getThaats, getTimesOfDay } = require('../../js/data.js');
const { searchRagas } = require('../../js/search.js');
const { applyFilters } = require('../../js/filter.js');

/**
 * Test: Handling malformed raga objects - missing required fields
 */
function testMalformedRagaMissingFields() {
  console.log('Test: Handling malformed raga objects - missing required fields');
  
  mockConsole();
  
  // Create malformed ragas with missing fields
  const malformedRagas = [
    { id: 'test1', name: 'Valid Raga', thaat: 'Kalyan', timeOfDay: 'Evening' },
    { id: 'test2' }, // Missing name, thaat, timeOfDay
    { name: 'No ID Raga', thaat: 'Bhairav' }, // Missing id
    { id: 'test3', name: 'No Thaat' }, // Missing thaat
    null, // Null object
    undefined, // Undefined object
    'not an object', // Wrong type
    { id: 'test4', name: '', thaat: '', timeOfDay: '' } // Empty strings
  ];
  
  // Test search with malformed ragas
  const searchResult = searchRagas(malformedRagas, 'test');
  
  // Should handle gracefully and return valid results only
  if (!Array.isArray(searchResult)) {
    console.error('❌ FAILED: searchRagas should return an array even with malformed data');
    restoreConsole();
    return false;
  }
  
  // Test filter with malformed ragas
  const filterResult = applyFilters(malformedRagas, { thaat: 'Kalyan', timeOfDay: null });
  
  if (!Array.isArray(filterResult)) {
    console.error('❌ FAILED: applyFilters should return an array even with malformed data');
    restoreConsole();
    return false;
  }
  
  // Should only return the valid raga
  if (filterResult.length !== 1 || filterResult[0].id !== 'test1') {
    console.error('❌ FAILED: Filter should only return valid ragas');
    restoreConsole();
    return false;
  }
  
  restoreConsole();
  console.log('✅ PASSED: Handling malformed raga objects - missing required fields');
  return true;
}

/**
 * Test: Handling malformed raga objects - invalid data types
 */
function testMalformedRagaInvalidTypes() {
  console.log('Test: Handling malformed raga objects - invalid data types');
  
  mockConsole();
  
  // Create ragas with invalid data types
  const invalidTypeRagas = [
    { id: 123, name: 'Number ID', thaat: 'Kalyan', timeOfDay: 'Evening' }, // Number instead of string
    { id: 'test1', name: ['Array', 'Name'], thaat: 'Bhairav', timeOfDay: 'Morning' }, // Array instead of string
    { id: 'test2', name: 'Valid', thaat: { nested: 'object' }, timeOfDay: 'Night' }, // Object instead of string
    { id: 'test3', name: 'Valid', thaat: 'Todi', timeOfDay: 12345 } // Number instead of string
  ];
  
  // Test search with invalid types
  const searchResult = searchRagas(invalidTypeRagas, 'Valid');
  
  if (!Array.isArray(searchResult)) {
    console.error('❌ FAILED: searchRagas should handle invalid types gracefully');
    restoreConsole();
    return false;
  }
  
  // Test filter with invalid types
  const filterResult = applyFilters(invalidTypeRagas, { thaat: 'Todi', timeOfDay: null });
  
  if (!Array.isArray(filterResult)) {
    console.error('❌ FAILED: applyFilters should handle invalid types gracefully');
    restoreConsole();
    return false;
  }
  
  restoreConsole();
  console.log('✅ PASSED: Handling malformed raga objects - invalid data types');
  return true;
}

/**
 * Test: Handling getRagaById with invalid inputs
 */
function testGetRagaByIdInvalidInputs() {
  console.log('Test: getRagaById with invalid inputs');
  
  mockConsole();
  
  // Test with null
  const result1 = getRagaById(null);
  if (result1 !== null) {
    console.error('❌ FAILED: getRagaById(null) should return null');
    restoreConsole();
    return false;
  }
  
  // Test with undefined
  const result2 = getRagaById(undefined);
  if (result2 !== null) {
    console.error('❌ FAILED: getRagaById(undefined) should return null');
    restoreConsole();
    return false;
  }
  
  // Test with empty string
  const result3 = getRagaById('');
  if (result3 !== null) {
    console.error('❌ FAILED: getRagaById(\'\') should return null');
    restoreConsole();
    return false;
  }
  
  // Test with non-existent ID
  const result4 = getRagaById('non-existent-raga-id-xyz');
  if (result4 !== null) {
    console.error('❌ FAILED: getRagaById with non-existent ID should return null');
    restoreConsole();
    return false;
  }
  
  // Test with number instead of string
  const result5 = getRagaById(12345);
  if (result5 !== null) {
    console.error('❌ FAILED: getRagaById with number should return null');
    restoreConsole();
    return false;
  }
  
  // Test with object
  const result6 = getRagaById({ id: 'test' });
  if (result6 !== null) {
    console.error('❌ FAILED: getRagaById with object should return null');
    restoreConsole();
    return false;
  }
  
  // Verify warnings were logged
  if (consoleWarnCalls.length === 0) {
    console.error('❌ FAILED: No warnings logged for invalid inputs');
    restoreConsole();
    return false;
  }
  
  restoreConsole();
  console.log('✅ PASSED: getRagaById with invalid inputs');
  return true;
}

/**
 * Test: Handling corrupted data array
 */
function testCorruptedDataArray() {
  console.log('Test: Handling corrupted data array');
  
  mockConsole();
  
  // Test with null array
  const result1 = searchRagas(null, 'test');
  if (!Array.isArray(result1) || result1.length !== 0) {
    console.error('❌ FAILED: searchRagas should handle null array gracefully');
    restoreConsole();
    return false;
  }
  
  // Test with undefined array
  const result2 = searchRagas(undefined, 'test');
  if (!Array.isArray(result2) || result2.length !== 0) {
    console.error('❌ FAILED: searchRagas should handle undefined array gracefully');
    restoreConsole();
    return false;
  }
  
  // Test with non-array value
  const result3 = searchRagas('not an array', 'test');
  if (!Array.isArray(result3) || result3.length !== 0) {
    console.error('❌ FAILED: searchRagas should handle non-array gracefully');
    restoreConsole();
    return false;
  }
  
  restoreConsole();
  console.log('✅ PASSED: Handling corrupted data array');
  return true;
}

/**
 * Test: Network error handling for audio - Mock Audio API
 */
class MockAudioForNetworkTest {
  constructor(src) {
    this.src = src;
    this.paused = true;
    this.currentTime = 0;
    this._eventListeners = {};
    this._shouldError = false;
    
    // Simulate network error for specific files
    if (src && src.includes('network-error')) {
      this._shouldError = true;
      this._errorCode = 2; // MEDIA_ERR_NETWORK
    }
    
    // Simulate file not found
    if (src && src.includes('not-found')) {
      this._shouldError = true;
      this._errorCode = 4; // MEDIA_ERR_SRC_NOT_SUPPORTED
    }
    
    // Simulate decode error
    if (src && src.includes('decode-error')) {
      this._shouldError = true;
      this._errorCode = 3; // MEDIA_ERR_DECODE
    }
  }
  
  addEventListener(event, handler) {
    if (!this._eventListeners[event]) {
      this._eventListeners[event] = [];
    }
    this._eventListeners[event].push(handler);
    
    // Trigger error immediately after listener is added
    if (event === 'error' && this._shouldError) {
      setTimeout(() => {
        this.error = { code: this._errorCode };
        handler({ type: 'error', target: this });
      }, 5);
    }
  }
  
  _triggerEvent(event) {
    if (this._eventListeners[event]) {
      this._eventListeners[event].forEach(handler => {
        handler({ type: event, target: this });
      });
    }
  }
  
  play() {
    if (this._shouldError) {
      return Promise.reject(new Error('Playback failed'));
    }
    this.paused = false;
    return Promise.resolve();
  }
  
  pause() {
    this.paused = true;
  }
}

/**
 * Test: Network error handling for audio
 */
function testNetworkErrorHandlingForAudio() {
  console.log('Test: Network error handling for audio');
  
  return new Promise((resolve) => {
    mockConsole();
    
    // Save original Audio and document
    const OriginalAudio = global.Audio;
    const originalDocument = global.document;
    
    // Mock document for audio error display
    global.document = {
      getElementById: function(id) {
        if (id === 'audioPlayerSection') {
          return {
            appendChild: function() {},
            querySelector: function() { return null; }
          };
        }
        return null;
      },
      createElement: function(tagName) {
        return {
          className: '',
          innerHTML: '',
          setAttribute: function() {},
          remove: function() {},
          parentNode: null
        };
      }
    };
    
    global.Audio = MockAudioForNetworkTest;
    
    // Import audio module
    delete require.cache[require.resolve('../../js/audio.js')];
    const { playAudio, stopAudio } = require('../../js/audio.js');
    
    // Test network error
    playAudio('audio/network-error.mp3')
      .then(() => {
        console.error('❌ FAILED: playAudio should reject on network error');
        global.Audio = OriginalAudio;
        global.document = originalDocument;
        restoreConsole();
        resolve(false);
      })
      .catch((error) => {
        // Should catch the error
        if (!error) {
          console.error('❌ FAILED: Error should be provided');
          global.Audio = OriginalAudio;
          global.document = originalDocument;
          restoreConsole();
          resolve(false);
          return;
        }
        
        // Check that error was logged
        setTimeout(() => {
          if (consoleErrorCalls.length === 0) {
            console.error('❌ FAILED: No error logged for network error');
            global.Audio = OriginalAudio;
            global.document = originalDocument;
            restoreConsole();
            resolve(false);
            return;
          }
          
          // Clean up
          stopAudio();
          global.Audio = OriginalAudio;
          global.document = originalDocument;
          restoreConsole();
          console.log('✅ PASSED: Network error handling for audio');
          resolve(true);
        }, 100);
      });
  });
}

/**
 * Test: Audio file not found error
 */
function testAudioFileNotFoundError() {
  console.log('Test: Audio file not found error');
  
  return new Promise((resolve) => {
    mockConsole();
    
    // Save original Audio and document
    const OriginalAudio = global.Audio;
    const originalDocument = global.document;
    
    // Mock document for audio error display
    global.document = {
      getElementById: function(id) {
        if (id === 'audioPlayerSection') {
          return {
            appendChild: function() {},
            querySelector: function() { return null; }
          };
        }
        return null;
      },
      createElement: function(tagName) {
        return {
          className: '',
          innerHTML: '',
          setAttribute: function() {},
          remove: function() {},
          parentNode: null
        };
      }
    };
    
    global.Audio = MockAudioForNetworkTest;
    
    // Import audio module
    delete require.cache[require.resolve('../../js/audio.js')];
    const { playAudio, stopAudio } = require('../../js/audio.js');
    
    // Test file not found
    playAudio('audio/not-found.mp3')
      .then(() => {
        console.error('❌ FAILED: playAudio should reject when file not found');
        global.Audio = OriginalAudio;
        global.document = originalDocument;
        restoreConsole();
        resolve(false);
      })
      .catch((error) => {
        // Should catch the error
        if (!error) {
          console.error('❌ FAILED: Error should be provided');
          global.Audio = OriginalAudio;
          global.document = originalDocument;
          restoreConsole();
          resolve(false);
          return;
        }
        
        // Check that error was logged
        setTimeout(() => {
          if (consoleErrorCalls.length === 0) {
            console.error('❌ FAILED: No error logged for file not found');
            global.Audio = OriginalAudio;
            global.document = originalDocument;
            restoreConsole();
            resolve(false);
            return;
          }
          
          // Clean up
          stopAudio();
          global.Audio = OriginalAudio;
          global.document = originalDocument;
          restoreConsole();
          console.log('✅ PASSED: Audio file not found error');
          resolve(true);
        }, 100);
      });
  });
}

/**
 * Test: Audio decode error handling
 */
function testAudioDecodeError() {
  console.log('Test: Audio decode error handling');
  
  return new Promise((resolve) => {
    mockConsole();
    
    // Save original Audio and document
    const OriginalAudio = global.Audio;
    const originalDocument = global.document;
    
    // Mock document for audio error display
    global.document = {
      getElementById: function(id) {
        if (id === 'audioPlayerSection') {
          return {
            appendChild: function() {},
            querySelector: function() { return null; }
          };
        }
        return null;
      },
      createElement: function(tagName) {
        return {
          className: '',
          innerHTML: '',
          setAttribute: function() {},
          remove: function() {},
          parentNode: null
        };
      }
    };
    
    global.Audio = MockAudioForNetworkTest;
    
    // Import audio module
    delete require.cache[require.resolve('../../js/audio.js')];
    const { playAudio, stopAudio } = require('../../js/audio.js');
    
    // Test decode error
    playAudio('audio/decode-error.mp3')
      .then(() => {
        console.error('❌ FAILED: playAudio should reject on decode error');
        global.Audio = OriginalAudio;
        global.document = originalDocument;
        restoreConsole();
        resolve(false);
      })
      .catch((error) => {
        // Should catch the error
        if (!error) {
          console.error('❌ FAILED: Error should be provided');
          global.Audio = OriginalAudio;
          global.document = originalDocument;
          restoreConsole();
          resolve(false);
          return;
        }
        
        // Check that error was logged
        setTimeout(() => {
          if (consoleErrorCalls.length === 0) {
            console.error('❌ FAILED: No error logged for decode error');
            global.Audio = OriginalAudio;
            global.document = originalDocument;
            restoreConsole();
            resolve(false);
            return;
          }
          
          // Clean up
          stopAudio();
          global.Audio = OriginalAudio;
          global.document = originalDocument;
          restoreConsole();
          console.log('✅ PASSED: Audio decode error handling');
          resolve(true);
        }, 100);
      });
  });
}

/**
 * Test: Recovery from state corruption - filter state
 */
function testRecoveryFromFilterStateCorruption() {
  console.log('Test: Recovery from filter state corruption');
  
  mockConsole();
  
  // Import filter module
  const { applyFilters, clearFilters, getActiveFilters } = require('../../js/filter.js');
  
  // Create valid test data
  const testRagas = [
    { id: 'test1', name: 'Raga 1', thaat: 'Kalyan', timeOfDay: 'Evening' },
    { id: 'test2', name: 'Raga 2', thaat: 'Bhairav', timeOfDay: 'Morning' },
    { id: 'test3', name: 'Raga 3', thaat: 'Kalyan', timeOfDay: 'Night' }
  ];
  
  // Test with corrupted filter object (null)
  const result1 = applyFilters(testRagas, null);
  if (!Array.isArray(result1) || result1.length !== testRagas.length) {
    console.error('❌ FAILED: applyFilters should handle null filter gracefully');
    restoreConsole();
    return false;
  }
  
  // Test with corrupted filter object (undefined)
  const result2 = applyFilters(testRagas, undefined);
  if (!Array.isArray(result2) || result2.length !== testRagas.length) {
    console.error('❌ FAILED: applyFilters should handle undefined filter gracefully');
    restoreConsole();
    return false;
  }
  
  // Test with corrupted filter object (wrong type)
  const result3 = applyFilters(testRagas, 'not an object');
  if (!Array.isArray(result3) || result3.length !== testRagas.length) {
    console.error('❌ FAILED: applyFilters should handle wrong type filter gracefully');
    restoreConsole();
    return false;
  }
  
  // Test with corrupted filter values
  const result4 = applyFilters(testRagas, { thaat: 123, timeOfDay: ['array'] });
  if (!Array.isArray(result4)) {
    console.error('❌ FAILED: applyFilters should handle corrupted filter values');
    restoreConsole();
    return false;
  }
  
  // Test clearFilters recovery
  clearFilters();
  const activeFilters = getActiveFilters();
  if (!activeFilters || typeof activeFilters !== 'object') {
    console.error('❌ FAILED: clearFilters should restore valid filter state');
    restoreConsole();
    return false;
  }
  
  restoreConsole();
  console.log('✅ PASSED: Recovery from filter state corruption');
  return true;
}

/**
 * Test: Recovery from state corruption - search state
 */
function testRecoveryFromSearchStateCorruption() {
  console.log('Test: Recovery from search state corruption');
  
  mockConsole();
  
  const { searchRagas } = require('../../js/search.js');
  
  // Create valid test data
  const testRagas = [
    { id: 'test1', name: 'Yaman', thaat: 'Kalyan', timeOfDay: 'Evening' },
    { id: 'test2', name: 'Bhairav', thaat: 'Bhairav', timeOfDay: 'Morning' }
  ];
  
  // Test with corrupted search term (null)
  const result1 = searchRagas(testRagas, null);
  if (!Array.isArray(result1) || result1.length !== testRagas.length) {
    console.error('❌ FAILED: searchRagas should handle null search term');
    restoreConsole();
    return false;
  }
  
  // Test with corrupted search term (undefined)
  const result2 = searchRagas(testRagas, undefined);
  if (!Array.isArray(result2) || result2.length !== testRagas.length) {
    console.error('❌ FAILED: searchRagas should handle undefined search term');
    restoreConsole();
    return false;
  }
  
  // Test with corrupted search term (number)
  const result3 = searchRagas(testRagas, 12345);
  if (!Array.isArray(result3)) {
    console.error('❌ FAILED: searchRagas should handle number search term');
    restoreConsole();
    return false;
  }
  
  // Test with corrupted search term (object)
  const result4 = searchRagas(testRagas, { search: 'test' });
  if (!Array.isArray(result4)) {
    console.error('❌ FAILED: searchRagas should handle object search term');
    restoreConsole();
    return false;
  }
  
  restoreConsole();
  console.log('✅ PASSED: Recovery from search state corruption');
  return true;
}

/**
 * Test: Recovery from UI state corruption - DOM elements missing
 */
function testRecoveryFromUIMissingElements() {
  console.log('Test: Recovery from UI state corruption - DOM elements missing');
  
  mockConsole();
  
  // Set up minimal DOM mock
  const originalDocument = global.document;
  global.document = {
    getElementById: function(id) {
      // Simulate missing elements
      return null;
    },
    createElement: function(tagName) {
      return {
        tagName: tagName.toUpperCase(),
        className: '',
        innerHTML: '',
        setAttribute: function() {},
        getAttribute: function() { return null; }
      };
    }
  };
  
  // Import UI module
  delete require.cache[require.resolve('../../js/ui.js')];
  const { renderRagaList, showNoResults } = require('../../js/ui.js');
  
  // Test renderRagaList with missing container
  const testRagas = [
    { id: 'test1', name: 'Test Raga', thaat: 'Kalyan', timeOfDay: 'Evening' }
  ];
  
  // Should not throw error
  try {
    renderRagaList(testRagas);
    
    // Check that error was logged
    if (consoleErrorCalls.length === 0) {
      console.error('❌ FAILED: No error logged for missing container');
      global.document = originalDocument;
      restoreConsole();
      return false;
    }
  } catch (error) {
    console.error('❌ FAILED: renderRagaList should not throw error for missing elements');
    global.document = originalDocument;
    restoreConsole();
    return false;
  }
  
  // Reset console calls
  consoleErrorCalls = [];
  
  // Test showNoResults with missing elements
  try {
    showNoResults();
    // Should handle gracefully (no error thrown)
  } catch (error) {
    console.error('❌ FAILED: showNoResults should not throw error for missing elements');
    global.document = originalDocument;
    restoreConsole();
    return false;
  }
  
  // Restore original document
  global.document = originalDocument;
  restoreConsole();
  console.log('✅ PASSED: Recovery from UI state corruption - DOM elements missing');
  return true;
}

/**
 * Test: Recovery from corrupted raga data in getAllRagas
 */
function testRecoveryFromCorruptedGetAllRagas() {
  console.log('Test: Recovery from corrupted raga data in getAllRagas');
  
  mockConsole();
  
  // getAllRagas should always return an array
  const result = getAllRagas();
  
  if (!Array.isArray(result)) {
    console.error('❌ FAILED: getAllRagas should always return an array');
    restoreConsole();
    return false;
  }
  
  // Should return valid ragas (not corrupted)
  const hasValidRagas = result.every(raga => 
    raga && 
    typeof raga === 'object' && 
    typeof raga.id === 'string' &&
    typeof raga.name === 'string'
  );
  
  if (!hasValidRagas && result.length > 0) {
    console.error('❌ FAILED: getAllRagas returned corrupted raga objects');
    restoreConsole();
    return false;
  }
  
  restoreConsole();
  console.log('✅ PASSED: Recovery from corrupted raga data in getAllRagas');
  return true;
}

/**
 * Test: getThaats and getTimesOfDay with corrupted data
 */
function testGetThaaatsAndTimesWithCorruptedData() {
  console.log('Test: getThaats and getTimesOfDay with corrupted data');
  
  mockConsole();
  
  // getThaats should always return an array
  const thaats = getThaats();
  if (!Array.isArray(thaats)) {
    console.error('❌ FAILED: getThaats should always return an array');
    restoreConsole();
    return false;
  }
  
  // getTimesOfDay should always return an array
  const times = getTimesOfDay();
  if (!Array.isArray(times)) {
    console.error('❌ FAILED: getTimesOfDay should always return an array');
    restoreConsole();
    return false;
  }
  
  // Arrays should contain only strings
  const thaaatsValid = thaats.every(t => typeof t === 'string');
  const timesValid = times.every(t => typeof t === 'string');
  
  if (!thaaatsValid) {
    console.error('❌ FAILED: getThaats returned non-string values');
    restoreConsole();
    return false;
  }
  
  if (!timesValid) {
    console.error('❌ FAILED: getTimesOfDay returned non-string values');
    restoreConsole();
    return false;
  }
  
  restoreConsole();
  console.log('✅ PASSED: getThaats and getTimesOfDay with corrupted data');
  return true;
}

/**
 * Run all error handling unit tests
 */
async function runErrorHandlingTests() {
  console.log('=== Error Handling Unit Tests ===\n');
  
  const results = [];
  
  // Run synchronous tests
  console.log('--- Malformed Raga Object Tests ---');
  results.push(testMalformedRagaMissingFields());
  results.push(testMalformedRagaInvalidTypes());
  results.push(testGetRagaByIdInvalidInputs());
  results.push(testCorruptedDataArray());
  
  console.log('\n--- Network Error Tests ---');
  // Run asynchronous audio tests
  results.push(await testNetworkErrorHandlingForAudio());
  results.push(await testAudioFileNotFoundError());
  results.push(await testAudioDecodeError());
  
  console.log('\n--- State Corruption Recovery Tests ---');
  results.push(testRecoveryFromFilterStateCorruption());
  results.push(testRecoveryFromSearchStateCorruption());
  results.push(testRecoveryFromUIMissingElements());
  results.push(testRecoveryFromCorruptedGetAllRagas());
  results.push(testGetThaaatsAndTimesWithCorruptedData());
  
  // Summary
  const passed = results.filter(r => r === true).length;
  const total = results.length;
  
  console.log(`\n=== Error Handling Test Summary ===`);
  console.log(`Passed: ${passed}/${total}`);
  
  const allPassed = results.every(r => r === true);
  if (allPassed) {
    console.log('=== All Error Handling Tests Passed ===');
  } else {
    console.log('=== Some Error Handling Tests Failed ===');
  }
  
  return allPassed;
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testMalformedRagaMissingFields,
    testMalformedRagaInvalidTypes,
    testGetRagaByIdInvalidInputs,
    testCorruptedDataArray,
    testNetworkErrorHandlingForAudio,
    testAudioFileNotFoundError,
    testAudioDecodeError,
    testRecoveryFromFilterStateCorruption,
    testRecoveryFromSearchStateCorruption,
    testRecoveryFromUIMissingElements,
    testRecoveryFromCorruptedGetAllRagas,
    testGetThaaatsAndTimesWithCorruptedData,
    runErrorHandlingTests
  };
}

// Run tests if executed directly
if (require.main === module) {
  runErrorHandlingTests().then(passed => {
    process.exit(passed ? 0 : 1);
  });
}
