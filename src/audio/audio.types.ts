import { AudioBuffer } from "react-native-audio-api";

export interface ITrack {
  id: string;
  url: string;
  title?: string;
  artist?: string;
  thumbnail: string;
}
export interface ILoadAudio {
  id: string;
  audioUrl: string;
}
export interface ICurrentAudioBuffer {
  id: string;
  buffer: AudioBuffer;
}
