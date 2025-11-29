/**
 * Accessibility Verification Script
 * Tests that accessibility features are properly implemented
 */

// Test 1: Verify ARIA labels are present
function testAriaLabels() {
  console.log('\n=== Testing ARIA Labels ===');
  
  const elementsToCheck = [
    { selector: '#searchInput', attribute: 'aria-label', expected: 'Search ragas by name' },
    { selector: '#thaatFilter', attribute: 'aria-label', expected: 'Filter ragas by thaat classification' },
    { selector: '#timeFilter', attribute: 'aria-label', expected: 'Filter ragas by traditional performance time' },
    { selector: '#clearFiltersBtn', attribute: 'aria-label', expected: 'Clear all active filters and show all ragas' },
    { selector: '#ragaDetailModal', attribute: 'aria-modal', expected: 'true' },
    { selector: '#ragaDetailModal', attribute: 'role', expected: 'dialog' }
  ];
  
  let passed = 0;
  let failed = 0;
  
  elementsToCheck.forEach(({ selector, attribute, expected }) => {
    const element = document.querySelector(selector);
    if (!element) {
      console.log(`❌ Element not found: ${selector}`);
      failed++;
      return;
    }
    
    const value = element.getAttribute(attribute);
    if (value === expected) {
      console.log(`✅ ${selector} has correct ${attribute}: "${value}"`);
      passed++;
    } else {
      console.log(`❌ ${selector} ${attribute} mismatch. Expected: "${expected}", Got: "${value}"`);
      failed++;
    }
  });
  
  return { passed, failed };
}

// Test 2: Verify semantic HTML5 elements
function testSemanticHTML() {
  console.log('\n=== Testing Semantic HTML5 Elements ===');
  
  const semanticElements = [
    { selector: 'header', role: 'banner' },
    { selector: 'main', role: 'main' },
    { selector: 'aside', role: 'complementary' }
  ];
  
  let passed = 0;
  let failed = 0;
  
  semanticElements.forEach(({ selector, role }) => {
    const element = document.querySelector(selector);
    if (!element) {
      console.log(`❌ Semantic element not found: ${selector}`);
      failed++;
      return;
    }
    
    const elementRole = element.getAttribute('role');
    if (elementRole === role) {
      console.log(`✅ ${selector} has correct role: "${role}"`);
      passed++;
    } else {
      console.log(`❌ ${selector} role mismatch. Expected: "${role}", Got: "${elementRole}"`);
      failed++;
    }
  });
  
  return { passed, failed };
}

// Test 3: Verify keyboard navigation support
function testKeyboardNavigation() {
  console.log('\n=== Testing Keyboard Navigation ===');
  
  let passed = 0;
  let failed = 0;
  
  // Check for skip link
  const skipLink = document.querySelector('a[href="#main-content"]');
  if (skipLink) {
    console.log('✅ Skip to main content link is present');
    passed++;
  } else {
    console.log('❌ Skip to main content link is missing');
    failed++;
  }
  
  // Check for main content ID
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    console.log('✅ Main content has ID for skip link target');
    passed++;
  } else {
    console.log('❌ Main content ID is missing');
    failed++;
  }
  
  // Check that interactive elements have tabindex
  const searchInput = document.getElementById('searchInput');
  if (searchInput && searchInput.tabIndex >= 0) {
    console.log('✅ Search input is keyboard accessible');
    passed++;
  } else {
    console.log('❌ Search input is not keyboard accessible');
    failed++;
  }
  
  return { passed, failed };
}

// Test 4: Verify focus management
function testFocusManagement() {
  console.log('\n=== Testing Focus Management ===');
  
  let passed = 0;
  let failed = 0;
  
  // Check modal close button
  const closeBtn = document.getElementById('closeModalBtn');
  if (closeBtn) {
    const ariaLabel = closeBtn.getAttribute('aria-label');
    if (ariaLabel && ariaLabel.includes('Close')) {
      console.log('✅ Modal close button has descriptive aria-label');
      passed++;
    } else {
      console.log('❌ Modal close button aria-label is missing or inadequate');
      failed++;
    }
  } else {
    console.log('⚠️  Modal close button not found (modal may not be open)');
  }
  
  // Check that buttons have type attribute
  const buttons = document.querySelectorAll('button');
  let buttonsWithType = 0;
  buttons.forEach(btn => {
    if (btn.hasAttribute('type')) {
      buttonsWithType++;
    }
  });
  
  if (buttonsWithType === buttons.length) {
    console.log(`✅ All ${buttons.length} buttons have type attribute`);
    passed++;
  } else {
    console.log(`⚠️  ${buttons.length - buttonsWithType} of ${buttons.length} buttons missing type attribute`);
  }
  
  return { passed, failed };
}

// Test 5: Verify screen reader support
function testScreenReaderSupport() {
  console.log('\n=== Testing Screen Reader Support ===');
  
  let passed = 0;
  let failed = 0;
  
  // Check for aria-describedby
  const searchInput = document.getElementById('searchInput');
  if (searchInput && searchInput.hasAttribute('aria-describedby')) {
    console.log('✅ Search input has aria-describedby for additional context');
    passed++;
  } else {
    console.log('❌ Search input missing aria-describedby');
    failed++;
  }
  
  // Check for aria-live regions
  const ragaList = document.querySelector('[aria-live]');
  if (ragaList) {
    console.log('✅ Raga list has aria-live for dynamic updates');
    passed++;
  } else {
    console.log('❌ No aria-live regions found');
    failed++;
  }
  
  // Check for hidden decorative elements
  const svgs = document.querySelectorAll('svg');
  let decorativeSvgs = 0;
  svgs.forEach(svg => {
    if (svg.hasAttribute('aria-hidden')) {
      decorativeSvgs++;
    }
  });
  
  if (decorativeSvgs > 0) {
    console.log(`✅ ${decorativeSvgs} decorative SVG elements have aria-hidden`);
    passed++;
  } else {
    console.log('⚠️  No decorative SVGs marked with aria-hidden');
  }
  
  return { passed, failed };
}

// Run all tests
function runAccessibilityTests() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     Indian Music Dashboard - Accessibility Tests      ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  const results = {
    ariaLabels: testAriaLabels(),
    semanticHTML: testSemanticHTML(),
    keyboardNav: testKeyboardNavigation(),
    focusManagement: testFocusManagement(),
    screenReader: testScreenReaderSupport()
  };
  
  // Calculate totals
  let totalPassed = 0;
  let totalFailed = 0;
  
  Object.values(results).forEach(result => {
    totalPassed += result.passed;
    totalFailed += result.failed;
  });
  
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                    Test Summary                        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`Total Tests Passed: ${totalPassed}`);
  console.log(`Total Tests Failed: ${totalFailed}`);
  console.log(`Success Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);
  
  if (totalFailed === 0) {
    console.log('\n🎉 All accessibility tests passed!');
  } else {
    console.log(`\n⚠️  ${totalFailed} accessibility issues found. Please review.`);
  }
  
  return {
    passed: totalPassed,
    failed: totalFailed,
    results
  };
}

// Export for use in test environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAccessibilityTests,
    testAriaLabels,
    testSemanticHTML,
    testKeyboardNavigation,
    testFocusManagement,
    testScreenReaderSupport
  };
}

// Auto-run if loaded in browser
if (typeof window !== 'undefined' && document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(runAccessibilityTests, 1000);
  });
} else if (typeof window !== 'undefined') {
  setTimeout(runAccessibilityTests, 1000);
}
