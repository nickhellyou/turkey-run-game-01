// Gobble or Gone — the HUD: score, distance, lives, stage, farmer gap, corn, speed.
import { VIEW_W, GOAL_M } from './config.js';

function panel(ctx, x, y, w, h) {
  ctx.fillStyle = 'rgba(40,20,5,0.72)';
  ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fill();
  ctx.strokeStyle = 'rgba(255,210,62,0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.stroke();
}

export function drawHUD(ctx, game) {
  const g = game;
  ctx.save();
  ctx.textBaseline = 'alphabetic';
  // Top-left: score + corn.
  panel(ctx, 16, 14, 250, 64);
  ctx.fillStyle = '#ffd23e';
  ctx.font = 'bold 24px Georgia, serif';
  ctx.fillText(`SCORE ${g.score}`, 30, 42);
  ctx.fillStyle = '#fff3c4';
  ctx.font = '16px Georgia, serif';
  ctx.fillText(`🌽 ${g.corn}   ◆ ${g.feathers}`, 30, 66);

  // Top-centre: distance + progress bar to freedom.
  panel(ctx, 300, 14, 480, 64);
  ctx.fillStyle = '#fff3c4';
  ctx.font = 'bold 20px Georgia, serif';
  const dist = Math.min(GOAL_M, Math.floor(g.distanceM));
  ctx.fillText(`DISTANCE ${dist} m / ${GOAL_M} m`, 330, 40);
  ctx.fillStyle = '#5a3a1a';
  ctx.fillRect(330, 50, 420, 12);
  ctx.fillStyle = '#7fae4c';
  ctx.fillRect(330, 50, 420 * (dist / GOAL_M), 12);
  ctx.fillStyle = '#ffd23e';
  ctx.font = 'bold 13px Georgia, serif';
  ctx.fillText('🌲 FREEDOM', 560, 72);

  // Top-right: lives + stage.
  panel(ctx, 1014, 14, 250, 64);
  ctx.fillStyle = '#ff6b5e';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillText('♥'.repeat(Math.max(0, g.lives)) + '♡'.repeat(Math.max(0, 3 - g.lives)), 1030, 42);
  ctx.fillStyle = '#fff3c4';
  ctx.font = 'bold 16px Georgia, serif';
  ctx.fillText(g.stage.name, 1030, 66);

  // Farmer proximity bar, bottom-left: how close the farmer is.
  panel(ctx, 16, 640, 340, 56);
  ctx.fillStyle = '#fff3c4';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.fillText('FARMER', 30, 662);
  const danger = 1 - g.farmer.gap / 430;
  ctx.fillStyle = '#5a3a1a';
  ctx.fillRect(30, 670, 280, 12);
  ctx.fillStyle = danger > 0.7 ? '#d23b2e' : danger > 0.4 ? '#f2a541' : '#7fae4c';
  ctx.fillRect(30, 670, 280 * danger, 12);
  ctx.fillStyle = danger > 0.7 ? '#ff8a7a' : '#fff3c4';
  ctx.font = 'bold 13px Georgia, serif';
  ctx.fillText(danger > 0.7 ? 'HE IS RIGHT BEHIND YOU!' : g.farmer.mood, 30, 692);

  // Speed + controls hint, bottom-right.
  panel(ctx, 1014, 640, 250, 56);
  ctx.fillStyle = '#fff3c4';
  ctx.font = '15px Georgia, serif';
  ctx.fillText(`SPEED ${Math.round(g.speed * 0.072)} km/h`, 1030, 664);
  ctx.fillText('SPACE jump · ↓ slide · H hide', 1030, 686);

  // Flash message centre-top.
  if (g.flash && g.flashT > 0) {
    ctx.font = 'bold 30px Georgia, serif';
    ctx.fillStyle = 'rgba(40,20,5,0.75)';
    const w = ctx.measureText(g.flash).width + 36;
    ctx.beginPath(); ctx.roundRect((VIEW_W - w) / 2, 96, w, 46, 10); ctx.fill();
    ctx.fillStyle = '#ffd23e';
    ctx.fillText(g.flash, (VIEW_W - w) / 2 + 18, 128);
  }
  ctx.restore();
}

export function drawTitle(ctx, game) {
  ctx.save();
  ctx.fillStyle = 'rgba(40,20,5,0.55)';
  ctx.fillRect(0, 0, VIEW_W, 720);
  ctx.fillStyle = '#ffd23e';
  ctx.font = 'bold 84px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('GOBBLE OR GONE', VIEW_W / 2, 190);
  ctx.fillStyle = '#fff3c4';
  ctx.font = 'italic 30px Georgia, serif';
  ctx.fillText('A Thanksgiving turkey escape', VIEW_W / 2, 240);
  ctx.font = '20px Georgia, serif';
  ctx.fillText('Thanksgiving is coming. The farmer has the oven hot and the carving knife sharp.', VIEW_W / 2, 300);
  ctx.fillText('Run 1,500 metres through the farmyard, the cornfield and the kitchen — and live.', VIEW_W / 2, 332);
  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillStyle = '#ffd23e';
  ctx.fillText('SPACE / ↑  jump      ↓  slide under branches      H  hide in a haystack', VIEW_W / 2, 400);
  ctx.fillText('SHIFT  dash      P  pause      M  sound', VIEW_W / 2, 436);
  ctx.fillStyle = '#fff3c4';
  ctx.font = '20px Georgia, serif';
  ctx.fillText('Dodge fences, pumpkins and the oven. Grab corn. Do not let the farmer catch you.', VIEW_W / 2, 486);
  ctx.font = 'bold 30px Georgia, serif';
  ctx.fillStyle = '#fff';
  if (Math.floor(game.time * 2) % 2 === 0) ctx.fillText('— PRESS ENTER TO RUN —', VIEW_W / 2, 560);
  if (game.best > 0) {
    ctx.font = '18px Georgia, serif';
    ctx.fillStyle = '#ffd23e';
    ctx.fillText(`Best escape so far: ${game.best} points`, VIEW_W / 2, 606);
  }
  ctx.restore();
}

export function drawEnd(ctx, game) {
  ctx.save();
  ctx.fillStyle = 'rgba(40,20,5,0.62)';
  ctx.fillRect(0, 0, VIEW_W, 720);
  ctx.textAlign = 'center';
  if (game.state === 'escaped') {
    ctx.fillStyle = '#7fae4c';
    ctx.font = 'bold 76px Georgia, serif';
    ctx.fillText('ESCAPED!', VIEW_W / 2, 220);
    ctx.fillStyle = '#fff3c4';
    ctx.font = '26px Georgia, serif';
    ctx.fillText('Tom burst through the forest gate as the oven timer rang.', VIEW_W / 2, 280);
    ctx.fillText('No roast turkey this Thanksgiving. The farmer is still looking.', VIEW_W / 2, 318);
  } else {
    ctx.fillStyle = '#d23b2e';
    ctx.font = 'bold 76px Georgia, serif';
    ctx.fillText('CAUGHT!', VIEW_W / 2, 220);
    ctx.fillStyle = '#fff3c4';
    ctx.font = '26px Georgia, serif';
    ctx.fillText('The farmer got Tom. The oven was already hot.', VIEW_W / 2, 280);
    ctx.fillText('But a turkey that almost escaped can escape next time.', VIEW_W / 2, 318);
  }
  ctx.fillStyle = '#ffd23e';
  ctx.font = 'bold 30px Georgia, serif';
  ctx.fillText(`SCORE ${game.score}    ·    DISTANCE ${Math.floor(game.distanceM)} m    ·    CORN ${game.corn}`, VIEW_W / 2, 400);
  if (game.score >= game.best && game.score > 0) {
    ctx.font = '22px Georgia, serif';
    ctx.fillText('★ New best escape! ★', VIEW_W / 2, 446);
  }
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 28px Georgia, serif';
  if (Math.floor(game.time * 2) % 2 === 0) ctx.fillText('— PRESS ENTER OR R TO RUN AGAIN —', VIEW_W / 2, 520);
  ctx.restore();
}

export function drawPaused(ctx) {
  ctx.save();
  ctx.fillStyle = 'rgba(40,20,5,0.55)';
  ctx.fillRect(0, 0, VIEW_W, 720);
  ctx.fillStyle = '#fff3c4';
  ctx.font = 'bold 54px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('PAUSED', VIEW_W / 2, 360);
  ctx.font = '22px Georgia, serif';
  ctx.fillText('Press P to keep running', VIEW_W / 2, 410);
  ctx.restore();
}
