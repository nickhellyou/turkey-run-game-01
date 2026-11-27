// Gobble or Gone — the game itself: state machine, loop, scoring, collisions.
import {
  VIEW_W, VIEW_H, GROUND_Y, GOAL_M, BASE_SPEED, MAX_SPEED,
  SPEED_PER_100M, SCORES, START_LIVES,
} from './config.js';
import { Turkey } from './turkey.js';
import { Farmer } from './farmer.js';
import { World, stageFor } from './world.js';
import { SoundBank } from './audio.js';
import { Input } from './input.js';
import { drawScene } from './render.js';
import { drawHUD, drawTitle, drawEnd, drawPaused } from './hud.js';

export class Game {
  constructor(canvas, seed = 7) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.seed = seed;
    this.sounds = new SoundBank();
    this.input = new Input(canvas);
    this.best = 0;
    try { this.best = Number(localStorage.getItem('gobble-best') || 0) || 0; } catch (e) { /* private mode */ }
    this.reset();
    this.state = 'title';
    this.time = 0;
    this.last = 0;
    this.flash = '';
    this.flashT = 0;
    this.stageAnnounced = '';
  }

  reset() {
    this.turkey = new Turkey();
    this.farmer = new Farmer();
    this.world = new World(this.seed);
    this.scrollX = 0;
    this.distanceM = 0;
    this.score = 0;
    this.scoreF = 0; // fractional distance points; floored into score whole
    this.corn = 0;
    this.feathers = 0;
    this.lives = START_LIVES;
    this.speed = BASE_SPEED;
    this.flash = '';
    this.flashT = 0;
    this.stageAnnounced = '';
    this.endReason = '';
  }

  get stage() { return stageFor(this.distanceM); }

  say(msg, secs = 2.2) {
    this.flash = msg;
    this.flashT = secs;
  }

  start() {
    this.reset();
    this.state = 'playing';
    this.sounds.ensure();
    this.sounds.gobble();
    this.say('RUN, TOM, RUN!');
  }

  end(state, reason) {
    this.state = state;
    this.endReason = reason;
    if (state === 'escaped') {
      this.score += SCORES.escape;
      this.sounds.fanfare();
    } else {
      this.sounds.sad();
    }
    if (this.score > this.best) {
      this.best = this.score;
      try { localStorage.setItem('gobble-best', String(this.best)); } catch (e) { /* private mode */ }
    }
  }

  hitObstacle(o) {
    if (o.cleared) return; // clean-clear bonus, no damage
    o.hit = true;
    this.lives -= 1;
    this.turkey.stumble();
    this.farmer.punish(70);
    this.sounds.hurt();
    this.say(this.lives > 0 ? 'OUCH! The farmer is closing in!' : 'LAST FEATHER!', 1.6);
    if (this.lives <= 0) this.end('caught', 'lives');
  }

  update(dt) {
    if (this.state !== 'playing') return;
    const t = this.turkey;
    // Speed grows with distance; stumble and dash bend it for a moment.
    const target = Math.min(MAX_SPEED, BASE_SPEED + (this.distanceM / 100) * SPEED_PER_100M);
    let speed = target;
    if (t.stumbleT > 0) speed *= 0.55;
    if (t.dashT > 0) speed *= 1.6;
    this.speed = speed;

    const pressed = this.input.drain();
    if (pressed.has('Space') || pressed.has('ArrowUp') || pressed.has('KeyW') || pressed.has('Pointer')) {
      if (t.jump()) this.sounds.jump();
    }
    if (pressed.has('ArrowDown') || pressed.has('KeyS')) t.slide();
    if (pressed.has('ShiftLeft') || pressed.has('ShiftRight')) {
      if (t.dash()) this.sounds.tone(500, 0.12, 'sine', 0.08, 900);
    }
    if (pressed.has('KeyH')) {
      const hay = this.world.nearHaystack(this.scrollX);
      if (hay && t.hide()) {
        this.sounds.tone(300, 0.2, 'sine', 0.07, 200);
        this.say('Hidden in the hay!');
      }
    }
    if (pressed.has('KeyP')) { this.state = 'paused'; return; }
    if (pressed.has('KeyM')) this.sounds.toggleMute();
    if (pressed.has('KeyR')) { this.start(); return; }

    t.update(dt, speed);
    this.scrollX += speed * dt;
    this.distanceM = this.scrollX / 50;
    // Distance points accrue fractionally: a per-frame floor would round
    // every frame's ~0.1-0.4 points down to zero and the score would never move.
    this.scoreF += (speed * dt * SCORES.perMetre) / 50;
    const whole = Math.floor(this.scoreF);
    if (whole > 0) { this.score += whole; this.scoreF -= whole; }

    // Stage announcements.
    if (this.stage.name !== this.stageAnnounced) {
      this.stageAnnounced = this.stage.name;
      if (this.distanceM > 1) {
        this.say(this.stage.name === 'CORNFIELD' ? 'THE CORNFIELD — keep low, keep running!' : 'THE KITCHEN — the oven is HOT!');
        this.sounds.alarm();
      }
    }

    this.world.ensureAhead(this.scrollX);
    this.farmer.update(dt, {
      hiding: t.hiding,
      stumbling: t.stumbleT > 0,
      stageName: this.stage.name,
      distance: this.distanceM,
    });
    if (this.farmer.caught) { this.end('caught', 'farmer'); return; }

    const hit = this.world.hitTest(t, this.scrollX, this.time);
    if (hit) {
      if (hit.cleared) {
        this.score += SCORES.cleanJump;
        this.farmer.reward(10);
      } else {
        this.hitObstacle(hit);
        if (this.state !== 'playing') return;
      }
    }
    for (const p of this.world.collect(t, this.scrollX)) {
      this.sounds.pickup();
      if (p.kind === 'corn') {
        this.corn += 1;
        this.score += SCORES.corn;
        this.farmer.reward(6);
      } else {
        this.feathers += 1;
        this.score += SCORES.feather;
        if (this.lives < START_LIVES) {
          this.lives += 1;
          this.say('Golden feather! +1 life');
        }
      }
    }
    if (this.farmer.gap < 90 && Math.floor(this.time * 2) !== Math.floor((this.time - dt) * 2)) {
      this.sounds.alarm();
    }
    if (this.distanceM >= GOAL_M) { this.end('escaped', 'goal'); return; }
    if (this.flashT > 0) this.flashT -= dt;
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, VIEW_W, VIEW_H);
    if (this.state === 'title') {
      // Title over a quiet farmyard scene.
      drawScene(ctx, this, this.time);
      drawTitle(ctx, this);
      return;
    }
    drawScene(ctx, this, this.time);
    if (this.state === 'playing' || this.state === 'paused') drawHUD(ctx, this);
    if (this.state === 'paused') drawPaused(ctx);
    if (this.state === 'caught' || this.state === 'escaped') drawEnd(ctx, this);
  }

  frame(now) {
    const dt = Math.min(0.05, (now - this.last) / 1000 || 0.016);
    this.last = now;
    // A staged screenshot frame is frozen: no physics, no scroll, no clock,
    // so the frame the screenshot catches is exactly the frame that was staged.
    if (this.staged) { this.render(); return; }
    this.time += dt;
    // Playing drains its own input inside update(); other states drain here.
    if (this.state === 'playing') {
      this.update(dt);
      this.render();
      return;
    }
    const pressed = this.input.drain();
    if (this.state === 'title') {
      if (pressed.has('Enter') || pressed.has('Space') || pressed.has('Pointer')) this.start();
      // Idle drift behind the title so the farm feels alive.
      this.scrollX += 30 * dt;
      this.turkey.update(dt, 30);
    } else if (this.state === 'paused') {
      if (pressed.has('KeyP') || pressed.has('Enter')) this.state = 'playing';
    } else if (this.state === 'caught' || this.state === 'escaped') {
      if (pressed.has('Enter') || pressed.has('KeyR') || pressed.has('Space')) this.start();
    }
    this.render();
  }

  run() {
    const loop = (now) => {
      this.frame(now);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}
