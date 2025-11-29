# Tests Directory

This directory contains all test files for the Indian Music Dashboard.

## Structure

- `unit/` - Unit tests for individual modules
- `properties/` - Property-based tests using fast-check
- `helpers/` - Test utilities and generators
- `test-runner.html` - Browser-based test runner
- `run-property-tests.js` - Node.js test runner

## Running Tests

### Command Line (Node.js)
```bash
npm test
```

This will run all property-based tests using Node.js.

### Browser
Open `tests/test-runner.html` in a web browser to run tests interactively.

## Test Types

### Unit Tests
- Test specific examples and edge cases
- Verify individual function behavior
- Test integration between components

### Property-Based Tests
- Verify universal properties across all inputs
- Use fast-check to generate random test data
- Run minimum 100 iterations per property
- Each test tagged with format: `Feature: indian-music-dashboard, Property {number}: {description}`

## Implemented Tests

### Data Model Property Tests
- **Data structure consistency** - Validates that all ragas have required fields (id, name, thaat, timeOfDay, aroha, avaroha)
  - Status: ✅ PASSED
  - Validates: Requirements 9.2

### UI Rendering Property Tests
- **Property 1: Raga list rendering completeness** - Validates that rendered raga cards contain name, thaat, and time of day
  - Status: ✅ IMPLEMENTED
  - Validates: Requirements 1.2
  - Run: Open `tests/test-ui-rendering.html` in browser

- **Property 3: Alphabetical ordering invariant** - Validates that raga lists are rendered in alphabetical order
  - Status: ✅ IMPLEMENTED
  - Validates: Requirements 1.4
  - Run: Open `tests/test-ui-rendering.html` in browser

## Requirements

- Node.js (for command-line tests)
- fast-check library (installed via npm or loaded via CDN)
- Modern browser with ES6+ support (for browser tests)
