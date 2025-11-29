/**
 * Verification script for UI rendering tests
 * This simulates the browser environment to verify test logic
 */

// Simple DOM mock for testing
class MockElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.innerHTML = '';
    this.outerHTML = '';
    this.className = '';
    this.children = [];
    this.attributes = {};
    this.eventListeners = {};
  }
  
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  
  getAttribute(name) {
    return this.attributes[name];
  }
  
  appendChild(child) {
    this.children.push(child);
  }
  
  addEventListener(event, handler) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(handler);
  }
  
  querySelectorAll(selector) {
    // Simple implementation for [data-raga-id]
    if (selector === '[data-raga-id]') {
      return this.children.filter(c => c.attributes['data-raga-id']);
    }
    return [];
  }
  
  classList = {
    add: (className) => { this.className += ' ' + className; },
    remove: (className) => { this.className = this.className.replace(className, ''); }
  };
}

global.document = {
  createElement: (tagName) => new MockElement(tagName),
  getElementById: (id) => new MockElement('div'),
  body: new MockElement('body')
};

global.window = {};

// Load fast-check
const fc = require('fast-check');
global.fc = fc;

// Load modules
const dataModule = require('../js/data.js');
const uiModule = require('../js/ui.js');

// Make functions global for tests
global.getAllRagas = dataModule.getAllRagas;
global.getRagaById = dataModule.getRagaById;
global.getThaats = dataModule.getThaats;
global.getTimesOfDay = dataModule.getTimesOfDay;
global.renderRagaCard = uiModule.renderRagaCard;
global.renderRagaList = uiModule.renderRagaList;

// Load generators
const generators = require('./helpers/generators.js');
global.ragaArbitrary = generators.ragaArbitrary;
global.ragaArrayArbitrary = generators.ragaArrayArbitrary;

// Load and run tests
const uiTests = require('./properties/ui-rendering.property.test.js');

console.log('Verifying UI Rendering Property Tests...\n');

try {
  const result = uiTests.runUIRenderingPropertyTests();
  
  if (result) {
    console.log('\n✅ Verification successful!');
    process.exit(0);
  } else {
    console.log('\n❌ Verification failed!');
    process.exit(1);
  }
} catch (error) {
  console.error('Error during verification:', error);
  process.exit(1);
}
