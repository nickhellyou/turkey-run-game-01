// Gobble or Gone — the farmer: chases, searches when Tom hides, corners in the kitchen.
// He is a gap behind Tom, measured in pixels. A stumble shrinks it; clean play widens it.
import { FARMER_GAP_START, FARMER_GAP_MAX } from './config.js';

export class Farmer {
  constructor() {
    this.reset();
  }

  reset() {
    this.gap = FARMER_GAP_START;
    this.mode = 'chase'; // chase | search | corner
    this.mood = 'Give it up, Tom!';
    this.runPhase = 0;
  }

  // dt seconds; ctx carries what Tom just did.
  update(dt, { hiding, stumbling, stageName, distance }) {
    if (hiding) {
      this.mode = 'search';
      this.mood = 'Where did that bird go?!';
      this.gap = Math.min(FARMER_GAP_MAX, this.gap + 26 * dt);
    } else if (stageName === 'THE KITCHEN') {
      this.mode = 'corner';
      this.mood = 'Into the oven with you!';
      this.gap = Math.max(30, this.gap - 6 * dt);
    } else {
      this.mode = 'chase';
      this.mood = distance > 900 ? 'You can run, but you cannot hide!' : 'Come back here, Tom!';
      this.gap = Math.max(30, this.gap - 2 * dt);
    }
    if (stumbling) this.gap = Math.max(30, this.gap - 30 * dt);
    this.runPhase += dt * 9;
  }

  // Tom did something good: the farmer falls back a little.
  reward(px) { this.gap = Math.min(FARMER_GAP_MAX, this.gap + px); }
  // Tom got hit: the farmer lunges closer.
  punish(px) { this.gap = Math.max(0, this.gap - px); }

  get caught() { return this.gap <= 0; }
  // Screen x of the farmer, behind Tom.
  get screenX() { return 300 - this.gap - 70; }
}
