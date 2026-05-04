class IgnitionAudioManager {
  private audioContext: AudioContext | null = null;
  private currentSource: HTMLAudioElement | null = null;
  private fadeInterval: NodeJS.Timeout | null = null;
  private isEnabled: boolean = true;

  // Free audio URLs (placeholder - replace with actual free audio files)
  private phaseTracks = {
    spark: '/audio/spark-phase.mp3',
    target: '/audio/target-phase.mp3', 
    launch: '/audio/launch-phase.mp3'
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.stop();
    }
    return this.isEnabled;
  }

  async playPhase(phase: 'spark' | 'target' | 'launch') {
    if (!this.isEnabled || !this.audioContext) return;

    // Resume audio context if suspended (browser requirement)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Cross-fade to new track
    this.fadeOut(() => {
      const trackUrl = this.phaseTracks[phase];
      
      // Create new audio element
      const audio = new Audio(trackUrl);
      audio.loop = true; // Auto-repeat for all phases
      audio.volume = 0;
      
      audio.play().catch(err => {
        console.log('Audio play failed:', err);
      });

      this.currentSource = audio;
      this.fadeIn();
    });
  }

  stop() {
    this.fadeOut(() => {
      if (this.currentSource) {
        this.currentSource.pause();
        this.currentSource = null;
      }
    });
  }

  private fadeIn() {
    if (!this.currentSource || this.fadeInterval) return;
    
    let volume = 0;
    this.fadeInterval = setInterval(() => {
      volume += 0.05;
      if (this.currentSource) {
        this.currentSource.volume = Math.min(volume, 0.7); // Max 70% volume
      }
      if (volume >= 0.7) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }
    }, 100);
  }

  private fadeOut(callback: () => void) {
    if (!this.currentSource) {
      callback();
      return;
    }

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    let volume = this.currentSource.volume;
    
    const fadeOutInterval = setInterval(() => {
      volume -= 0.1;
      if (this.currentSource) {
        this.currentSource.volume = Math.max(volume, 0);
      }
      if (volume <= 0) {
        clearInterval(fadeOutInterval);
        callback();
      }
    }, 50);
  }

  cleanup() {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

// Singleton instance
export const ignitionAudio = new IgnitionAudioManager();
