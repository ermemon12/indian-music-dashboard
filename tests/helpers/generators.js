/**
 * Test Data Generators for Property-Based Testing
 * Uses fast-check to generate random test data
 */

/**
 * Generator for valid raga IDs (lowercase, hyphenated)
 */
const ragaIdArbitrary = () => {
  return fc.stringOf(
    fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-'),
    { minLength: 3, maxLength: 20 }
  ).filter(s => s.length > 0 && !s.startsWith('-') && !s.endsWith('-'));
};

/**
 * Generator for raga names
 * Excludes HTML special characters to match realistic raga names
 */
const ragaNameArbitrary = () => {
  return fc.string({ minLength: 3, maxLength: 30 })
    .filter(s => s.trim().length > 0)
    .filter(s => !s.includes('<') && !s.includes('>') && !s.includes('&'));
};

/**
 * Generator for thaat names
 */
const thaatArbitrary = () => {
  return fc.constantFrom(
    'Bilawal', 'Kalyan', 'Kafi', 'Bhairav', 'Purvi', 
    'Marwa', 'Todi', 'Asavari', 'Bhairavi', 'Khamaj'
  );
};

/**
 * Generator for time of day values
 */
const timeOfDayArbitrary = () => {
  return fc.constantFrom(
    'Morning', 'Afternoon', 'Evening', 'Night', 'Late Night'
  );
};

/**
 * Generator for swara patterns (aroha/avaroha)
 */
const swaraPatternArbitrary = () => {
  const swaras = ['Sa', 'Re', 're', 'Ga', 'ga', 'Ma', 'Ma#', 'Pa', 'Dha', 'dha', 'Ni', 'ni', "Sa'"];
  return fc.array(fc.constantFrom(...swaras), { minLength: 3, maxLength: 13 })
    .map(arr => arr.join(' '));
};

/**
 * Generator for mood descriptions
 */
const moodArbitrary = () => {
  return fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length > 0);
};

/**
 * Generator for characteristics descriptions
 */
const characteristicsArbitrary = () => {
  return fc.string({ minLength: 10, maxLength: 200 }).filter(s => s.trim().length > 0);
};

/**
 * Generator for audio file paths (optional)
 */
const audioFileArbitrary = () => {
  return fc.option(
    fc.string({ minLength: 5, maxLength: 50 }).map(s => `audio/${s}.mp3`),
    { nil: null }
  );
};

/**
 * Generator for complete raga objects with all required fields
 */
const ragaArbitrary = () => {
  return fc.record({
    id: ragaIdArbitrary(),
    name: ragaNameArbitrary(),
    thaat: thaatArbitrary(),
    timeOfDay: timeOfDayArbitrary(),
    aroha: swaraPatternArbitrary(),
    avaroha: swaraPatternArbitrary(),
    mood: moodArbitrary(),
    characteristics: characteristicsArbitrary(),
    audioFile: audioFileArbitrary()
  });
};

/**
 * Generator for arrays of raga objects
 */
const ragaArrayArbitrary = (minLength = 1, maxLength = 50) => {
  return fc.array(ragaArbitrary(), { minLength, maxLength });
};

// Export generators for use in tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ragaIdArbitrary,
    ragaNameArbitrary,
    thaatArbitrary,
    timeOfDayArbitrary,
    swaraPatternArbitrary,
    moodArbitrary,
    characteristicsArbitrary,
    audioFileArbitrary,
    ragaArbitrary,
    ragaArrayArbitrary
  };
}
