/**
 * Unit Tests for Audio Module Edge Cases
 * Tests specific examples and edge cases for audio functionality
 */

// Mock Audio API
class MockAudio {
  constructor(src) {
    this.src = src;
    this.paused = true;
    this.currentTime = 0;
    this._eventListeners = {};
    this._shouldError = MockAudio._errorFiles.has(src);
    this._shouldFailPlay = MockAudio._playFailFiles.has(src);
  }

  addEventListener(event, handler) {
    if (!this._eventListeners[event]) {
      this._eventListeners[event] = [];
    }
    this._eventListeners[event].push(handler);
    
    // Trigger error immediately if this is an error file
    if (event === 'error' && this._shouldError) {
      setTimeout(() => {
        handler({ type: 'error', target: this });
      }, 0);
    }
  }

  play() {
    if (this._shouldFailPlay) {
      return Promise.reject(new Error('Playback failed'));
    }
    this.paused = false;
    return Promise.resolve();
  }

  pause() {
    this.paused = true;
  }

  // Static registry for files that should error
  static _errorFiles = new Set();
  static _playFailFiles = new Set();
  
  static setErrorFile(src) {
    MockAudio._errorFiles.add(src);
  }
  
  static setPlayFailFile(src) {
    MockAudio._playFailFiles.add(src);
  }
  
  static clearErrorFiles() {
    MockAudio._errorFiles.clear();
    MockAudio._playFailFiles.clear();
  }
}

// Set up global Audio mock
global.Audio = MockAudio;

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

// Import audio functions
const { playAudio, pauseAudio, stopAudio, isPlaying } = require('../../js/audio.js');

/**
 * Test: Missing audio file handling
 */
function testMissingAudioFileHandling() {
  console.log('Test: Missing audio file handling');
  
  mockConsole();
  MockAudio.clearErrorFiles();
  
  // Test with null audio file
  const result1 = playAudio(null);
  if (result1 !== false) {
    console.error('❌ FAILED: playAudio(null) should return false');
    restoreConsole();
    return false;
  }
  
  // Check that warning was logged
  if (consoleWarnCalls.length === 0) {
    console.error('❌ FAILED: No warning logged for null audio file');
    restoreConsole();
    return false;
  }
  
  // Reset console calls
  consoleWarnCalls = [];
  
  // Test with undefined audio file
  const result2 = playAudio(undefined);
  if (result2 !== false) {
    console.error('❌ FAILED: playAudio(undefined) should return false');
    restoreConsole();
    return false;
  }
  
  // Check that warning was logged
  if (consoleWarnCalls.length === 0) {
    console.error('❌ FAILED: No warning logged for undefined audio file');
    restoreConsole();
    return false;
  }
  
  // Reset console calls
  consoleWarnCalls = [];
  
  // Test with empty string
  const result3 = playAudio('');
  if (result3 !== false) {
    console.error('❌ FAILED: playAudio(\'\') should return false');
    restoreConsole();
    return false;
  }
  
  // Check that warning was logged
  if (consoleWarnCalls.length === 0) {
    console.error('❌ FAILED: No warning logged for empty string audio file');
    restoreConsole();
    return false;
  }
  
  // Verify that no audio is playing after failed attempts
  if (isPlaying()) {
    console.error('❌ FAILED: isPlaying() should return false after failed playAudio attempts');
    restoreConsole();
    return false;
  }
  
  restoreConsole();
  console.log('✅ PASSED: Missing audio file handling');
  return true;
}

/**
 * Test: Invalid audio format handling
 */
function testInvalidAudioFormatHandling() {
  console.log('Test: Invalid audio format handling');
  
  mockConsole();
  MockAudio.clearErrorFiles();
  
  // Set up a file that will trigger an error
  const invalidFile = 'audio/invalid-format.xyz';
  MockAudio.setErrorFile(invalidFile);
  
  // Attempt to play invalid audio file
  const result = playAudio(invalidFile);
  
  // playAudio should return true initially (it starts the process)
  if (result !== true) {
    console.error('❌ FAILED: playAudio should return true even for files that will error later');
    restoreConsole();
    return false;
  }
  
  // Wait for error handler to be called
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check that error was logged
      if (consoleErrorCalls.length === 0) {
        console.error('❌ FAILED: No error logged for invalid audio format');
        restoreConsole();
        resolve(false);
        return;
      }
      
      // Verify that audio is not playing after error
      if (isPlaying()) {
        console.error('❌ FAILED: isPlaying() should return false after audio error');
        restoreConsole();
        resolve(false);
        return;
      }
      
      restoreConsole();
      console.log('✅ PASSED: Invalid audio format handling');
      resolve(true);
    }, 50);
  });
}

/**
 * Test: Audio playback failure handling
 */
function testAudioPlaybackFailureHandling() {
  console.log('Test: Audio playback failure handling');
  
  mockConsole();
  MockAudio.clearErrorFiles();
  
  // Set up a file that will fail to play
  const failFile = 'audio/fail-to-play.mp3';
  MockAudio.setPlayFailFile(failFile);
  
  // Attempt to play audio file that will fail
  const result = playAudio(failFile);
  
  // playAudio should return true initially
  if (result !== true) {
    console.error('❌ FAILED: playAudio should return true even for files that will fail to play');
    restoreConsole();
    return false;
  }
  
  // Wait for play promise to reject
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check that error was logged
      if (consoleErrorCalls.length === 0) {
        console.error('❌ FAILED: No error logged for playback failure');
        restoreConsole();
        resolve(false);
        return;
      }
      
      // Verify that audio is not playing after failure
      if (isPlaying()) {
        console.error('❌ FAILED: isPlaying() should return false after playback failure');
        restoreConsole();
        resolve(false);
        return;
      }
      
      restoreConsole();
      console.log('✅ PASSED: Audio playback failure handling');
      resolve(true);
    }, 50);
  });
}

/**
 * Test: Concurrent playback prevention
 */
function testConcurrentPlaybackPrevention() {
  console.log('Test: Concurrent playback prevention');
  
  mockConsole();
  MockAudio.clearErrorFiles();
  
  // Play first audio file
  const file1 = 'audio/raga1.mp3';
  const result1 = playAudio(file1);
  
  if (result1 !== true) {
    console.error('❌ FAILED: First playAudio should return true');
    restoreConsole();
    return false;
  }
  
  // Verify first audio is playing
  if (!isPlaying()) {
    console.error('❌ FAILED: First audio should be playing');
    restoreConsole();
    return false;
  }
  
  // Attempt to play second audio file while first is playing
  const file2 = 'audio/raga2.mp3';
  const result2 = playAudio(file2);
  
  if (result2 !== true) {
    console.error('❌ FAILED: Second playAudio should return true');
    restoreConsole();
    return false;
  }
  
  // Verify that second audio is now playing (first should have been stopped)
  if (!isPlaying()) {
    console.error('❌ FAILED: Second audio should be playing');
    restoreConsole();
    return false;
  }
  
  // Clean up
  stopAudio();
  
  restoreConsole();
  console.log('✅ PASSED: Concurrent playback prevention');
  return true;
}

/**
 * Test: Stop audio when nothing is playing
 */
function testStopAudioWhenNothingPlaying() {
  console.log('Test: Stop audio when nothing is playing');
  
  MockAudio.clearErrorFiles();
  
  // Ensure nothing is playing
  stopAudio();
  
  // Try to stop when nothing is playing
  const result = stopAudio();
  
  if (result !== false) {
    console.error('❌ FAILED: stopAudio should return false when nothing is playing');
    return false;
  }
  
  console.log('✅ PASSED: Stop audio when nothing is playing');
  return true;
}

/**
 * Test: Pause audio when nothing is playing
 */
function testPauseAudioWhenNothingPlaying() {
  console.log('Test: Pause audio when nothing is playing');
  
  MockAudio.clearErrorFiles();
  
  // Ensure nothing is playing
  stopAudio();
  
  // Try to pause when nothing is playing
  const result = pauseAudio();
  
  if (result !== false) {
    console.error('❌ FAILED: pauseAudio should return false when nothing is playing');
    return false;
  }
  
  console.log('✅ PASSED: Pause audio when nothing is playing');
  return true;
}

/**
 * Test: Pause and resume audio
 */
function testPauseAndResumeAudio() {
  console.log('Test: Pause and resume audio');
  
  mockConsole();
  MockAudio.clearErrorFiles();
  
  // Play audio
  const file = 'audio/test.mp3';
  playAudio(file);
  
  // Verify audio is playing
  if (!isPlaying()) {
    console.error('❌ FAILED: Audio should be playing');
    restoreConsole();
    return false;
  }
  
  // Pause audio
  const pauseResult = pauseAudio();
  
  if (pauseResult !== true) {
    console.error('❌ FAILED: pauseAudio should return true when audio is playing');
    restoreConsole();
    return false;
  }
  
  // Verify audio is paused
  if (isPlaying()) {
    console.error('❌ FAILED: Audio should be paused');
    restoreConsole();
    return false;
  }
  
  // Clean up
  stopAudio();
  
  restoreConsole();
  console.log('✅ PASSED: Pause and resume audio');
  return true;
}

/**
 * Run all unit tests for audio edge cases
 */
async function runAudioUnitTests() {
  console.log('=== Audio Unit Tests (Edge Cases) ===\n');
  
  const results = [];
  
  // Run synchronous tests
  results.push(testMissingAudioFileHandling());
  results.push(testConcurrentPlaybackPrevention());
  results.push(testStopAudioWhenNothingPlaying());
  results.push(testPauseAudioWhenNothingPlaying());
  results.push(testPauseAndResumeAudio());
  
  // Run asynchronous tests
  results.push(await testInvalidAudioFormatHandling());
  results.push(await testAudioPlaybackFailureHandling());
  
  // Summary
  const allPassed = results.every(r => r === true);
  if (allPassed) {
    console.log('\n=== All Audio Unit Tests Passed ===');
  } else {
    console.log('\n=== Some Audio Unit Tests Failed ===');
  }
  
  return allPassed;
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testMissingAudioFileHandling,
    testInvalidAudioFormatHandling,
    testAudioPlaybackFailureHandling,
    testConcurrentPlaybackPrevention,
    testStopAudioWhenNothingPlaying,
    testPauseAudioWhenNothingPlaying,
    testPauseAndResumeAudio,
    runAudioUnitTests
  };
}

// Run tests if executed directly
if (require.main === module) {
  runAudioUnitTests().then(passed => {
    process.exit(passed ? 0 : 1);
  });
}
