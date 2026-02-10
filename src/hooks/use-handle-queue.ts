import { audioManager } from "@/audio/audioManager";
import { useGetRepeatMode } from "@/store/audioStore";
import { REPEAT_MODE } from "@/types";
import { useCallback, useEffect } from "react";
import { useAudioPlayer } from "./use-audio-player";
import { useAutoLoadNextTrack } from "./use-auto-load-next-track";

export const useHandleQueue = () => {
  const repeatMode = useGetRepeatMode();
  const { resumeTrack, handleAutoNext, closeIsPlaying } = useAudioPlayer();
  useAutoLoadNextTrack();

  const onAudioEnd = useCallback(() => {
    closeIsPlaying();

    switch (repeatMode) {
      case REPEAT_MODE.TRACK_LOOP:
        resumeTrack();
        break;
      case REPEAT_MODE.QUEUE_LOOP:
        handleAutoNext();
        break;
      default:
        break;
    }
  }, [repeatMode, resumeTrack]);

  useEffect(() => {
    audioManager.audioEndedListener = onAudioEnd;
  }, [onAudioEnd]);
};
