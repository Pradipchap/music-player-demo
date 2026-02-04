import { Asset } from "expo-asset";
import { Platform } from "react-native";
import { AudioBufferSourceNode, AudioContext, GainNode, PlaybackNotificationManager, StreamerNode } from "react-native-audio-api";
import { ICurrentAudioBuffer, ITrack } from "./audio.types";

class AudioManager {
  private static instance: AudioManager;
  private audioCtx: AudioContext | null = null;
  private audioBuffer: ICurrentAudioBuffer | null = null;
  private currentStreamingAudio: ITrack | null = null;
  private audioBufferList: Record<string, ICurrentAudioBuffer> = {};
  private isPlaying = false;
  private gainNode: GainNode | null = null;
  private source?: AudioBufferSourceNode = undefined;
  private streamer?: StreamerNode;

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

  checkIfBufferExists({ id }: Omit<ITrack, "filename" | "size" | "thumbnail" | "title" | "artist">) {
    if (this.audioBufferList[id]) {
      return this.audioBufferList[id];
    }
    return null;
  }

  async loadAudio({ id, url }: ITrack) {
    //if already buffer with given id exists, we dont fetch the audio we just reuse the buffer
    const savedBuffer = this.checkIfBufferExists({ id, url });
    if (savedBuffer) {
      this.audioBuffer = savedBuffer;
      this.resumeTime = 0;
      return;
    }
    const audioContext = this.getAudioContext();
    await fetch(url)
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
  async loadLocalAudio({ id, url }: ITrack) {
    //if already buffer with given id exists, we dont fetch the audio we just reuse the buffer
    const savedBuffer = this.checkIfBufferExists({ id, url });
    if (savedBuffer) {
      this.audioBuffer = savedBuffer;
      this.resumeTime = 0;
      return;
    }
    const audioContext = this.getAudioContext();
    await Asset.fromModule(url)
      .downloadAsync()
      .then(asset => {
        if (!asset.localUri) {
          throw new Error("failed to load audio asset");
        }
        return asset.localUri;
      })
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

  loadStreamingAudio(track: ITrack) {
    this.currentStreamingAudio = track;
    this.resumeTime = 0;
  }
  async playStreamingAudio(seekTime?: number) {
    if (this.isPlaying) {
      this.stop();
      this.isPlaying = false;
      if (seekTime) {
        this.resumeTime = seekTime;
      }
    }
    const audioContext = this.getAudioContext();
    //checking if context is suspended
    if (audioContext?.state === "suspended") {
      audioContext.resume();
    }
    this.streamer = audioContext?.createStreamer();
    if (this.streamer && this.currentStreamingAudio) {
      if (audioContext?.destination && this.gainNode) {
        console.log("this.currentStreamingAudio.url", this.currentStreamingAudio?.url);
        const isWorking = this.streamer.initialize(this.currentStreamingAudio.url);
        // if (isWorking) {
        this.streamer.connect(this.gainNode).connect(audioContext?.destination);
        this.startTime = audioContext.currentTime - this.resumeTime;
        this.streamer.start(this.resumeTime);
        await PlaybackNotificationManager.show(this.currentStreamingAudio);
        const x = await PlaybackNotificationManager.isActive();
        console.log("x", x);
        // }
        this.resumeTime = 0;
      }
      this.streamer.onEnded = event => {
        if (this.isManualStop) {
          this.isManualStop = false;
          return;
        }
        this.isManualStop = false;
        this.isPlaying = false;
        this.audioEndedListener?.();
      };
    }

    this.isPlaying = true;
    console.log("this.duration", this.getDuration());

    return { duration: this.getDuration() };
  }

  async play(seekTime?: number) {
    if (this.isPlaying) {
      this.stop();
      this.isPlaying = false;
      if (seekTime) {
        this.resumeTime = seekTime;
      }
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
        this.resumeTime = 0;
        // this.source.loop = true;
      }
      this.source.onEnded = event => {
        console.log("event", event);
        console.log("this.isManualStop", this.isManualStop);
        if (this.isManualStop) {
          this.isManualStop = false;
          return;
        }
        this.isManualStop = false;
        this.isPlaying = false;
        this.audioEndedListener?.();
      };
    }

    this.isPlaying = true;

    return { duration: this.getDuration() };
  }

  stop() {
    this.isManualStop = true;
    this.source?.stop();
    this.streamer?.stop();
  }
  autoStop() {
    this.isManualStop = false;
    this.source?.stop();
    this.streamer?.stop();
  }

  pause = () => {
    if (!this.isPlaying || !this.audioCtx) return;
    this.isManualStop = true;
    this.source?.stop();
    this.streamer?.stop();
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
}

export const audioManager = AudioManager.getInstance();
