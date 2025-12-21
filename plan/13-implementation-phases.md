# 13 - Implementation Phases: Rollout Plan

**Date:** 2025-12-22
**Priority:** 🔴 P0
**Status:** Draft

---

## Phase 0: Foundation (Week 1)

**Goal:** Setup infrastructure and base components

### Tasks
- [ ] Install dependencies
  - `zustand` - State management
  - `react-native-mmkv` - Fast storage
  - `react-native-reanimated` - Animations
  - `react-native-linear-gradient` - Gradients
  - `react-native-svg` - SVG support
  - `@react-native-community/blur` - Blur effects
  - `react-native-dotenv` - Environment variables

- [ ] Update [src/theme/restyle.ts](../src/theme/restyle.ts)
  - Add farm colors (farmBoard, farmBorder, etc.)
  - Add feature colors (focusRed, breakGreen, etc.)
  - Add text variants (pixelHeader, pixelBody)
  - Add shadows definitions

- [ ] Create type definitions [src/types/game.ts](../src/types/game.ts)
  - CropId, PlotStatus, ToolType types
  - GameState, LandPlot, Habit types
  - Crop, PomodoroSession types

- [ ] Create game constants [src/constants/game.ts](../src/constants/game.ts)
  - CROPS configuration
  - XP_PER_LEVEL, TICK_RATE
  - INITIAL_PLOTS

- [ ] Implement Zustand store [src/stores/gameStore.ts](../src/stores/gameStore.ts)
  - Full GameStore implementation
  - MMKV persistence integration
  - All actions (player, farm, shop, habits, pomodoro)

- [ ] Create base atoms
  - [Emoji.tsx](../src/components/atoms/Emoji.tsx)
  - [CircularProgress.tsx](../src/components/atoms/CircularProgress.tsx)
  - [IconButton.tsx](../src/components/atoms/IconButton.tsx)
  - Extend Card with farm variants

**Deliverable:** Functional theme + state management + base components

**Success Criteria:**
- [ ] Theme renders farm colors correctly
- [ ] Store persists data across app restarts
- [ ] Base atoms render without errors

---

## Phase 1: Core Farm (Week 2)

**Goal:** Playable farm with plant & harvest mechanics

### Tasks
- [ ] Create custom hooks
  - [useGameLoop.ts](../src/hooks/useGameLoop.ts) - Crop growth system
  - [useFarm.ts](../src/hooks/useFarm.ts) - Farm actions
  - [usePlayerStats.ts](../src/hooks/usePlayerStats.ts) - Player data
  - [useAutoSave.ts](../src/hooks/useAutoSave.ts) - Auto-save every 5s

- [ ] Create molecules
  - [PlotCard.tsx](../src/components/molecules/PlotCard.tsx) - Farm plot with sway animation
  - [TabBar.tsx](../src/components/molecules/TabBar.tsx) - Tab switcher
  - [ToolButton.tsx](../src/components/molecules/ToolButton.tsx) - Tool selector

- [ ] Create organisms
  - [FarmGrid.tsx](../src/components/organisms/FarmGrid.tsx) - Grid of plots
  - [FarmHeader.tsx](../src/components/organisms/FarmHeader.tsx) - Stats display
  - [ActionToolbar.tsx](../src/components/organisms/ActionToolbar.tsx) - Tool selector
  - [ModalWrapper.tsx](../src/components/organisms/ModalWrapper.tsx) - Reusable modal

- [ ] Create [FarmGameScreen.tsx](../src/screens/FarmGameScreen.tsx)
  - Layout with LinearGradient background
  - Integrate FarmHeader, FarmGrid, ActionToolbar
  - Implement plot interaction logic

- [ ] Update navigation to use FarmGameScreen as initial

**Deliverable:** Functional farm with planting and harvesting

**Success Criteria:**
- [ ] Can plant seeds on empty plots
- [ ] Crops grow automatically (1s tick)
- [ ] Can harvest ready crops
- [ ] Inventory updates correctly
- [ ] Game loop runs smoothly at 60fps

---

## Phase 2: Shop & Inventory (Week 3)

**Goal:** Full economy system with buy/sell

### Tasks
- [ ] Create molecules
  - [ConfirmDialog.tsx](../src/components/molecules/ConfirmDialog.tsx) - Quantity selector + confirm

- [ ] Create organisms
  - [ShopGrid.tsx](../src/components/organisms/ShopGrid.tsx) - Buy/sell interface
  - [InventoryGrid.tsx](../src/components/organisms/InventoryGrid.tsx) - View inventory
  - [NavigationBar.tsx](../src/components/organisms/NavigationBar.tsx) - Bottom nav buttons

- [ ] Create [ShopModal.tsx](../src/components/modals/ShopModal.tsx)
  - 4 tabs: Giống, Vật Phẩm, Kho hàng, Kho Giống
  - Buy seeds logic
  - Sell harvested crops logic
  - Currency validation

- [ ] Integrate ShopModal into FarmGameScreen

**Deliverable:** Working shop and inventory system

**Success Criteria:**
- [ ] Can buy seeds with money
- [ ] Can sell harvested crops for money
- [ ] Currency updates correctly
- [ ] Cannot buy with insufficient funds
- [ ] Cannot sell items not owned

---

## Phase 3: Habits (Week 4)

**Goal:** Habit tracking with streak calculation

### Tasks
- [ ] Create molecules
  - [HabitItem.tsx](../src/components/molecules/HabitItem.tsx) - Single habit row
  - [StatGrid.tsx](../src/components/molecules/StatGrid.tsx) - 7-day completion grid

- [ ] Create organisms
  - [HabitList.tsx](../src/components/organisms/HabitList.tsx) - List of habits
  - [HabitStats.tsx](../src/components/organisms/HabitStats.tsx) - Statistics view
  - [AddHabitForm.tsx](../src/components/organisms/AddHabitForm.tsx) - Add new habit

- [ ] Create [HabitBoardModal.tsx](../src/components/modals/HabitBoardModal.tsx)
  - 3 tabs: Nhiệm Vụ, Thống Kê, Thêm
  - Habit CRUD operations
  - Streak calculation
  - Completion toggle

- [ ] Integrate HabitBoardModal into FarmGameScreen

**Deliverable:** Full habit tracking system

**Success Criteria:**
- [ ] Can add/delete habits
- [ ] Can mark habits complete for day
- [ ] Streak calculates correctly
- [ ] 7-day grid displays completion history
- [ ] Earns XP for habit completion

---

## Phase 4: Pomodoro (Week 5)

**Goal:** Focus timer with rewards

### Tasks
- [ ] Create hooks
  - [usePomodoroLoop.ts](../src/hooks/usePomodoroLoop.ts) - Timer tick + background handling

- [ ] Create organisms
  - [PomodoroTimer.tsx](../src/components/organisms/PomodoroTimer.tsx) - Timer UI with controls
  - [MinimizedPomodoroWidget.tsx](../src/components/organisms/MinimizedPomodoroWidget.tsx) - Floating timer

- [ ] Create [FocusTimerModal.tsx](../src/components/modals/FocusTimerModal.tsx)
  - Start/pause/reset controls
  - Focus mode (25min) / Break mode (5min)
  - Circular progress display
  - Minimize functionality

- [ ] Integrate FocusTimerModal and MinimizedWidget into FarmGameScreen

- [ ] Implement background timer logic
  - Calculate elapsed time on foreground
  - Local notifications on completion (optional)

**Deliverable:** Working Pomodoro timer

**Success Criteria:**
- [ ] Timer counts down accurately
- [ ] Can pause/resume timer
- [ ] Minimized widget shows timer
- [ ] Earns rewards on completion
- [ ] Works correctly when app backgrounded

---

## Phase 5: Polish & AI (Week 6)

**Goal:** Gemini AI, animations, sounds, bug fixes

### Tasks
- [ ] Implement Gemini service
  - [gemini.ts](../src/services/gemini.ts) - API integration
  - [rateLimit.ts](../src/utils/rateLimit.ts) - Rate limiting
  - Context-aware prompts
  - Fallback advice

- [ ] Create [AdviceBox.tsx](../src/components/organisms/AdviceBox.tsx)
  - Display Gemini advice
  - Refresh button
  - Loading states

- [ ] Add animations
  - Sway animation for crops (Reanimated)
  - Modal slide/fade animations
  - Button bounce on press
  - Harvest celebration

- [ ] Add haptic feedback
  - Plant/harvest actions
  - Button presses
  - Timer completion

- [ ] (Optional) Add sounds
  - Plant/harvest sounds
  - Timer tick/complete
  - Background music

- [ ] Bug fixes & optimization
  - Performance profiling
  - Memory leak checks
  - Edge case handling
  - Error boundaries

- [ ] Testing
  - Unit tests for stores
  - Component tests
  - Integration tests
  - Manual QA

**Deliverable:** Production-ready app

**Success Criteria:**
- [ ] Gemini AI provides contextual advice
- [ ] Animations run at 60fps
- [ ] No memory leaks
- [ ] No crashes
- [ ] Test coverage >70%

---

## MVP Definition

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

## Dependency Graph

```
Phase 0 (Foundation)
    ↓
Phase 1 (Core Farm)
    ↓
    ├─→ Phase 2 (Shop)
    ├─→ Phase 3 (Habits)
    └─→ Phase 4 (Pomodoro)
           ↓
       Phase 5 (Polish)
```

**Critical Path:** Phase 0 → Phase 1 → Phase 2 → Phase 5

---

## Risk Mitigation

### High Priority Risks
1. **Performance Issues** → Profile early, optimize loops
2. **State Persistence** → Test thoroughly, implement backups
3. **Background Timer** → Handle app lifecycle correctly

### Contingency Plans
- If Gemini API unreliable → Use only fallback advice
- If animations laggy → Reduce complexity or disable
- If MMKV issues → Fallback to AsyncStorage

---

## Testing Checkpoints

**End of Phase 1:**
- [ ] Farm grid renders correctly
- [ ] Crops grow automatically
- [ ] Can plant and harvest
- [ ] No memory leaks

**End of Phase 2:**
- [ ] Shop buy/sell works
- [ ] Currency updates correctly
- [ ] Cannot exploit economy

**End of Phase 3:**
- [ ] Habits save/load correctly
- [ ] Streak calculates accurately
- [ ] No date/timezone issues

**End of Phase 4:**
- [ ] Timer accurate within 1s
- [ ] Background handling works
- [ ] Rewards given correctly

**End of Phase 5:**
- [ ] No crashes in 30min play session
- [ ] Runs smoothly on low-end devices
- [ ] All features work together

---

## Beta Testing Criteria

**Ready for Beta when:**
- [ ] All MVP features complete
- [ ] No critical bugs
- [ ] Test coverage >70%
- [ ] Performance acceptable (60fps)
- [ ] Data persistence reliable
- [ ] Works on iOS and Android

---

## Timeline Summary

| Phase | Duration | Deliverable | Dependencies |
|-------|----------|-------------|--------------|
| Phase 0 | Week 1 | Foundation | None |
| Phase 1 | Week 2 | Core Farm | Phase 0 |
| Phase 2 | Week 3 | Shop | Phase 1 |
| Phase 3 | Week 4 | Habits | Phase 1 |
| Phase 4 | Week 5 | Pomodoro | Phase 1 |
| Phase 5 | Week 6 | Polish | Phases 2-4 |
| **Total** | **6 weeks** | **MVP** | - |

---

## Success Metrics

**Technical:**
- 60fps performance
- <100ms state update latency
- <3s app launch time
- Zero data loss
- 100% TypeScript coverage

**Functional:**
- All web features implemented
- Offline functionality works
- Game loop accurate within 1s
- Persistence across restarts

**Quality:**
- >70% test coverage
- Zero critical bugs
- ESLint/TypeScript errors = 0
- Passes manual QA checklist

---

## Next Steps

1. ✅ Review all 13 plan files
2. ⬜ Get approval on approach
3. ⬜ Start Phase 0: Foundation
4. ⬜ Install dependencies
5. ⬜ Update theme with farm colors
6. ⬜ Implement game store
7. ⬜ Create base atoms
8. ⬜ Proceed through phases sequentially

---

## References

- All plan files: [plan/](../plan/)
- Web source: [src/web/](../src/web/)
- Current codebase: [src/](../src/)
- Component guide: [COMPONENTS_GUIDE.md](../COMPONENTS_GUIDE.md)
