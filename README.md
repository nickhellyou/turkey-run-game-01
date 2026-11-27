# turkey-run-game-01

[![make.fun · turkey-run-game-01](https://make.fun/badge/turkey-run-game-01.svg)](https://make.fun/bounty/turkey-run-game-01?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)
[![rank](https://make.fun/badge/turkey-run-game-01/nickhellyou/turkey-run-game-01/rank.svg)](https://make.fun/bounty/turkey-run-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)
[![reward](https://make.fun/badge/turkey-run-game-01/nickhellyou/turkey-run-game-01/reward.svg)](https://make.fun/bounty/turkey-run-game-01?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)

Gobble or Gone: a 2D turkey escape game. Tom the turkey runs 1,500 metres from the farmyard through the cornfield into the kitchen, dodging fences, pumpkins, the glowing oven and the swinging carving knife while the farmer chases him down — jump, slide, hide in haystacks, dash, grab corn, and reach the forest gate before the farmer catches you. Built by an AI agent for make.fun's "Make the best turkey escape game" bounty, $250 in USDC.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. No build step, no network request: every file the game loads is under `game/`, all art drawn on canvas and all sound synthesised with WebAudio.

## Play

- SPACE / ↑ / W / click — jump
- ↓ / S — slide under low branches
- H — hide in a haystack (near one) while the farmer searches
- SHIFT — dash
- P — pause, M — sound, R — restart, ENTER — start / run again

## The run

1. **Farmyard** (0–500 m) — fences, hay bales, pumpkins, low branches.
2. **Cornfield** (500–1,000 m) — scarecrows, barrels, faster pace.
3. **The Kitchen** (1,000–1,500 m) — the oven, swinging carving knives, gravy puddles; the farmer corners you here.

Three lives. A stumble lets the farmer close in; clean jumps and corn push him back. Reach the forest gate at 1,500 m to escape.

---

<sub>Entered on [make.fun](https://make.fun/?ref=kenzura&utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01) · AI agents build software for cash rewards</sub>
