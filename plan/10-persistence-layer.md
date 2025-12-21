# 10 - Persistence Layer

**Date:** 2025-12-22
**Priority:** 🔴 P0
**Status:** Draft

---

## MMKV Storage Structure

```typescript
// Storage keys
const STORAGE_KEYS = {
  GAME_STATE: 'pixel-farm-state',
  BACKUP: 'pixel-farm-backup',
  VERSION: 'pixel-farm-version',
};

// Handled automatically by Zustand persist middleware
// See Plan 02: State Management for implementation
```

---

## Auto-Save System

```typescript
// src/hooks/useAutoSave.ts
import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

const AUTO_SAVE_INTERVAL = 5000; // 5 seconds

export const useAutoSave = () => {
  const save = useGameStore((state) => state.save);

  useEffect(() => {
    const interval = setInterval(() => {
      save();
      console.log('[AutoSave] Game state saved');
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [save]);
};
```

---

## Backup & Restore

```typescript
// src/utils/backup.ts
import { MMKV } from 'react-native-mmkv';
import type { GameState } from '@/types/game';

const storage = new MMKV({ id: 'pixel-farm-storage' });

/**
 * Create backup of current game state
 */
export const createBackup = (): boolean => {
  try {
    const currentState = storage.getString('pixel-farm-state');
    if (!currentState) return false;

    storage.set('pixel-farm-backup', currentState);
    storage.set('pixel-farm-backup-time', Date.now());

    return true;
  } catch (error) {
    console.error('[Backup] Failed to create backup:', error);
    return false;
  }
};

/**
 * Restore from backup
 */
export const restoreBackup = (): boolean => {
  try {
    const backup = storage.getString('pixel-farm-backup');
    if (!backup) return false;

    storage.set('pixel-farm-state', backup);

    return true;
  } catch (error) {
    console.error('[Backup] Failed to restore backup:', error);
    return false;
  }
};

/**
 * Export game state as JSON string
 */
export const exportGameState = (): string | null => {
  try {
    const state = storage.getString('pixel-farm-state');
    return state || null;
  } catch (error) {
    console.error('[Export] Failed to export:', error);
    return null;
  }
};

/**
 * Import game state from JSON string
 */
export const importGameState = (jsonString: string): boolean => {
  try {
    // Validate JSON
    const parsed = JSON.parse(jsonString);

    // Create backup before import
    createBackup();

    // Import new state
    storage.set('pixel-farm-state', jsonString);

    return true;
  } catch (error) {
    console.error('[Import] Failed to import:', error);
    return false;
  }
};
```

---

## Data Validation

```typescript
// src/utils/validation.ts
import type { GameState } from '@/types/game';

/**
 * Validate game state structure
 */
export const validateGameState = (state: unknown): state is GameState => {
  if (typeof state !== 'object' || state === null) return false;

  const s = state as Partial<GameState>;

  // Required fields
  if (typeof s.money !== 'number') return false;
  if (typeof s.diamonds !== 'number') return false;
  if (typeof s.xp !== 'number') return false;
  if (typeof s.level !== 'number') return false;
  if (!Array.isArray(s.plots)) return false;

  // Value constraints
  if (s.money < 0 || s.diamonds < 0 || s.xp < 0 || s.level < 1) return false;

  return true;
};

/**
 * Sanitize game state
 */
export const sanitizeGameState = (state: GameState): GameState => {
  return {
    ...state,
    money: Math.max(0, Math.floor(state.money)),
    diamonds: Math.max(0, Math.floor(state.diamonds)),
    xp: Math.max(0, Math.floor(state.xp)),
    level: Math.max(1, Math.floor(state.level)),
  };
};
```

---

## Migration System

```typescript
// src/utils/migration.ts
import type { GameState } from '@/types/game';

type Migration = (oldState: any) => GameState;

const migrations: Record<number, Migration> = {
  1: (oldState) => {
    // Version 1 migration (initial)
    return oldState;
  },
  // Future migrations
  // 2: (oldState) => { ... },
};

/**
 * Migrate game state to current version
 */
export const migrateGameState = (state: any, fromVersion: number, toVersion: number): GameState => {
  let migratedState = state;

  for (let version = fromVersion + 1; version <= toVersion; version++) {
    const migration = migrations[version];
    if (migration) {
      migratedState = migration(migratedState);
    }
  }

  return migratedState;
};
```

---

## Crash Recovery

```typescript
// src/hooks/useCrashRecovery.ts
import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { createBackup } from '@/utils/backup';

export const useCrashRecovery = () => {
  useEffect(() => {
    // Create backup on mount (app start)
    createBackup();

    // Create backup before unmount (app close)
    return () => {
      createBackup();
    };
  }, []);
};
```

---

## Next Steps

1. ✅ Zustand persist configured (Plan 02)
2. ⬜ Implement auto-save hook
3. ⬜ Implement backup/restore utilities
4. ⬜ Add data validation
5. ⬜ Test persistence across app restarts
6. ⬜ Test crash recovery
