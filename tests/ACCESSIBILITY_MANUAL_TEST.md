# Manual Accessibility Testing Guide

This guide helps you manually test all accessibility features in the Indian Music Dashboard.

## 🎯 Keyboard Navigation Test

### Test 1: Skip Link
1. Open `index.html` in a browser
2. Press **Tab** once
3. ✅ **Expected**: A "Skip to main content" link should appear at the top-left
4. Press **Enter**
5. ✅ **Expected**: Focus should jump to the main content area

### Test 2: Tab Through Interface
1. Continue pressing **Tab** to navigate through:
   - Search input
   - Thaat filter dropdown
   - Time filter dropdown
   - Clear filters button
   - Each raga card
2. ✅ **Expected**: 
   - Each element should show a visible orange focus indicator
   - Focus order should be logical (top to bottom, left to right)
   - No elements should be skipped

### Test 3: Activate Raga Card with Keyboard
1. Tab to any raga card
2. Press **Enter** or **Space**
3. ✅ **Expected**: Modal should open with raga details

### Test 4: Modal Focus Trap
1. With modal open, press **Tab** repeatedly
2. ✅ **Expected**: 
   - Focus should cycle through: Close button → Audio controls (if present) → Back to close button
   - Focus should NOT escape the modal

### Test 5: Close Modal with ESC
1. With modal open, press **ESC**
2. ✅ **Expected**: 
   - Modal should close
   - Focus should return to the raga card that opened it

### Test 6: Filter Interaction
1. Tab to thaat filter
2. Press **Space** or **Enter** to open dropdown
3. Use **Arrow keys** to select an option
4. Press **Enter** to confirm
5. ✅ **Expected**: Raga list should update to show filtered results

## 🔊 Screen Reader Test

### Test with NVDA (Windows)
1. Download and install [NVDA](https://www.nvaccess.org/)
2. Start NVDA (Ctrl+Alt+N)
3. Open `index.html`
4. Use **Tab** to navigate
5. ✅ **Expected**: NVDA should announce:
   - "Skip to main content, link"
   - "Search ragas by name, edit, Type to filter ragas by name"
   - "Filter ragas by thaat classification, combo box"
   - Each raga card with full details

### Test with VoiceOver (Mac)
1. Enable VoiceOver (Cmd+F5)
2. Open `index.html` in Safari
3. Use **Tab** or **VO+Right Arrow** to navigate
4. ✅ **Expected**: VoiceOver should announce all elements with proper context

### Test with JAWS (Windows)
1. Start JAWS
2. Open `index.html`
3. Use **Tab** to navigate
4. ✅ **Expected**: JAWS should announce all interactive elements

## 🎨 Visual Focus Test

### Test 1: Focus Indicators
1. Tab through all elements
2. ✅ **Expected**: Each focused element should have:
   - 3px orange outline
   - Visible offset from the element
   - Additional shadow for enhanced visibility

### Test 2: Modal Focus
1. Open a raga detail modal
2. Tab through modal elements
3. ✅ **Expected**: Modal elements should have white focus indicators

### Test 3: Hover vs Focus
1. Hover over a raga card (don't click)
2. Tab to the same card
3. ✅ **Expected**: 
   - Hover shows shadow and slight lift
   - Focus shows orange outline and shadow
   - Both states should be clearly distinguishable

## 📱 Mobile/Touch Test

### Test 1: Touch Targets
1. Open on mobile device or use browser dev tools mobile view
2. Try tapping all interactive elements
3. ✅ **Expected**: 
   - All buttons should be at least 44px tall
   - Easy to tap without accidentally hitting adjacent elements

### Test 2: Screen Reader on Mobile
1. Enable TalkBack (Android) or VoiceOver (iOS)
2. Navigate through the app
3. ✅ **Expected**: All elements should be announced properly

## 🎭 High Contrast Mode Test

### Windows High Contrast
1. Enable Windows High Contrast Mode
   - Settings → Ease of Access → High Contrast
2. Open `index.html`
3. ✅ **Expected**: 
   - All text should be readable
   - Focus indicators should be visible
   - Borders should be prominent

### Browser Extensions
1. Install a high contrast extension
2. Enable high contrast
3. ✅ **Expected**: Content should remain accessible

## 🏃 Reduced Motion Test

### Test 1: Disable Animations
1. Enable reduced motion:
   - **Windows**: Settings → Ease of Access → Display → Show animations
   - **Mac**: System Preferences → Accessibility → Display → Reduce motion
2. Open `index.html`
3. Open and close modal
4. ✅ **Expected**: 
   - Animations should be minimal or instant
   - No jarring transitions

## 🔍 Color Contrast Test

### Automated Tools
1. Install [axe DevTools](https://www.deque.com/axe/devtools/) browser extension
2. Open `index.html`
3. Run axe scan
4. ✅ **Expected**: No color contrast violations

### Manual Check
1. Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
2. Test key color combinations:
   - Orange text (#ea580c) on white background
   - White text on orange background (#ea580c)
   - Gray text (#4b5563) on white background
3. ✅ **Expected**: All should meet WCAG AA (4.5:1 for normal text)

## 📋 ARIA Attributes Test

### Browser DevTools
1. Open browser DevTools (F12)
2. Inspect elements
3. Check for ARIA attributes:
   - `aria-label` on search input, filters, buttons
   - `aria-describedby` on form controls
   - `aria-live` on dynamic regions
   - `aria-modal` on dialog
   - `role` attributes on semantic elements
4. ✅ **Expected**: All interactive elements should have appropriate ARIA

## ✅ Checklist Summary

- [ ] Skip link works and is visible on focus
- [ ] All elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Enter and Space keys activate elements
- [ ] ESC closes modal
- [ ] Focus indicators are visible
- [ ] Modal traps focus correctly
- [ ] Focus returns after modal closes
- [ ] Screen reader announces all elements
- [ ] Touch targets are adequate on mobile
- [ ] High contrast mode works
- [ ] Reduced motion is respected
- [ ] Color contrast meets WCAG AA
- [ ] ARIA attributes are present and correct

## 🐛 Common Issues to Check

- [ ] Focus outline not visible on some elements
- [ ] Tab order skips elements or goes in wrong order
- [ ] Modal doesn't trap focus
- [ ] ESC key doesn't close modal
- [ ] Screen reader doesn't announce dynamic updates
- [ ] Touch targets too small on mobile
- [ ] Color contrast too low
- [ ] Animations still play with reduced motion enabled

## 📞 Reporting Issues

If you find any accessibility issues:
1. Note the specific element or interaction
2. Describe the expected vs actual behavior
3. Include browser and assistive technology versions
4. Take screenshots if helpful
5. Report to the development team

## 🎓 Learning Resources

- [WebAIM Keyboard Testing](https://webaim.org/articles/keyboard/)
- [Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [WCAG Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
