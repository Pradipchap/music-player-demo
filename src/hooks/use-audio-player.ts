import { ITrack } from "@/audio/audio.types";
import { audioManager } from "@/audio/audioManager";
import { useGetCurrentTrack, useGetIsPlaying, usePlayerStore } from "@/store/audioStore";

export function useAudioPlayer() {
  const set = usePlayerStore(s => s.set);
  const isPlaying = useGetIsPlaying();
  const currentTrack = useGetCurrentTrack();

  const playTrack = (track: ITrack) => {
    if (track.id === currentTrack?.id) {
      if (isPlaying) {
        pauseTrack();
      } else {
        audioManager.play();
        set({ isPlaying: true });
      }
      return;
    }
    audioManager.loadAudio({ id: track.id, audioUrl: track.url }).then(() => {
      audioManager.play().then(response => {
        set({ currentTrack: track, isPlaying: true, duration: response?.duration });
      });
    });
  };

  const pauseTrack = () => {
    audioManager.pause();
    set({ isPlaying: false });
  };

  return { playTrack, pauseTrack };
}
