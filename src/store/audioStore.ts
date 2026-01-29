import { ITrack } from "@/audio/audio.types";
import { create } from "zustand";

interface PlayerState {
  isPlaying: boolean;
  position: number;
  duration: number;
  currentTrack: ITrack | null;
  set: (v: Partial<PlayerState>) => void;
}

export const usePlayerStore = create<PlayerState>(set => ({
  isPlaying: false,
  position: 0,
  duration: 0,
  currentTrack: null,
  set: v => set(v)
}));

export const useSetPlayer = () => usePlayerStore(state => state.set);
export const useGetCurrentTrack = () => usePlayerStore(state => state.currentTrack);
export const useGetIsPlaying = () => usePlayerStore(state => state.isPlaying);
export const useGetPosition = () => usePlayerStore(state => state.position);
export const useGetDuration = () => usePlayerStore(state => state.duration);
