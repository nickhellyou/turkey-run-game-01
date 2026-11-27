// Gobble or Gone — the road ahead: stages, obstacles, pickups, collisions.
// Obstacles live in world x (pixels from the start line); the camera shows
// worldX - scrollX. 50 px of world = 1 metre.
import { GROUND_Y, GOAL_M, STAGES } from './config.js';
import { mulberry32, pick, range } from './random.js';

export function stageFor(distanceM) {
  return STAGES.find((s) => distanceM < s.to) || STAGES[STAGES.length - 1];
}

// Obstacle kinds. `h` is the height to clear; slideUnder means slide, not jump.
const FARMYARD = [
  { kind: 'fence', w: 26, h: 58 },
  { kind: 'haybale', w: 64, h: 52 },
  { kind: 'pumpkin', w: 46, h: 40 },
  { kind: 'branch', w: 90, h: 34, slideUnder: true },
];
const CORNFIELD = [
  { kind: 'fence', w: 26, h: 58 },
  { kind: 'haybale', w: 64, h: 52 },
  { kind: 'pumpkin', w: 46, h: 40 },
  { kind: 'scarecrow', w: 40, h: 110 },
  { kind: 'barrel', w: 44, h: 56 },
  { kind: 'branch', w: 90, h: 34, slideUnder: true },
];
const KITCHEN = [
  { kind: 'oven', w: 120, h: 86 },
  { kind: 'knife', w: 30, h: 96, swinging: true },
  { kind: 'pot', w: 70, h: 48 },
  { kind: 'puddle', w: 110, h: 12, slideOver: true },
  { kind: 'barrel', w: 44, h: 56 },
];

export class World {
  constructor(seed = 7) {
    this.rng = mulberry32(seed);
    this.obstacles = [];
    this.pickups = [];
    this.haystacks = [];
    this.generatedTo = 0;
    this.generate(0, 4000);
  }

  tableFor(stageName) {
    if (stageName === 'CORNFIELD') return CORNFIELD;
    if (stageName === 'THE KITCHEN') return KITCHEN;
    return FARMYARD;
  }

  // Generate content for world x in [fromX, toX).
  generate(fromX, toX) {
    let x = Math.max(fromX, this.generatedTo || fromX);
    if (x === 0) x = 900;
    while (x < toX) {
      const distM = x / 50;
      const stage = stageFor(distM);
      const gap = range(this.rng, 340, 560) * (distM > 1000 ? 0.85 : 1);
      x += gap;
      const def = pick(this.rng, this.tableFor(stage.name));
      this.obstacles.push({
        kind: def.kind, x, w: def.w, h: def.h,
        slideUnder: !!def.slideUnder, slideOver: !!def.slideOver,
        swinging: !!def.swinging, phase: this.rng() * Math.PI * 2,
        hit: false, cleared: false,
      });
      // Corn trails and the odd golden feather between obstacles.
      const n = 1 + Math.floor(this.rng() * 3);
      for (let i = 0; i < n; i++) {
        const cx = x - 260 - i * 46;
        if (cx > 500) this.pickups.push({ kind: 'corn', x: cx, y: GROUND_Y - 96, taken: false });
      }
      if (this.rng() < 0.16) {
        this.pickups.push({ kind: 'feather', x: x - 140, y: GROUND_Y - 150, taken: false });
      }
      if (this.rng() < 0.3) {
        this.haystacks.push({ x: x + 190, w: 110, h: 74 });
      }
    }
    this.generatedTo = toX;
  }

  ensureAhead(scrollX) {
    if (scrollX + 2600 > this.generatedTo) this.generate(this.generatedTo, this.generatedTo + 3000);
  }

  // AABB overlap between Tom (screen coords) and an obstacle (world coords).
  hitTest(turkey, scrollX, time) {
    for (const o of this.obstacles) {
      if (o.hit || o.cleared) continue;
      const sx = o.x - scrollX;
      if (sx < -160 || sx > 1400) continue;
      const bladeLow = o.swinging ? Math.sin(time * 2.2 + o.phase) > 0.2 : false;
      const otop = GROUND_Y - o.h;
      const overlapX = turkey.x + 8 < sx + o.w && turkey.x + turkey.w - 8 > sx;
      const overlapY = turkey.bottom > otop + 4 && turkey.top < GROUND_Y;
      if (o.swinging && !bladeLow) {
        // Blade swung up out of the way: Tom runs under it safely.
      } else if (o.slideOver) {
        // Gravy puddle: only hurts if Tom runs through it standing up.
        if (overlapX && turkey.onGround && !turkey.sliding && turkey.dashT <= 0) return o;
        // Sliding or dashing across a puddle is safe; jumping over it too.
      } else if (o.slideUnder) {
        // Low branch hangs at GROUND_Y-60..-44: slide under it, or jump over it.
        const bTop = GROUND_Y - 60, bBottom = GROUND_Y - 44;
        if (overlapX && turkey.top < bBottom && turkey.bottom > bTop) return o;
      } else if (overlapX && overlapY) {
        return o;
      }
      // Cleared cleanly once it passes behind Tom.
      if (sx + o.w < turkey.x && !o.cleared) {
        o.cleared = true;
        return { cleared: o };
      }
    }
    return null;
  }

  collect(turkey, scrollX) {
    const got = [];
    for (const p of this.pickups) {
      if (p.taken) continue;
      const sx = p.x - scrollX;
      if (Math.abs(sx - (turkey.x + 30)) < 46 && Math.abs(p.y - (turkey.y + 30)) < 52) {
        p.taken = true;
        got.push(p);
      }
    }
    return got;
  }

  nearHaystack(scrollX) {
    const tx = 300 + 200; // world x under Tom's beak, roughly
    const wx = scrollX + tx;
    return this.haystacks.find((h) => Math.abs(h.x + h.w / 2 - wx) < 190);
  }
}
