import { ITrack } from "@/audio/audio.types";

export function shuffleTracks(tracks: ITrack[]): ITrack[] {
  const shuffled = [...tracks];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
