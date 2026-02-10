import { Asset } from "expo-asset";
import { Platform } from "react-native";
import { AudioBufferSourceNode, AudioContext, GainNode } from "react-native-audio-api";
import { ICurrentAudioBuffer, ILoadAudio } from "./audio.types";

class AudioManager {
  private static instance: AudioManager;
  private audioCtx: AudioContext | null = null;
  private audioBuffer: ICurrentAudioBuffer | null = null;
  private nextAudioBuffer: ICurrentAudioBuffer | null = null;
  private audioBufferList: Record<string, ICurrentAudioBuffer> = {};
  private isPlaying = false;
  private gainNode: GainNode | null = null;
  private source?: AudioBufferSourceNode = undefined;
  private nextSource?: AudioBufferSourceNode;

  private isManualStop = false;

  audioEndedListener?: () => void;

  private startTime = 0;

  private resumeTime = 0;

  getAudioContext() {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
      this.gainNode = this.audioCtx.createGain();
    }
    return this.audioCtx;
  }

  private constructor() {
    if (Platform.OS === "web") return;
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

  async loadRemoteAudio({ id, audioUrl }: ILoadAudio) {
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
  async preloadAudio({ id, audioUrl }: ILoadAudio) {
    try {
      if (this.checkIfBufferExists({ id, audioUrl })) {
        return;
      }

      const audioContext = this.getAudioContext();
      if (!audioContext) {
        throw new Error("AudioContext not initialized");
      }

      const asset = Asset.fromModule(audioUrl);
      await asset.downloadAsync();

      if (!asset.localUri) {
        throw new Error("Failed to load audio asset");
      }

      const buffer = await audioContext.decodeAudioData(asset.localUri);

      //storing for future use
      this.audioBufferList[id] = { id, buffer };

      return { id, buffer };
    } catch (error) {
      console.log("error while preloading:", error);
    }
  }

  async preloadNextAudio({ audioUrl, id }: ILoadAudio) {
    const nextData = await this.preloadAudio({ audioUrl, id });
    if (nextData) this.nextAudioBuffer = nextData;
  }
  async scheduleNextAudio() {
    const audioContext = this.getAudioContext();
    //checking if context is suspended
    if (audioContext?.state === "suspended") {
      audioContext.resume();
    }
    this.nextSource = await audioContext?.createBufferSource();
    if (this.nextSource && this.nextAudioBuffer?.buffer) {
      this.nextSource.buffer = this.nextAudioBuffer.buffer;

      if (audioContext?.destination && this.gainNode) {
        this.nextSource.connect(this.gainNode).connect(audioContext?.destination);
        const nextStartTime = audioContext.currentTime + (this.getDuration() - this.getCurrentTime());
        this.nextSource.start(nextStartTime, 0); // this.source.loop = true;
        this.nextSource.onEnded = () => this.onEndCallBack();
      }
    }

    this.isPlaying = true;

    return { duration: this.getDuration() };
  }
  async loadLocalAudio({ id, audioUrl }: ILoadAudio) {
    const savedBuffer = this.checkIfBufferExists({ id, audioUrl });
    if (savedBuffer) {
      this.audioBuffer = savedBuffer;
      this.resumeTime = 0;
      return;
    }
    const loadedData = await this.preloadAudio({ audioUrl, id });
    if (loadedData) {
      this.audioBuffer = loadedData;
      this.resumeTime = 0;
    }
  }

  async play(seekTime?: number) {
    if (this.isPlaying) {
      this.stop();
      this.isPlaying = false;
    }
    if (seekTime) {
      this.resumeTime = seekTime;
    }
    const audioContext = this.getAudioContext();
    //checking if context is suspended
    if (audioContext?.state === "suspended") {
      audioContext.resume();
    }
    this.source = await audioContext?.createBufferSource();
    if (this.source && this.audioBuffer?.buffer) {
      this.source.buffer = this.audioBuffer.buffer;

      if (audioContext?.destination && this.gainNode) {
        this.source.connect(this.gainNode).connect(audioContext?.destination);
        this.startTime = audioContext.currentTime - this.resumeTime;
        this.source.start(0, this.resumeTime);
        this.resumeTime = 0;
      }
      this.source.onEnded = () => this.onEndCallBack();
    }

    this.isPlaying = true;

    return { duration: this.getDuration() };
  }
  onEndCallBack() {
    const audioContext = this.getAudioContext();

    if (this.isManualStop) {
      this.isManualStop = false;
      return;
    }

    //only handover the source and nextAudioBuffer if it exists so that track can repeat itself
    //if nextAudioBuffer doesnot exists
    if (this.nextAudioBuffer && this.source) {
      this.audioBuffer = this.nextAudioBuffer;
      this.source = this.nextSource;
    }
    this.startTime = audioContext.currentTime;
    this.isManualStop = false;
    this.isPlaying = true;
    this.audioEndedListener?.();
  }

  stop() {
    this.isManualStop = true;
    this.source?.stop();
  }
  autoStop() {
    this.isManualStop = false;
    this.source?.stop();
  }

  pause = () => {
    if (!this.isPlaying || !this.audioCtx) return;
    this.isManualStop = true;
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
  async seek(seekTime: number) {
    this.play(seekTime);
  }
  toggleMute() {
    //returning boolean to update mute state based on returned value
    if (this.gainNode) {
      if (this.gainNode.gain.value === 0) {
        this.gainNode.gain.value = 1;
        return false;
      } else {
        this.gainNode.gain.value = 0;
        return true;
      }
    }
  }
  loopCurrentTrack() {
    if (this.source) this.source.loop = true;
  }
}

export const audioManager = AudioManager.getInstance();
