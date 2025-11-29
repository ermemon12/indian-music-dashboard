/**
 * Accessibility Features Verification
 * Verifies that accessibility code is properly implemented
 */

const fs = require('fs');
const path = require('path');

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║  Indian Music Dashboard - Accessibility Verification  ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

let passed = 0;
let failed = 0;

// Load all files first
const htmlPath = path.join(__dirname, '..', 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const uiJsPath = path.join(__dirname, '..', 'js', 'ui.js');
const uiJsContent = fs.readFileSync(uiJsPath, 'utf8');
const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');
const cssPath = path.join(__dirname, '..', 'styles.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

// Test 1: Verify HTML has ARIA labels
console.log('=== Test 1: Checking HTML for ARIA Labels ===');

const ariaChecks = [
  { pattern: /aria-label="Search ragas by name"/, description: 'Search input has aria-label' },
  { pattern: /aria-label="Filter ragas by thaat classification"/, description: 'Thaat filter has aria-label' },
  { pattern: /aria-label="Filter ragas by traditional performance time"/, description: 'Time filter has aria-label' },
  { pattern: /aria-label="Clear all active filters and show all ragas"/, description: 'Clear button has aria-label' },
  { pattern: /role="dialog"/, description: 'Modal has dialog role' },
  { pattern: /aria-modal="true"/, description: 'Modal has aria-modal attribute' },
  { pattern: /aria-labelledby="modalTitle"/, description: 'Modal has aria-labelledby' },
  { pattern: /aria-describedby/, description: 'Elements have aria-describedby for context' },
  { pattern: /aria-live="polite"/, description: 'Dynamic regions have aria-live' },
  { pattern: /aria-hidden="true"/, description: 'Decorative elements have aria-hidden' }
];

ariaChecks.forEach(({ pattern, description }) => {
  if (pattern.test(htmlContent)) {
    console.log(`✅ ${description}`);
    passed++;
  } else {
    console.log(`❌ ${description}`);
    failed++;
  }
});

// Test 2: Verify semantic HTML5 elements
console.log('\n=== Test 2: Checking Semantic HTML5 Elements ===');
const semanticChecks = [
  { pattern: /<header[^>]*role="banner"/, description: 'Header has banner role' },
  { pattern: /<main[^>]*role="main"/, description: 'Main has main role' },
  { pattern: /<aside[^>]*role="complementary"/, description: 'Aside has complementary role' },
  { pattern: /<section[^>]*aria-label/, description: 'Sections have aria-labels' },
  { pattern: /role="region"/, description: 'Important regions are marked' }
];

semanticChecks.forEach(({ pattern, description }) => {
  if (pattern.test(htmlContent)) {
    console.log(`✅ ${description}`);
    passed++;
  } else {
    console.log(`❌ ${description}`);
    failed++;
  }
});

// Test 3: Verify keyboard navigation support
console.log('\n=== Test 3: Checking Keyboard Navigation Support ===');
const keyboardChecks = [
  { pattern: /href="#main-content"/, description: 'Skip to main content link exists', file: htmlContent },
  { pattern: /id="main-content"/, description: 'Main content has ID for skip link', file: htmlContent },
  { pattern: /class="sr-only[^"]*"/, description: 'Screen reader only class is used', file: htmlContent },
  { pattern: /setAttribute\('tabindex'/, description: 'Interactive elements have tabindex', file: uiJsContent },
  { pattern: /type="button"/, description: 'Buttons have type attribute', file: htmlContent }
];

keyboardChecks.forEach(({ pattern, description, file }) => {
  if (pattern.test(file)) {
    console.log(`✅ ${description}`);
    passed++;
  } else {
    console.log(`❌ ${description}`);
    failed++;
  }
});

// Test 4: Verify JavaScript focus management
console.log('\n=== Test 4: Checking JavaScript Focus Management ===');

const jsChecks = [
  { pattern: /trapFocusInModal/, description: 'Focus trap function exists' },
  { pattern: /\.focus\(\)/, description: 'Focus management is implemented' },
  { pattern: /data-trigger-element/, description: 'Trigger element tracking for focus restoration' },
  { pattern: /addEventListener\('keydown'/, description: 'Keyboard event listeners are present' },
  { pattern: /e\.key === 'Enter'/, description: 'Enter key support is implemented' },
  { pattern: /e\.key === ' '/, description: 'Space key support is implemented' }
];

jsChecks.forEach(({ pattern, description }) => {
  if (pattern.test(uiJsContent)) {
    console.log(`✅ ${description}`);
    passed++;
  } else {
    console.log(`❌ ${description}`);
    failed++;
  }
});

// Test 5: Verify CSS accessibility features
console.log('\n=== Test 5: Checking CSS Accessibility Features ===');

const cssChecks = [
  { pattern: /\.sr-only/, description: 'Screen reader only styles exist' },
  { pattern: /:focus-visible/, description: 'Focus visible styles are defined' },
  { pattern: /outline:.*solid/, description: 'Focus outline styles are present' },
  { pattern: /box-shadow:.*rgba/, description: 'Focus ring styles are present' },
  { pattern: /@media \(prefers-reduced-motion/, description: 'Reduced motion support' },
  { pattern: /@media \(prefers-contrast: high\)/, description: 'High contrast mode support' }
];

cssChecks.forEach(({ pattern, description }) => {
  if (pattern.test(cssContent)) {
    console.log(`✅ ${description}`);
    passed++;
  } else {
    console.log(`❌ ${description}`);
    failed++;
  }
});

// Test 6: Verify app.js keyboard support
console.log('\n=== Test 6: Checking App.js Keyboard Support ===');

const appJsChecks = [
  { pattern: /event\.key === 'Escape'/, description: 'ESC key handler for modal' },
  { pattern: /event\.key === 'Esc'/, description: 'Esc key handler (legacy support)' },
  { pattern: /event\.preventDefault\(\)/, description: 'Event prevention for keyboard actions' }
];

appJsChecks.forEach(({ pattern, description }) => {
  if (pattern.test(appJsContent)) {
    console.log(`✅ ${description}`);
    passed++;
  } else {
    console.log(`❌ ${description}`);
    failed++;
  }
});

// Summary
console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║                    Test Summary                        ║');
console.log('╚════════════════════════════════════════════════════════╝');
console.log(`Total Tests Passed: ${passed}`);
console.log(`Total Tests Failed: ${failed}`);
console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

if (failed === 0) {
  console.log('\n🎉 All accessibility features are properly implemented!');
  process.exit(0);
} else {
  console.log(`\n⚠️  ${failed} accessibility checks failed. Please review.`);
  process.exit(1);
}
