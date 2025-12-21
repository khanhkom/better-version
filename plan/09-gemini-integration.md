# 09 - Gemini AI Integration

**Date:** 2025-12-22
**Priority:** 🟢 P2
**Status:** Draft

---

## Service Implementation

```typescript
// src/services/gemini.ts
import { GameState } from '@/types/game';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

type GeminiResponse = {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
};

/**
 * Get farming advice from Gemini based on game state
 */
export const getGeminiAdvice = async (gameState: GameState): Promise<string> => {
  try {
    const prompt = buildPrompt(gameState);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 150,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const advice = data.candidates[0]?.content.parts[0]?.text;

    return advice || 'Keep farming! 🌱';
  } catch (error) {
    console.error('[Gemini] Failed to fetch advice:', error);
    return getFallbackAdvice(gameState);
  }
};

/**
 * Build context-aware prompt for Gemini
 */
const buildPrompt = (gameState: GameState): string => {
  const plantedCrops = gameState.plots.filter((p) => p.status === 'PLANTED').length;
  const readyCrops = gameState.plots.filter((p) => p.status === 'READY').length;
  const totalHabits = gameState.habits.length;
  const activeHabits = gameState.habits.filter((h) => h.streak > 0).length;

  return `You are a wise farming advisor. Give a short, encouraging farming tip (max 2 sentences) based on this:
- Money: ${gameState.money}💰
- Level: ${gameState.level}
- Planted crops: ${plantedCrops}
- Ready to harvest: ${readyCrops}
- Active habits: ${activeHabits}/${totalHabits}

Be friendly, concise, and use farm emojis. Focus on one actionable tip.`;
};

/**
 * Fallback advice when API fails
 */
const getFallbackAdvice = (gameState: GameState): string => {
  const advice = [
    'Plant more crops to increase your income! 🌱',
    'Check your habits daily for extra XP! 📋',
    'Use the Pomodoro timer to focus better! 🍅',
    'Harvest ready crops before they wilt! 🌽',
    'Save money for better seeds! 💰',
    'Build a daily habit streak for bonuses! 🔥',
  ];

  return advice[Math.floor(Math.random() * advice.length)];
};
```

---

## Rate Limiting

```typescript
// src/utils/rateLimit.ts
type RequestQueue = {
  lastRequest: number;
  requestCount: number;
};

const queue: RequestQueue = {
  lastRequest: 0,
  requestCount: 0,
};

const RATE_LIMIT = {
  maxRequests: 6,       // 6 requests
  windowMs: 60 * 1000,  // per minute
  minInterval: 10000,   // 10s between requests
};

/**
 * Check if request is allowed
 */
export const canMakeRequest = (): boolean => {
  const now = Date.now();

  // Reset window if expired
  if (now - queue.lastRequest > RATE_LIMIT.windowMs) {
    queue.requestCount = 0;
  }

  // Check minimum interval
  if (now - queue.lastRequest < RATE_LIMIT.minInterval) {
    return false;
  }

  // Check max requests
  if (queue.requestCount >= RATE_LIMIT.maxRequests) {
    return false;
  }

  return true;
};

/**
 * Record request
 */
export const recordRequest = (): void => {
  queue.lastRequest = Date.now();
  queue.requestCount++;
};
```

---

## Usage in AdviceBox

```typescript
// src/components/organisms/AdviceBox.tsx
import { getGeminiAdvice } from '@/services/gemini';
import { canMakeRequest, recordRequest } from '@/utils/rateLimit';

const fetchAdvice = async () => {
  if (!canMakeRequest()) {
    setAdvice('Please wait before requesting more advice! ⏱️');
    return;
  }

  setLoading(true);
  try {
    recordRequest();
    const newAdvice = await getGeminiAdvice(gameState);
    setAdvice(newAdvice);
  } catch (error) {
    setAdvice('Could not fetch advice. Keep farming! 🚜');
  } finally {
    setLoading(false);
  }
};
```

---

## Environment Setup

```bash
# .env
GEMINI_API_KEY=your_api_key_here
```

```typescript
// babel.config.js - Add env plugin
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
    }],
  ],
};
```

---

## Next Steps

1. ⬜ Create Gemini service
2. ⬜ Implement rate limiting
3. ⬜ Add API key to environment
4. ⬜ Integrate into AdviceBox
5. ⬜ Test API calls
6. ⬜ Test fallback behavior
7. ⬜ Monitor API costs
