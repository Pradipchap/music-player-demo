import { ITrack } from "@/audio/audio.types";
import { audioManager } from "@/audio/audioManager";
import { useGetCurrentTrack, useGetIsPlaying, usePlayerStore } from "@/store/audioStore";
import { useQueueNext, useQueuePrev } from "@/store/queue-store";
import { useCallback } from "react";

export function useAudioPlayer() {
  const set = usePlayerStore(s => s.set);
  const isPlaying = useGetIsPlaying();
  const currentTrack = useGetCurrentTrack();
  const next = useQueueNext();
  const prev = useQueuePrev();

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

  const resumeTrack = useCallback(() => {
    audioManager.play();
    set({ isPlaying: true });
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioManager.pause();
      set({ isPlaying: false });
    } else {
      resumeTrack();
    }
  };

  const handleNext = () => {
    const nextTrack = next();

    if (nextTrack) {
      playTrack(nextTrack);
    }
  };

  const handlePrev = () => {
    const prevTrack = prev();
    if (prevTrack) {
      playTrack(prevTrack);
    }
  };

  return { playTrack, pauseTrack, togglePlayPause, resumeTrack, handleNext, handlePrev };
}
