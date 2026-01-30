import { ITrack } from "@/audio/audio.types";
import { REPEAT_MODE } from "@/types";
import { create } from "zustand";

interface QueueState {
  queue: ITrack[];
  index: number;
  setQueue: (tracks: ITrack[], startIndex?: number) => void;
  next: () => ITrack | null;
  prev: () => ITrack | null;
  insertNext: (track: ITrack) => void;
}

export const useQueueStore = create<QueueState>((set, get) => ({
  queue: [],
  index: 0,
  repeatMode: REPEAT_MODE.OFF,

  setQueue: (tracks, startIndex = 0) =>
    set({
      queue: tracks,
      index: Math.max(0, Math.min(startIndex, tracks.length - 1))
    }),

  next: (): ITrack | null => {
    const { index, queue } = get();

    if (!queue.length) return null;
    let nextIndex = index;

    if (index + 1 < queue.length) {
      nextIndex = index + 1;
    } else {
      nextIndex = 0;
    }
    set({ index: nextIndex });
    return queue[nextIndex] ?? null;
  },

  prev: (): ITrack | null => {
    const { index, queue } = get();
    const prevIndex = index > 0 ? index - 1 : index;

    set({ index: prevIndex });
    return queue[prevIndex] ?? null;
  },

  insertNext: track =>
    set(s => {
      const q = [...s.queue];
      q.splice(s.index + 1, 0, track);
      return { queue: q };
    })
}));

export const useQueueNext = () => useQueueStore(state => state.next);
export const useQueuePrev = () => useQueueStore(state => state.prev);
export const useInsertNext = () => useQueueStore(state => state.insertNext);
export const useGetCurrentQueue = () => useQueueStore(state => state.queue);
export const useSetQueue = () => useQueueStore(state => state.setQueue);
export const useGetCurrentQueueTrack = () => useQueueStore(state => state.queue[state.index]);
