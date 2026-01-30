import { audioManager } from "@/audio/audioManager";
import { useGetRepeatMode } from "@/store/audioStore";
import { REPEAT_MODE } from "@/types";
import { useCallback, useEffect } from "react";
import { useAudioPlayer } from "./use-audio-player";

export const useHandleQueue = () => {
  const repeatMode = useGetRepeatMode();
  const { resumeTrack, handleNext, closeIsPlaying } = useAudioPlayer();

  const onAudioEnd = useCallback(() => {
    closeIsPlaying();

    switch (repeatMode) {
      case REPEAT_MODE.TRACK_LOOP:
        resumeTrack();
        break;
      case REPEAT_MODE.QUEUE_LOOP:
        handleNext();
        break;
      default:
        break;
    }
  }, [repeatMode, resumeTrack]);

  useEffect(() => {
    audioManager.audioEndedListener = onAudioEnd;
  }, [onAudioEnd]);
};
