/**
 * Accessibility Test Runner
 * Runs automated accessibility tests for keyboard navigation,
 * screen reader compatibility, and focus indicators
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failedTestDetails = [];

// Simple test framework
function describe(suiteName, testFn) {
  console.log(`\n${colors.cyan}${colors.bold}${suiteName}${colors.reset}`);
  testFn();
}

function test(testName, testFn) {
  totalTests++;
  try {
    testFn();
    passedTests++;
    console.log(`  ${colors.green}✓${colors.reset} ${testName}`);
  } catch (error) {
    failedTests++;
    console.log(`  ${colors.red}✗${colors.reset} ${testName}`);
    failedTestDetails.push({
      suite: currentSuite,
      test: testName,
      error: error.message
    });
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected} but got ${actual}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy value but got ${actual}`);
      }
    },
    toBeGreaterThan(expected) {
      if (actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected) {
      if (actual < expected) {
        throw new Error(`Expected ${actual} to be greater than or equal to ${expected}`);
      }
    },
    toContain(expected) {
      if (Array.isArray(actual)) {
        if (!actual.includes(expected)) {
          throw new Error(`Expected array to contain ${expected}`);
        }
      } else if (typeof actual === 'string') {
        if (!actual.includes(expected)) {
          throw new Error(`Expected "${actual}" to contain "${expected}"`);
        }
      } else {
        throw new Error(`Cannot check if ${typeof actual} contains ${expected}`);
      }
    },
    toMatch(pattern) {
      if (!pattern.test(actual)) {
        throw new Error(`Expected "${actual}" to match pattern ${pattern}`);
      }
    }
  };
}

// Load HTML and set up DOM
console.log(`${colors.bold}Loading application...${colors.reset}`);
const htmlPath = path.resolve(__dirname, '../index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const dom = new JSDOM(html, {
  url: 'http://localhost',
  runScripts: 'outside-only',
  resources: 'usable'
});

const { window } = dom;
const { document } = window;
global.document = document;
global.window = window;

// Make functions available globally for tests
global.renderRagaCard = function() {}; // Mock function
global.trapFocusInModal = function() {}; // Mock function

let currentSuite = '';

console.log(`${colors.bold}${colors.blue}╔════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.bold}${colors.blue}║     Accessibility Tests - Indian Music Dashboard      ║${colors.reset}`);
console.log(`${colors.bold}${colors.blue}╚════════════════════════════════════════════════════════╝${colors.reset}`);

/**
 * Test Suite 1: Keyboard Navigation
 */
currentSuite = 'Keyboard Navigation';
describe('🎹 Keyboard Navigation Tests', () => {
  
  test('Skip to main content link exists and is keyboard accessible', () => {
    const skipLink = document.querySelector('a[href="#main-content"]');
    
    expect(skipLink).toBeTruthy();
    expect(skipLink.textContent).toContain('Skip to main content');
    expect(skipLink.getAttribute('href')).toBe('#main-content');
    
    // Verify target exists
    const mainContent = document.getElementById('main-content');
    expect(mainContent).toBeTruthy();
  });
  
  test('Search input is keyboard accessible', () => {
    const searchInput = document.getElementById('searchInput');
    
    expect(searchInput).toBeTruthy();
    expect(searchInput.type).toBe('search');
  });
  
  test('Filter dropdowns are keyboard accessible', () => {
    const thaatFilter = document.getElementById('thaatFilter');
    const timeFilter = document.getElementById('timeFilter');
    
    expect(thaatFilter).toBeTruthy();
    expect(thaatFilter.tagName).toBe('SELECT');
    
    expect(timeFilter).toBeTruthy();
    expect(timeFilter.tagName).toBe('SELECT');
  });
  
  test('Clear filters button is keyboard accessible', () => {
    const clearBtn = document.getElementById('clearFiltersBtn');
    
    expect(clearBtn).toBeTruthy();
    expect(clearBtn.tagName).toBe('BUTTON');
    expect(clearBtn.getAttribute('type')).toBe('button');
  });
  
  test('Modal close button is keyboard accessible', () => {
    const closeBtn = document.getElementById('closeModalBtn');
    
    expect(closeBtn).toBeTruthy();
    expect(closeBtn.tagName).toBe('BUTTON');
    expect(closeBtn.getAttribute('type')).toBe('button');
  });
  
  test('All buttons have explicit type attribute', () => {
    const buttons = document.querySelectorAll('button');
    
    expect(buttons.length).toBeGreaterThan(0);
    
    buttons.forEach(button => {
      const type = button.getAttribute('type');
      expect(['button', 'submit', 'reset'].includes(type)).toBeTruthy();
    });
  });
});

/**
 * Test Suite 2: Screen Reader Compatibility
 */
currentSuite = 'Screen Reader Compatibility';
describe('🔊 Screen Reader Compatibility Tests', () => {
  
  test('Search input has proper ARIA labels', () => {
    const searchInput = document.getElementById('searchInput');
    
    expect(searchInput).toBeTruthy();
    expect(searchInput.getAttribute('aria-label')).toBe('Search ragas by name');
    expect(searchInput.hasAttribute('aria-describedby')).toBeTruthy();
    
    const descriptionId = searchInput.getAttribute('aria-describedby');
    const description = document.getElementById(descriptionId);
    expect(description).toBeTruthy();
  });
  
  test('Thaat filter has proper ARIA labels', () => {
    const thaatFilter = document.getElementById('thaatFilter');
    
    expect(thaatFilter.getAttribute('aria-label')).toBe('Filter ragas by thaat classification');
    expect(thaatFilter.hasAttribute('aria-describedby')).toBeTruthy();
  });
  
  test('Time filter has proper ARIA labels', () => {
    const timeFilter = document.getElementById('timeFilter');
    
    expect(timeFilter.getAttribute('aria-label')).toBe('Filter ragas by traditional performance time');
    expect(timeFilter.hasAttribute('aria-describedby')).toBeTruthy();
  });
  
  test('Clear filters button has descriptive ARIA label', () => {
    const clearBtn = document.getElementById('clearFiltersBtn');
    
    expect(clearBtn.getAttribute('aria-label')).toBe('Clear all active filters and show all ragas');
  });
  
  test('Modal has proper dialog ARIA attributes', () => {
    const modal = document.getElementById('ragaDetailModal');
    
    expect(modal).toBeTruthy();
    expect(modal.getAttribute('role')).toBe('dialog');
    expect(modal.getAttribute('aria-modal')).toBe('true');
    expect(modal.hasAttribute('aria-labelledby')).toBeTruthy();
    expect(modal.hasAttribute('aria-describedby')).toBeTruthy();
    
    // Verify referenced elements exist
    const titleId = modal.getAttribute('aria-labelledby');
    const descId = modal.getAttribute('aria-describedby');
    
    expect(document.getElementById(titleId)).toBeTruthy();
    expect(document.getElementById(descId)).toBeTruthy();
  });
  
  test('Modal close button has descriptive ARIA label', () => {
    const closeBtn = document.getElementById('closeModalBtn');
    
    expect(closeBtn).toBeTruthy();
    const ariaLabel = closeBtn.getAttribute('aria-label');
    expect(ariaLabel).toContain('Close');
    expect(ariaLabel).toContain('dialog');
  });
  
  test('Header has proper banner role', () => {
    const header = document.querySelector('header');
    
    expect(header).toBeTruthy();
    expect(header.getAttribute('role')).toBe('banner');
  });
  
  test('Main content has proper main role', () => {
    const main = document.querySelector('main');
    
    expect(main).toBeTruthy();
    expect(main.getAttribute('role')).toBe('main');
  });
  
  test('Aside has proper complementary role', () => {
    const aside = document.querySelector('aside');
    
    expect(aside).toBeTruthy();
    expect(aside.getAttribute('role')).toBe('complementary');
  });
  
  test('Raga list has aria-live for dynamic updates', () => {
    const ragaListSection = document.querySelector('[aria-label="Raga list"]');
    
    expect(ragaListSection).toBeTruthy();
    expect(ragaListSection.hasAttribute('aria-live')).toBeTruthy();
    expect(ragaListSection.getAttribute('aria-live')).toBe('polite');
  });
  
  test('No results message has proper status role', () => {
    const noResults = document.getElementById('noResultsMessage');
    
    expect(noResults).toBeTruthy();
    expect(noResults.getAttribute('role')).toBe('status');
    expect(noResults.hasAttribute('aria-live')).toBeTruthy();
  });
  
  test('Decorative SVG elements are hidden from screen readers', () => {
    const svgs = document.querySelectorAll('svg');
    
    // At least some SVGs should be decorative and hidden
    const hiddenSvgs = Array.from(svgs).filter(svg => 
      svg.getAttribute('aria-hidden') === 'true'
    );
    
    expect(hiddenSvgs.length).toBeGreaterThan(0);
  });
  
  test('Form labels are properly associated with inputs', () => {
    const searchLabel = document.querySelector('label[for="searchInput"]');
    const thaatLabel = document.querySelector('label[for="thaatFilter"]');
    const timeLabel = document.querySelector('label[for="timeFilter"]');
    
    expect(searchLabel).toBeTruthy();
    expect(thaatLabel).toBeTruthy();
    expect(timeLabel).toBeTruthy();
  });
  
  test('Screen reader only content exists for additional context', () => {
    const srOnlyElements = document.querySelectorAll('.sr-only');
    
    expect(srOnlyElements.length).toBeGreaterThan(0);
    
    // Verify they contain meaningful content
    srOnlyElements.forEach(element => {
      expect(element.textContent.trim().length).toBeGreaterThan(0);
    });
  });
});

/**
 * Test Suite 3: Focus Indicators
 */
currentSuite = 'Focus Indicators';
describe('👁️  Focus Indicator Tests', () => {
  
  test('Focus indicators are defined in CSS', () => {
    const cssPath = path.resolve(__dirname, '../styles.css');
    const cssExists = fs.existsSync(cssPath);
    
    expect(cssExists).toBeTruthy();
    
    if (cssExists) {
      const css = fs.readFileSync(cssPath, 'utf8');
      
      // Check for focus-related styles
      expect(css.includes('focus:') || css.includes(':focus')).toBeTruthy();
    }
  });
  
  test('Search input has focus styling classes', () => {
    const searchInput = document.getElementById('searchInput');
    
    expect(searchInput.className).toMatch(/focus:/);
  });
  
  test('Thaat filter has focus styling classes', () => {
    const thaatFilter = document.getElementById('thaatFilter');
    
    expect(thaatFilter.className).toMatch(/focus:/);
  });
  
  test('Time filter has focus styling classes', () => {
    const timeFilter = document.getElementById('timeFilter');
    
    expect(timeFilter.className).toMatch(/focus:/);
  });
  
  test('Clear button has focus styling classes', () => {
    const clearBtn = document.getElementById('clearFiltersBtn');
    
    expect(clearBtn.className).toMatch(/focus:/);
  });
  
  test('Skip link has focus-visible styling', () => {
    const skipLink = document.querySelector('a[href="#main-content"]');
    
    expect(skipLink).toBeTruthy();
    expect(skipLink.className).toMatch(/focus:/);
  });
  
  test('Modal close button has focus styling', () => {
    const closeBtn = document.getElementById('closeModalBtn');
    
    expect(closeBtn).toBeTruthy();
    expect(closeBtn.className).toMatch(/focus:/);
  });
});

// Print summary
console.log(`\n${colors.bold}${colors.blue}╔════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.bold}${colors.blue}║                    Test Summary                        ║${colors.reset}`);
console.log(`${colors.bold}${colors.blue}╚════════════════════════════════════════════════════════╝${colors.reset}`);

console.log(`\nTotal Tests: ${totalTests}`);
console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);

if (failedTests > 0) {
  console.log(`\n${colors.red}${colors.bold}Failed Tests:${colors.reset}`);
  failedTestDetails.forEach(({ suite, test, error }) => {
    console.log(`\n${colors.yellow}${suite}${colors.reset}`);
    console.log(`  ${colors.red}✗${colors.reset} ${test}`);
    console.log(`    ${colors.red}${error}${colors.reset}`);
  });
}

const successRate = ((passedTests / totalTests) * 100).toFixed(1);
console.log(`\nSuccess Rate: ${successRate}%`);

if (failedTests === 0) {
  console.log(`\n${colors.green}${colors.bold}🎉 All accessibility tests passed!${colors.reset}`);
  process.exit(0);
} else {
  console.log(`\n${colors.yellow}⚠️  ${failedTests} accessibility test(s) failed. Please review.${colors.reset}`);
  process.exit(1);
}
