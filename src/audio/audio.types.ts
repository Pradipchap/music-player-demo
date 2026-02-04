import { AudioBuffer } from "react-native-audio-api";

export interface ITrack {
  id: string;
  title: string;
  filename: string;
  size: number;
  artist: string;
  url: string;
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
