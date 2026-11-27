// Gobble or Gone — Tom the turkey: physics, jumping, sliding, hiding, dashing.
import { GRAVITY, GROUND_Y, JUMP_V, TURKEY_X } from './config.js';

export class Turkey {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = TURKEY_X;
    this.y = GROUND_Y - 64;
    this.vy = 0;
    this.onGround = true;
    this.sliding = false;
    this.slideT = 0;
    this.hiding = false;
    this.hideT = 0;
    this.dashT = 0;
    this.stumbleT = 0;
    this.runPhase = 0;
    this.dead = false;
  }

  get w() { return 62; }
  get h() { return this.sliding ? 34 : 64; }
  get top() { return this.y; }
  get bottom() { return this.y + this.h; }

  jump() {
    if (!this.onGround || this.hiding) return false;
    this.vy = JUMP_V;
    this.onGround = false;
    this.sliding = false;
    return true;
  }

  slide() {
    if (!this.onGround || this.hiding) return;
    this.sliding = true;
    this.slideT = 0.55;
  }

  hide() {
    if (!this.onGround || this.hiding) return false;
    this.hiding = true;
    this.hideT = 1.6;
    this.sliding = false;
    return true;
  }

  dash() {
    if (this.dashT > 0 || this.hiding) return false;
    this.dashT = 0.45;
    return true;
  }

  stumble() {
    this.stumbleT = 0.8;
    this.sliding = false;
    this.hiding = false;
  }

  update(dt, speed) {
    if (this.dead) return;
    if (!this.onGround) {
      this.vy += GRAVITY * dt;
      this.y += this.vy * dt;
      if (this.y >= GROUND_Y - this.h) {
        this.y = GROUND_Y - this.h;
        this.vy = 0;
        this.onGround = true;
      }
    }
    if (this.slideT > 0) {
      this.slideT -= dt;
      if (this.slideT <= 0) this.sliding = false;
    }
    if (this.hideT > 0) {
      this.hideT -= dt;
      if (this.hideT <= 0) this.hiding = false;
    }
    if (this.dashT > 0) this.dashT -= dt;
    if (this.stumbleT > 0) this.stumbleT -= dt;
    this.runPhase += dt * (speed / 40);
  }
}
