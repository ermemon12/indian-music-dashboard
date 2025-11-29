/**
 * Audio Player Module
 * Handles audio playback functionality
 */

/**
 * Current audio player state
 */
let currentAudio = null;

/**
 * Play audio file
 * @param {string} audioFile - Path to audio file
 * @returns {Promise<boolean>} Promise that resolves to true if playback started successfully
 */
function playAudio(audioFile) {
  return new Promise((resolve, reject) => {
    if (!audioFile) {
      const error = new Error('No audio file provided');
      console.warn('Audio playback failed:', error.message);
      displayAudioError('No audio file available');
      reject(error);
      return;
    }
    
    // Stop any currently playing audio
    stopAudio();
    
    try {
      console.log(`Attempting to play audio: ${audioFile}`);
      
      // Create new audio element
      currentAudio = new Audio(audioFile);
      
      // Add error handler for loading/playback errors
      currentAudio.addEventListener('error', (e) => {
        let errorMessage = 'Audio playback failed';
        
        if (currentAudio && currentAudio.error) {
          switch (currentAudio.error.code) {
            case MediaError.MEDIA_ERR_ABORTED:
              errorMessage = 'Audio playback was aborted';
              break;
            case MediaError.MEDIA_ERR_NETWORK:
              errorMessage = 'Network error while loading audio';
              break;
            case MediaError.MEDIA_ERR_DECODE:
              errorMessage = 'Audio file format not supported';
              break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = 'Audio file not found or format not supported';
              break;
            default:
              errorMessage = 'Unknown audio error occurred';
          }
        }
        
        console.error('Audio error:', errorMessage, e);
        displayAudioError(errorMessage);
        currentAudio = null;
        reject(new Error(errorMessage));
      });
      
      // Add success handler
      currentAudio.addEventListener('canplay', () => {
        console.log('Audio loaded successfully');
      });
      
      // Play the audio
      const playPromise = currentAudio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio playback started successfully');
            resolve(true);
          })
          .catch(err => {
            let errorMessage = 'Failed to start audio playback';
            
            if (err.name === 'NotAllowedError') {
              errorMessage = 'Audio playback blocked. Please interact with the page first.';
            } else if (err.name === 'NotSupportedError') {
              errorMessage = 'Audio format not supported by your browser';
            }
            
            console.error('Audio play error:', errorMessage, err);
            displayAudioError(errorMessage);
            currentAudio = null;
            reject(err);
          });
      } else {
        resolve(true);
      }
    } catch (error) {
      console.error('Error creating audio player:', error);
      displayAudioError('Failed to initialize audio player');
      currentAudio = null;
      reject(error);
    }
  });
}

/**
 * Display an audio error message in the audio player section
 * @param {string} message - The error message to display
 */
function displayAudioError(message) {
  const audioSection = document.getElementById('audioPlayerSection');
  if (audioSection) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mt-2';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.innerHTML = `
      <span class="text-sm">${message}</span>
    `;
    
    // Remove any existing error messages
    const existingError = audioSection.querySelector('.bg-red-100');
    if (existingError) {
      existingError.remove();
    }
    
    audioSection.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }
}

/**
 * Pause current audio
 * @returns {boolean} True if audio was paused
 */
function pauseAudio() {
  try {
    if (currentAudio && !currentAudio.paused) {
      currentAudio.pause();
      console.log('Audio paused');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error pausing audio:', error);
    return false;
  }
}

/**
 * Stop current audio and reset
 * @returns {boolean} True if audio was stopped
 */
function stopAudio() {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
      console.log('Audio stopped');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error stopping audio:', error);
    // Force reset even if error occurs
    currentAudio = null;
    return false;
  }
}

/**
 * Check if audio is currently playing
 * @returns {boolean} True if audio is playing
 */
function isPlaying() {
  return currentAudio !== null && !currentAudio.paused;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    playAudio,
    pauseAudio,
    stopAudio,
    isPlaying,
    displayAudioError
  };
}
