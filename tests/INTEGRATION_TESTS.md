# Integration Tests

This document describes the integration tests for the Indian Music Dashboard application.

## Overview

The integration tests verify that all components of the application work together correctly. They test the full user workflows including:

- Filter changes updating the display
- Search input updating the display
- Clicking ragas to open detail views
- Full user workflows from search to detail view

## Test Files

### 1. Node.js Integration Tests (`run-integration-tests.js`)

Tests the core logic integration without requiring a browser. These tests verify:

- Filter by thaat updates results correctly
- Filter by time of day updates results correctly
- Combined filters work correctly
- Clear filters restores all ragas
- Search filters ragas by name
- Search is case-insensitive
- Empty search returns all ragas
- Search combined with filters
- Get raga by ID returns correct raga
- Full workflow: filter → search → retrieve

**Run with:**
```bash
node tests/run-integration-tests.js
```

**Expected output:**
```
=== Running Integration Tests ===

Test 1: Filter by thaat updates results correctly
✓ Filtered X ragas with thaat 'Kalyan'

...

=== Test Results ===
Passed: 10
Failed: 0
Total: 10

✓ All integration tests passed!
```

### 2. Browser Integration Tests (`test-integration.html`)

Tests the full application including UI interactions in a browser environment. These tests verify:

- Filter by thaat updates display correctly
- Filter by time of day updates display correctly
- Combined filters work correctly
- Clear filters restores all ragas
- Search input updates display correctly
- Search is case-insensitive
- Clicking raga card opens detail view
- Detail view displays correct raga information
- Detail view preserves filter and search state
- Full user workflow: search → filter → view detail → close

**Run with:**
1. Open `tests/test-integration.html` in a web browser
2. The tests will run automatically
3. View results on the page

**Expected output:**
- Green checkmarks (✓) for passing tests
- Test summary showing pass rate

## Test Coverage

The integration tests cover the following requirements:

- **Requirement 1.1, 1.2**: Browsing and displaying ragas
- **Requirement 2.1, 2.2, 2.3, 2.4**: Filtering by thaat and time of day
- **Requirement 3.1, 3.2, 3.3**: Search functionality
- **Requirement 4.1, 4.2, 4.4, 4.5**: Raga detail view and state preservation
- **Requirement 9.1**: Application coordination and module integration

## Test Scenarios

### Filter Changes Update Display

Tests that applying filters (thaat, time of day, or both) correctly updates the displayed ragas and that clearing filters restores the full list.

### Search Input Updates Display

Tests that search functionality works correctly with case-insensitive matching and can be combined with filters.

### Clicking Raga Opens Detail View

Tests that clicking a raga card opens the detail modal with the correct information and that the modal can be closed properly.

### Full User Workflow

Tests complete user journeys such as:
1. Search for a raga
2. Apply filters to narrow results
3. Click a raga to view details
4. Close the detail view
5. Verify state is preserved

## Running All Tests

To run all integration tests:

```bash
# Run Node.js integration tests
node tests/run-integration-tests.js

# Open browser tests
# Open tests/test-integration.html in your browser
```

## Troubleshooting

### Node.js Tests Fail

- Ensure all JavaScript modules are in the `js/` directory
- Verify the data.js file contains valid raga data
- Check that all required functions are exported

### Browser Tests Fail

- Open the browser console to see detailed error messages
- Ensure all JavaScript files are loaded correctly
- Verify the HTML structure matches what the tests expect
- Check that the application initializes properly

## Adding New Integration Tests

### Node.js Tests

Add new test cases to `run-integration-tests.js`:

```javascript
console.log('\nTest X: Your test description');
try {
  // Your test code here
  // Use context.functionName() to call app functions
  
  console.log(`✓ Test passed`);
  passed++;
} catch (error) {
  console.log(`✗ ${error.message}`);
  failed++;
  errors.push({ test: 'Your test', error: error.message });
}
```

### Browser Tests

Add new test cases to `test-integration.html`:

```javascript
runner.test('Your test description', () => {
  // Your test code here
  // Use assert(), assertEqual(), etc. for assertions
  
  // For async tests, return a Promise
  return new Promise(resolve => {
    setTimeout(() => {
      // Your async test code
      resolve();
    }, 350);
  });
});
```

## Notes

- Browser tests include a 300ms debounce delay for search input, so async tests wait 350ms
- The Node.js tests use the `vm` module to load JavaScript modules without JSDOM
- Both test suites are complementary: Node.js tests focus on logic, browser tests focus on UI
