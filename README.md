# Indian Music Dashboard

An interactive web application for exploring and learning about Indian classical music, featuring ragas, thaats, and audio samples.

## Overview

The Indian Music Dashboard provides an intuitive interface to browse, search, and discover ragas (melodic frameworks) in Indian classical music. Users can filter by thaat (parent scale) and time of day, view detailed information about each raga, and listen to audio samples.

This application is built with vanilla JavaScript and requires no build tools or dependencies to run. Simply open `index.html` in a modern web browser to start exploring.

## Features

- **Browse Ragas**: View a comprehensive collection of 20+ ragas with their characteristics
- **Advanced Filtering**: Filter by thaat (parent scale) and time of day
- **Search Functionality**: Quick search by raga name with real-time highlighting
- **Detailed Views**: Explore aroha (ascending), avaroha (descending), mood, and characteristics of each raga
- **Audio Samples**: Listen to demonstrations of ragas (where available)
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Accessible**: Built with WCAG AA compliance and full keyboard navigation support
- **Performance Optimized**: Handles 100+ ragas smoothly with debounced search and event delegation

## Technology Stack

- **HTML5**: Semantic markup for structure and accessibility
- **CSS3**: Custom styles with Tailwind CSS (via CDN)
- **Vanilla JavaScript (ES6+)**: No framework dependencies, modular architecture
- **fast-check**: Property-based testing library for comprehensive test coverage

## Project Structure

```
indian-music-dashboard/
├── index.html              # Main HTML file with semantic structure
├── styles.css              # Custom CSS styles and responsive design
├── js/                     # JavaScript modules (ES6)
│   ├── app.js             # Main application controller and state management
│   ├── data.js            # Raga data model and access methods
│   ├── filter.js          # Filtering logic (thaat and time of day)
│   ├── search.js          # Search functionality with highlighting
│   ├── ui.js              # UI rendering and DOM manipulation
│   └── audio.js           # Audio playback controls
├── audio/                  # Audio sample files (MP3 format)
├── tests/                  # Comprehensive test suite
│   ├── unit/              # Unit tests for specific functionality
│   ├── properties/        # Property-based tests using fast-check
│   └── helpers/           # Test utilities and generators
├── package.json            # Project metadata and test scripts
└── README.md              # This file
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+)
- No build tools, Node.js, or npm installation required for running the application
- For development and testing: Node.js 14+ and npm (to run tests)

### Running the Application

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd indian-music-dashboard
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended for development):
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js http-server
     npx http-server
     ```
   - Navigate to `http://localhost:8000` in your browser

3. **Start exploring!**
   - Browse the raga collection
   - Use filters to narrow down by thaat or time of day
   - Search for specific ragas by name
   - Click on any raga card to view detailed information

### Development Setup

For running tests and development:

```bash
# Install development dependencies
npm install

# Run property-based tests
npm test

# Run performance tests
npm run test:performance
```

## How to Use

### Browsing Ragas

The main view displays all ragas as cards in a responsive grid. Each card shows:
- Raga name
- Thaat (parent scale) classification
- Time of day for performance
- Brief mood description

### Filtering

Use the filter panel on the left to narrow down ragas:
- **Thaat Filter**: Select a specific thaat (e.g., Kalyan, Bilawal, Bhairav)
- **Time Filter**: Select a time of day (Morning, Afternoon, Evening, Night, Late Night)
- Filters can be combined (AND logic)
- Click "Clear Filters" to reset

### Searching

Use the search bar at the top to find ragas by name:
- Type any part of a raga name
- Search is case-insensitive
- Results update in real-time (300ms debounce)
- Matching text is highlighted in results

### Viewing Details

Click on any raga card to open a detailed modal view showing:
- Full raga name and classification
- Aroha (ascending note pattern)
- Avaroha (descending note pattern)
- Mood and emotional character
- Distinctive characteristics
- Audio player (if audio sample is available)

Close the modal by:
- Clicking the "×" button
- Pressing the ESC key
- Clicking outside the modal

### Keyboard Navigation

The dashboard is fully keyboard accessible:
- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and open raga details
- **ESC**: Close modal dialogs
- Focus indicators show current position

### Screenshorts:

![WhatsApp Image 2025-11-29 at 21 57 50_0d54b341](https://github.com/user-attachments/assets/cd94789b-6708-4422-b377-efbdab0a3155)

![WhatsApp Image 2025-11-29 at 21 58 35_78a13dab](https://github.com/user-attachments/assets/e612878e-5e95-4052-882e-97aaac0bacc5)

![WhatsApp Image 2025-11-29 at 21 59 01_3bd6628a](https://github.com/user-attachments/assets/01797d3f-0ca8-484d-b02b-5f07801769e9)

## Adding New Ragas to the Dataset

To add new ragas to the collection, edit the `js/data.js` file:

### Raga Data Structure

Each raga object must have the following structure:

```javascript
{
  id: "unique-raga-id",           // Required: Unique identifier (lowercase, hyphenated)
  name: "Raga Name",               // Required: Display name
  thaat: "Thaat Name",             // Required: Parent thaat classification
  timeOfDay: "Time Period",        // Required: "Morning" | "Afternoon" | "Evening" | "Night" | "Late Night"
  aroha: "Sa Re Ga Ma Pa Dha Ni Sa'",  // Required: Ascending note pattern
  avaroha: "Sa' Ni Dha Pa Ma Ga Re Sa", // Required: Descending note pattern
  mood: "Emotional description",   // Required: Mood and character
  characteristics: "Distinctive features", // Required: Key characteristics
  audioFile: "audio/filename.mp3"  // Optional: Path to audio file (null if not available)
}
```

### Field Requirements

- **id**: Must be unique, lowercase, use hyphens for spaces (e.g., "ahir-bhairav")
- **name**: The proper name of the raga as it should be displayed
- **thaat**: One of the 10 thaats in Hindustani classical music
- **timeOfDay**: Must be one of: "Morning", "Afternoon", "Evening", "Night", "Late Night"
- **aroha**: Use swara notation (Sa, Re, Ga, Ma, Pa, Dha, Ni) with:
  - Lowercase for komal (flat) notes: re, ga, dha, ni
  - Ma# for teevra (sharp) Ma
  - Sa' for upper octave
- **avaroha**: Same notation as aroha
- **mood**: Brief description of emotional character
- **characteristics**: Key features that distinguish this raga
- **audioFile**: Path to MP3 file in the `audio/` directory, or `null` if not available

### Example: Adding a New Raga

1. Open `js/data.js`
2. Add a new object to the `ragaData` array:

```javascript
{
  id: "miyan-ki-todi",
  name: "Miyan Ki Todi",
  thaat: "Todi",
  timeOfDay: "Morning",
  aroha: "Sa re ga Ma# Pa dha Ni Sa'",
  avaroha: "Sa' Ni dha Pa Ma# ga re Sa",
  mood: "Devotional, serious, morning contemplation",
  characteristics: "Komal Re, komal Ga, teevra Ma, komal Dha. Very serious morning raga.",
  audioFile: null  // or "audio/miyan-ki-todi.mp3" if available
}
```

3. Save the file
4. Refresh the browser - the new raga will appear automatically
5. No code changes needed - the application dynamically loads all ragas

### Adding Audio Samples

To add audio samples for ragas:

1. Place MP3 files in the `audio/` directory
2. Update the `audioFile` property in the raga object:
   ```javascript
   audioFile: "audio/yaman.mp3"
   ```
3. Ensure the file path is correct relative to `index.html`
4. Recommended: Keep audio files under 5MB for faster loading

## API Documentation

### Data Module (`js/data.js`)

Manages the raga dataset and provides access methods.

#### `getAllRagas()`
Returns all ragas in the dataset.
- **Returns**: `Array<Object>` - Array of raga objects
- **Example**:
  ```javascript
  const ragas = getAllRagas();
  console.log(`Total ragas: ${ragas.length}`);
  ```

#### `getRagaById(id)`
Retrieves a specific raga by its unique identifier.
- **Parameters**: 
  - `id` (string) - The unique raga identifier
- **Returns**: `Object|null` - The raga object or null if not found
- **Example**:
  ```javascript
  const yaman = getRagaById("yaman");
  console.log(yaman.name); // "Yaman"
  ```

#### `getThaats()`
Returns a sorted list of all unique thaats in the dataset.
- **Returns**: `Array<string>` - Sorted array of thaat names
- **Example**:
  ```javascript
  const thaats = getThaats();
  // ["Asavari", "Bhairav", "Bhairavi", "Bilawal", ...]
  ```

#### `getTimesOfDay()`
Returns a sorted list of all unique time periods in the dataset.
- **Returns**: `Array<string>` - Sorted array of time periods
- **Example**:
  ```javascript
  const times = getTimesOfDay();
  // ["Afternoon", "Evening", "Late Night", "Morning", "Night"]
  ```

### Filter Module (`js/filter.js`)

Handles filtering logic for ragas.

#### `applyFilters(ragas, filters)`
Filters ragas based on thaat and time of day criteria.
- **Parameters**:
  - `ragas` (Array) - Array of raga objects to filter
  - `filters` (Object) - Filter criteria `{ thaat: string|null, timeOfDay: string|null }`
- **Returns**: `Array<Object>` - Filtered array of ragas
- **Logic**: Filters use AND logic (ragas must match all active filters)
- **Example**:
  ```javascript
  const filtered = applyFilters(allRagas, { 
    thaat: "Kalyan", 
    timeOfDay: "Evening" 
  });
  ```

#### `setThaatFilter(thaat)`
Sets the thaat filter.
- **Parameters**: `thaat` (string|null) - Thaat name or null to clear

#### `setTimeFilter(time)`
Sets the time of day filter.
- **Parameters**: `time` (string|null) - Time period or null to clear

#### `clearFilters()`
Clears all active filters.

#### `getActiveFilters()`
Returns the current filter state.
- **Returns**: `Object` - Current filters `{ thaat, timeOfDay }`

### Search Module (`js/search.js`)

Implements search functionality with highlighting.

#### `searchRagas(ragas, searchTerm)`
Searches ragas by name with case-insensitive substring matching.
- **Parameters**:
  - `ragas` (Array) - Array of raga objects to search
  - `searchTerm` (string) - Search query
- **Returns**: `Array<Object>` - Ragas whose names contain the search term
- **Example**:
  ```javascript
  const results = searchRagas(allRagas, "bhai");
  // Returns: Bhairav, Bhairavi, Ahir Bhairav
  ```

#### `highlightMatch(text, searchTerm)`
Wraps matching text with HTML markup for highlighting.
- **Parameters**:
  - `text` (string) - Text to highlight matches in
  - `searchTerm` (string) - Term to highlight
- **Returns**: `string` - HTML string with `<span class="highlight">` around matches
- **Example**:
  ```javascript
  const highlighted = highlightMatch("Bhairav", "bhai");
  // Returns: "<span class=\"highlight\">Bhai</span>rav"
  ```

#### `normalizeSearchTerm(term)`
Normalizes search terms for consistent processing.
- **Parameters**: `term` (string) - Search term to normalize
- **Returns**: `string` - Lowercase, trimmed search term

### UI Module (`js/ui.js`)

Manages DOM manipulation and rendering.

#### `initializeUI()`
Initializes the UI by populating filter dropdowns with available thaats and times.

#### `renderRagaList(ragas)`
Renders a list of ragas in the grid layout.
- **Parameters**: `ragas` (Array) - Array of raga objects to display
- **Behavior**: 
  - Sorts ragas alphabetically
  - Uses DocumentFragment for efficient DOM updates
  - Sets up event delegation for clicks
  - Shows "no results" message if array is empty

#### `renderRagaCard(raga)`
Creates an individual raga card HTML element.
- **Parameters**: `raga` (Object) - Raga object to render
- **Returns**: `HTMLElement|null` - The card element or null if invalid
- **Security**: Escapes HTML to prevent XSS attacks

#### `showRagaDetail(ragaId)`
Opens the modal with detailed raga information.
- **Parameters**: `ragaId` (string) - ID of the raga to display
- **Behavior**:
  - Loads raga data
  - Renders modal content
  - Sets up audio player if available
  - Manages focus for accessibility

#### `hideRagaDetail()`
Closes the raga detail modal.
- **Behavior**:
  - Stops any playing audio
  - Restores focus to trigger element
  - Clears modal content

#### `updateFilterUI(filters)`
Updates filter dropdown selections to match current state.
- **Parameters**: `filters` (Object) - Current filter state

#### `showNoResults()`
Displays a "no results found" message when no ragas match filters/search.

### Audio Module (`js/audio.js`)

Handles audio playback functionality.

#### `playAudio(audioFile)`
Plays an audio file.
- **Parameters**: `audioFile` (string) - Path to audio file
- **Returns**: `Promise<boolean>` - Resolves to true if playback started
- **Error Handling**: Displays user-friendly error messages for common issues
- **Example**:
  ```javascript
  playAudio("audio/yaman.mp3")
    .then(() => console.log("Playing"))
    .catch(err => console.error("Failed:", err));
  ```

#### `pauseAudio()`
Pauses the currently playing audio.
- **Returns**: `boolean` - True if audio was paused

#### `stopAudio()`
Stops and resets the current audio.
- **Returns**: `boolean` - True if audio was stopped

#### `isPlaying()`
Checks if audio is currently playing.
- **Returns**: `boolean` - True if audio is playing

### Application Module (`js/app.js`)

Main application controller that coordinates all modules.

#### `init()`
Initializes the application.
- **Behavior**:
  - Loads raga data
  - Validates data structure
  - Initializes UI
  - Sets up event listeners
  - Renders initial display

#### `updateDisplay()`
Updates the display based on current state.
- **Behavior**:
  - Applies filters
  - Applies search
  - Renders results

#### `resetState()`
Resets application to initial state (useful for error recovery).

## Browser Compatibility

### Supported Browsers

- **Chrome**: 90+ (April 2021)
- **Firefox**: 88+ (April 2021)
- **Safari**: 14+ (September 2020)
- **Edge**: 90+ (April 2021)

### Required Features

The application uses modern web standards:
- ES6+ JavaScript (modules, arrow functions, template literals, destructuring)
- HTML5 Audio API
- CSS Grid and Flexbox
- CSS Custom Properties (variables)

### Not Supported

- Internet Explorer (any version)
- Legacy browsers without ES6 support

## Accessibility Features

The dashboard is built with accessibility as a core principle:

### Keyboard Navigation

- **Tab**: Navigate between interactive elements
- **Shift+Tab**: Navigate backwards
- **Enter/Space**: Activate buttons and links
- **ESC**: Close modal dialogs
- **Focus indicators**: Visible outline on focused elements

### Screen Reader Support

- Semantic HTML5 elements (`<nav>`, `<main>`, `<article>`, `<section>`)
- ARIA labels and roles on all interactive elements
- ARIA live regions for dynamic content updates
- Descriptive alt text and labels
- Screen reader announcements for state changes

### Visual Accessibility

- WCAG AA color contrast compliance (4.5:1 minimum)
- Readable font sizes (16px base)
- Clear visual hierarchy
- Focus indicators with high contrast
- No reliance on color alone for information

### Motor Accessibility

- Large click targets (minimum 44×44px)
- No time-based interactions
- Keyboard alternatives for all mouse actions
- No hover-only content

## Performance Optimization

The application is optimized for smooth performance:

### Techniques Used

1. **Event Delegation**: Single event listener on container instead of individual listeners on each card
2. **Debouncing**: Search input debounced to 300ms to reduce unnecessary updates
3. **DocumentFragment**: Batch DOM updates to minimize reflows
4. **Efficient Filtering**: Early returns and optimized filter logic
5. **Lazy Loading**: Audio files loaded only when detail view opens
6. **CSS Transforms**: Hardware-accelerated animations

### Performance Targets

- Initial load: < 2 seconds on standard broadband
- Filter/search response: < 200ms
- Handles 100+ ragas without degradation
- Smooth 60fps animations

## Testing

The project includes comprehensive testing with both unit tests and property-based tests.

### Running Tests

```bash
# Install dependencies
npm install

# Run all property-based tests
npm test

# Run performance tests
npm run test:performance

# Open browser test runner
# Open tests/test-runner.html in your browser
```

### Test Structure

- **Unit Tests** (`tests/unit/`): Test specific functionality and edge cases
- **Property-Based Tests** (`tests/properties/`): Validate universal properties using fast-check
- **Test Helpers** (`tests/helpers/`): Generators and utilities for tests

### Property-Based Testing

The application uses fast-check for property-based testing, which validates that properties hold across randomly generated inputs:

- Each test runs 100+ iterations with random data
- Tests verify correctness properties from the design document
- Generators create valid raga objects with varied characteristics
- Edge cases (empty strings, null values) are automatically tested

See `tests/README.md` for detailed testing documentation.

## Error Handling

The application handles errors gracefully:

### User-Facing Errors

- **Audio Playback Failures**: Clear messages with retry options
- **Missing Data**: Placeholder content with helpful messages
- **Network Errors**: Informative error messages
- **Invalid Input**: Silently handled with fallback behavior

### Developer Errors

- Console logging for debugging
- Try-catch blocks around critical operations
- State validation and recovery mechanisms
- Detailed error messages in console

### Recovery Mechanisms

- **Reset State Button**: Clears all state and returns to initial view
- **Auto-recovery**: Application attempts to recover from errors automatically
- **Graceful Degradation**: Core functionality works even if some features fail

## Project Architecture

### Design Principles

1. **Separation of Concerns**: Data, presentation, and logic are clearly separated
2. **Modular Design**: Each module has a single responsibility
3. **Progressive Enhancement**: Core functionality works without JavaScript
4. **Mobile-First**: Responsive design starts from mobile viewport
5. **Accessibility-First**: WCAG AA compliance built in from the start

### State Management

Application state is managed in `app.js`:
- Single source of truth for application state
- Unidirectional data flow
- State updates trigger UI re-renders
- Filter and search state preserved during navigation

### Module Communication

Modules communicate through well-defined interfaces:
- Data module provides read-only access to raga data
- Filter and search modules are pure functions
- UI module handles all DOM manipulation
- App module coordinates all interactions

## Specification-Driven Development

This project follows a specification-driven development approach:

### Specification Documents

Located in `.kiro/specs/indian-music-dashboard/`:

- **requirements.md**: User stories and acceptance criteria using EARS syntax
- **design.md**: Architecture, components, data models, and correctness properties
- **tasks.md**: Implementation plan with detailed tasks

### Correctness Properties

The design document defines 14 correctness properties that the application must satisfy:
- Properties are validated through property-based testing
- Each property maps to specific requirements
- Tests verify properties hold across all valid inputs

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Review the specification documents in `.kiro/specs/indian-music-dashboard/`
2. Ensure changes align with requirements and design
3. Add tests for new functionality
4. Maintain code style and documentation standards
5. Test accessibility with keyboard and screen readers

## License

This project is for educational purposes.

## Acknowledgments

- Indian classical music tradition and its practitioners
- The rich heritage of ragas and thaats in Hindustani classical music
- The fast-check library for property-based testing
- Tailwind CSS for utility-first styling

## Support and Resources

### Learning Resources

- [Introduction to Indian Classical Music](https://en.wikipedia.org/wiki/Indian_classical_music)
- [Raga System](https://en.wikipedia.org/wiki/Raga)
- [Thaat Classification](https://en.wikipedia.org/wiki/Thaat)

### Technical Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [fast-check Documentation](https://fast-check.dev/)

## Changelog

### Version 1.0.0 (Current)

- Initial release with 20 ragas
- Filtering by thaat and time of day
- Search functionality with highlighting
- Detailed raga views with modal
- Audio player support
- Responsive design
- Full accessibility support
- Comprehensive test suite
