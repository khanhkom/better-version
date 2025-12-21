# 00 - Migration Overview: Web UI → Mobile App

**Date:** 2025-12-22
**Priority:** 🔴 P0
**Status:** Draft

---

## Executive Summary

Migrate "Gemini Pixel Farm" web app to React Native mobile app with identical features, visual design, and game mechanics while maintaining clean architecture and scalability.

### Goals
- ✅ Feature parity with web version
- ✅ Native mobile UX (gestures, haptics, notifications)
- ✅ 60fps performance with smooth animations
- ✅ Offline-first architecture with MMKV persistence
- ✅ Reusable component library
- ✅ Type-safe codebase (100% TypeScript)

### Non-Goals
- ❌ Backend API (pure client-side game)
- ❌ Multiplayer features (future consideration)
- ❌ Web-mobile code sharing (separate codebases for now)

---

## Tech Stack Comparison

| Aspect | Web | Mobile | Notes |
|--------|-----|--------|-------|
| **Framework** | React 18 | React Native 0.76 | Shared React patterns |
| **Styling** | Tailwind CSS | @shopify/restyle | Similar token-based approach |
| **State** | React useState | Zustand + persist | More robust for game state |
| **Storage** | localStorage | MMKV | 10x faster than AsyncStorage |
| **Navigation** | Modal overlays | React Navigation + modals | Hybrid approach |
| **Animations** | CSS transitions | Reanimated 3 | Native 60fps animations |
| **Icons** | Emoji text | Emoji + SVG | Same visual style |
| **Fonts** | Press Start 2P, Quicksand | System fonts + custom | Need font licensing check |
| **AI** | Gemini API (direct) | Gemini API (via proxy?) | CORS consideration |
| **Timer** | setInterval | react-native-background-timer | Background support |

---

## Current State Analysis

### Web App (src/web/)
**Structure:**
```
src/web/
├── App.tsx                 # Main farm screen
├── components/
│   ├── Plot.tsx            # Farm plot (Empty/Planted/Ready)
│   ├── ToolBar.tsx         # Action toolbar (Water/Dig/Plant)
│   ├── HabitBoard.tsx      # Habits modal (3 tabs)
│   ├── PomodoroModal.tsx   # Focus timer modal
│   └── StorageModal.tsx    # Shop + inventory (4 tabs)
└── index.html
```

**Features:**
- 6-plot farm grid (expandable)
- 4 crop types (Tomato, Carrot, Corn, Watermelon)
- Automatic growth with real-time progress bars
- Currency system (Money, Diamonds)
- XP and leveling system
- Habit tracking with 7-day streaks
- Pomodoro timer (25min/5min)
- Shop with buy/sell mechanics
- Gemini AI advice box

**Design:**
- Bright green gradient background (#2d5a27 → #3a7332)
- Pixel art aesthetic
- Brown borders (#5d4037)
- Emoji icons (🍅 🥕 🌽 🍉)
- Sway animations on crops
- Modal overlays with backdrop blur

### Mobile App (src/)
**Structure:**
```
src/
├── components/
│   ├── atoms/          # Box, Text, Button, Avatar, Badge, Card, ProgressBar
│   ├── molecules/      # StatCard, ItemCard
│   └── organisms/      # (empty)
├── screens/
│   └── ProfileExample.tsx
├── navigation/
│   └── Application.tsx
└── theme/
    ├── restyle.ts      # Dark theme config
    └── ThemeProvider/
```

**Current Theme:**
- Dark mode (#0A0B0F background)
- Cyan primary (#5CE1E6)
- Gold secondary (#FFD700)
- 4px spacing grid (same as Tailwind)
- Restyle variants system

**Gaps:**
- ❌ No game state management
- ❌ No farm-specific components
- ❌ No modal system
- ❌ No persistence layer
- ❌ No game loop logic

---

## Migration Strategy

### Approach: Progressive Enhancement

**Phase 0: Foundation** (Week 1)
- Extend restyle theme with farm colors
- Setup Zustand store for game state
- Configure MMKV persistence
- Create base atoms (PlotCard, CircularProgress)

**Phase 1: Core Farm** (Week 2)
- FarmGameScreen layout
- FarmGrid component
- Plot interaction (plant, water, harvest)
- Crop growth system with game loop
- Stats header (Money, Diamonds, XP, Level)

**Phase 2: Shop & Inventory** (Week 3)
- ShopModal with 4 tabs
- Buy/sell transactions
- Inventory management
- Currency display & updates

**Phase 3: Habits** (Week 4)
- HabitListModal (3 tabs)
- Habit CRUD operations
- Streak calculation (7-day grid)
- Completion tracking

**Phase 4: Pomodoro** (Week 5)
- FocusTimerModal
- Circular progress timer
- Background timer support
- Sound/haptic notifications
- Rewards on completion

**Phase 5: Polish** (Week 6)
- Gemini AI integration
- Animations (sway, bounce, fade)
- Sound effects
- Haptic feedback
- Bug fixes & optimization

### Dependency Graph
```
Design System ──→ Base Components ──→ Farm Screen ──┬→ Shop Modal
                         ↓                           ├→ Habit Modal
                   State Management ─────────────────┴→ Pomodoro Modal
                                                           ↓
                                                    Integration & Testing
```

---

## Success Metrics

### Functional Requirements
- [ ] All web features implemented
- [ ] Data persists across app restarts
- [ ] Game loop runs reliably (1s tick rate)
- [ ] No crashes or memory leaks
- [ ] Offline functionality

### Performance Targets
- [ ] 60fps during animations
- [ ] <100ms state update latency
- [ ] <3s initial load time
- [ ] <50MB memory usage
- [ ] Game loop accuracy ±10ms

### Code Quality
- [ ] 100% TypeScript coverage
- [ ] Zero TypeScript errors
- [ ] ESLint warnings = 0
- [ ] Component test coverage >80%
- [ ] No console errors/warnings

### UX Requirements
- [ ] Visual parity with web (90%+ similarity)
- [ ] Touch interactions feel natural
- [ ] Haptic feedback on key actions
- [ ] Loading states for all async operations
- [ ] Error handling with user-friendly messages

---

## Risk Analysis

### 🔴 High Priority Risks

**R1: Performance Degradation**
- **Risk:** Game loop updating every 1s may cause lag with many plots
- **Impact:** Poor UX, battery drain
- **Mitigation:**
  - Throttle updates to visible plots only
  - Use FlatList for farm grid
  - Optimize re-renders with memo/useMemo
  - Profile with React DevTools

**R2: State Persistence Failures**
- **Risk:** Data loss on app crash/termination
- **Impact:** Users lose game progress
- **Mitigation:**
  - Auto-save every 5s
  - Write-ahead logging
  - Validate data on load
  - Backup to cloud (future)

**R3: Background Timer Limitations**
- **Risk:** iOS/Android may kill background processes
- **Impact:** Pomodoro timer stops when app backgrounded
- **Mitigation:**
  - Use react-native-background-timer
  - Calculate elapsed time on foreground
  - Show notification when timer completes
  - Store timer state in MMKV

### 🟡 Medium Priority Risks

**R4: Gemini API Costs**
- **Risk:** Unlimited API calls → high costs
- **Impact:** Unsustainable for free app
- **Mitigation:**
  - Rate limiting (1 request/10s)
  - Request queue with debounce
  - Cache responses
  - Fallback to pre-written advice

**R5: Animation Performance**
- **Risk:** Too many simultaneous animations
- **Impact:** Dropped frames, janky UI
- **Mitigation:**
  - Use Reanimated (runs on UI thread)
  - Limit concurrent animations
  - Use native driver where possible
  - Test on low-end devices

**R6: Font Licensing**
- **Risk:** Press Start 2P may not be free for commercial use
- **Impact:** Legal issues, need redesign
- **Mitigation:**
  - Check font license immediately
  - Use system fonts as fallback
  - Consider pixel font alternatives

### 🟢 Low Priority Risks

**R7: Web-Mobile Divergence**
- **Risk:** Features get out of sync over time
- **Impact:** Confusing for users who use both
- **Mitigation:**
  - Document feature parity
  - Consider monorepo in future
  - Share type definitions

---

## Timeline Estimate

| Phase | Duration | Start | End | Deliverables |
|-------|----------|-------|-----|--------------|
| Phase 0: Foundation | 1 week | Week 1 | Week 1 | Theme, state, atoms |
| Phase 1: Core Farm | 1 week | Week 2 | Week 2 | Farm screen, grid, plots |
| Phase 2: Shop | 1 week | Week 3 | Week 3 | Shop modal, inventory |
| Phase 3: Habits | 1 week | Week 4 | Week 4 | Habit tracking |
| Phase 4: Pomodoro | 1 week | Week 5 | Week 5 | Focus timer |
| Phase 5: Polish | 1 week | Week 6 | Week 6 | AI, animations, tests |
| **Total** | **6 weeks** | - | - | MVP ready |

### Milestones
- **M1** (Week 2): Playable farm (plant & harvest)
- **M2** (Week 3): Full economy (buy/sell)
- **M3** (Week 5): All features complete
- **M4** (Week 6): Production ready

---

## Open Questions

1. **Font Strategy:**
   - Use custom Press Start 2P font or system font alternative?
   - License status?
   - Fallback options?

2. **Sound & Haptics:**
   - Implement sound effects for actions?
   - Which library (react-native-sound, expo-av)?
   - Haptic feedback patterns?

3. **Offline vs Online:**
   - Pure offline app or cloud sync future?
   - If cloud: which backend (Firebase, Supabase)?
   - Authentication needed?

4. **Testing Scope:**
   - Unit tests for all components?
   - Integration tests for game logic?
   - E2E tests with Detox/Maestro?

5. **Platform Differences:**
   - iOS vs Android specific optimizations?
   - Different UI patterns per platform?
   - Tablet support?

6. **Accessibility:**
   - Screen reader support priority?
   - Colorblind mode needed?
   - Larger text/touch targets?

---

## Next Steps

1. ✅ Read all plan files (01-13)
2. ⬜ Resolve open questions with stakeholder
3. ⬜ Start Phase 0: Design System Sync
4. ⬜ Setup project dependencies (zustand, mmkv, reanimated)
5. ⬜ Create baseline components

---

## References

- Web source code: [src/web/](../src/web/)
- Mobile components: [src/components/](../src/components/)
- Theme config: [src/theme/restyle.ts](../src/theme/restyle.ts)
- Component guide: [COMPONENTS_GUIDE.md](../COMPONENTS_GUIDE.md)
