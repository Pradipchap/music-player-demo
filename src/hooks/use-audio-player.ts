import { ITrack } from "@/audio/audio.types";
import { audioManager } from "@/audio/audioManager";
import { useGetCurrentTrack, useGetIsPlaying, usePlayerStore } from "@/store/audioStore";
import { useGetCurrentQueue, useQueueNext, useQueuePrev, useSetQueue } from "@/store/queue-store";
import { shuffleTracks } from "@/utils/shuffleTracks";
import { useCallback } from "react";

export function useAudioPlayer() {
  const set = usePlayerStore(s => s.set);
  const isPlaying = useGetIsPlaying();
  const currentTrack = useGetCurrentTrack();
  const next = useQueueNext();
  const prev = useQueuePrev();
  const setQueue = useSetQueue();
  const currentQueue = useGetCurrentQueue();

  const playTrack = (track: ITrack) => {
    if (track.id === currentTrack?.id) {
      if (isPlaying) {
        pauseTrack();
      } else {
        audioManager.playStreamingAudio();
        set({ isPlaying: true });
      }
      return;
    }

    audioManager.loadStreamingAudio(track);
    const duration = audioManager.playStreamingAudio();
    set({ currentTrack: track, isPlaying: true, duration: duration.duration });
  };

  const closeIsPlaying = useCallback(() => {
    set({ isPlaying: false });
  }, []);

  const pauseTrack = () => {
    audioManager.pause();
    set({ isPlaying: false });
  };

  const resumeTrack = useCallback(() => {
    audioManager.playStreamingAudio();
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
  const handleShuffle = () => {
    setQueue(shuffleTracks(currentQueue));
    handleNext();
  };

  return { playTrack, pauseTrack, togglePlayPause, resumeTrack, handleNext, handlePrev, closeIsPlaying, handleShuffle };
}
