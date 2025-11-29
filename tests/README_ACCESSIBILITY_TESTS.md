# Accessibility Testing Guide

## Quick Start

### Run Automated Tests

```bash
# Open automated tests in browser
node tests/run-accessibility-browser-tests.js
```

The tests will open in your default browser and run automatically.

## What Gets Tested

### 1. Keyboard Navigation 🎹

- Skip to main content link
- Tab navigation through all elements
- Keyboard activation (Enter/Space keys)
- ESC key to close modal
- Focus trap in modal
- All buttons have proper type attributes

### 2. Screen Reader Compatibility 🔊

- ARIA labels on all interactive elements
- ARIA descriptions for additional context
- Semantic HTML5 roles (banner, main, complementary)
- Live regions for dynamic updates
- Proper dialog attributes
- Hidden decorative elements
- Form label associations
- Screen reader only content

### 3. Focus Indicators 👁️

- Visible focus styling on all interactive elements
- Focus classes present (Tailwind focus: utilities)
- Skip link focus-visible styling
- Modal focus indicators

## Test Files

| File | Purpose |
|------|---------|
| `test-accessibility-automated.html` | Browser-based automated tests (recommended) |
| `run-accessibility-browser-tests.js` | Opens automated tests in browser |
| `verify-accessibility.js` | Standalone verification script |
| `test-accessibility.html` | Original test page with visual output |
| `ACCESSIBILITY_TEST_RESULTS.md` | Detailed test results and summary |
| `ACCESSIBILITY_MANUAL_TEST.md` | Manual testing procedures |
| `ACCESSIBILITY_FEATURES.md` | Feature documentation |

## Test Results

✅ **All 24 automated tests passing**

- 6/6 Keyboard Navigation tests
- 12/12 Screen Reader Compatibility tests
- 6/6 Focus Indicator tests

**Success Rate: 100%**

## Manual Testing

While automated tests verify technical implementation, manual testing is recommended:

1. **Keyboard-only navigation** - Use only Tab, Enter, Space, ESC keys
2. **Screen reader testing** - Test with NVDA, JAWS, or VoiceOver
3. **Focus visibility** - Verify focus indicators are clearly visible
4. **Modal interaction** - Test focus trap and restoration
5. **Touch accessibility** - Test on mobile devices

See `ACCESSIBILITY_MANUAL_TEST.md` for detailed procedures.

## Standards Compliance

The application meets:

- ✅ WCAG 2.1 Level AA
- ✅ ARIA 1.2
- ✅ Section 508
- ✅ HTML5 Semantic Standards

## Browser Support

Tested in:
- Chrome/Edge (Chromium)
- Firefox
- Safari

## Assistive Technology Support

Designed to work with:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)
- Narrator (Windows)

## Key Features

### Keyboard Navigation
- Full keyboard accessibility
- Skip link (visible on focus)
- Logical tab order
- Focus trap in modal
- Focus restoration

### Screen Reader Support
- Comprehensive ARIA labels
- Semantic HTML5
- Live regions
- Hidden decorative elements
- Screen reader only content

### Focus Indicators
- Visible on all interactive elements
- Enhanced styling for modals
- No global outline removal

## Troubleshooting

### Tests won't open in browser

Manually open: `tests/test-accessibility-automated.html`

### Need to run in different browser

Open `tests/test-accessibility-automated.html` directly in your preferred browser.

### Want to see detailed results

Check `tests/ACCESSIBILITY_TEST_RESULTS.md` for comprehensive results.

## Contributing

When adding new features:

1. Ensure keyboard accessibility
2. Add appropriate ARIA labels
3. Include focus indicators
4. Test with automated tests
5. Perform manual testing
6. Update documentation

## Resources

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Questions?

See the detailed documentation:
- `ACCESSIBILITY_FEATURES.md` - What's implemented
- `ACCESSIBILITY_MANUAL_TEST.md` - How to test manually
- `ACCESSIBILITY_TEST_RESULTS.md` - Test results and analysis
