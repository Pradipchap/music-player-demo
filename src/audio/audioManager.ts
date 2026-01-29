import { AudioBufferSourceNode, AudioContext, GainNode } from "react-native-audio-api";
import { ICurrentAudioBuffer, ILoadAudio } from "./audio.types";

class AudioManager {
  private static instance: AudioManager;
  private audioCtx: AudioContext | null = null;
  private audioBuffer: ICurrentAudioBuffer | null = null;
  private audioBufferList: Record<string, ICurrentAudioBuffer> = {};
  private isPlaying = false;
  private gainNode: GainNode | null = null;
  private source?: AudioBufferSourceNode = undefined;
  private queue: ILoadAudio[] | null = null;

  private startTime = 0;
  private resumeTime = 0;

  getAudioContext() {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
      this.gainNode = this.audioCtx.createGain();
      return;
    }
    return this.audioCtx;
  }

  private constructor() {
    this.getAudioContext();
  }

  static getInstance() {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  checkIfBufferExists({ id }: ILoadAudio) {
    if (this.audioBufferList[id]) {
      return this.audioBufferList[id];
    }
    return null;
  }

  async loadAudio({ id, audioUrl }: ILoadAudio) {
    //if already buffer with given id exists, we dont fetch the audio we just reuse the buffer
    const savedBuffer = this.checkIfBufferExists({ id, audioUrl });
    if (savedBuffer) {
      this.audioBuffer = savedBuffer;
      this.resumeTime = 0;
      return;
    }
    const audioContext = this.getAudioContext();
    await fetch(audioUrl)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext?.decodeAudioData(arrayBuffer))
      .then(buffer => {
        if (buffer) {
          this.audioBuffer = { id, buffer };
          //saving current buffer to the list to mock caching
          this.resumeTime = 0;
          this.audioBufferList[id] = { id, buffer };
        }
      });
  }

  async play() {
    console.log("ispl", this.isPlaying);

    if (this.isPlaying) {
      this.stop();
      this.isPlaying = false;
      this.resumeTime = 0;
    }
    const audioContext = this.getAudioContext();
    //checking if context is suspended
    if (audioContext?.state === "suspended") {
      console.log("suspended");
      audioContext.resume();
    }
    this.source = await audioContext?.createBufferSource();
    if (this.source && this.audioBuffer?.buffer) {
      this.source.buffer = this.audioBuffer.buffer;

      if (audioContext?.destination && this.gainNode) {
        this.source.connect(this.gainNode).connect(audioContext?.destination);
        this.startTime = audioContext.currentTime - this.resumeTime;
        this.source.start(0, this.resumeTime);
      }
    }
    this.isPlaying = true;

    return { duration: this.getDuration() };
  }

  stop() {
    this.source?.stop();
  }

  pause = () => {
    if (!this.isPlaying || !this.audioCtx) return;
    this.source?.stop();
    this.resumeTime = this.audioCtx.currentTime - this.startTime;
    this.isPlaying = false;
  };

  volumeUp = () => {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.min(this.gainNode.gain.value + 0.1, 1);
    }
  };

  volumeDown = () => {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(this.gainNode.gain.value - 0.1, 0);
    }
  };

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  getCurrentTime() {
    if (!this.audioCtx || !this.audioBuffer) return 0;

    if (this.isPlaying) {
      const time = this.audioCtx.currentTime - this.startTime;
      return Math.min(time, this.audioBuffer.buffer.duration);
    }
    return this.resumeTime;
  }

  getDuration() {
    return this.audioBuffer?.buffer.duration || 0;
  }

  closeAudioContext() {
    this.audioCtx?.close();
  }

  getState() {
    return {
      isPlaying: this.isPlaying
    };
  }
}

export const audioManager = AudioManager.getInstance();
