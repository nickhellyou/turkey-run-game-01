// Gobble or Gone — screenshot staging. ?shot=cover|title|farm|escaped&seed=7
// puts the game into a fixed, photogenic state so screenshots are reproducible.
import { GROUND_Y } from './config.js';
import { stageFor } from './world.js';

export function applyShot(game, params) {
  const shot = params.get('shot');
  if (!shot) return false;
  const seed = Number(params.get('seed') || 7);
  game.seed = seed;

  if (shot === 'title') {
    game.reset();
    game.state = 'title';
    game.farmer.gap = 180; // farmer fully in frame, lurking at the left edge
  } else if (shot === 'farm') {
    game.reset();
    game.state = 'playing';
    game.distanceM = 180;
    game.scrollX = 180 * 50;
    game.score = 640;
    game.corn = 9;
    game.turkey.y = GROUND_Y - 64 - 190; // mid-jump over a fence
    game.turkey.vy = 220;
    game.turkey.onGround = false;
    game.farmer.gap = 180; // farmer fully in frame, not cut off at the edge
    game.say('');
    game.flashT = 0;
    // Force a fence right ahead of Tom so the jump reads as clearing it.
    game.world.obstacles.unshift(
      { kind: 'fence', x: game.scrollX + 430, w: 26, h: 58, hit: false, cleared: false },
    );
  } else if (shot === 'cover') {
    game.reset();
    game.state = 'playing';
    game.distanceM = 1180;
    game.scrollX = 1180 * 50;
    game.score = 2450;
    game.corn = 21;
    game.feathers = 1;
    game.lives = 2;
    game.turkey.y = GROUND_Y - 64 - 150; // mid-jump over the oven
    game.turkey.vy = 180;
    game.turkey.onGround = false;
    game.farmer.gap = 95; // farmer right behind Tom
    game.farmer.mode = 'corner';
    game.farmer.mood = 'Into the oven with you!';
    game.say('THE KITCHEN — the oven is HOT!');
    game.flashT = 99;
    game.stageAnnounced = 'THE KITCHEN';
    // Force an oven + a swinging knife right in front of Tom.
    game.world.obstacles.unshift(
      { kind: 'oven', x: game.scrollX + 430, w: 120, h: 86, hit: false, cleared: false, phase: 0 },
      { kind: 'knife', x: game.scrollX + 620, w: 30, h: 96, swinging: true, hit: false, cleared: false, phase: 0.9 },
    );
    game.world.pickups.unshift(
      { kind: 'corn', x: game.scrollX + 520, y: GROUND_Y - 96, taken: false },
      { kind: 'corn', x: game.scrollX + 566, y: GROUND_Y - 96, taken: false },
    );
  } else if (shot === 'escaped') {
    game.reset();
    game.state = 'escaped';
    game.distanceM = 1500;
    game.score = 3120;
    game.corn = 26;
    game.feathers = 2;
    game.lives = 2;
    game.best = 3120;
    game.farmer.gap = 180; // farmer fully in frame, still looking
  }
  // Keep the staged frame frozen for the screenshot: no auto-advance.
  game.staged = true;
  return true;
}
