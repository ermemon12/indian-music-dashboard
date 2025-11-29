/**
 * Property-Based Tests for Audio Player
 * Feature: indian-music-dashboard
 */

/**
 * Feature: indian-music-dashboard, Property 12: Audio player conditional rendering
 * Validates: Requirements 5.1
 * 
 * Property: For any raga with a non-null audioFile property, the detail view should include
 * an audio player element; for any raga with a null audioFile, the detail view should display
 * a "no audio available" message.
 */
function testAudioPlayerConditionalRendering() {
  // Property: Audio player presence depends on audioFile property
  const property = fc.property(
    ragaArbitrary(),
    (raga) => {
      // Create modal elements for testing
      const modal = document.createElement('div');
      modal.id = 'ragaDetailModal';
      modal.className = 'hidden';
      
      const modalContent = document.createElement('div');
      modalContent.id = 'modalContent';
      modal.appendChild(modalContent);
      
      // Temporarily add to document
      document.body.appendChild(modal);
      
      // Mock getRagaById to return our test raga
      const originalGetRagaById = window.getRagaById;
      window.getRagaById = (id) => (id === raga.id ? raga : null);
      
      try {
        // Show the raga detail
        showRagaDetail(raga.id);
        
        // Get the rendered HTML content
        const htmlContent = modalContent.innerHTML;
        
        if (raga.audioFile) {
          // If audioFile exists, should have audio player section
          const hasAudioPlayerSection = htmlContent.includes('audioPlayerSection') || 
                                        htmlContent.includes('playBtn') ||
                                        htmlContent.includes('Play');
          const noAudioMessage = htmlContent.includes('Audio sample not available');
          
          // Should have player, not "not available" message
          return hasAudioPlayerSection && !noAudioMessage;
        } else {
          // If no audioFile, should have "not available" message
          const hasAudioPlayerSection = htmlContent.includes('audioPlayerSection') || 
                                        htmlContent.includes('playBtn');
          const noAudioMessage = htmlContent.includes('Audio sample not available');
          
          // Should have message, not player
          return !hasAudioPlayerSection && noAudioMessage;
        }
      } finally {
        // Restore original function and clean up
        window.getRagaById = originalGetRagaById;
        document.body.removeChild(modal);
      }
    }
  );
  
  // Run the property test with 100 iterations
  const result = fc.check(property, { numRuns: 100 });
  
  return result;
}

/**
 * Feature: indian-music-dashboard, Property 13: Audio playback state management
 * Validates: Requirements 5.2, 5.3
 * 
 * Property: For any valid audio file, when playback is initiated, the audio player state
 * should transition to "playing" and pause/stop controls should become available.
 */
function testAudioPlaybackStateManagement() {
  // Property: Playing audio changes state and makes controls available
  const property = fc.property(
    fc.string({ minLength: 5, maxLength: 50 }).map(s => `audio/${s}.mp3`),
    (audioFile) => {
      // Stop any existing audio first
      if (typeof stopAudio === 'function') {
        stopAudio();
      }
      
      // Check initial state - should not be playing
      const initiallyPlaying = isPlaying();
      if (initiallyPlaying) {
        return false; // Should start in non-playing state
      }
      
      // Play the audio
      playAudio(audioFile);
      
      // Check that audio is now playing
      const nowPlaying = isPlaying();
      
      // Pause the audio
      const pauseResult = pauseAudio();
      
      // Check that audio is no longer playing after pause
      const afterPause = isPlaying();
      
      // Stop the audio to clean up
      stopAudio();
      
      // Check that audio is stopped
      const afterStop = isPlaying();
      
      // Verify the state transitions:
      // 1. Initially not playing
      // 2. After play, should be playing
      // 3. After pause, should not be playing
      // 4. After stop, should not be playing
      return !initiallyPlaying && nowPlaying && !afterPause && !afterStop;
    }
  );
  
  // Run the property test with 100 iterations
  const result = fc.check(property, { numRuns: 100 });
  
  return result;
}

/**
 * Feature: indian-music-dashboard, Property 14: Audio cleanup on navigation
 * Validates: Requirements 5.5
 * 
 * Property: For any currently playing audio, when the user navigates away from the raga
 * detail view, the audio playback should stop and the audio player should be reset.
 */
function testAudioCleanupOnNavigation() {
  // Property: Closing detail view stops audio playback
  const property = fc.property(
    ragaArbitrary().filter(r => r.audioFile !== null),
    (raga) => {
      // Create modal elements for testing
      const modal = document.createElement('div');
      modal.id = 'ragaDetailModal';
      modal.className = 'hidden';
      
      const modalContent = document.createElement('div');
      modalContent.id = 'modalContent';
      modal.appendChild(modalContent);
      
      // Temporarily add to document
      document.body.appendChild(modal);
      
      // Mock getRagaById to return our test raga
      const originalGetRagaById = window.getRagaById;
      window.getRagaById = (id) => (id === raga.id ? raga : null);
      
      try {
        // Stop any existing audio first
        if (typeof stopAudio === 'function') {
          stopAudio();
        }
        
        // Show the raga detail
        showRagaDetail(raga.id);
        
        // Start playing audio
        playAudio(raga.audioFile);
        
        // Verify audio is playing
        const playingBeforeClose = isPlaying();
        
        // Hide the raga detail (navigate away)
        hideRagaDetail();
        
        // Check that audio has stopped
        const playingAfterClose = isPlaying();
        
        // Audio should be playing before close, but not after
        return playingBeforeClose && !playingAfterClose;
      } finally {
        // Restore original function and clean up
        window.getRagaById = originalGetRagaById;
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
        // Ensure audio is stopped
        if (typeof stopAudio === 'function') {
          stopAudio();
        }
      }
    }
  );
  
  // Run the property test with 100 iterations
  const result = fc.check(property, { numRuns: 100 });
  
  return result;
}

/**
 * Run all audio property tests
 */
function runAudioPropertyTests() {
  console.log('=== Audio Player Property Tests ===\n');
  
  // Test 1: Audio player conditional rendering
  console.log('Running Property Test: Audio player conditional rendering');
  const result1 = testAudioPlayerConditionalRendering();
  
  if (result1.failed) {
    console.error('❌ FAILED: Audio player conditional rendering');
    console.error('Counterexample:', result1.counterexample);
    return false;
  } else {
    console.log('✅ PASSED: Audio player conditional rendering (100 runs)');
  }
  
  // Test 2: Audio playback state management
  console.log('Running Property Test: Audio playback state management');
  const result2 = testAudioPlaybackStateManagement();
  
  if (result2.failed) {
    console.error('❌ FAILED: Audio playback state management');
    console.error('Counterexample:', result2.counterexample);
    return false;
  } else {
    console.log('✅ PASSED: Audio playback state management (100 runs)');
  }
  
  // Test 3: Audio cleanup on navigation
  console.log('Running Property Test: Audio cleanup on navigation');
  const result3 = testAudioCleanupOnNavigation();
  
  if (result3.failed) {
    console.error('❌ FAILED: Audio cleanup on navigation');
    console.error('Counterexample:', result3.counterexample);
    return false;
  } else {
    console.log('✅ PASSED: Audio cleanup on navigation (100 runs)');
  }
  
  console.log('\n=== All Audio Property Tests Passed ===');
  return true;
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testAudioPlayerConditionalRendering,
    testAudioPlaybackStateManagement,
    testAudioCleanupOnNavigation,
    runAudioPropertyTests
  };
}
