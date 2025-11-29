/**
 * Node.js Test Runner for UI Rendering Property Tests
 * Run with: node tests/run-ui-rendering-tests.js
 */

// Load required modules
const fc = require('fast-check');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Create a DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true
});

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;

// Load modules in order
const context = { 
  console, 
  fc,
  window: global.window,
  document: global.document,
  HTMLElement: global.HTMLElement
};

vm.createContext(context);

// Load data.js
const dataJsPath = path.join(__dirname, '../js/data.js');
const dataJsContent = fs.readFileSync(dataJsPath, 'utf8');
vm.runInContext(dataJsContent, context);

// Load ui.js
const uiJsPath = path.join(__dirname, '../js/ui.js');
const uiJsContent = fs.readFileSync(uiJsPath, 'utf8');
vm.runInContext(uiJsContent, context);

// Load generators
const generatorsPath = path.join(__dirname, 'helpers/generators.js');
const generatorsContent = fs.readFileSync(generatorsPath, 'utf8');
vm.runInContext(generatorsContent, context);

// Load property tests
const propertyTestsPath = path.join(__dirname, 'properties/ui-rendering.property.test.js');
const propertyTestsContent = fs.readFileSync(propertyTestsPath, 'utf8');
vm.runInContext(propertyTestsContent, context);

// Run the tests
console.log('Starting UI Rendering Property Tests...\n');

try {
  const allPassed = context.runUIRenderingPropertyTests();
  
  if (allPassed) {
    console.log('\n✅ All UI rendering property tests passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Some UI rendering property tests failed.');
    process.exit(1);
  }
} catch (error) {
  console.error('Error running tests:', error);
  process.exit(1);
}
