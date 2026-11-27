// Gobble or Gone — all sound is synthesised with WebAudio. No audio files.
export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      } catch (e) { this.ctx = null; }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  tone(freq, dur, type = 'sine', vol = 0.12, slideTo = null, when = 0) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  gobble() {
    // A turkey's gobble: four quick falling blips.
    [520, 430, 360, 300].forEach((f, i) => this.tone(f, 0.09, 'square', 0.05, f * 0.7, i * 0.07));
  }

  jump() { this.tone(280, 0.16, 'sine', 0.1, 560); }
  pickup() { this.tone(880, 0.09, 'sine', 0.09, 1320); this.tone(1320, 0.12, 'sine', 0.06, 1760, 0.07); }
  hurt() { this.tone(220, 0.25, 'sawtooth', 0.1, 90); }
  alarm() { this.tone(660, 0.12, 'square', 0.05, 660); this.tone(520, 0.12, 'square', 0.05, 520, 0.13); }
  fanfare() {
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.22, 'triangle', 0.1, null, i * 0.12));
  }
  sad() {
    [392, 370, 349, 311].forEach((f, i) => this.tone(f, 0.3, 'triangle', 0.09, f * 0.94, i * 0.22));
  }
}
