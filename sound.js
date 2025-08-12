export class SoundManager {
    constructor() {
        this.sounds = new Map(); // key: name, value: Audio object
        this.isPaused = false;
        
        this.add('playerThruster', './assets/Sounds/playerThruster.wav', {loop: true, volume: 0.1});
        this.add('laserShot', './assets/Sounds/laserShot.wav', {loop: false, volume: 0.2});
        this.add('enemyShips002', './assets/Sounds/enemyShips002.wav', {loop: true, volume: 0.2});
        this.add('enemyShips001', './assets/Sounds/enemyShips001.wav', {loop: true, volume: 0.5});
        this.add('explosion001', './assets/Sounds/explosion001.wav', {loop: false, volume: 0.7});
        this.add('explosion002', './assets/Sounds/explosion002.wav', {loop: false, volume: 0.8});
        // soundManager.add('gameOverMono002', './assets/Sounds/gameOverMono002.wav', {loop: false, volume: 0.8});
    }

    add(name, src, options = {}) {
        const audio = new Audio(src);
        audio.loop = options.loop || false;
        audio.volume = options.volume ?? 1.0;
        this.sounds.set(name, audio);
    }

    play(name, forceRestart = false) {
        if (this.isPaused) return;
        const sound = this.sounds.get(name);
        if (sound) {
            if (forceRestart || sound.paused) {
                sound.currentTime = 0;
                sound.play();
            }
        }
    }

    stop(name) {
        const sound = this.sounds.get(name);
        if (sound && !sound.paused) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    pauseAll() {
        this.isPaused = true;
        for (const sound of this.sounds.values()) {
            if (!sound.paused) sound.pause();
        }
    }

    resumeAll() {
        this.isPaused = false;
        for (const sound of this.sounds.values()) {
            if (sound.loop && sound.currentTime > 0) sound.play();
        }
    }

    setVolume(name, volume) {
        const sound = this.sounds.get(name);
        if (sound) sound.volume = volume;
    }
    
    isPlaying(name) {
        const sound = this.sounds.get(name);
        return sound ? !sound.paused : false;
    }
}