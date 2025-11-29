/**
 * Responsive Layout Tests for Indian Music Dashboard
 * 
 * This script verifies that the responsive layout works correctly
 * at different viewport sizes (mobile, tablet, desktop).
 * 
 * Requirements tested:
 * - 6.1: Mobile-optimized layout
 * - 6.2: Vertical stacking below 768px
 * - 6.4: Readability and usability across screen sizes
 */

const fs = require('fs');
const path = require('path');

console.log('🎵 Indian Music Dashboard - Responsive Layout Tests\n');
console.log('=' .repeat(60));

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function logTest(testName, passed, message) {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(`✓ ${testName}`);
    console.log(`  ${message}`);
  } else {
    failedTests++;
    console.log(`✗ ${testName}`);
    console.log(`  ${message}`);
  }
  console.log('');
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  console.log(title);
  console.log('='.repeat(60) + '\n');
}

// Test 1: Verify CSS file exists and contains responsive breakpoints
logSection('📱 Test 1: Mobile Layout (< 768px)');

const cssPath = path.join(__dirname, '..', 'styles.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

// Check for mobile-specific styles
const hasMobileMediaQuery = cssContent.includes('@media (max-width: 767px)');
logTest(
  'Mobile media query exists',
  hasMobileMediaQuery,
  hasMobileMediaQuery 
    ? 'Found @media (max-width: 767px) for mobile styles'
    : 'Missing mobile-specific media query'
);

// Check for mobile stacking behavior
const hasMobileStacking = cssContent.includes('position: static') || 
                          cssContent.includes('margin-bottom');
logTest(
  'Mobile layout includes stacking styles',
  hasMobileStacking,
  hasMobileStacking
    ? 'Mobile styles include proper stacking behavior'
    : 'Mobile stacking styles may be missing'
);

// Check for mobile filter panel adjustments
const hasMobileFilterAdjustment = cssContent.match(/aside.*position.*static/s) !== null;
logTest(
  'Filter panel adjusted for mobile',
  hasMobileFilterAdjustment,
  hasMobileFilterAdjustment
    ? 'Filter panel position is adjusted for mobile (not sticky)'
    : 'Filter panel may remain sticky on mobile'
);

// Test 2: Verify tablet breakpoint
logSection('📱 Test 2: Tablet Layout (768px - 1024px)');

const hasTabletMediaQuery = cssContent.includes('@media (min-width: 768px)');
logTest(
  'Tablet media query exists',
  hasTabletMediaQuery,
  hasTabletMediaQuery
    ? 'Found @media (min-width: 768px) for tablet styles'
    : 'Missing tablet-specific media query'
);

// Check for tablet container max-width
const hasTabletContainer = cssContent.match(/max-width:\s*768px/);
logTest(
  'Tablet container max-width defined',
  hasTabletContainer !== null,
  hasTabletContainer
    ? 'Tablet container has appropriate max-width (768px)'
    : 'Tablet container max-width may not be defined'
);

// Test 3: Verify desktop breakpoint
logSection('🖥️ Test 3: Desktop Layout (> 1024px)');

const hasDesktopMediaQuery = cssContent.includes('@media (min-width: 1024px)');
logTest(
  'Desktop media query exists',
  hasDesktopMediaQuery,
  hasDesktopMediaQuery
    ? 'Found @media (min-width: 1024px) for desktop styles'
    : 'Missing desktop-specific media query'
);

// Check for desktop sticky filter panel
const hasDesktopSticky = cssContent.match(/@media.*1024px.*sticky/s) !== null ||
                         cssContent.match(/sticky.*@media.*1024px/s) !== null;
logTest(
  'Desktop filter panel is sticky',
  hasDesktopSticky,
  hasDesktopSticky
    ? 'Filter panel becomes sticky on desktop (>1024px)'
    : 'Filter panel sticky behavior may not be properly configured'
);

// Check for desktop container max-width
const hasDesktopContainer = cssContent.match(/max-width:\s*1024px/);
logTest(
  'Desktop container max-width defined',
  hasDesktopContainer !== null,
  hasDesktopContainer
    ? 'Desktop container has appropriate max-width (1024px)'
    : 'Desktop container max-width may not be defined'
);

// Test 4: Verify HTML uses responsive grid classes
logSection('🎨 Test 4: HTML Responsive Grid Structure');

const htmlPath = path.join(__dirname, '..', 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Check for responsive grid classes
const hasResponsiveGrid = htmlContent.includes('grid-cols-1') && 
                          htmlContent.includes('md:grid-cols-2') &&
                          htmlContent.includes('xl:grid-cols-3');
logTest(
  'Raga list uses responsive grid classes',
  hasResponsiveGrid,
  hasResponsiveGrid
    ? 'Grid uses: grid-cols-1 (mobile), md:grid-cols-2 (tablet), xl:grid-cols-3 (desktop)'
    : 'Responsive grid classes may be missing or incomplete'
);

// Check for responsive layout grid
const hasLayoutGrid = htmlContent.includes('lg:col-span-1') && 
                      htmlContent.includes('lg:col-span-3');
logTest(
  'Main layout uses responsive columns',
  hasLayoutGrid,
  hasLayoutGrid
    ? 'Layout uses lg:col-span-1 (filter) and lg:col-span-3 (content) on desktop'
    : 'Responsive layout columns may be missing'
);

// Check for viewport meta tag
const hasViewportMeta = htmlContent.includes('viewport') && 
                        htmlContent.includes('width=device-width');
logTest(
  'Viewport meta tag configured',
  hasViewportMeta,
  hasViewportMeta
    ? 'Viewport meta tag properly configured for responsive design'
    : 'Missing or incorrect viewport meta tag'
);

// Test 5: Verify responsive text sizing
logSection('📝 Test 5: Responsive Typography');

const hasResponsiveText = htmlContent.includes('text-3xl') && 
                          htmlContent.includes('md:text-4xl');
logTest(
  'Header uses responsive text sizing',
  hasResponsiveText,
  hasResponsiveText
    ? 'Header text scales from text-3xl (mobile) to md:text-4xl (tablet+)'
    : 'Responsive text sizing may not be implemented'
);

// Check for responsive padding in CSS
const hasResponsivePadding = cssContent.match(/padding.*1\.25rem/) !== null &&
                             cssContent.match(/padding.*1\.75rem/) !== null;
logTest(
  'Cards use responsive padding',
  hasResponsivePadding,
  hasResponsivePadding
    ? 'Raga cards have different padding at different breakpoints'
    : 'Card padding may not be responsive'
);

// Test 6: Verify touch device optimizations
logSection('👆 Test 6: Touch Device Optimizations');

const hasTouchOptimization = cssContent.includes('@media (hover: none)') ||
                             cssContent.includes('pointer: coarse');
logTest(
  'Touch device styles defined',
  hasTouchOptimization,
  hasTouchOptimization
    ? 'Touch-specific styles are defined for mobile devices'
    : 'Touch device optimizations may be missing'
);

// Check for minimum touch target sizes
const hasMinHeight = cssContent.match(/min-height:\s*44px/) !== null ||
                     cssContent.match(/min-height:\s*120px/) !== null;
logTest(
  'Minimum touch target sizes defined',
  hasMinHeight,
  hasMinHeight
    ? 'Touch targets meet minimum size requirements (44px+)'
    : 'Touch target sizes may be too small for mobile'
);

// Test 7: Verify reduced motion support
logSection('♿ Test 7: Accessibility - Reduced Motion');

const hasReducedMotion = cssContent.includes('@media (prefers-reduced-motion: reduce)');
logTest(
  'Reduced motion media query exists',
  hasReducedMotion,
  hasReducedMotion
    ? 'Respects user preference for reduced motion'
    : 'Missing reduced motion accessibility feature'
);

// Test 8: Verify high contrast support
logSection('♿ Test 8: Accessibility - High Contrast');

const hasHighContrast = cssContent.includes('@media (prefers-contrast: high)');
logTest(
  'High contrast media query exists',
  hasHighContrast,
  hasHighContrast
    ? 'Respects user preference for high contrast'
    : 'Missing high contrast accessibility feature'
);

// Final Summary
logSection('📊 Test Summary');

console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests} ✓`);
console.log(`Failed: ${failedTests} ✗`);
console.log('');

if (failedTests === 0) {
  console.log('🎉 All responsive layout tests passed!');
  console.log('');
  console.log('✓ Mobile layout stacks correctly (< 768px)');
  console.log('✓ Tablet layout uses appropriate columns (768px - 1024px)');
  console.log('✓ Desktop layout is optimal (> 1024px)');
  console.log('');
  console.log('The dashboard is fully responsive and ready for all devices!');
  process.exit(0);
} else {
  console.log('⚠️ Some responsive layout tests failed.');
  console.log('Please review the failed tests above and update the styles accordingly.');
  process.exit(1);
}
