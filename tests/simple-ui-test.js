/**
 * Simple UI test to verify basic functionality
 */

// Load modules
const dataModule = require('../js/data.js');
const uiModule = require('../js/ui.js');

// Create a minimal DOM mock
class MockElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.innerHTML = '';
    this.outerHTML = '';
    this.className = '';
    this.children = [];
    this.attributes = {};
    this._classList = [];
  }
  
  setAttribute(name, value) {
    this.attributes[name] = value;
    // Update outerHTML to include attributes
    this.updateOuterHTML();
  }
  
  getAttribute(name) {
    return this.attributes[name];
  }
  
  appendChild(child) {
    this.children.push(child);
  }
  
  addEventListener() {}
  
  updateOuterHTML() {
    const attrs = Object.entries(this.attributes)
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ');
    this.outerHTML = `<${this.tagName} ${attrs}>${this.innerHTML}</${this.tagName}>`;
  }
  
  get classList() {
    return {
      add: (className) => {
        if (!this._classList.includes(className)) {
          this._classList.push(className);
        }
        this.className = this._classList.join(' ');
      },
      remove: (className) => {
        this._classList = this._classList.filter(c => c !== className);
        this.className = this._classList.join(' ');
      }
    };
  }
}

global.document = {
  createElement: (tagName) => new MockElement(tagName),
  getElementById: (id) => {
    const el = new MockElement('div');
    el.id = id;
    return el;
  }
};

// Test 1: Verify renderRagaCard includes required fields
console.log('Test 1: Raga card rendering completeness');
const testRaga = {
  id: 'test-raga',
  name: 'Test Raga',
  thaat: 'Kalyan',
  timeOfDay: 'Evening',
  aroha: 'Sa Re Ga Ma Pa Dha Ni Sa',
  avaroha: 'Sa Ni Dha Pa Ma Ga Re Sa',
  mood: 'Peaceful',
  characteristics: 'Test characteristics'
};

const card = uiModule.renderRagaCard(testRaga);
const html = card.outerHTML + card.innerHTML;

const hasName = html.includes('Test Raga');
const hasThaat = html.includes('Kalyan');
const hasTime = html.includes('Evening');

console.log('  - Contains name:', hasName ? '✅' : '❌');
console.log('  - Contains thaat:', hasThaat ? '✅' : '❌');
console.log('  - Contains time:', hasTime ? '✅' : '❌');

if (hasName && hasThaat && hasTime) {
  console.log('✅ Test 1 PASSED\n');
} else {
  console.log('❌ Test 1 FAILED\n');
  process.exit(1);
}

// Test 2: Verify alphabetical ordering
console.log('Test 2: Alphabetical ordering');
const testRagas = [
  { id: 'c', name: 'Charlie', thaat: 'Kalyan', timeOfDay: 'Evening', aroha: 'Sa', avaroha: 'Sa', mood: 'Test', characteristics: 'Test' },
  { id: 'a', name: 'Alpha', thaat: 'Kalyan', timeOfDay: 'Evening', aroha: 'Sa', avaroha: 'Sa', mood: 'Test', characteristics: 'Test' },
  { id: 'b', name: 'Beta', thaat: 'Kalyan', timeOfDay: 'Evening', aroha: 'Sa', avaroha: 'Sa', mood: 'Test', characteristics: 'Test' }
];

// Mock the container
const container = new MockElement('div');
container.id = 'ragaListContainer';
global.document.getElementById = (id) => {
  if (id === 'ragaListContainer') return container;
  if (id === 'noResultsMessage') {
    const el = new MockElement('div');
    el.classList.add('hidden');
    return el;
  }
  return new MockElement('div');
};

// Mock getThaats and getTimesOfDay
global.getThaats = dataModule.getThaats;
global.getTimesOfDay = dataModule.getTimesOfDay;
global.getRagaById = dataModule.getRagaById;

uiModule.renderRagaList(testRagas);

const renderedIds = container.children.map(c => c.getAttribute('data-raga-id'));
const expectedOrder = ['a', 'b', 'c']; // Alpha, Beta, Charlie

const isOrdered = JSON.stringify(renderedIds) === JSON.stringify(expectedOrder);

console.log('  - Rendered order:', renderedIds.join(', '));
console.log('  - Expected order:', expectedOrder.join(', '));
console.log('  - Correctly ordered:', isOrdered ? '✅' : '❌');

if (isOrdered) {
  console.log('✅ Test 2 PASSED\n');
} else {
  console.log('❌ Test 2 FAILED\n');
  process.exit(1);
}

console.log('✅ All tests passed!');
