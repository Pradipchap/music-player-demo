import { audioManager } from "@/audio/audioManager";
import { useGetCurrentTrack, useSetPlayer } from "@/store/audioStore";
import { useEffect, useState } from "react";

export const useSeekMusic = () => {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const currentTrack = useGetCurrentTrack();
  const setPlayer = useSetPlayer();

  useEffect(() => {
    const timer = setInterval(() => {
      const duration = audioManager.getDuration();
      const currentTime = audioManager.getCurrentTime();
      setCurrentTime(currentTime);
      setDuration(duration);
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, [currentTrack]);

  const onSeek = (time: number) => {
    audioManager.seek(time);
    setPlayer({ isPlaying: true });
  };

  return { duration, currentTime, currentTrack, onSeek };
};
