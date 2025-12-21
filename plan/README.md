# 📋 Migration Plan: Web UI → Mobile App

**Project:** Gemini Pixel Farm
**Date Created:** 2025-12-22
**Status:** Draft - Ready for Implementation

---

## 🎯 Objective

Migrate "Gemini Pixel Farm" web application to React Native mobile app with identical features, visual design, and game mechanics while maintaining clean architecture, scalability, and code reusability.

---

## 📚 Plan Files Overview

| File | Priority | Title | Description |
|------|----------|-------|-------------|
| [00-overview.md](./00-overview.md) | 🔴 P0 | Migration Overview | Tech stack comparison, timeline, success metrics, risk analysis |
| [01-design-system-sync.md](./01-design-system-sync.md) | 🔴 P0 | Design System Sync | Color tokens, typography, component variants, animations |
| [02-state-management.md](./02-state-management.md) | 🔴 P0 | State Management | Zustand store architecture, MMKV persistence, game loop |
| [03-component-architecture.md](./03-component-architecture.md) | 🔴 P0 | Component Architecture | Atomic Design breakdown, component hierarchy, reusability |
| [04-farm-screen-implementation.md](./04-farm-screen-implementation.md) | 🔴 P0 | Farm Screen | Main game screen layout, organisms integration |
| [05-modal-system.md](./05-modal-system.md) | 🔴 P0 | Modal System | Reusable modal wrapper, animations, blur backdrop |
| [06-habit-tracking.md](./06-habit-tracking.md) | 🟡 P1 | Habit Tracking | Habit board modal, streak calculation, 7-day grid |
| [07-pomodoro-timer.md](./07-pomodoro-timer.md) | 🟡 P1 | Pomodoro Timer | Focus timer, circular progress, background support |
| [08-shop-inventory.md](./08-shop-inventory.md) | 🔴 P0 | Shop & Inventory | Shop modal, buy/sell mechanics, currency management |
| [09-gemini-integration.md](./09-gemini-integration.md) | 🟢 P2 | Gemini AI Integration | API integration, rate limiting, fallback advice |
| [10-persistence-layer.md](./10-persistence-layer.md) | 🔴 P0 | Persistence Layer | Auto-save, backup/restore, data validation |
| [11-navigation-flow.md](./11-navigation-flow.md) | 🟡 P1 | Navigation Flow | Screen routes, deep linking, splash screen |
| [12-testing-strategy.md](./12-testing-strategy.md) | 🟢 P2 | Testing Strategy | Unit tests, component tests, integration tests, E2E |
| [13-implementation-phases.md](./13-implementation-phases.md) | 🔴 P0 | Implementation Phases | 6-week rollout plan, dependencies, milestones |

---

## 🏗️ Implementation Phases

### Phase 0: Foundation (Week 1) 🔴
**Goal:** Setup infrastructure and base components

**Key Tasks:**
- Install dependencies (zustand, mmkv, reanimated, etc.)
- Update Restyle theme with farm colors
- Create type definitions and game constants
- Implement Zustand store with MMKV persistence
- Create base atoms (Emoji, CircularProgress, IconButton)

**Deliverable:** Functional theme + state management + base components

---

### Phase 1: Core Farm (Week 2) 🔴
**Goal:** Playable farm with plant & harvest mechanics

**Key Tasks:**
- Create custom hooks (useGameLoop, useFarm, useAutoSave)
- Build molecules (PlotCard, TabBar, ToolButton)
- Build organisms (FarmGrid, FarmHeader, ActionToolbar, ModalWrapper)
- Create FarmGameScreen
- Implement plot interaction logic

**Deliverable:** Functional farm with planting and harvesting

---

### Phase 2: Shop & Inventory (Week 3) 🔴
**Goal:** Full economy system with buy/sell

**Key Tasks:**
- Create ConfirmDialog molecule
- Build ShopGrid and InventoryGrid organisms
- Create ShopModal with 4 tabs
- Implement buy/sell logic

**Deliverable:** Working shop and inventory system

---

### Phase 3: Habits (Week 4) 🟡
**Goal:** Habit tracking with streak calculation

**Key Tasks:**
- Create HabitItem and StatGrid molecules
- Build HabitList, HabitStats, AddHabitForm organisms
- Create HabitBoardModal with 3 tabs
- Implement streak calculation

**Deliverable:** Full habit tracking system

---

### Phase 4: Pomodoro (Week 5) 🟡
**Goal:** Focus timer with rewards

**Key Tasks:**
- Create usePomodoroLoop hook
- Build PomodoroTimer organism
- Create FocusTimerModal
- Implement background timer logic
- Create MinimizedPomodoroWidget

**Deliverable:** Working Pomodoro timer

---

### Phase 5: Polish & AI (Week 6) 🟢
**Goal:** Gemini AI, animations, sounds, bug fixes

**Key Tasks:**
- Implement Gemini service with rate limiting
- Create AdviceBox organism
- Add animations (sway, fade, bounce)
- Add haptic feedback
- Bug fixes & optimization
- Testing (unit, component, integration)

**Deliverable:** Production-ready app

---

## 📦 Dependencies

### Required Packages
```bash
yarn add zustand react-native-mmkv
yarn add react-native-reanimated react-native-linear-gradient
yarn add react-native-svg @react-native-community/blur
yarn add react-native-dotenv
```

### Optional Packages
```bash
yarn add react-native-sound          # Sound effects
yarn add react-native-haptic-feedback # Haptics
yarn add detox                        # E2E testing
```

---

## 🎯 MVP Definition

**Minimum Viable Product includes:**
- ✅ Farm grid with 6 plots
- ✅ 4 crop types (Tomato, Carrot, Corn, Watermelon)
- ✅ Plant & harvest mechanics
- ✅ Automatic crop growth
- ✅ Shop (buy seeds, sell crops)
- ✅ Currency system (Money, Diamonds)
- ✅ XP & Leveling
- ✅ Data persistence
- ✅ Habit tracking
- ✅ Pomodoro timer
- ⚠️ Gemini AI (optional for MVP)
- ⚠️ Sounds (optional for MVP)

---

## 📊 Success Metrics

### Technical
- ✅ 60fps performance
- ✅ <100ms state update latency
- ✅ <3s app launch time
- ✅ Zero data loss
- ✅ 100% TypeScript coverage

### Functional
- ✅ All web features implemented
- ✅ Offline functionality works
- ✅ Game loop accurate within 1s
- ✅ Persistence across restarts

### Quality
- ✅ >70% test coverage
- ✅ Zero critical bugs
- ✅ ESLint/TypeScript errors = 0
- ✅ Passes manual QA checklist

---

## 🚨 Critical Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Performance degradation | 🔴 High | Profile early, throttle updates, optimize re-renders |
| State persistence failures | 🔴 High | Auto-save every 5s, backups, validation |
| Background timer issues | 🔴 High | Calculate elapsed time on foreground, local notifications |
| Gemini API costs | 🟡 Medium | Rate limiting (6 req/min), cache responses, fallbacks |
| Animation performance | 🟡 Medium | Use Reanimated (UI thread), limit concurrent animations |

---

## 📝 Reading Order

**For Implementation:**
1. Start with [00-overview.md](./00-overview.md) - Understand the big picture
2. Read [13-implementation-phases.md](./13-implementation-phases.md) - Understand the roadmap
3. Follow phases sequentially:
   - [01-design-system-sync.md](./01-design-system-sync.md)
   - [02-state-management.md](./02-state-management.md)
   - [03-component-architecture.md](./03-component-architecture.md)
   - [04-farm-screen-implementation.md](./04-farm-screen-implementation.md)
   - Continue through remaining plans as needed

**For Quick Reference:**
- Design tokens → [01-design-system-sync.md](./01-design-system-sync.md)
- State structure → [02-state-management.md](./02-state-management.md)
- Component list → [03-component-architecture.md](./03-component-architecture.md)
- Testing guide → [12-testing-strategy.md](./12-testing-strategy.md)

---

## 🔗 Key References

- **Web Source Code:** [src/web/](../src/web/)
- **Current Mobile App:** [src/](../src/)
- **Components Guide:** [COMPONENTS_GUIDE.md](../COMPONENTS_GUIDE.md)
- **Theme Config:** [src/theme/restyle.ts](../src/theme/restyle.ts)

---

## ✅ Next Steps

1. ✅ Review all plan files thoroughly
2. ⬜ Get stakeholder approval on approach
3. ⬜ Resolve open questions (fonts, sounds, etc.)
4. ⬜ Start Phase 0: Foundation
   - Install dependencies
   - Update theme
   - Create types and constants
   - Implement game store
5. ⬜ Proceed through phases sequentially
6. ⬜ Test thoroughly at each phase checkpoint
7. ⬜ Deploy MVP for beta testing

---

## 📞 Support

For questions or clarifications on any plan:
1. Read the specific plan file in detail
2. Check related plan files (listed in Dependencies section)
3. Refer to web source code for reference implementation
4. Consult [COMPONENTS_GUIDE.md](../COMPONENTS_GUIDE.md) for conventions

---

**Last Updated:** 2025-12-22
**Total Plan Files:** 14
**Estimated Duration:** 6 weeks
**Target MVP Date:** Week 6
