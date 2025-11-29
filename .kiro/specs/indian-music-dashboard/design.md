# Design Document: Indian Music Dashboard

## Overview

The Indian Music Dashboard is a single-page web application built with vanilla JavaScript, HTML5, and CSS3. The application follows a component-based architecture with clear separation between data management, UI rendering, and user interaction handling. The system uses a JSON-based data structure to store raga information and implements client-side filtering, searching, and detail views without requiring a backend server.

The application prioritizes simplicity, performance, and maintainability while providing an engaging user experience for exploring Indian classical music.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User Interface                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ Filter Panel │  │  Search Bar  │  │ Raga List │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│  ┌──────────────────────────────────────────────┐  │
│  │           Raga Detail View                    │  │
│  │  (Modal/Overlay with audio player)            │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              Application Logic Layer                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ Filter Logic │  │ Search Logic │  │ UI Manager│ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                   Data Layer                         │
│  ┌──────────────────────────────────────────────┐  │
│  │         Raga Data Store (JSON)                │  │
│  │  - Raga definitions                           │  │
│  │  - Thaat classifications                      │  │
│  │  - Audio file references                      │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Technology Stack

- **HTML5**: Semantic markup for structure
- **CSS3**: Styling with Flexbox/Grid for responsive layout
- **Vanilla JavaScript (ES6+)**: Application logic without frameworks
- **Tailwind CSS (CDN)**: Utility-first CSS framework for rapid UI development
- **HTML5 Audio API**: For audio playback functionality

### Design Principles

1. **Separation of Concerns**: Data, presentation, and logic are clearly separated
2. **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with interactivity
3. **Mobile-First**: Responsive design starting from mobile viewport
4. **Performance**: Minimal dependencies, efficient DOM manipulation
5. **Maintainability**: Clear code structure, consistent naming, comprehensive comments

## Components and Interfaces

### 1. Data Model Module (`data.js`)

Manages the raga data structure and provides access methods.

```javascript
// Raga data structure
const ragaData = [
  {
    id: "yaman",
    name: "Yaman",
    thaat: "Kalyan",
    timeOfDay: "Evening",
    aroha: "Ni Re Ga Ma# Dha Ni Sa'",
    avaroha: "Sa' Ni Dha Ma# Ga Re Sa",
    mood: "Devotional, romantic",
    characteristics: "Teevra Madhyam is the defining note",
    audioFile: "audio/yaman.mp3" // optional
  },
  // ... more ragas
];

// Interface methods
function getAllRagas()
function getRagaById(id)
function getThaats()
function getTimesOfDay()
```

### 2. Filter Module (`filter.js`)

Handles filtering logic for ragas based on thaat and time of day.

```javascript
// Filter state
const filterState = {
  thaat: null,
  timeOfDay: null
};

// Interface methods
function applyFilters(ragas, filters)
function setThaatFilter(thaat)
function setTimeFilter(time)
function clearFilters()
function getActiveFilters()
```

### 3. Search Module (`search.js`)

Implements search functionality with case-insensitive matching.

```javascript
// Interface methods
function searchRagas(ragas, searchTerm)
function highlightMatch(text, searchTerm)
function normalizeSearchTerm(term)
```

### 4. UI Manager Module (`ui.js`)

Manages DOM manipulation and rendering.

```javascript
// Interface methods
function renderRagaList(ragas)
function renderRagaCard(raga)
function showRagaDetail(ragaId)
function hideRagaDetail()
function updateFilterUI(filters)
function showNoResults()
function initializeUI()
```

### 5. Audio Player Module (`audio.js`)

Handles audio playback functionality.

```javascript
// Audio player state
let currentAudio = null;

// Interface methods
function playAudio(audioFile)
function pauseAudio()
function stopAudio()
function isPlaying()
```

### 6. Main Application Controller (`app.js`)

Coordinates all modules and handles user interactions.

```javascript
// Application initialization
function init()
function setupEventListeners()
function handleFilterChange(event)
function handleSearchInput(event)
function handleRagaClick(ragaId)
function updateDisplay()
```

## Data Models

### Raga Object

```javascript
{
  id: string,              // Unique identifier (lowercase, hyphenated)
  name: string,            // Display name
  thaat: string,           // Parent thaat classification
  timeOfDay: string,       // "Morning" | "Afternoon" | "Evening" | "Night" | "Late Night"
  aroha: string,           // Ascending note pattern
  avaroha: string,         // Descending note pattern
  mood: string,            // Emotional character
  characteristics: string, // Distinctive features
  audioFile: string?       // Optional path to audio sample
}
```

### Filter State

```javascript
{
  thaat: string | null,      // Selected thaat or null for all
  timeOfDay: string | null   // Selected time or null for all
}
```

### Application State

```javascript
{
  allRagas: Raga[],          // Complete raga dataset
  filteredRagas: Raga[],     // After applying filters
  displayedRagas: Raga[],    // After applying search
  searchTerm: string,        // Current search text
  filters: FilterState,      // Active filters
  selectedRaga: string | null // Currently viewed raga ID
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, I've identified the following redundancies:

- **Property 1.3 and 4.2 are redundant**: Both test that raga detail views contain required fields. Property 1.3 is more comprehensive and will be kept.
- **Properties can be consolidated**: Several properties test similar filtering/searching behavior and can be combined into more comprehensive properties.

The following properties provide unique validation value:

**Property 1**: Raga list rendering completeness (validates 1.2)
**Property 2**: Raga detail view completeness (validates 1.3, 4.1, 4.2)
**Property 3**: Alphabetical ordering (validates 1.4)
**Property 4**: Thaat filtering correctness (validates 2.1)
**Property 5**: Time filtering correctness (validates 2.2)
**Property 6**: Combined filter correctness (validates 2.3)
**Property 7**: Filter clear round-trip (validates 2.4)
**Property 8**: Search substring matching (validates 3.1)
**Property 9**: Case-insensitive search (validates 3.3)
**Property 10**: Search highlighting (validates 3.4)
**Property 11**: Detail view state preservation (validates 4.4, 4.5)
**Property 12**: Audio player presence (validates 5.1)
**Property 13**: Audio playback control (validates 5.2, 5.3)
**Property 14**: Audio cleanup on navigation (validates 5.5)

### Correctness Properties

**Property 1: Raga list rendering completeness**

*For any* raga in the dataset, when rendered in the list view, the output HTML should contain the raga's name, thaat classification, and time of day.

**Validates: Requirements 1.2**

---

**Property 2: Raga detail view completeness**

*For any* raga in the dataset, when the detail view is rendered, the output should include aroha, avaroha, thaat, time of day, mood, and characteristic phrases.

**Validates: Requirements 1.3, 4.1, 4.2**

---

**Property 3: Alphabetical ordering invariant**

*For any* list of ragas, when sorted by the default sorting function, the resulting list should be in alphabetical order by raga name.

**Validates: Requirements 1.4**

---

**Property 4: Thaat filtering correctness**

*For any* thaat value and any raga dataset, applying the thaat filter should return only ragas where the thaat property matches the filter value.

**Validates: Requirements 2.1**

---

**Property 5: Time filtering correctness**

*For any* time-of-day value and any raga dataset, applying the time filter should return only ragas where the timeOfDay property matches the filter value.

**Validates: Requirements 2.2**

---

**Property 6: Combined filter correctness**

*For any* combination of thaat and time-of-day filters and any raga dataset, the filtered results should satisfy all active filter criteria simultaneously.

**Validates: Requirements 2.3**

---

**Property 7: Filter clear round-trip**

*For any* raga dataset and any combination of applied filters, clearing all filters should restore the complete original dataset.

**Validates: Requirements 2.4**

---

**Property 8: Search substring matching**

*For any* search term and any raga dataset, the search results should include only ragas whose names contain the search term as a substring.

**Validates: Requirements 3.1**

---

**Property 9: Case-insensitive search equivalence**

*For any* search term, searching with different case variations (uppercase, lowercase, mixed) should return identical result sets.

**Validates: Requirements 3.3**

---

**Property 10: Search highlighting presence**

*For any* search term and any matching raga name, the rendered search result should contain HTML markup that highlights the matching substring.

**Validates: Requirements 3.4**

---

**Property 11: Detail view state preservation**

*For any* active filter and search state, opening and then closing a raga detail view should preserve the filter and search state unchanged.

**Validates: Requirements 4.4, 4.5**

---

**Property 12: Audio player conditional rendering**

*For any* raga with a non-null audioFile property, the detail view should include an audio player element; for any raga with a null audioFile, the detail view should display a "no audio available" message.

**Validates: Requirements 5.1**

---

**Property 13: Audio playback state management**

*For any* valid audio file, when playback is initiated, the audio player state should transition to "playing" and pause/stop controls should become available.

**Validates: Requirements 5.2, 5.3**

---

**Property 14: Audio cleanup on navigation**

*For any* currently playing audio, when the user navigates away from the raga detail view, the audio playback should stop and the audio player should be reset.

**Validates: Requirements 5.5**

## Error Handling

### Input Validation

- **Empty Search Terms**: Treat as "show all" rather than error
- **Invalid Filter Values**: Ignore and use default (show all)
- **Missing Raga Data**: Display placeholder message in detail view
- **Malformed Raga Objects**: Skip during rendering, log warning to console

### Audio Errors

- **File Not Found**: Display "Audio unavailable" message
- **Playback Failure**: Show error message, allow retry
- **Unsupported Format**: Detect and inform user of browser limitation
- **Network Errors**: Provide retry option with clear feedback

### UI Error States

- **No Search Results**: Display friendly "No ragas found" message with suggestion to clear filters
- **Failed Rendering**: Catch and log errors, display fallback UI
- **State Corruption**: Implement state reset function accessible via UI

### Error Recovery

- All errors should be caught and handled gracefully without crashing the application
- User should always have a path to recover (clear filters, reset search, close modal)
- Console logging for debugging while maintaining clean user experience

## Testing Strategy

The Indian Music Dashboard will employ a dual testing approach combining unit tests and property-based tests to ensure comprehensive coverage and correctness.

### Unit Testing

Unit tests will verify specific examples, edge cases, and integration points:

- **Data Loading**: Verify raga data structure is valid and accessible
- **Filter Edge Cases**: Test empty datasets, single-item lists, no matches
- **Search Edge Cases**: Test empty strings, special characters, very long terms
- **UI Integration**: Test that event handlers are properly attached
- **Audio Edge Cases**: Test missing files, invalid formats, concurrent playback attempts

**Framework**: Jest or Vitest for JavaScript unit testing

**Example Unit Tests**:
- Test that searching for a non-existent raga returns empty array
- Test that filtering with no active filters returns full dataset
- Test that audio player stops when switching between ragas

### Property-Based Testing

Property-based tests will verify universal properties across all inputs using randomized test data:

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Each property test should run a minimum of 100 iterations to ensure thorough coverage of the input space.

**Test Tagging**: Each property-based test MUST include a comment tag in this exact format:
```javascript
// Feature: indian-music-dashboard, Property {number}: {property description}
```

**Property Test Coverage**:
- Each correctness property listed above will be implemented as a single property-based test
- Tests will generate random raga datasets, filter combinations, and search terms
- Generators will create valid raga objects with varied thaats, times, and names
- Edge cases (empty strings, null values) will be included in generator output

**Example Property Tests**:
- Property 4: Generate random thaat values and raga datasets, verify filtering returns only matching ragas
- Property 7: Generate random filter combinations, apply then clear, verify original dataset restored
- Property 9: Generate random search terms with case variations, verify identical results

### Test Organization

```
tests/
├── unit/
│   ├── data.test.js
│   ├── filter.test.js
│   ├── search.test.js
│   ├── ui.test.js
│   └── audio.test.js
├── properties/
│   ├── rendering.property.test.js
│   ├── filtering.property.test.js
│   ├── searching.property.test.js
│   ├── state.property.test.js
│   └── audio.property.test.js
└── helpers/
    └── generators.js  // fast-check generators for test data
```

### Testing Principles

- **Implementation-First**: Implement features before writing corresponding tests
- **Complementary Coverage**: Unit tests catch specific bugs, property tests verify general correctness
- **Minimal Mocking**: Test real functionality without mocks where possible
- **Fast Execution**: All tests should complete in under 10 seconds
- **Clear Failures**: Test failures should clearly indicate what property was violated

## Implementation Notes

### File Structure

```
indian-music-dashboard/
├── index.html
├── styles.css
├── js/
│   ├── data.js
│   ├── filter.js
│   ├── search.js
│   ├── ui.js
│   ├── audio.js
│   └── app.js
├── audio/
│   └── [audio samples]
├── tests/
│   └── [test files]
└── README.md
```

### Responsive Breakpoints

- **Mobile**: < 768px (single column, stacked filters)
- **Tablet**: 768px - 1024px (two columns, side filters)
- **Desktop**: > 1024px (three columns, persistent filters)

### Performance Considerations

- Use event delegation for raga list clicks
- Debounce search input (300ms delay)
- Lazy load audio files only when detail view opens
- Cache filtered results to avoid redundant computation
- Use CSS transforms for smooth animations

### Accessibility

- Semantic HTML5 elements (nav, main, article, section)
- ARIA labels for interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Focus management for modal detail view
- Alt text for any images or icons
- Sufficient color contrast (WCAG AA compliance)

### Browser Compatibility

- Target: Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features: Use Babel if broader support needed
- Audio: MP3 format for widest compatibility
- CSS: Flexbox and Grid with fallbacks
- No IE11 support required

## Future Enhancements

Potential features for future iterations:

- **Tala Information**: Add rhythmic cycle data and examples
- **Artist Profiles**: Include information about classical musicians
- **Favorites**: Allow users to bookmark favorite ragas
- **Comparison View**: Side-by-side comparison of two ragas
- **Learning Mode**: Interactive exercises for identifying ragas
- **Playlist Creation**: Curated collections of ragas by mood or time
- **Social Sharing**: Share raga information on social media
- **Offline Support**: Progressive Web App with service worker
- **Multi-language**: Support for Hindi, Sanskrit transliteration
- **Advanced Search**: Search by swara patterns or characteristics
