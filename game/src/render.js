// Gobble or Gone — all drawing. One job: paint the farm, the kitchen, Tom and the farmer.
import { VIEW_W, VIEW_H, GROUND_Y, STAGES } from './config.js';

function sky(ctx, stage, t) {
  const g = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  g.addColorStop(0, stage.sky[0]);
  g.addColorStop(1, stage.sky[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, VIEW_W, GROUND_Y);
  // Low autumn sun.
  ctx.fillStyle = '#fff3c4';
  ctx.beginPath(); ctx.arc(1080, 110, 54, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,243,196,0.35)';
  ctx.beginPath(); ctx.arc(1080, 110, 84, 0, Math.PI * 2); ctx.fill();
  // Drifting clouds.
  ctx.fillStyle = 'rgba(255,250,235,0.9)';
  for (let i = 0; i < 4; i++) {
    const cx = ((i * 340 - t * 12) % 1400 + 1400) % 1400 - 60;
    const cy = 60 + i * 42;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 70, 22, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 44, cy + 6, 52, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function ground(ctx, stage, scrollX) {
  ctx.fillStyle = stage.ground;
  ctx.fillRect(0, GROUND_Y, VIEW_W, VIEW_H - GROUND_Y);
  ctx.fillStyle = stage.grass;
  ctx.fillRect(0, GROUND_Y, VIEW_W, 14);
  // Tufts of grass scrolling past.
  ctx.strokeStyle = 'rgba(60,40,10,0.5)';
  ctx.lineWidth = 2;
  const off = scrollX % 90;
  for (let x = -off; x < VIEW_W; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x, GROUND_Y + 16); ctx.lineTo(x + 6, GROUND_Y + 4);
    ctx.moveTo(x + 10, GROUND_Y + 16); ctx.lineTo(x + 14, GROUND_Y + 6);
    ctx.stroke();
  }
}

function barn(ctx, sx) {
  if (sx < -260 || sx > VIEW_W + 40) return;
  ctx.fillStyle = '#a83226';
  ctx.fillRect(sx, 330, 220, 270);
  ctx.fillStyle = '#7e2318';
  ctx.beginPath();
  ctx.moveTo(sx - 14, 336); ctx.lineTo(sx + 110, 250); ctx.lineTo(sx + 234, 336);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#f5e6c8'; ctx.lineWidth = 5;
  ctx.strokeRect(sx + 78, 470, 64, 130);
  ctx.beginPath();
  ctx.moveTo(sx + 78, 470); ctx.lineTo(sx + 142, 600);
  ctx.moveTo(sx + 142, 470); ctx.lineTo(sx + 78, 600);
  ctx.stroke();
  ctx.fillStyle = '#f5e6c8';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.fillText('BARN', sx + 74, 420);
}

function tree(ctx, sx, s = 1) {
  if (sx < -120 || sx > VIEW_W + 60) return;
  ctx.fillStyle = '#7a4a22';
  ctx.fillRect(sx, 470 * s + (1 - s) * 130, 18, 130 * s);
  ctx.fillStyle = '#e07b28';
  ctx.beginPath(); ctx.arc(sx + 9, 440 * s + (1 - s) * 130, 62 * s, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f2a541';
  ctx.beginPath(); ctx.arc(sx - 30, 470 * s + (1 - s) * 130, 40 * s, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(sx + 44, 470 * s + (1 - s) * 130, 42 * s, 0, Math.PI * 2); ctx.fill();
}

// Tom the turkey, drawn big and readable: fanned tail, brown body, red wattle.
export function drawTurkey(ctx, t, time) {
  const bob = t.onGround ? Math.sin(t.runPhase) * 3 : 0;
  const x = t.x;
  const y = t.y + bob;
  ctx.save();
  if (t.hiding) ctx.globalAlpha = 0.25;
  // Tail fan.
  ctx.fillStyle = '#8a5a2b';
  for (let i = -2; i <= 2; i++) {
    ctx.save();
    ctx.translate(x + 8, y + 34);
    ctx.rotate(i * 0.38);
    ctx.beginPath(); ctx.ellipse(0, -34, 11, 34, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = '#c98d4b';
  for (let i = -2; i <= 2; i++) {
    ctx.save();
    ctx.translate(x + 8, y + 34);
    ctx.rotate(i * 0.38);
    ctx.beginPath(); ctx.ellipse(0, -30, 6, 26, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  // Body.
  ctx.fillStyle = '#6b4423';
  ctx.beginPath(); ctx.ellipse(x + 30, y + 34, 30, 26, 0, 0, Math.PI * 2); ctx.fill();
  // Wing.
  ctx.fillStyle = '#54341a';
  ctx.beginPath(); ctx.ellipse(x + 26, y + 36, 18, 12, -0.3, 0, Math.PI * 2); ctx.fill();
  // Neck and head.
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(x + 48, y + 2, 12, 30);
  ctx.fillStyle = '#a06a35';
  ctx.beginPath(); ctx.arc(x + 54, y + 2, 13, 0, Math.PI * 2); ctx.fill();
  // Wattle + snood.
  ctx.fillStyle = '#d23b2e';
  ctx.beginPath(); ctx.ellipse(x + 56, y + 16, 5, 9, 0, 0, Math.PI * 2); ctx.fill();
  // Beak.
  ctx.fillStyle = '#f2a541';
  ctx.beginPath(); ctx.moveTo(x + 64, y - 2); ctx.lineTo(x + 80, y + 3); ctx.lineTo(x + 64, y + 8); ctx.closePath(); ctx.fill();
  // Eye: wide, panicked.
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x + 58, y - 2, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.arc(x + 60, y - 2, 2.5, 0, Math.PI * 2); ctx.fill();
  // Legs, running. Short, attached to the body: they must dangle while
  // jumping, never stretch to the ground like stilts.
  ctx.strokeStyle = '#f2a541'; ctx.lineWidth = 4;
  const lp = Math.sin(t.runPhase * 2) * 10;
  ctx.beginPath();
  ctx.moveTo(x + 20, y + 58); ctx.lineTo(x + 14 + lp, y + 72);
  ctx.moveTo(x + 38, y + 58); ctx.lineTo(x + 44 - lp, y + 72);
  ctx.stroke();
  ctx.restore();
}

// The farmer: straw hat, overalls, pitchfork, red-faced and furious.
export function drawFarmer(ctx, farmer, time) {
  const x = farmer.screenX;
  if (x < -160 || x > VIEW_W + 40) return;
  const bob = Math.sin(farmer.runPhase) * 3;
  const y = GROUND_Y - 118 + bob;
  ctx.save();
  // Legs.
  ctx.strokeStyle = '#2e4a7a'; ctx.lineWidth = 9;
  const lp = Math.sin(farmer.runPhase * 2) * 12;
  ctx.beginPath();
  ctx.moveTo(x + 26, y + 78); ctx.lineTo(x + 18 + lp, GROUND_Y + 2);
  ctx.moveTo(x + 44, y + 78); ctx.lineTo(x + 52 - lp, GROUND_Y + 2);
  ctx.stroke();
  // Overalls.
  ctx.fillStyle = '#2e4a7a';
  ctx.fillRect(x + 14, y + 46, 44, 40);
  ctx.fillStyle = '#d23b2e';
  ctx.fillRect(x + 14, y + 46, 44, 12);
  // Shirt arms.
  ctx.strokeStyle = '#e8dcc0'; ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(x + 16, y + 52); ctx.lineTo(x - 6, y + 30);
  ctx.moveTo(x + 56, y + 52); ctx.lineTo(x + 66, y + 74);
  ctx.stroke();
  // Head.
  ctx.fillStyle = '#e8b88a';
  ctx.beginPath(); ctx.arc(x + 36, y + 26, 17, 0, Math.PI * 2); ctx.fill();
  // Moustache + angry brows.
  ctx.fillStyle = '#5a3a1a';
  ctx.fillRect(x + 24, y + 32, 24, 5);
  ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x + 26, y + 16); ctx.lineTo(x + 34, y + 20); ctx.moveTo(x + 46, y + 16); ctx.lineTo(x + 38, y + 20); ctx.stroke();
  // Straw hat.
  ctx.fillStyle = '#e0b64f';
  ctx.beginPath(); ctx.ellipse(x + 36, y + 12, 30, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(x + 22, y - 6, 28, 18);
  // Pitchfork, raised.
  ctx.strokeStyle = '#8a6a3a'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(x - 6, y + 30); ctx.lineTo(x - 26, y - 34); ctx.stroke();
  ctx.strokeStyle = '#c8c8c8'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 26, y - 34); ctx.lineTo(x - 32, y - 52);
  ctx.moveTo(x - 26, y - 34); ctx.lineTo(x - 26, y - 54);
  ctx.moveTo(x - 26, y - 34); ctx.lineTo(x - 20, y - 52);
  ctx.stroke();
  ctx.restore();
}

function drawObstacle(ctx, o, scrollX, time) {
  const sx = o.x - scrollX;
  if (sx < -220 || sx > VIEW_W + 60) return;
  const top = GROUND_Y - o.h;
  ctx.save();
  if (o.kind === 'fence') {
    ctx.fillStyle = '#8a5a2b';
    ctx.fillRect(sx, top, 8, o.h); ctx.fillRect(sx + o.w - 8, top, 8, o.h);
    ctx.fillRect(sx - 6, top + 8, o.w + 12, 8);
    ctx.fillRect(sx - 6, top + 30, o.w + 12, 8);
  } else if (o.kind === 'haybale') {
    ctx.fillStyle = '#e0b64f';
    ctx.beginPath(); ctx.arc(sx + o.w / 2, top + o.h / 2, o.h / 2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#b58a2a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(sx + o.w / 2, top + o.h / 2, o.h / 2 - 8, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx + 4, top + o.h / 2); ctx.lineTo(sx + o.w - 4, top + o.h / 2); ctx.stroke();
  } else if (o.kind === 'pumpkin') {
    ctx.fillStyle = '#e07b28';
    ctx.beginPath(); ctx.ellipse(sx + o.w / 2, top + o.h / 2, o.w / 2, o.h / 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#b85a12'; ctx.lineWidth = 2;
    for (const dx of [-12, 0, 12]) {
      ctx.beginPath(); ctx.ellipse(sx + o.w / 2 + dx, top + o.h / 2, 8, o.h / 2 - 4, 0, 0, Math.PI); ctx.stroke();
    }
    ctx.fillStyle = '#3f7a2a'; ctx.fillRect(sx + o.w / 2 - 3, top - 8, 6, 12);
  } else if (o.kind === 'branch') {
    ctx.fillStyle = '#5a3a1a';
    ctx.fillRect(sx - 6, top - 26, o.w + 12, 16);
    ctx.fillStyle = '#e07b28';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.arc(sx + 8 + i * 18, top - 26, 12, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#7a4a22';
    ctx.fillRect(sx - 4, top - 10, 6, GROUND_Y - top + 10);
    ctx.fillRect(sx + o.w - 2, top - 10, 6, GROUND_Y - top + 10);
  } else if (o.kind === 'scarecrow') {
    ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(sx + 20, top); ctx.lineTo(sx + 20, GROUND_Y); ctx.moveTo(sx, top + 26); ctx.lineTo(sx + 40, top + 26); ctx.stroke();
    ctx.fillStyle = '#e8dcc0'; ctx.fillRect(sx + 2, top + 22, 36, 34);
    ctx.fillStyle = '#f2a541'; ctx.beginPath(); ctx.arc(sx + 20, top - 2, 13, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#8a5a2b'; ctx.fillRect(sx + 4, top - 16, 32, 8);
  } else if (o.kind === 'barrel') {
    ctx.fillStyle = '#8a5a2b';
    ctx.fillRect(sx, top, o.w, o.h);
    ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(sx, top + 12); ctx.lineTo(sx + o.w, top + 12); ctx.moveTo(sx, top + o.h - 12); ctx.lineTo(sx + o.w, top + o.h - 12); ctx.stroke();
  } else if (o.kind === 'oven') {
    // The dreaded oven: glowing mouth, heat shimmer.
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(sx, top, o.w, o.h);
    ctx.fillStyle = '#ff7b2e';
    ctx.beginPath(); ctx.ellipse(sx + o.w / 2, top + o.h - 22, 34, 20, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd23e';
    ctx.beginPath(); ctx.ellipse(sx + o.w / 2, top + o.h - 18, 20, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c8c8c8';
    ctx.fillRect(sx + 8, top + 6, o.w - 16, 10);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 15px Georgia, serif';
    ctx.fillText('HOT!', sx + o.w / 2 - 16, top + 42);
    ctx.fillStyle = 'rgba(255,123,46,0.25)';
    ctx.fillRect(sx - 8, top - 26, o.w + 16, 26);
  } else if (o.kind === 'knife') {
    // Carving knife swinging from a hook.
    const ang = Math.sin(time * 2.2 + o.phase) * 0.55;
    ctx.save();
    ctx.translate(sx + o.w / 2, top - 60);
    ctx.rotate(ang);
    ctx.fillStyle = '#5a3a1a'; ctx.fillRect(-5, 0, 10, 34);
    ctx.fillStyle = '#e8e8e8';
    ctx.beginPath(); ctx.moveTo(-8, 34); ctx.lineTo(8, 34); ctx.lineTo(0, 34 + o.h); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#9a9a9a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 34); ctx.lineTo(0, 34 + o.h - 6); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = '#5a3a1a';
    ctx.beginPath(); ctx.arc(sx + o.w / 2, top - 60, 6, 0, Math.PI * 2); ctx.fill();
  } else if (o.kind === 'pot') {
    ctx.fillStyle = '#4a4a4a';
    ctx.beginPath(); ctx.ellipse(sx + o.w / 2, top + o.h - 10, o.w / 2, 14, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(sx, top + 8, o.w, o.h - 18);
    ctx.fillStyle = '#7a3a1a';
    ctx.beginPath(); ctx.ellipse(sx + o.w / 2, top + 10, o.w / 2 - 6, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.ellipse(sx + o.w / 2 - 8, top - 8, 12, 6, 0, 0, Math.PI * 2); ctx.fill();
  } else if (o.kind === 'puddle') {
    ctx.fillStyle = '#8a5a1a';
    ctx.beginPath(); ctx.ellipse(sx + o.w / 2, GROUND_Y - 4, o.w / 2, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c98d2e';
    ctx.beginPath(); ctx.ellipse(sx + o.w / 2, GROUND_Y - 5, o.w / 3, 5, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawPickup(ctx, p, scrollX, time) {
  const sx = p.x - scrollX;
  if (sx < -40 || sx > VIEW_W + 20) return;
  const bob = Math.sin(time * 3 + p.x) * 5;
  if (p.kind === 'corn') {
    ctx.save();
    ctx.translate(sx, p.y + bob);
    ctx.rotate(0.5);
    ctx.fillStyle = '#ffd23e';
    ctx.beginPath(); ctx.ellipse(0, 0, 10, 20, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#d9a400'; ctx.lineWidth = 1.5;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath(); ctx.moveTo(i * 4, -16); ctx.lineTo(i * 4, 16); ctx.stroke();
    }
    ctx.fillStyle = '#3f7a2a';
    ctx.beginPath(); ctx.ellipse(0, 22, 12, 6, 0, 0, Math.PI); ctx.fill();
    ctx.restore();
  } else {
    ctx.save();
    ctx.translate(sx, p.y + bob);
    ctx.fillStyle = '#ffd23e';
    ctx.beginPath(); ctx.ellipse(0, 0, 8, 22, 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff3c4';
    ctx.beginPath(); ctx.ellipse(0, -4, 4, 14, 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

function drawHaystack(ctx, h, scrollX) {
  const sx = h.x - scrollX;
  if (sx < -160 || sx > VIEW_W + 40) return;
  ctx.fillStyle = '#e0b64f';
  ctx.beginPath(); ctx.moveTo(sx, GROUND_Y); ctx.quadraticCurveTo(sx + h.w / 2, GROUND_Y - h.h - 30, sx + h.w, GROUND_Y); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#b58a2a'; ctx.lineWidth = 2;
  for (let i = 1; i < 4; i++) {
    ctx.beginPath(); ctx.moveTo(sx + (h.w * i) / 4, GROUND_Y - 8); ctx.quadraticCurveTo(sx + (h.w * i) / 4, GROUND_Y - h.h / 2, sx + (h.w * i) / 4, GROUND_Y - h.h + 10); ctx.stroke();
  }
}

// The forest gate at the goal: freedom.
export function drawGate(ctx, scrollX) {
  const sx = 1500 * 50 - scrollX;
  if (sx < -200 || sx > VIEW_W + 100) return;
  ctx.fillStyle = '#3f7a2a';
  ctx.fillRect(sx, 380, 16, 220);
  ctx.fillRect(sx + 130, 380, 16, 220);
  ctx.fillStyle = '#7a4a22';
  ctx.fillRect(sx - 10, 372, 166, 18);
  ctx.fillStyle = '#2e5a1a';
  ctx.beginPath(); ctx.arc(sx + 8, 360, 46, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(sx + 138, 360, 46, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff3c4';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillText('FREEDOM', sx + 18, 366);
}

export function drawScene(ctx, game, time) {
  const stage = game.stage;
  sky(ctx, stage, time);
  // Parallax scenery: barn and trees anchored in world space.
  barn(ctx, 2600 - game.scrollX);
  tree(ctx, 1200 - game.scrollX * 0.9, 1);
  tree(ctx, 3400 - game.scrollX * 0.9, 0.8);
  tree(ctx, 5200 - game.scrollX * 0.9, 1.1);
  ground(ctx, stage, game.scrollX);
  for (const h of game.world.haystacks) drawHaystack(ctx, h, game.scrollX);
  drawGate(ctx, game.scrollX);
  for (const p of game.world.pickups) drawPickup(ctx, p, game.scrollX, time);
  for (const o of game.world.obstacles) drawObstacle(ctx, o, game.scrollX, time);
  drawFarmer(ctx, game.farmer, time);
  drawTurkey(ctx, game.turkey, time);
}
