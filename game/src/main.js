// Gobble or Gone — boot. One job: wire the canvas to the game and start the loop.
import { VIEW_W, VIEW_H } from './config.js';
import { Game } from './game.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
canvas.width = VIEW_W;
canvas.height = VIEW_H;

const params = new URLSearchParams(window.location.search);
const seed = Number(params.get('seed') || 7);
const game = new Game(canvas, seed);
window.__game = game;

const staged = applyShot(game, params);
if (staged) {
  // Render one staged frame at once so a screenshot never catches a blank canvas.
  game.time = 0.4;
  game.render();
  window.__shotReady = true;
}
game.run();
