class AudioManager {
    static instance = null;
    audio = {};
  
    constructor() {
      if (AudioManager.instance) {
        return AudioManager.instance;
      }
  
      this.audio = {
        background: new Audio('C:\Users\iamve\Downloads\QuizGame\QuizGame\src\music\tv-show-intro-music-160994.mp3'),
        correct: new Audio('/music/correct.mp3'),
        wrong: new Audio('/music/wrong.mp3'),
        questionAppear: new Audio('/music/question-appear.mp3'),
        lifeline: new Audio('/music/lifeline.mp3'),
        roundEnd: new Audio('/music/round-end.mp3'),
      };
  
      // Loop background music
      this.audio.background.loop = true;
  
      AudioManager.instance = this;
    }
  
    static getInstance() {
      if (!AudioManager.instance) {
        AudioManager.instance = new AudioManager();
      }
      return AudioManager.instance;
    }
  
    play(sound) {
      if (this.audio[sound]) {
        this.audio[sound].play();
      } else {
        console.error(`AudioManager: Sound "${sound}" not found.`);
      }
    }
  
    stop(sound) {
      if (this.audio[sound]) {
        this.audio[sound].pause();
        this.audio[sound].currentTime = 0;
      } else {
        console.error(`AudioManager: Sound "${sound}" not found.`);
      }
    }
  
    setVolume(sound, volume) {
      if (this.audio[sound]) {
        this.audio[sound].volume = volume;
      } else {
        console.error(`AudioManager: Sound "${sound}" not found.`);
      }
    }
  }
  
  export default AudioManager.getInstance();
  