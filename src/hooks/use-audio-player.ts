import { audioManager } from "@/audio/audioManager";
import { usePlayerStore } from "@/store/audioStore";

export function useAudioPlayer() {
  const set = usePlayerStore(s => s.set);
  const a = () => {
    audioManager;
  };
}
