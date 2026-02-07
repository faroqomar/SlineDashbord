

# Eye-Comfortable Color Scheme and Dark Mode Fix

## Overview

This plan addresses two issues:
1. **Color palette refresh** - Current teal accent is quite saturated and the light mode background is very bright, which can cause eye strain during long work sessions
2. **Dark mode toggle** - Currently works via TopBar button but should be easier to access and persist across sessions

## Current Issues Identified

### Color Problems
- Light mode background (`210 20% 98%`) is almost pure white - too bright for extended use
- Primary teal (`173 58% 39%`) is highly saturated - can be harsh
- Some accent colors are too vibrant for a work environment

### Dark Mode Toggle
- The toggle in TopBar **already works** (adds/removes `dark` class on `documentElement`)
- However, preference is not persisted (resets on page refresh)
- Would benefit from localStorage persistence

---

## Solution: Soft, Professional Color Palette

### Design Philosophy
- **Reduce contrast** in light mode (warm gray instead of pure white)
- **Softer primary accent** (muted indigo/blue instead of vibrant teal)
- **Lower saturation** across all colors
- **Warmer tones** that are easier on the eyes

### New Light Mode Colors
- Background: Warm off-white with slight cream tint
- Cards: Pure white for subtle elevation
- Primary: Soft indigo (easier than teal for long sessions)
- Muted text: Warmer grays
- Status colors: Desaturated versions (less harsh)

### New Dark Mode Colors
- Background: Deep charcoal (not pure black)
- Cards: Slightly elevated gray
- Primary: Softer indigo that works well on dark
- Reduced contrast for comfortable night viewing

---

## Technical Changes

### 1. Update `src/index.css` - New Color Variables

**Light Mode (`:root`):**
```
Background: 40 20% 98% (warm off-white)
Foreground: 220 15% 20% (soft dark gray)
Card: 0 0% 100% (white)
Primary: 230 60% 55% (soft indigo)
Secondary: 220 15% 94% (warm light gray)
Muted: 220 10% 92%
Accent: 230 40% 95%
Border: 220 15% 88% (softer borders)
```

**Dark Mode (`.dark`):**
```
Background: 220 20% 10% (deep charcoal)
Foreground: 220 10% 90% (soft white)
Card: 220 18% 14% (elevated surface)
Primary: 230 55% 60% (bright indigo)
Secondary: 220 15% 18%
Border: 220 15% 22%
```

**Status Colors (both modes):**
- Success: Lower saturation green
- Warning: Softer amber (less orange)
- Destructive: Muted red
- Info: Softer blue

### 2. Update `src/components/dashboard/DashboardLayout.tsx`

Add localStorage persistence for dark mode:
- Read initial state from localStorage on mount
- Save preference when toggled
- Respect system preference as default

### 3. Update Sidebar Colors

Match the new softer palette for the dark sidebar:
- Slightly warmer tones
- Softer accent highlights

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | New color values for both light and dark modes |
| `src/components/dashboard/DashboardLayout.tsx` | Add localStorage persistence for dark mode preference |

---

## Visual Comparison

### Before (Light Mode)
- Very bright white background
- High-contrast teal accents
- Can cause eye fatigue

### After (Light Mode)
- Warm cream-tinted background
- Soft indigo accents
- Professional, calming aesthetic

### Before (Dark Mode)
- Deep blue-ish blacks
- Bright teal highlights

### After (Dark Mode)
- Charcoal gray (easier on eyes than pure black)
- Muted indigo accents
- Reduced overall contrast

---

## Additional Improvements

1. **Persist preference**: Dark mode choice saved to localStorage
2. **System preference detection**: Respect user's OS setting on first visit
3. **Smoother transitions**: Add CSS transition for theme changes

