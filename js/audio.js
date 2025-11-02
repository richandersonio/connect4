// Audio Module - Music and sound effects management
import { MUSIC_TRACKS } from './config.js';

/**
 * Audio manager for game sounds and music
 */
export class AudioManager {
  constructor() {
    this.currentTrack = 0;
    this.isMusicPlaying = false;
    this.backgroundMusic = null;
    this.dropSound = null;
    this.winSound = null;
    this.initAudio();
  }

  /**
   * Initialize audio elements
   */
  initAudio() {
    // Background music
    this.backgroundMusic = document.getElementById('background-music');
    
    // Drop sound effect
    this.dropSound = new Audio();
    this.dropSound.src =
      'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDAwMD//////////////////8AAAAxMQUFBQUFBQUFBQUFBQUFBgYGBgYGBgYGBgYGBgYGBgf///////////8AAAA5TEFNRTMuMTAwAZYAAAAAAAAAABSAJAJAQgAAgAAAAbBsy+zGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxLEAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

    // Win sound effect
    this.winSound = new Audio();
    this.winSound.src =
      'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAEAAADpAAICAgICAgICAgQEBAQEBAQEBAYGBgYGBgYGBggICAgICAgICgsLCwsLCwsLDQ0NDQ0NDQ0NAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxLEAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

    this.setupEventListeners();
  }

  /**
   * Setup audio event listeners
   */
  setupEventListeners() {
    // Error handling
    this.backgroundMusic.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      console.error('Current src:', this.backgroundMusic.currentSrc);
      this.showMusicError();
    });

    // Success handling
    this.backgroundMusic.addEventListener('loadeddata', () => {
      console.log('Audio loaded successfully:', this.backgroundMusic.currentSrc);
      this.hideMusicError();
    });
  }

  /**
   * Play drop sound effect
   */
  playDropSound() {
    this.dropSound.currentTime = 0;
    this.dropSound.play().catch(err => console.warn('Drop sound failed:', err));
  }

  /**
   * Play win sound effect
   */
  playWinSound() {
    this.winSound.currentTime = 0;
    this.winSound.play().catch(err => console.warn('Win sound failed:', err));
  }

  /**
   * Change and play music track
   */
  changeTrack(trackIndex) {
    if (trackIndex < 0 || trackIndex >= MUSIC_TRACKS.length) {
      return;
    }

    this.currentTrack = trackIndex;
    console.log('Changed to track:', MUSIC_TRACKS[this.currentTrack]);

    try {
      this.backgroundMusic.src = MUSIC_TRACKS[this.currentTrack];
      this.backgroundMusic.load();

      const playPromise = this.backgroundMusic.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Track changed and playing successfully');
            this.isMusicPlaying = true;
            this.hideMusicError();
          })
          .catch((error) => {
            console.error('Track change playback failed:', error);
            this.isMusicPlaying = false;
            this.showBrowserBlockedError();
          });
      }
    } catch (e) {
      console.error('Error changing track:', e);
      this.showMusicError();
    }
  }

  /**
   * Show music error message
   */
  showMusicError() {
    const musicDebug = document.getElementById('music-debug');
    if (musicDebug) {
      musicDebug.style.display = 'block';
      musicDebug.innerHTML = `
        <strong>Music files not found</strong><br>
        Unable to load music files from:<br>
        ${MUSIC_TRACKS.map(track => `- ${track}`).join('<br>')}
      `;
    }
  }

  /**
   * Show browser blocked autoplay error
   */
  showBrowserBlockedError() {
    const musicDebug = document.getElementById('music-debug');
    if (musicDebug) {
      musicDebug.style.display = 'block';
      musicDebug.innerHTML = `
        <strong>Browser blocked autoplay</strong><br>
        Due to browser restrictions, music can only play after a user interaction.<br>
        Please try selecting a track again to play music.
      `;
    }
  }

  /**
   * Hide music error message
   */
  hideMusicError() {
    const musicDebug = document.getElementById('music-debug');
    if (musicDebug) {
      musicDebug.style.display = 'none';
    }
  }

  /**
   * Setup music controls UI
   */
  setupMusicControls() {
    const musicTrackSelect = document.getElementById('music-track-select');
    
    // Track selection
    musicTrackSelect.addEventListener('change', (e) => {
      const trackIndex = parseInt(e.target.value);
      this.changeTrack(trackIndex);
    });

    // Keyboard shortcuts (1-5)
    document.addEventListener('keydown', (event) => {
      const key = event.key;
      if (key >= '1' && key <= '5') {
        const trackIndex = parseInt(key) - 1;
        this.changeTrack(trackIndex);
        musicTrackSelect.value = trackIndex.toString();
      }
    });
  }
}
