/**
 * Verification Script for Accessibility Implementation
 * Checks that all accessibility test files are in place
 */

const fs = require('fs');
const path = require('path');

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║   Accessibility Implementation Verification           ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

const requiredFiles = [
  'test-accessibility-automated.html',
  'run-accessibility-browser-tests.js',
  'verify-accessibility.js',
  'test-accessibility.html',
  'ACCESSIBILITY_TEST_RESULTS.md',
  'ACCESSIBILITY_MANUAL_TEST.md',
  'ACCESSIBILITY_FEATURES.md',
  'README_ACCESSIBILITY_TESTS.md'
];

let allPresent = true;

console.log('Checking for required test files:\n');

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    const stats = fs.statSync(filePath);
    const size = (stats.size / 1024).toFixed(2);
    console.log(`✅ ${file} (${size} KB)`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allPresent = false;
  }
});

console.log('\n' + '═'.repeat(60) + '\n');

if (allPresent) {
  console.log('✅ All accessibility test files are present!\n');
  console.log('To run the tests:');
  console.log('  node tests/run-accessibility-browser-tests.js\n');
  console.log('Or manually open:');
  console.log('  tests/test-accessibility-automated.html\n');
  process.exit(0);
} else {
  console.log('❌ Some files are missing. Please check the implementation.\n');
  process.exit(1);
}
