// Gobble or Gone — keyboard + mouse input. One job: turn presses into intents.
export class Input {
  constructor(canvas, onAction) {
    this.onAction = onAction;
    this.keys = new Set();
    this.pressed = new Set();
    window.addEventListener('keydown', (e) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
      if (!e.repeat) this.pressed.add(e.code);
      this.keys.add(e.code);
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    canvas.addEventListener('pointerdown', () => this.pressed.add('Pointer'));
    window.addEventListener('blur', () => { this.keys.clear(); });
  }

  // Consume edge-triggered presses since the last frame; returns the set.
  drain() {
    const out = new Set(this.pressed);
    this.pressed.clear();
    return out;
  }

  down(code) { return this.keys.has(code); }
}
