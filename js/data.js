/**
 * Raga Data Model
 * Manages the collection of ragas and provides access methods
 */

// Raga dataset with variety of thaats and times of day
const ragaData = [
  {
    id: "yaman",
    name: "Yaman",
    thaat: "Kalyan",
    timeOfDay: "Evening",
    aroha: "Ni Re Ga Ma# Dha Ni Sa'",
    avaroha: "Sa' Ni Dha Ma# Ga Re Sa",
    mood: "Devotional, romantic, serene",
    characteristics: "Teevra Madhyam (sharp 4th) is the defining note. Very popular evening raga.",
    audioFile: null
  },
  {
    id: "bhairav",
    name: "Bhairav",
    thaat: "Bhairav",
    timeOfDay: "Morning",
    aroha: "Sa re Ga Ma Pa dha Ni Sa'",
    avaroha: "Sa' Ni dha Pa Ma Ga re Sa",
    mood: "Serious, devotional, majestic",
    characteristics: "Komal Re and Komal Dha create a solemn atmosphere. Traditional morning raga.",
    audioFile: null
  },
  {
    id: "bilawal",
    name: "Bilawal",
    thaat: "Bilawal",
    timeOfDay: "Morning",
    aroha: "Sa Re Ga Ma Pa Dha Ni Sa'",
    avaroha: "Sa' Ni Dha Pa Ma Ga Re Sa",
    mood: "Bright, cheerful, optimistic",
    characteristics: "Equivalent to Western major scale. Pure and simple structure.",
    audioFile: null
  },
  {
    id: "kafi",
    name: "Kafi",
    thaat: "Kafi",
    timeOfDay: "Night",
    aroha: "Sa Re ga Ma Pa Dha ni Sa'",
    avaroha: "Sa' ni Dha Pa Ma ga Re Sa",
    mood: "Light, playful, folk-like",
    characteristics: "Komal Ga and Komal Ni. Often used in semi-classical and folk music.",
    audioFile: null
  },
  {
    id: "todi",
    name: "Todi",
    thaat: "Todi",
    timeOfDay: "Late Night",
    aroha: "Sa re ga Ma# Pa dha Ni Sa'",
    avaroha: "Sa' Ni dha Pa Ma# ga re Sa",
    mood: "Melancholic, intense, devotional",
    characteristics: "Complex raga with komal Re, komal Ga, teevra Ma, and komal Dha.",
    audioFile: null
  },
  {
    id: "marwa",
    name: "Marwa",
    thaat: "Marwa",
    timeOfDay: "Evening",
    aroha: "re ga Ma# Dha Ni Sa'",
    avaroha: "Sa' Ni Dha Ma# ga re",
    mood: "Romantic, longing, twilight",
    characteristics: "Omits Pa (5th). Teevra Ma and komal Re create unique color.",
    audioFile: null
  },
  {
    id: "purvi",
    name: "Purvi",
    thaat: "Purvi",
    timeOfDay: "Evening",
    aroha: "Sa re Ga Ma# Pa dha Ni Sa'",
    avaroha: "Sa' Ni dha Pa Ma# Ga re Sa",
    mood: "Mysterious, devotional, evening atmosphere",
    characteristics: "Komal Re, teevra Ma, and komal Dha. Sunset raga.",
    audioFile: null
  },
  {
    id: "bhairavi",
    name: "Bhairavi",
    thaat: "Bhairavi",
    timeOfDay: "Morning",
    aroha: "Sa re ga Ma Pa dha ni Sa'",
    avaroha: "Sa' ni dha Pa Ma ga re Sa",
    mood: "Devotional, compassionate, concluding",
    characteristics: "All komal notes except Sa, Ma, Pa. Often performed at end of concerts.",
    audioFile: null
  },
  {
    id: "asavari",
    name: "Asavari",
    thaat: "Asavari",
    timeOfDay: "Morning",
    aroha: "Sa Re ga Ma Pa dha ni Sa'",
    avaroha: "Sa' ni dha Pa Ma ga Re Sa",
    mood: "Serious, devotional, morning solemnity",
    characteristics: "Komal Ga, komal Dha, komal Ni. Deep and contemplative.",
    audioFile: null
  },
  {
    id: "desh",
    name: "Desh",
    thaat: "Kafi",
    timeOfDay: "Night",
    aroha: "Sa Re Ma Pa Ni Sa'",
    avaroha: "Sa' Ni Dha Pa Ma ga Re Sa",
    mood: "Patriotic, monsoon, romantic",
    characteristics: "Associated with monsoon season. Omits Ga in aroha.",
    audioFile: null
  },
  {
    id: "bageshri",
    name: "Bageshri",
    thaat: "Kafi",
    timeOfDay: "Night",
    aroha: "Sa ga Ma Dha Ni Sa'",
    avaroha: "Sa' Ni Dha Ma ga Re Sa",
    mood: "Romantic, longing, night beauty",
    characteristics: "Komal Ga. Very popular night raga with romantic character.",
    audioFile: null
  },
  {
    id: "malkauns",
    name: "Malkauns",
    thaat: "Bhairavi",
    timeOfDay: "Late Night",
    aroha: "Sa ga Ma dha ni Sa'",
    avaroha: "Sa' ni dha Ma ga Sa",
    mood: "Deep, serious, meditative",
    characteristics: "Pentatonic raga omitting Re and Pa. Very ancient raga.",
    audioFile: null
  },
  {
    id: "bhoopali",
    name: "Bhoopali",
    thaat: "Kalyan",
    timeOfDay: "Evening",
    aroha: "Sa Re Ga Pa Dha Sa'",
    avaroha: "Sa' Dha Pa Ga Re Sa",
    mood: "Peaceful, serene, simple beauty",
    characteristics: "Pentatonic raga omitting Ma and Ni. Very popular and accessible.",
    audioFile: null
  },
  {
    id: "durga",
    name: "Durga",
    thaat: "Bilawal",
    timeOfDay: "Evening",
    aroha: "Sa Re Ma Pa Ni Sa'",
    avaroha: "Sa' Ni Pa Ma Re Sa",
    mood: "Devotional, powerful, evening worship",
    characteristics: "Pentatonic raga omitting Ga and Dha. Associated with Goddess Durga.",
    audioFile: null
  },
  {
    id: "jaunpuri",
    name: "Jaunpuri",
    thaat: "Asavari",
    timeOfDay: "Afternoon",
    aroha: "Sa Re ga Ma Pa dha ni Sa'",
    avaroha: "Sa' ni dha Pa Ma ga Re Sa",
    mood: "Serious, contemplative, afternoon gravity",
    characteristics: "Similar to Asavari but with different emphasis. Afternoon raga.",
    audioFile: null
  },
  {
    id: "multani",
    name: "Multani",
    thaat: "Todi",
    timeOfDay: "Afternoon",
    aroha: "Sa re ga Ma# Ni Sa'",
    avaroha: "Sa' Ni dha Pa Ma# ga re Sa",
    mood: "Intense, afternoon heat, devotional",
    characteristics: "Omits Pa in aroha. Teevra Ma and komal notes create intensity.",
    audioFile: null
  },
  {
    id: "kedar",
    name: "Kedar",
    thaat: "Kalyan",
    timeOfDay: "Night",
    aroha: "Sa Ma Pa Ni Sa'",
    avaroha: "Sa' Ni Dha Pa Ma Ga Re Sa",
    mood: "Devotional, romantic, night serenity",
    characteristics: "Omits Re and Ga in aroha. Associated with Lord Shiva.",
    audioFile: null
  },
  {
    id: "ahir-bhairav",
    name: "Ahir Bhairav",
    thaat: "Bhairav",
    timeOfDay: "Morning",
    aroha: "Sa re Ga Ma Pa Dha Ni Sa'",
    avaroha: "Sa' Ni Dha Pa Ma Ga re Sa",
    mood: "Devotional, morning freshness, optimistic",
    characteristics: "Komal Re with shuddha Ga creates unique morning character.",
    audioFile: null
  },
  {
    id: "darbari-kanada",
    name: "Darbari Kanada",
    thaat: "Asavari",
    timeOfDay: "Late Night",
    aroha: "Sa Re ga Ma Pa dha ni Sa'",
    avaroha: "Sa' ni dha Pa Ma ga Re Sa",
    mood: "Serious, majestic, royal, meditative",
    characteristics: "Very slow and serious. Associated with royal courts. Deep komal Ga.",
    audioFile: null
  },
  {
    id: "shree",
    name: "Shree",
    thaat: "Purvi",
    timeOfDay: "Evening",
    aroha: "Sa re Ga Ma# Dha Ni Sa'",
    avaroha: "Sa' Ni Dha Pa Ma# Ga re Sa",
    mood: "Devotional, evening worship, majestic",
    characteristics: "Komal Re and teevra Ma. Associated with Goddess Lakshmi.",
    audioFile: null
  }
];

/**
 * Get all ragas in the dataset
 * @returns {Array} Array of all raga objects
 */
function getAllRagas() {
  try {
    if (!ragaData || !Array.isArray(ragaData)) {
      console.error('Raga data is not properly initialized');
      return [];
    }
    return [...ragaData];
  } catch (error) {
    console.error('Error getting all ragas:', error);
    return [];
  }
}

/**
 * Get a specific raga by its ID
 * @param {string} id - The unique identifier of the raga
 * @returns {Object|null} The raga object or null if not found
 */
function getRagaById(id) {
  try {
    if (!id || typeof id !== 'string') {
      console.warn('Invalid raga ID provided:', id);
      return null;
    }
    
    if (!ragaData || !Array.isArray(ragaData)) {
      console.error('Raga data is not properly initialized');
      return null;
    }
    
    const raga = ragaData.find(raga => raga && raga.id === id);
    
    if (!raga) {
      console.warn(`Raga with ID "${id}" not found`);
    }
    
    return raga || null;
  } catch (error) {
    console.error('Error getting raga by ID:', error);
    return null;
  }
}

/**
 * Get list of all unique thaats in the dataset
 * @returns {Array} Array of unique thaat names
 */
function getThaats() {
  try {
    if (!ragaData || !Array.isArray(ragaData)) {
      console.error('Raga data is not properly initialized');
      return [];
    }
    
    const thaats = new Set(
      ragaData
        .filter(raga => raga && raga.thaat)
        .map(raga => raga.thaat)
    );
    
    return Array.from(thaats).sort();
  } catch (error) {
    console.error('Error getting thaats:', error);
    return [];
  }
}

/**
 * Get list of all unique times of day in the dataset
 * @returns {Array} Array of unique time periods
 */
function getTimesOfDay() {
  try {
    if (!ragaData || !Array.isArray(ragaData)) {
      console.error('Raga data is not properly initialized');
      return [];
    }
    
    const times = new Set(
      ragaData
        .filter(raga => raga && raga.timeOfDay)
        .map(raga => raga.timeOfDay)
    );
    
    return Array.from(times).sort();
  } catch (error) {
    console.error('Error getting times of day:', error);
    return [];
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getAllRagas,
    getRagaById,
    getThaats,
    getTimesOfDay
  };
}
