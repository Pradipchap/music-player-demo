import { audioManager } from "@/audio/audioManager";
import { useGetRepeatMode, useSetRepeatMode, useToggleRepeatMode } from "@/store/audioStore";
import { REPEAT_MODE } from "@/types";

export const useHandleRepeatMode = () => {
  const repeatMode = useGetRepeatMode();
  const toggleRepeatMode = useToggleRepeatMode();
  const setRepeatMode = useSetRepeatMode();

  const handleToggleRepeatMode = () => {
    const repeatMode = toggleRepeatMode();
    audioManager.changeRepeatMode(repeatMode);
  };

  const changeRepeatMode = (repeatMode: REPEAT_MODE) => {
    setRepeatMode(repeatMode);
    audioManager.changeRepeatMode(repeatMode);
  };

  return { repeatMode, handleToggleRepeatMode, changeRepeatMode };
};
