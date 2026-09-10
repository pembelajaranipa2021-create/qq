// Web Audio API Sound Generator for Kid-Friendly Game FX

class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private bgmInterval: any = null;
  private isBgmPlaying: boolean = false;
  public musicEnabled: boolean = true;

  startVillageBGM() {
    if (this.isBgmPlaying || !this.musicEnabled) return;
    this.init();
    if (!this.ctx) return;
    this.isBgmPlaying = true;

    // Peaceful Sundanese/Nusantara Pentatonic Village Melody Loop (Slendro-inspired)
    // Warm, tranquil chime and bamboo flute tone
    const melody = [
      { note: 392.00, dur: 0.9 }, // G4
      { note: 523.25, dur: 0.9 }, // C5
      { note: 587.33, dur: 0.45 }, // D5
      { note: 659.25, dur: 1.2 }, // E5
      { note: 523.25, dur: 0.9 }, // C5
      { note: 440.00, dur: 0.9 }, // A4
      { note: 392.00, dur: 1.8 }, // G4
      { note: 587.33, dur: 0.9 }, // D5
      { note: 659.25, dur: 0.9 }, // E5
      { note: 783.99, dur: 0.9 }, // G5
      { note: 659.25, dur: 0.9 }, // E5
      { note: 523.25, dur: 1.8 }, // C5
    ];

    let noteIdx = 0;
    const playNextNote = () => {
      if (!this.isBgmPlaying || !this.musicEnabled || !this.ctx) return;
      const current = melody[noteIdx % melody.length];
      noteIdx++;

      try {
        const now = this.ctx.currentTime;
        // Main melody oscillator (bamboo flute / soft chime tone)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(current.note, now);

        // Warm soft envelope
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + current.dur * 0.95);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + current.dur);

        // Sub harmonic bass tone for warmth on every 4th note
        if (noteIdx % 4 === 1) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          bassOsc.type = 'triangle';
          bassOsc.frequency.setValueAtTime(current.note / 2, now);

          bassGain.gain.setValueAtTime(0.001, now);
          bassGain.gain.linearRampToValueAtTime(0.03, now + 0.2);
          bassGain.gain.exponentialRampToValueAtTime(0.001, now + current.dur * 1.5);

          bassOsc.connect(bassGain);
          bassGain.connect(this.ctx.destination);

          bassOsc.start(now);
          bassOsc.stop(now + current.dur * 1.5);
        }
      } catch (e) {
        console.warn('Audio BGM error', e);
      }

      this.bgmInterval = setTimeout(playNextNote, current.dur * 1000);
    };

    playNextNote();
  }

  stopVillageBGM() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearTimeout(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled) {
      this.startVillageBGM();
    } else {
      this.stopVillageBGM();
    }
    return this.musicEnabled;
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playCorrect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    // Happy 3-note arpeggio (C5, E5, G5, C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.2, this.ctx!.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + idx * 0.08);
      osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.25);
    });
  }

  playWrong() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    // Low buzzer
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(130, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playLifeline() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    // Magic chime
    const freqs = [880, 1108.73, 1318.51, 1760];
    freqs.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx!.currentTime + i * 0.06);

      gain.gain.setValueAtTime(0.15, this.ctx!.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + i * 0.06 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + i * 0.06);
      osc.stop(this.ctx!.currentTime + i * 0.06 + 0.3);
    });
  }

  playVictoryFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const sequence = [
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.15 },
      { f: 1046.50, d: 0.4 },
      { f: 880.00, d: 0.2 },
      { f: 1046.50, d: 0.6 }
    ];

    let t = this.ctx.currentTime;
    sequence.forEach((item) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(item.f, t);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + item.d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t);
      osc.stop(t + item.d);
      t += item.d + 0.05;
    });
  }
}

export const soundEffects = new SoundFX();
