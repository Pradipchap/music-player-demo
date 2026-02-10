import { audioManager } from "@/audio/audioManager";
import { useGetCurrentTrack, useGetRepeatMode } from "@/store/audioStore";
import { useGetNextQueueTrack } from "@/store/queue-store";
import { REPEAT_MODE } from "@/types";
import { useCallback, useEffect, useRef } from "react";

export const useAutoLoadNextTrack = () => {
  const repeatMode = useGetRepeatMode();
  const currentTrack = useGetCurrentTrack();
  const getNextTrack = useGetNextQueueTrack();
  const hasPreloaded = useRef<string | null>(null);

  //preload songs next in queue
  const handlePreload = useCallback(() => {
    const duration = audioManager.getDuration();
    const currentTime = audioManager.getCurrentTime();

    if (!duration || !getNextTrack?.id || hasPreloaded.current === getNextTrack.id) {
      return;
    }

    const percentageOfPlaying = 100 * (currentTime / duration);

    if (repeatMode === REPEAT_MODE.QUEUE_LOOP && percentageOfPlaying > 80) {
      hasPreloaded.current = getNextTrack.id;
      audioManager.preloadNextAudio({ id: getNextTrack.id, audioUrl: getNextTrack.url }).then(() => {
        audioManager.scheduleNextAudio();
      });
    }
  }, [repeatMode, getNextTrack]);

  useEffect(() => {
    hasPreloaded.current = null;
    const timer = setInterval(handlePreload, 1000);

    return () => clearInterval(timer);
  }, [currentTrack?.id, handlePreload]);
};
