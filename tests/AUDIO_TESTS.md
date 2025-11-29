# Audio Player Property Tests

This document describes the property-based tests for the audio player functionality.

## Overview

Three property-based tests have been implemented to validate the audio player functionality according to the design specification:

1. **Property 12: Audio player conditional rendering** (Validates Requirements 5.1)
2. **Property 13: Audio playback state management** (Validates Requirements 5.2, 5.3)
3. **Property 14: Audio cleanup on navigation** (Validates Requirements 5.5)

## Running the Tests

### Browser-Based Tests (Recommended)

Open `tests/test-audio.html` in a web browser to run all audio property tests with visual feedback.

The tests will:
- Run 100 iterations of each property test
- Display pass/fail status for each test
- Show counterexamples if any test fails
- Provide a summary of all test results

### Test Files

- `tests/properties/audio.property.test.js` - Property test implementations
- `tests/test-audio.html` - Browser-based test runner
- `tests/run-audio-tests.js` - Node.js test runner (requires JSDOM setup)

## Property Test Details

### Property 12: Audio Player Conditional Rendering

**Property Statement:**
For any raga with a non-null audioFile property, the detail view should include an audio player element; for any raga with a null audioFile, the detail view should display a "no audio available" message.

**Test Strategy:**
- Generates random raga objects with and without audio files
- Renders the detail view for each raga
- Verifies that audio player controls appear when audioFile is present
- Verifies that "not available" message appears when audioFile is null

**Validates:** Requirements 5.1

### Property 13: Audio Playback State Management

**Property Statement:**
For any valid audio file, when playback is initiated, the audio player state should transition to "playing" and pause/stop controls should become available.

**Test Strategy:**
- Generates random audio file paths
- Tests state transitions: not playing → playing → paused → stopped
- Verifies isPlaying() returns correct state at each transition
- Ensures pause and stop functions work correctly

**Validates:** Requirements 5.2, 5.3

### Property 14: Audio Cleanup on Navigation

**Property Statement:**
For any currently playing audio, when the user navigates away from the raga detail view, the audio playback should stop and the audio player should be reset.

**Test Strategy:**
- Generates random ragas with audio files
- Opens detail view and starts audio playback
- Verifies audio is playing
- Closes detail view (simulates navigation)
- Verifies audio has stopped

**Validates:** Requirements 5.5

## Implementation Details

### Audio Module (`js/audio.js`)

The audio module provides the following functions:

- `playAudio(audioFile)` - Starts playback of an audio file
- `pauseAudio()` - Pauses current audio playback
- `stopAudio()` - Stops and resets audio playback
- `isPlaying()` - Returns true if audio is currently playing

### UI Integration (`js/ui.js`)

The UI module has been updated to:

- Render audio player controls (Play, Pause, Stop buttons) when audioFile is present
- Display "Audio sample not available" message when audioFile is null
- Call `stopAudio()` when closing the detail view to ensure cleanup

### HTML Integration (`index.html`)

The `audio.js` script has been added to the HTML file to ensure the audio module is loaded before the UI module.

## Verification

Run the verification script to check that all audio functionality is properly implemented:

```bash
node tests/verify-audio-implementation.js
```

This will check:
- All required functions are implemented
- Audio state management is in place
- UI integration is complete
- HTML includes the audio script

## Expected Results

All three property tests should pass with 100 iterations each, demonstrating that:

1. Audio player controls are conditionally rendered based on audio file availability
2. Audio playback state is properly managed through play/pause/stop operations
3. Audio is properly cleaned up when navigating away from the detail view

## Troubleshooting

If tests fail:

1. Check browser console for error messages
2. Verify that all audio functions are properly exported
3. Ensure the audio.js script is loaded before ui.js in index.html
4. Check that the Audio API is supported in your browser
