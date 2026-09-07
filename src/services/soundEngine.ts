// Procedural Web Audio API Sound Engine (Zero external MP3 dependencies)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientNodes: Map<string, { gainNode: GainNode; stop: () => void }> = new Map();
  private masterGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- SHORT TACTILE SFX ---

  // Bubble Pop Sound
  playBubblePop(pitchMod: number = 1.0) {
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startFreq = (500 + Math.random() * 200) * pitchMod;
      const endFreq = 120 * pitchMod;
      const duration = 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio pop error:', e);
    }
  }

  // Fire / Burn Crackle Burst SFX
  playBurnSfx() {
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      // Noise burst with lowpass sweep
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.8));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 1.8);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 2.0);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
      noise.stop(this.ctx.currentTime + 2.0);
    } catch (e) {
      console.warn('Burn SFX error:', e);
    }
  }

  // Shredder SFX
  playShredSfx() {
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      const bufferSize = this.ctx.sampleRate * 1.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1500, this.ctx.currentTime);
      filter.Q.setValueAtTime(3, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 1.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
      noise.stop(this.ctx.currentTime + 1.5);
    } catch (e) {
      console.warn('Shred SFX error:', e);
    }
  }

  // Singing Bowl / Zen Chime
  playZenChime() {
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      const freqs = [432, 864, 1296];
      const gains = [0.3, 0.1, 0.04];
      const duration = 4.0;

      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        gain.gain.setValueAtTime(gains[idx], this.ctx!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start();
        osc.stop(this.ctx!.currentTime + duration);
      });
    } catch (e) {
      console.warn('Chime error:', e);
    }
  }

  // --- PROCEDURAL AMBIENT SOUND GENERATORS ---

  setMasterVolume(vol: number) {
    this.initCtx();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  setAmbientVolume(trackId: string, volume: number) {
    const active = this.ambientNodes.get(trackId);
    if (active && this.ctx) {
      active.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  stopAmbientTrack(trackId: string) {
    const active = this.ambientNodes.get(trackId);
    if (active) {
      active.stop();
      this.ambientNodes.delete(trackId);
    }
  }

  stopAllAmbient() {
    this.ambientNodes.forEach((track) => track.stop());
    this.ambientNodes.clear();
  }

  startAmbientTrack(trackId: string, initialVolume: number = 0.5) {
    if (this.ambientNodes.has(trackId)) {
      this.setAmbientVolume(trackId, initialVolume);
      return;
    }

    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(initialVolume, this.ctx.currentTime);
    gainNode.connect(this.masterGain);

    let stopFn = () => {};

    switch (trackId) {
      case 'rain': {
        // Pink noise with 2nd order lowpass
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
          b6 = white * 0.115926;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

        source.connect(filter);
        filter.connect(gainNode);
        source.start();

        stopFn = () => {
          try {
            source.stop();
            source.disconnect();
          } catch {}
        };
        break;
      }

      case 'fire': {
        // Campfire crackle loop with randomized pulse timers
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const r = Math.random();
          // Occasional pop/crackle impulse
          output[i] = r > 0.996 ? (Math.random() * 2 - 1) * 0.9 : (Math.random() * 2 - 1) * 0.03;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, this.ctx.currentTime);
        filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

        source.connect(filter);
        filter.connect(gainNode);
        source.start();

        stopFn = () => {
          try {
            source.stop();
            source.disconnect();
          } catch {}
        };
        break;
      }

      case 'wind': {
        // Slow drifting bandpass noise
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.15;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(320, this.ctx.currentTime);
        filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

        // LFO for swaying breeze
        const lfo = this.ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        source.connect(filter);
        filter.connect(gainNode);

        source.start();
        lfo.start();

        stopFn = () => {
          try {
            source.stop();
            lfo.stop();
            source.disconnect();
          } catch {}
        };
        break;
      }

      case 'brownNoise': {
        // Deep calming brown noise
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 1.8;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        source.connect(gainNode);
        source.start();

        stopFn = () => {
          try {
            source.stop();
            source.disconnect();
          } catch {}
        };
        break;
      }

      case 'lofi': {
        // Gentle warm harmonic chord drone (Cmaj7 / Am9 soothing frequencies)
        const freqs = [130.81, 164.81, 196.0, 246.94]; // C3, E3, G3, B3
        const oscs: OscillatorNode[] = [];

        freqs.forEach((f) => {
          const osc = this.ctx!.createOscillator();
          const filter = this.ctx!.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, this.ctx!.currentTime);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, this.ctx!.currentTime);

          osc.connect(filter);
          filter.connect(gainNode);
          osc.start();
          oscs.push(osc);
        });

        stopFn = () => {
          oscs.forEach((o) => {
            try {
              o.stop();
              o.disconnect();
            } catch {}
          });
        };
        break;
      }

      case 'bowl': {
        // Tibetan singing bowl drone with gentle pulsating modulation
        const osc = this.ctx.createOscillator();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(216, this.ctx.currentTime); // 432 Hz subharmonic

        lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(2, this.ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        osc.connect(gainNode);
        osc.start();
        lfo.start();

        stopFn = () => {
          try {
            osc.stop();
            lfo.stop();
            osc.disconnect();
          } catch {}
        };
        break;
      }

      default:
        break;
    }

    this.ambientNodes.set(trackId, { gainNode, stop: stopFn });
  }
}

export const soundEngine = new SoundEngine();
