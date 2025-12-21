# 12 - Testing Strategy

**Date:** 2025-12-22
**Priority:** 🟢 P2
**Status:** Draft

---

## Test Coverage Goals

- **Unit Tests:** >80% coverage for stores, utils, hooks
- **Component Tests:** >70% for molecules and organisms
- **Snapshot Tests:** All atoms and molecules
- **Integration Tests:** Critical user flows
- **E2E Tests:** (Optional) Main game loop

---

## Unit Tests

### Store Tests

```typescript
// __tests__/stores/gameStore.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useGameStore } from '@/stores/gameStore';

describe('gameStore', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  describe('Player Stats', () => {
    it('adds money correctly', () => {
      const { result } = renderHook(() => useGameStore());
      act(() => result.current.addMoney(50));
      expect(result.current.money).toBe(150);
    });

    it('prevents spending more than available', () => {
      const { result } = renderHook(() => useGameStore());
      act(() => {
        const success = result.current.spendMoney(200);
        expect(success).toBe(false);
      });
      expect(result.current.money).toBe(100);
    });

    it('calculates level from XP', () => {
      const { result } = renderHook(() => useGameStore());
      act(() => result.current.addXP(250));
      expect(result.current.level).toBe(3);
    });
  });

  describe('Farm Actions', () => {
    it('plants crop and deducts seed', () => {
      const { result } = renderHook(() => useGameStore());
      const plotId = result.current.plots[0].id;

      act(() => {
        const success = result.current.plantCrop(plotId, 'tomato');
        expect(success).toBe(true);
      });

      expect(result.current.plots[0].status).toBe('PLANTED');
      expect(result.current.inventory.tomato).toBe(4);
    });

    it('harvests crop and adds to harvested', () => {
      const { result } = renderHook(() => useGameStore());
      const plotId = result.current.plots[0].id;

      act(() => {
        result.current.plantCrop(plotId, 'tomato');
        // Simulate crop ready
        useGameStore.setState((state) => ({
          plots: state.plots.map((p) =>
            p.id === plotId ? { ...p, status: 'READY', progress: 100 } : p
          ),
        }));
        result.current.harvestCrop(plotId);
      });

      expect(result.current.harvested.tomato).toBe(1);
      expect(result.current.plots[0].status).toBe('EMPTY');
    });
  });

  describe('Shop Actions', () => {
    it('buys seeds with money', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        const success = result.current.buySeed('tomato', 2);
        expect(success).toBe(true);
      });

      expect(result.current.inventory.tomato).toBe(7);
      expect(result.current.money).toBe(80); // 100 - (10 * 2)
    });

    it('sells harvested crops for money', () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.addHarvest('tomato', 3);
        result.current.sellHarvest('tomato', 2);
      });

      expect(result.current.harvested.tomato).toBe(1);
      expect(result.current.money).toBe(150); // 100 + (25 * 2)
    });
  });
});
```

---

## Component Tests

### Atom Tests

```typescript
// __tests__/components/atoms/PlotCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PlotCard } from '@/components/molecules/PlotCard';
import { CROPS } from '@/constants/game';

describe('PlotCard', () => {
  it('renders empty plot', () => {
    const plot = { id: '1', status: 'EMPTY', progress: 0 };
    const { getByText } = render(<PlotCard plot={plot} onPress={jest.fn()} />);
    expect(getByText('🌱')).toBeTruthy();
  });

  it('renders planted crop with progress', () => {
    const plot = {
      id: '1',
      status: 'PLANTED',
      cropId: 'tomato',
      plantedAt: Date.now(),
      progress: 50,
    };
    const { getByText } = render(<PlotCard plot={plot} onPress={jest.fn()} />);
    expect(getByText(CROPS.tomato.icon)).toBeTruthy();
  });

  it('calls onPress when clicked', () => {
    const onPress = jest.fn();
    const plot = { id: '1', status: 'READY', cropId: 'tomato', progress: 100 };
    const { getByTestId } = render(<PlotCard plot={plot} onPress={onPress} />);

    fireEvent.press(getByTestId('plot-card'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

---

## Snapshot Tests

```typescript
// __tests__/components/atoms/__snapshots__/
import React from 'react';
import renderer from 'react-test-renderer';
import { Emoji } from '@/components/atoms/Emoji';
import { CircularProgress } from '@/components/atoms/CircularProgress';

describe('Snapshots', () => {
  it('Emoji renders correctly', () => {
    const tree = renderer.create(<Emoji symbol="🍅" size={40} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('CircularProgress renders correctly', () => {
    const tree = renderer.create(<CircularProgress progress={75} size={200} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
```

---

## Integration Tests

```typescript
// __tests__/integration/farmGame.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { FarmGameScreen } from '@/screens/FarmGameScreen';
import { useGameStore } from '@/stores/gameStore';

describe('Farm Game Integration', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('plants and harvests crop flow', async () => {
    const { getByText, getByTestId } = render(<FarmGameScreen />);

    // Select plant tool
    fireEvent.press(getByText('🌱 Plant'));

    // Click empty plot
    fireEvent.press(getByTestId('plot-0'));

    // Select tomato seed
    fireEvent.press(getByText('🍅 Cà chua'));

    // Verify plot is planted
    await waitFor(() => {
      expect(useGameStore.getState().plots[0].status).toBe('PLANTED');
    });

    // Simulate crop ready
    act(() => {
      useGameStore.setState((state) => ({
        plots: state.plots.map((p, i) =>
          i === 0 ? { ...p, status: 'READY', progress: 100 } : p
        ),
      }));
    });

    // Harvest
    fireEvent.press(getByTestId('plot-0'));

    await waitFor(() => {
      expect(useGameStore.getState().harvested.tomato).toBe(1);
    });
  });
});
```

---

## Performance Tests

```typescript
// __tests__/performance/gameLoop.test.ts
import { renderHook } from '@testing-library/react-hooks';
import { useGameLoop } from '@/hooks/useGameLoop';

describe('Game Loop Performance', () => {
  it('updates multiple plots efficiently', () => {
    const start = performance.now();

    renderHook(() => useGameLoop());

    // Simulate 100 ticks
    for (let i = 0; i < 100; i++) {
      jest.advanceTimersByTime(1000);
    }

    const end = performance.now();
    const duration = end - start;

    // Should complete in <1s
    expect(duration).toBeLessThan(1000);
  });
});
```

---

## E2E Tests (Optional - Detox)

```typescript
// e2e/farmGame.e2e.ts
describe('Farm Game E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should complete full game cycle', async () => {
    // Plant crop
    await element(by.id('tool-plant')).tap();
    await element(by.id('plot-0')).tap();
    await element(by.text('🍅 Cà chua')).tap();

    // Wait for growth (fast-forward in test)
    await device.setSystemTime(Date.now() + 15000 * 1000);

    // Harvest
    await element(by.id('plot-0')).tap();

    // Verify harvested
    await expect(element(by.id('harvested-tomato'))).toHaveText('1');
  });
});
```

---

## Test Scripts

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "detox test"
  }
}
```

---

## Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-reanimated|react-native-mmkv)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
};
```

---

## Next Steps

1. ⬜ Setup Jest configuration
2. ⬜ Write store unit tests
3. ⬜ Write component tests
4. ⬜ Add snapshot tests
5. ⬜ Create integration tests
6. ⬜ (Optional) Setup Detox for E2E
7. ⬜ Run coverage report
